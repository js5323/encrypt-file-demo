const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function resolve(fileName) {
  return path.resolve(__dirname, fileName);
}

function decryptFile(key, iv, inputFile, outputFileName) {
  const inputData = fs.readFileSync(inputFile);
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(key),
    Buffer.from(iv)
  );
  decipher.setAutoPadding(true);
  var decoded = decipher.update(inputData, "binary", "utf8");
  decoded += decipher.final("utf8");
  fs.writeFileSync(resolve(`./${outputFileName}`), decoded);
}

const KEY = "adoxb42lk35nsfgl";
const IV = "a12xb42lab5nsjga";

// decryptFile(
//   KEY,
//   IV,
//   resolve("./encrypt-by-crypto-js-1681135989154.enc"),
//   "crypto-js-res.pdf"
// );

decryptFile(
  KEY,
  IV,
  resolve("./encrypt-by-forge-1681136195654.enc"),
  "forge-res.pdf"
);
