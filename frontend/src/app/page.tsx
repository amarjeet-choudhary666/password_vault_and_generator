'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user is already logged in by checking stored user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '24px', marginRight: '10px' }}>🔐</span>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#2d3748',
              margin: 0
            }}>
              SecureVault
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                border: '2px solid #4c51bf',
                borderRadius: '25px',
                color: '#4c51bf',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4c51bf',
                border: '2px solid #4c51bf',
                borderRadius: '25px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '20px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              Secure Password Manager
            </h1>
            <p style={{
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px',
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6'
            }}>
              Generate strong passwords and store them securely with client-side encryption.
              Your data stays private - we never see your passwords.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '20px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => router.push('/register')}
                style={{
                  padding: '15px 30px',
                  backgroundColor: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(72, 187, 120, 0.4)',
                  transition: 'all 0.3s ease'
                }}
              >
                Start Free →
              </button>
              <button
                onClick={() => router.push('/generator')}
                style={{
                  padding: '15px 30px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '30px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                Try Generator
              </button>
            </div>
          </div>

          {/* Features */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            {[
              {
                icon: '🔑',
                title: 'Strong Password Generation',
                description: 'Generate cryptographically secure passwords with customizable options.'
              },
              {
                icon: '🔒',
                title: 'Client-Side Encryption',
                description: 'Your data is encrypted in your browser before being sent to our servers.'
              },
              {
                icon: '🛡️',
                title: 'Privacy First',
                description: 'We never see your master password or decrypted data.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '30px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#2d3748',
                  marginBottom: '10px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#718096',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        color: 'rgba(255, 255, 255, 0.8)',
        padding: '20px',
        textAlign: 'center'
      }}>
        <p>&copy; 2024 SecureVault. Built with privacy in mind.</p>
      </footer>
    </div>
  );
}