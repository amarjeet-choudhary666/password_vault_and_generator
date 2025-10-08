'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { ExportImportService } from '../../lib/exportImport';

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

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [twoFactorToken, setTwoFactorToken] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportPassword, setExportPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [router]);

  const handleExportVault = async () => {
    if (!exportPassword) {
      alert('Please enter your master password for export');
      return;
    }

    try {
      // Get encryption salt and session master password
      const encryptionSalt = localStorage.getItem('encryptionSalt');
      const sessionMasterPassword = sessionStorage.getItem('masterPassword');
      
      if (!encryptionSalt) {
        throw new Error('Encryption salt not found. Please log in again.');
      }
      
      if (!sessionMasterPassword) {
        throw new Error('Session expired. Please log in again.');
      }

      console.log('Export password entered:', exportPassword);
      console.log('Session master password:', sessionMasterPassword);
      
      // Verify the export password matches the session password
      if (exportPassword !== sessionMasterPassword) {
        throw new Error(`Incorrect master password. Please enter the same password you used to log in. Session has: "${sessionMasterPassword}", you entered: "${exportPassword}"`);
      }

      // Fetch vault items
      const response = await fetch('/api/vault', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch vault items');
      }

      const data = await response.json();
      const encryptedItems = data.data || [];

      if (encryptedItems.length === 0) {
        alert('No items found in your vault to export.');
        return;
      }

      console.log('Encrypted items from backend:', encryptedItems);
      console.log('Number of items:', encryptedItems.length);
      console.log('First item structure:', encryptedItems[0]);
      console.log('First item keys:', Object.keys(encryptedItems[0] || {}));
      console.log('Session master password available:', !!sessionMasterPassword);
      console.log('Encryption salt available:', !!encryptionSalt);
      
      const { EncryptionService } = await import('../../lib/encryption');
      
      // Test decryption of first item's title field only
      if (encryptedItems.length > 0) {
        const firstItem = encryptedItems[0];
        console.log('Testing decryption of first item title...');
        console.log('Title field:', firstItem.title);
        console.log('Title type:', typeof firstItem.title);
        
        try {
          const testDecrypt = EncryptionService.decrypt(firstItem.title, sessionMasterPassword, encryptionSalt);
          console.log('Test decryption successful:', testDecrypt);
        } catch (testError) {
          console.error('Test decryption failed:', testError);
          throw new Error(`Cannot decrypt vault items. This might be because: 1) Wrong master password, 2) Items are not encrypted, or 3) Different encryption format. Error: ${testError.message}`);
        }
      }
      
      const decryptedItems = encryptedItems.map((item: any, index: number) => {
        try {
          console.log(`Attempting to decrypt item ${index}:`, item);
          // Use session master password for decryption (same as dashboard)
          const decrypted = EncryptionService.decryptVaultItem(item, sessionMasterPassword, encryptionSalt);
          console.log(`Successfully decrypted item ${index}:`, decrypted);
          return decrypted;
        } catch (error) {
          console.error(`Failed to decrypt item ${index}:`, item._id, error);
          console.error('Item data:', item);
          throw new Error(`Failed to decrypt vault items. Error on item ${index}: ${error.message}`);
        }
      });

      // Export and download
      const exportData = ExportImportService.exportVault(decryptedItems, exportPassword, encryptionSalt);
      const filename = `securevault-backup-${new Date().toISOString().split('T')[0]}.json`;
      ExportImportService.downloadFile(exportData, filename);
      
      setExportPassword('');
      alert('Vault exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert(`Failed to export vault: ${error.message}`);
    }
  };

  const handleImportVault = async () => {
    if (!importFile || !importPassword) {
      alert('Please select a file and enter your master password');
      return;
    }

    try {
      // Get encryption salt from localStorage
      const encryptionSalt = localStorage.getItem('encryptionSalt');
      if (!encryptionSalt) {
        throw new Error('Encryption salt not found. Please log in again.');
      }

      const fileContent = await importFile.text();
      const items = ExportImportService.importVault(fileContent, importPassword, encryptionSalt);

      // Import items to backend (encrypt each item before sending)
      const { EncryptionService } = await import('../../lib/encryption');
      
      for (const item of items) {
        const encryptedItem = EncryptionService.encryptVaultItem(item, importPassword, encryptionSalt);
        
        const response = await fetch('/api/vault', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(encryptedItem)
        });

        if (!response.ok) {
          throw new Error(`Failed to import item: ${item.title}`);
        }
      }

      setImportFile(null);
      setImportPassword('');
      alert(`Successfully imported ${items.length} items!`);
    } catch (error) {
      console.error('Import error:', error);
      alert(`Failed to import vault: ${error.message}`);
    }
  };

  const handleSetup2FA = async () => {
    try {
      const response = await fetch('/api/user/2fa/setup', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to setup 2FA');
      }

      const data = await response.json();
      setQrCode(data.data.qrCode);
      setShowQR(true);
    } catch (error) {
      console.error('2FA setup error:', error);
      alert('Failed to setup 2FA');
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFactorToken) {
      alert('Please enter the 6-digit code from your authenticator app');
      return;
    }

    try {
      const response = await fetch('/api/user/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: twoFactorToken })
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      setTwoFactorEnabled(true);
      setShowQR(false);
      setTwoFactorToken('');
      alert('2FA enabled successfully!');
    } catch (error) {
      console.error('2FA verify error:', error);
      alert('Invalid token. Please try again.');
    }
  };

  const handleDisable2FA = async () => {
    if (!twoFactorToken) {
      alert('Please enter your current 2FA code to disable');
      return;
    }

    try {
      const response = await fetch('/api/user/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token: twoFactorToken })
      });

      if (!response.ok) {
        throw new Error('Failed to disable 2FA');
      }

      setTwoFactorEnabled(false);
      setTwoFactorToken('');
      alert('2FA disabled successfully!');
    } catch (error) {
      console.error('2FA disable error:', error);
      alert('Failed to disable 2FA. Please check your token.');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-black dark:text-white">Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">🎨 Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 dark:text-gray-300">Dark Mode</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark themes</p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* 2FA Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">🔐 Two-Factor Authentication</h2>
          
          {!twoFactorEnabled ? (
            <div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Add an extra layer of security to your account with 2FA
              </p>
              
              {!showQR ? (
                <button
                  onClick={handleSetup2FA}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Enable 2FA
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <img src={qrCode} alt="2FA QR Code" className="mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Scan this QR code with your authenticator app, then enter the 6-digit code below
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={twoFactorToken}
                      onChange={(e) => setTwoFactorToken(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
                      maxLength={6}
                    />
                    <button
                      onClick={handleVerify2FA}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-green-600 dark:text-green-400 mb-4">✅ 2FA is enabled</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter current 2FA code to disable"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
                  maxLength={6}
                />
                <button
                  onClick={handleDisable2FA}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Disable 2FA
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Export/Import */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">📦 Backup & Restore</h2>
          
          {/* Export */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">Export Vault</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Download an encrypted backup of your vault
            </p>
            <div className="flex gap-3">
              <input
                type="password"
                placeholder="Master password for export"
                value={exportPassword}
                onChange={(e) => setExportPassword(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
              />
              <button
                onClick={handleExportVault}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>

          {/* Import */}
          <div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">Import Vault</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Restore from an encrypted backup file
            </p>
            <div className="space-y-3">
              <input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
              />
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="Master password for import"
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-black dark:text-white bg-white dark:bg-gray-700"
                />
                <button
                  onClick={handleImportVault}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4">👤 Account Information</h2>
          <div className="space-y-2">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {user.fullName}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}