'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Run only on client
  useEffect(() => {
    setMounted(true);

    // Check localStorage safely
    const checkUser = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          // Test if token works
          await api.get('/vault');
          router.push('/dashboard');
        }
      } catch {
        // Invalid or expired token — clear user data
        localStorage.removeItem('user');
        localStorage.removeItem('encryptionSalt');
        sessionStorage.removeItem('masterPassword');
      }
    };

    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login...');
      
      // Use fetch instead of axios
      const response = await fetch('http://localhost:8000/v1/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { loggedInUser, encryptionSalt } = data.data || {};

      if (!loggedInUser) throw new Error('Invalid response format');

      // Store securely
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('encryptionSalt', encryptionSalt);
      sessionStorage.setItem('masterPassword', formData.password);

      console.log('Login successful → redirecting...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div>Loading...</div>;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '48px' }}>🔐</span>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2d3748',
              margin: '10px 0 5px 0',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: '#718096' }}>Sign in to your SecureVault</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d3748',
                fontWeight: '500',
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#4c51bf')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#2d3748',
                fontWeight: '500',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#4c51bf')}
              onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#fed7d7',
                border: '1px solid #fc8181',
                borderRadius: '8px',
                color: '#c53030',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#a0aec0' : '#4c51bf',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: '#718096', marginBottom: '10px' }}>
              Don’t have an account?
            </p>
            <button
              type="button"
              onClick={() => router.push('/register')}
              style={{
                background: 'none',
                border: 'none',
                color: '#4c51bf',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#718096',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
