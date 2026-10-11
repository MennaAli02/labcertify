import React, { useState } from 'react';
import { ViewType, UserProfile, Course } from '../../types';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  Award, 
  ArrowRight, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Check, 
  ExternalLink,
  Sparkles,
  Info,
  ChevronRight,
  FlaskConical,
  X,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface TraineeDashboardViewProps {
  user: UserProfile;
  courses: Course[];
  onNavigate: (view: ViewType) => void;
  onSelectCourse: (course: Course) => void;
  onSelectQuizCourse?: (course: Course) => void;
  onViewCertificate?: (courseId: string) => void;
}

export const TraineeDashboardView: React.FC<TraineeDashboardViewProps> = ({
  user,
  courses,
  onNavigate,
  onSelectCourse,
  onSelectQuizCourse,
  onViewCertificate,
}) => {
  const { t, isRTL } = useLanguage();
  const [lockedModalCourse, setLockedModalCourse] = useState<Course | null>(null);
  const [previewCourse, setPreviewCourse] = useState<Course | null>(null);

  const completedCourses = courses.filter(c => c.status === 'Completed');
  const inProgressCourses = courses.filter(c => c.status === 'In Progress');
  const completedCount = completedCourses.length;
  const totalCount = courses.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  // Authoritative date context and remaining days calculation
  const getOrientationSchedule = () => {
    if (!user.orientationEndDate) {
      return { days: 0, status: 'unknown', label: '--' };
    }
    const end = new Date(user.orientationEndDate);
    const start = user.orientationStartDate ? new Date(user.orientationStartDate) : null;
    const now = new Date();

    // In demonstration cohort data (e.g. Fall 2024 onboarding cycle), 
    // evaluate against the active cohort reference date (2024-09-26), otherwise evaluate real-time
    const isDemoCohort = end.getFullYear() === 2024;
    const referenceDate = isDemoCohort ? new Date('2024-09-26T00:00:00') : now;

    const diffTime = end.getTime() - referenceDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (completionPercentage === 100) {
      return { days: 0, status: 'completed', label: isRTL ? 'مكتمل' : 'Completed' };
    }
    if (diffDays < 0) {
      return { days: Math.abs(diffDays), status: 'overdue', label: isRTL ? `متأخر ${Math.abs(diffDays)} يوم` : `${Math.abs(diffDays)}d Overdue` };
    }
    if (start && referenceDate < start) {
      return { days: diffDays, status: 'upcoming', label: isRTL ? 'يبدأ قريباً' : 'Upcoming' };
    }
    return {
      days: diffDays,
      status: 'active',
      label: `${diffDays} ${t.daysRemaining}`
    };
  };

  const orientationSchedule = getOrientationSchedule();

  // Next required course for "Continue Learning" primary action
  const nextCourse = courses.find(c => c.status === 'In Progress') 
    || courses.find(c => c.status !== 'Completed' && c.status !== 'Locked') 
    || courses[0];

  // Derive status from real computed schedule
  const trainingStatus = completionPercentage === 100 
    ? 'Completed' 
    : orientationSchedule.status === 'overdue'
      ? 'Overdue'
      : completedCount > 0 
        ? 'In Progress' 
        : 'Not Started';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return {
          label: t.statusCompleted,
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
          dot: 'bg-emerald-600'
        };
      case 'Overdue':
        return {
          label: t.statusOverdue,
          color: 'text-rose-700 bg-rose-50 border-rose-200/80',
          dot: 'bg-rose-600'
        };
      case 'In Progress':
        return {
          label: t.statusInProgress,
          color: 'text-[#0B96C7] bg-[#dee2e8] border-[#c0cad8]/80',
          dot: 'bg-[#0B96C7]'
        };
      default:
        return {
          label: t.statusNotStarted,
          color: 'text-amber-700 bg-amber-50 border-amber-200/80',
          dot: 'bg-amber-500'
        };
    }
  };

  const statusBadge = getStatusBadge(trainingStatus);

  const handleCourseAction = (course: Course) => {
    if (course.status === 'Locked') {
      setLockedModalCourse(course);
      return;
    }
    onSelectCourse(course);
    onNavigate('video_lesson');
  };

  const handleStartQuiz = (course: Course, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (course.status === 'Locked') {
      setLockedModalCourse(course);
      return;
    }
    if (onSelectQuizCourse) {
      onSelectQuizCourse(course);
    }
    onNavigate('quiz');
  };

  const handleCertificateClick = (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewCertificate) {
      onViewCertificate(courseId);
    }
    onNavigate('certificate');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Clinical Onboarding Passport / Employee Dossier Card */}
      <div className="bg-white rounded-2xl border border-[#c0cad8] shadow-xs overflow-hidden">
        
        {/* Accreditation & Compliance Stripe */}
        <div className="bg-[#dee2e8]/40 border-b border-[#c0cad8]/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-[#485261]">
            <ShieldCheck className="w-4 h-4 text-[#0B96C7]" />
            <span className="font-semibold text-[#485261]">{isRTL ? 'برنامج التأهيل المخبري الإلزامي' : 'Mandatory Clinical Laboratory Qualification Program'}</span>
            <span className="text-[#c0cad8]">|</span>
            <span className="text-[11px] text-[#9995A6] font-mono">ISO 15189:2022 · CAP #8472910</span>
            <span className="text-[#c0cad8]">|</span>
            <span className="text-[10px] font-mono font-medium text-[#485261] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
              {isRTL ? 'دفعة تجريبية معتمدة' : 'Demonstration Cohort'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* Main Overview: Identity & Continue Learning */}
        <div className="p-6 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Trainee Identity & Orientation Dossier */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-[#c0cad8] shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B96C7] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-bold font-sans text-[#485261] tracking-tight leading-tight">
                    {t.welcomeBack}, {isRTL && user.nameAr ? user.nameAr : user.name}
                  </h1>

                  <p className="text-xs sm:text-sm font-semibold text-[#0B96C7]">
                    {isRTL && user.titleAr ? user.titleAr : user.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-xs text-[#9995A6]">
                    <span className="font-mono text-[#485261] font-semibold">
                      <span className="text-[#9995A6] font-sans font-normal">{t.employeeId}:</span> {user.employeeId}
                    </span>
                    <span className="text-[#c0cad8]">·</span>
                    <span className="text-[#485261]">
                      {isRTL && user.departmentAr ? user.departmentAr : user.department}
                    </span>
                    <span className="text-[#c0cad8]">·</span>
                    <span className="text-[#485261]">
                      {isRTL && user.branchAr ? user.branchAr : user.branch}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Orientation Schedule Row */}
              <div className="bg-[#dee2e8]/30 p-3.5 rounded-xl border border-[#c0cad8]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#485261]">
                  <Calendar className="w-4 h-4 text-[#0B96C7] shrink-0" />
                  <span className="font-semibold text-[#485261]">{t.orientationPeriod}:</span>
                  <span className="font-mono font-bold text-[#485261] tabular-nums">
                    {user.orientationStartDate || '01 Sep 2024'} – {user.orientationEndDate || '30 Nov 2024'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#c0cad8] font-mono font-bold text-xs text-[#485261] shadow-2xs">
                    {orientationSchedule.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Prominent "Continue Learning" Hub (Replaces redundant progress bar) */}
            <div className="lg:col-span-5 xl:col-span-5 bg-[#dee2e8]/30 p-5 rounded-xl border border-[#c0cad8] flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#0B96C7] flex items-center gap-1.5 font-mono">
                  <PlayCircle className="w-4 h-4" />
                  {completionPercentage === 100 ? (isRTL ? 'اكتمل المسار' : 'Curriculum Complete') : (isRTL ? 'المقرر التالي المطلوب' : 'Next Required Course')}
                </span>
                {nextCourse && (
                  <span className="text-xs font-mono font-bold text-[#485261] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
                    {nextCourse.status === 'Completed' ? '100%' : `${nextCourse.progress}%`}
                  </span>
                )}
              </div>

              {nextCourse && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0B96C7]">{nextCourse.code}</span>
                    <span className="text-[#c0cad8]">·</span>
                    <span className="text-xs text-[#9995A6]">Module 0{nextCourse.moduleNumber}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#485261] line-clamp-1" title={nextCourse.title}>
                    {isRTL && nextCourse.titleAr ? nextCourse.titleAr : nextCourse.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[#9995A6]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#9995A6]" />
                      <span>{nextCourse.estMinutes} {t.mins}</span>
                    </span>
                    <span>·</span>
                    <span className="font-mono">Pass: ≥ {nextCourse.passScore}%</span>
                    {nextCourse.prerequisiteCourseCode && (
                      <>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">Req. {nextCourse.prerequisiteCourseCode} ✓</span>
                      </>
                    )}
                  </div>

                  {/* Course Progress indicator */}
                  <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#c0cad8]/70 mt-1">
                    <div 
                      className="bg-[#0B96C7] h-full rounded-full transition-all duration-500"
                      style={{ width: `${nextCourse.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (completionPercentage === 100) {
                    onNavigate('certificate');
                  } else if (nextCourse) {
                    handleCourseAction(nextCourse);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
              >
                {completionPercentage === 100 ? (
                  <>
                    <Award className="w-4 h-4" />
                    <span>{t.viewCertificateBadge}</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>{isRTL ? 'متابعة التعلم الآن' : 'Continue Learning'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* 2. Key Metrics Row (Standardized 4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Completed Courses */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.completedCourses}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {completedCount} <span className="text-xs font-normal text-[#9995A6]">/ {totalCount}</span>
          </p>
          <p className="text-xs text-emerald-700 font-medium">
            {isRTL ? 'معتمدة بالشهادات الرسمية' : 'Verified with official certificates'}
          </p>
        </div>

        {/* Metric 2: Active Modules */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.statusInProgress}</span>
            <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {inProgressCourses.length} <span className="text-xs font-normal text-[#9995A6]">{t.activeModules}</span>
          </p>
          <p className="text-xs text-[#0B96C7] font-medium">
            {isRTL ? 'المقرر التالي قيد الدراسة' : 'Active in sequential path'}
          </p>
        </div>

        {/* Metric 3: Passing Threshold */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.passScoreRequired}</span>
            <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#485261] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            80% <span className="text-xs font-normal text-[#9995A6]">Minimum</span>
          </p>
          <p className="text-xs text-[#9995A6] font-medium">
            {isRTL ? 'معايير الاعتماد الدولي CAP' : 'Accredited mastery standard'}
          </p>
        </div>

        {/* Metric 4: Master Credential Status */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.officialCert}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Award className="w-4.5 h-4.5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {completionPercentage === 100 ? (isRTL ? 'جاهزة' : 'Ready') : `${completedCount}/5`}
          </p>
          <p className="text-xs text-amber-800 font-medium">
            {completionPercentage === 100 ? (isRTL ? 'تم الاعتماد الكامل' : 'Fully Accredited') : (isRTL ? 'تتطلب إكمال المقررات الخمسة' : 'Requires all 5 modules')}
          </p>
        </div>

      </div>

      {/* 3. Mandatory Sequential Learning Path Visual Flow */}
      <div className="bg-white rounded-2xl p-6 lg:p-7 border border-[#c0cad8] shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c0cad8]/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                SEQUENTIAL PATHWAY
              </span>
              <h2 className="text-lg font-bold text-[#485261] tracking-tight">
                {t.sequentialPathTitle}
              </h2>
            </div>
            <p className="text-xs text-[#9995A6] mt-1 max-w-3xl leading-relaxed">
              {t.sequentialPathDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#485261] bg-[#dee2e8]/40 px-3 py-1.5 rounded-lg border border-[#c0cad8] shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isRTL ? 'تسلسل إجباري مشروط (≥ 80%)' : 'Enforced Sequential Lock (≥ 80%)'}</span>
          </div>
        </div>

        {/* Sequential Course Cards List */}
        <div className="mt-6 space-y-4">
          {courses.map((course) => {
            const isCompleted = course.status === 'Completed';
            const isInProgress = course.status === 'In Progress';
            const isLocked = course.status === 'Locked';

            return (
              <div 
                key={course.id}
                onClick={() => {
                  if (isLocked) {
                    setLockedModalCourse(course);
                  } else {
                    setPreviewCourse(course);
                  }
                }}
                className={`relative rounded-xl border transition-all duration-150 cursor-pointer overflow-hidden ${
                  isCompleted 
                    ? 'bg-white border-[#c0cad8] hover:border-emerald-300 hover:shadow-xs' 
                    : isInProgress
                      ? 'bg-white border-[#0B96C7] shadow-xs ring-1 ring-[#0B96C7]/20'
                      : 'bg-[#dee2e8]/25 border-[#c0cad8]/70 opacity-80 hover:opacity-95'
                }`}
              >
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  {/* Left: Step number, icon, and course summary */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    
                    {/* Status Step Number Badge */}
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                      isCompleted 
                        ? 'bg-emerald-600 text-white' 
                        : isInProgress
                          ? 'bg-[#0B96C7] text-white shadow-xs'
                          : 'bg-[#c0cad8] text-[#485261]'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-[#485261]" />
                      ) : (
                        <span>0{course.moduleNumber}</span>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0B96C7]">
                          {course.code}
                        </span>

                        <span className="text-[#c0cad8]">·</span>

                        <span className={`text-[11px] font-medium ${
                          isCompleted
                            ? 'text-emerald-700'
                            : isInProgress
                              ? 'text-[#0B96C7] font-semibold'
                              : 'text-[#9995A6]'
                        }`}>
                          {isCompleted ? t.courseCompletedBadge : isLocked ? t.lockedBadge : t.unlockedBadge}
                        </span>

                        {isCompleted && (
                          <>
                            <span className="text-[#c0cad8]">·</span>
                            <span className="text-[11px] font-mono font-bold text-emerald-700">
                              {isRTL ? 'الدرجة: 92% (اجتياز)' : 'Score: 92% (Passed)'}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#485261] hover:text-[#0B96C7] transition-colors truncate">
                        {isRTL && course.titleAr ? course.titleAr : course.title}
                      </h3>

                      <p className="text-xs text-[#9995A6] line-clamp-1 leading-relaxed">
                        {isRTL && course.descriptionAr ? course.descriptionAr : course.description}
                      </p>

                      {/* Course Settings Metadata (Anti-pill: clean text with dividers) */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs text-[#9995A6]">
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-[#9995A6]" />
                          <span>{course.estMinutes} {t.mins}</span>
                        </span>
                        <span className="text-[#c0cad8]">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#9995A6]" />
                          <span>{t.passScoreRequired}: {course.passScore}%</span>
                        </span>
                        <span className="text-[#c0cad8]">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <FileText className="w-3.5 h-3.5 text-[#9995A6]" />
                          <span>{t.maxAttemptsAllowed}: {course.allowedAttempts}</span>
                        </span>
                        {course.prerequisiteCourseCode && isLocked && (
                          <>
                            <span className="text-[#c0cad8]">·</span>
                            <span className="text-amber-800 font-medium">
                              {isRTL ? `يتطلب اجتياز ${course.prerequisiteCourseCode}` : `Requires ${course.prerequisiteCourseCode}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Quiz Button / Certificate Button / Review Materials */}
                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#c0cad8]/40">
                    
                    {isCompleted ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseAction(course);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#dee2e8]/40 hover:bg-[#dee2e8] text-[#485261] text-xs font-semibold border border-[#c0cad8] transition-all cursor-pointer"
                          title="Review course video lectures & SOP handbooks"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#0B96C7]" />
                          <span>{isRTL ? 'مراجعة المحتوى والفيديوهات' : 'Review Videos & SOPs'}</span>
                        </button>
                        <button
                          onClick={(e) => handleCertificateClick(course.id, e)}
                          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200/80 transition-all cursor-pointer active:scale-95"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t.viewCertificateBadge}</span>
                        </button>
                      </div>
                    ) : isInProgress ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseAction(course);
                          }}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] text-xs font-semibold border border-[#c0cad8] transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#0B96C7]" />
                          <span>{t.resumeCourseContent}</span>
                        </button>
                        <button
                          onClick={(e) => handleStartQuiz(course, e)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          <span>{t.takeOnlineAssessment}</span>
                          <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLockedModalCourse(course);
                        }}
                        className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#dee2e8] text-[#9995A6] text-xs font-medium cursor-not-allowed border border-[#c0cad8]"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t.lockedBadge}</span>
                      </button>
                    )}

                  </div>

                </div>

                {/* Progress bar inside active card */}
                {isInProgress && (
                  <div className="w-full bg-[#dee2e8] h-1 overflow-hidden">
                    <div 
                      className="bg-[#0B96C7] h-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Master Orientation Completion Milestone Card */}
        <div className={`mt-6 p-5 sm:p-6 rounded-xl border transition-all flex flex-col md:flex-row items-center justify-between gap-5 ${
          completionPercentage === 100 
            ? 'bg-amber-50/50 border-amber-300/80 shadow-xs' 
            : 'bg-[#dee2e8]/30 border-dashed border-[#c0cad8]'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              completionPercentage === 100 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-[#dee2e8] text-[#9995A6] border border-[#c0cad8]'
            }`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800">
                  FINAL MILESTONE CREDENTIAL
                </span>
                <span className="text-[#c0cad8]">·</span>
                <span className="text-xs text-[#9995A6]">
                  {completionPercentage === 100 ? (isRTL ? 'مكتملة ومعتمدة' : 'Unlocked & Accredited') : (isRTL ? 'تفتح بعد إتمام الخمسة مقررات' : 'Unlocks after all 5 courses')}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#485261] mt-0.5">
                {t.masterOrientationCertTitle}
              </h4>
              <p className="text-xs text-[#9995A6] max-w-2xl mt-0.5">
                {t.masterOrientationCertDesc}
              </p>
            </div>
          </div>

          <div>
            {completionPercentage === 100 ? (
              <button
                onClick={() => onNavigate('certificate')}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.downloadPrintPdf}</span>
              </button>
            ) : (
              <div className="text-center md:text-end text-xs text-[#485261] font-mono bg-white px-3.5 py-2 rounded-lg border border-[#c0cad8]">
                <span>{completedCount} / 5 {t.completedCourses}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Course Study Preview Modal (Direct interactive module hub) */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#c0cad8]">
              <div>
                <span className="font-mono text-xs font-bold text-[#0B96C7]">
                  {previewCourse.code} · Module 0{previewCourse.moduleNumber}
                </span>
                <h3 className="text-lg font-bold text-[#485261] mt-0.5">
                  {isRTL && previewCourse.titleAr ? previewCourse.titleAr : previewCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewCourse(null)}
                className="p-1.5 text-[#9995A6] hover:text-[#485261] hover:bg-[#dee2e8] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#485261] leading-relaxed">
              {isRTL && previewCourse.descriptionAr ? previewCourse.descriptionAr : previewCourse.description}
            </p>

            {/* Course Parameters Grid */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#dee2e8]/30 rounded-xl border border-[#c0cad8] text-xs">
              <div>
                <span className="text-[#9995A6] block text-[11px]">{t.courseDuration}</span>
                <span className="font-bold text-[#485261] font-mono tabular-nums">{previewCourse.estMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-[#9995A6] block text-[11px]">{t.passScoreRequired}</span>
                <span className="font-bold text-emerald-700 font-mono tabular-nums">≥ {previewCourse.passScore}%</span>
              </div>
              <div>
                <span className="text-[#9995A6] block text-[11px]">{t.maxAttemptsAllowed}</span>
                <span className="font-bold text-[#485261] font-mono tabular-nums">{previewCourse.allowedAttempts} Attempts</span>
              </div>
            </div>

            {/* Materials Included */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#485261] uppercase tracking-wider block">
                {isRTL ? 'المحتوى التدريبي المرفق:' : 'Accredited Curriculum Materials:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-[#dee2e8]/30 rounded-lg border border-[#c0cad8] flex items-center gap-2.5">
                  <PlayCircle className="w-4 h-4 text-[#0B96C7]" />
                  <div>
                    <p className="font-semibold text-[#485261]">{isRTL ? 'فيديو تدريبي تطبيقي' : 'Clinical Procedure Video'}</p>
                    <p className="text-[11px] text-[#9995A6] font-mono">1080p Full HD · SOP Guided</p>
                  </div>
                </div>
                <div className="p-3 bg-[#dee2e8]/30 rounded-lg border border-[#c0cad8] flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-[#485261]">{isRTL ? 'دليل إجراءات العمل SOP' : 'Laboratory SOP Document'}</p>
                    <p className="text-[11px] text-[#9995A6] font-mono">ISO 15189 Standard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#c0cad8]">
              <button
                onClick={() => {
                  onSelectCourse(previewCourse);
                  setPreviewCourse(null);
                  onNavigate('video_lesson');
                }}
                className="px-4 py-2 bg-white hover:bg-[#dee2e8]/40 text-[#485261] text-xs font-semibold rounded-lg border border-[#c0cad8] cursor-pointer"
              >
                {t.resumeCourseContent}
              </button>

              <button
                onClick={() => {
                  handleStartQuiz(previewCourse);
                  setPreviewCourse(null);
                }}
                className="px-5 py-2 bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer active:scale-95"
              >
                {t.takeOnlineAssessment}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Locked Course Warning Modal */}
      {lockedModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-4">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider">
                {t.lockedBadge}
              </span>
              <h3 className="text-base font-bold text-[#485261] mt-1">
                {isRTL && lockedModalCourse.titleAr ? lockedModalCourse.titleAr : lockedModalCourse.title}
              </h3>
              <p className="text-xs text-[#485261] mt-2 leading-relaxed">
                {isRTL 
                  ? `هذا المقرر مغلق ولا يمكن الوصول إليه قبل إتمام دراسة المقرر السابق (${lockedModalCourse.prerequisiteCourseCode || 'المقرر السابق'}) واجتياز اختباره بنسبة 80% فأكثر.`
                  : `This course is sequentially locked. You must complete the prerequisite module (${lockedModalCourse.prerequisiteCourseCode || 'previous module'}) and achieve an assessment score of at least 80% before this content unlocks.`
                }
              </p>
            </div>

            <div className="p-3 bg-[#dee2e8]/30 rounded-lg border border-[#c0cad8] text-xs text-[#485261] space-y-1">
              <p className="font-bold text-[#0B96C7]">
                {isRTL ? 'قاعدة التسلسل الإلزامي للمختبر:' : 'Mandatory Clinical Sequencing Rule:'}
              </p>
              <p className="text-[11px] text-[#9995A6] font-mono">
                Course 1 → Quiz 1 (≥80%) → Certificate 1 → Unlock Course 2
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLockedModalCourse(null)}
                className="px-4 py-2 rounded-lg bg-[#0B96C7] text-white font-semibold text-xs hover:bg-[#087fa8] transition-all cursor-pointer"
              >
                {isRTL ? 'فهمت ذلك' : 'Understood'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

