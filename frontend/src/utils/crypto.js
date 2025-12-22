import CryptoJS from "crypto-js";

// for the signing
const MAGIC_PREFIX = "OTM_SECURE_MSG::";

// random key
// after URL #
export const generateKey = () => {
  // 256-bit random string
  return CryptoJS.lib.WordArray.random(32).toString();
};

export const deriveKeyFromPassword = (password) => {
  // PBKDF2 with 1000 iterations and 256-bit key size
  const salt = "OTM_STATIC_SALT_V1"; // In production, dynamic salt is better but this works for simple ZK
  const key = CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256-bit key
    iterations: 1000,
  });
  return key.toString();
};

// ENCRYPTION
//  (msg, key) ->  (enc mg)
export const encryptMessage = (message, key) => {
  // AES algorithm
  const payload = MAGIC_PREFIX + message;
  const encrypted = CryptoJS.AES.encrypt(payload, key).toString();
  return encrypted;
};

// DECRYPTION
// (enc msg, key) -> (msg)
export const decryptMessage = (encryptedMessage, key) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // if there is an error
    if (!originalText) return null;

    // check sign 
    if (originalText.startsWith(MAGIC_PREFIX)){
      return originalText.replace(MAGIC_PREFIX,"")
    }else{
      return null // TODO
    }

  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
