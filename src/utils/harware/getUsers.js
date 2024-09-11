const {
    getDrives
} = require('./disk.js');

const path = require('path');
const fs   = require('fs');

const getUsers = () => {
    return new Promise((resolve, reject) => {
        getDrives((err, drives) => {
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

const getProfiles = (basePath, profileName) => {
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
    getProfiles
}