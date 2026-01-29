import React from 'react';
import { ThreeBackground } from './ThreeBackground';

interface LandingViewProps {
  onStart: () => void;
  onStartOnboarding?: () => void;
  onNeedAuth?: () => void; // Called when user needs to login/register
  userId?: string;
  isLoggedIn?: boolean;
}

export const LandingView: React.FC<LandingViewProps> = ({ onStart, onStartOnboarding, onNeedAuth, userId, isLoggedIn = false }) => {
  // Check if user has profile in localStorage (user-specific)
  const hasProfile = (): boolean => {
    if (!userId) return false;
    try {
      return !!localStorage.getItem(`publicProfile_${userId}`);
    } catch {
      return false;
    }
  };

  const handleStartClick = () => {
    if (!isLoggedIn) {
      // Not logged in: go to registration/login
      if (onNeedAuth) {
        onNeedAuth();
      }
    } else if (hasProfile()) {
      // Logged in with profile: go directly to MY_MAP
      onStart();
    } else if (onStartOnboarding) {
      // Logged in without profile: go to onboarding
      onStartOnboarding();
    } else {
      // Fallback: go to MY_MAP
      onStart();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-white overflow-hidden bg-space-950">
      <ThreeBackground />

      <div className="absolute inset-0 bg-space-950/40 z-0 pointer-events-none radial-gradient-overlay"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-lg w-full text-center p-6 animate-fade-in -mt-20">
        <div className="w-32 h-32 relative animate-float group cursor-pointer">
          <div className="absolute inset-0 bg-nebula-pink/20 blur-[40px] rounded-full group-hover:bg-nebula-pink/30 transition-all duration-700"></div>

          <div className="w-full h-full rounded-full border border-white/10 bg-space-900/40 backdrop-blur-md flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(244,114,182,0.1)]">
            <div className="absolute inset-0 overflow-hidden opacity-50">
              <svg className="w-full h-full absolute inset-0">
                <defs>
                  <linearGradient id="speedLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[...Array(5)].map((_, i) => (
                  <rect
                    key={i}
                    x="-100"
                    y={Math.random() * 200}
                    width={Math.random() * 80 + 20}
                    height="1"
                    fill="url(#speedLineGrad)"
                    opacity="0.4"
                  >
                    <animate
                      attributeName="x"
                      from="200"
                      to="-100"
                      dur={`${Math.random() * 1 + 0.5}s`}
                      repeatCount="indefinite"
                      begin={`${Math.random()}s`}
                    />
                  </rect>
                ))}
              </svg>
            </div>

            <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
              <defs>
                <filter id="pinkGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <g
                transform="translate(48, 45)"
                stroke="#F472B6"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#pinkGlow)"
              >
                <circle cx="50" cy="30" r="12" fill="#05050A" />

                <path d="M50 42 L 55 80" />

                <path d="M55 80 L 80 70 L 85 95">
                  <animate
                    attributeName="d"
                    values="
                            M55 80 L 80 70 L 85 95; 
                            M55 80 L 75 90 L 65 110; 
                            M55 80 L 40 90 L 25 80; 
                            M55 80 L 60 70 L 70 60; 
                            M55 80 L 80 70 L 85 95"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>

                <path d="M55 80 L 30 90 L 20 80">
                  <animate
                    attributeName="d"
                    values="
                            M55 80 L 30 90 L 20 80; 
                            M55 80 L 40 70 L 50 60; 
                            M55 80 L 80 70 L 85 95; 
                            M55 80 L 75 90 L 65 110; 
                            M55 80 L 30 90 L 20 80"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>

                <path d="M52 50 L 75 45 L 85 35">
                  <animate
                    attributeName="d"
                    values="
                            M52 50 L 75 45 L 85 35; 
                            M52 50 L 60 60 L 55 75; 
                            M52 50 L 30 60 L 25 50; 
                            M52 50 L 40 45 L 35 35; 
                            M52 50 L 75 45 L 85 35"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>

                <path d="M52 50 L 30 60 L 25 50">
                  <animate
                    attributeName="d"
                    values="
                            M52 50 L 30 60 L 25 50; 
                            M52 50 L 40 45 L 35 35; 
                            M52 50 L 75 45 L 85 35; 
                            M52 50 L 60 60 L 55 75; 
                            M52 50 L 30 60 L 25 50"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>

              <line
                x1="20"
                y1="160"
                x2="180"
                y2="160"
                stroke="#F472B6"
                strokeWidth="1"
                strokeDasharray="10 30"
                opacity="0.3"
              >
                <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.5s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/60 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            On Her Way
          </h1>
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto"></div>

          <p className="text-blue-100/90 text-sm md:text-base font-light tracking-[0.05em] max-w-xs md:max-w-md mx-auto">
            AI 驱动的女性职业生涯“第一步”行动社区
          </p>
        </div>

        <div className="pt-6">
          <button onClick={handleStartClick} className="group relative px-10 py-3.5 rounded-full overflow-hidden transition-all duration-300 hover:scale-105">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-purple/30 to-nebula-pink/30 opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>

            <span className="relative flex items-center gap-3 text-white text-xs md:text-sm font-bold tracking-widest uppercase">
              开始探索
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
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[9px] text-white/20 tracking-widest z-10">DESIGNED FOR 我们</div>
    </div>
  );
};

