import React, { useState } from 'react';
import { ViewType, UserProfile, UserRole } from '../../types';
import { 
  Search, 
  Bell, 
  Award, 
  Menu, 
  Globe, 
  ChevronDown, 
  Check, 
  ShieldCheck, 
  UserCheck, 
  Settings, 
  Users, 
  Sparkles,
  FlaskConical,
  Stethoscope,
  Building2,
  FileCheck
} from 'lucide-react';
import { LOGO_URL, mockPersonas, mockTraineeAccounts } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface TopNavBarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  user: UserProfile;
  onChangeUser: (newUser: UserProfile) => void;
  onOpenNotifications: () => void;
  onOpenSupport: () => void;
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
  unreadCount: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentView,
  onNavigate,
  user,
  onChangeUser,
  onOpenNotifications,
  onOpenSupport,
  onOpenSearch,
  onToggleMobileMenu,
  unreadCount,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const { language, toggleLanguage, t, isRTL } = useLanguage();

  const handleRoleSelect = (role: UserRole) => {
    if (role === 'trainee') {
      onChangeUser(mockPersonas.trainee);
      onNavigate('trainee_dashboard');
    } else if (role === 'training_admin') {
      onChangeUser(mockPersonas.training_admin);
      onNavigate('training_admin');
    } else if (role === 'system_admin') {
      onChangeUser(mockPersonas.system_admin);
      onNavigate('system_admin');
    }
    setShowRoleMenu(false);
  };

  const handleSampleTraineeSelect = (traineeId: string) => {
    const trn = mockTraineeAccounts.find(t => t.id === traineeId);
    if (trn) {
      const updatedUser: UserProfile = {
        id: trn.id,
        name: trn.name,
        nameAr: trn.nameAr,
        title: trn.jobTitle,
        titleAr: trn.jobTitleAr,
        role: 'trainee',
        employeeId: trn.employeeId,
        department: trn.department,
        departmentAr: trn.departmentAr,
        branch: trn.branch,
        branchAr: trn.branchAr,
        hireDate: trn.hireDate,
        orientationStartDate: trn.orientationStartDate,
        orientationEndDate: trn.orientationEndDate,
        assignedPathTitle: trn.assignedPathTitle,
        assignedPathTitleAr: trn.assignedPathTitleAr,
        phase: `Orientation Progress: ${trn.overallProgress}%`,
        phaseAr: `نسبة الإنجاز: ${trn.overallProgress}%`,
        avatarUrl: trn.avatarUrl,
        initials: trn.name.split(' ').map(n => n[0]).join('').slice(0, 2),
        credentialId: `SL-${trn.employeeId.replace('SL-', '')}`,
        overallProgress: trn.overallProgress,
        email: trn.email,
        phone: trn.phone
      };
      onChangeUser(updatedUser);
      onNavigate('trainee_dashboard');
    }
    setShowRoleMenu(false);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'training_admin':
        return {
          label: isRTL ? 'مدير التدريب' : 'Training Admin',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-600',
          icon: UserCheck
        };
      case 'system_admin':
        return {
          label: isRTL ? 'مسؤول النظام' : 'System Admin',
          color: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-700',
          icon: Settings
        };
      case 'trainee':
      default:
        return {
          label: isRTL ? 'المتدرب المخبري' : 'Clinical Trainee',
          color: 'bg-teal-50 text-teal-900 border-teal-200/80',
          dot: 'bg-[#006672]',
          icon: FlaskConical
        };
    }
  };

  const activeBadge = getRoleBadge(user.role);
  const ActiveIcon = activeBadge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Section: Mobile Menu Trigger & Brand Lockup */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => {
              if (user.role === 'training_admin') onNavigate('training_admin');
              else if (user.role === 'system_admin') onNavigate('system_admin');
              else onNavigate('trainee_dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <img 
              src={LOGO_URL} 
              alt="Shalaby Labs Logo" 
              className="h-8 md:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
            <div className={`hidden sm:block ${isRTL ? 'border-r pr-3' : 'border-l pl-3'} border-slate-200`}>
              <span className="text-xs font-bold tracking-tight text-[#006672] uppercase block">
                {t.brandTitle}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block">
                {t.brandSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center Section: Quick Interactive Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-3 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg border border-slate-200/80 text-xs transition-all text-start"
          >
            <Search className="w-3.5 h-3.5 text-[#006672] shrink-0" />
            <span className="flex-1 truncate">{t.searchPlaceholder}</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Role Switcher, Language Toggle & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Interactive Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${activeBadge.color} hover:shadow-xs`}
              title={t.switchRole}
            >
              <ActiveIcon className="w-3.5 h-3.5 shrink-0" />
              <div className="text-start leading-tight">
                <span className="font-semibold text-xs truncate max-w-[130px] sm:max-w-[150px] block">
                  {isRTL && user.nameAr ? user.nameAr : user.name}
                </span>
                <span className="text-[10px] font-medium opacity-80 block">
                  {activeBadge.label}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
            </button>

            {/* Role Dropdown Menu */}
            {showRoleMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowRoleMenu(false)} 
                />
                <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} z-50 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 animate-in fade-in zoom-in-95 duration-150`}>
                  <div className="px-3 py-2 border-b border-slate-100 mb-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {t.switchRole}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {isRTL ? 'اختر الدور لاختبار صلاحيات التدريب وإدارة المسارات' : 'Select a role to test laboratory workflows & permissions'}
                    </p>
                  </div>

                  {/* 3 Main Roles */}
                  <div className="space-y-1">
                    {/* Trainee */}
                    <button
                      onClick={() => handleRoleSelect('trainee')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all text-xs ${user.role === 'trainee' ? 'bg-teal-50 text-[#006672] font-semibold' : 'hover:bg-slate-50 text-slate-800'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-[#006672] flex items-center justify-center font-bold text-xs shrink-0">
                        <FlaskConical className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{t.roleTrainee}</span>
                          {user.role === 'trainee' && <Check className="w-3.5 h-3.5 text-[#006672]" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Ahmed Mohamed · SL-2024-0482</p>
                      </div>
                    </button>

                    {/* Training Administrator */}
                    <button
                      onClick={() => handleRoleSelect('training_admin')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all text-xs ${user.role === 'training_admin' ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'hover:bg-slate-50 text-slate-800'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{t.roleTrainingAdmin}</span>
                          {user.role === 'training_admin' && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Dr. Sarah Mansour · Training Director</p>
                      </div>
                    </button>

                    {/* System Administrator */}
                    <button
                      onClick={() => handleRoleSelect('system_admin')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all text-xs ${user.role === 'system_admin' ? 'bg-slate-100 text-slate-900 font-semibold' : 'hover:bg-slate-50 text-slate-800'}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <Settings className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{t.roleSystemAdmin}</span>
                          {user.role === 'system_admin' && <Check className="w-3.5 h-3.5 text-slate-800" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">Eng. Khaled El-Sayed · LIMS & QA Admin</p>
                      </div>
                    </button>
                  </div>

                  {/* Sample Trainees Submenu */}
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3 h-3" />
                      <span>{t.sampleTrainees}</span>
                    </p>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleSampleTraineeSelect('trn-01')}
                        className="w-full text-start px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="text-slate-700 truncate">{isRTL ? 'أحمد محمد (20% قيد التدريب)' : 'Ahmed Mohamed (20% In Progress)'}</span>
                        <span className="font-mono text-[11px] text-amber-700 font-medium">20%</span>
                      </button>
                      <button
                        onClick={() => handleSampleTraineeSelect('trn-02')}
                        className="w-full text-start px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="text-slate-700 truncate">{isRTL ? 'د. منى فاروق (100% مكتمل)' : 'Dr. Mona Farouk (100% Completed)'}</span>
                        <span className="font-mono text-[11px] text-emerald-700 font-medium">100%</span>
                      </button>
                      <button
                        onClick={() => handleSampleTraineeSelect('trn-03')}
                        className="w-full text-start px-3 py-1.5 rounded-lg text-xs hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span className="text-slate-700 truncate">{isRTL ? 'يوسف كريم (متأخر 40%)' : 'Youssef Karim (Overdue 40%)'}</span>
                        <span className="font-mono text-[11px] text-rose-700 font-medium">Overdue</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            title={language === 'en' ? "التحويل للغة العربية" : "Switch to English"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-95 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#006672]" />
            <span className="font-sans font-bold">{t.switchLanguage}</span>
          </button>

          {/* Quick Certificate View Link */}
          <button
            onClick={() => onNavigate('certificate')}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${currentView === 'certificate' ? 'bg-[#006672] text-white border-[#006672]' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            title={t.officialCert}
          >
            <Award className="w-3.5 h-3.5 text-[#006672]" />
            <span>{t.officialCert}</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User Avatar with Status Indicator */}
          <div 
            onClick={() => {
              if (user.role === 'training_admin') onNavigate('training_admin');
              else if (user.role === 'system_admin') onNavigate('system_admin');
              else onNavigate('trainee_dashboard');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:border-[#006672] transition-all"
              />
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-2 ring-white ${user.role === 'training_admin' ? 'bg-emerald-500' : user.role === 'system_admin' ? 'bg-slate-600' : 'bg-[#006672]'}`} />
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
