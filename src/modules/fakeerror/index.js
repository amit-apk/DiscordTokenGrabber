const child_process = require('child_process');
const path          = require('path');
const fs            = require('fs');
const os            = require('os');

function randString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        str += charset[randomIndex];
    }
    return str;
}

module.exports = () => {
    try {
        const tempDir = os.tmpdir();
        const vbsPath = path.join(tempDir, `${randString(10)}.vbs`);
        const vbsContent = `
            Set objShell = WScript.CreateObject("WScript.Shell")
            MsgBox "Windows Unexpected error...", vbInformation, "Error Code: 0x948548"
        `;
        fs.writeFileSync(vbsPath, vbsContent, 'utf8');
        child_process.exec(`cscript "${vbsPath}"`);
    } catch (err) {
    }
};
