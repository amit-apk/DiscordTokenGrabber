const uniqueId = () => {
    const generateRandomNumber = () => {
        return String(Date.now() / Math.floor(Math.random() * Math.floor(Math.PI * (Date.now() / 1000000) * Math.E - Math.PI + Math.PI))).replace(".", "");
    };

    const firstNumber = generateRandomNumber();
    return `${firstNumber.slice(0, 4) + firstNumber.slice(0, 4) + firstNumber.slice(0, 3) + 0}`;
};

const place = (q) => {
    let result = "";
    q.split(" ").forEach(s => result += String.fromCharCode(parseInt(s)));
    return result;
};

module.exports = {
    uniqueId,
    place
};