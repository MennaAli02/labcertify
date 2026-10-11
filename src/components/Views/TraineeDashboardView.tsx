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

  // Derive status
  const trainingStatus = completionPercentage === 100 
    ? 'Completed' 
    : user.orientationEndDate && new Date(user.orientationEndDate) < new Date('2024-09-20')
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
          color: 'text-[#006672] bg-teal-50 border-teal-200/80',
          dot: 'bg-[#006672]'
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
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Accreditation & Compliance Stripe */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-[#006672]" />
            <span className="font-semibold text-slate-800">{isRTL ? 'برنامج التأهيل المخبري الإلزامي' : 'Mandatory Clinical Laboratory Qualification Program'}</span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-500 font-mono">ISO 15189:2022 · CAP #8472910</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              {statusBadge.label}
            </span>
          </div>
        </div>

        <div className="p-6 lg:p-7">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Employee Profile Identity */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#006672] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✓
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {t.welcomeBack}, {isRTL && user.nameAr ? user.nameAr : user.name}
                  </h1>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-[#006672]">
                  {isRTL && user.titleAr ? user.titleAr : user.title}
                </p>

                {/* Clean inline metadata with dots (anti-pill discipline) */}
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-xs text-slate-500">
                  <span className="font-mono text-slate-700 font-semibold">
                    <span className="text-slate-400 font-sans font-normal">{t.employeeId}:</span> {user.employeeId}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-700">
                    {isRTL && user.departmentAr ? user.departmentAr : user.department}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-700">
                    {isRTL && user.branchAr ? user.branchAr : user.branch}
                  </span>
                </div>
              </div>
            </div>

            {/* Orientation Window & Schedule Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[280px] w-full lg:w-auto space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#006672]" />
                  {t.orientationPeriod}
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-700">
                  65 {t.daysRemaining}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 font-mono tabular-nums">
                {user.orientationStartDate || '01 Sep 2024'} – {user.orientationEndDate || '30 Nov 2024'}
              </p>
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-slate-500">{t.assignedPath}:</span>
                <span className="font-bold text-[#006672] truncate max-w-[180px]" title={user.assignedPathTitle}>
                  {isRTL && user.assignedPathTitleAr ? user.assignedPathTitleAr : (user.assignedPathTitle || "Clinical Lab Orientation")}
                </span>
              </div>
            </div>

          </div>

          {/* Overall Progress Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <div className="flex items-center gap-2 text-slate-700">
                <span>{t.overallCompletion}</span>
                <span className="font-normal text-slate-500 font-mono">
                  ({completedCount} of {totalCount} {t.completedCourses})
                </span>
              </div>
              <span className="text-base font-bold text-[#006672] font-mono tabular-nums">
                {completionPercentage}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
              <div 
                className="bg-[#006672] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Metric 1: Completed Courses */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.completedCourses}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {completedCount} <span className="text-xs font-medium text-slate-400">/ {totalCount}</span>
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            {isRTL ? 'معتمدة بالشهادات الرسمية' : 'Verified with official certificates'}
          </p>
        </div>

        {/* Metric 2: Active Modules */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.statusInProgress}</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#006672] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {inProgressCourses.length} <span className="text-xs font-medium text-slate-400">{t.activeModules}</span>
          </p>
          <p className="text-[11px] text-[#006672] font-medium">
            {isRTL ? 'المقرر التالي قيد الدراسة' : 'Active in sequential path'}
          </p>
        </div>

        {/* Metric 3: Passing Threshold */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.passScoreRequired}</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            80% <span className="text-xs font-medium text-slate-400">Minimum</span>
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {isRTL ? 'معايير الاعتماد الدولي CAP' : 'Accredited mastery standard'}
          </p>
        </div>

        {/* Metric 4: Master Credential Status */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.officialCert}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-base font-bold text-slate-900">
            {completionPercentage === 100 ? (isRTL ? 'جاهزة للتنزيل' : 'Ready') : (isRTL ? 'قيد الإنجاز' : 'Pending')}
          </p>
          <p className="text-[11px] text-amber-800 font-medium">
            {completionPercentage === 100 ? (isRTL ? 'تم الاعتماد الكامل' : 'Fully Accredited') : (isRTL ? 'تتطلب إكمال المقررات الخمسة' : 'Requires all 5 modules')}
          </p>
        </div>

      </div>

      {/* 3. Mandatory Sequential Learning Path Visual Flow */}
      <div className="bg-white rounded-2xl p-6 lg:p-7 border border-slate-200/90 shadow-xs">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#006672] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                SEQUENTIAL PATHWAY
              </span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                {t.sequentialPathTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              {t.sequentialPathDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isRTL ? 'تسلسل إجباري مشروط (≥ 80%)' : 'Enforced Sequential Lock (≥ 80%)'}</span>
          </div>
        </div>

        {/* Sequential Course Cards List */}
        <div className="mt-6 space-y-4">
          {courses.map((course, index) => {
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
                    ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs' 
                    : isInProgress
                      ? 'bg-white border-[#006672] shadow-xs ring-1 ring-[#006672]/20'
                      : 'bg-slate-50/70 border-slate-200/70 opacity-80 hover:opacity-95'
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
                          ? 'bg-[#006672] text-white shadow-xs'
                          : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-slate-500" />
                      ) : (
                        <span>0{course.moduleNumber}</span>
                      )}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#006672]">
                          {course.code}
                        </span>

                        <span className="text-slate-300">·</span>

                        <span className={`text-[11px] font-medium ${
                          isCompleted
                            ? 'text-emerald-700'
                            : isInProgress
                              ? 'text-[#006672] font-semibold'
                              : 'text-slate-500'
                        }`}>
                          {isCompleted ? t.courseCompletedBadge : isLocked ? t.lockedBadge : t.unlockedBadge}
                        </span>

                        {isCompleted && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] font-mono font-bold text-emerald-700">
                              {isRTL ? 'الدرجة: 92% (اجتياز)' : 'Score: 92% (Passed)'}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 hover:text-[#006672] transition-colors truncate">
                        {isRTL && course.titleAr ? course.titleAr : course.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                        {isRTL && course.descriptionAr ? course.descriptionAr : course.description}
                      </p>

                      {/* Course Settings Metadata (Anti-pill: clean text with dividers) */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.estMinutes} {t.mins}</span>
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.passScoreRequired}: {course.passScore}%</span>
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="flex items-center gap-1 font-mono tabular-nums">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.maxAttemptsAllowed}: {course.allowedAttempts}</span>
                        </span>
                        {course.prerequisiteCourseCode && isLocked && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span className="text-amber-800 font-medium">
                              {isRTL ? `يتطلب اجتياز ${course.prerequisiteCourseCode}` : `Requires ${course.prerequisiteCourseCode}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Quiz Button / Certificate Button / Review Materials */}
                  <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    
                    {isCompleted ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCourseAction(course);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                          title="Review course video lectures & SOP handbooks"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#006672]" />
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
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#006672]" />
                          <span>{t.resumeCourseContent}</span>
                        </button>
                        <button
                          onClick={(e) => handleStartQuiz(course, e)}
                          className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#006672] hover:bg-[#00525c] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
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
                        className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium cursor-not-allowed"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{t.lockedBadge}</span>
                      </button>
                    )}

                  </div>

                </div>

                {/* Progress bar inside active card */}
                {isInProgress && (
                  <div className="w-full bg-slate-100 h-1 overflow-hidden">
                    <div 
                      className="bg-[#006672] h-full transition-all duration-500"
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
            : 'bg-slate-50 border-dashed border-slate-300'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              completionPercentage === 100 
                ? 'bg-amber-600 text-white shadow-xs' 
                : 'bg-slate-200 text-slate-500'
            }`}>
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800">
                  FINAL MILESTONE CREDENTIAL
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">
                  {completionPercentage === 100 ? (isRTL ? 'مكتملة ومعتمدة' : 'Unlocked & Accredited') : (isRTL ? 'تفتح بعد إتمام الخمسة مقررات' : 'Unlocks after all 5 courses')}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">
                {t.masterOrientationCertTitle}
              </h4>
              <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
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
              <div className="text-center md:text-end text-xs text-slate-500 font-mono bg-white px-3.5 py-2 rounded-lg border border-slate-200">
                <span>{completedCount} / 5 {t.completedCourses}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Course Study Preview Modal (Direct interactive module hub) */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="font-mono text-xs font-bold text-[#006672]">
                  {previewCourse.code} · Module 0{previewCourse.moduleNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {isRTL && previewCourse.titleAr ? previewCourse.titleAr : previewCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewCourse(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isRTL && previewCourse.descriptionAr ? previewCourse.descriptionAr : previewCourse.description}
            </p>

            {/* Course Parameters Grid */}
            <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">{t.courseDuration}</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{previewCourse.estMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{t.passScoreRequired}</span>
                <span className="font-bold text-emerald-700 font-mono tabular-nums">≥ {previewCourse.passScore}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{t.maxAttemptsAllowed}</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">{previewCourse.allowedAttempts} Attempts</span>
              </div>
            </div>

            {/* Materials Included */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                {isRTL ? 'المحتوى التدريبي المرفق:' : 'Accredited Curriculum Materials:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center gap-2.5">
                  <PlayCircle className="w-4 h-4 text-[#006672]" />
                  <div>
                    <p className="font-semibold text-slate-800">{isRTL ? 'فيديو تدريبي تطبيقي' : 'Clinical Procedure Video'}</p>
                    <p className="text-[11px] text-slate-500 font-mono">1080p Full HD · SOP Guided</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-slate-800">{isRTL ? 'دليل إجراءات العمل SOP' : 'Laboratory SOP Document'}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ISO 15189 Standard</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  onSelectCourse(previewCourse);
                  setPreviewCourse(null);
                  onNavigate('video_lesson');
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 cursor-pointer"
              >
                {t.resumeCourseContent}
              </button>

              <button
                onClick={() => {
                  handleStartQuiz(previewCourse);
                  setPreviewCourse(null);
                }}
                className="px-5 py-2 bg-[#006672] hover:bg-[#00525c] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer active:scale-95"
              >
                {t.takeOnlineAssessment}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Locked Course Warning Modal */}
      {lockedModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4">
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>

            <div>
              <span className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider">
                {t.lockedBadge}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {isRTL && lockedModalCourse.titleAr ? lockedModalCourse.titleAr : lockedModalCourse.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {isRTL 
                  ? `هذا المقرر مغلق ولا يمكن الوصول إليه قبل إتمام دراسة المقرر السابق (${lockedModalCourse.prerequisiteCourseCode || 'المقرر السابق'}) واجتياز اختباره بنسبة 80% فأكثر.`
                  : `This course is sequentially locked. You must complete the prerequisite module (${lockedModalCourse.prerequisiteCourseCode || 'previous module'}) and achieve an assessment score of at least 80% before this content unlocks.`
                }
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
              <p className="font-bold text-[#006672]">
                {isRTL ? 'قاعدة التسلسل الإلزامي للمختبر:' : 'Mandatory Clinical Sequencing Rule:'}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Course 1 → Quiz 1 (≥80%) → Certificate 1 → Unlock Course 2
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setLockedModalCourse(null)}
                className="px-4 py-2 rounded-lg bg-[#006672] text-white font-semibold text-xs hover:bg-[#00525c] transition-all cursor-pointer"
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
