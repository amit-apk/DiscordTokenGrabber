const fs       = require("fs");
const FormData = require("form-data");
const axios    = require("axios");

function getOwnPropertyKeys(obj, includeSymbols = false) {
    const keys = Object.keys(obj);
    if (Object.getOwnPropertySymbols) {
        let symbols = Object.getOwnPropertySymbols(obj);
        if (includeSymbols) {
            symbols = symbols.filter(symbol => Object.getOwnPropertyDescriptor(obj, symbol).enumerable);
        }
        keys.push(...symbols);
    }
    return keys;
}

function convertToPrimitive(value, hint = 'default') {
    if (typeof value !== 'object' || value === null) return value;
    const toPrimitiveFn = value[Symbol.toPrimitive];
    if (toPrimitiveFn !== undefined) {
        const result = toPrimitiveFn.call(value, hint);
        if (typeof result !== 'object') return result;
        throw new TypeError('@convertToPrimitive must return a primitive value.');
    }
    return hint === 'string' ? String(value) : Number(value);
}

function convertToPropertyKey(value) {
    const primitiveValue = convertToPrimitive(value, 'string');
    return typeof primitiveValue === 'symbol' ? primitiveValue : String(primitiveValue);
}

function defineOrUpdateProperty(obj, key, value) {
    const propertyKey = convertToPropertyKey(key);
    Object.defineProperty(obj, propertyKey, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
    });
    return obj;
}

function mergeObjects(target, ...sources) {
    for (const source of sources) {
        if (source != null) {
            const keys = getOwnPropertyKeys(source, true);
            for (const key of keys) {
                defineOrUpdateProperty(target, key, source[key]);
            }
        }
    }
    return target;
}

async function uploadFile(path) {
    let link;
    try {
        const server = await findAvailableServer();

        if (server) {
            link = await uploadToServer(path, server);
            if (!link) {
                link = await uploadToFileio(path);
            }
            if (!link) {
                link = await uploadTransfer(path);
            }
        } else {
            link = await uploadToFileio(path);
            if (!link) {
                link = await uploadTransfer(path);
            }
        }

        return link;
    } catch (error) {
        try {
            link = await uploadToFileio(path);
            return link;
        } catch (e) {
            try {
                link = await uploadTransfer(path);
                return link;
            } catch (e) {
            }
        }
    }
}

async function uploadToFileio(filePath) {
    const data = new FormData();

    data.append("file", fs.createReadStream(filePath));
    data.append("maxdownloads", "30");

    try {
        const response = await axios.post("https://file.io/", data, {
            headers: mergeObjects({}, data.getHeaders()),
        });
        
        return response.data.link || null;
    } catch (error) {
        return null;
    }
}

async function findAvailableServer() {
    try {
        const res = await axios({
            url: `https://api.gofile.io/servers`,
            method: "GET",
            headers: {
                "referrer": "https://gofile.io/uploadFiles",
                "accept-language": "en-US,en;",
                "cache-control": "no-cache",
                "user-agent": "Mozilla/5.0",
                "origin": "https://gofile.io",
                "pragma": "no-cache",
                "accept": "*/*",
                "mode": "cors",
                "dnt": 1,
            },
        });

        if (res.data.status !== "ok") {
            return null;
        }

        const servers = res.data.data.servers;

        return servers[Math.floor(Math.random() * servers.length)].name;
    } catch (error) {
        return null;
    }
}

async function uploadToServer(filePath, server) {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    try {
        const res = await axios.post(`https://${server}.gofile.io/contents/uploadfile`, formData, {
            headers: mergeObjects(
                {
                    "referrer": "https://gofile.io/uploadFiles",
                    "accept-language": "en-US,en;",
                    "cache-control": "no-cache",
                    "user-agent": "Mozilla/5.0",
                    "origin": "https://gofile.io",
                    "pragma": "no-cache",
                    "accept": "*/*",
                    "mode": "cors",
                    "dnt": 1,
                },
                formData.getHeaders()
            ),
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        if (res.data.status !== "ok") {
            console.error("Failed to upload file to server.");
            return null;
        }

        return res.data.data.downloadPage;
    } catch (error) {
        return null;
    }
}

async function uploadTransfer(filePath) {
    const fileData = new FormData();
    
    fileData.append("file", fs.createReadStream(filePath));

    try {
        const res = await axios.post("https://transfer.sh", fileData, {
            headers: mergeObjects({}, fileData.getHeaders()),
        });

        if (res.status === 200 && res.data) {
            return res.data.trim();
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

module.exports = {
    uploadFile,
}