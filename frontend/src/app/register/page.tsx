'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api-new';


export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in by checking stored user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      // Test if we can access the API
      api.get('/vault')
        .then(() => {
          router.push('/dashboard');
        })
        .catch(() => {
          // If API call fails, clear stored data
          localStorage.removeItem('user');
          localStorage.removeItem('encryptionSalt');
          sessionStorage.removeItem('masterPassword');
        });
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting registration...');
      
      // Use fetch instead of axios to avoid any configuration issues
      const response = await fetch('http://localhost:8000/v1/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      console.log('Registration successful, redirecting to login...');
      router.push('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="text-3xl font-bold text-black mt-3 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join SecureVault today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-black font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-black font-medium">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-black font-medium">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block mb-2 text-black font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black text-base focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg text-white font-semibold text-base transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-600 mb-2">
              Already have an account?
            </p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-indigo-600 underline font-medium hover:text-indigo-700"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}