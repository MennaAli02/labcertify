import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  Sun, 
  Moon, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  Settings, 
  GraduationCap,
  Sparkles,
  HelpCircle,
  Building2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { mockPersonas } from '../../data/mockData';

export const LoginView = ({ 
  initialRole = 'trainee', 
  onLogin, 
  onBackToRoleSelect,
  onOpenSupport,
  isLoggingIn: externalIsLoggingIn = false,
  loginError = null,
}) => {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  // Selected Role (determined from Role Selection page)
  const selectedRole = initialRole || 'trainee';
  const activePersona = mockPersonas[selectedRole] || mockPersonas.trainee;

  const RoleIcon = selectedRole === 'training_admin' 
    ? UserCheck 
    : selectedRole === 'system_admin' 
    ? Settings 
    : GraduationCap;

  // Form Fields
  const [emailOrUser, setEmailOrUser] = useState(activePersona.email);
  const [password, setPassword] = useState('clinical2024');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);

  // Combined submitting state: either local (for UX) or external (backend call)
  const isSubmitting = localIsSubmitting || externalIsLoggingIn;

  // Synchronize credentials when role changes
  useEffect(() => {
    const persona = mockPersonas[selectedRole];
    if (persona) {
      setEmailOrUser(persona.email);
      setPassword('clinical2024');
    }
  }, [selectedRole]);



  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setLocalIsSubmitting(true);
    
    // Call parent onLogin with (role, emailOrUser, password) — parent handles backend call
    if (onLogin) {
      const result = onLogin(selectedRole, emailOrUser, password);
      // If onLogin is async, wait for it before clearing local state
      if (result && typeof result.finally === 'function') {
        result.finally(() => setLocalIsSubmitting(false));
      } else {
        setTimeout(() => setLocalIsSubmitting(false), 400);
      }
    } else {
      setTimeout(() => setLocalIsSubmitting(false), 300);
    }
  };

  return (
    <div className="h-screen max-h-screen w-full bg-[#DEE2E8] bg-gradient-to-br from-[#cdd8e6] via-[#DEE2E8] to-[#b8cadf] flex items-center justify-center p-3 sm:p-5 select-none relative overflow-hidden">
      
      {/* Ambient background soft glow effects matching palette */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6BBADA]/20 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0B96C7]/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* Main Floating Card matching media_1791936387310.png */}
      <div className="w-full max-w-[400px] sm:max-w-[420px] max-h-[calc(100vh-28px)] bg-white dark:bg-[#1a2333] rounded-[26px] sm:rounded-[30px] shadow-[0_20px_50px_rgba(72,82,97,0.18)] border border-[#C0CAD8] dark:border-gray-800 overflow-hidden flex flex-col justify-between my-auto relative z-10 transition-all duration-300">
        
        {/* ========================================================
            TOP SECTION: Hero Graphic & Branding
            Matching reference media_1791936387310.png top blue banner
           ======================================================== */}
        <div className="bg-gradient-to-b from-[#ddecfa] via-[#e8f3fb] to-[#d6e8f5] dark:from-[#1b2737] dark:to-[#131c28] p-4 sm:p-5 pb-3 sm:pb-3.5 border-b border-[#C0CAD8]/70 dark:border-gray-800 flex flex-col items-center shrink-0 relative">
          
          {/* Top Bar inside banner: Change Role Button (Left) & Language/Theme (Right) */}
          <div className="w-full flex items-center justify-between pb-1.5">
            {/* Back to Change Role Button (Placed where the removed logo was) */}
            <button
              type="button"
              onClick={onBackToRoleSelect}
              className="text-xs font-semibold text-[#0B96C7] dark:text-[#6BBADA] bg-white/95 dark:bg-gray-800 hover:bg-white px-3 py-1.5 rounded-full border border-[#C0CAD8]/70 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1.5 cursor-pointer group"
              title={isRTL ? "الرجوع لتحديد الدور" : "Back to role selection"}
            >
              {isRTL ? <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /> : <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />}
              <span>{isRTL ? 'الرجوع لاختيار الدور' : 'Change Role'}</span>
            </button>

            {/* Right Controls: Language & Theme */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleLanguage}
                title={language === 'en' ? 'التحويل للعربية' : 'Switch to English'}
                className="p-1 rounded-md text-[#485261] hover:text-[#0B96C7] hover:bg-white/80 dark:hover:bg-gray-800 transition-colors text-[11px] font-bold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Light Mode' : 'Dark Mode'}
                className="p-1 rounded-md text-[#485261] hover:text-[#0B96C7] hover:bg-white/80 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#0B96C7]" />}
              </button>
            </div>
          </div>

          {/* Central Logo Image provided by user */}
          <div className="w-full flex items-center justify-center my-1">
            <div className="p-3 bg-white dark:bg-white rounded-2xl shadow-sm border border-[#C0CAD8]/80 flex items-center justify-center max-w-[210px] sm:max-w-[225px] hover:scale-[1.02] transition-transform">
              <img 
                src="/logo.png" 
                alt="Shalaby Labs - LabCertify Clinical" 
                className="w-full h-auto max-h-[140px] sm:max-h-[150px] object-contain" 
              />
            </div>
          </div>

          {/* Short subtitle / intro banner below logo */}
          <p className="text-[10.5px] sm:text-[11px] text-[#485261]/85 dark:text-gray-300 text-center max-w-[290px] leading-tight font-medium mt-1">
            {isRTL
              ? 'بوابة التأهيل والاعتماد الإكلينيكي المعتمدة لمعامل شلبي للتحاليل الطبية'
              : 'Official clinical competency & accreditation portal for Shalaby Laboratories.'}
          </p>
        </div>

        {/* ========================================================
            BOTTOM SECTION: USER LOGIN Form
            Matching reference media_1791936387310.png
           ======================================================== */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1a2333] flex flex-col justify-between flex-1 gap-2.5">
          
          {/* Header Title & Subtitle */}
          <div className="text-center pt-0.5">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-wider text-[#485261] dark:text-white uppercase font-sans">
              {isRTL ? 'تسجيل الدخول' : 'USER LOGIN'}
            </h2>
            <p className="text-[11px] sm:text-xs font-semibold text-[#0B96C7] mt-0.5">
              {t.welcomeBack || 'Welcome back'}
            </p>
          </div>

          {/* Selected Role Display Badge (Role selected from role page) */}
          <div className="flex items-center justify-center pt-0.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DEE2E8]/70 dark:bg-gray-800 border border-[#C0CAD8] dark:border-gray-700 shadow-2xs">
              <RoleIcon className="w-4 h-4 text-[#0B96C7]" />
              <span className="text-xs font-bold text-[#0B96C7] dark:text-[#6BBADA]">
                {selectedRole === 'trainee' && (isRTL ? 'تسجيل الدخول: كمتدرب (Login as Trainee)' : 'Login as Trainee')}
                {selectedRole === 'training_admin' && (isRTL ? 'تسجيل الدخول: كمسؤول تدريب (Login as Admin)' : 'Login as Admin')}
                {selectedRole === 'system_admin' && (isRTL ? 'تسجيل الدخول: كمسؤول نظام (Login as System)' : 'Login as System')}
              </span>
            </div>
          </div>

          {/* Form Fields Form */}
          <form onSubmit={handleSubmit} className="space-y-2 mt-0.5">
            
            {/* Email / Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9995A6]">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                id="login-username"
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                placeholder={isRTL ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
                required
                className="w-full bg-[#DEE2E8]/50 dark:bg-gray-800/90 border border-[#C0CAD8] dark:border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-[#485261] dark:text-gray-100 placeholder:text-[#9995A6] focus:outline-none focus:border-[#0B96C7] focus:ring-1 focus:ring-[#0B96C7] transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9995A6]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isRTL ? 'كلمة المرور' : 'Password'}
                required
                className="w-full bg-[#DEE2E8]/50 dark:bg-gray-800/90 border border-[#C0CAD8] dark:border-gray-700 rounded-lg pl-8 pr-8 py-2 text-xs text-[#485261] dark:text-gray-100 placeholder:text-[#9995A6] focus:outline-none focus:border-[#0B96C7] focus:ring-1 focus:ring-[#0B96C7] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#9995A6] hover:text-[#485261] cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Options Row: Remember checkbox & Forgot password */}
            <div className="flex items-center justify-between text-[11px] pt-0.5 text-[#9995A6] dark:text-gray-400">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-[#485261] dark:hover:text-gray-200 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#C0CAD8] text-[#0B96C7] focus:ring-[#0B96C7] w-3 h-3 cursor-pointer"
                />
                <span>{isRTL ? 'تذكرني' : 'Remember'}</span>
              </label>

              <button
                type="button"
                onClick={() => alert(isRTL ? 'يرجى مراجعة إدارة التدريب لإعادة ضبط كلمة المرور: support@shalabylabs.com' : 'Please contact Shalaby Training Admin to reset credentials: support@shalabylabs.com')}
                className="hover:text-[#0B96C7] dark:hover:text-[#6BBADA] transition-colors cursor-pointer"
              >
                {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
            </div>

            {/* Backend Error Message */}
            {loginError && (
              <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-[11px] text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>
                  {isRTL
                    ? (loginError.includes('password') || loginError.includes('Password')
                        ? 'كلمة المرور غير صحيحة. يرجى التأكد من البيانات والمحاولة مجدداً.'
                        : loginError.includes('mismatch') || loginError.includes('Role')
                        ? 'هذا الحساب لا يطابق الدور المحدد. يرجى اختيار الدور المناسب أو التأكد من الحساب.'
                        : 'الحساب غير مسجل أو غير مصرح له بالدخول للنظام.')
                    : loginError}
                </span>
              </div>
            )}

            {/* Primary LOGIN Action Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#0B96C7] hover:bg-[#0983ad] active:bg-[#087399] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md shadow-[#0B96C7]/30 hover:shadow-[#0B96C7]/45 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-75"
              >
                <span>
                  {isSubmitting
                    ? (isRTL ? 'جاري الدخول...' : 'Logging in...')
                    : (selectedRole === 'trainee'
                        ? (isRTL ? 'تسجيل الدخول كمتدرب' : 'LOGIN AS TRAINEE')
                        : selectedRole === 'training_admin'
                        ? (isRTL ? 'تسجيل الدخول كمسؤول تدريب' : 'LOGIN AS ADMIN')
                        : (isRTL ? 'تسجيل الدخول كمسؤول نظام' : 'LOGIN AS SYSTEM'))}
                </span>
                {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>

          </form>

          {/* Footer note */}
          <div className="pt-1 border-t border-[#C0CAD8]/50 dark:border-gray-800 text-center">
            <p className="text-[10px] text-[#9995A6] font-mono">
              {isRTL ? 'نظام مشفر ومحمي وفق معايير ISO 15189' : 'Secured by Shalaby LIMS v19 • ISO 15189 Accredited'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default LoginView;
