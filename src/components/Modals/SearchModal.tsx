import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, FileText, CheckSquare, PlayCircle, ArrowRight } from 'lucide-react';
import { ViewType } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const searchItems = [
    {
      title: 'Lab Safety Protocols (SP-101)',
      titleAr: 'بروتوكولات السلامة المخبرية (SP-101)',
      category: 'Module',
      categoryAr: 'مقرر تدريبي',
      icon: BookOpen,
      view: 'dashboard' as ViewType,
      desc: 'Fundamental safety guidelines for operating within the level 2 facility.',
      descAr: 'المبادئ الأساسية للسلامة والعمل داخل مرافق المستوى الثاني BSL-2.',
    },
    {
      title: 'Sample Handling & Processing (SP-202)',
      titleAr: 'مناولة ومعالجة العينات السريرية (SP-202)',
      category: 'Module',
      categoryAr: 'مقرر تدريبي',
      icon: BookOpen,
      view: 'video_lesson' as ViewType,
      desc: 'Receiving, logging, and preparing biological samples for analysis.',
      descAr: 'استلام وفهرسة وتجهيز العينات الحيوية لأجهزة التحليل المؤتمتة.',
    },
    {
      title: 'Pre-analytical Centrifugation Protocols',
      titleAr: 'بروتوكولات الطرد المركزي قبل التحليل',
      category: 'Video Lesson',
      categoryAr: 'درس فيديو',
      icon: PlayCircle,
      view: 'video_lesson' as ViewType,
      desc: 'Lesson 3 pre-analytical verification steps & rotor balancing.',
      descAr: 'الدرس 3: خطوات التحقق المسبق وموازنة أجهزة الطرد المركزي.',
    },
    {
      title: 'Type B Biological Hazard Sequence Quiz',
      titleAr: 'اختبار تقييم تسلسل التعامل مع المخاطر الحيوية',
      category: 'Assessment',
      categoryAr: 'تقييم سريري',
      icon: CheckSquare,
      view: 'quiz' as ViewType,
      desc: 'Interactive quiz on mandatory PPE removal sequence.',
      descAr: 'اختبار تفاعلي على بروتوكول نزع معدات الوقاية الشخصية PPE.',
    },
    {
      title: 'Coaching for Success - GROW Framework',
      titleAr: 'التوجيه للنجاح - نموذج GROW القيادي',
      category: 'Leadership',
      categoryAr: 'مسار القيادة',
      icon: BookOpen,
      view: 'coaching' as ViewType,
      desc: 'GROW Model Template PDF & Manager discussion thread.',
      descAr: 'قالب نموذج GROW التوجيهي ومنتدى تبادل الخبرات القيادية.',
    },
    {
      title: 'Lab Safety Manual v2.4 (SOP Document)',
      titleAr: 'دليل السلامة المخبرية الإصدار 2.4 (وثيقة SOP)',
      category: 'SOP Resource',
      categoryAr: 'وثيقة تشغيلية',
      icon: FileText,
      view: 'resources' as ViewType,
      desc: '2.4 MB downloadable PDF safety reference manual.',
      descAr: 'مرجع معايير السلامة التشغيلية المعتمد بصيغة PDF.',
    },
    {
      title: 'Senior Clinical Manager Completion Certificate',
      titleAr: 'شهادة مدير مختبرات إكلينيكية أول معتمد',
      category: 'Certificate',
      categoryAr: 'شهادة معتمدة',
      icon: FileText,
      view: 'certificate' as ViewType,
      desc: 'Official certificate issued by Shalaby Labs Board.',
      descAr: 'الشهادة الرسمية المعتمدة الصادرة عن مجلس إدارة معامل شلبي.',
    },
  ];

  const filtered = query.trim() === ''
    ? searchItems
    : searchItems.filter(item => {
        const matchTitle = (item.title + ' ' + item.titleAr).toLowerCase().includes(query.toLowerCase());
        const matchDesc = (item.desc + ' ' + item.descAr).toLowerCase().includes(query.toLowerCase());
        const matchCat = (item.category + ' ' + item.categoryAr).toLowerCase().includes(query.toLowerCase());
        return matchTitle || matchDesc || matchCat;
      });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#C0CAD8] overflow-hidden flex flex-col max-h-[80vh] text-start">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#C0CAD8] flex items-center gap-3 bg-[#DEE2E8]">
          <Search className="w-5 h-5 text-[#0B96C7] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder={isRTL ? "ابحث في الدروس، وثائق SOP، نماذج GROW، الاختبارات..." : "Search lessons, SOPs, GROW model templates, quizzes..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm md:text-base text-[#485261] placeholder-[#9995A6] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#9995A6] hover:text-[#485261] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-[#C0CAD8] hover:bg-[#C0CAD8] text-[#485261] rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-1 custom-scrollbar flex-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[#9995A6] text-sm">
              {isRTL 
                ? `لم يتم العثور على نتائج لـ "${query}". جرب البحث عن "سلامة"، "GROW"، أو "عينات".`
                : `No results found for "${query}". Try searching for "PPE", "Coaching", or "Safety".`}
            </div>
          ) : (
            filtered.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="w-full p-3 rounded-2xl text-start hover:bg-[#DEE2E8] transition-all border border-transparent hover:border-[#C0CAD8] flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0B96C7]/10 text-[#0B96C7] group-hover:bg-[#0B96C7] group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#485261]">
                          {isRTL ? item.titleAr : item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#C0CAD8] text-[#485261]">
                          {isRTL ? item.categoryAr : item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#9995A6] mt-0.5 line-clamp-1 leading-relaxed">
                        {isRTL ? item.descAr : item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-[#9995A6] group-hover:text-[#0B96C7] transition-transform ${isRTL ? 'group-hover:-translate-x-1 rotate-180 mr-2' : 'group-hover:translate-x-1 ml-2'} shrink-0`} />
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 bg-[#DEE2E8] border-t border-[#C0CAD8] flex items-center justify-between text-[11px] text-[#9995A6]">
          <span>{isRTL ? "ملاحظة: يمكنك الضغط على ⌘K أو Ctrl+K لفتح نافذة البحث فورياً" : "Tip: Press ⌘K anytime to open search"}</span>
          <span>{isRTL ? "قاعدة بيانات معمل شلبي" : "Shalaby Labs Database"}</span>
        </div>

      </div>
    </div>
  );
};
