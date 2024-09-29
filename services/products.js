const { readData } = require('./../utils/file')

const getProductsList = (syndicateMods = false) => {
    const wts = readData('./data/wts.json').map( e => e.name)
    const listSyndicateMods= readData('./data/syndicate_mods.json').map( e => e.name)
    const alreadyPlacedOrders = new Set(readData('./data/already_placed/orders.json').map( e => e.name))

    const products = new Set(wts)

    if(syndicateMods){
        listSyndicateMods.forEach(products.add, products)
    }
    return alreadyPlacedOrders.size > 0? products.difference(alreadyPlacedOrders) : products
}

const optimizeList = (list, floor = 1, max = 100) => {
    if(floor === 1){
        //Sort ASC
        list = list.sort( (a, b) => Number(a.price) - Number(b.price ) )
        floor = list[0].price
        return optimizeList(list, floor, max)
    }
    // Filter new List based on Floor price
    const listFiltered = list.filter( e =>  Number(e.price) >= Number(floor) )
    // If list still to long re-filter
    if(listFiltered.length > 100){
        const { price : newFloor} = listFiltered.find( e => e.price >  floor)
        return optimizeList(listFiltered, newFloor, max)
    }
    // if list have free space add some random items from previus list
    if(listFiltered.length < 100){
        const listOutSideFloor = list.filter( e =>  Number(e.price) < Number(floor) )
        let emptySpaces = 100 - listFiltered.length
        while (emptySpaces > 0 && listOutSideFloor.length > 0 ){
            const randonIndex =  Math.floor( Math.random() * ( listOutSideFloor.length -1) )
            listFiltered.push( list[randonIndex] )
            listOutSideFloor.slice(randonIndex, 1)
            emptySpaces--
        }
    }
    return listFiltered

}

const calculatePrice = (initialPrice, percentageToIncrease) => {
    return initialPrice + ( initialPrice * percentageToIncrease/100 )
}



module.exports = { getProductsList, calculatePrice, optimizeList }