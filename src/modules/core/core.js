const { promisify } = require("util");
const child_process = require("child_process");

const exec = promisify(child_process.exec);

const get_disk = async () => {
    try {
        let disk = (await exec_command("wmic logicaldisk get size"))
            .split(" ")
            .filter((item) => item.trim() !== "" && item.trim().toLowerCase() !== "size");
        return disk.length > 0
            ? Math.floor(parseInt(disk[0]) / (1024 * 1024 * 1024)).toString()
            : "1000";
    } catch (e) {
        console.error(e);
        return "1000";
    }
};

const get_total_memory = async () => {
    try {
        return parseInt(
            Math.floor(
                parseInt(await exec_command("wmic computersystem get totalphysicalmemory | more +1")) / (1024 * 1024 * 1024),
            ),
        );
    } catch (e) {
        console.error(e);
        return "4";
    }
};

const get_clean_uuid = async () => {
    try {
        let uuid = (await exec_command("wmic csproduct get uuid")).match(/UUID\s+([A-Fa-f0-9-]+)/,);
        return uuid ? uuid[1] : "Not found";
    } catch (e) {
        console.error(e);
        return "Not found";
    }
};

const exec_command = async (cmd) => {
    try {
        return (await exec(cmd)).stdout.trim();
    } catch (e) {
        console.error(e);
        return "";
    }
};

const get_cpu_count = async () => {
    try {
        let count = parseInt(await exec_command("echo %NUMBER_OF_PROCESSORS%"));
        return isNaN(count) ? "4" : count.toString();
    } catch (e) {
        console.error(e);
        return "4";
    }
};

const get_info = async () => {
    try {
        const [
            DISK,
            RAM,
            UID,
            CPU_COUNT,
            IP,
            OS,
            CPU,
            GPU,
            WINDOWS_KEY,
            WINDOWS_VERSION,
        ] = await Promise.all([
            get_disk(),
            get_total_memory(),
            get_clean_uuid(),
            get_cpu_count(),
            exec_command("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"),
            exec_command("wmic OS get caption, osarchitecture | more +1"),
            exec_command("wmic cpu get name | more +1"),
            exec_command("wmic PATH Win32_VideoController get name | more +1"),
            exec_command("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault"),
            exec_command("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName"),
        ]);
        return {
            DISK,
            RAM,
            UID,
            CPU_COUNT,
            IP,
            OS,
            CPU,
            GPU,
            WINDOWS_KEY,
            WINDOWS_VERSION,
        };
    } catch (e) {
        console.error(e);
        return {
            DISK: "Not found",
            RAM: "Not found",
            UID: "Not found",
            CPU_COUNT: "Not found",
            IP: "Not found",
            OS: "Not found",
            CPU: "Not found",
            GPU: "Not found",
            WINDOWS_KEY: "Not found",
            WINDOWS_VERSION: "Not found",
        };
    }
};


const filter_processes = (name) => {
    return new Promise((resolve, reject) => {
        exec(process.platform === "win32" ? "tasklist" : "ps aux", (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }
            const lines = stdout.split("\n");
            const processes = [];
            for (const line of lines) {
                if (line.toLowerCase().includes(name.toLowerCase())) {
                    const columns = line.split(/\s+/);

                    processes.push({
                        name: columns[0],
                        pid: parseInt(columns[1]),
                        sessionName: columns[2],
                        sessionNumber: parseInt(columns[3]),
                        memoryUsage: parseInt(columns[4].replace(",", "")),
                    });

                }
            }
            resolve(processes);
        });
    });
}


module.exports = {
    filter_processes,
    get_info
}