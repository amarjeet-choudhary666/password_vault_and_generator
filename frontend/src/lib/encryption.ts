import CryptoJS from 'crypto-js';

// Client-side encryption service for vault items
export class EncryptionService {
  private static deriveKey(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256 / 32,
      iterations: 10000,
    }).toString();
  }

  static encrypt(data: string, password: string, salt: string): string {
    const key = this.deriveKey(password, salt);
    const encrypted = CryptoJS.AES.encrypt(data, key).toString();
    return encrypted;
  }

  static decrypt(encryptedData: string, password: string, salt: string): string {
    const key = this.deriveKey(password, salt);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  static encryptVaultItem(item: any, masterPassword: string, salt: string) {
    return {
      ...item,
      title: this.encrypt(item.title, masterPassword, salt),
      username: this.encrypt(item.username, masterPassword, salt),
      password: this.encrypt(item.password, masterPassword, salt),
      url: item.url ? this.encrypt(item.url, masterPassword, salt) : '',
      notes: item.notes ? this.encrypt(item.notes, masterPassword, salt) : '',
    };
  }

  static decryptVaultItem(encryptedItem: any, masterPassword: string, salt: string) {
    try {
      return {
        ...encryptedItem,
        title: this.decrypt(encryptedItem.title, masterPassword, salt),
        username: this.decrypt(encryptedItem.username, masterPassword, salt),
        password: this.decrypt(encryptedItem.password, masterPassword, salt),
        url: encryptedItem.url ? this.decrypt(encryptedItem.url, masterPassword, salt) : '',
        notes: encryptedItem.notes ? this.decrypt(encryptedItem.notes, masterPassword, salt) : '',
      };
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt vault item');
    }
  }
}