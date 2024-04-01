const unique_id = () => {
    const generate_random_number = () => {
        return String(Date.now() / Math.floor(Math.random() * Math.floor(Math.PI * (Date.now() / 1000000) * Math.E - Math.PI + Math.PI))).replace(".", "");
    };
    return `${generate_random_number().slice(0, 4) + generate_random_number().slice(0, 4) + generate_random_number().slice(0, 3) + 0}`;
};

const place = (text) => {
    let result = "";

    text.split(" ").forEach((u) => 
        result += String.fromCharCode(parseInt(u))
    );
    return result;
};

const key_res = (res) => ["y", "yes", "ok"].includes(res.toLowerCase().trim()) ? "true" : "false";

const decode_B64 = (s) => Buffer.from(s, 'base64').toString("utf-8");

const msg = (m) => (`:: ${m}`).toString()

const is_webhook = (whk) => /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[a-zA-Z0-9_-]+$/.test(whk);

module.exports = { 
    unique_id, 
    place, 
    key_res, 
    decode_B64, 
    msg, 
    is_webhook 
};
