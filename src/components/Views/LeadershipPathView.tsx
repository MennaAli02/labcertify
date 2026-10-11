import React from 'react';
import { ViewType } from '../../types';
import { 
  GitMerge, 
  CheckCircle, 
  Play, 
  Lock, 
  Award, 
  Users, 
  BrainCircuit, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface LeadershipPathViewProps {
  onNavigate: (view: ViewType) => void;
}

export const LeadershipPathView: React.FC<LeadershipPathViewProps> = ({ onNavigate }) => {
  const { t, isRTL } = useLanguage();

  const stages = [
    {
      stage: '01',
      title: 'Team Building',
      titleAr: 'بناء فرق العمل المخبرية',
      status: 'Completed',
      desc: 'Foundational team dynamics and communication channels in clinical labs.',
      descAr: 'ديناميكيات الفرق التأسيسية وقنوات التواصل السريري في المعامل الحديثة.',
      progress: 100,
      badge: 'Completed',
      badgeAr: 'مكتمل',
    },
    {
      stage: '02',
      title: 'Coaching for Success',
      titleAr: 'التوجيه والإرشاد للنجاح (GROW)',
      status: 'Completed',
      desc: 'GROW coaching framework, active listening, and constructive feedback loops.',
      descAr: 'تطبيق نموذج GROW التدريبي، الاستماع النشط، وحلقات التغذية الراجعة البناءة.',
      progress: 100,
      badge: 'Completed',
      badgeAr: 'مكتمل',
      actionView: 'coaching' as ViewType,
      actionLabel: 'View Module',
      actionLabelAr: 'عرض النموذج',
    },
    {
      stage: '03',
      title: 'Team Motivation',
      titleAr: 'تحفيز الفريق والأمان النفسي',
      status: 'In Progress',
      desc: 'Psychological drivers and incentive systems for high-pressure laboratory environments.',
      descAr: 'محركات الدوافع النفسية ومنظومات التحفيز لبيئات المختبرات الطبية عالية الضغط.',
      progress: 65,
      badge: 'Currently Active',
      badgeAr: 'المرحلة النشطة',
      actionView: 'video_lesson' as ViewType,
      actionLabel: 'Resume Stage',
      actionLabelAr: 'استئناف المرحلة',
    },
    {
      stage: '04',
      title: 'Conflict Management',
      titleAr: 'إدارة النزاعات وحل الخلافات',
      status: 'Locked',
      desc: 'De-escalation protocols and resolving technical disagreements among senior staff.',
      descAr: 'بروتوكولات التهدئة وحل الخلافات الفنية بين الكوادر الطبية وكبار الفنيين.',
      progress: 0,
      badge: 'Next Up',
      badgeAr: 'المرحلة التالية',
    },
    {
      stage: '05',
      title: 'Fatal 20 Mistakes',
      titleAr: 'الأخطاء الإدارية العشرين الفادحة',
      status: 'Locked',
      desc: 'Analyzing critical managerial oversights in diagnostic accuracy & compliance.',
      descAr: 'تحليل الأخطاء القيادية الحرجة المؤثرة على دقة التحاليل والامتثال الطبي.',
      progress: 0,
      badge: 'Locked',
      badgeAr: 'مغلق',
    },
    {
      stage: '06',
      title: 'Emotional Intelligence',
      titleAr: 'الذكاء العاطفي القيادي',
      status: 'Locked',
      desc: 'Self-regulation and empathetic leadership in fast-paced medical operations.',
      descAr: 'التحكم الذاتي والقيادة التعاطفية في العمليات الإكلينيكية سريعة الإيقاع.',
      progress: 0,
      badge: 'Locked',
      badgeAr: 'مغلق',
    },
    {
      stage: '07',
      title: 'Situational Leadership',
      titleAr: 'القيادة الموقفية التكيفية',
      status: 'Locked',
      desc: 'Adapting leadership styles based on staff competence and task urgency.',
      descAr: 'تكييف الأنماط القيادية بناءً على كفاءة الكادر الطبي ودرجة إلحاح الفحص.',
      progress: 0,
      badge: 'Locked',
      badgeAr: 'مغلق',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 text-start">
      
      {/* Header Banner */}
      <div className="bg-[#ffffff] rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#006672]/10 text-[#006672] rounded-full text-xs font-bold uppercase tracking-wider">
              <GitMerge className="w-4 h-4" />
              <span>{isRTL ? "منهج إعداد القيادات الإكلينيكية" : "Manager Development Curriculum"}</span>
            </div>
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-[#191c1e]">
              {isRTL ? "معمل شلبي: مسار القيادة المخبرية" : "Shalaby Labs: Leadership Path"}
            </h1>
            <p className="text-sm text-[#6d797c] max-w-2xl leading-relaxed">
              {isRTL 
                ? "برنامج تدريبي تنفيذي من 7 مراحل متكاملة مصمم لتأهيل الأخصائيين ليصبحوا مدراء مختبرات إكلينيكيين معتمدين."
                : "A 7-stage executive training program designed to transition clinical specialists into certified Senior Clinical Managers."}
            </p>
          </div>

          <div className="bg-[#f2f4f6] p-4 rounded-2xl border border-[#e0e3e5] shrink-0 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-[#191c1e]">{isRTL ? "إجمالي التقدم في البرنامج" : "Total Program Progress"}</span>
              <span className="text-[#006672]">38%</span>
            </div>
            <div className="w-full h-2.5 bg-[#e0e3e5] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#006672] to-[#4c56af] w-[38%] rounded-full" />
            </div>
            <p className="text-[11px] text-[#6d797c] mt-2">
              {isRTL ? "المرحلة 3 من 7 قيد التقدم • تم الحصول على شهادتين" : "Stage 3 of 7 in progress • 2 Certificates Earned"}
            </p>
          </div>
        </div>
      </div>

      {/* Featured Stage Cards (Active vs Next Up) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Stage Card */}
        <div className="bg-gradient-to-br from-[#006672] to-[#00818f] rounded-3xl p-6 text-white shadow-lg space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-xs font-bold rounded-full uppercase">
              {isRTL ? "المرحلة 03 • نشطة حالياً" : "Stage 03 • Currently Active"}
            </span>
            <span className="text-xs font-bold text-white/80">65% Complete</span>
          </div>

          <div>
            <h2 className="font-headline font-bold text-xl text-white">
              {isRTL ? "تحفيز الفريق والأمان النفسي داخل المختبر" : "Team Motivation & Psychological Safety"}
            </h2>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              {isRTL 
                ? "التعمق في المحركات التحفيزية، ومنع الاحتراق الوظيفي، وبناء ثقافة شفافية الإبلاغ عن الأخطاء دون خوف."
                : "Dive into intrinsic motivational drivers, burnout prevention, and creating transparent error-reporting cultures in lab settings."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-white/90 font-medium">
              {isRTL ? "المدة: ساعتان • 4 محاضرات" : "Duration: 2.0 hrs • 4 Lessons"}
            </div>
            <button
              onClick={() => onNavigate('video_lesson')}
              className="px-5 py-2.5 bg-white text-[#006672] hover:bg-emerald-50 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className={`w-4 h-4 fill-current ${isRTL ? 'rotate-180' : ''}`} />
              <span>{isRTL ? "استئناف المرحلة الثالثة" : "Resume Stage 3"}</span>
            </button>
          </div>
        </div>

        {/* Next Up Stage Card */}
        <div className="bg-white rounded-3xl p-6 border border-[#e0e3e5] shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-[#e0e3e5] text-[#3d494b] text-xs font-bold rounded-full uppercase">
              {isRTL ? "المرحلة 04 • التالية" : "Stage 04 • Next Up"}
            </span>
            <Lock className="w-4 h-4 text-[#6d797c]" />
          </div>

          <div>
            <h2 className="font-headline font-bold text-xl text-[#191c1e]">
              {isRTL ? "إدارة النزاعات وحل الخلافات السريرية" : "Conflict Management & Resolution"}
            </h2>
            <p className="text-xs text-[#6d797c] mt-1 leading-relaxed">
              {isRTL 
                ? "إتقان بروتوكولات احتواء التصعيد والإجراءات الموحدة لحل التباينات التقنية بين فنيي المختبر والمشرفين."
                : "Master de-escalation protocols and standard procedures for resolving technical disagreements between clinical technicians."}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#f2f4f6]">
            <span className="text-xs text-[#6d797c] font-medium">
              {isRTL ? "يُتاح تلقائياً بعد إتمام المرحلة الثالثة" : "Unlocks upon Stage 3 completion"}
            </span>
            <button
              disabled
              className="px-4 py-2 bg-[#f2f4f6] text-[#bcc9cb] text-xs font-semibold rounded-xl cursor-not-allowed flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isRTL ? "مغلق" : "Locked"}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Curriculum Roadmap Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0e3e5] shadow-xs">
        <h2 className="font-headline font-bold text-xl text-[#191c1e] mb-6">
          {isRTL ? "خريطة المنهج التفاعلية" : "Your Curriculum Roadmap"}
        </h2>

        <div className={`space-y-4 relative before:absolute before:inset-0 ${isRTL ? 'before:right-6 sm:before:right-8' : 'before:left-6 sm:before:left-8'} before:w-0.5 before:bg-[#e0e3e5] before:z-0`}>
          {stages.map((st, idx) => {
            const isDone = st.status === 'Completed';
            const isActive = st.status === 'In Progress';

            return (
              <div
                key={idx}
                className={`relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-[#006672]/5 border-[#006672] shadow-sm'
                    : isDone
                    ? 'bg-[#f7f9fb] border-[#e0e3e5]'
                    : 'bg-white border-[#f2f4f6] opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Status Indicator Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isDone ? 'bg-emerald-500 text-white shadow-xs' :
                    isActive ? 'bg-[#006672] text-white shadow-md animate-pulse' :
                    'bg-[#e0e3e5] text-[#6d797c]'
                  }`}>
                    {isDone ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span>{st.stage}</span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline font-bold text-base text-[#191c1e]">
                        {isRTL ? `المرحلة ${st.stage}: ${st.titleAr}` : `Stage ${st.stage}: ${st.title}`}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDone ? 'bg-emerald-100 text-emerald-800' :
                        isActive ? 'bg-[#006672] text-white' :
                        'bg-[#e0e3e5] text-[#6d797c]'
                      }`}>
                        {isRTL ? st.badgeAr : st.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#6d797c] mt-1 max-w-xl leading-relaxed">
                      {isRTL ? st.descAr : st.desc}
                    </p>
                  </div>
                </div>

                {/* Right Action / Status */}
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {st.actionView ? (
                    <button
                      onClick={() => onNavigate(st.actionView!)}
                      className="px-4 py-2 bg-[#006672] hover:bg-[#00818f] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isRTL ? st.actionLabelAr : st.actionLabel}</span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  ) : isDone ? (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {isRTL ? "مكتمل" : "Completed"}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-[#bcc9cb] flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      {isRTL ? "بانتظار إتمام المتطلبات" : "Prerequisites pending"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Final Certification Target Card */}
          <div className="relative z-10 p-5 rounded-2xl bg-gradient-to-r from-[#27308a] to-[#4c56af] text-white shadow-md flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Award className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  {isRTL ? "الهدف النهائي • شهادة معتمدة" : "Final Goal • Certification"}
                </span>
                <h3 className="font-headline font-bold text-lg text-white">
                  {isRTL ? "شهادة مدير مختبرات إكلينيكية أول معتمد" : "Senior Clinical Manager Certification"}
                </h3>
                <p className="text-xs text-white/80">
                  {isRTL 
                    ? "تُصدر من مجلس إدارة معمل شلبي بعد استكمال المراحل السبع والنجاح في التقييم الإكلينيكي الشامل."
                    : "Issued by Shalaby Labs Board upon completing all 7 stages & passing the final evaluation."}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('certificate')}
              className="hidden sm:flex px-4 py-2 bg-white text-[#27308a] font-bold text-xs rounded-xl shadow-sm hover:bg-amber-50 transition-colors cursor-pointer"
            >
              {isRTL ? "معاينة نموذج الشهادة" : "View Sample Certificate"}
            </button>
          </div>
        </div>

      </div>

      {/* Program Benefits Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#e0e3e5] space-y-2">
          <BrainCircuit className="w-6 h-6 text-[#006672]" />
          <h4 className="font-headline font-bold text-sm text-[#191c1e]">
            {isRTL ? "الأطر الإدراكية والقيادية" : "Cognitive Frameworks"}
          </h4>
          <p className="text-xs text-[#6d797c] leading-relaxed">
            {isRTL 
              ? "تطبيق نماذج GROW، وتوجيهات القيادة الموقفية، ومصفوفات الأمان النفسي الطبي."
              : "Apply GROW coaching models, Situational Leadership vectors, and psychological safety matrices."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e0e3e5] space-y-2">
          <Users className="w-6 h-6 text-[#006672]" />
          <h4 className="font-headline font-bold text-sm text-[#191c1e]">
            {isRTL ? "الإرشاد المهني بين الأقران" : "Peer Mentorship"}
          </h4>
          <p className="text-xs text-[#6d797c] leading-relaxed">
            {isRTL 
              ? "جلسات نقاش وحل دراسات حالة واقعية بالتعاون مع كبار استشاريي المعامل السريرية."
              : "Engage with senior clinical leads in the Manager's Forum for real-world case study resolution."}
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#e0e3e5] space-y-2">
          <Award className="w-6 h-6 text-[#006672]" />
          <h4 className="font-headline font-bold text-sm text-[#191c1e]">
            {isRTL ? "التقييم العملي الصارم" : "Practical Assessment"}
          </h4>
          <p className="text-xs text-[#6d797c] leading-relaxed">
            {isRTL 
              ? "إثبات الكفاءة عبر سيناريوهات تفاعلية، ومحاكاة عمليات تدقيق الجودة والاعتماد الدولي CAP/ISO."
              : "Verify mastery with interactive scenarios, PPE removal sequences, and simulated lab audits."}
          </p>
        </div>
      </div>

    </div>
  );
};
