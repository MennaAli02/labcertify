import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, Globe, ChevronDown, Check, UserCheck, Settings, Users, FlaskConical, HelpCircle, Sun, Moon, Sparkles, LogOut, FileText } from 'lucide-react';
import { LOGO_URL, mockPersonas, mockTraineeAccounts } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { LabCertifyLogo } from '../Common/LabCertifyLogo';
export const TopNavBar = ({ currentView, onNavigate, user, onChangeUser, onOpenNotifications, onOpenSupport, onOpenSearch, onToggleMobileMenu, onToggleSidebar, isSidebarOpen, unreadCount, onLogout, }) => {
    const [showRoleMenu, setShowRoleMenu] = useState(false);
    const roleMenuRef = useRef(null);
    const { language, toggleLanguage, t, isRTL } = useLanguage();
    const { toggleTheme, isDark } = useTheme();
    // Close dropdown when clicking any space in the page or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (roleMenuRef.current && !roleMenuRef.current.contains(event.target)) {
                setShowRoleMenu(false);
            }
        };
        const handleKeyDown = (event) => {
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
    const handleRoleSelect = (role) => {
        if (role === 'trainee') {
            onChangeUser(mockPersonas.trainee);
            onNavigate('trainee_dashboard');
        }
        else if (role === 'training_admin') {
            onChangeUser(mockPersonas.training_admin);
            onNavigate('training_admin');
        }
        else if (role === 'system_admin') {
            onChangeUser(mockPersonas.system_admin);
            onNavigate('system_admin');
        }
        setShowRoleMenu(false);
    };
    const handleSampleTraineeSelect = (traineeId) => {
        const trn = mockTraineeAccounts.find(t => t.id === traineeId);
        if (trn) {
            const updatedUser = {
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
    const getRoleBadge = (role) => {
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
    return (<header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#c0cad8] transition-all">
      <div className="w-full flex items-center justify-between min-h-[56px]">
        
        {/* ========================================================
            Brand & Burger Header Section: Directly Above Sidebar
            Desktop: Exactly matches sidebar width (w-64 or w-[72px])
            Mobile: Compact bar with drawer toggle and brand logo
           ======================================================== */}
        
        {/* Desktop Header Above Sidebar */}
        <div className={`hidden lg:flex items-center justify-between shrink-0 transition-all duration-300 ease-in-out ${isRTL ? 'border-l' : 'border-r'} border-[#c0cad8] ${isSidebarOpen ? 'w-[290px] px-3' : 'w-[72px] px-2 justify-center'} h-14`}>
          {isSidebarOpen ? (<>
              {/* Official Brand Logo with titles matching user reference */}
              <div onClick={() => onNavigate('dashboard')} className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1 pr-1">
                <img 
                  src="/logo.png" 
                  alt="Shalaby Labs" 
                  className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform" 
                />
                <div className="h-7 w-[1px] bg-[#c0cad8] shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[11px] font-extrabold text-[#0B96C7] tracking-wider uppercase truncate leading-tight font-sans">
                    {isRTL ? 'نظام LABCERTIFY CLINICAL LMS' : 'LABCERTIFY CLINICAL LMS'}
                  </span>
                  <span className="text-[10px] text-[#485261] font-medium truncate leading-tight mt-0.5">
                    {isRTL ? 'نظام تدريب معامل شلبي' : 'Shalaby Labs Training System'}
                  </span>
                </div>
              </div>

              {/* Burger Toggle on Right of sidebar header */}
              <button type="button" onClick={onToggleSidebar} className="p-1.5 rounded-lg text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] transition-colors cursor-pointer shrink-0" title={isRTL ? "طي القائمة الجانبية" : "Collapse sidebar"} aria-label="Collapse sidebar">
                <Menu className="w-5 h-5 shrink-0"/>
              </button>
            </>) : (
        /* Collapsed Rail mode: Dedicated, prominent Burger Toggle that NEVER shrinks or disappears */
        <div className="flex items-center justify-center w-full">
              <button type="button" onClick={onToggleSidebar} className="w-10 h-10 flex items-center justify-center rounded-xl text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] transition-colors cursor-pointer shrink-0" title={isRTL ? "توسيع القائمة الجانبية" : "Expand sidebar"} aria-label="Expand sidebar">
                <Menu className="w-5 h-5 shrink-0"/>
              </button>
            </div>)}
        </div>

        {/* Mobile Header (Drawer Toggle + Brand Logo) */}
        <div className="flex lg:hidden items-center gap-2 px-3 shrink-0">
          <button onClick={onToggleMobileMenu} className="p-2 text-[#485261] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer" aria-label="Toggle navigation menu">
            <Menu className="w-5 h-5"/>
          </button>
          <div onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 cursor-pointer">
            <img src="/logo.png" alt="Shalaby Labs" className="h-7 w-auto object-contain shrink-0" />
            <div className="h-6 w-[1px] bg-[#c0cad8] shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-extrabold text-[#0B96C7] tracking-wider uppercase truncate leading-tight font-sans">
                {isRTL ? 'نظام LABCERTIFY CLINICAL LMS' : 'LABCERTIFY CLINICAL LMS'}
              </span>
              <span className="text-[9px] text-[#485261] font-medium truncate leading-tight mt-0.5">
                {isRTL ? 'نظام تدريب معامل شلبي' : 'Shalaby Labs Training System'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            Main Top Bar Body: Centered Search & Right Controls
           ======================================================== */}
        <div className="flex-1 flex items-center justify-between gap-3 px-3 sm:px-5 lg:px-6 h-14 min-w-0">

          {/* Centered Search Container */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-[420px] lg:max-w-[480px] mx-auto min-w-[180px]">
            <button onClick={onOpenSearch} className="w-full flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 bg-[#dee2e8]/45 hover:bg-[#dee2e8] text-[#485261] rounded-xl border border-[#c0cad8] hover:border-[#0b96c7] text-xs transition-all shadow-2xs hover:shadow-xs cursor-pointer group">
              <Search className="w-4 h-4 text-[#0b96c7] shrink-0 group-hover:scale-105 transition-transform"/>
              <span className="flex-1 text-start truncate text-[#485261] font-medium">
                {t.searchPlaceholder}
              </span>
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#485261] bg-white border border-[#c0cad8] rounded shadow-2xs shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Section: Language, Notifications, Support & Profile Dropdown */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">

            {/* Mobile Search Trigger Button (mobile only) */}
            <button onClick={onOpenSearch} className="md:hidden p-2 text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer" title={t.searchPlaceholder} aria-label="Search">
              <Search className="w-4 h-4 text-[#0b96c7]"/>
            </button>

            {/* Language Switcher (No border) */}
            <button onClick={toggleLanguage} title={language === 'en' ? "التحويل للغة العربية" : "Switch to English"} aria-label={language === 'en' ? "التحويل للغة العربية" : "Switch to English"} className="p-2 rounded-lg hover:bg-[#dee2e8] text-[#0b96c7] active:scale-95 cursor-pointer shrink-0 flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4 text-[#0b96c7]"/>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button onClick={toggleTheme} title={isDark ? (isRTL ? "التحويل للوضع الفاتح" : "Switch to Light Mode") : (isRTL ? "التحويل للوضع الداكن" : "Switch to Dark Mode")} aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} className="p-2 rounded-lg hover:bg-[#dee2e8] text-[#0b96c7] active:scale-95 cursor-pointer shrink-0 flex items-center justify-center transition-colors">
              {isDark ? (<Sun className="w-4 h-4 text-amber-400"/>) : (<Moon className="w-4 h-4 text-[#0b96c7]"/>)}
            </button>



            {/* Notifications Trigger */}
            <button onClick={onOpenNotifications} className="relative p-2 text-[#485261] hover:text-[#0b96c7] hover:bg-[#dee2e8] rounded-lg transition-colors cursor-pointer shrink-0" title="Notifications">
              <Bell className="w-4 h-4"/>
              {unreadCount > 0 && (<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white"/>)}
            </button>

            {/* Profile Avatar & Info — dropdown trigger with click-outside ref */}
            <div className="relative" ref={roleMenuRef}>
              <button onClick={() => setShowRoleMenu(!showRoleMenu)} className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-[#c0cad8] bg-white hover:bg-[#dee2e8]/60 transition-all cursor-pointer group text-start shadow-2xs hover:border-[#0b96c7] shrink-0" title={t.switchRole}>
                {/* Avatar with Status Dot */}
                <div className="relative shrink-0">
                  <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-[#c0cad8] group-hover:border-[#0b96c7] transition-colors"/>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${user.role === 'training_admin'
            ? 'bg-[#0b96c7]'
            : user.role === 'system_admin'
                ? 'bg-[#485261]'
                : 'bg-[#6bbada]'}`}/>
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
                  <ActiveIcon className="w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 text-[#0b96c7]"/>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showRoleMenu ? 'rotate-180' : ''}`}/>
                </div>
              </button>

              {/* Role / Profile Dropdown */}
              {showRoleMenu && (<>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)}/>
                  <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} z-50 w-[320px] sm:w-[340px] bg-white rounded-2xl shadow-xl border border-[#c0cad8] p-3`} style={{ animation: 'fadeInUp 0.18s ease-out both' }}>
                    {/* User profile header card */}
                    <div className="p-3 rounded-xl bg-[#dee2e8]/45 border border-[#c0cad8]">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img src={user.avatarUrl} alt={user.name} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"/>
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${user.role === 'training_admin' ? 'bg-[#0b96c7]' : user.role === 'system_admin' ? 'bg-[#485261]' : 'bg-[#6bbada]'}`}/>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#485261] truncate">
                            {isRTL && user.nameAr ? user.nameAr : user.name}
                          </p>
                          <p className="text-[11px] text-[#9995a6] truncate">
                            {isRTL && user.titleAr ? user.titleAr : user.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${activeBadge.color}`}>
                              {activeBadge.label}
                            </span>
                            {user.employeeId && (
                              <span className="text-[10px] font-mono text-[#9995a6]">
                                {user.employeeId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Trainee progress bar if trainee */}
                      {user.role === 'trainee' && (
                        <div className="mt-2.5 pt-2 border-t border-[#c0cad8]/60">
                          <div className="flex justify-between text-[11px] font-semibold text-[#485261] mb-1">
                            <span>{t.overallCompletion || 'Overall Progress'}</span>
                            <span className="text-[#0b96c7] font-mono font-bold">{user.overallProgress}%</span>
                          </div>
                          <div className="w-full bg-[#c0cad8] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#0b96c7] h-full rounded-full transition-all duration-300" style={{ width: `${user.overallProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Department / Facility info */}
                    <div className="px-2 py-2 text-[11px] text-[#9995a6] border-b border-[#dee2e8] flex items-center justify-between">
                      <span className="truncate">{isRTL && user.branchAr ? user.branchAr : user.branch || 'Shalaby Labs Main Facility'}</span>
                      <span className="text-[10px] font-mono text-[#0b96c7] font-bold shrink-0">ISO 15189</span>
                    </div>

                    {/* Menu Actions: Help & Support, SOPs */}
                    <div className="py-1.5 space-y-1">
                      
                      {/* Help & Support option */}
                      <button 
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          if (onOpenSupport) onOpenSupport();
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start text-[#485261] hover:bg-[#dee2e8]/60 hover:text-[#0b96c7] transition-all cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#dee2e8]/80 text-[#0b96c7] flex items-center justify-center shrink-0 group-hover:bg-[#0b96c7] group-hover:text-white transition-colors">
                          <HelpCircle className="w-4 h-4"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold block">{isRTL ? 'الدعم الفني والمساعدة' : 'Help & Support'}</span>
                          <span className="text-[10px] text-[#9995a6] block truncate">{isRTL ? 'أدلة الاستخدام والتوجيه الفني' : 'Technical guidance & FAQs'}</span>
                        </div>
                      </button>

                      {/* SOP & Protocols Library */}
                      <button 
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          onNavigate('resources');
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start text-[#485261] hover:bg-[#dee2e8]/60 hover:text-[#0b96c7] transition-all cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[#dee2e8]/80 text-[#0b96c7] flex items-center justify-center shrink-0 group-hover:bg-[#0b96c7] group-hover:text-white transition-colors">
                          <FileText className="w-4 h-4"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold block">{isRTL ? 'أدلة العمل القياسية SOP' : 'SOP & Clinical Protocols'}</span>
                          <span className="text-[10px] text-[#9995a6] block truncate">{isRTL ? 'البروتوكولات المخبرية المعتمدة' : 'Accredited lab protocols'}</span>
                        </div>
                      </button>

                    </div>

                    {/* Divider & Logout Button */}
                    <div className="pt-1.5 border-t border-[#dee2e8]">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRoleMenu(false);
                          if (onLogout) {
                            onLogout();
                          } else {
                            onNavigate('role_select');
                          }
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-start text-rose-600 hover:bg-rose-50 transition-all cursor-pointer font-semibold group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                          <LogOut className="w-3.5 h-3.5"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold block">{isRTL ? 'تسجيل الخروج' : 'Log Out'}</span>
                          <span className="text-[10px] text-rose-500/80 block">{isRTL ? 'الرجوع لشاشة اختيار الدور' : 'Sign out & return to role selection'}</span>
                        </div>
                      </button>
                    </div>

                  </div>
                </>)}
            </div>

          </div>

        </div>

      </div>
    </header>);
};
