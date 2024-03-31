import axios from "axios";
import https from "https";

export const instance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});