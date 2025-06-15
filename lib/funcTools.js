import Tag from "../models/Tag.js";

export const getTagID = (tagFromDB, name = '') => {
    return tagFromDB.find(t => t.name === name)?._id
}
export const QueryFilter = () => {
    const query = {}
    const fields = ['name', 'min', 'max', 'tags'];
    let reqQuery = {}
    return {
        getQuery() {
            return query
        },
        oneFilter(field, funCondition, opFilter) {
            if (funCondition()) {
                query[field] = opFilter();
            }
        },
        filterUser(userID){
            query.owner = userID
        },
        filterName(name) {
            const regex = new RegExp(`^${name}`, "i");
            query.name = { $regex: regex }
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
            query.tags = { $in: tagsArray.map(t_name => getTagID(tagsDB, t_name)) }
        },
        setreqQuery(value){
            reqQuery = value
        },
        async buildQuery(){
            for (const field of fields) {
                if(field === 'name' && field in reqQuery){
                    this.filterName(reqQuery.name)
                }
                else if(field === 'min'){                    
                    continue
                }
                else if(field === 'max' && field in reqQuery){
                    this.filterMinMax(reqQuery.min,reqQuery.max)
                }
                else if(field === 'tags' && field in reqQuery){
                    const tagsArray = (typeof reqQuery.tags === 'string')
                        ? [reqQuery.tags]
                        : reqQuery.tags
                        ?? [];
                    const tagsDB = await Tag.find();
                    this.filterByTags(tagsArray,tagsDB)
                }

            }
        }
    }

}
