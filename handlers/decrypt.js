const CryptoJS = require("crypto-js");

const decrypt = value => {
  const bytes = CryptoJS.AES.decrypt(value, "secret key 123");
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

module.exports = decrypt;
