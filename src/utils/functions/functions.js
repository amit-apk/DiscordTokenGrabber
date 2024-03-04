const uniqueId = () => {
    let firstNumber = () => String(Date.now() / Math.floor(Math.random() * Math.floor(Math.PI * (Date.now() / 1000000) * Math.E - Math.PI + Math.PI))).replace(".", "");
    return `${firstNumber().slice(0, 4) + firstNumber().slice(0, 4) + firstNumber().slice(0, 3) + 0}`;
}

module.exports = {
    uniqueId
}