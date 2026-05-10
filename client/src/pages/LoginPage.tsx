import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'employee'>('employee');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gray-50 overflow-hidden font-sans">
      {/* Background Image with Blur and Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')`,
          filter: 'blur(12px)'
        }}
      />
      <div className="absolute inset-0 z-1 bg-white/60 backdrop-blur-[2px]" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-120 px-6 py-10">
        <div className="text-center mb-8">

          <p className="text-gray-800 font-bold text-4xl font-serif">Human Resources Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-4xl shadow-2xl shadow-black/5 border border-white p-8 md:p-10">
          
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-full mb-8">
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === 'admin' 
                ? 'bg-[#0F2B8C] text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin Console
            </button>
            <button
              onClick={() => setActiveTab('employee')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                activeTab === 'employee' 
                ? 'bg-[#0F2B8C] text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Employee Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-shake">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Username or Business Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0F2B8C] text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john.doe@corporate.com"
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F2B8C]/20 focus:border-[#0F2B8C] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0F2B8C] text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F2B8C]/20 focus:border-[#0F2B8C] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#0F2B8C] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center px-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#0F2B8C] border-gray-300 rounded focus:ring-[#0F2B8C] transition-all cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 text-sm text-gray-600 font-medium cursor-pointer">
                Keep me signed in on this device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#0F2B8C] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-[#0A1D5E] hover:shadow-blue-900/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Sign In
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          {/* Security Box */}
          <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-3 items-start">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 mb-0.5">Secure Authentication</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Protected by multi-factor authentication and 256-bit encryption. Your credentials are safe with us.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500 mb-4">
            &copy; {new Date().getFullYear()} CorporateHR. All rights reserved.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-xs font-bold text-gray-600 hover:text-[#0F2B8C] transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs font-bold text-gray-600 hover:text-[#0F2B8C] transition-colors">Terms of Service</a>
            <a href="#" className="text-xs font-bold text-gray-600 hover:text-[#0F2B8C] transition-colors">Help Desk</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
