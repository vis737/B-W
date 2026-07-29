// apps/web/src/components/auth/CustomerAuthModal.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerModalOpen,
    setIsCustomerModalOpen,
    customerAuthTab,
    setCustomerAuthTab,
    loginCustomer,
    signupCustomer,
    signInWithGoogle,
    signInWithApple,
  } = useAuth();

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('alexander.sterling@luxury.com');
  const [signInPass, setSignInPass] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showSignInPass, setShowSignInPass] = useState(false);

  // Sign Up Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [signUpPass, setSignUpPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

  // General State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!isCustomerModalOpen) return null;

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await loginCustomer(signInEmail, signInPass, rememberMe);
      setIsLoading(false);
      showToast('Welcome back to Black & White Private Reserve.', 'success', 'Sign In Successful');
      navigate('/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Failed to sign in. Please try again.');
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (signUpPass !== confirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (signUpPass.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('You must accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      await signupCustomer({ firstName, lastName, email: signUpEmail, phone, pass: signUpPass });
      setIsLoading(false);
      showToast('Account created successfully. Welcome to B&W Society.', 'success', 'Registration Complete');
      navigate('/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Failed to register account.');
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Google') {
      showToast('Connecting securely with Google via Clerk...', 'info', 'Google Sign-In');
      await signInWithGoogle();
      return;
    }
    if (provider === 'Apple') {
      showToast('Connecting securely with Apple ID via Clerk...', 'info', 'Apple Sign-In');
      await signInWithApple();
      return;
    }

    showToast(`Authenticating securely with ${provider}...`, 'info', 'Social Connect');
    await loginCustomer(`patron.${provider.toLowerCase()}@luxury.com`, 'social123', true);
    showToast(`Logged in via ${provider}.`, 'success', 'Authenticated');
    navigate('/dashboard');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 p-8 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={() => setIsCustomerModalOpen(false)}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>

          {/* Header Tabs */}
          <div className="text-center space-y-2">
            <span className="text-amber-400 font-mono text-[10px] uppercase tracking-[0.4em]">B&W Society</span>
            <h2 className="text-2xl font-serif font-black uppercase text-white tracking-wide">
              {customerAuthTab === 'signin' && 'Patron Sign In'}
              {customerAuthTab === 'signup' && 'Create VIP Account'}
              {customerAuthTab === 'forgot' && 'Reset Password'}
            </h2>
            <div className="flex justify-center border-b border-zinc-800 pt-4">
              <button
                onClick={() => { setCustomerAuthTab('signin'); setErrorMsg(''); }}
                className={`px-6 py-2 text-xs font-mono uppercase font-bold border-b-2 transition-colors ${
                  customerAuthTab === 'signin' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setCustomerAuthTab('signup'); setErrorMsg(''); }}
                className={`px-6 py-2 text-xs font-mono uppercase font-bold border-b-2 transition-colors ${
                  customerAuthTab === 'signup' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-800/80 rounded text-red-400 text-xs font-mono text-center">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: SIGN IN */}
          {customerAuthTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="alexander.sterling@luxury.com"
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-zinc-400 uppercase font-mono text-[10px]">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowSignInPass(!showSignInPass)}
                    className="text-[10px] font-mono text-amber-400 hover:text-white uppercase"
                  >
                    {showSignInPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showSignInPass ? 'text' : 'password'}
                  required
                  value={signInPass}
                  onChange={(e) => setSignInPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomerAuthTab('forgot')}
                  className="text-amber-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Access Account'}
              </button>

              {/* Social Login */}
              <div className="pt-4 border-t border-zinc-800 text-center space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-500">Or Connect via Concierge SSO</span>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="py-2.5 bg-black border border-zinc-800 rounded text-zinc-300 hover:border-zinc-600 font-mono text-[11px]"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Apple')}
                    className="py-2.5 bg-black border border-zinc-800 rounded text-zinc-300 hover:border-zinc-600 font-mono text-[11px]"
                  >
                    Apple ID
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="py-2.5 bg-black border border-zinc-800 rounded text-zinc-300 hover:border-zinc-600 font-mono text-[11px]"
                  >
                    Facebook
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SIGN UP */}
          {customerAuthTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Julian"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="julian@luxury.com"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 902-1100"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signUpPass}
                    onChange={(e) => setSignUpPass(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-black border border-zinc-800 p-2.5 rounded-lg text-white outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Date of Birth (Opt)</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-2 rounded-lg text-zinc-300 outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Gender (Opt)</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-black border border-zinc-800 p-2 rounded-lg text-zinc-300 outline-none"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-[11px] font-mono text-zinc-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>I agree to B&W Terms of Service & Privacy Policy</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="accent-amber-400 rounded"
                  />
                  <span>Subscribe to Private Gazette & VIP drops</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Register B&W VIP Account'}
              </button>
            </form>
          )}

          {/* TAB 3: FORGOT PASSWORD */}
          {customerAuthTab === 'forgot' && (
            <div className="space-y-4 text-xs font-sans">
              <p className="text-zinc-400">Enter your registered email address and our concierge will send you a password reset link.</p>
              <div>
                <label className="text-zinc-400 uppercase font-mono text-[10px] block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alexander@luxury.com"
                  className="w-full bg-black border border-zinc-800 p-3 rounded-lg text-white outline-none focus:border-amber-400"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  showToast('Password reset link sent to your email.', 'success', 'Link Sent');
                  setCustomerAuthTab('signin');
                }}
                className="w-full py-3 bg-amber-400 text-black font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-colors"
              >
                Send Recovery Instructions
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerAuthModal;
