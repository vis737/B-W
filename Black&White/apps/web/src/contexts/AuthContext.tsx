// apps/web/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser, useClerk, useSignIn } from '@clerk/clerk-react';
import { MOCK_CUSTOMER, MOCK_STAFF } from '../data/mockData';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'inventory' | 'support' | 'marketing' | 'finance' | 'customer';
  avatar?: string;
  customer_id?: string;
  membership_tier?: 'silver' | 'gold' | 'platinum' | 'diamond';
}

interface AuthContextType {
  // Customer State
  customer: User | null;
  isCustomerLoggedIn: boolean;
  loginCustomer: (email: string, pass: string, remember: boolean) => Promise<boolean>;
  signupCustomer: (data: { firstName: string; lastName: string; email: string; phone: string; pass: string }) => Promise<boolean>;
  logoutCustomer: () => void;
  isCustomerModalOpen: boolean;
  setIsCustomerModalOpen: (open: boolean) => void;
  customerAuthTab: 'signin' | 'signup' | 'forgot';
  setCustomerAuthTab: (tab: 'signin' | 'signup' | 'forgot') => void;

  // Clerk Integration Helpers
  isClerkConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;

  // Secret Admin State
  adminUser: User | null;
  isAdminAuthenticated: boolean;
  secretAdminRole: string;
  loginSecretAdmin: (user: string, pass: string, remember: boolean) => Promise<boolean>;
  logoutAdmin: () => void;
  isSecretAdminModalOpen: boolean;
  setIsSecretAdminModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const IS_CLERK_KEY_SET = !!(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY &&
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY !== 'pk_test_sample_key_here'
);

// Inner provider used when ClerkProvider is active
const ClerkAuthProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isSignedIn, user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { signIn } = useSignIn();

