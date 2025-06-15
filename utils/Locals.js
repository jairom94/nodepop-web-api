class Model {
    constructor(){
        if(new.target === Model){
            throw new Error('Can´t be instance')
        }
    }
    clear() {
        throw new Error('Must be implement in the subclass')
    }
}

class Email extends Model {
    constructor(email,owner){
        this.email = email;
        this.owner = owner;
    }
    clear(){
        this.email = ''
        this.owner = null
    }
}
class ErrorInput extends Model{
    constructor(field,type){
        this.field = field;
        this.type = type;
    }
    clear(){
        this.email = ''
        this.owner = null
    }
}


/*
const min = document.querySelector('.min');
const line = document.querySelector('.line');
let isDragging = false;
let startX;
let startLeft;
min.addEventListener('mousedown',(e)=>{
  isDragging=true;
  startX = e.clientX;
  startLeft = parseInt(window.getComputedStyle(min).left) || 0;
  e.preventDefault();
});
document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  // Calcular nueva posición X
  const deltaX = e.clientX - startX;
  let nuevaX = startLeft + deltaX;

  // Limitar movimiento dentro del contenedor
  const maxX = line.offsetWidth - min.offsetWidth;
  nuevaX = Math.max(0, Math.min(nuevaX, maxX));

  // Actualizar posición
  min.style.left = `${nuevaX}px`;
  const valueMin = document.querySelector('.value-min');
  valueMin.innerText = nuevaX;
  console.log(nuevaX);
});

// Evento al soltar el mouse
document.addEventListener("mouseup", () => {
  isDragging = false;
});
// console.log(line.clientWidth)
line.addEventListener('click',(e)=>{
   const {left} = e.target.getBoundingClientRect();
  // console.log(e.clientX-left)
  const posNew = e.clientX - left;
  min.style.left = `${posNew}px`;
  const valueMin = document.querySelector('.value-min');
  valueMin.innerText = Math.round(posNew);
})
*/


/*
router.get('/user/:userID/filter', async (req, res, next) => {
    try {
        const { name, min, max, tags } = req.query;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const items = 6;
        const tagsArray = (typeof tags === 'string')
            ? [tags]
            : tags
            ?? [];
        const regex = new RegExp(`^${name}`, "i");
        const user = req.session.userID;
        const tagsDB = await Tag.find();
        const query = { owner: user }
        if (name) {
            query.name = { $regex: regex };
        }
        if (min && max) {
            query.price = { $gte: Number(min), $lte: Number(max) };
            console.log(query.price)
        }
        if (tagsArray.length > 0) {
            query.tags = { $in: tagsArray.map(t_name => funcTools.getTagID(tagsDB, t_name)) }
        }
        const ProductsFilter = await Product.find(query)
            .skip((page - 1) * items)
            .limit(items)
            .populate('tags', 'name -_id');

        const [minMax] = await Product.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(user)
                }
            },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            }
        ]);
        res.locals.rangePrice = minMax
            ? { min: minMax.minPrice, max: minMax.maxPrice }
            : { min: 0, max: 100 }

        const totalDocs = await Product.find(query).countDocuments();
        const totalPages = Math.ceil(totalDocs / items)
        res.locals.pagination = {
            products: ProductsFilter,
            page,
            totalPages,
            totalItems: totalDocs,
        }
        // res.locals.products = ProductsFilter;
        res.locals.tags = tagsDB;
        res.render('products')
    } catch (error) {
        next(error)
    }
})
*/