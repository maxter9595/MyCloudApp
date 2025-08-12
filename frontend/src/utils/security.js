import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_CRYPTO_SECRET || 'mycloud-secure-key';

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const secureStoreToken = (token) => {
  const encryptedToken = encryptData(token);
  localStorage.setItem('token', encryptedToken);
};

export const getSecureToken = () => {
  const encryptedToken = localStorage.getItem('token');
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
};

export const removeSecureToken = () => {
  localStorage.removeItem('token');
};