  const [localCustomer, setLocalCustomer] = useState<User | null>(() => {
    const saved = localStorage.getItem('bw_customer_user') || sessionStorage.getItem('bw_customer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bw_admin_token') || sessionStorage.getItem('bw_admin_token');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerAuthTab, setCustomerAuthTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);

  // Derive active customer from Clerk user when signed in via Clerk
  const activeCustomer: User | null = (isSignedIn && clerkUser)
    ? {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.primaryEmailAddress?.emailAddress.split('@')[0] || 'VIP Member',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        role: 'customer',
        avatar: clerkUser.imageUrl,
        customer_id: (clerkUser.publicMetadata?.customer_id as string) || `BW-VIP-${clerkUser.id.slice(-4).toUpperCase()}`,
        membership_tier: (clerkUser.publicMetadata?.membership_tier as any) || 'platinum',
      }
    : localCustomer;

  const signInWithGoogle = async () => {
    if (!signIn) return;
    await signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  const signInWithApple = async () => {
    if (!signIn) return;
    await signIn.authenticateWithRedirect({
      strategy: 'oauth_apple',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  const loginCustomer = async (email: string, _pass: string, remember: boolean): Promise<boolean> => {
    const loggedUser: User = {
      id: 'cust-101',
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'customer',
      customer_id: 'BW-VIP-881',
      membership_tier: 'platinum',
    };
    setLocalCustomer(loggedUser);
    if (remember) {
      localStorage.setItem('bw_customer_user', JSON.stringify(loggedUser));
    } else {
      sessionStorage.setItem('bw_customer_user', JSON.stringify(loggedUser));
    }
    setIsCustomerModalOpen(false);
    return true;
  };

  const signupCustomer = async (data: { firstName: string; lastName: string; email: string; phone: string; pass: string }): Promise<boolean> => {
    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: 'customer',
      customer_id: `BW-CUST-${Math.floor(Math.random() * 9000 + 1000)}`,
      membership_tier: 'silver',
    };
    setLocalCustomer(newUser);
    localStorage.setItem('bw_customer_user', JSON.stringify(newUser));
    setIsCustomerModalOpen(false);
    return true;
  };

  const logoutCustomer = () => {
    if (isSignedIn) {
      signOut();
    }
    setLocalCustomer(null);
    localStorage.removeItem('bw_customer_user');
    sessionStorage.removeItem('bw_customer_user');
  };

  const loginSecretAdmin = async (username: string, pass: string, remember: boolean): Promise<boolean> => {
    if ((username === 'admin' || username === 'superadmin' || username === 'concierge') && pass === 'admin123') {
      const staffMatch = MOCK_STAFF.find((s) => s.email.includes(username)) || MOCK_STAFF[0];
      const authenticatedAdmin: User = {
        id: staffMatch.id,
        name: staffMatch.name,
        email: staffMatch.email,
        role: (staffMatch.role as any) || 'super_admin',
      };
      setAdminUser(authenticatedAdmin);
      if (remember) {
        localStorage.setItem('bw_admin_token', JSON.stringify(authenticatedAdmin));
      } else {
        sessionStorage.setItem('bw_admin_token', JSON.stringify(authenticatedAdmin));
      }
      setIsSecretAdminModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('bw_admin_token');
    sessionStorage.removeItem('bw_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        customer: activeCustomer,
        isCustomerLoggedIn: !!activeCustomer,
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        customerAuthTab,
        setCustomerAuthTab,

        isClerkConfigured: true,
        signInWithGoogle,
        signInWithApple,

        adminUser,
        isAdminAuthenticated: !!adminUser,
        secretAdminRole: adminUser?.role || 'super_admin',
        loginSecretAdmin,
        logoutAdmin,
        isSecretAdminModalOpen,
        setIsSecretAdminModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Fallback provider used when Clerk key is not set yet
const MockAuthProviderInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<User | null>(() => {
    const saved = localStorage.getItem('bw_customer_user') || sessionStorage.getItem('bw_customer_user');
    return saved ? JSON.parse(saved) : {
      id: MOCK_CUSTOMER.id,
      name: MOCK_CUSTOMER.full_name,
      email: MOCK_CUSTOMER.email,
      role: 'customer',
      customer_id: MOCK_CUSTOMER.customer_id,
      membership_tier: MOCK_CUSTOMER.membership_tier,
    };
  });

  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bw_admin_token') || sessionStorage.getItem('bw_admin_token');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerAuthTab, setCustomerAuthTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [isSecretAdminModalOpen, setIsSecretAdminModalOpen] = useState(false);

  const signInWithGoogle = async () => {
    console.warn('Clerk publishable key missing in .env. Falling back to mock login.');
    const mockUser: User = {
      id: 'google-user-1',
      name: 'Google User',
      email: 'user.google@luxury.com',
      role: 'customer',
      customer_id: 'BW-GOOG-991',
      membership_tier: 'gold',
    };
    setCustomer(mockUser);
    localStorage.setItem('bw_customer_user', JSON.stringify(mockUser));
    setIsCustomerModalOpen(false);
  };

  const signInWithApple = async () => {
    console.warn('Clerk publishable key missing in .env. Falling back to mock login.');
    const mockUser: User = {
      id: 'apple-user-1',
      name: 'Apple User',
      email: 'user.apple@luxury.com',
      role: 'customer',
      customer_id: 'BW-APPL-771',
      membership_tier: 'platinum',
    };
    setCustomer(mockUser);
    localStorage.setItem('bw_customer_user', JSON.stringify(mockUser));
    setIsCustomerModalOpen(false);
  };

  const loginCustomer = async (email: string, _pass: string, remember: boolean): Promise<boolean> => {
    const loggedUser: User = {
      id: 'cust-101',
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'customer',
      customer_id: 'BW-VIP-881',
      membership_tier: 'platinum',
    };
    setCustomer(loggedUser);
    if (remember) {
      localStorage.setItem('bw_customer_user', JSON.stringify(loggedUser));
    } else {
      sessionStorage.setItem('bw_customer_user', JSON.stringify(loggedUser));
    }
    setIsCustomerModalOpen(false);
    return true;
  };

  const signupCustomer = async (data: { firstName: string; lastName: string; email: string; phone: string; pass: string }): Promise<boolean> => {
    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      role: 'customer',
      customer_id: `BW-CUST-${Math.floor(Math.random() * 9000 + 1000)}`,
      membership_tier: 'silver',
    };
    setCustomer(newUser);
    localStorage.setItem('bw_customer_user', JSON.stringify(newUser));
    setIsCustomerModalOpen(false);
    return true;
  };

  const logoutCustomer = () => {
    setCustomer(null);
    localStorage.removeItem('bw_customer_user');
    sessionStorage.removeItem('bw_customer_user');
  };

  const loginSecretAdmin = async (username: string, pass: string, remember: boolean): Promise<boolean> => {
    if ((username === 'admin' || username === 'superadmin' || username === 'concierge') && pass === 'admin123') {
      const staffMatch = MOCK_STAFF.find((s) => s.email.includes(username)) || MOCK_STAFF[0];
      const authenticatedAdmin: User = {
        id: staffMatch.id,
        name: staffMatch.name,
        email: staffMatch.email,
        role: (staffMatch.role as any) || 'super_admin',
      };
      setAdminUser(authenticatedAdmin);
      if (remember) {
        localStorage.setItem('bw_admin_token', JSON.stringify(authenticatedAdmin));
      } else {
        sessionStorage.setItem('bw_admin_token', JSON.stringify(authenticatedAdmin));
      }
      setIsSecretAdminModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('bw_admin_token');
    sessionStorage.removeItem('bw_admin_token');
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        isCustomerLoggedIn: !!customer,
        loginCustomer,
        signupCustomer,
        logoutCustomer,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
        customerAuthTab,
        setCustomerAuthTab,

        isClerkConfigured: false,
        signInWithGoogle,
        signInWithApple,

        adminUser,
        isAdminAuthenticated: !!adminUser,
        secretAdminRole: adminUser?.role || 'super_admin',
        loginSecretAdmin,
        logoutAdmin,
        isSecretAdminModalOpen,
        setIsSecretAdminModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  if (IS_CLERK_KEY_SET) {
    return <ClerkAuthProviderInner>{children}</ClerkAuthProviderInner>;
  }
  return <MockAuthProviderInner>{children}</MockAuthProviderInner>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
