import React, { useState } from 'react';
import { ViewType, Course, QuizQuestion, AuditLogEntry, LessonItem, CourseMaterial } from '../../types';
import { 
  Settings, 
  BookOpen, 
  HelpCircle, 
  ShieldAlert, 
  Layers, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Award, 
  Search, 
  Sliders, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Video, 
  Sparkles,
  X,
  Save,
  Check,
  Play,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Info,
  CheckSquare,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SystemAdminDashboardViewProps {
  onNavigate: (view: ViewType) => void;
  auditLogs: AuditLogEntry[];
  onAddAuditLog: (action: string, actionAr: string, details: string, detailsAr: string, target: string) => void;
  courses: Course[];
  onUpdateCourse: (course: Course) => void;
  lessons: LessonItem[];
  onAddLesson: (lesson: LessonItem) => void;
  onUpdateLesson: (lesson: LessonItem) => void;
  onDeleteLesson: (lessonId: string) => void;
  questions: QuizQuestion[];
  onAddQuestion: (question: QuizQuestion) => void;
  onDeleteQuestion?: (questionId: number) => void;
  sequentialEnforced?: boolean;
  onToggleSequentialEnforced?: (enforced: boolean) => void;
}

export const SystemAdminDashboardView: React.FC<SystemAdminDashboardViewProps> = ({
  onNavigate,
  auditLogs,
  onAddAuditLog,
  courses,
  onUpdateCourse,
  lessons,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  questions,
  onAddQuestion,
  onDeleteQuestion,
  sequentialEnforced = true,
  onToggleSequentialEnforced
}) => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'studio' | 'rules' | 'questions' | 'audit' | 'programs'>('studio');

  // Selected course for Content Studio
  const [selectedStudioCourseId, setSelectedStudioCourseId] = useState<string>(courses[0]?.id || "course-1");
  const selectedCourse = courses.find(c => c.id === selectedStudioCourseId) || courses[0];

  // Course configuration modal
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Video Lesson modal state
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<LessonItem | null>(null);
  const [videoForm, setVideoForm] = useState({
    title: '',
    titleAr: '',
    duration: '12:30',
    protocolId: 'SOP-101.1',
    videoUrl: '',
    description: '',
    descriptionAr: '',
    learningObjective1: '',
    learningObjective2: ''
  });

  // SOP Material modal state
  const [isSopModalOpen, setIsSopModalOpen] = useState(false);
  const [sopForm, setSopForm] = useState({
    title: '',
    titleAr: '',
    type: 'pdf' as 'video' | 'pdf' | 'presentation' | 'instructions',
    durationOrPages: '16 pages',
    durationOrPagesAr: '16 صفحة',
    url: ''
  });

  // Question bank state
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [newQuestionForm, setNewQuestionForm] = useState({
    courseId: 'course-1',
    question: '',
    questionAr: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correctIndex: 0,
    hint: '',
    hintAr: '',
    explanation: '',
    explanationAr: '',
    moduleRef: 'SOP Reference'
  });

  // Audit filter state
  const [auditSearch, setAuditSearch] = useState('');
  const [auditSeverity, setAuditSeverity] = useState('All');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lessons for currently selected course
  const currentCourseLessons = lessons.filter(l => l.moduleId === selectedStudioCourseId);

  // Handle opening add video modal
  const handleOpenAddVideo = () => {
    setEditingLesson(null);
    setVideoForm({
      title: '',
      titleAr: '',
      duration: '14:00',
      protocolId: `SOP-${selectedCourse.code}.1`,
      videoUrl: selectedCourse.imageUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: '',
      descriptionAr: '',
      learningObjective1: '',
      learningObjective2: ''
    });
    setIsVideoModalOpen(true);
  };

  // Handle opening edit video modal
  const handleOpenEditVideo = (lesson: LessonItem) => {
    setEditingLesson(lesson);
    setVideoForm({
      title: lesson.title,
      titleAr: lesson.titleAr || '',
      duration: lesson.duration,
      protocolId: lesson.protocolId || `SOP-${selectedCourse.code}`,
      videoUrl: lesson.videoUrl || '',
      description: lesson.description || '',
      descriptionAr: lesson.descriptionAr || '',
      learningObjective1: lesson.learningObjectives?.[0] || '',
      learningObjective2: lesson.learningObjectives?.[1] || ''
    });
    setIsVideoModalOpen(true);
  };

  // Save video lesson
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim()) return;

    const objectives = [videoForm.learningObjective1, videoForm.learningObjective2].filter(Boolean);

    if (editingLesson) {
      const updated: LessonItem = {
        ...editingLesson,
        title: videoForm.title,
        titleAr: videoForm.titleAr || videoForm.title,
        duration: videoForm.duration,
        protocolId: videoForm.protocolId,
        videoUrl: videoForm.videoUrl,
        description: videoForm.description,
        descriptionAr: videoForm.descriptionAr,
        learningObjectives: objectives.length > 0 ? objectives : editingLesson.learningObjectives
      };
      onUpdateLesson(updated);
      showToast(isRTL ? 'تم تحديث بيانات الفيديو التعليمي بنجاح' : 'Video lesson updated successfully');
      onAddAuditLog(
        "Course Video Updated",
        "تحديث فيديو تعليمي للمقرر",
        `Updated video lesson "${updated.title}" for ${selectedCourse.code}`,
        `تم تحديث المحاضرة المرئية "${updated.titleAr || updated.title}" للمقرر ${selectedCourse.code}`,
        `Course: ${selectedCourse.code}`
      );
    } else {
      const newLesson: LessonItem = {
        id: `les-${selectedStudioCourseId}-${Date.now()}`,
        moduleId: selectedStudioCourseId,
        stageNumber: `0${currentCourseLessons.length + 1}`,
        title: videoForm.title,
        titleAr: videoForm.titleAr || videoForm.title,
        duration: videoForm.duration || '10:00',
        type: 'Video',
        status: currentCourseLessons.length === 0 ? 'Currently Playing' : 'Not Started',
        completed: false,
        protocolId: videoForm.protocolId,
        description: videoForm.description || `Clinical laboratory instruction for ${selectedCourse.title}`,
        descriptionAr: videoForm.descriptionAr || `شرح إكلينيكي للمقرر التدريبي ${selectedCourse.titleAr}`,
        videoUrl: videoForm.videoUrl,
        learningObjectives: objectives.length > 0 ? objectives : ['Master standard operating procedure.', 'Demonstrate compliance under ISO 15189.']
      };
      onAddLesson(newLesson);
      showToast(isRTL ? 'تمت إضافة الفيديو التدريبي بنجاح إلى المقرر' : 'Video lecture added to course syllabus');
      onAddAuditLog(
        "Course Video Added",
        "إضافة فيديو تعليمي للمقرر",
        `Added new video lesson "${newLesson.title}" to ${selectedCourse.code}`,
        `تمت إضافة فيديو تدريبي جديد "${newLesson.titleAr}" إلى المقرر ${selectedCourse.code}`,
        `Course: ${selectedCourse.code}`
      );
    }

    setIsVideoModalOpen(false);
  };

  // Add SOP Material to Course
  const handleSaveSopMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sopForm.title.trim()) return;

    const newMaterial: CourseMaterial = {
      id: `mat-${Date.now()}`,
      type: sopForm.type,
      title: sopForm.title,
      titleAr: sopForm.titleAr || sopForm.title,
      durationOrPages: sopForm.durationOrPages,
      durationOrPagesAr: sopForm.durationOrPagesAr,
      url: sopForm.url || '#'
    };

    const updatedMaterials = [...(selectedCourse.materials || []), newMaterial];
    const updatedCourse = {
      ...selectedCourse,
      materials: updatedMaterials
    };

    onUpdateCourse(updatedCourse);
    setIsSopModalOpen(false);
    showToast(isRTL ? 'تمت إضافة دليل العمل SOP إلى المقرر بنجاح' : 'SOP manual attached to course materials');

    onAddAuditLog(
      "SOP Material Attached",
      "إضافة دليل عمل SOP للمقرر",
      `Attached ${newMaterial.type.toUpperCase()} "${newMaterial.title}" to ${selectedCourse.code}`,
      `تم إرفاق دليل "${newMaterial.titleAr}" للمقرر ${selectedCourse.code}`,
      `Course: ${selectedCourse.code}`
    );
  };

  // Delete SOP material
  const handleDeleteMaterial = (materialId: string) => {
    const updatedMaterials = (selectedCourse.materials || []).filter(m => m.id !== materialId);
    onUpdateCourse({
      ...selectedCourse,
      materials: updatedMaterials
    });
    showToast(isRTL ? 'تم حذف المستند' : 'Material removed');
  };

  // Save general course settings (Pass score, attempts, prerequisite)
  const handleSaveCourseSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    onUpdateCourse(editingCourse);
    showToast(isRTL ? `تم تحديث إعدادات وقواعد المقرر ${editingCourse.code} بنجاح` : `Course ${editingCourse.code} rules & settings updated successfully`);

    onAddAuditLog(
      "Course Rules Updated",
      "تعديل قواعد ومتطلبات المقرر",
      `Configured passScore=${editingCourse.passScore}%, attempts=${editingCourse.allowedAttempts}, prereq=${editingCourse.prerequisiteCourseCode || 'None'} for ${editingCourse.code}`,
      `تم تحديث نسبة الاجتياز ${editingCourse.passScore}% والمحاولات ${editingCourse.allowedAttempts} للمقرر ${editingCourse.code}`,
      `Course: ${editingCourse.code}`
    );

    setEditingCourse(null);
  };

  // Add question to question bank
  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionForm.question || !newQuestionForm.option1) return;

    const newQ: QuizQuestion = {
      id: Date.now(),
      courseId: newQuestionForm.courseId,
      questionNumber: questions.filter(q => q.courseId === newQuestionForm.courseId).length + 1,
      totalQuestions: 4,
      question: newQuestionForm.question,
      questionAr: newQuestionForm.questionAr || newQuestionForm.question,
      hint: newQuestionForm.hint || "Review standard operating procedures.",
      hintAr: newQuestionForm.hintAr || "راجع أدلة إجراءات العمل القياسية SOP.",
      options: [newQuestionForm.option1, newQuestionForm.option2, newQuestionForm.option3, newQuestionForm.option4],
      correctIndex: Number(newQuestionForm.correctIndex),
      explanation: newQuestionForm.explanation || "Verified laboratory standard response.",
      explanationAr: newQuestionForm.explanationAr || "الإجابة النموذجية المعتمدة وفق معايير المختبر.",
      moduleRef: newQuestionForm.moduleRef,
      difficulty: 'Intermediate'
    };

    onAddQuestion(newQ);
    setIsAddQuestionOpen(false);
    showToast(isRTL ? 'تمت إضافة السؤال لبنك الأسئلة المعتمد' : 'Question added to verified question bank');

    onAddAuditLog(
      "Question Bank Updated",
      "إضافة سؤال لبنك الأسئلة",
      `Added question #${newQ.id} to question pool for ${newQuestionForm.courseId}`,
      `تمت إضافة سؤال جديد لبنك الأسئلة لكورس ${newQuestionForm.courseId}`,
      `QuestionBank: ${newQuestionForm.courseId}`
    );
  };

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    if (selectedCourseFilter === 'all') return true;
    return q.courseId === selectedCourseFilter;
  });

  // Filtered audit logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actionAr.includes(auditSearch) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.ipAddress.includes(auditSearch);

    const matchesSeverity = auditSeverity === 'All' || log.status === auditSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B96C7] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <Settings className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#485261]">
              {t.sysAdminTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#9995A6] mt-1">
            {t.sysAdminSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('video_lesson')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C0CAD8] text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#0B96C7]" />
            <span>{isRTL ? 'معاينة مشغل المقرر' : 'Preview Course Player'}</span>
          </button>
          <button
            onClick={() => onNavigate('trainee_dashboard')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B96C7] text-white text-xs font-bold shadow-xs hover:bg-[#087fa8] transition-all cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{isRTL ? 'معاينة مسار المتدرب' : 'Trainee Dashboard'}</span>
          </button>
        </div>
      </div>

      {/* Clean Segmented Tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-[#132238] rounded-xl border border-slate-200/80 dark:border-[#1E3557] max-w-full">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer hover-lift ${
            activeTab === 'studio' 
              ? 'bg-white dark:bg-[#1E3557] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-[#1E3557]' 
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 hover:dark:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-[#0B96C7]" />
          <span>{t.tabCourseStudio}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#dee2e8] dark:bg-[#182A45] text-[#0B96C7] dark:text-[#6BBADA] font-bold">
            {isRTL ? 'محرر المحتوى' : 'Content Hub'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer hover-lift ${
            activeTab === 'rules' 
              ? 'bg-white dark:bg-[#1E3557] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-[#1E3557]' 
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 hover:dark:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#0B96C7]" />
          <span>{t.tabSettingsPrograms}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
            {isRTL ? 'محرك القواعد' : 'Rules Engine'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer hover-lift ${
            activeTab === 'questions' 
              ? 'bg-white dark:bg-[#1E3557] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-[#1E3557]' 
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 hover:dark:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#0B96C7]" />
          <span>{t.tabQuestionBank}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#182A45] text-slate-700 dark:text-[#DEE2E8] font-bold tabular-nums">
            {questions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer hover-lift ${
            activeTab === 'audit' 
              ? 'bg-white dark:bg-[#1E3557] text-slate-900 dark:text-white shadow-xs border border-slate-200/60 dark:border-[#1E3557]' 
              : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 hover:dark:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#0B96C7]" />
          <span>{t.tabAuditTrail}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-[#182A45] text-slate-700 dark:text-[#DEE2E8] font-bold tabular-nums">
            {auditLogs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'programs' 
              ? 'bg-white text-slate-900 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#0B96C7]" />
          <span>{isRTL ? 'مسارات المؤسسة' : 'Hospital Tracks'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COURSE CONTENT STUDIO (VIDEOS, SOPS & LECTURES)    */}
      {/* ======================================================== */}
      {activeTab === 'studio' && (
        <div className="space-y-6">
          
          {/* User Guidance Banner */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-[#c0cad8]/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#0B96C7] text-white flex items-center justify-center shrink-0">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {t.courseStudioTitle}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-3xl">
                  {isRTL 
                    ? 'هذا هو المكان المخصص لوضع محتوى المقررات: أضف روابط وفيديوهات الشرح، أدلة الـ SOP المعتمدة، العروض التقديمية، والأسئلة الخاصة بكل كورس.'
                    : 'This is where you upload and manage all course content: video lectures (YouTube, direct MP4, embed), standard operating procedure (SOP) manuals, presentation decks, and assessment questions.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleOpenAddVideo}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addVideoLesson}</span>
              </button>
              <button
                onClick={() => setIsSopModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-2xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-700" />
                <span>{t.addSOPManual}</span>
              </button>
            </div>
          </div>

          {/* Course Module Selector Chips */}
          <div className="flex flex-wrap items-center gap-2 pb-1">
            <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] whitespace-nowrap">
              {isRTL ? 'اختر المقرر:' : 'Select Course:'}
            </span>
            {courses.map((c) => {
              const isSelected = c.id === selectedStudioCourseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedStudioCourseId(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer hover-lift ${
                    isSelected
                      ? 'bg-[#0B96C7] text-white shadow-xs border border-[#0B96C7]'
                      : 'bg-white dark:bg-[#132238] text-slate-700 dark:text-[#DEE2E8] border border-slate-200 dark:border-[#1E3557] hover:bg-slate-50 dark:hover:bg-[#182A45]'
                  }`}
                >
                  <span className="font-mono font-bold">{c.code}</span>
                  <span>·</span>
                  <span className="truncate max-w-[180px]">
                    {isRTL && c.titleAr ? c.titleAr : c.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Current Course Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#dee2e8] border border-[#c0cad8]/80 text-[#0B96C7] flex items-center justify-center font-bold text-sm font-mono shrink-0">
                0{selectedCourse.moduleNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                    {selectedCourse.code}
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-600 font-semibold">
                    {isRTL && selectedCourse.categoryAr ? selectedCourse.categoryAr : selectedCourse.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {isRTL && selectedCourse.titleAr ? selectedCourse.titleAr : selectedCourse.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-2xl">
                  {isRTL && selectedCourse.descriptionAr ? selectedCourse.descriptionAr : selectedCourse.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditingCourse(selectedCourse)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-[#0B96C7]" />
                <span>{isRTL ? 'تعديل قواعد المقرر' : 'Configure Rules'}</span>
              </button>
              <button
                onClick={() => onNavigate('video_lesson')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRTL ? 'مشاهدة كمستمع' : 'Launch Player'}</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Videos & Lectures on Left, SOPs & Documents on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Panel 1: Video Lessons & Lectures */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#0B96C7]" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.videoLessonsManager} ({currentCourseLessons.length})
                  </h4>
                </div>
                <button
                  onClick={handleOpenAddVideo}
                  className="text-xs font-bold text-[#0B96C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addVideoLesson}</span>
                </button>
              </div>

              {currentCourseLessons.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                  <Video className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    {isRTL ? 'لا توجد محاضرات مرئية مضافة لهذا المقرر بعد' : 'No video lectures added yet'}
                  </p>
                  <button
                    onClick={handleOpenAddVideo}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0B96C7] text-white text-xs font-bold"
                  >
                    {t.addVideoLesson}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentCourseLessons.map((lesson, idx) => (
                    <div 
                      key={lesson.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-teal-300 transition-all bg-slate-50/50 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center text-xs font-mono font-bold shrink-0">
                            0{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-[#0B96C7] bg-[#dee2e8] px-1.5 py-0.2 rounded border border-[#c0cad8]/50">
                                {lesson.protocolId || selectedCourse.code}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {lesson.duration}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 mt-1">
                              {isRTL && lesson.titleAr ? lesson.titleAr : lesson.title}
                            </h5>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenEditVideo(lesson)}
                            className="p-1.5 text-slate-500 hover:text-[#0B96C7] hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteLesson(lesson.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Video Stream URL tag */}
                      {lesson.videoUrl && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono bg-white px-2.5 py-1 rounded border border-slate-200 truncate">
                          <Play className="w-3 h-3 text-[#0B96C7] shrink-0" />
                          <span className="truncate">{lesson.videoUrl}</span>
                        </div>
                      )}

                      {/* Learning Objectives summary */}
                      {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                        <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200/60">
                          <span className="font-semibold text-slate-700 block">
                            {isRTL ? 'أهداف المحاضرة:' : 'Objectives:'}
                          </span>
                          {lesson.learningObjectives.slice(0, 2).map((obj, i) => (
                            <p key={i} className="flex items-center gap-1 truncate text-slate-500">
                              <span className="text-[#0B96C7]">✓</span> {obj}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Panel 2: Attached SOPs & Study Materials */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.sopDocumentsManager} ({(selectedCourse.materials || []).length})
                  </h4>
                </div>
                <button
                  onClick={() => setIsSopModalOpen(true)}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.addSOPManual}</span>
                </button>
              </div>

              {(selectedCourse.materials || []).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    {isRTL ? 'لا توجد أدلة SOP مرفقة بعد' : 'No SOP documents attached'}
                  </p>
                  <button
                    onClick={() => setIsSopModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold"
                  >
                    {t.addSOPManual}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {(selectedCourse.materials || []).map((mat) => (
                    <div 
                      key={mat.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-emerald-300 transition-all bg-slate-50/50 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {isRTL && mat.titleAr ? mat.titleAr : mat.title}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                              {mat.type}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {isRTL && mat.durationOrPagesAr ? mat.durationOrPagesAr : mat.durationOrPages}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleDeleteMaterial(mat.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 cursor-pointer"
                          title="Remove material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Quick Questions for this Course section */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-700" />
                <h4 className="text-sm font-bold text-slate-900">
                  {isRTL ? `أسئلة اختبار كورس ${selectedCourse.code}` : `Assessment Questions Pool for ${selectedCourse.code}`} ({questions.filter(q => q.courseId === selectedCourse.id).length})
                </h4>
              </div>

              <button
                onClick={() => {
                  setNewQuestionForm({
                    ...newQuestionForm,
                    courseId: selectedCourse.id,
                    moduleRef: `SOP-${selectedCourse.code}`
                  });
                  setIsAddQuestionOpen(true);
                }}
                className="text-xs font-bold text-[#0B96C7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addQuestion}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {questions.filter(q => q.courseId === selectedCourse.id).map((q, idx) => (
                <div key={q.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#0B96C7] text-[11px]">
                      Question 0{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                      Answer: Option {String.fromCharCode(65 + q.correctIndex)}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 line-clamp-2">
                    {isRTL && q.questionAr ? q.questionAr : q.question}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Ref: {q.moduleRef}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RULES & PREREQUISITES ENGINE (CONFLICT RESOLUTION) */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          
          {/* Rules Conflict Audit Banner */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.rulesEngineTitle}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t.rulesEngineDesc}
                  </p>
                </div>
              </div>

              {/* Sequential Lock Global Toggle */}
              {onToggleSequentialEnforced && (
                <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
                  <span className="text-xs font-bold text-slate-700">
                    {isRTL ? 'فرض التسلسل الإلزامي:' : 'Strict Sequential Enforced:'}
                  </span>
                  <button
                    onClick={() => {
                      onToggleSequentialEnforced(!sequentialEnforced);
                      showToast(
                        !sequentialEnforced 
                          ? (isRTL ? 'تم تفعيل التسلسل الصارم للمقررات' : 'Strict sequential prerequisite mode enabled')
                          : (isRTL ? 'تم إيقاف التسلسل الصارم (وضع التجربة)' : 'Strict sequential mode paused (Sandbox mode)')
                      );
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      sequentialEnforced ? 'bg-[#0B96C7]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        sequentialEnforced ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Diagnostic Rules Matrix */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-xs space-y-1 text-emerald-900">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{isRTL ? 'فحص سلامة القواعد (Rule Integrity Audit): سليم 100%' : 'Rule Integrity Audit: 100% Valid & Conflict-Free'}</span>
              </p>
              <p className="text-[11px] text-emerald-800">
                {isRTL 
                  ? 'تم التحقق من مسار الاعتماد المتسلسل: لا يوجد تعارض أو حلقات متبادلة (Zero Cyclic Dependencies). المقررات تفتح تباعاً فور تحقيق درجة ≥ 80% في الاختبار.'
                  : 'Verified linear prerequisite chain: Zero cyclic dependencies detected. Modules unlock sequentially upon passing the assessment with score ≥ 80%.'}
              </p>
            </div>
          </div>

          {/* Visual Sequential Flowchart */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isRTL ? 'المخطط الانسيابي للتسلسل الإلزامي:' : 'Linear Prerequisite Dependency Flowchart:'}
            </h4>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto pb-2">
              {courses.map((course, idx) => (
                <React.Fragment key={course.id}>
                  <div className="flex-1 min-w-[180px] p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0B96C7]">
                        0{course.moduleNumber} · {course.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        ≥ {course.passScore}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {isRTL && course.titleAr ? course.titleAr : course.title}
                    </p>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                      <span>Max {course.allowedAttempts} attempts</span>
                      <button
                        onClick={() => setEditingCourse(course)}
                        className="text-[#0B96C7] font-bold hover:underline cursor-pointer"
                      >
                        {isRTL ? 'تعديل' : 'Edit'}
                      </button>
                    </div>
                  </div>

                  {idx < courses.length - 1 && (
                    <div className="hidden md:flex text-slate-300">
                      <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Courses Rules List */}
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-white rounded-2xl p-5 border border-[#C0CAD8] shadow-2xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                      0{course.moduleNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0B96C7]">
                          {course.code}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-bold text-slate-900">
                          {isRTL && course.titleAr ? course.titleAr : course.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isRTL ? 'المتطلب السابق:' : 'Prerequisite:'} <span className="font-bold text-amber-700">{course.prerequisiteCourseCode || t.nonePrerequisite}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingCourse(course)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#0B96C7]" />
                    <span>{t.editCourse}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">{t.passScoreThreshold}</span>
                    <span className="font-bold text-emerald-700 font-mono">{course.passScore}%</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">{t.maxAttemptsSetting}</span>
                    <span className="font-bold text-slate-900 font-mono">{course.allowedAttempts} Attempts</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">{t.courseDuration}</span>
                    <span className="font-bold text-[#0B96C7] font-mono">{course.estMinutes} mins</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">{t.validityMonthsLabel}</span>
                    <span className="font-bold text-purple-700 font-mono">{course.validityMonths || 12} Months</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: QUESTION BANK & ASSESSMENTS                        */}
      {/* ======================================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#485261]">
                {t.questionBankTitle}
              </h2>
              <p className="text-xs text-[#9995A6] mt-0.5">
                {t.questionBankDesc}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="bg-white border border-[#C0CAD8] rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <option value="all">{isRTL ? 'جميع المقررات' : 'All Courses'}</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code}: {c.title.slice(0, 30)}...</option>
                ))}
              </select>

              <button
                onClick={() => setIsAddQuestionOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B96C7] text-white text-xs font-bold shadow-md shadow-[#0B96C7]/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addQuestion}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredQuestions.map((q, idx) => (
              <div 
                key={q.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                        {q.courseId} · #{q.id}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Ref: {q.moduleRef}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {isRTL && q.questionAr ? q.questionAr : q.question}
                    </h4>
                  </div>

                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                    Correct: Option {String.fromCharCode(65 + q.correctIndex)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  {q.options.map((opt, oIdx) => (
                    <div 
                      key={oIdx}
                      className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                        oIdx === q.correctIndex 
                          ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-900' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="font-mono font-bold text-xs">{String.fromCharCode(65 + oIdx)}.</span>
                      <span>{isRTL && q.optionsAr?.[oIdx] ? q.optionsAr[oIdx] : opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AUDIT TRAIL LOGS                                  */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-[#C0CAD8] shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-[#C0CAD8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-[#485261]">
                  {t.auditTrailTitle}
                </h2>
                <p className="text-xs text-[#9995A6] mt-0.5">
                  {t.auditTrailDesc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {isRTL ? 'سجل رقابي غير قابل للتعديل' : 'Immutable CAP/ISO Audit Log'}
                </span>
              </div>
            </div>

            {/* Audit Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className={`w-4 h-4 text-[#9995A6] absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search actions, users, IPs, targets..."
                  className={`w-full bg-[#DEE2E8] border border-[#C0CAD8]/60 rounded-xl py-2 text-xs focus:outline-none focus:border-[#0B96C7] ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}
                />
              </div>

              <select
                value={auditSeverity}
                onChange={(e) => setAuditSeverity(e.target.value)}
                className="bg-[#DEE2E8] border border-[#C0CAD8]/60 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0B96C7]"
              >
                <option value="All">All Log Statuses</option>
                <option value="Success">Success Only</option>
                <option value="Warning">Warnings Only</option>
                <option value="Security Alert">Security Alerts</option>
              </select>
            </div>
          </div>

          {/* Audit Trail Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#dee2e8] dark:bg-[#182A45] text-[#9995A6] dark:text-[#94A3B8] font-bold uppercase tracking-wider border-b border-[#c0cad8] dark:border-[#1E3557]">
                <tr>
                  <th className="py-3 px-6 text-start">{t.colTimestamp}</th>
                  <th className="py-3 px-4 text-start">{t.colUser}</th>
                  <th className="py-3 px-4 text-start">{t.colRole}</th>
                  <th className="py-3 px-4 text-start">{t.colAction}</th>
                  <th className="py-3 px-4 text-start">{t.colTarget}</th>
                  <th className="py-3 px-4 text-start">{t.colIp}</th>
                  <th className="py-3 px-6 text-end">{t.colSeverity}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c0cad8] dark:divide-[#1E3557]">
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id} className="hover-row transition-colors">
                    <td className="py-3.5 px-6 font-mono text-[11px] text-[#485261]">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#485261]">
                      {log.userName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold text-[#9995A6]">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#0B96C7]">
                        {isRTL ? log.actionAr : log.action}
                      </p>
                      <p className="text-[11px] text-[#9995A6] truncate max-w-xs">
                        {isRTL ? log.detailsAr : log.details}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#485261]">
                      {log.target}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#9995A6]">
                      {log.ipAddress}
                    </td>
                    <td className="py-3.5 px-6 text-end">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'Warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: FUTURE HOSPITAL PROGRAMS & TRACKS                  */}
      {/* ======================================================== */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C0CAD8] shadow-xs space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#485261]">
              {t.futureProgramsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#9995A6] mt-0.5 leading-relaxed">
              {t.futureProgramsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800">{t.progOrientation}</span>
                <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  {t.activeStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Mandatory sequential 5-module path for newly hired laboratory specialists.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#C0CAD8]/60 bg-[#DEE2E8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#485261]">{t.progAnnualMandatory}</span>
                <span className="text-[10px] font-bold bg-[#C0CAD8] text-[#485261] px-2 py-0.5 rounded-full">
                  {t.plannedStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Annual recurring certification for chemical hazard containment and fire safety.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#C0CAD8]/60 bg-[#DEE2E8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#485261]">{t.progRefresher}</span>
                <span className="text-[10px] font-bold bg-[#C0CAD8] text-[#485261] px-2 py-0.5 rounded-full">
                  {t.plannedStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Targeted refresher training triggered on SOP modifications or proficiency alerts.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-[#C0CAD8]/60 bg-[#DEE2E8] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#485261]">{t.progCompetency}</span>
                <span className="text-[10px] font-bold bg-[#C0CAD8] text-[#485261] px-2 py-0.5 rounded-full">
                  {t.plannedStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Semiannual blind sample analysis and Westgard calibration verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT VIDEO LESSON                         */}
      {/* ======================================================== */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingLesson ? (isRTL ? 'تعديل المحاضرة المرئية' : 'Edit Video Lecture') : t.addVideoLesson} — {selectedCourse.code}
              </h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Video Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                  placeholder="e.g. BSL-2 Biosafety Containment & Personal Protective Gear"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0B96C7]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  عنوان الفيديو (بالعربية)
                </label>
                <input
                  type="text"
                  value={videoForm.titleAr}
                  onChange={(e) => setVideoForm({...videoForm, titleAr: e.target.value})}
                  placeholder="مثال: معدات الوقاية الشخصية وإرشادات الأمان الحيوي"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#0B96C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {t.videoDuration} *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.duration}
                    onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                    placeholder="14:20"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Protocol / SOP ID
                  </label>
                  <input
                    type="text"
                    value={videoForm.protocolId}
                    onChange={(e) => setVideoForm({...videoForm, protocolId: e.target.value})}
                    placeholder="SOP-101.1"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.videoUrl} *
                </label>
                <input
                  type="text"
                  required
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({...videoForm, videoUrl: e.target.value})}
                  placeholder="https://... or YouTube URL or direct MP4 stream"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports YouTube embeds, direct video MP4 streams, and clinical simulation feeds.
                </p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Learning Objective 1
                </label>
                <input
                  type="text"
                  value={videoForm.learningObjective1}
                  onChange={(e) => setVideoForm({...videoForm, learningObjective1: e.target.value})}
                  placeholder="Master correct order of doffing PPE without self-contamination"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Learning Objective 2
                </label>
                <input
                  type="text"
                  value={videoForm.learningObjective2}
                  onChange={(e) => setVideoForm({...videoForm, learningObjective2: e.target.value})}
                  placeholder="Demonstrate emergency flush protocol for ocular splashes"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B96C7] text-white font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'حفظ ونشر الفيديو' : 'Save Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD SOP DOCUMENT / MATERIAL                     */}
      {/* ======================================================== */}
      {isSopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t.addSOPManual} — {selectedCourse.code}
              </h3>
              <button onClick={() => setIsSopModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSopMaterial} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Document / SOP Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={sopForm.title}
                  onChange={(e) => setSopForm({...sopForm, title: e.target.value})}
                  placeholder="e.g. SOP-101: Emergency Incident & Chemical Spill Protocols"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  عنوان الدليل (بالعربية)
                </label>
                <input
                  type="text"
                  value={sopForm.titleAr}
                  onChange={(e) => setSopForm({...sopForm, titleAr: e.target.value})}
                  placeholder="مثال: دليل التشغيل القياسي SOP-101: خطط الطوارئ المخبرية"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Material Type
                  </label>
                  <select
                    value={sopForm.type}
                    onChange={(e) => setSopForm({...sopForm, type: e.target.value as any})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="pdf">Clinical SOP (PDF)</option>
                    <option value="presentation">Presentation Slides</option>
                    <option value="instructions">Checklist & Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Pages / Duration
                  </label>
                  <input
                    type="text"
                    value={sopForm.durationOrPages}
                    onChange={(e) => setSopForm({...sopForm, durationOrPages: e.target.value})}
                    placeholder="18 pages"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSopModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold"
                >
                  {isRTL ? 'إرفاق المستند' : 'Attach Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT COURSE RULES & PREREQUISITES               */}
      {/* ======================================================== */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t.editCourse} — {editingCourse.code}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourseSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.passScoreThreshold} (80% Standard)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="60"
                    max="100"
                    step="5"
                    value={editingCourse.passScore}
                    onChange={(e) => setEditingCourse({...editingCourse, passScore: Number(e.target.value)})}
                    className="flex-1 accent-[#0B96C7]"
                  />
                  <span className="font-bold text-sm text-[#0B96C7] w-12 text-end font-mono">
                    {editingCourse.passScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.maxAttemptsSetting}</label>
                  <select
                    value={editingCourse.allowedAttempts}
                    onChange={(e) => setEditingCourse({...editingCourse, allowedAttempts: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                  >
                    <option value="1">1 Attempt</option>
                    <option value="2">2 Attempts</option>
                    <option value="3">3 Attempts (Standard)</option>
                    <option value="5">5 Attempts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t.courseDuration} ({t.mins})</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={editingCourse.estMinutes}
                    onChange={(e) => setEditingCourse({...editingCourse, estMinutes: Number(e.target.value)})}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t.prerequisiteSetting}
                </label>
                <select
                  value={editingCourse.prerequisiteCourseId || 'none'}
                  onChange={(e) => {
                    const prereqId = e.target.value === 'none' ? undefined : e.target.value;
                    const prereqCourse = courses.find(c => c.id === prereqId);
                    setEditingCourse({
                      ...editingCourse,
                      prerequisiteCourseId: prereqId,
                      prerequisiteCourseCode: prereqCourse?.code
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                >
                  <option value="none">{t.nonePrerequisite}</option>
                  {courses
                    .filter(c => c.id !== editingCourse.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t.validityMonthsLabel}</label>
                <select
                  value={editingCourse.validityMonths || 12}
                  onChange={(e) => setEditingCourse({...editingCourse, validityMonths: Number(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2"
                >
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
                <p className="font-bold">{isRTL ? 'فحص النزاهة والرقابة:' : 'Governance Notice:'}</p>
                <p>{isRTL ? 'سيتم تسجيل هذا التعديل ومصدره فوراً في سجل التدقيق والرقابة Audit Trail.' : 'This modification will be immediately recorded in the regulatory audit trail.'}</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B96C7] text-white font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'حفظ القواعد' : 'Save Rules'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: ADD QUESTION                                    */}
      {/* ======================================================== */}
      {isAddQuestionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">{t.addQuestion}</h3>
              <button onClick={() => setIsAddQuestionOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Course</label>
                <select
                  value={newQuestionForm.courseId}
                  onChange={(e) => setNewQuestionForm({...newQuestionForm, courseId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Question (English) *</label>
                <textarea
                  required
                  rows={2}
                  value={newQuestionForm.question}
                  onChange={(e) => setNewQuestionForm({...newQuestionForm, question: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Question (Arabic)</label>
                <textarea
                  rows={2}
                  value={newQuestionForm.questionAr}
                  onChange={(e) => setNewQuestionForm({...newQuestionForm, questionAr: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Options & Mark Correct (A, B, C, D)</label>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 0} onChange={() => setNewQuestionForm({...newQuestionForm, correctIndex: 0})} />
                  <input type="text" placeholder="Option A" required value={newQuestionForm.option1} onChange={(e) => setNewQuestionForm({...newQuestionForm, option1: e.target.value})} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 1} onChange={() => setNewQuestionForm({...newQuestionForm, correctIndex: 1})} />
                  <input type="text" placeholder="Option B" required value={newQuestionForm.option2} onChange={(e) => setNewQuestionForm({...newQuestionForm, option2: e.target.value})} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 2} onChange={() => setNewQuestionForm({...newQuestionForm, correctIndex: 2})} />
                  <input type="text" placeholder="Option C" required value={newQuestionForm.option3} onChange={(e) => setNewQuestionForm({...newQuestionForm, option3: e.target.value})} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 3} onChange={() => setNewQuestionForm({...newQuestionForm, correctIndex: 3})} />
                  <input type="text" placeholder="Option D" required value={newQuestionForm.option4} onChange={(e) => setNewQuestionForm({...newQuestionForm, option4: e.target.value})} className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5" />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">SOP Protocol Reference</label>
                <input
                  type="text"
                  value={newQuestionForm.moduleRef}
                  onChange={(e) => setNewQuestionForm({...newQuestionForm, moduleRef: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setIsAddQuestionOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold">
                  {t.cancel}
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0B96C7] text-white font-bold">
                  {t.addQuestion}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
