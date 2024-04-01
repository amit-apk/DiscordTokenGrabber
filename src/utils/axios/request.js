const axios = require("axios");
const https = require("https");

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

module.exports = { 
    instance 
};
