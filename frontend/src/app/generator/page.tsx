'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GeneratorPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeSimilar: false
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generatePassword = () => {
    let charset = '';

    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (options.includeNumbers) charset += '0123456789';
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    if (!charset) {
      alert('Please select at least one character type');
      return;
    }

    let result = '';
    for (let i = 0; i < options.length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(result);
  };

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);

      // Auto-clear after 15 seconds
      setTimeout(() => {
        setCopied(false);
      }, 15000);
    } catch (err) {
      console.error('Failed to copy password');
      alert('Failed to copy password');
    }
  };

  if (!mounted) {
    return <div className="text-black">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 p-5">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => router.back()}
          className="px-5 py-2 bg-white/20 text-white border border-white/30 rounded-lg hover:bg-white/30 text-sm mb-5 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-white text-center drop-shadow-lg">
          🎲 Password Generator
        </h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-10 shadow-2xl">
        {/* Generated Password Display */}
        <div className="mb-8">
          <label className="block mb-3 text-base font-semibold text-black">
            Generated Password
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={password}
              readOnly
              placeholder="Click 'Generate Password' to create a secure password"
              className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-lg text-base font-mono bg-gray-50 text-black"
            />
            <button
              onClick={copyToClipboard}
              disabled={!password}
              className={`px-5 py-4 rounded-lg text-sm font-semibold transition-colors ${password
                ? copied
                  ? 'bg-green-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>

        {/* Length Slider */}
        <div className="mb-8">
          <label className="block mb-3 text-base font-semibold text-black">
            Password Length: {options.length}
          </label>
          <input
            type="range"
            min="4"
            max="50"
            value={options.length}
            onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>50</span>
          </div>
        </div>

        {/* Character Options */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-black mb-4">
            Character Types
          </h3>
          <div className="space-y-4">
            {[
              { key: 'includeUppercase', label: 'Uppercase Letters (A-Z)', example: 'ABCDEFG' },
              { key: 'includeLowercase', label: 'Lowercase Letters (a-z)', example: 'abcdefg' },
              { key: 'includeNumbers', label: 'Numbers (0-9)', example: '1234567' },
              { key: 'includeSymbols', label: 'Symbols (!@#$...)', example: '!@#$%^&' },
              { key: 'excludeSimilar', label: 'Exclude Similar Characters (i, l, 1, L, o, 0, O)', example: 'Avoid confusion' }
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={options[option.key as keyof typeof options] as boolean}
                  onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="font-medium text-black">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {option.example}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full py-4 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
        >
          🎲 Generate Secure Password
        </button>

        {/* Security Info */}
        <div className="mt-8 p-5 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-green-700 mb-3 text-sm font-semibold">
            🛡️ Security Tips
          </h4>
          <ul className="text-green-700 text-xs leading-relaxed space-y-1 pl-4">
            <li>Use unique passwords for each account</li>
            <li>Longer passwords are generally more secure</li>
            <li>Include a mix of character types for better security</li>
            <li>Store passwords securely in a password manager</li>
          </ul>
        </div>
      </div>
    </div>
  );
}