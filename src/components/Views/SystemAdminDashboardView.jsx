import React, { useState, useEffect } from 'react';
import { Settings, Check, BookOpen, HelpCircle, Layers, Edit3, Plus, CheckCircle2, Search, Sliders, Activity, FileText, Video, X, Save, Play, Trash2, ShieldCheck, ArrowRight, CheckSquare } from 'lucide-react';
import { mockPersonas } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { TablePagination } from '../Common/TablePagination';
export const SystemAdminDashboardView = ({ user = mockPersonas.system_admin, onNavigate, auditLogs, onAddAuditLog, courses, onUpdateCourse, lessons, onAddLesson, onUpdateLesson, onDeleteLesson, questions, onAddQuestion, onDeleteQuestion, sequentialEnforced = true, onToggleSequentialEnforced }) => {
    const { t, isRTL } = useLanguage();
    const [activeTab, setActiveTab] = useState('studio');
    // Selected course for Content Studio
    const [selectedStudioCourseId, setSelectedStudioCourseId] = useState(courses[0]?.id || "course-1");
    const selectedCourse = courses.find(c => c.id === selectedStudioCourseId) || courses[0];
    // Course configuration modal
    const [editingCourse, setEditingCourse] = useState(null);
    // Video Lesson modal state
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
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
        type: 'pdf',
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
    // Audit Pagination state (default: 5 rows per table)
    const [auditCurrentPage, setAuditCurrentPage] = useState(1);
    const [auditPageSize, setAuditPageSize] = useState(5);
    // Reset to page 1 on audit filter change
    useEffect(() => {
        setAuditCurrentPage(1);
    }, [auditSearch, auditSeverity]);
    // Toast
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
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
    const handleOpenEditVideo = (lesson) => {
        setEditingLesson(lesson);
        setVideoForm({
            title: lesson.title,
            titleAr: lesson.titleAr || lesson.title,
            duration: lesson.duration,
            protocolId: lesson.protocolId || `SOP-${selectedCourse.code}.1`,
            videoUrl: lesson.videoUrl || '',
            description: lesson.description || '',
            descriptionAr: lesson.descriptionAr || '',
            learningObjective1: lesson.learningObjectives?.[0] || '',
            learningObjective2: lesson.learningObjectives?.[1] || ''
        });
        setIsVideoModalOpen(true);
    };
    // Handle saving video (Add or Edit)
    const handleSaveVideo = (e) => {
        e.preventDefault();
        if (!videoForm.title)
            return;
        const objectives = [videoForm.learningObjective1, videoForm.learningObjective2].filter(Boolean);
        if (editingLesson) {
            const updated = {
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
            showToast(isRTL ? `تم تحديث فيديو "${updated.titleAr || updated.title}" بنجاح` : `Updated video "${updated.title}" successfully`);
            onAddAuditLog("Video Lesson Updated", "تحديث محاضرة مرئية في المقرر", `Updated video lesson "${updated.title}" in course ${selectedCourse.code}`, `تم تحديث المحاضرة المرئية "${updated.titleAr || updated.title}" في المقرر ${selectedCourse.code}`, `Course: ${selectedCourse.code}`);
        }
        else {
            const newLesson = {
                id: `v-${Date.now()}`,
                moduleId: selectedStudioCourseId,
                title: videoForm.title,
                titleAr: videoForm.titleAr || videoForm.title,
                duration: videoForm.duration,
                durationMinutes: 14,
                videoUrl: videoForm.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                protocolId: videoForm.protocolId,
                description: videoForm.description || 'Clinical laboratory operational procedure tutorial and standards review.',
                descriptionAr: videoForm.descriptionAr || 'محاضرة توضيحية لبروتوكولات التشغيل القياسية وضمان الجودة بالمختبر.',
                completed: false,
                learningObjectives: objectives.length > 0 ? objectives : [
                    'Adhere strictly to personal protective equipment standards',
                    'Demonstrate proper procedure handling under ISO 15189'
                ]
            };
            onAddLesson(newLesson);
            showToast(isRTL ? `تمت إضافة فيديو "${newLesson.titleAr}" إلى كورس ${selectedCourse.code}` : `Added video "${newLesson.title}" to ${selectedCourse.code}`);
            onAddAuditLog("Video Lesson Added", "إضافة محاضرة مرئية جديدة", `Added new video lesson "${newLesson.title}" to course ${selectedCourse.code}`, `تمت إضافة محاضرة جديدة "${newLesson.titleAr}" إلى المقرر ${selectedCourse.code}`, `Course: ${selectedCourse.code}`);
        }
        setIsVideoModalOpen(false);
    };
    // Handle saving SOP material
    const handleSaveSopMaterial = (e) => {
        e.preventDefault();
        if (!sopForm.title)
            return;
        const newMaterial = {
            id: `mat-${Date.now()}`,
            title: sopForm.title,
            titleAr: sopForm.titleAr || sopForm.title,
            type: sopForm.type,
            durationOrPages: sopForm.durationOrPages,
            durationOrPagesAr: sopForm.durationOrPagesAr || sopForm.durationOrPages,
            url: sopForm.url || '#'
        };
        const currentMaterials = selectedCourse.materials || [];
        const updatedCourse = {
            ...selectedCourse,
            materials: [...currentMaterials, newMaterial]
        };
        onUpdateCourse(updatedCourse);
        setIsSopModalOpen(false);
        showToast(isRTL ? `تم إرفاق دليل SOP "${newMaterial.titleAr}" بالمقرر ${selectedCourse.code}` : `Attached SOP "${newMaterial.title}" to course ${selectedCourse.code}`);
        onAddAuditLog("SOP Material Attached", "إرفاق دليل تشغيل قياسي SOP", `Attached document "${newMaterial.title}" to course ${selectedCourse.code}`, `تم إرفاق وثيقة "${newMaterial.titleAr}" بالمقرر ${selectedCourse.code}`, `Course: ${selectedCourse.code}`);
    };
    // Handle deleting SOP material
    const handleDeleteMaterial = (materialId) => {
        const updatedMaterials = (selectedCourse.materials || []).filter(m => m.id !== materialId);
        const updatedCourse = {
            ...selectedCourse,
            materials: updatedMaterials
        };
        onUpdateCourse(updatedCourse);
        showToast(isRTL ? 'تم حذف الوثيقة بنجاح' : 'Material removed successfully');
    };
    // Save Course configuration
    const handleSaveCourseSettings = (e) => {
        e.preventDefault();
        if (!editingCourse)
            return;
        onUpdateCourse(editingCourse);
        setEditingCourse(null);
        showToast(isRTL ? `تم تحديث قواعد كورس ${editingCourse.code} بنجاح` : `Updated rules for ${editingCourse.code} successfully`);
        onAddAuditLog("Course Rules Updated", "تحديث قواعد واعتماد المقرر", `Updated prerequisite and passing rules for ${editingCourse.code} (Pass threshold: ${editingCourse.passScore}%)`, `تم تعديل شروط اجتياز المقرر ${editingCourse.code} بنسبة نجاح ${editingCourse.passScore}%`, `Course: ${editingCourse.code}`);
    };
    // Add question handler
    const handleAddQuestionSubmit = (e) => {
        e.preventDefault();
        if (!newQuestionForm.question || !newQuestionForm.option1 || !newQuestionForm.option2)
            return;
        const options = [
            newQuestionForm.option1,
            newQuestionForm.option2,
            newQuestionForm.option3,
            newQuestionForm.option4
        ].filter(Boolean);
        const newQ = {
            id: Date.now(),
            courseId: newQuestionForm.courseId,
            question: newQuestionForm.question,
            questionAr: newQuestionForm.questionAr || newQuestionForm.question,
            options,
            optionsAr: options,
            correctIndex: newQuestionForm.correctIndex,
            hint: newQuestionForm.hint || 'Review the clinical SOP procedure guidelines.',
            hintAr: newQuestionForm.hintAr || 'راجع إرشادات دليل التشغيل القياسي للمختبر.',
            explanation: newQuestionForm.explanation || 'Strict adherence to ISO 15189 requires compliance with this standard.',
            explanationAr: newQuestionForm.explanationAr || 'الالتزام التام بمعيار ISO 15189 يفرض تطبيق هذا الإجراء بدقة.',
            moduleRef: newQuestionForm.moduleRef || 'SOP Reference'
        };
        onAddQuestion(newQ);
        setIsAddQuestionOpen(false);
        showToast(isRTL ? 'تمت إضافة السؤال بنجاح إلى بنك الأسئلة' : 'New assessment question added to question bank');
        onAddAuditLog("Question Bank Item Added", "إضافة سؤال جديد لبنك الأسئلة", `Added new MCQ assessment item to course ${newQuestionForm.courseId}`, `تمت إضافة سؤال جديد لاختبار المقرر ${newQuestionForm.courseId}`, `Question Bank: Course ${newQuestionForm.courseId}`);
    };
    // Delete question item
    const handleDeleteQuestionItem = (qId) => {
        if (onDeleteQuestion) {
            onDeleteQuestion(qId);
            showToast(isRTL ? 'تم حذف السؤال من بنك الأسئلة' : 'Question deleted from bank');
            onAddAuditLog("Question Bank Item Deleted", "حذف سؤال من بنك الأسئلة", `Deleted assessment question #${qId}`, `تم حذف السؤال رقم #${qId} من بنك الأسئلة`, `Question: #${qId}`);
        }
    };
    // Filtered Questions
    const filteredQuestions = questions.filter(q => {
        if (selectedCourseFilter === 'all')
            return true;
        return q.courseId === selectedCourseFilter;
    });
    // Filtered Audit Logs
    const filteredAuditLogs = auditLogs.filter(log => {
        const matchesSearch = log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
            log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
            log.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
            log.details.toLowerCase().includes(auditSearch.toLowerCase());
        const matchesSeverity = auditSeverity === 'All' || log.status === auditSeverity;
        return matchesSearch && matchesSeverity;
    });
    // Audit Pagination calculations
    const totalAuditPages = Math.max(1, Math.ceil(filteredAuditLogs.length / auditPageSize));
    const safeAuditPage = Math.min(Math.max(1, auditCurrentPage), totalAuditPages);
    const paginatedAuditLogs = filteredAuditLogs.slice(
        (safeAuditPage - 1) * auditPageSize,
        safeAuditPage * auditPageSize
    );
    return (<div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (<div className="fixed bottom-6 right-6 z-50 bg-[#0B96C7] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0"/>
          <span>{toastMessage}</span>
        </div>)}

      {/* 1. Clinical LMS Architecture & Curriculum Governance Passport Card */}
      <div className="bg-white rounded-2xl border border-[#c0cad8] shadow-xs overflow-hidden">
        
        {/* Accreditation & Governance Stripe */}
        <div className="bg-[#dee2e8]/40 border-b border-[#c0cad8]/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-[#485261]">
            <ShieldCheck className="w-4 h-4 text-[#0B96C7]"/>
            <span className="font-semibold text-[#485261]">
              {isRTL ? 'إدارة النظام وهندسة المسارات المخبرية — الحوكمة التقنية' : 'Laboratory LMS Architecture & Curriculum Governance'}
            </span>
            <span className="text-[#c0cad8]">|</span>
            <span className="text-[11px] text-[#9995A6] font-mono">ISO 15189:2022 · CAP #8472910</span>
            <span className="text-[#c0cad8]">|</span>
            <span className="text-[10px] font-mono font-medium text-[#485261] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
              {isRTL ? 'محرك القواعد: تسلسل صارم معتمد' : 'Rule Engine v3.4 · Conflict-Free'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border text-emerald-700 bg-emerald-50 border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"/>
              {sequentialEnforced ? (isRTL ? 'محرك القواعد: تسلسل إجباري مشروط (≥ 80%)' : 'Sequence Lock: Strictly Enforced (≥ 80%)') : (isRTL ? 'الوضع التجريبي (Sandbox)' : 'Sandbox Mode: Unrestricted')}
            </span>
          </div>
        </div>

        {/* Main Overview: System Admin Identity & Operations Hub */}
        <div className="p-6 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* System Admin Identity & Governance Dossier */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-[#c0cad8] shadow-xs"/>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B96C7] text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-sans text-[#485261] tracking-tight leading-snug">
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

              {/* Compact Diagnostic Status Bar */}
              <div className="bg-[#dee2e8]/30 p-3.5 rounded-xl border border-[#c0cad8]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#485261]">
                  <Sliders className="w-4 h-4 text-[#0B96C7] shrink-0"/>
                  <span className="font-semibold text-[#485261]">
                    {isRTL ? 'حالة محرك القواعد والتسلسل:' : 'Rule Engine Diagnostics:'}
                  </span>
                  <span className="font-mono font-bold text-[#485261] tabular-nums">
                    {sequentialEnforced ? 'Strict Linear Sequence (Pass ≥ 80%)' : 'Sandbox (Free Navigation)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#c0cad8] font-mono font-bold text-xs text-[#485261] shadow-2xs">
                    0 {isRTL ? 'تعارضات' : 'Cyclic Conflicts'} · 100% {isRTL ? 'سليم' : 'Valid'}
                  </span>
                </div>
              </div>
            </div>

            {/* Operations Hub (Preview Actions & Enforced Sequencing Toggle) */}
            <div className="lg:col-span-5 xl:col-span-5 bg-[#dee2e8]/30 p-5 rounded-xl border border-[#c0cad8] flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#0B96C7] flex items-center gap-1.5 font-mono">
                  <Settings className="w-4 h-4"/>
                  {isRTL ? 'مركز العمليات والتحكم' : 'System Operations Hub'}
                </span>
                <span className="text-xs font-mono font-bold text-[#485261] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
                  {courses.length} Modules · {lessons.length} Videos · {questions.length} MCQs
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#485261]">
                  {isRTL ? 'إدارة محتوى المقررات والامتحانات وسجلات الرقابة' : 'Curriculum Studio & Compliance Ledger'}
                </h3>
                <p className="text-[11px] text-[#9995A6] leading-relaxed">
                  {isRTL
            ? 'رفع المحاضرات المرئية، إرفاق أدلة العمل SOP، ضبط درجات الاجتياز، وتتبع سجلات التدقيق غير القابلة للتعديل.'
            : 'Manage accredited video lectures, link clinical SOP manuals, enforce sequential passing thresholds, and inspect immutable audit logs.'}
                </p>

                {/* Sequential Enforcement Global Toggle Row */}
                {onToggleSequentialEnforced && (<div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#c0cad8] mt-2">
                    <span className="text-xs font-bold text-[#485261] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0B96C7]"/>
                      <span>{isRTL ? 'فرض التسلسل الإلزامي الصارم:' : 'Enforce Sequential Lock (≥ 80%):'}</span>
                    </span>
                    <button onClick={() => {
                onToggleSequentialEnforced(!sequentialEnforced);
                showToast(!sequentialEnforced
                    ? (isRTL ? 'تم تفعيل التسلسل الصارم للمقررات' : 'Strict sequential prerequisite mode enabled')
                    : (isRTL ? 'تم إيقاف التسلسل الصارم (وضع التجربة)' : 'Strict sequential mode paused (Sandbox mode)'));
            }} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${sequentialEnforced ? 'bg-[#0B96C7]' : 'bg-[#c0cad8]'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${sequentialEnforced ? 'translate-x-5' : 'translate-x-1'}`}/>
                    </button>
                  </div>)}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={() => onNavigate('trainee_dashboard')} className="flex items-center justify-center gap-2 py-2 px-3 bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95">
                  <CheckSquare className="w-3.5 h-3.5"/>
                  <span>{isRTL ? 'معاينة مسار المتدرب' : 'Trainee Preview'}</span>
                </button>

                <button onClick={() => onNavigate('video_lesson')} className="flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-[#dee2e8]/40 text-[#485261] text-xs font-semibold rounded-lg border border-[#c0cad8] transition-all cursor-pointer">
                  <Play className="w-3.5 h-3.5 text-[#0B96C7]"/>
                  <span>{isRTL ? 'مشغل المحاضرات' : 'Course Player'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 2. Key Metrics Row (Standardized 4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Accredited Curriculum Courses */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{isRTL ? 'المقررات الإلزامية' : 'Accredited Curriculum'}</span>
            <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#485261] flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {courses.length} <span className="text-xs font-normal text-[#9995A6]">Modules</span>
          </p>
          <p className="text-xs text-[#0B96C7] font-medium">
            {isRTL ? 'مسار تسلسلي معتمد بالكامل' : '100% Sequential chain verified'}
          </p>
        </div>

        {/* Metric 2: Video Lecture Units */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{isRTL ? 'المحاضرات المرئية' : 'Video Lectures'}</span>
            <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center shrink-0">
              <Video className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {lessons.length} <span className="text-xs font-normal text-[#9995A6]">Videos</span>
          </p>
          <p className="text-xs text-[#9995A6] font-medium">
            {isRTL ? 'محاضرات تدريبية عملية 1080p' : 'Clinical SOP procedure videos'}
          </p>
        </div>

        {/* Metric 3: Assessment Question Bank */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.tabQuestionBank}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {questions.length} <span className="text-xs font-normal text-[#9995A6]">MCQs</span>
          </p>
          <p className="text-xs text-emerald-700 font-medium">
            {isRTL ? 'معيار الاجتياز: ≥ 80%' : 'Validated passing items (≥ 80%)'}
          </p>
        </div>

        {/* Metric 4: Immutable Audit Trail */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.tabAuditTrail}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Activity className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {auditLogs.length} <span className="text-xs font-normal text-[#9995A6]">Events</span>
          </p>
          <p className="text-xs text-amber-800 font-medium">
            {isRTL ? 'سجل رقابي مشفر ISO / CAP' : 'Tamper-proof compliance ledger'}
          </p>
        </div>

      </div>

      {/* 3. Segmented Tab Navigation - All on one line with white background */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-xl border border-[#c0cad8] shadow-2xs overflow-x-auto custom-scrollbar whitespace-nowrap max-w-full">
        <button onClick={() => setActiveTab('studio')} className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'studio'
            ? 'bg-[#0B96C7] text-white shadow-xs font-bold'
            : 'text-[#485261] hover:text-[#0B96C7] hover:bg-[#dee2e8]/40'}`}>
          <Video className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'studio' ? 'text-white' : 'text-[#0B96C7]'}`}/>
          <span>{t.tabCourseStudio}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${activeTab === 'studio'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-[#dee2e8] text-[#0B96C7] border border-[#c0cad8]/60'}`}>
            {isRTL ? 'استوديو المحتوى' : 'Content Hub'}
          </span>
        </button>

        <button onClick={() => setActiveTab('rules')} className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'rules'
            ? 'bg-[#0B96C7] text-white shadow-xs font-bold'
            : 'text-[#485261] hover:text-[#0B96C7] hover:bg-[#dee2e8]/40'}`}>
          <Sliders className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'rules' ? 'text-white' : 'text-[#0B96C7]'}`}/>
          <span>{t.tabSettingsPrograms}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${activeTab === 'rules'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'}`}>
            {isRTL ? 'محرك القواعد' : 'Rules Engine'}
          </span>
        </button>

        <button onClick={() => setActiveTab('questions')} className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'questions'
            ? 'bg-[#0B96C7] text-white shadow-xs font-bold'
            : 'text-[#485261] hover:text-[#0B96C7] hover:bg-[#dee2e8]/40'}`}>
          <HelpCircle className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'questions' ? 'text-white' : 'text-[#0B96C7]'}`}/>
          <span>{t.tabQuestionBank}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold tabular-nums ${activeTab === 'questions'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-[#dee2e8] text-[#485261] border border-[#c0cad8]/60'}`}>
            {questions.length}
          </span>
        </button>

        <button onClick={() => setActiveTab('audit')} className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'audit'
            ? 'bg-[#0B96C7] text-white shadow-xs font-bold'
            : 'text-[#485261] hover:text-[#0B96C7] hover:bg-[#dee2e8]/40'}`}>
          <Activity className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'audit' ? 'text-white' : 'text-[#0B96C7]'}`}/>
          <span>{t.tabAuditTrail}</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold tabular-nums ${activeTab === 'audit'
            ? 'bg-white/20 text-white border border-white/30'
            : 'bg-[#dee2e8] text-[#485261] border border-[#c0cad8]/60'}`}>
            {auditLogs.length}
          </span>
        </button>

        <button onClick={() => setActiveTab('programs')} className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activeTab === 'programs'
            ? 'bg-[#0B96C7] text-white shadow-xs font-bold'
            : 'text-[#485261] hover:text-[#0B96C7] hover:bg-[#dee2e8]/40'}`}>
          <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'programs' ? 'text-white' : 'text-[#0B96C7]'}`}/>
          <span>{isRTL ? 'مسارات المؤسسة' : 'Hospital Tracks'}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: COURSE CONTENT STUDIO (VIDEOS, SOPS & LECTURES)    */}
      {/* ======================================================== */}
      {activeTab === 'studio' && (<div className="space-y-4">
          
          {/* Section Card */}
          <div className="bg-white rounded-2xl p-6 lg:p-7 border border-[#c0cad8] shadow-xs space-y-5">
            
            {/* Header with Mono Tag */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c0cad8]/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                    CONTENT STUDIO
                  </span>
                  <h2 className="text-lg font-bold text-[#485261] tracking-tight">
                    {t.courseStudioTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#9995A6] mt-1 max-w-3xl leading-relaxed">
                  {isRTL
                ? 'هذا هو المكان المخصص لوضع محتوى المقررات: أضف روابط وفيديوهات الشرح، أدلة الـ SOP المعتمدة، العروض التقديمية، والأسئلة الخاصة بكل كورس.'
                : 'Manage accredited laboratory video lectures (YouTube, direct MP4), standard operating procedure (SOP) manuals, presentation decks, and assessment questions.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={handleOpenAddVideo} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                  <Plus className="w-3.5 h-3.5"/>
                  <span>{t.addVideoLesson}</span>
                </button>
                <button onClick={() => setIsSopModalOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] text-xs font-bold shadow-2xs cursor-pointer transition-all">
                  <Plus className="w-3.5 h-3.5 text-emerald-700"/>
                  <span>{t.addSOPManual}</span>
                </button>
              </div>
            </div>

            {/* Course Module Selector Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#485261] whitespace-nowrap">
                {isRTL ? 'اختر المقرر:' : 'Select Course:'}
              </span>
              {courses.map((c) => {
                const isSelected = c.id === selectedStudioCourseId;
                return (<button key={c.id} onClick={() => setSelectedStudioCourseId(c.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isSelected
                        ? 'bg-[#0B96C7] text-white shadow-xs border border-[#0B96C7]'
                        : 'bg-white text-[#485261] border border-[#c0cad8] hover:bg-[#dee2e8]/40'}`}>
                    <span className="font-mono font-bold">{c.code}</span>
                    <span className="opacity-60">·</span>
                    <span className="truncate max-w-[180px]">
                      {isRTL && c.titleAr ? c.titleAr : c.title}
                    </span>
                  </button>);
            })}
            </div>

            {/* Selected Course Overview Card */}
            <div className="bg-[#dee2e8]/25 rounded-xl border border-[#c0cad8] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-[#c0cad8] text-[#0B96C7] flex items-center justify-center font-bold text-sm font-mono shrink-0 shadow-2xs">
                  0{selectedCourse.moduleNumber}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#0B96C7] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
                      {selectedCourse.code}
                    </span>
                    <span className="text-[#c0cad8]">·</span>
                    <span className="text-xs text-[#485261] font-semibold">
                      {isRTL && selectedCourse.categoryAr ? selectedCourse.categoryAr : selectedCourse.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#485261] mt-1">
                    {isRTL && selectedCourse.titleAr ? selectedCourse.titleAr : selectedCourse.title}
                  </h3>
                  <p className="text-xs text-[#9995A6] mt-0.5 line-clamp-1 max-w-2xl">
                    {isRTL && selectedCourse.descriptionAr ? selectedCourse.descriptionAr : selectedCourse.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => setEditingCourse(selectedCourse)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] text-xs font-semibold transition-all cursor-pointer">
                  <Sliders className="w-3.5 h-3.5 text-[#0B96C7]"/>
                  <span>{isRTL ? 'تعديل قواعد المقرر' : 'Configure Rules'}</span>
                </button>
                <button onClick={() => onNavigate('video_lesson')} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-semibold transition-all cursor-pointer">
                  <Play className="w-3.5 h-3.5"/>
                  <span>{isRTL ? 'مشاهدة كمستمع' : 'Launch Player'}</span>
                </button>
              </div>
            </div>

            {/* Video Lessons & Attached SOP Documents Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              
              {/* Panel 1: Video Lessons */}
              <div className="bg-white rounded-xl border border-[#c0cad8] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]/60">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#0B96C7]"/>
                    <h4 className="text-sm font-bold text-[#485261]">
                      {t.videoLessonsManager} ({currentCourseLessons.length})
                    </h4>
                  </div>
                  <button onClick={handleOpenAddVideo} className="text-xs font-bold text-[#0B96C7] hover:underline flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5"/>
                    <span>{t.addVideoLesson}</span>
                  </button>
                </div>

                {currentCourseLessons.length === 0 ? (<div className="p-8 text-center bg-[#dee2e8]/20 rounded-xl border border-dashed border-[#c0cad8] space-y-2">
                    <Video className="w-8 h-8 text-[#9995A6] mx-auto"/>
                    <p className="text-xs font-semibold text-[#485261]">
                      {isRTL ? 'لا توجد محاضرات مرئية مضافة لهذا المقرر بعد' : 'No video lectures added yet'}
                    </p>
                    <button onClick={handleOpenAddVideo} className="px-3.5 py-1.5 rounded-lg bg-[#0B96C7] text-white text-xs font-bold cursor-pointer">
                      {t.addVideoLesson}
                    </button>
                  </div>) : (<div className="space-y-3">
                    {currentCourseLessons.map((lesson, idx) => (<div key={lesson.id} className="p-3.5 rounded-xl border border-[#c0cad8] hover:border-[#6bbada] transition-all bg-[#dee2e8]/20 space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white border border-[#c0cad8] text-[#0B96C7] flex items-center justify-center text-xs font-mono font-bold shrink-0">
                              0{idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-mono text-[#0B96C7] bg-white px-1.5 py-0.2 rounded border border-[#c0cad8]">
                                  {lesson.protocolId || selectedCourse.code}
                                </span>
                                <span className="text-[#c0cad8]">·</span>
                                <span className="text-[11px] font-mono text-[#9995A6]">
                                  {lesson.duration}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-[#485261] mt-1">
                                {isRTL && lesson.titleAr ? lesson.titleAr : lesson.title}
                              </h5>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={() => handleOpenEditVideo(lesson)} className="p-1.5 text-[#9995A6] hover:text-[#0B96C7] hover:bg-white rounded-lg border border-transparent hover:border-[#c0cad8] cursor-pointer" title="Edit">
                              <Edit3 className="w-3.5 h-3.5"/>
                            </button>
                            <button onClick={() => onDeleteLesson(lesson.id)} className="p-1.5 text-[#9995A6] hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-[#c0cad8] cursor-pointer" title="Delete">
                              <Trash2 className="w-3.5 h-3.5"/>
                            </button>
                          </div>
                        </div>

                        {lesson.videoUrl && (<div className="flex items-center gap-1.5 text-[11px] text-[#485261] font-mono bg-white px-2.5 py-1 rounded border border-[#c0cad8] truncate">
                            <Play className="w-3 h-3 text-[#0B96C7] shrink-0"/>
                            <span className="truncate">{lesson.videoUrl}</span>
                          </div>)}

                        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (<div className="text-[11px] text-[#485261] space-y-0.5 pt-1 border-t border-[#c0cad8]/60">
                            <span className="font-semibold text-[#485261] block">
                              {isRTL ? 'أهداف المحاضرة:' : 'Objectives:'}
                            </span>
                            {lesson.learningObjectives.slice(0, 2).map((obj, i) => (<p key={i} className="flex items-center gap-1 truncate text-[#9995A6]">
                                <Check className="w-3.5 h-3.5 text-[#0B96C7] stroke-[2.5] shrink-0 inline"/> {obj}
                              </p>))}
                          </div>)}
                      </div>))}
                  </div>)}
              </div>

              {/* Panel 2: SOP Documents */}
              <div className="bg-white rounded-xl border border-[#c0cad8] p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-700"/>
                    <h4 className="text-sm font-bold text-[#485261]">
                      {t.sopDocumentsManager} ({(selectedCourse.materials || []).length})
                    </h4>
                  </div>
                  <button onClick={() => setIsSopModalOpen(true)} className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5"/>
                    <span>{t.addSOPManual}</span>
                  </button>
                </div>

                {(selectedCourse.materials || []).length === 0 ? (<div className="p-8 text-center bg-[#dee2e8]/20 rounded-xl border border-dashed border-[#c0cad8] space-y-2">
                    <FileText className="w-8 h-8 text-[#9995A6] mx-auto"/>
                    <p className="text-xs font-semibold text-[#485261]">
                      {isRTL ? 'لا توجد أدلة SOP مرفقة بعد' : 'No SOP documents attached'}
                    </p>
                    <button onClick={() => setIsSopModalOpen(true)} className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold cursor-pointer">
                      {t.addSOPManual}
                    </button>
                  </div>) : (<div className="space-y-3">
                    {(selectedCourse.materials || []).map((mat) => (<div key={mat.id} className="p-3.5 rounded-xl border border-[#c0cad8] hover:border-emerald-300 transition-all bg-[#dee2e8]/20 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-white border border-[#c0cad8] text-emerald-700 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4"/>
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-bold text-[#485261] truncate">
                              {isRTL && mat.titleAr ? mat.titleAr : mat.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-white px-1.5 py-0.2 rounded border border-emerald-200/60">
                                {mat.type}
                              </span>
                              <span className="text-[#c0cad8]">·</span>
                              <span className="text-[11px] font-mono text-[#9995A6]">
                                {isRTL && mat.durationOrPagesAr ? mat.durationOrPagesAr : mat.durationOrPages}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => handleDeleteMaterial(mat.id)} className="p-1.5 text-[#9995A6] hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-[#c0cad8] cursor-pointer" title="Remove material">
                            <Trash2 className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>))}
                  </div>)}
              </div>

            </div>

            {/* Quick Assessment Questions for Selected Course */}
            <div className="bg-[#dee2e8]/25 rounded-xl border border-[#c0cad8] p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]/60">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#0B96C7]"/>
                  <h4 className="text-sm font-bold text-[#485261]">
                    {isRTL ? `بنك أسئلة كورس ${selectedCourse.code}` : `Assessment Questions for ${selectedCourse.code}`} ({questions.filter(q => q.courseId === selectedCourse.id).length})
                  </h4>
                </div>

                <button onClick={() => {
                setNewQuestionForm({
                    ...newQuestionForm,
                    courseId: selectedCourse.id,
                    moduleRef: `SOP-${selectedCourse.code}`
                });
                setIsAddQuestionOpen(true);
            }} className="text-xs font-bold text-[#0B96C7] hover:underline flex items-center gap-1 cursor-pointer">
                  <Plus className="w-3.5 h-3.5"/>
                  <span>{t.addQuestion}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {questions.filter(q => q.courseId === selectedCourse.id).map((q, idx) => (<div key={q.id} className="p-3.5 bg-white rounded-xl border border-[#c0cad8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#0B96C7] text-[11px]">
                        Question 0{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                        Answer: Option {String.fromCharCode(65 + q.correctIndex)}
                      </span>
                    </div>
                    <p className="font-semibold text-[#485261] line-clamp-2">
                      {isRTL && q.questionAr ? q.questionAr : q.question}
                    </p>
                    <p className="text-[11px] text-[#9995A6] font-mono">
                      Ref: {q.moduleRef}
                    </p>
                  </div>))}
              </div>
            </div>

          </div>

        </div>)}

      {/* ======================================================== */}
      {/* TAB 2: RULES & PREREQUISITES ENGINE (CONFLICT RESOLUTION) */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (<div className="space-y-4">
          
          <div className="bg-white rounded-2xl p-6 lg:p-7 border border-[#c0cad8] shadow-xs space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c0cad8]/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                    RULES ENGINE
                  </span>
                  <h2 className="text-lg font-bold text-[#485261] tracking-tight">
                    {t.rulesEngineTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#9995A6] mt-1 max-w-3xl leading-relaxed">
                  {t.rulesEngineDesc}
                </p>
              </div>

              {onToggleSequentialEnforced && (<div className="flex items-center gap-3 bg-[#dee2e8]/40 px-3.5 py-2 rounded-xl border border-[#c0cad8] shrink-0">
                  <span className="text-xs font-bold text-[#485261]">
                    {isRTL ? 'فرض التسلسل الإلزامي:' : 'Strict Sequential Enforced:'}
                  </span>
                  <button onClick={() => {
                    onToggleSequentialEnforced(!sequentialEnforced);
                    showToast(!sequentialEnforced
                        ? (isRTL ? 'تم تفعيل التسلسل الصارم للمقررات' : 'Strict sequential prerequisite mode enabled')
                        : (isRTL ? 'تم إيقاف التسلسل الصارم (وضع التجربة)' : 'Strict sequential mode paused (Sandbox mode)'));
                }} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${sequentialEnforced ? 'bg-[#0B96C7]' : 'bg-[#c0cad8]'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sequentialEnforced ? 'translate-x-6' : 'translate-x-1'}`}/>
                  </button>
                </div>)}
            </div>

            {/* Diagnostic Rules Matrix */}
            <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs space-y-1 text-emerald-900">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700"/>
                <span>{isRTL ? 'فحص سلامة القواعد (Rule Integrity Audit): سليم 100%' : 'Rule Integrity Audit: 100% Valid & Conflict-Free'}</span>
              </p>
              <p className="text-[11px] text-emerald-800">
                {isRTL
                ? 'تم التحقق من مسار الاعتماد المتسلسل: لا يوجد تعارض أو حلقات متبادلة (Zero Cyclic Dependencies). المقررات تفتح تباعاً فور تحقيق درجة ≥ 80% في الاختبار.'
                : 'Verified linear prerequisite chain: Zero cyclic dependencies detected. Modules unlock sequentially upon passing the assessment with score ≥ 80%.'}
              </p>
            </div>

            {/* Visual Sequential Flowchart */}
            <div className="bg-[#dee2e8]/30 rounded-xl border border-[#c0cad8] p-5 space-y-4">
              <h4 className="text-xs font-bold text-[#485261] uppercase tracking-wider font-mono">
                {isRTL ? 'المخطط الانسيابي للتسلسل الإلزامي:' : 'Linear Prerequisite Dependency Flowchart:'}
              </h4>

              <div className="flex flex-col md:flex-row items-center justify-between gap-3 overflow-x-auto pb-2">
                {courses.map((course, idx) => (<React.Fragment key={course.id}>
                    <div className="flex-1 min-w-[180px] p-3.5 rounded-xl border border-[#c0cad8] bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#0B96C7]">
                          0{course.moduleNumber} · {course.code}
                        </span>
                        <span className="text-[10px] font-bold text-[#485261] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]">
                          ≥ {course.passScore}%
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#485261] truncate">
                        {isRTL && course.titleAr ? course.titleAr : course.title}
                      </p>
                      <div className="text-[10px] text-[#9995A6] flex items-center justify-between pt-1 border-t border-[#c0cad8]/60">
                        <span>Max {course.allowedAttempts} attempts</span>
                        <button onClick={() => setEditingCourse(course)} className="text-[#0B96C7] font-bold hover:underline cursor-pointer">
                          {isRTL ? 'تعديل' : 'Edit'}
                        </button>
                      </div>
                    </div>

                    {idx < courses.length - 1 && (<div className="hidden md:flex text-[#c0cad8]">
                        <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`}/>
                      </div>)}
                  </React.Fragment>))}
              </div>
            </div>

            {/* Courses Rules List */}
            <div className="grid grid-cols-1 gap-3.5">
              {courses.map((course) => (<div key={course.id} className="bg-white rounded-xl p-5 border border-[#c0cad8] shadow-2xs space-y-3 hover:border-[#6bbada] transition-all">
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
                          <span className="text-[#c0cad8]">·</span>
                          <span className="text-xs font-bold text-[#485261]">
                            {isRTL && course.titleAr ? course.titleAr : course.title}
                          </span>
                        </div>
                        <p className="text-xs text-[#9995A6] mt-0.5">
                          {isRTL ? 'المتطلب السابق:' : 'Prerequisite:'} <span className="font-bold text-amber-700">{course.prerequisiteCourseCode || t.nonePrerequisite}</span>
                        </p>
                      </div>
                    </div>

                    <button onClick={() => setEditingCourse(course)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] text-xs font-bold transition-all shrink-0 cursor-pointer">
                      <Edit3 className="w-3.5 h-3.5 text-[#0B96C7]"/>
                      <span>{t.editCourse}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#c0cad8]/60 text-xs">
                    <div className="p-2.5 bg-[#dee2e8]/25 rounded-lg border border-[#c0cad8]">
                      <span className="text-[#9995A6] block text-[11px]">{t.passScoreThreshold}</span>
                      <span className="font-bold text-emerald-700 font-mono">{course.passScore}%</span>
                    </div>
                    <div className="p-2.5 bg-[#dee2e8]/25 rounded-lg border border-[#c0cad8]">
                      <span className="text-[#9995A6] block text-[11px]">{t.maxAttemptsSetting}</span>
                      <span className="font-bold text-[#485261] font-mono">{course.allowedAttempts} Attempts</span>
                    </div>
                    <div className="p-2.5 bg-[#dee2e8]/25 rounded-lg border border-[#c0cad8]">
                      <span className="text-[#9995A6] block text-[11px]">{t.courseDuration}</span>
                      <span className="font-bold text-[#0B96C7] font-mono">{course.estMinutes} mins</span>
                    </div>
                    <div className="p-2.5 bg-[#dee2e8]/25 rounded-lg border border-[#c0cad8]">
                      <span className="text-[#9995A6] block text-[11px]">{t.validityMonthsLabel}</span>
                      <span className="font-bold text-[#485261] font-mono">{course.validityMonths || 12} Months</span>
                    </div>
                  </div>
                </div>))}
            </div>

          </div>

        </div>)}

      {/* ======================================================== */}
      {/* TAB 3: QUESTION BANK & ASSESSMENTS                        */}
      {/* ======================================================== */}
      {activeTab === 'questions' && (<div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 lg:p-7 border border-[#c0cad8] shadow-xs space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c0cad8]/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                    QUESTION BANK
                  </span>
                  <h2 className="text-lg font-bold text-[#485261] tracking-tight">
                    {t.questionBankTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#9995A6] mt-1 max-w-3xl leading-relaxed">
                  {t.questionBankDesc}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <select value={selectedCourseFilter} onChange={(e) => setSelectedCourseFilter(e.target.value)} className="bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-semibold text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white">
                  <option value="all">{isRTL ? 'جميع المقررات' : 'All Courses'}</option>
                  {courses.map(c => (<option key={c.id} value={c.id}>{c.code}: {c.title.slice(0, 30)}...</option>))}
                </select>

                <button onClick={() => setIsAddQuestionOpen(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                  <Plus className="w-4 h-4"/>
                  <span>{t.addQuestion}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {filteredQuestions.map((q) => (<div key={q.id} className="bg-white rounded-xl p-5 border border-[#c0cad8] shadow-2xs space-y-3 hover:border-[#6bbada] transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                          {q.courseId} · #{q.id}
                        </span>
                        <span className="text-xs text-[#9995A6] font-mono">
                          Ref: {q.moduleRef}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#485261] mt-1">
                        {isRTL && q.questionAr ? q.questionAr : q.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        Correct: Option {String.fromCharCode(65 + q.correctIndex)}
                      </span>
                      {onDeleteQuestion && (<button onClick={() => handleDeleteQuestionItem(q.id)} className="p-1.5 text-[#9995A6] hover:text-rose-600 hover:bg-[#dee2e8]/40 rounded-lg cursor-pointer" title="Delete Question">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-[#c0cad8]/60">
                    {q.options.map((opt, oIdx) => (<div key={oIdx} className={`p-2.5 rounded-lg border flex items-center gap-2 ${oIdx === q.correctIndex
                        ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-900'
                        : 'bg-[#dee2e8]/20 border-[#c0cad8] text-[#485261]'}`}>
                        <span className="font-mono font-bold text-xs">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{isRTL && q.optionsAr?.[oIdx] ? q.optionsAr[oIdx] : opt}</span>
                      </div>))}
                  </div>
                </div>))}
            </div>

          </div>
        </div>)}

      {/* ======================================================== */}
      {/* TAB 4: AUDIT TRAIL LOGS                                  */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (<div className="bg-white rounded-2xl border border-[#c0cad8] shadow-xs overflow-hidden space-y-4">
          <div className="p-6 border-b border-[#c0cad8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                    AUDIT LOGS
                  </span>
                  <h2 className="text-lg font-bold text-[#485261] tracking-tight">
                    {t.auditTrailTitle}
                  </h2>
                </div>
                <p className="text-xs text-[#9995A6] mt-1">
                  {t.auditTrailDesc}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"/>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {isRTL ? 'سجل رقابي غير قابل للتعديل' : 'Immutable CAP/ISO Audit Log'}
                </span>
              </div>
            </div>

            {/* Audit Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className={`w-3.5 h-3.5 text-[#9995A6] absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}/>
                <input type="text" value={auditSearch} onChange={(e) => setAuditSearch(e.target.value)} placeholder="Search actions, users, IPs, targets..." className={`w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl py-2 text-xs text-[#485261] placeholder:text-[#9995A6] focus:outline-none focus:border-[#0B96C7] focus:bg-white ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'}`}/>
              </div>

              <select value={auditSeverity} onChange={(e) => setAuditSeverity(e.target.value)} className="bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white cursor-pointer">
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
              <thead className="bg-[#dee2e8]/40 text-[#485261] font-semibold uppercase tracking-wider border-b border-[#c0cad8]/80">
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
              <tbody className="divide-y divide-[#c0cad8]/40">
                {paginatedAuditLogs.map((log) => (<tr key={log.id} className="hover:bg-[#dee2e8]/20 transition-colors">
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'Success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : log.status === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          {/* Audit Pagination bar under the table */}
          <TablePagination
            currentPage={safeAuditPage}
            totalItems={filteredAuditLogs.length}
            pageSize={auditPageSize}
            onPageChange={setAuditCurrentPage}
            onPageSizeChange={(newSize) => {
              setAuditPageSize(newSize);
              setAuditCurrentPage(1);
            }}
          />
        </div>)}

      {/* ======================================================== */}
      {/* TAB 5: FUTURE HOSPITAL PROGRAMS & TRACKS                  */}
      {/* ======================================================== */}
      {activeTab === 'programs' && (<div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#c0cad8] shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                CURRICULUM TRACKS
              </span>
              <h2 className="text-lg font-bold text-[#485261]">
                {t.futureProgramsTitle}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#9995A6] mt-1 leading-relaxed">
              {t.futureProgramsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-800">{t.progOrientation}</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  {t.activeStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Mandatory sequential 5-module path for newly hired laboratory specialists.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#c0cad8] bg-[#dee2e8]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#485261]">{t.progAnnualMandatory}</span>
                <span className="text-[10px] font-bold bg-[#c0cad8] text-[#485261] px-2 py-0.5 rounded-full">
                  {t.plannedStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Annual recurring certification for chemical hazard containment and fire safety.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#c0cad8] bg-[#dee2e8]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#485261]">{t.progRefresher}</span>
                <span className="text-[10px] font-bold bg-[#c0cad8] text-[#485261] px-2 py-0.5 rounded-full">
                  {t.plannedStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Targeted refresher training triggered on SOP modifications or proficiency alerts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#c0cad8] bg-[#dee2e8]/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#485261]">{t.progCompetency}</span>
                <span className="text-[10px] font-bold bg-[#c0cad8] text-[#485261] px-2 py-0.5 rounded-full">
                  {t.plannedStatus}
                </span>
              </div>
              <p className="text-xs text-[#9995A6]">
                Semiannual blind sample analysis and Westgard calibration verification.
              </p>
            </div>
          </div>
        </div>)}

      {/* ======================================================== */}
      {/* MODAL 1: ADD / EDIT VIDEO LESSON                         */}
      {/* ======================================================== */}
      {isVideoModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]">
              <h3 className="text-base font-bold text-[#485261]">
                {editingLesson ? (isRTL ? 'تعديل المحاضرة المرئية' : 'Edit Video Lecture') : t.addVideoLesson} — {selectedCourse.code}
              </h3>
              <button onClick={() => setIsVideoModalOpen(false)} className="p-1 text-[#9995A6] hover:text-[#485261] rounded-lg">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleSaveVideo} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  Video Title (English) *
                </label>
                <input type="text" required value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} placeholder="e.g. BSL-2 Biosafety Containment & Personal Protective Gear" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  عنوان الفيديو (بالعربية)
                </label>
                <input type="text" value={videoForm.titleAr} onChange={(e) => setVideoForm({ ...videoForm, titleAr: e.target.value })} placeholder="مثال: معدات الوقاية الشخصية وإرشادات الأمان الحيوي" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#485261] block mb-1">
                    {t.videoDuration} *
                  </label>
                  <input type="text" required value={videoForm.duration} onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })} placeholder="14:20" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>

                <div>
                  <label className="font-bold text-[#485261] block mb-1">
                    Protocol / SOP ID
                  </label>
                  <input type="text" value={videoForm.protocolId} onChange={(e) => setVideoForm({ ...videoForm, protocolId: e.target.value })} placeholder="SOP-101.1" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  {t.videoUrl} *
                </label>
                <input type="text" required value={videoForm.videoUrl} onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} placeholder="https://... or YouTube URL or direct MP4 stream" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                <p className="text-[11px] text-[#9995A6] mt-1">
                  Supports YouTube embeds, direct video MP4 streams, and clinical simulation feeds.
                </p>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  Learning Objective 1
                </label>
                <input type="text" value={videoForm.learningObjective1} onChange={(e) => setVideoForm({ ...videoForm, learningObjective1: e.target.value })} placeholder="Master correct order of doffing PPE without self-contamination" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  Learning Objective 2
                </label>
                <input type="text" value={videoForm.learningObjective2} onChange={(e) => setVideoForm({ ...videoForm, learningObjective2: e.target.value })} placeholder="Demonstrate emergency flush protocol for ocular splashes" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c0cad8]">
                <button type="button" onClick={() => setIsVideoModalOpen(false)} className="px-4 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] font-bold">
                  {t.cancel}
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white font-bold cursor-pointer">
                  <Save className="w-3.5 h-3.5"/>
                  <span>{isRTL ? 'حفظ ونشر الفيديو' : 'Save Video'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* ======================================================== */}
      {/* MODAL 2: ADD SOP DOCUMENT / MATERIAL                     */}
      {/* ======================================================== */}
      {isSopModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]">
              <h3 className="text-base font-bold text-[#485261]">
                {t.addSOPManual} — {selectedCourse.code}
              </h3>
              <button onClick={() => setIsSopModalOpen(false)} className="p-1 text-[#9995A6] hover:text-[#485261] rounded-lg">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleSaveSopMaterial} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  Document / SOP Title (English) *
                </label>
                <input type="text" required value={sopForm.title} onChange={(e) => setSopForm({ ...sopForm, title: e.target.value })} placeholder="e.g. SOP-101: Emergency Incident & Chemical Spill Protocols" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  عنوان الدليل (بالعربية)
                </label>
                <input type="text" value={sopForm.titleAr} onChange={(e) => setSopForm({ ...sopForm, titleAr: e.target.value })} placeholder="مثال: دليل التشغيل القياسي SOP-101: خطط الطوارئ المخبرية" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#485261] block mb-1">
                    Material Type
                  </label>
                  <select value={sopForm.type} onChange={(e) => setSopForm({ ...sopForm, type: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white">
                    <option value="pdf">Clinical SOP (PDF)</option>
                    <option value="presentation">Presentation Slides</option>
                    <option value="instructions">Checklist & Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#485261] block mb-1">
                    Pages / Duration
                  </label>
                  <input type="text" value={sopForm.durationOrPages} onChange={(e) => setSopForm({ ...sopForm, durationOrPages: e.target.value })} placeholder="18 pages" className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c0cad8]">
                <button type="button" onClick={() => setIsSopModalOpen(false)} className="px-4 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] font-bold">
                  {t.cancel}
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer">
                  {isRTL ? 'إرفاق المستند' : 'Attach Document'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* ======================================================== */}
      {/* MODAL 3: EDIT COURSE RULES & PREREQUISITES               */}
      {/* ======================================================== */}
      {editingCourse && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]">
              <h3 className="text-base font-bold text-[#485261]">
                {t.editCourse} — {editingCourse.code}
              </h3>
              <button onClick={() => setEditingCourse(null)} className="p-1 text-[#9995A6] hover:text-[#485261] rounded-lg">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleSaveCourseSettings} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  {t.passScoreThreshold} (80% Standard)
                </label>
                <div className="flex items-center gap-3">
                  <input type="range" min="60" max="100" step="5" value={editingCourse.passScore} onChange={(e) => setEditingCourse({ ...editingCourse, passScore: Number(e.target.value) })} className="flex-1 accent-[#0B96C7]"/>
                  <span className="font-bold text-sm text-[#0B96C7] w-12 text-end font-mono">
                    {editingCourse.passScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#485261] block mb-1">{t.maxAttemptsSetting}</label>
                  <select value={editingCourse.allowedAttempts} onChange={(e) => setEditingCourse({ ...editingCourse, allowedAttempts: Number(e.target.value) })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261]">
                    <option value="1">1 Attempt</option>
                    <option value="2">2 Attempts</option>
                    <option value="3">3 Attempts (Standard)</option>
                    <option value="5">5 Attempts</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#485261] block mb-1">{t.courseDuration} ({t.mins})</label>
                  <input type="number" min="15" max="180" value={editingCourse.estMinutes} onChange={(e) => setEditingCourse({ ...editingCourse, estMinutes: Number(e.target.value) })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261]"/>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">
                  {t.prerequisiteSetting}
                </label>
                <select value={editingCourse.prerequisiteCourseId || 'none'} onChange={(e) => {
                const prereqId = e.target.value === 'none' ? undefined : e.target.value;
                const prereqCourse = courses.find(c => c.id === prereqId);
                setEditingCourse({
                    ...editingCourse,
                    prerequisiteCourseId: prereqId,
                    prerequisiteCourseCode: prereqCourse?.code
                });
            }} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261]">
                  <option value="none">{t.nonePrerequisite}</option>
                  {courses
                .filter(c => c.id !== editingCourse.id)
                .map(c => (<option key={c.id} value={c.id}>
                        {c.code} — {c.title}
                      </option>))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">{t.validityMonthsLabel}</label>
                <select value={editingCourse.validityMonths || 12} onChange={(e) => setEditingCourse({ ...editingCourse, validityMonths: Number(e.target.value) })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261]">
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-[11px]">
                <p className="font-bold">{isRTL ? 'فحص النزاهة والرقابة:' : 'Governance Notice:'}</p>
                <p>{isRTL ? 'سيتم تسجيل هذا التعديل ومصدره فوراً في سجل التدقيق والرقابة Audit Trail.' : 'This modification will be immediately recorded in the regulatory audit trail.'}</p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c0cad8]">
                <button type="button" onClick={() => setEditingCourse(null)} className="px-4 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] font-bold">
                  {t.cancel}
                </button>
                <button type="submit" className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white font-bold cursor-pointer">
                  <Save className="w-3.5 h-3.5"/>
                  <span>{isRTL ? 'حفظ القواعد' : 'Save Rules'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* ======================================================== */}
      {/* MODAL 4: ADD QUESTION                                    */}
      {/* ======================================================== */}
      {isAddQuestionOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]">
              <h3 className="text-base font-bold text-[#485261]">{t.addQuestion}</h3>
              <button onClick={() => setIsAddQuestionOpen(false)} className="p-1 text-[#9995A6] hover:text-[#485261] rounded-lg">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#485261] block mb-1">Target Course</label>
                <select value={newQuestionForm.courseId} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, courseId: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261]">
                  {courses.map(c => (<option key={c.id} value={c.id}>{c.code} — {c.title}</option>))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">Question (English) *</label>
                <textarea required rows={2} value={newQuestionForm.question} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl p-2.5 text-xs text-[#485261]"/>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">Question (Arabic)</label>
                <textarea rows={2} value={newQuestionForm.questionAr} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, questionAr: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl p-2.5 text-xs text-[#485261]"/>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-[#485261] block">Options & Mark Correct (A, B, C, D)</label>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 0} onChange={() => setNewQuestionForm({ ...newQuestionForm, correctIndex: 0 })}/>
                  <input type="text" placeholder="Option A" required value={newQuestionForm.option1} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option1: e.target.value })} className="flex-1 bg-[#dee2e8]/30 border border-[#c0cad8] rounded-lg px-2.5 py-1.5 text-xs text-[#485261]"/>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 1} onChange={() => setNewQuestionForm({ ...newQuestionForm, correctIndex: 1 })}/>
                  <input type="text" placeholder="Option B" required value={newQuestionForm.option2} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option2: e.target.value })} className="flex-1 bg-[#dee2e8]/30 border border-[#c0cad8] rounded-lg px-2.5 py-1.5 text-xs text-[#485261]"/>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 2} onChange={() => setNewQuestionForm({ ...newQuestionForm, correctIndex: 2 })}/>
                  <input type="text" placeholder="Option C" required value={newQuestionForm.option3} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option3: e.target.value })} className="flex-1 bg-[#dee2e8]/30 border border-[#c0cad8] rounded-lg px-2.5 py-1.5 text-xs text-[#485261]"/>
                </div>
                <div className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={newQuestionForm.correctIndex === 3} onChange={() => setNewQuestionForm({ ...newQuestionForm, correctIndex: 3 })}/>
                  <input type="text" placeholder="Option D" required value={newQuestionForm.option4} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, option4: e.target.value })} className="flex-1 bg-[#dee2e8]/30 border border-[#c0cad8] rounded-lg px-2.5 py-1.5 text-xs text-[#485261]"/>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#485261] block mb-1">SOP Protocol Reference</label>
                <input type="text" value={newQuestionForm.moduleRef} onChange={(e) => setNewQuestionForm({ ...newQuestionForm, moduleRef: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261]"/>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#c0cad8]">
                <button type="button" onClick={() => setIsAddQuestionOpen(false)} className="px-4 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] font-bold">
                  {t.cancel}
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white font-bold cursor-pointer">
                  {t.addQuestion}
                </button>
              </div>
            </form>
          </div>
        </div>)}

    </div>);
};
