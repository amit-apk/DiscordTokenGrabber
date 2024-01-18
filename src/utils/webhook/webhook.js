const { EmbedBuilder } = require('discord.js');

const getEmbeds = ({ author = {}, thumbnail, color = "", title = "", desc = "", fields = [] }) => {
    try {
        let { name = "-", icon_url = "https://i.imgur.com/WkKXZSl.gif" } = author;
        let b = new EmbedBuilder().setAuthor({ name: name, iconURL: icon_url }).setColor(color === "" ? "#c267ff" : color)
            if (thumbnail) b.setThumbnail(thumbnail)
            if (title) b.setTitle(title)
            else b.setTitle("AuraThemes Grabber")
            if (desc) b.setDescription(desc);
        if (fields.length > 0) {
            b.addFields(...fields);
        }
        return b.setFooter({ text: "AuraThemes Grabber - https://discord.gg/aurathemes", iconURL: "https://i.imgur.com/WkKXZSl.gif" }).setTimestamp();
    } catch (e) {
        return null;
    }
}


const send = (e) => {
    try {
        return {
            embeds: [e],
            username: '@AuraThemes',
            avatarURL: 'https://i.imgur.com/WkKXZSl.gif'
        };
    } catch (e) {
        return {};
    }
}

module.exports = {
    getEmbeds,
    send
}