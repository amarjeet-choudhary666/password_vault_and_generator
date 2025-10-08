import { EncryptionService } from './encryption';

interface VaultItemData {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  tags?: string[];
  folder?: string;
}

export class ExportImportService {
  static exportVault(items: VaultItemData[], masterPassword: string, salt: string): string {
    const exportData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      items: items.map(item => ({
        title: item.title,
        username: item.username,
        password: item.password,
        url: item.url || '',
        notes: item.notes || '',
        tags: item.tags || [],
        folder: item.folder || 'General'
      }))
    };

    // Encrypt the export data
    const encrypted = EncryptionService.encrypt(JSON.stringify(exportData), masterPassword, salt);
    
    return JSON.stringify({
      encrypted: true,
      data: encrypted
    });
  }

  static importVault(encryptedData: string, masterPassword: string, salt: string): VaultItemData[] {
    try {
      const parsed = JSON.parse(encryptedData);
      
      if (!parsed.encrypted || !parsed.data) {
        throw new Error('Invalid export file format');
      }

      // Decrypt the data
      const decrypted = EncryptionService.decrypt(parsed.data, masterPassword, salt);
      const exportData = JSON.parse(decrypted);

      if (!exportData.items || !Array.isArray(exportData.items)) {
        throw new Error('Invalid export data structure');
      }

      return exportData.items;
    } catch (error) {
      throw new Error('Failed to import vault data. Please check your master password and file format.');
    }
  }

  static downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}