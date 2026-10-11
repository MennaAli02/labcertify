import React from 'react';
import { ViewType, UserProfile } from '../../types';
import { 
  BarChart2, 
  Award, 
  CheckCircle, 
  Clock, 
  Download, 
  FileText, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { 
  mockPerformanceHistory, 
  mockCoreCompetencies, 
  mockResources 
} from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface PerformanceTrackerViewProps {
  user: UserProfile;
  onNavigate: (view: ViewType) => void;
}

export const PerformanceTrackerView: React.FC<PerformanceTrackerViewProps> = ({ user, onNavigate }) => {
  const { t, isRTL } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-start">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c0cad8] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0B96C7]/10 text-[#0B96C7] rounded-full text-xs font-bold uppercase tracking-wider">
              <BarChart2 className="w-4 h-4" />
              <span>{isRTL ? "الكفاءة الإكلينيكية والتحليلات المخبرية" : "Clinical Competency & Analytics"}</span>
            </div>
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#485261] dark:text-white">
              {t.performanceTitle}
            </h1>
            <p className="text-sm text-[#9995A6] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
              {t.performanceSubtext}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('certificate')}
              className="px-5 py-2.5 bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{t.officialCert}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Overall Score Dial + Competencies List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Overall Score Dial */}
        <div className="bg-gradient-to-br from-[#0B96C7] to-[#087fa8] rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              {isRTL ? "الكفاءة الإكلينيكية الإجمالية" : "Overall Clinical Proficiency"}
            </span>
            <div className="mt-4 flex items-center gap-6">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-white"
                    strokeDasharray="78, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-headline font-extrabold text-2xl text-white">
                  78%
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-headline font-bold text-lg text-white">
                  {isRTL ? "ممارس سريري ممتاز (فئة أ)" : "Grade A Practitioner"}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">
                  {isRTL 
                    ? "يتجاوز الحد الأدنى لمعايير السلامة البيولوجية BSL-2 بنسبة 12%." 
                    : "Exceeds standard BSL-2 compliance thresholds by 12%."}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-xs text-white/90">
            {isRTL ? "آخر تدقيق ميداني وتحديث بيانات: 20 أكتوبر 2024." : "Last audit evaluation completed on Oct 20, 2024."}
          </div>
        </div>

        {/* Core Competencies Checklist */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#c0cad8] shadow-xs space-y-4">
          <h2 className="font-headline font-bold text-lg text-[#485261] dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0B96C7]" />
            <span>{t.coreCompetencies}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockCoreCompetencies.map((comp) => (
              <div 
                key={comp.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors ${
                  comp.mastered 
                    ? 'bg-emerald-500/10 border-emerald-500/30' 
                    : 'bg-[#dee2e8] dark:bg-[#182A45] border-[#c0cad8] dark:border-[#1E3557]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${
                    comp.mastered ? 'bg-emerald-500 text-white' : 'bg-[#c0cad8] dark:bg-[#1E3557] text-[#485261] dark:text-[#94A3B8]'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#485261] dark:text-white">
                      {isRTL ? comp.nameAr || comp.name : comp.name}
                    </h4>
                    <span className="text-[11px] text-[#9995A6] dark:text-[#94A3B8]">{comp.level}</span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  comp.mastered 
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300' 
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                }`}>
                  {comp.mastered ? (isRTL ? 'متقن' : 'Mastered') : (isRTL ? 'قيد التطوير' : 'In Progress')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Module Assessment Scores History */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c0cad8] shadow-xs space-y-6">
        <h2 className="font-headline font-bold text-xl text-[#485261] dark:text-white">
          {isRTL ? "سجل نتائج التقييمات والاختبارات الدورية" : "Assessment History & Score Log"}
        </h2>

        <div className="space-y-4">
          {mockPerformanceHistory.map((item) => (
            <div key={item.id} className="p-5 rounded-2xl bg-[#dee2e8] dark:bg-[#182A45] border border-[#c0cad8] dark:border-[#1E3557] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline font-bold text-base text-[#485261] dark:text-white">
                    {isRTL ? item.titleAr || item.title : item.title}
                  </h3>
                  <span className="text-xs text-[#9995A6] dark:text-[#94A3B8] font-mono">
                    {isRTL ? `تاريخ الإتمام: ${item.completedDate}` : `Completed: ${item.completedDate}`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold px-3 py-1 rounded-xl bg-[#0B96C7]/10 dark:bg-[#0B96C7]/20 text-[#0B96C7] dark:text-[#6BBADA]">
                    {isRTL ? `الدرجة: ${item.score} من ${item.maxScore}` : `Score: ${item.score}/${item.maxScore}`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#485261] dark:text-[#DEE2E8] leading-relaxed">
                {isRTL ? item.summaryAr || item.summary : item.summary}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#c0cad8] dark:bg-[#1E3557] text-[#485261] dark:text-[#DEE2E8]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standard Operating Procedures & Documents Download Center */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c0cad8] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline font-bold text-xl text-[#485261] dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0B96C7]" />
            <span>{t.sopLibrary}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockResources.map((res) => (
            <div 
              key={res.id} 
              className="p-4 rounded-2xl border border-[#c0cad8] dark:border-[#1E3557] bg-[#dee2e8] dark:bg-[#182A45] hover:border-[#0B96C7] transition-colors flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0B96C7]/10 dark:bg-[#0B96C7]/20 text-[#0B96C7] dark:text-[#6BBADA]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#485261] dark:text-white line-clamp-1">
                    {isRTL ? res.titleAr || res.title : res.title}
                  </h4>
                  <span className="text-[10px] text-[#9995A6] dark:text-[#94A3B8]">
                    {res.format} {res.size ? `• ${res.size}` : ''}
                  </span>
                </div>
              </div>

              <button
                onClick={() => alert(isRTL ? `جاري تحميل ${res.titleAr || res.title}...` : `Downloading ${res.title}...`)}
                className="p-2 text-[#0B96C7] dark:text-[#6BBADA] hover:bg-[#c0cad8] dark:hover:bg-[#1E3557] rounded-xl transition-colors cursor-pointer"
                title="Download Resource"
              >
                {res.format === 'External Link' ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
