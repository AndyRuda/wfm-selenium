const { Builder, Browser, By, until } = require('selenium-webdriver');
const wait = require('./utils/wait');
const login = require('./services/login');
const Cache = require('./services/cache');
const { params, auth } = require('./utils/const');
const { writeFile } = require('./utils/file');
const { getProductsList, calculatePrice, optimizeList } = require('./services/products');
// TODO ADD CHECK FOR ITEM LIMIT

(async function runSelenium() {
  const cache = new Cache(Cache.keys.products)


  // Obj to report actions at the end
  const uploadProductStatus = {
    listed: new Set(),
    remain: new Set(),
    failed: []
  };
  
  // All products to be listed
  const products =  getProductsList(params.syndicateSells);
  // List of all prodcuts with its prices based on cache and best list of item to sell based on WFM limit (max 100 items)
  console.log(cache.data)
  if(cache.data.length < 1 ){
    throw new Error('No Data In cache run "node fetch_items.js" ')
  }
  const productsWithCachedPrice = [...products].map( e => ({ name: e, price: cache.data[e]}) ).filter(e => e.price)
  const productsWithPrice = optimizeList( productsWithCachedPrice )
  
  let driver = await new Builder().forBrowser(Browser.CHROME).build()

  try {
    await login(driver, auth)
    for (let { name, price } of productsWithPrice ) {
        await driver.get(`https://warframe.market/items/${name}`)
        await wait(2000)
        // If item dosent have a price finds it and update price
        price = calculatePrice(price)

        // Open order modal
        const button = await driver.wait(until.elementLocated(By.css('.widget-order__button')), 10000);
        button.click()
        await wait(1000)

        // Select the 'Price per unit' field and enter a value
        const pricePerUnit = await driver.findElement(By.id('orderItemPrice'));
        await pricePerUnit.clear();
        await pricePerUnit.sendKeys(price);  // Filled with price obtained
        await wait(600)

        // Select the 'Quantity' field and enter a value
        const quantity = await driver.findElement(By.id('orderQuantity'));
        await quantity.clear();
        await quantity.sendKeys('1');
        await wait(400)

        // Select the 'Rank' field and enter a value 
        await driver.findElement(By.id('orderRank'))
            .then(async (rank)=>{
                await rank.clear();
                await rank.sendKeys('0');
                await wait(500)
            })
            .catch(()=>{}/* No special handling since not all products has this field */ )
        
        // Post Item
        const postButton = await driver.wait(until.elementIsVisible(driver.findElement(By.css('.widget-modal__actions--bs5BU button'))), 10000);
        await driver.wait(until.elementIsEnabled(postButton), 10000);
        await postButton.click();
        await wait(500)

        // In case there is a fail add to failed and continue
        const errorText = await driver.findElement(By.css('.form-errors--dehp8 li')).getText().then( (e) => e ).catch(()=> false)
        if(errorText ){
            uploadProductStatus.failed.push({ [name]: errorText })
            continue;
        }  
        uploadProductStatus.listed.add(name) 
        await Promise.all([writeFile('./data/already_placed/orders.json', { name : name }) , wait(5000) ])
    }

}
finally {
    uploadProductStatus.remain  = [...products.difference(uploadProductStatus.listed)]
    uploadProductStatus.total_remain  = uploadProductStatus.remain.length
    uploadProductStatus.listed  = [...uploadProductStatus.listed]
    uploadProductStatus.tota_listed = uploadProductStatus.listed.length
    console.log('Product Reports', uploadProductStatus)
    await driver.quit()
  }
})()