import React, { useState, useRef, useEffect } from 'react';
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
  FileCheck,
  HelpCircle
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
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
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
  onToggleSidebar,
  isSidebarOpen,
  unreadCount,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage, t, isRTL } = useLanguage();

  // Close dropdown when clicking any space in the page or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowRoleMenu(false);
      }
    };

    if (showRoleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showRoleMenu]);

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
          color: 'bg-[#dee2e8] text-[#0b96c7] border-[#c0cad8]',
          dot: 'bg-[#0b96c7]',
          icon: UserCheck
        };
      case 'system_admin':
        return {
          label: isRTL ? 'مسؤول النظام' : 'System Admin',
          color: 'bg-[#dee2e8] text-[#485261] border-[#c0cad8]',
          dot: 'bg-[#485261]',
          icon: Settings
        };
      case 'trainee':
      default:
        return {
          label: isRTL ? 'المتدرب المخبري' : 'Clinical Trainee',
          color: 'bg-[#dee2e8] text-[#0b96c7] border-[#c0cad8]',
          dot: 'bg-[#6bbada]',
          icon: FlaskConical
        };
    }
  };

  const activeBadge = getRoleBadge(user.role);
  const ActiveIcon = activeBadge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#c0cad8] transition-all">
      <div className="w-full flex items-center justify-between min-h-[56px]">
        
        {/* ========================================================
            Brand & Burger Header Section: Directly Above Sidebar
            Desktop: Exactly matches sidebar width (w-64 or w-[72px])
            Mobile: Compact bar with drawer toggle and brand logo
           ======================================================== */}
        
        {/* Desktop Header Above Sidebar */}
        <div
          className={`hidden lg:flex items-center justify-between shrink-0 transition-all duration-300 ease-in-out ${
            isRTL ? 'border-l' : 'border-r'
          } border-[#c0cad8] ${
            isSidebarOpen ? 'w-[272px] px-3.5' : 'w-[72px] px-2.5 justify-center'
          } h-14`}
        >
          {isSidebarOpen ? (
            <>
              {/* Brand Logo & Titles */}
              <div
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
              >
                <img
                  src={LOGO_URL}
                  alt="Shalaby Labs"
                  className="w-8 h-8 object-contain shrink-0 rounded-md transition-transform group-hover:scale-105"
                />
                <div className="min-w-0 flex-1 pr-1">
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="text-[13px] font-bold text-[#485261] tracking-tight font-heading whitespace-nowrap">
                      LabCertify
                    </span>
                    <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#dee2e8] text-[#0B96C7] border border-[#c0cad8] leading-none shrink-0">
                      CLINICAL
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#9995a6] font-medium truncate leading-tight mt-0.5">
                    {isRTL ? 'معامل شلبي للتحاليل الطبية' : 'Shalaby Labs Training'}
                  </p>
                </div>
              </div>

              {/* Burger Toggle on Right of sidebar header */}
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] transition-colors cursor-pointer shrink-0"
                title={isRTL ? "طي القائمة الجانبية" : "Collapse sidebar"}
                aria-label="Collapse sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            </>
          ) : (
            /* Collapsed Rail mode: Logo & Burger Toggle */
            <div className="flex items-center justify-center gap-1.5 w-full">
              <img
                src={LOGO_URL}
                alt="Shalaby Labs"
                onClick={() => onNavigate('dashboard')}
                className="w-7 h-7 object-contain rounded-md cursor-pointer hover:scale-105 transition-transform"
                title="LabCertify Clinical"
              />
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-1 rounded-lg text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] transition-colors cursor-pointer"
                title={isRTL ? "توسيع القائمة الجانبية" : "Expand sidebar"}
                aria-label="Expand sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Header (Drawer Toggle + Brand Logo) */}
        <div className="flex lg:hidden items-center gap-2 px-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="p-2 text-[#485261] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={LOGO_URL}
              alt="Shalaby Labs"
              className="w-7 h-7 object-contain rounded-md"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#485261] font-heading">
                LabCertify
              </span>
              <span className="text-[9px] font-mono font-bold px-1 py-0.2 rounded bg-[#dee2e8] text-[#0B96C7] border border-[#c0cad8]">
                CLINICAL
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            Main Top Bar Body: Flexible Search & Right Controls
            Organized into a rock-solid, non-overlapping flex layout
           ======================================================== */}
        <div className="flex-1 flex items-center justify-between gap-3 px-3 sm:px-5 lg:px-6 h-14 min-w-0">

          {/* Flexible Search Container (in-flow flex item: NEVER overlaps with right controls) */}
          <div className="hidden md:flex items-center flex-1 max-w-[380px] lg:max-w-[440px] min-w-[180px]">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 bg-[#dee2e8]/45 hover:bg-[#dee2e8] text-[#485261] rounded-xl border border-[#c0cad8] hover:border-[#0b96c7] text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group"
            >
              <Search className="w-4 h-4 text-[#0b96c7] shrink-0 group-hover:scale-105 transition-transform" />
              <span className="flex-1 text-start truncate text-[#485261] font-medium">
                {t.searchPlaceholder}
              </span>
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#485261] bg-white border border-[#c0cad8] rounded shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Section: Language, Cert, Notifications, Support & Profile Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">

            {/* Mobile Search Trigger Button (mobile only) */}
            <button
              onClick={onOpenSearch}
              className="md:hidden p-2 text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer"
              title={t.searchPlaceholder}
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#0b96c7]" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title={language === 'en' ? "التحويل للغة العربية" : "Switch to English"}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border border-[#c0cad8] bg-white hover:bg-[#dee2e8] text-[#485261] active:scale-95 cursor-pointer shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-[#0b96c7]" />
              <span className="font-bold">{t.switchLanguage}</span>
            </button>

            {/* Quick Certificate View Link (compact on 1024-1280px, full label on 1280px+) */}
            <button
              onClick={() => onNavigate('certificate')}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer shrink-0 ${
                currentView === 'certificate'
                  ? 'bg-[#0b96c7] text-white border-[#0b96c7]'
                  : 'bg-white text-[#485261] border-[#c0cad8] hover:border-[#0b96c7] hover:bg-[#dee2e8]'
              }`}
              title={t.officialCert}
            >
              <Award className={`w-3.5 h-3.5 ${currentView === 'certificate' ? 'text-white' : 'text-[#0b96c7]'}`} />
              <span className="hidden xl:inline">{t.officialCert}</span>
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Support / Help Icon */}
            <button
              onClick={onOpenSupport}
              className="p-2 text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer shrink-0"
              title={isRTL ? "الدعم الفني والتوجيه" : "Support & Guidance"}
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Profile Avatar & Info — dropdown trigger with click-outside ref */}
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#c0cad8] bg-white hover:bg-[#dee2e8]/60 transition-all cursor-pointer group text-start shadow-2xs hover:border-[#0b96c7] shrink-0"
                title={t.switchRole}
              >
                {/* Avatar with Status Dot */}
                <div className="relative shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#c0cad8] group-hover:border-[#0b96c7] transition-colors"
                  />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                    user.role === 'training_admin'
                      ? 'bg-[#0b96c7]'
                      : user.role === 'system_admin'
                        ? 'bg-[#485261]'
                        : 'bg-[#6bbada]'
                  }`} />
                </div>

                {/* Name and Title beside profile */}
                <div className="hidden sm:block text-start leading-tight min-w-0 pr-1">
                  <span className="font-bold text-[13px] text-[#485261] group-hover:text-[#0b96c7] truncate max-w-[120px] lg:max-w-[140px] block transition-colors">
                    {isRTL && user.nameAr ? user.nameAr : user.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#0b96c7] block truncate max-w-[120px] lg:max-w-[140px]">
                    {activeBadge.label}
                  </span>
                </div>

                {/* Role icon & chevron */}
                <div className="flex items-center gap-1 text-[#9995a6] group-hover:text-[#0b96c7] transition-colors ml-0.5">
                  <ActiveIcon className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 text-[#0b96c7]" />
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showRoleMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Role / Profile Dropdown */}
              {showRoleMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowRoleMenu(false)}
                  />
                  <div
                    className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} z-50 w-80 bg-white rounded-2xl shadow-xl border border-[#c0cad8] p-3`}
                    style={{ animation: 'fadeInUp 0.18s ease-out both' }}
                  >
                    {/* Current user summary card */}
                    <div className="flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl bg-[#dee2e8]/40 border border-[#c0cad8]">
                      <div className="relative shrink-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${user.role === 'training_admin' ? 'bg-[#0b96c7]' : user.role === 'system_admin' ? 'bg-[#485261]' : 'bg-[#6bbada]'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#485261] truncate">{isRTL && user.nameAr ? user.nameAr : user.name}</p>
                        <p className={`text-[11px] font-semibold truncate ${activeBadge.color.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>{activeBadge.label}</p>
                      </div>
                      <ActiveIcon className="w-4 h-4 shrink-0 text-[#9995a6]" />
                    </div>

                    <div className="px-1 pb-2 border-b border-[#dee2e8] mb-2">
                      <p className="text-[10px] font-bold text-[#9995a6] uppercase tracking-wider px-2">{t.switchRole}</p>
                      <p className="text-[11px] text-[#485261] mt-0.5 px-2">
                        {isRTL ? 'اختر الدور لاختبار صلاحيات التدريب وإدارة المسارات' : 'Select a role to test laboratory workflows & permissions'}
                      </p>
                    </div>

                    {/* 3 Main Roles */}
                    <div className="space-y-1">
                      <button
                        onClick={() => handleRoleSelect('trainee')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all text-xs ${user.role === 'trainee' ? 'bg-[#dee2e8] text-[#0b96c7] font-semibold' : 'hover:bg-[#dee2e8]/40 text-[#485261]'}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0b96c7] flex items-center justify-center shrink-0">
                          <FlaskConical className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold truncate">{t.roleTrainee}</span>
                            {user.role === 'trainee' && <Check className="w-3.5 h-3.5 text-[#0b96c7]" />}
                          </div>
                          <p className="text-[11px] text-[#9995a6] truncate">Ahmed Mohamed · SL-2024-0482</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleRoleSelect('training_admin')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all text-xs ${user.role === 'training_admin' ? 'bg-[#dee2e8] text-[#0b96c7] font-semibold' : 'hover:bg-[#dee2e8]/40 text-[#485261]'}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0b96c7] flex items-center justify-center shrink-0">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold truncate">{t.roleTrainingAdmin}</span>
                            {user.role === 'training_admin' && <Check className="w-3.5 h-3.5 text-[#0b96c7]" />}
                          </div>
                          <p className="text-[11px] text-[#9995a6] truncate">Dr. Sarah Mansour · Training Director</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleRoleSelect('system_admin')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-start transition-all text-xs ${user.role === 'system_admin' ? 'bg-[#dee2e8] text-[#485261] font-semibold' : 'hover:bg-[#dee2e8]/40 text-[#485261]'}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#c0cad8] text-[#485261] flex items-center justify-center shrink-0">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold truncate">{t.roleSystemAdmin}</span>
                            {user.role === 'system_admin' && <Check className="w-3.5 h-3.5 text-[#485261]" />}
                          </div>
                          <p className="text-[11px] text-[#9995a6] truncate">Eng. Khaled El-Sayed · LIMS & QA Admin</p>
                        </div>
                      </button>
                    </div>

                    {/* Sample Trainees */}
                    <div className="mt-3 pt-2 border-t border-[#dee2e8]">
                      <p className="text-[10px] font-bold text-[#9995a6] uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        <span>{t.sampleTrainees}</span>
                      </p>
                      <div className="space-y-0.5">
                        <button
                          onClick={() => handleSampleTraineeSelect('trn-01')}
                          className="w-full text-start px-3 py-1.5 rounded-lg text-xs hover:bg-[#dee2e8]/50 flex items-center justify-between"
                        >
                          <span className="text-[#485261] truncate">{isRTL ? 'أحمد محمد (20% قيد التدريب)' : 'Ahmed Mohamed (20% In Progress)'}</span>
                          <span className="font-mono text-[11px] text-[#0b96c7] font-medium">20%</span>
                        </button>
                        <button
                          onClick={() => handleSampleTraineeSelect('trn-02')}
                          className="w-full text-start px-3 py-1.5 rounded-lg text-xs hover:bg-[#dee2e8]/50 flex items-center justify-between"
                        >
                          <span className="text-[#485261] truncate">{isRTL ? 'د. منى فاروق (100% مكتمل)' : 'Dr. Mona Farouk (100% Completed)'}</span>
                          <span className="font-mono text-[11px] text-emerald-600 font-medium">100%</span>
                        </button>
                        <button
                          onClick={() => handleSampleTraineeSelect('trn-03')}
                          className="w-full text-start px-3 py-1.5 rounded-lg text-xs hover:bg-[#dee2e8]/50 flex items-center justify-between"
                        >
                          <span className="text-[#485261] truncate">{isRTL ? 'يوسف كريم (متأخر 40%)' : 'Youssef Karim (Overdue 40%)'}</span>
                          <span className="font-mono text-[11px] text-rose-600 font-medium">Overdue</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};


