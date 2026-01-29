import React, { useState } from 'react';
import { User, RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '../types';

type AuthMode = 'login' | 'register';

interface AuthViewProps {
  onAuth: (user: User, hasProfile: boolean) => void;
  onRegisterApi?: (data: RegisterRequest) => Promise<RegisterResponse>;
  onLoginApi?: (data: LoginRequest) => Promise<LoginResponse>;
}

export const AuthView: React.FC<AuthViewProps> = ({ onAuth, onRegisterApi, onLoginApi }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [nickname, setNickname] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ nickname?: string; account?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fixed avatar placeholder
  const fixedAvatar = 'https://i.pravatar.cc/150?u=default';

  const generateUserId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `user_${timestamp}_${random}`;
  };

  const checkHasProfile = (userId: string): boolean => {
    try {
      return !!localStorage.getItem(`publicProfile_${userId}`);
    } catch {
      return false;
    }
  };

  // Get registered users from localStorage
  const getRegisteredUsers = (): User[] => {
    try {
      const users = localStorage.getItem('registeredUsers');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  // Save user to registered users list
  const saveRegisteredUser = (user: User) => {
    const users = getRegisteredUsers();
    // Check if user already exists (by account)
    const existingIndex = users.findIndex(u => u.account === user.account);
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  // Find user by account and password
  const findRegisteredUser = (account: string, password: string): User | null => {
    const users = getRegisteredUsers();
    return users.find(u => u.account === account && u.password === password) || null;
  };

  const validateForm = (): boolean => {
    const newErrors: { nickname?: string; account?: string; password?: string } = {};

    if (mode === 'register' && !nickname.trim()) {
      newErrors.nickname = '请输入昵称';
    }
    if (!account.trim()) {
      newErrors.account = '请输入账号';
    }
    if (!password.trim()) {
      newErrors.password = '请输入密码';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    if (mode === 'register') {
      // Registration flow
      const userId = generateUserId();
      const newUser: User = {
        id: userId,
        nickname: nickname.trim(),
        account: account.trim(),
        password: password.trim(),
        avatar: fixedAvatar,
      };

      if (onRegisterApi) {
        try {
          const response = await onRegisterApi({
            nickname: nickname.trim(),
            account: account.trim(),
            password: password.trim(),
          });
          if (!response.success) {
            setErrors({ account: response.error || '注册失败，请重试' });
            setIsLoading(false);
            return;
          }
          if (response.userId) {
            newUser.id = response.userId;
          }
        } catch {
          setErrors({ account: '网络错误，请重试' });
          setIsLoading(false);
          return;
        }
      }

      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      localStorage.setItem('userId', newUser.id);
      // Also save to registered users list for future logins
      saveRegisteredUser(newUser);

      setIsSuccess(true);
      setIsLoading(false);

      // Navigate after brief delay
      setTimeout(() => {
        onAuth(newUser, false); // New user has no profile
      }, 500);
    } else {
      // Login flow
      if (onLoginApi) {
        try {
          const response = await onLoginApi({
            account: account.trim(),
            password: password.trim(),
          });
          if (!response.success || !response.user) {
            setErrors({ account: response.error || '登录失败，账号或密码错误' });
            setIsLoading(false);
            return;
          }

          // Store user data in localStorage
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('userId', response.user.id);

          setIsSuccess(true);
          setIsLoading(false);

          // Check if user has profile and navigate
          const hasProfile = checkHasProfile(response.user.id);
          setTimeout(() => {
            onAuth(response.user!, hasProfile);
          }, 500);
        } catch {
          setErrors({ account: '网络错误，请重试' });
          setIsLoading(false);
          return;
        }
      } else {
        // Mock login: check registeredUsers list
        const user = findRegisteredUser(account.trim(), password.trim());
        if (user) {
          // Store as current session
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('userId', user.id);

          setIsSuccess(true);
          setIsLoading(false);

          const hasProfile = checkHasProfile(user.id);
          setTimeout(() => {
            onAuth(user, hasProfile);
          }, 500);
        } else {
          setErrors({ account: '账号或密码错误' });
          setIsLoading(false);
        }
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden bg-space-950">
      <div className="absolute inset-0 bg-space-950/40 z-0 pointer-events-none radial-gradient-overlay"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full text-center p-6 animate-fade-in">
        {/* Avatar */}
        <div className="w-32 h-32 relative animate-float">
          <div className="absolute inset-0 bg-nebula-pink/20 blur-[40px] rounded-full"></div>
          <div className="w-full h-full rounded-full border border-white/10 bg-space-900/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.1)]">
            <img
              src={fixedAvatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="font-sans text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60">
            {mode === 'login' ? '欢迎回来' : '注册账号'}
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          <p className="text-blue-100/90 text-sm font-light tracking-[0.05em]">
            {mode === 'login' ? '登录您的账号，继续探索之旅' : '创建您的账号，开始探索之旅'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Nickname Field - Only for register */}
          {mode === 'register' && (
            <div className="space-y-2">
              <label htmlFor="nickname" className="block text-left text-sm text-white/70 font-light">
                昵称
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (errors.nickname) {
                    setErrors({ ...errors, nickname: undefined });
                  }
                }}
                className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                placeholder="请输入您的昵称"
              />
              {errors.nickname && (
                <p className="text-red-400 text-xs text-left">{errors.nickname}</p>
              )}
            </div>
          )}

          {/* Account Field */}
          <div className="space-y-2">
            <label htmlFor="account" className="block text-left text-sm text-white/70 font-light">
              账号
            </label>
            <input
              id="account"
              type="text"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                if (errors.account) {
                  setErrors({ ...errors, account: undefined });
                }
              }}
              className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              placeholder="请输入您的账号"
            />
            {errors.account && (
              <p className="text-red-400 text-xs text-left">{errors.account}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-left text-sm text-white/70 font-light">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: undefined });
                }
              }}
              className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              placeholder="请输入您的密码"
            />
            {errors.password && (
              <p className="text-red-400 text-xs text-left">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className={`group relative w-full px-10 py-3.5 rounded-full overflow-hidden transition-all duration-300 mt-8 ${
              isLoading || isSuccess ? 'cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <div className={`absolute inset-0 backdrop-blur-md border transition-all ${
              isSuccess
                ? 'bg-green-500/20 border-green-400/40'
                : 'bg-white/10 border-white/20 group-hover:bg-white/20'
            }`}></div>
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-purple/30 to-nebula-pink/30 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
            <span className="relative flex items-center justify-center gap-3 text-white text-sm font-bold tracking-widest uppercase">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {mode === 'login' ? '登录中...' : '注册中...'}
                </>
              ) : isSuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {mode === 'login' ? '登录成功' : '注册成功'}
                </>
              ) : (
                <>
                  {mode === 'login' ? '登录' : '注册'}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </span>
          </button>

          {/* Toggle Mode */}
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-white/50 text-sm hover:text-white/80 transition-colors"
            >
              {mode === 'login' ? '没有账号？点击注册' : '已有账号？点击登录'}
            </button>
          </div>
        </form>
      </div>

      <div className="absolute bottom-8 text-[9px] text-white/20 tracking-widest z-10">DESIGNED FOR 我们</div>
    </div>
  );
};
