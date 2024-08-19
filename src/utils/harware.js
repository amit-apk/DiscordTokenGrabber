const child_process = require('child_process');
const diskinfo      = require('diskinfo');
const path          = require('path');
const fs            = require('fs');

function getUsers() {
    return new Promise((resolve, reject) => {
        diskinfo.getDrives((err, drives) => {
            if (err) {
                return reject(err);
            }
            let users = [];
            let drivePromises = drives.map(drive => {
                const mountpoint = drive.mountpoint;
                if (!mountpoint) {
                    return Promise.resolve([]);
                }

                const usersDir = path.join(mountpoint, 'Users');
                return new Promise((resolveDir, rejectDir) => {
                    fs.readdir(usersDir, { withFileTypes: true }, (err, files) => {
                        if (err) {
                            return resolveDir([]);
                        }
                        let userDirs = files
                            .filter(file => file.isDirectory())
                            .map(file => path.join(usersDir, file.name));

                        resolveDir(userDirs);
                    });
                });
            });

            Promise.all(drivePromises)
                .then(results => {
                    results.forEach(userDirs => users.push(...userDirs));
                    if (users.length === 0) {
                        const typicalUsersDir = path.join('C:', 'Users');
                        if (fs.existsSync(typicalUsersDir)) {
                            const files = fs.readdirSync(typicalUsersDir, { withFileTypes: true });
                            users = files
                                .filter(file => file.isDirectory())
                                .map(file => path.join(typicalUsersDir, file.name));
                        }
                    }
                    resolve(users);
                })
                .catch(err => {
                    reject(err);
                });
        });
    });
}

function filterProcesses(name){
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
}

function getProfiles(basePath, profileName) {
    try {
        const profilePathParts = basePath.split('%PROFILE%');
        
        if (profilePathParts.length === 1) {
            return [{
                path: basePath,
                name: profileName,
            }];
        }

        const [baseDir, profileSubDir] = profilePathParts;
        const profiles = [];

        if (!fs.existsSync(baseDir)) {
            return [];
        }

        const dirs = fs.readdirSync(baseDir);

        for (const dir of dirs) {
            const profilePath = path.join(baseDir, dir, profileSubDir);
            if (fs.existsSync(profilePath)) {
                profiles.push({
                    path: profilePath,
                    name: `${profileName} ${dir}`,
                });
            }
        }

        return profiles;
    } catch (error) {
        return [];
    }
}

module.exports = {
    getUsers,
    getProfiles,
    filterProcesses
}