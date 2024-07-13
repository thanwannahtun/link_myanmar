import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your_secret_key';

export function encryptMessage(message: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(message), SECRET_KEY).toString();
}

export function decryptMessage(encryptedMessage: string): any {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, SECRET_KEY);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedMessage);
}

function generateId(): string {
  return '_' + Math.random().toString(36).substr(2, 9);
}
