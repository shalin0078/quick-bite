import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { generateUserId, sha256 } from '../services/cryptoUtils';
import { emailService } from '../services/emailService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Default seed users for immediate evaluation & testing
const DEFAULT_USERS = [
  {
    id: 'cust-1',
    customUserId: 'QB-CUST-849201',
    fullName: 'Shalin Rathod',
    email: 'shalin@example.com',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', // sha256('password123')
    phone: '+91 98765 43210',
    role: 'customer',
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'rider-1',
    customUserId: 'QB-RIDER-392011',
    fullName: 'Ramesh Kumar',
    email: 'ramesh.rider@quickbite.in',
    passwordHash: '725902b4bb797db2445cc33633ab0a9058b8f80ee0e8f7cb0eb52d5e75143003', // sha256('rider123')
    phone: '+91 98250 12345',
    role: 'delivery_partner',
    vehicleType: 'TVS Ntorq 125 (Scooter)',
    bikeNumber: 'GJ-06-BQ-4912',
    rating: 4.9,
    availability: 'available',
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'admin-1',
    customUserId: 'QB-ADMIN-000001',
    fullName: 'QuickBite Operations Lead',
    email: 'admin@quickbite.in',
    passwordHash: '0192023a7bbd73250516f069df18b500ee06497f56eb7223b9d0e2e50570b741', // sha256('admin123')
    phone: '+91 99999 88888',
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider = ({ children }) => {
  // Users directory stored locally
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  // Current active logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_active_user');
      // Default to Shalin Rathod as initial customer session
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync users to storage
  useEffect(() => {
    localStorage.setItem('quickbite_registered_users', JSON.stringify(users));
  }, [users]);

  // Sync active user session to storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('quickbite_active_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('quickbite_active_user');
    }
  }, [currentUser]);

  // Supabase Auth listener if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // Sync with local record
          const found = users.find(u => u.email === session.user.email);
          if (found) {
            setCurrentUser(found);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const found = users.find(u => u.email === session.user.email);
          if (found) setCurrentUser(found);
        } else {
          // If Supabase signed out
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [users]);

  // 1. LOGIN
  const login = async ({ emailOrId, password, rememberMe = true }) => {
    setIsLoading(true);
    const cleanId = emailOrId.trim().toLowerCase();
    const hash = await sha256(password);

    try {
      // If remote Supabase is configured
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanId,
          password
        });
        if (error) {
          console.warn('Supabase auth returned error, falling back to local user store', error.message);
        }
      }

      // Check local user directory
      const user = users.find(u =>
        u.email.toLowerCase() === cleanId ||
        u.customUserId.toLowerCase() === cleanId
      );

      if (!user) {
        setIsLoading(false);
        return { success: false, message: 'No account found with this email or User ID.' };
      }

      if (user.passwordHash !== hash) {
        setIsLoading(false);
        return { success: false, message: 'Invalid password. Please try again.' };
      }

      setCurrentUser(user);
      setIsLoading(false);
      return { success: true, user };
    } catch (err) {
      setIsLoading(false);
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  // 2. REGISTER
  const register = async ({ fullName, email, password, role = 'customer' }) => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const hash = await sha256(password);

    // Check duplicate
    const exists = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      setIsLoading(false);
      return { success: false, message: 'An account with this email address already exists. Please login.' };
    }

    const customUserId = generateUserId(role);
    const newUser = {
      id: `usr-${Date.now()}`,
      customUserId,
      fullName: fullName.trim(),
      email: cleanEmail,
      passwordHash: hash,
      phone: '',
      role,
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };

    // If Supabase configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: fullName, custom_user_id: customUserId, role }
          }
        });
      } catch (err) {
        console.warn('Supabase sign up failed', err);
      }
    }

    // Save to users list
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Send welcome email
    await emailService.sendWelcomeVerificationEmail({
      customerName: newUser.fullName,
      customerEmail: newUser.email,
      customUserId: newUser.customUserId
    });

    setIsLoading(false);
    return { success: true, user: newUser };
  };

  // 3. LOGOUT
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase sign out error', e);
      }
    }
    setCurrentUser(null);
  };

  // 4. FORGOT PASSWORD
  const requestPasswordReset = async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'No registered customer account found with this email.' };
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem(`quickbite_reset_${cleanEmail}`, resetToken);

    await emailService.sendPasswordResetEmail({
      customerEmail: cleanEmail,
      resetToken
    });

    return {
      success: true,
      message: `Password reset code sent to ${cleanEmail}. Please check your inbox.`
    };
  };

  // 5. RESET PASSWORD
  const resetPassword = async ({ email, token, newPassword }) => {
    const cleanEmail = email.trim().toLowerCase();
    const storedToken = localStorage.getItem(`quickbite_reset_${cleanEmail}`);

    if (!storedToken || storedToken !== token.trim()) {
      return { success: false, message: 'Invalid or expired password reset token.' };
    }

    const newHash = await sha256(newPassword);
    setUsers(prev =>
      prev.map(u => u.email.toLowerCase() === cleanEmail ? { ...u, passwordHash: newHash } : u)
    );

    if (currentUser?.email?.toLowerCase() === cleanEmail) {
      setCurrentUser(prev => ({ ...prev, passwordHash: newHash }));
    }

    localStorage.removeItem(`quickbite_reset_${cleanEmail}`);
    return { success: true, message: 'Password has been reset successfully! You can now log in.' };
  };

  // 6. UPDATE PROFILE
  const updateProfile = ({ fullName, phone }) => {
    if (!currentUser) return false;
    const updated = {
      ...currentUser,
      fullName: fullName.trim() || currentUser.fullName,
      phone: phone.trim() || currentUser.phone
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    return true;
  };

  // 7. DEMO ROLE SWITCHER (For rapid testing in review/dev)
  const switchDemoRole = (role) => {
    const target = users.find(u => u.role === role) || DEFAULT_USERS.find(u => u.role === role);
    if (target) {
      setCurrentUser(target);
      return target;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isCustomer: currentUser?.role === 'customer',
        isDeliveryPartner: currentUser?.role === 'delivery_partner',
        isAdmin: currentUser?.role === 'admin',
        isLoading,
        users,
        login,
        register,
        logout,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
