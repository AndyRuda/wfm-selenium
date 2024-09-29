const { Builder, Browser, By } = require('selenium-webdriver');
const wait = require('./utils/wait');
const Cache = require('./services/cache');
const { params } = require('./utils/const');
const { getProductsList } = require('./services/products');

(async function runSelenium() {
  // Cache limited by week of year
  const cache = new Cache(Cache.keys.products)
  // Obj to report actions at the end
  const uploadProductStatus = {
      failed: []
    };
    
    // All products to be updated
    const products =  getProductsList(params.syndicateSells);
    
    // Obtain all product price and save on cache
    let driver = await new Builder().forBrowser(Browser.CHROME).build()
    
    try {
        cache.cleanCache()
    for (let name of products ) {
        await driver.get(`https://warframe.market/items/${name}`)
        await wait(4000)

        // Get Item market price
        const rawData = await driver.findElement(By.css('[data-test-id="virtuoso-item-list"]'), 10000).catch(e => false)
        if(!rawData) {
            uploadProductStatus.failed.push({[name]: "Nobody is selling this item" })
            continue; 
        }

        price = await rawData.findElement(By.css('[data-index="1"] [class="order-row__price--hn3HU"] b'), 10000).catch(e => false)
        if(!price) {
            uploadProductStatus.failed.push({[name]: "Nobody is selling this item" })
            continue; 
        }
        
        price = await price.getText()
        cache.saveCache({ [name] : price})

    }

}
finally {
    console.log('Product Reports', uploadProductStatus)
    await driver.quit()
  }
})()