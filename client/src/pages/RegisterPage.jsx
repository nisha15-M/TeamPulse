import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Briefcase, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, authError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member',
    title: 'Developer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res?.success) {
      navigate('/app/dashboard');
    } else {
      setLocalError(res?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
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
          Create your account
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6B7280]">
          Join your team's workspace and start planning projects
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
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Nishashree"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="you@teampulse.io"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#243447] mb-1">
                Password (min 6 characters) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-sm text-[#243447] placeholder-[#6B7280] focus:outline-none focus:border-[#D8A48F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#6B7280] hover:text-[#243447]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#243447] mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-xs sm:text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
                >
                  <option value="Member">Member</option>
                  <option value="Team Leader">Team Leader</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#243447] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Engineer"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5DED2] bg-[#FFFCF8] text-xs sm:text-sm text-[#243447] focus:outline-none focus:border-[#D8A48F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#243447] text-white text-sm font-bold hover:bg-[#1e2c3c] transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6B7280]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#D8A48F] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
