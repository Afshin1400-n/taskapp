import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const res = await axios.get('http://localhost:4000/users');
          const users = res.data;
          const user = users.find((u: any) => u.email === email);

          if (!user) {
            set({ isLoading: false });
            return { success: false, message: '❌ همچین کاربری یافت نشد' };
          }

          if (user.password !== password) {
            set({ isLoading: false });
            return { success: false, message: '❌ رمز عبور اشتباه است' };
          }

          set({ 
            user: { ...user, password: undefined }, 
            isAuthenticated: true, 
            isLoading: false 
          });
          
          return { success: true, message: '✅ ورود موفق' };

        } catch (error) {
          set({ isLoading: false });
          return { success: false, message: '❌ خطا در ارتباط با سرور' };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);