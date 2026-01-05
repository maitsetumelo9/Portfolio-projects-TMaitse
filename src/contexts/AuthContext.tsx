import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_USERS = [
  { id: 'admin', email: 'admin@phoenixea.com', password: 'Phoenix2024!', name: 'Admin' },
  { id: 'trader', email: 'trader@phoenixea.com', password: 'Trader2024!', name: 'Trader' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('phoenix_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('phoenix_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    // Check custom registered users
    const registeredUsers = JSON.parse(localStorage.getItem('phoenix_registered_users') || '[]');
    const customUser = registeredUsers.find((u: any) => u.email === email && u.password === password);
    
    if (customUser) {
      const userData = { id: customUser.id, email: customUser.email, name: customUser.name };
      setUser(userData);
      localStorage.setItem('phoenix_user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = JSON.parse(localStorage.getItem('phoenix_registered_users') || '[]');
    
    // Check if email already exists
    if (registeredUsers.some((u: any) => u.email === email) || DEMO_USERS.some(u => u.email === email)) {
      setIsLoading(false);
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('phoenix_registered_users', JSON.stringify(registeredUsers));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userData);
    localStorage.setItem('phoenix_user', JSON.stringify(userData));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('phoenix_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
