require('dotenv').config()

module.exports = Object.freeze({
    auth : {
        username: process.env.WFM_USERNAME,
        password: process.env.WFM_PASSWORD
    },
    params: {
        syndicateSells: true
    }
    
})