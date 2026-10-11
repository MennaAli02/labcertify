import React from 'react';
import { ViewType, UserProfile, Course } from '../../types';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Star, 
  ArrowRight, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { mockCourses } from '../../data/mockData';

interface DashboardViewProps {
  user: UserProfile;
  modules: Course[];
  onNavigate: (view: ViewType) => void;
  onSelectModule: (module: Course) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  modules = mockCourses,
  onNavigate,
  onSelectModule,
}) => {
  const { t, isRTL } = useLanguage();
  const activeCourse = modules.find(m => m.status === 'In Progress') || modules[1] || modules[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner Header */}
      <div className="bg-gradient-to-r from-[#006672] via-[#00818f] to-[#27308a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className={`absolute ${isRTL ? '-left-10' : '-right-10'} -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none`} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isRTL ? user.phaseAr || "المرحلة الأولى: السلامة المخبرية والمعايير" : user.phase}</span>
            </div>

            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              {t.welcomeBack}, {isRTL ? user.nameAr || user.name : user.name}
            </h1>
            
            <p className="text-white/85 text-sm sm:text-base max-w-xl leading-relaxed">
              {t.welcomeSubtext}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onSelectModule(activeCourse);
                onNavigate('video_lesson');
              }}
              className="px-6 py-3 bg-[#ffffff] text-[#006672] font-bold text-sm rounded-2xl shadow-lg hover:bg-emerald-50 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current text-[#006672] ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t.resumeTraining}</span>
            </button>
            <button
              onClick={() => onNavigate('certificate')}
              className="p-3 bg-white/15 hover:bg-white/25 rounded-2xl transition-colors text-white cursor-pointer"
              title={t.officialCert}
            >
              <Award className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid: Progress Summary & Up Next */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Overall Progress Gauge Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col justify-between text-start">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-lg text-[#191c1e]">
                {t.overallProgress}
              </h2>
              <span className="p-2 bg-[#f2f4f6] text-[#006672] rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </span>
            </div>

            <div className="flex items-center gap-6 py-2">
              {/* Circular Progress SVG */}
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e0e3e5]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#006672]"
                    strokeDasharray={`${user.overallProgress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="font-headline font-extrabold text-xl text-[#191c1e]">
                    {user.overallProgress}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-[#191c1e]">
                  {isRTL ? "إكمال المرحلة الأولى" : "Phase 1 Progress"}
                </p>
                <p className="text-xs text-[#6d797c] mt-1 leading-relaxed">
                  {isRTL 
                    ? "تم إنجاز 3 من أصل 4 مقررات أساسية ومطلوبة." 
                    : "3 of 4 core modules completed on track."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#f2f4f6] flex items-center justify-between text-xs font-semibold text-[#006672]">
            <span>{isRTL ? "معتمد لمعايير المستوى الثاني BSL-2" : "Level 2 Safety Certified"}</span>
            <button 
              onClick={() => onNavigate('performance')}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isRTL ? "عرض الإحصائيات" : "View stats"}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Up Next Card */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#ffffff] to-[#f7f9fb] rounded-3xl p-6 border border-[#e0e3e5] shadow-xs flex flex-col justify-between relative overflow-hidden text-start">
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-[#006672]/10 text-[#006672] text-xs font-bold rounded-full uppercase tracking-wider inline-block mb-2 font-mono">
                {t.upNext} • {activeCourse.code}
              </span>
              <h2 className="font-headline font-bold text-xl text-[#191c1e]">
                {isRTL ? activeCourse.titleAr : activeCourse.title}
              </h2>
              <p className="text-sm text-[#6d797c] mt-1 max-w-xl leading-relaxed">
                {isRTL ? activeCourse.descriptionAr : activeCourse.description}
              </p>
            </div>

            <img
              src={activeCourse.imageUrl}
              alt={activeCourse.title}
              className="w-24 h-24 rounded-2xl object-cover shadow-sm border border-[#e0e3e5] hidden sm:block shrink-0"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-[#e0e3e5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs font-medium text-[#3d494b]">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#006672]" />
                {t.estTime}: {activeCourse.estMinutes} {t.mins}
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#006672]">
                <CheckCircle2 className="w-4 h-4" />
                {isRTL ? "نسبة الإنجاز" : "Progress"}: {activeCourse.progress}%
              </span>
            </div>

            <button
              onClick={() => {
                onSelectModule(activeCourse);
                onNavigate('video_lesson');
              }}
              className="px-5 py-2.5 bg-[#006672] hover:bg-[#00818f] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t.resumeModule}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Active Modules / Courses Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="text-start">
            <h2 className="font-headline font-bold text-xl text-[#191c1e]">
              {t.activeModules}
            </h2>
            <p className="text-xs text-[#6d797c]">
              {isRTL 
                ? "اختر المقرر للاطلاع على الفيديوهات، بروتوكولات SOP واختبارات التقييم."
                : "Select a course to view structured video lessons, SOP protocols, and assessments."}
            </p>
          </div>

          <button
            onClick={() => onNavigate('leadership_path')}
            className="text-xs font-bold text-[#006672] hover:text-[#00818f] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>{isRTL ? "استعراض مسار القيادة المخبرية" : "Explore Leadership Roadmap"}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCourses.map((module) => {
            const isCompleted = module.status === 'Completed';
            const isInProgress = module.status === 'In Progress';

            return (
              <div
                key={module.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#e0e3e5] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group text-start"
              >
                <div>
                  {/* Module Card Image Banner */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={module.imageUrl}
                      alt={module.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} flex items-center gap-2`}>
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold rounded-lg font-mono">
                        {module.code}
                      </span>
                      {module.isStarred && (
                        <span className="p-1 bg-amber-400 text-slate-900 rounded-lg shadow-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md ${
                        isCompleted ? 'bg-emerald-500/90 text-white' :
                        isInProgress ? 'bg-[#006672]/90 text-white' :
                        'bg-slate-700/80 text-slate-200'
                      }`}>
                        {isCompleted 
                          ? (isRTL ? 'مكتمل' : 'Completed') 
                          : isInProgress 
                          ? (isRTL ? 'قيد الدراسة' : 'In Progress') 
                          : (isRTL ? 'متاح' : 'Upcoming')}
                      </span>

                      <span className="text-xs font-medium text-white/90">
                        {module.estMinutes} {t.mins}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#006672] uppercase tracking-wider">
                        {isRTL ? module.categoryAr : module.category}
                      </span>
                      <span className="text-[10px] text-[#6d797c] font-semibold">
                        {module.cmeCredits || 3} CME
                      </span>
                    </div>

                    <h3 className="font-headline font-bold text-base text-[#191c1e] group-hover:text-[#006672] transition-colors line-clamp-1">
                      {isRTL ? module.titleAr : module.title}
                    </h3>
                    <p className="text-xs text-[#6d797c] line-clamp-2 leading-relaxed">
                      {isRTL ? module.descriptionAr : module.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#6d797c] mb-1">
                      <span>{isRTL ? "نسبة الإنجاز" : "Progress"}</span>
                      <span>{module.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#e0e3e5] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isCompleted ? 'bg-emerald-500' : 'bg-[#006672]'
                        }`}
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectModule(module);
                      onNavigate('video_lesson');
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCompleted
                        ? 'bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#3d494b]'
                        : isInProgress
                        ? 'bg-[#006672] hover:bg-[#00818f] text-white shadow-xs'
                        : 'bg-[#006672]/10 hover:bg-[#006672]/20 text-[#006672]'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <BookOpen className="w-4 h-4" />
                        <span>{t.reviewMaterial}</span>
                      </>
                    ) : isInProgress ? (
                      <>
                        <Play className={`w-4 h-4 fill-current ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{t.resumeModule}</span>
                      </>
                    ) : (
                      <>
                        <Play className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        <span>{t.startModule}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Resource Banner */}
      <div className="bg-[#ffffff] rounded-3xl p-6 border border-[#e0e3e5] flex flex-col sm:flex-row items-center justify-between gap-4 text-start">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#006672]/10 text-[#006672] rounded-2xl shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-[#191c1e]">
              {isRTL 
                ? "هل تبحث عن أدلة الممارسة الإكلينيكية وإجراءات التشغيل القياسية (SOPs)؟" 
                : "Looking for Clinical Guidelines & SOP Manuals?"}
            </h4>
            <p className="text-xs text-[#6d797c] mt-0.5 leading-relaxed">
              {isRTL 
                ? "يمكنك الوصول المباشر إلى كتيبات السلامة الكيميائية، ومصفوفات المعايرة، ونماذج نموذج GROW القيادي." 
                : "Access standard operating procedures, chemical safety matrices, and printable GROW model canvases."}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('resources')}
          className="px-5 py-2.5 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#006672] text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isRTL ? "مكتبة البروتوكولات (SOP)" : "View SOP Library"}
        </button>
      </div>

    </div>
  );
};
