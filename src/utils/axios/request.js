let axios = require("axios");
let https = require("https");

const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})


module.exports.instance = instance;
