import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, demoLogin, authError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res?.success) {
      navigate('/app/dashboard');
    } else {
      setLocalError(res?.message || 'Login failed. Please verify your credentials.');
    }
  };

  const handleQuickDemo = async (demoEmail) => {
    setLoading(true);
    const res = await demoLogin(demoEmail);
    setLoading(false);
    if (res?.success) {
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#D8A48F] flex items-center justify-center text-[#243447] shadow-md">
            <svg className="w-7 h-7 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#243447]">TeamPulse</span>
        </div>

        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-[#243447]">
          Welcome back
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6B7280]">
          Log in to collaborate on tasks, projects, and workload planning
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="pulse-card py-8 px-6 sm:px-10">
          {(localError || authError) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{localError || authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nishashree@teampulse.io"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#6B7280] hover:text-[#243447]"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#243447] text-white text-sm font-bold hover:bg-[#1e2c3c] transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins Strip */}
          <div className="mt-6 pt-5 border-t border-[#E5DED2]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D8A48F]" />
                One-Click Demo Personas
              </span>
              <span className="text-[10px] text-[#6B7280]">Instant access</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('nishashree@teampulse.io')}
                className="p-2 rounded-lg bg-[#E7E1F5]/60 hover:bg-[#E7E1F5] text-left border border-[#D6BCFA]/60 transition-colors"
              >
                <div className="text-xs font-bold text-[#243447]">Nishashree</div>
                <div className="text-[10px] text-[#6B7280]">Admin / Lead</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('rahul@teampulse.io')}
                className="p-2 rounded-lg bg-[#FDF0E9]/60 hover:bg-[#FDF0E9] text-left border border-[#FBD38D]/60 transition-colors"
              >
                <div className="text-xs font-bold text-[#243447]">Rahul Sharma</div>
                <div className="text-[10px] text-[#C05621] font-medium">8 Tasks (High Load)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('priya@teampulse.io')}
                className="p-2 rounded-lg bg-[#EDF5EB]/60 hover:bg-[#EDF5EB] text-left border border-[#C6F6D5]/60 transition-colors"
              >
                <div className="text-xs font-bold text-[#243447]">Priya Patel</div>
                <div className="text-[10px] text-[#2F855A] font-medium">3 Tasks (Available)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('karthik@teampulse.io')}
                className="p-2 rounded-lg bg-[#FAF5E8]/60 hover:bg-[#FAF5E8] text-left border border-[#F6E05E]/60 transition-colors"
              >
                <div className="text-xs font-bold text-[#243447]">Karthik Verma</div>
                <div className="text-[10px] text-[#975A16] font-medium">Team Leader</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#6B7280]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#D8A48F] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
