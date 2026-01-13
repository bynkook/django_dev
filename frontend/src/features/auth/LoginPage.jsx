import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/djangoApi';
import { Lock, Mail, User, Key, ShieldCheck, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    auth_key: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let data;
      if (isLoginMode) {
        data = await authApi.login({
          username: formData.username,
          password: formData.password
        });
      } else {
        data = await authApi.signup(formData);
      }

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user_id);
        localStorage.setItem('username', data.username);
        navigate('/chat');
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "인증에 실패했습니다. 정보를 확인해주세요.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-primary)] p-4">
      {/* 배경 데코레이션 (선택 사항: 은은한 그라데이션 원) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--accent-color)] rounded-full opacity-5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500 rounded-full opacity-5 blur-[100px] pointer-events-none"></div>

      {/* 메인 카드 컨테이너 */}
      <div className="relative w-full max-w-[520px] bg-[var(--bg-secondary)] rounded-3xl shadow-2xl border border-[var(--border-color)] overflow-hidden transition-all duration-300">
       
        {/* 상단 헤더 영역 */}
        <div className="px-10 pt-12 pb-8 text-center">
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            {isLoginMode
              ? 'Enter your credentials to access FabriX Agent.'
              : 'Join us to experience the power of AI Agents.'}
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mx-10 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <p className="text-red-500 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* 폼 영역 */}
        <form onSubmit={handleSubmit} className="px-10 pb-12 flex flex-col gap-5">
         
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)] transition-colors" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200"
                placeholder="Enter your ID"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)] transition-colors" size={20} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* 회원가입 추가 필드 */}
          {!isLoginMode && (
            <>
              <div className="space-y-1.5 animate-slide-in">
                <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)] transition-colors" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-transparent transition-all duration-200"
                    placeholder="example@samsung.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5 animate-slide-in">
                <label className="text-xs font-semibold text-[var(--accent-color)] uppercase tracking-wider ml-1">Admin Key</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent-color)]" size={20} />
                  <input
                    type="text"
                    name="auth_key"
                    value={formData.auth_key}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-[var(--bg-tertiary)] border-2 border-[var(--accent-color)]/30 rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] transition-all duration-200"
                    placeholder="6-digit secure key"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 w-full py-4 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isLoginMode ? 'Sign In' : 'Create Account'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="bg-[var(--bg-tertiary)]/50 px-10 py-6 text-center border-t border-[var(--border-color)]">
          <p className="text-[var(--text-secondary)] text-sm">
            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
              }}
              className="text-[var(--accent-color)] font-bold hover:underline ml-1 transition-colors outline-none"
            >
              {isLoginMode ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;