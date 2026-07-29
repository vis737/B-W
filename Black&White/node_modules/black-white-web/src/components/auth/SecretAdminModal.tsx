// apps/web/src/components/auth/SecretAdminModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

export const SecretAdminModal: React.FC = () => {
  const { isSecretAdminModalOpen, setIsSecretAdminModalOpen, loginSecretAdmin } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [rememberDevice, setRememberDevice] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!isSecretAdminModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(async () => {
      const success = await loginSecretAdmin(username, password, rememberDevice);
      setIsLoading(false);
      if (success) {
        showToast('Administrator session established. Redirecting...', 'success', 'Secret Access Granted');
        navigate('/admin');
      } else {
        setErrorMessage('Invalid administrator credentials or unauthorized key token.');
      }
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-zinc-950 border border-amber-500/40 p-8 rounded-2xl shadow-2xl shadow-amber-500/10 space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/10 border border-amber-500/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-amber-400">Restricted Access</span>
            <h2 className="text-2xl font-serif font-black uppercase text-white tracking-wide">Executive Portal</h2>
            <p className="text-xs text-zinc-400 font-light">Enter high-security credentials to access store control.</p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded text-red-400 text-xs font-mono text-center">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Username / ID</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-amber-400 font-mono transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-zinc-400 uppercase font-mono text-[10px]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-mono text-amber-400 hover:text-white uppercase"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-amber-400 font-mono transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <span>Remember Device</span>
              </label>
              <span className="text-zinc-600 hover:text-zinc-400 cursor-pointer">Security Key?</span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsSecretAdminModalOpen(false)}
                className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold uppercase tracking-wider rounded-lg hover:bg-zinc-800 transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 bg-amber-400 text-black font-bold uppercase tracking-wider rounded-lg hover:bg-white transition-colors text-xs flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Authorize & Login'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SecretAdminModal;
