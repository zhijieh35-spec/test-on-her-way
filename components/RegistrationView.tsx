import React, { useState } from 'react';
import { User, RegisterRequest, RegisterResponse } from '../types';
import { getAvatarForUser } from '../onHerWay/utils/avatars';

interface RegistrationViewProps {
  onRegister: (user: User) => void;
  onRegisterApi?: (data: RegisterRequest) => Promise<RegisterResponse>;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onRegister, onRegisterApi }) => {
  const [nickname, setNickname] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ nickname?: string; account?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fixed avatar placeholder - will be replaced with user-specific avatar after registration
  const fixedAvatar = getAvatarForUser('default_registration');

  const generateUserId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `user_${timestamp}_${random}`;
  };

  const validateForm = (): boolean => {
    const newErrors: { nickname?: string; account?: string; password?: string } = {};

    if (!nickname.trim()) {
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

    const userId = generateUserId();
    const newUser: User = {
      id: userId,
      nickname: nickname.trim(),
      account: account.trim(),
      password: password.trim(),
      avatar: fixedAvatar,
    };

    // If API provided, call it first
    if (onRegisterApi) {
      setIsLoading(true);
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
        // Use server-provided userId if available
        if (response.userId) {
          newUser.id = response.userId;
        }
      } catch {
        setErrors({ account: '网络错误，请重试' });
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    // Show success state briefly
    setIsSuccess(true);

    // Store user data in localStorage
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    localStorage.setItem('userId', newUser.id);

    // Navigate after brief delay to show success
    setTimeout(() => {
      onRegister(newUser);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden bg-space-950">
      <div className="absolute inset-0 bg-space-950/40 z-0 pointer-events-none radial-gradient-overlay"></div>

      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md w-full text-center p-6 animate-fade-in">
        {/* Fixed Avatar */}
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
            注册账号
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>
          <p className="text-blue-100/90 text-sm font-light tracking-[0.05em]">
            创建您的账号，开始探索之旅
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Nickname Field */}
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
                  注册中...
                </>
              ) : isSuccess ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  注册成功
                </>
              ) : (
                <>
                  注册
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
        </form>
      </div>

      <div className="absolute bottom-8 text-[9px] text-white/20 tracking-widest z-10">DESIGNED FOR 我们</div>
    </div>
  );
};

