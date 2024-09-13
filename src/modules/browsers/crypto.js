const crypto = require("crypto");

const decryptAES256GCM = (key, match) => {
    let token = Buffer.from(match[0].split("dQw4w9WgXcQ:")[1], 'base64');
    const iv = token.slice(3, 15);
    const encryptedData = token.slice(15, -16);
    const authTag = token.slice(-16);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf-8');

    decrypted += decipher.final('utf-8');

    return decrypted;
}

module.exports = {
    decryptAES256GCM
}