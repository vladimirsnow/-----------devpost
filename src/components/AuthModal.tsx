import React, { useState } from 'react';
import { registerWithEmail, loginWithEmail, resetPassword } from '../firebase/authService';
import { isFirebaseConfigured } from '../firebase/config';
import { playCyberSound } from '../utils/audio';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
  soundEnabled: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  soundEnabled,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);
    playCyberSound('blip', soundEnabled);

    try {
      if (mode === 'register') {
        if (!username.trim()) {
          setErrorMessage('Please provide an Operative Codename.');
          setLoading(false);
          return;
        }
        const res = await registerWithEmail(email, password, username);
        if (!res.success) {
          setErrorMessage(res.error || 'Registration failed');
        } else {
          playCyberSound('level-up', soundEnabled);
          onAuthSuccess(res.user);
          onClose();
        }
      } else if (mode === 'login') {
        const res = await loginWithEmail(email, password);
        if (!res.success) {
          setErrorMessage(res.error || 'Invalid credentials');
        } else {
          playCyberSound('surge', soundEnabled);
          onAuthSuccess(res.user);
          onClose();
        }
      } else if (mode === 'reset') {
        const res = await resetPassword(email);
        if (res.success) {
          setSuccessMessage('Password recovery link transmitted to neural relay (email).');
        } else {
          setErrorMessage(res.error || 'Password recovery failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const isConfigured = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#10131a] border border-[#00c6ff]/40 rounded-xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,198,255,0.2)] font-['Space_Mono',monospace]">
        {/* Glow corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00c6ff]"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00c6ff]"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00c6ff]"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00c6ff]"></div>

        {/* Close Button */}
        <button
          onClick={() => {
            playCyberSound('blip', soundEnabled);
            onClose();
          }}
          className="absolute top-4 right-4 text-[#86929a] hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#272a32] text-[10px] text-[#00c6ff] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#5eecaf] animate-pulse"></span>
            {isConfigured ? 'FIREBASE AUTH // ONLINE' : 'LOCAL DEMO SANDBOX // ACTIVE'}
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            {mode === 'login' && 'OPERATIVE LOGIN'}
            {mode === 'register' && 'CREATE OPERATIVE PROFILE'}
            {mode === 'reset' && 'RESTORE CIPHER ACCESS'}
          </h2>
          <p className="text-xs text-[#bcc8d0]">
            {mode === 'login' && 'Synchronize your neural credentials with the Cyber Grid.'}
            {mode === 'register' && 'Enroll as a cyber cadet and start acquiring XP & skills.'}
            {mode === 'reset' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-950/60 border border-red-500/50 text-xs text-red-200 flex items-center gap-2">
            <span>⚠</span>
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded bg-emerald-950/60 border border-[#5eecaf]/50 text-xs text-[#5eecaf] flex items-center gap-2">
            <span>✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#86929a] mb-1">
                Operative Codename (Username)
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. CyberViper99"
                className="w-full px-3 py-2 bg-[#191b23] border border-[#3d484f] rounded text-sm text-white focus:outline-none focus:border-[#00c6ff] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#86929a] mb-1">
              Neural Relay (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operative@devquest.io"
              className="w-full px-3 py-2 bg-[#191b23] border border-[#3d484f] rounded text-sm text-white focus:outline-none focus:border-[#00c6ff] transition-colors"
            />
          </div>

          {mode !== 'reset' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] uppercase tracking-wider text-[#86929a]">
                  Cipher Key (Password)
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-[10px] text-[#00c6ff] hover:underline"
                  >
                    Forgot Key?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-[#191b23] border border-[#3d484f] rounded text-sm text-white focus:outline-none focus:border-[#00c6ff] transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#38d4ff] hover:to-[#1a82ff] text-black font-bold text-xs uppercase tracking-wider rounded transition-all shadow-[0_0_20px_rgba(0,198,255,0.4)] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Processing Neural Link...
              </span>
            ) : mode === 'login' ? (
              'INITIALIZE SESSION'
            ) : mode === 'register' ? (
              'FORGE OPERATIVE PROFILE'
            ) : (
              'TRANSMIT RECOVERY LINK'
            )}
          </button>
        </form>

        {/* Footer Toggles */}
        <div className="mt-6 pt-4 border-t border-[#1d1f27] text-center text-xs text-[#86929a]">
          {mode === 'login' ? (
            <p>
              New to DevQuest?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-[#00c6ff] hover:underline font-bold"
              >
                Create an Operative Profile
              </button>
            </p>
          ) : (
            <p>
              Already an Operative?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-[#00c6ff] hover:underline font-bold"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
