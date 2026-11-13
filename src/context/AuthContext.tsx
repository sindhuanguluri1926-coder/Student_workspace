import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../types/system';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: 'admin' | 'student' | null;
  isAdmin: boolean;
  isStudent: boolean;
  isLoading: boolean;
  loginAdmin: (adminId: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginStudent: (registrationNumber: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerStudent: (formData: {
    name: string;
    registrationNumber: string;
    email: string;
    password: string;
    department?: string;
    className?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUserDirectly: (user: User, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('exam_sys_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('exam_sys_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Set default axios header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('exam_sys_token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('exam_sys_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('exam_sys_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('exam_sys_user');
    }
    setIsLoading(false);
  }, [user]);

  const loginAdmin = async (adminId: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/admin/login', { adminId, password });
      if (res.data.success) {
        localStorage.setItem('exam_sys_user', JSON.stringify(res.data.user));
        localStorage.setItem('exam_sys_token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setToken(res.data.token);
        setIsLoading(false);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Connection error',
      };
    }
  };

  const loginStudent = async (registrationNumber: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/student/login', {
        registrationNumber,
        identifier: registrationNumber,
        password,
      });
      if (res.data.success) {
        localStorage.setItem('exam_sys_user', JSON.stringify(res.data.user));
        localStorage.setItem('exam_sys_token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setToken(res.data.token);
        setIsLoading(false);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Connection error',
      };
    }
  };

  const registerStudent = async (formData: {
    name: string;
    registrationNumber: string;
    email: string;
    password: string;
    department?: string;
    className?: string;
  }) => {
    try {
      const res = await axios.post('/api/auth/student/register', formData);
      if (res.data.success) {
        localStorage.setItem('exam_sys_user', JSON.stringify(res.data.user));
        localStorage.setItem('exam_sys_token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data.user);
        setToken(res.data.token);
        setIsLoading(false);
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Connection error',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('exam_sys_user');
    localStorage.removeItem('exam_sys_token');
  };

  const setUserDirectly = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isStudent = role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAdmin,
        isStudent,
        isLoading,
        loginAdmin,
        loginStudent,
        registerStudent,
        logout,
        setUserDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
