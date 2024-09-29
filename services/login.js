const { By, until } = require('selenium-webdriver');
const wait = require('./../utils/wait');

/**
 * Logs into the Warframe Market website using a Selenium WebDriver.
 * 
 * This function automates the login process by navigating to the login page,
 * accepting the terms, filling in the login form with username and password,
 * and finally submitting the form. It uses explicit waits to ensure elements 
 * are visible and enabled before interacting with them, ensuring the login 
 *  
 * @param {WebDriver} driver - The Selenium WebDriver instance used to automate the browser actions.
 * @param {auth} loginInfo - auth is an object with username and password.
 * 
 * @throws {Error} If login fails or any expected elements do not load within the specified time.
 */
async function login(driver, auth){
    try{
        await driver.get(`https://warframe.market/auth/signin`)
        await wait(1000)

        //Accept terms
        const termsButtons = await driver.wait(until.elementIsVisible(driver.findElement(By.css('button.btn__primary--L8HyD'))), 10000);
        await driver.wait(until.elementIsEnabled(termsButtons), 10000);
        await termsButtons.click();
        await wait(200)
        
        // Fill Login Form
        const usernameField = await driver.findElement(By.id('LoginEmail'), 10000);
        await usernameField.sendKeys(auth.username);
        
        const passwordField = await driver.findElement(By.id('LoginPassword'), 10000);
        await passwordField.sendKeys(auth.password);
        
        // Log-In
        const logButton = await driver.wait(until.elementIsVisible(driver.findElement(By.css('.login__actions button'))), 10000);
        await driver.wait(until.elementIsEnabled(logButton), 10000);
        await logButton.click();
        
        await wait(3000)
        
        console.log('LOGIN 🆗')
    }catch(e){
        console.log(e)
        throw new Error("Unnable To Log in")
    }
}

module.exports = login