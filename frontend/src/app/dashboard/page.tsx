'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { EncryptionService } from '../../lib/encryption';

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface VaultItemData {
  _id?: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [encryptionSalt, setEncryptionSalt] = useState<string | null>(null);
  const [masterPassword, setMasterPassword] = useState<string>('');
  const [vaultItems, setVaultItems] = useState<VaultItemData[]>([]);
  const [filteredItems, setFilteredItems] = useState<VaultItemData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    // Filter items based on search term
    if (!searchTerm) {
      setFilteredItems(vaultItems);
    } else {
      const filtered = vaultItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.url && item.url.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, vaultItems]);

  const checkAuthAndLoadData = async () => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedSalt = localStorage.getItem('encryptionSalt');
      const savedMasterPassword = sessionStorage.getItem('masterPassword');

      console.log('Dashboard - Auth check:', {
        hasUser: !!savedUser,
        hasSalt: !!savedSalt,
        hasMasterPassword: !!savedMasterPassword
      });

      if (!savedUser || !savedSalt || !savedMasterPassword) {
        console.log('Dashboard - Missing auth data, redirecting to login');
        router.push('/login');
        return;
      }

      // Test if we can access the API (this will use httpOnly cookies automatically)
      try {
        const response = await api.get('/vault');
        console.log('Dashboard - API test successful');
        
        setUser(JSON.parse(savedUser));
        setEncryptionSalt(savedSalt);
        setMasterPassword(savedMasterPassword);

        await loadVaultItems(savedMasterPassword, savedSalt);
      } catch (apiError: any) {
        console.log('Dashboard - API test failed, redirecting to login');
        // Clear stored data if API call fails
        localStorage.removeItem('user');
        localStorage.removeItem('encryptionSalt');
        sessionStorage.removeItem('masterPassword');
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Dashboard - Auth check failed:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadVaultItems = async (password: string, salt: string) => {
    try {
      console.log('Dashboard - Loading vault items...');
      const response = await api.get('/vault');
      console.log('Dashboard - Vault response:', response.data);
      
      const encryptedItems = response.data.data || [];
      
      if (encryptedItems.length === 0) {
        setVaultItems([]);
        return;
      }

      const decryptedItems = encryptedItems.map((item: any) => {
        try {
          return EncryptionService.decryptVaultItem(item, password, salt);
        } catch (error) {
          console.error('Failed to decrypt item:', item._id, error);
          return null;
        }
      }).filter(Boolean);

      setVaultItems(decryptedItems);
    } catch (error: any) {
      console.error('Dashboard - Failed to load vault items:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = async () => {
    // Call logout endpoint to clear httpOnly cookies
    try {
      await api.post('/user/logout');
    } catch (error) {
      console.log('Logout API call failed, but continuing with local cleanup');
    }
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('encryptionSalt');
    sessionStorage.removeItem('masterPassword');
    router.push('/login');
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const password = Array.from({length: 16}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setNewItem({ ...newItem, password });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword || !encryptionSalt) return;

    try {
      const encryptedItem = EncryptionService.encryptVaultItem(newItem, masterPassword, encryptionSalt);
      await api.post('/vault', encryptedItem);
      
      setNewItem({ title: '', username: '', password: '', url: '', notes: '' });
      setShowAddForm(false);
      await loadVaultItems(masterPassword, encryptionSalt);
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await api.delete(`/vault/${id}`);
      await loadVaultItems(masterPassword, encryptionSalt!);
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${type} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-5"></div>
          <p className="text-gray-600 text-lg">Loading your secure vault...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🔐</span>
            <h1 className="text-2xl font-bold text-black">
              SecureVault
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-gray-600">Welcome, {user.fullName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Search and Add Section */}
        <div className="flex justify-between items-center mb-8 gap-5 flex-wrap">
          <div className="flex-1 min-w-80">
            <input
              type="text"
              placeholder="🔍 Search your vault..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base text-black focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-base font-semibold transition-colors"
          >
            ➕ Add Item
          </button>
        </div>

        {/* Add Item Form */}
        {showAddForm && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
            <h2 className="mb-5 text-black text-xl font-semibold">Add New Item</h2>
            <form onSubmit={handleAddItem} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  required
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-black focus:border-indigo-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={newItem.username}
                  onChange={(e) => setNewItem({ ...newItem, username: e.target.value })}
                  required
                  className="px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-black focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Password"
                  value={newItem.password}
                  onChange={(e) => setNewItem({ ...newItem, password: e.target.value })}
                  required
                  className="flex-1 px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-black focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  🎲 Generate
                </button>
              </div>
              <input
                type="url"
                placeholder="Website URL (optional)"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-black focus:border-indigo-500 focus:outline-none"
              />
              <textarea
                placeholder="Notes (optional)"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg text-base text-black resize-y focus:border-indigo-500 focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-base transition-colors"
                >
                  💾 Save Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-base transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vault Items */}
        <div className="space-y-5">
          <h2 className="text-black mb-3 text-xl font-semibold">
            🗄️ Your Vault ({filteredItems.length} items)
          </h2>
          
          {filteredItems.length === 0 ? (
            <div className="bg-white p-16 rounded-xl text-center shadow-lg">
              <span className="text-6xl block mb-5">🔒</span>
              <h3 className="text-black mb-3 text-lg font-medium">
                {searchTerm ? 'No items found' : 'Your vault is empty'}
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try a different search term' : 'Add your first password to get started'}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-black mb-3">
                      {item.title}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center gap-3">
                        <span className="min-w-20 font-medium text-black">Username:</span>
                        <span className="font-mono">{item.username}</span>
                        <button
                          onClick={() => copyToClipboard(item.username, 'Username')}
                          className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 transition-colors"
                        >
                          📋
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="min-w-20 font-medium text-black">Password:</span>
                        <span className="font-mono">••••••••••••</span>
                        <button
                          onClick={() => copyToClipboard(item.password, 'Password')}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          📋
                        </button>
                      </div>
                      {item.url && (
                        <div className="flex items-center gap-3">
                          <span className="min-w-20 font-medium text-black">URL:</span>
                          <a
                            href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 no-underline"
                          >
                            {item.url}
                          </a>
                        </div>
                      )}
                      {item.notes && (
                        <div className="flex items-start gap-3">
                          <span className="min-w-20 font-medium text-black">Notes:</span>
                          <span>{item.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item._id!)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}