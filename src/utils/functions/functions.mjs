export const unique_id = () => {
    const generate_random_number = () => {
        return String(Date.now() / Math.floor(Math.random() * Math.floor(Math.PI * (Date.now() / 1000000) * Math.E - Math.PI + Math.PI))).replace(".", "");
    };
    return `${generate_random_number().slice(0, 4) + generate_random_number().slice(0, 4) + generate_random_number().slice(0, 3) + 0}`;
};

export const place = (text) => {
    let result = "";

    text.split(" ").forEach((u) => 
        result += String.fromCharCode(parseInt(u))
    );
    return result;
};

export const key_res = (res) => ["y", "yes", "ok"].includes(res.toLowerCase().trim());

export const decode_B64 = (s) => Buffer.from(s, 'base64').toString("utf-8");

export const msg = (m) => (`:: ${m}`).toString()

export const is_webhook = (whk) => /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+$/.test(whk);
