const path = require('path');
const moment = require('moment');
const { readData, writeFile, deleteFile } = require('./../utils/file')

// Simple Cache for prices 
class Cache{
    #location
    #shortLocation
    static keys = {
        // Cache limited by week of year
        products: `products-${moment().format('W')}`
    }
    constructor(region){
        this.#location =  path.join(process.cwd(), 'data', 'cache', `${region}.json`);
        this.#shortLocation = path.join('data', 'cache', `${region}.json`);
        this.data = this.#getCache();
    }
    
    #getCache(){
        const data = readData(this.#location)
        return data ?? {}
    }

    saveCache(obj){
        writeFile(this.#location, obj, false)
        this.data = this.#getCache();
    }
    cleanCache(){
        try{
            deleteFile(this.#shortLocation)
            this.data = {};
            console.log('Cache cleaned 🖨')
        }catch(error){
            console.log('Nothing to clean in cache 🦺')
        }
    }
}


module.exports = Cache