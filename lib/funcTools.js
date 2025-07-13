import Tag from "../models/Tag.js";
import path from "node:path";
import { unlink, access } from "node:fs/promises";
// import { Types } from "mongoose";
import { fileURLToPath } from "node:url";

export const getTagID = (tagFromDB, name = "") => {
  return tagFromDB.find((t) => t.name === name)?._id;
};

/**
 * Convierte una cadena en array de etiquetas.
 * @param {string|string[]} input
 * @returns {string[]} Lista de etiquetas
 */
export function parseToArray(input) {
  if (Array.isArray(input)) return input;
  if (typeof input === "string")
    return input.split(",").map((tag) => tag.trim());
  return [];
}

export const QueryFilter = () => {
  const query = {};
  const fields = ["name", "min", "max", "tags"];
  let reqQuery = {};
  return {
    getQuery() {
      return query;
    },
    oneFilter(field, funCondition, opFilter) {
      if (funCondition()) {
        query[field] = opFilter();
      }
    },
    filterUser(userID) {
      query.owner = userID;
    },
    filterName(name) {
      const regex = new RegExp(`^${name}`, "i");
      query.name = { $regex: regex };
    },
    filterMin(min) {
      query.price = { $gte: Number(min) };
    },
    filterMin(max) {
      query.price = { $lte: Number(max) };
    },
    filterMinMax(min, max) {
      query.price = { $gte: Number(min), $lte: Number(max) };
    },
    filterByTags(tagsArray, tagsDB) {
      query.tags = { $in: tagsArray.map((t_name) => getTagID(tagsDB, t_name)) };
    },
    setreqQuery(value) {
      reqQuery = value;
    },
    async buildQuery() {
      for (const field of fields) {
        if (field === "name" && field in reqQuery) {
          this.filterName(reqQuery.name);
        } else if (field === "min") {
          continue;
        } else if (field === "max" && field in reqQuery) {
          this.filterMinMax(reqQuery.min, reqQuery.max);
        } else if (field === "tags" && field in reqQuery) {
          const tagsArray =
            typeof reqQuery.tags === "string"
              ? [reqQuery.tags]
              : reqQuery.tags ?? [];
          const tagsDB = await Tag.find();
          this.filterByTags(tagsArray, tagsDB);
        }
      }
    },
  };
};

class ErrorValidations {
  constructor(errors) {
    this.errors = errors;
  }
  add(error) {
    this.errors.push(error);
  }
  array() {
    return errors;
  }
  throw() {
    const err = new Error("Validation failed");
    err.status = 400;
    err.array = () => this.errors;
    throw err;
  }
  get len() {
    return this.errors.length;
  }
}

export function validationWithFile(req, validations, newError) {
  const errors = validations.array();
  const errorValidations = new ErrorValidations(errors);
  if (!req.file) {
    errorValidations.add(newError);
  }
  if (errorValidations.len > 0) {
    errorValidations.throw();
  }
}

export function validationWithoutFile(validations) {
  if (!validations.isEmpty()) {
    validations.throw();
  }
}

/**
 * Convierte una cadena en array de etiquetas.
 * @param {string} path
 */
export async function deleteFileIfExist(pathFile) {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  try {
    const fullPath = path.join(dirname, "..", "public", pathFile);
    await access(fullPath);
    await unlink(fullPath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      err.message = `${pathFile} file not deleted`;
      throw err;
    }
  }
}

/**
 * Genera un objeto de filtros válido para consultas de Product
 * @param {Object} query - req.query o cualquier fuente de filtros
 * @param {string} owner - userId
 * @returns {Promise<Object>} filtros normalizados
 */
export async function buildProductFilters(query = {}, owner) {
  const filters = { ...query };

  if (filters.page) {
    delete filters.page;
  }
  // console.log(filters.tags,'taaaaaaaaaags')
  if(filters.tags){
    const tagsDB = await Tag.find();
    filters.tags = {
      $in: parseToArray(filters.tags).map(tag => getTagID(tagsDB,tag).toString())
    }    
  }else{
    delete filters.tags;
  }


  if (filters.name) {
    //   console.log(filters.name,'nameeeeeeeeeeeee');
    filters.name = {
      $regex: `^${filters.name}`,
      $options: "i",
    };
  } else {
    delete filters.name;
  }
  //   filters.owner = Types.ObjectId.createFromHexString(owner);
  filters.owner = owner;

  if (filters.min || filters.max) {
    filters.price = {};
    if (filters.min) filters.price.$gte = parseFloat(filters.min);
    if (filters.max) filters.price.$lte = parseFloat(filters.max);
    delete filters.min;
    delete filters.max;
  }

  // console.log('taaaags',filters);
  return filters;
}

/**
 *
 * @param {string} pathImage
 */
export async function deleteImageThumbnailProduct(pathImage) {
  const mainImagePath = path.join("products", pathImage);
  await deleteFileIfExist(mainImagePath);
//   console.log("Immagen principal borrada");

  const ext = path.extname(pathImage);
  const thumbnailName = pathImage.replace(ext, `_thumbnail${ext}`);
  const thumbnailPath = path.join("products", thumbnailName);
  await deleteFileIfExist(thumbnailPath);
//   console.log("Immagen thumbnail borrada");
}


