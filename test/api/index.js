let nodeVersion = process.versions.node.split('.').map(Number);
let vMajor = nodeVersion[0];
let vMinor = nodeVersion[1];

if (vMajor < 7 || (vMajor === 7 && vMinor < 10)) {
  throw new Error("Requires node version 7.10 or above");
  process.exit(1);
} 