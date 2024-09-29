# Selenium Automation for Warframe Market

This project is a set of Selenium-based automation scripts designed to interact with the [Warframe Market](https://warframe.market). It automates tasks like posting items for sale based on price conditions and cleaning up the user profile by deleting existing items.

## Features

1. **Automated Product Posting:**
   - Fetches a list of products from Warframe Market.
   - Retrieves the current market price for each product.
   - Posts the product for sale if it meets specified price conditions.
   - Skips products with prices outside the defined range.

2. **Profile Cleanup:**
   - Fetches and deletes listed items from your Warframe Market profile.
   - Creates a JSON backup of deleted items.

## Requirements

- **Node.js** (v22.0.0 or above)
- **Google Chrome** (latest version)
- **Selenium WebDriver** for Chrome
- A valid **Warframe Market** account for login

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/selenium-warframe-market.git
    cd selenium-warframe-market
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up WebDriver:
   - Download and install **ChromeDriver** that matches your Chrome browser version: [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
   - Add the `chromedriver` binary to your system's `PATH` or place it in the project directory.

4. Set up your credentials:
   - Create a `utils/const.js` file with the following structure:
     ```js
     module.exports = {
        auth: {
            username: 'your_username',
            password: 'your_password'
        },
        params: {
            syndicateSells: ['product_1', 'product_2', 'product_3']  // List your product names here
        }
     }
     ```

## Usage

### 1. **Automated Product Posting**

This script logs into your Warframe Market account, fetches the market prices for a list of products, and posts those that meet specified conditions.

Run the script with the following command:

```bash
node postProducts.js
