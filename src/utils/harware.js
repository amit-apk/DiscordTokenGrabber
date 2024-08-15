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

function getProfiles(path, name) {
    const profile = path.split("%PROFILE%");

    try {
        if (profile.length == 1) {
            return [{
                path: path,
                name: name,
            }];
        }
        if (!fs.existsSync(profile[0])) return [];

        var dirs = fs.readdirSync(profile[0]);
        var profiles = [];

        for (var i = 0; i < dirs.length; i++) {
            var dir = dirs[i];

            if (fs.existsSync(profile[0] + dir + profile[1])) {
                profiles.push({
                    path: profile[0] + dir + profile[1],
                    profile: name + " " + dir,
                });
            }
        }
        
        return profiles;
    } catch (err) {
        return [];
    }
}

module.exports = {
    getUsers,
    getProfiles,
    filterProcesses
}