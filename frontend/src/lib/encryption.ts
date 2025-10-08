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
    try {
      if (!encryptedData || !password || !salt) {
        throw new Error('Missing required parameters for decryption');
      }
      
      const key = this.deriveKey(password, salt);
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
      
      if (!decrypted || !decrypted.words || decrypted.words.length === 0) {
        throw new Error('Decryption failed - invalid password or corrupted data');
      }
      
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!result) {
        throw new Error('Decryption resulted in empty string - invalid password');
      }
      
      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error(`Decryption failed: ${error.message}`);
    }
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
      console.log('Decrypting vault item:', encryptedItem._id);
      console.log('Item structure:', Object.keys(encryptedItem));
      
      if (!encryptedItem.title || !encryptedItem.username || !encryptedItem.password) {
        throw new Error('Missing required encrypted fields in vault item');
      }
      
      const decrypted = {
        ...encryptedItem,
        title: this.decrypt(encryptedItem.title, masterPassword, salt),
        username: this.decrypt(encryptedItem.username, masterPassword, salt),
        password: this.decrypt(encryptedItem.password, masterPassword, salt),
        url: encryptedItem.url ? this.decrypt(encryptedItem.url, masterPassword, salt) : '',
        notes: encryptedItem.notes ? this.decrypt(encryptedItem.notes, masterPassword, salt) : '',
      };
      
      console.log('Successfully decrypted item:', decrypted._id);
      return decrypted;
    } catch (error) {
      console.error('Decryption failed for item:', encryptedItem._id, error);
      throw new Error(`Failed to decrypt vault item ${encryptedItem._id}: ${error.message}`);
    }
  }
}