import React from 'react';
import { ViewType, UserProfile } from '../../types';
import { 
  Compass,
  PlayCircle, 
  CheckSquare, 
  BarChart2, 
  Award, 
  FileText, 
  X,
  ShieldCheck,
  Folder,
  Users,
  Settings,
  Activity,
  UserCheck,
  Sliders,
  Database
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SideNavBarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  completedModulesCount: number;
  totalModulesCount: number;
  user: UserProfile;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentView,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  completedModulesCount,
  totalModulesCount,
  user,
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

  const navContent = (
    <div className="flex flex-col h-full py-5 px-3">
      {/* Brand Header inside Sidebar */}
      <div className="px-3 pb-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-xs ${user.role === 'training_admin' ? 'bg-emerald-700' : user.role === 'system_admin' ? 'bg-slate-700' : 'bg-[#006672]'}`}>
            {user.role === 'training_admin' ? <UserCheck className="w-5 h-5" /> : user.role === 'system_admin' ? <Settings className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-slate-900 tracking-tight truncate">
              {user.role === 'training_admin' ? (isRTL ? 'إدارة التدريب المخبري' : 'Training Administration') : user.role === 'system_admin' ? (isRTL ? 'إدارة النظام والاعتماد' : 'System & Quality Admin') : (isRTL ? 'مسار التوجيه المخبري' : 'Clinical Orientation')}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium truncate">
              {isRTL ? 'معامل شلبي · برنامج الامتثال' : 'Shalaby Labs · Compliance'}
            </p>
          </div>
        </div>
      </div>

      {/* Trainee Progress Bar in Sidebar (only for trainee) */}
      {user.role === 'trainee' && (
        <div className="my-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex justify-between items-center text-xs font-bold text-[#006672] mb-1.5">
            <span>{t.overallCompletion}</span>
            <span className="font-mono tabular-nums">{user.overallProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#006672] h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${user.overallProgress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
            <span>{completedModulesCount}/{totalModulesCount} {isRTL ? 'مكتمل' : 'Completed'}</span>
            <span className="text-emerald-700 font-sans font-medium">{user.overallProgress === 100 ? (isRTL ? 'معتمد' : 'Accredited') : (isRTL ? 'جاري' : 'In Progress')}</span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="space-y-1 flex-1 mt-2">
        <p className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-2 tracking-wider">
          {user.role === 'training_admin' ? (isRTL ? 'أدوات الإدارة والتقارير' : 'Management & Reports') : user.role === 'system_admin' ? (isRTL ? 'حوكمة النظام والرقابة' : 'System Governance') : (isRTL ? 'المسار التدريبي' : 'Training Roadmap')}
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'trainee_dashboard' && currentView === 'dashboard');

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#006672] text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums transition-colors shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : item.highlight
                      ? 'bg-teal-50 text-[#006672] font-semibold'
                      : 'text-slate-500 bg-slate-100'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="pt-3 border-t border-slate-200/80 mt-auto">
        <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1 border border-slate-200/60">
          <div className="flex items-center justify-between font-semibold text-slate-900">
            <span>{isRTL ? 'معايير الاعتماد' : 'Accreditation'}</span>
            <span className="text-[10px] font-mono text-[#006672] font-bold">ISO 15189 / CAP</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            {isRTL ? 'المركز الإقليمي للتدريب المخبري' : 'Clinical Diagnostic Training Division'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden lg:block w-64 shrink-0 bg-white ${isRTL ? 'border-l' : 'border-r'} border-slate-200/90 min-h-[calc(100vh-57px)]`}>
        {navContent}
      </aside>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className={`fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-72 bg-white shadow-2xl z-50 flex flex-col`}>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onCloseMobile}
                className="p-1.5 text-[#3d494b] hover:bg-[#f2f4f6] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
