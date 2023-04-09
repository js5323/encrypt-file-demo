const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function resolve(fileName) {
  return path.resolve(__dirname, fileName);
}

function decryptFile(key, iv, inputFile) {
  const inputData = fs.readFileSync(inputFile);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  var decoded = decipher.update(inputData, "binary", "utf8");
  decoded += decipher.final("utf8");
  fs.writeFileSync(resolve(`./res-${new Date().getTime()}.pdf`), decoded);
}

const KEY = "adoxb42lk35nsfgl";
const IV = "a12xb42lab5nsjga";

decryptFile(KEY, IV, resolve("./encrypt-a12xb42lab5nsjga.enc"));
