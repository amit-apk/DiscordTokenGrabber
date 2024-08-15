const decodeBase64 = (string) => {
    try {
        return Buffer.from(string, 'base64').toString('utf-8');
    } catch (error) {
        return null;
    }
};

const encodeBase64 = (string) => {
    try {
        return Buffer.from(string).toString('base64');
    } catch (error) {
        return null;
    }
};

const isLinkIcon = (url) => {
    const regex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)$/i;
    return regex.test(url);
};

const isWebhook = (url) => {
    const regex = /^(https:\/\/(discordapp\.com|discord\.com|canary\.discord\.com|ptb\.discord\.com)\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+)$/i;
    return regex.test(url);
};

module.exports = {
    decodeBase64,
    encodeBase64,
    isLinkIcon,
    isWebhook,
};