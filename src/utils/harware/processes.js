const child_process = require('child_process');
const util          = require("util");

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

const filterProcesses =  (name) => {
    return new Promise((resolve, reject) => {
        child_process.exec(process.platform === "win32" ? "tasklist" : "ps aux", (err, stdout, stderr) => {
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
    execCommand,
    filterProcesses
}
