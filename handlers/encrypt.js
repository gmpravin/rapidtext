const CryptoJS = require("crypto-js");

const encrypt = value => {
  const EncryptText = CryptoJS.AES.encrypt(value, "secret key 123").toString();
  return EncryptText;
};

module.exports = encrypt;
