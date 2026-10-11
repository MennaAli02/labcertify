import React from 'react';
import { ViewType, UserProfile } from '../../types';
import { 
  Compass,
  PlayCircle, 
  CheckSquare, 
  BarChart2, 
  Award, 
  Folder, 
  X,
  ShieldCheck,
  UserCheck,
  Settings,
  Menu
} from 'lucide-react';
import { LOGO_URL } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface SideNavBarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  completedModulesCount: number;
  totalModulesCount: number;
  user: UserProfile;
  isOpen: boolean;
  onToggleCollapse?: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentView,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  completedModulesCount,
  totalModulesCount,
  user,
  isOpen,
  onToggleCollapse,
}) => {
  const { t, isRTL } = useLanguage();

  const getNavItems = () => {
    if (user.role === 'training_admin') {
      return [
        {
          id: 'training_admin' as ViewType,
          label: t.adminDashboardTitle,
          icon: UserCheck,
          badge: isRTL ? 'لوحة القيادة' : 'Dashboard',
        },
        {
          id: 'resources' as ViewType,
          label: t.navResources,
          icon: Folder,
          badge: isRTL ? 'أدلة SOP' : 'SOPs',
        },
        {
          id: 'certificate' as ViewType,
          label: t.navCertificate,
          icon: Award,
          badge: isRTL ? 'الشهادات' : 'Certs',
        },
        {
          id: 'trainee_dashboard' as ViewType,
          label: isRTL ? 'معاينة شاشة المتدرب' : 'Trainee Path Preview',
          icon: Compass,
          badge: isRTL ? 'معاينة' : 'Preview',
        }
      ];
    }

    if (user.role === 'system_admin') {
      return [
        {
          id: 'system_admin' as ViewType,
          label: t.sysAdminTitle,
          icon: Settings,
          badge: isRTL ? 'مدير النظام' : 'System',
        },
        {
          id: 'training_admin' as ViewType,
          label: t.adminDashboardTitle,
          icon: UserCheck,
          badge: isRTL ? 'لوحة التدريب' : 'Training',
        },
        {
          id: 'resources' as ViewType,
          label: t.navResources,
          icon: Folder,
          badge: isRTL ? 'أدلة SOP' : 'SOPs',
        },
        {
          id: 'trainee_dashboard' as ViewType,
          label: isRTL ? 'معاينة شاشة المتدرب' : 'Trainee Path Preview',
          icon: Compass,
          badge: isRTL ? 'معاينة' : 'Preview',
        }
      ];
    }

    // Default: Trainee navigation
    return [
      {
        id: 'trainee_dashboard' as ViewType,
        label: t.navTraineeDashboard,
        icon: Compass,
        badge: `${completedModulesCount}/${totalModulesCount}`,
        highlight: true,
      },
      {
        id: 'video_lesson' as ViewType,
        label: t.navCourses,
        icon: PlayCircle,
        badge: isRTL ? '5 مقررات' : '5 Courses',
      },
      {
        id: 'quiz' as ViewType,
        label: t.navQuiz,
        icon: CheckSquare,
        badge: isRTL ? '≥ 80%' : '≥ 80%',
      },
      {
        id: 'certificate' as ViewType,
        label: t.navCertificate,
        icon: Award,
        badge: isRTL ? 'رقمي QR' : 'QR Verified',
      },
      {
        id: 'performance' as ViewType,
        label: t.navPerformance,
        icon: BarChart2,
      },
      {
        id: 'resources' as ViewType,
        label: t.navResources,
        icon: Folder,
        badge: isRTL ? 'أدلة SOP' : 'SOPs',
      },
    ];
  };

  const navItems = getNavItems();

  const handleItemClick = (view: ViewType) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Desktop Persistent Sidebar: w-[272px] when open, w-[72px] when collapsed (rail mode) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white ${
          isRTL ? 'border-l' : 'border-r'
        } border-[#c0cad8] h-full select-none transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[272px]' : 'w-[72px]'
        }`}
      >
        {isOpen ? (
          /* ================= EXPANDED VIEW (272px) ================= */
          <div className="flex flex-col h-full py-3 px-3.5 overflow-y-auto">
            
            {/* Trainee Progress Bar (only for trainee) */}
            {user.role === 'trainee' && (
              <div className="mb-3 p-3 rounded-xl bg-[#dee2e8]/40 border border-[#c0cad8] shadow-2xs">
                <div className="flex justify-between items-center text-xs font-bold text-[#485261] mb-1.5">
                  <span>{t.overallCompletion}</span>
                  <span className="font-mono tabular-nums text-[#0b96c7] font-bold">{user.overallProgress}%</span>
                </div>
                <div className="w-full bg-[#c0cad8] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#0b96c7] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${user.overallProgress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#9995a6] mt-2 font-mono">
                  <span>{completedModulesCount}/{totalModulesCount} {isRTL ? 'مكتمل' : 'Completed'}</span>
                  <span className="text-[#0b96c7] font-sans font-semibold">{user.overallProgress === 100 ? (isRTL ? 'معتمد' : 'Accredited') : (isRTL ? 'جاري' : 'In Progress')}</span>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1 flex-1">
              <p className="text-[10px] uppercase font-bold text-[#9995a6] px-3 mb-2 tracking-wider">
                {user.role === 'training_admin' ? (isRTL ? 'أدوات الإدارة والتقارير' : 'Management & Reports') : user.role === 'system_admin' ? (isRTL ? 'حوكمة النظام والرقابة' : 'System Governance') : (isRTL ? 'المسار التدريبي' : 'Training Roadmap')}
              </p>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (item.id === 'trainee_dashboard' && currentView === 'dashboard');

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    title={item.label}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-start font-medium leading-snug whitespace-nowrap">{item.label}</span>
                    
                    {item.badge && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono tabular-nums transition-colors shrink-0 whitespace-nowrap ${
                        isActive 
                          ? 'bg-[#0b96c7] text-white font-bold' 
                          : 'text-[#0b96c7] bg-[#dee2e8]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer Accreditation Info */}
            <div className="pt-3 border-t border-[#c0cad8] mt-auto">
              <div className="p-2.5 bg-[#dee2e8]/40 rounded-xl text-[11px] text-[#485261] space-y-1 border border-[#c0cad8]">
                <div className="flex items-center justify-between font-semibold text-[#485261]">
                  <span>{isRTL ? 'معايير الاعتماد' : 'Accreditation'}</span>
                  <span className="text-[10px] font-mono text-[#0b96c7] font-bold">ISO 15189</span>
                </div>
                <p className="text-[10.5px] text-[#9995a6] leading-tight truncate">
                  {isRTL ? 'المركز الإقليمي للتدريب' : 'Clinical Diagnostic Division'}
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* ================= COLLAPSED RAIL VIEW (72px) ================= */
          <div className="flex flex-col items-center h-full py-3 px-2 overflow-y-auto">

            {/* Trainee Mini Progress Indicator */}
            {user.role === 'trainee' && (
              <div 
                className="mb-2.5 py-1 px-1.5 rounded-md bg-[#dee2e8] border border-[#c0cad8] text-center cursor-default w-full"
                title={`${t.overallCompletion}: ${user.overallProgress}%`}
              >
                <span className="text-[10px] font-mono font-bold text-[#0b96c7] block">{user.overallProgress}%</span>
              </div>
            )}

            {/* Collapsed Rail Nav Icons with Accessible Tooltips */}
            <div className="space-y-1.5 flex-1 w-full mt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (item.id === 'trainee_dashboard' && currentView === 'dashboard');

                return (
                  <div key={item.id} className="relative group flex justify-center w-full">
                    <button
                      onClick={() => handleItemClick(item.id)}
                      title={item.label}
                      aria-label={item.label}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all relative cursor-pointer ${
                        isActive 
                          ? 'bg-[#dee2e8] text-[#0b96c7] font-bold border-s-3 border-[#0b96c7] shadow-2xs' 
                          : 'text-[#485261] hover:bg-[#dee2e8] hover:text-[#0b96c7]'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      {item.badge && (
                        <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-[#0b96c7]" />
                      )}
                    </button>
                    {/* Tooltip on hover/focus */}
                    <div className={`absolute ${isRTL ? 'right-full mr-2.5' : 'left-full ml-2.5'} top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#485261] text-white text-xs font-semibold rounded-md shadow-md opacity-0 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-50 whitespace-nowrap`}>
                      {item.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer ISO Shield Icon */}
            <div className="pt-3 border-t border-[#c0cad8] mt-auto flex justify-center w-full" title="ISO 15189 / CAP Accredited">
              <ShieldCheck className="w-5 h-5 text-[#0b96c7]" />
            </div>

          </div>
        )}
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-72 bg-white shadow-2xl z-50 flex flex-col p-4 border-[#c0cad8]`}>
            
            {/* Header in mobile drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]">
              <div className="flex items-center gap-2.5">
                <img 
                  src={LOGO_URL} 
                  alt="Shalaby Labs" 
                  className="w-8 h-8 object-contain rounded-md"
                />
                <div>
                  <h2 className="text-xs font-bold text-[#485261] uppercase font-heading">{t.brandTitle}</h2>
                  <p className="text-[10.5px] text-[#9995a6]">{t.brandSubtitle}</p>
                </div>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-[#485261] hover:bg-[#dee2e8] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav items */}
            <div className="space-y-1 flex-1 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (item.id === 'trainee_dashboard' && currentView === 'dashboard');

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 truncate text-start font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono tabular-nums ${
                        isActive 
                          ? 'bg-[#0b96c7] text-white font-bold' 
                          : 'text-[#0b96c7] bg-[#dee2e8]'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

