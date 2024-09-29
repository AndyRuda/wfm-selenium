const { Builder, Browser, By } = require('selenium-webdriver');
const login = require('./services/login');
const wait = require('./utils/wait');
const { auth } = require('./utils/const');
const { writeFile, deleteFile } = require('./utils/file');

(async function runSelenium() {
    console.log('Starting 🚀....')
    let driver = await new Builder().forBrowser(Browser.CHROME).build()

    const currentDate = new Date().toJSON().replaceAll(':', '-').slice(0, -5)
    const backupLocation = `./data/clean_backup/${currentDate}.json`;

    try {
        await login(driver, auth )
        await driver.get(`https://warframe.market/profile/ghandy01`)
        await wait(2000)
        console.log('Cleaning 🧹 ....')
        let mod = await driver.findElement(By.css('.link.smartLink--bBcyL.item-link--WSJnq'), 10000).catch( e => false)
        let previousMod = '';
        while (mod){
            const modName = await mod.findElement(By.css('span')).getText()
            // Ensure item was deleted
            if(modName !== previousMod){
              writeFile(backupLocation, { name : modName })
            }
            
            const deleteButton = await driver.findElement(By.css('.btn.btn__light--c9XBJ.red--sqBa6.order__trash'), 10000)
            await deleteButton.click()
            await wait(500)
            
            const conFirmButton = await driver.findElement(By.css('.btn.btn__light--c9XBJ.red--sqBa6.dimmed--pln9I.ml-3'), 10000)
            await conFirmButton.click()
            await wait(500)
            
            
            await wait(2000)
            mod = await driver.findElement(By.css('.link.smartLink--bBcyL.item-link--WSJnq'), 10000).catch( e => false)
            previousMod = modName; 
        }

  }catch(e){
    console.log(e)
    console.log('Something went wrong 💩 happens')
  } finally {
      deleteFile('/data/already_placed/orders.json')
      console.log('Finished 😎 ....')
      await driver.quit()
    }
})()