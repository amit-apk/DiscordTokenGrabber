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