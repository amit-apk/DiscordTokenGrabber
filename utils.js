const gradient = require("gradient-string");

const applyGradient = (colors, text) => {
    if (!Array.isArray(colors) || colors.length === 0) {
        throw new Error('The "colors" parameter should be a non-empty array.');
    }

    if (typeof text !== 'string' && typeof text !== 'number') {
        throw new Error('The "text" parameter should be a string or a number.');
    }

    return gradient(colors)(String(text));
};


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
    applyGradient,
    decodeBase64,
    encodeBase64,
    isLinkIcon,
    isWebhook,
};