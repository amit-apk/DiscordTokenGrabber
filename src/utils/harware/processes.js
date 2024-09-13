const {
    exec,
    execSync
} = require('child_process');

const util = require("util");

const execFull = util.promisify(exec);

const delay = async (ms) => {
    return await new Promise(resolve => setTimeout(resolve, ms));
};

const execCommand = async (command) => {
    try {
        const { stdout } = await execFull(command);
        return stdout.trim();
    } catch (error) {
        console.error(error.message);
        return '';
    }
};

const execPowerShell = async (command) => {
    try {
        const { stdout } = await execFull(`powershell -Command "${command}"`);
        return stdout.trim();
    } catch (error) {
        console.error(error.message);
        return '';
    }
}

const filterProcesses = (name) => {
    return new Promise((resolve, reject) => {
        exec("tasklist", (err, stdout, stderr) => {
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
};

module.exports = {
    delay,
    execCommand,
    execPowerShell,
    filterProcesses
}
