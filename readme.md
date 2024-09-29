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
   - Create a `.env` file with the following structure:
     ```
      USERNAME=example@example.com
      PASSWORD=example
     ```

5. Set up products:
   - Update `wts.json` and  `syndicate_mods.json` with all products you want to sell

## Usage

### 1. **Automated Product Posting**

This script logs into your Warframe Market account, fetches the market prices for a list of products, and posts those that meet specified conditions.

Run the script with the following command:

```bash
node place_new_order.js
```

### 2. **Automated Clean Products Posted**

This script logs into your Warframe Market account, and cleans all producs you are selling and save on a backup file

```bash
node clean_user_sales.js
```


### 2. **Automated Fetch Products Prices (Required)**

Fetch prices of all products you want to sell and save on cache

```bash
node fetch_items.js
```