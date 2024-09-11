const aDrives = [];

const { exec } = require('child_process');

const checkDiskUsage = async (rootPath) => {
	return new Promise((resolve, reject) => {
		exec(`wmic logicaldisk where "DeviceID='${rootPath}'" get FreeSpace,Size /format:value`, (error, stdout) => {
			if (error) {
				return reject(error);
			}

			const result = {};
			stdout.split('\n').forEach(line => {
				if (line.includes('FreeSpace=')) {
					result.free = parseInt(line.split('=')[1]);
				} else if (line.includes('Size=')) {
					result.total = parseInt(line.split('=')[1]);
				}
			});

			result.available = result.total - result.free;
			resolve(result);
		});
	});
};

const getDrives = async (callback) => {
	switch (process.platform) {
		case 'win32':
			var oProcess = exec(
				'wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,Description  /format:list',
				function (err, stdout, stderr) {
					if (err) return callback(err, null);

					var aLines = stdout.split('\r\r\n');
					var bNew = false;
					var sCaption = '', sDescription = '', sFreeSpace = '', sSize = '', sVolume = '';
					for (var i = 0; i < aLines.length; i++) {
						if (aLines[i] != '') {
							var aTokens = aLines[i].split('=');
							switch (aTokens[0]) {
								case 'Caption':
									sCaption = aTokens[1];
									bNew = true;
									break;
								case 'Description':
									sDescription = aTokens[1];
									break;
								case 'FreeSpace':
									sFreeSpace = aTokens[1];
									break;
								case 'Size':
									sSize = aTokens[1];
									break;
								case 'VolumeSerialNumber':
									sVolume = aTokens[1];
									break;
							}

						} else {
							if (bNew) {
								sSize = parseFloat(sSize);
								if (isNaN(sSize)) {
									sSize = 0;
								}
								sFreeSpace = parseFloat(sFreeSpace);
								if (isNaN(sFreeSpace)) {
									sFreeSpace = 0;
								}

								var sUsed = (sSize - sFreeSpace);
								var sPercent = '0%';
								if (sSize != '' && parseFloat(sSize) > 0) {
									sPercent = Math.round((parseFloat(sUsed) / parseFloat(sSize)) * 100) + '%';
								}
								aDrives[aDrives.length] = {
									filesystem: sDescription,
									blocks: sSize,
									used: sUsed,
									available: sFreeSpace,
									capacity: sPercent,
									mounted: sCaption
								};
								bNew = false;
								sCaption = ''; sDescription = ''; sFreeSpace = ''; sSize = ''; sVolume = '';
							}

						}
					}
					if (callback != null) {
						callback(null, aDrives);
					}
					return aDrives;
				}
			);

			break;
		case 'linux':

		default:
			var oProcess = exec(
				'df -P | awk \'NR > 1\'',
				function (err, stdout, stderr) {
					if (err) return callback(err, null);
					var aLines = stdout.split('\n');
					for (var i = 0; i < aLines.length; i++) {
						var sLine = aLines[i];
						if (sLine != '') {
							sLine = sLine.replace(/ +(?= )/g, '');
							var aTokens = sLine.split(' ');
							aDrives[aDrives.length] = {
								filesystem: aTokens[0],
								blocks: aTokens[1],
								used: aTokens[2],
								available: aTokens[3],
								capacity: aTokens[4],
								mounted: aTokens[5]
							};

						}
					}
					if (callback != null) {
						callback(null, aDrives);
					}
					return aDrives;
				}
			);

	}
};

module.exports = {
	getDrives,
	checkDiskUsage,
}