import React, { useState, useEffect, useRef } from 'react';
import { ViewType, Course, LessonItem, LessonNote, UserProfile } from '../../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  CheckCircle, 
  Lock, 
  Download, 
  FileText, 
  HelpCircle, 
  ArrowRight, 
  Layers,
  ChevronRight,
  Sparkles,
  BookOpen,
  Clock,
  Subtitles,
  Plus,
  Trash2,
  Share2,
  GraduationCap,
  ShieldCheck,
  Video,
  FileCheck,
  Award,
  ExternalLink,
  Edit3,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface VideoLessonViewProps {
  onNavigate: (view: ViewType) => void;
  initialCourseId?: string;
  courses: Course[];
  lessons: LessonItem[];
  onSelectCourseForQuiz?: (courseId: string) => void;
  user?: UserProfile;
}

export const VideoLessonView: React.FC<VideoLessonViewProps> = ({ 
  onNavigate,
  initialCourseId,
  courses,
  lessons,
  onSelectCourseForQuiz,
  user
}) => {
  const { t, isRTL, language } = useLanguage();
  
  // Selected course state (synced with initialCourseId)
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || courses[1]?.id || courses[0]?.id || "course-2"
  );

  useEffect(() => {
    if (initialCourseId && initialCourseId !== selectedCourseId) {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId]);

  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  
  // Lessons filtered by currently selected course
  const courseLessons = lessons.filter(l => l.moduleId === selectedCourseId);
  
  // Active lesson state
  const [currentLesson, setCurrentLesson] = useState<LessonItem>(
    courseLessons.find(l => l.status === 'Currently Playing') || courseLessons[0] || lessons[0]
  );

  // When course changes, pick its active or first lesson
  useEffect(() => {
    const active = courseLessons.find(l => l.status === 'Currently Playing') || courseLessons[0];
    if (active) {
      setCurrentLesson(active);
      setProgress(15);
    }
  }, [selectedCourseId, lessons]);

  // Video playback simulated state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25); // percentage (0 - 100)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  
  // Content tabs: Video, SOP Document, Presentation, Takeaways
  const [activeTab, setActiveTab] = useState<'video' | 'sop' | 'slides' | 'notes'>('video');

  // Interactive Personal Notes State (persisted to localStorage)
  const [notes, setNotes] = useState<LessonNote[]>(() => {
    try {
      const saved = localStorage.getItem(`notes_${currentLesson?.id}`);
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          timestamp: '02:15',
          content: isRTL ? 'ملاحظة هامة: يجب التحقق من تاريخ السحب ومطابقة رقم السجل الطبي للمريض قبل وضع الأنبوب في الطرد المركزي.' : 'Key rule: Must verify patient MRN against electronic LIMS before spinning.',
          createdAt: 'Just now'
        }
      ];
    } catch {
      return [];
    }
  });
  const [newNoteText, setNewNoteText] = useState('');

  // Simulation timer for video scrub bar
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleLessonSelect = (lesson: LessonItem) => {
    if (lesson.status === 'Locked') return;
    setCurrentLesson(lesson);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !currentLesson) return;
    const currentMins = Math.floor((progress / 100) * 12);
    const currentSecs = Math.floor(((progress / 100) * 12 * 60) % 60);
    const timeFormatted = `${String(currentMins).padStart(2, '0')}:${String(currentSecs).padStart(2, '0')}`;
    
    const newNote: LessonNote = {
      id: Date.now().toString(),
      timestamp: timeFormatted,
      content: newNoteText.trim(),
      createdAt: isRTL ? 'الآن' : 'Just now'
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setNewNoteText('');
    try {
      localStorage.setItem(`notes_${currentLesson.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = (id: string) => {
    if (!currentLesson) return;
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    try {
      localStorage.setItem(`notes_${currentLesson.id}`, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartExam = () => {
    if (onSelectCourseForQuiz) {
      onSelectCourseForQuiz(currentCourse.id);
    } else {
      onNavigate('quiz');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Clinical Course Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#006672] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
              {currentCourse.code} · Module 0{currentCourse.moduleNumber}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-600">
              {isRTL && currentCourse.categoryAr ? currentCourse.categoryAr : currentCourse.category}
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">
              ISO 15189:2022 Accredited
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isRTL && currentCourse.titleAr ? currentCourse.titleAr : currentCourse.title}
          </h1>

          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            {isRTL && currentCourse.descriptionAr ? currentCourse.descriptionAr : currentCourse.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentCourse.estMinutes} {t.mins}</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.passScoreRequired}: ≥ {currentCourse.passScore}%</span>
            </span>
            <span className="text-slate-300">·</span>
            <span className="flex items-center gap-1 font-mono">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>{currentCourse.cmeCredits || 3} CME Credits</span>
            </span>
            {currentCourse.instructor && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-600">
                  {isRTL ? `المحاضر: ${currentCourse.instructorAr || currentCourse.instructor}` : `Faculty: ${currentCourse.instructor}`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
          {/* Admin shortcut to edit content in Studio */}
          {(user?.role === 'system_admin' || user?.role === 'training_admin') && (
            <button
              onClick={() => onNavigate('system_admin')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#006672]" />
              <span>{isRTL ? 'تعديل المحتوى في الاستوديو' : 'Edit in Studio'}</span>
            </button>
          )}

          <button
            onClick={handleStartExam}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#006672] hover:bg-[#00525c] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span>{t.takeOnlineAssessment}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Course Switcher Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
          {isRTL ? 'التنقل بين المقررات:' : 'Switch Course Module:'}
        </span>
        {courses.map((c) => {
          const isSelected = c.id === selectedCourseId;
          const isCompleted = c.status === 'Completed';
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCourseId(c.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#006672] text-white shadow-xs'
                  : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono font-bold">{c.code}</span>
              {isCompleted && <span className="text-[10px]">✓</span>}
            </button>
          );
        })}
      </div>

      {/* 3. Main Player Grid: Media & Document Content on Left, Course Syllabus on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Content Stage (Video / SOP Document / Slides / Notes) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Content Mode Navigation Bar */}
          <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-[#006672] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{t.tabVideo}</span>
              </button>

              <button
                onClick={() => setActiveTab('sop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'sop'
                    ? 'bg-[#006672] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.tabSOPDocument}</span>
              </button>

              <button
                onClick={() => setActiveTab('slides')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'slides'
                    ? 'bg-[#006672] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t.tabPresentation}</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-[#006672] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t.tabNotes}</span>
                <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 rounded-full">
                  {notes.length}
                </span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-mono pr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Full HD 1080p</span>
            </div>
          </div>

          {/* TAB 1: VIDEO PLAYER */}
          {activeTab === 'video' && (
            <div className="space-y-4">
              
              {/* Responsive Video Screen Container */}
              <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex items-center justify-center group">
                
                {/* Visual Video Poster / Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 group-hover:scale-100 transition-transform duration-700"
                  style={{ backgroundImage: `url(${currentLesson?.videoUrl || currentCourse.imageUrl})` }}
                />

                {/* Clinical Watermark Overlay */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10 text-white text-[11px] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SHALABY CLINICAL LABS · {currentCourse.code}</span>
                </div>

                {/* Big Center Play / Pause Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="relative z-20 w-16 h-16 rounded-full bg-[#006672] hover:bg-[#00525c] text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7" />
                  ) : (
                    <Play className="w-7 h-7 translate-x-0.5" />
                  )}
                </button>

                {/* Lesson Title Watermark bottom */}
                <div className="absolute bottom-14 left-4 right-4 z-10 text-white drop-shadow-md">
                  <p className="text-[11px] font-mono text-teal-300">
                    STAGE {currentLesson?.stageNumber || '01'} · {currentLesson?.protocolId || currentCourse.code}
                  </p>
                  <h3 className="text-base font-bold truncate">
                    {isRTL && currentLesson?.titleAr ? currentLesson.titleAr : currentLesson?.title}
                  </h3>
                </div>

                {/* Player Bottom Control Bar */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 flex flex-col gap-1.5">
                  {/* Progress scrubber bar */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const newPct = Math.round((clickX / rect.width) * 100);
                      setProgress(Math.max(0, Math.min(100, newPct)));
                    }}
                    className="h-1.5 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group/bar"
                  >
                    <div 
                      className="h-full bg-[#006672] rounded-full relative"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)} 
                        className="hover:text-teal-300 cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button 
                        onClick={() => setIsMuted(!isMuted)} 
                        className="hover:text-teal-300 cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      <span className="font-mono text-[11px] text-white/80">
                        {String(Math.floor((progress / 100) * 14)).padStart(2, '0')}:
                        {String(Math.floor(((progress / 100) * 14 * 60) % 60)).padStart(2, '0')} / {currentLesson?.duration || '14:20'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Playback speed toggle */}
                      <button
                        onClick={() => {
                          const speeds = [1, 1.25, 1.5, 0.75];
                          const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                          setPlaybackSpeed(speeds[nextIdx]);
                        }}
                        className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 cursor-pointer"
                      >
                        {playbackSpeed}x
                      </button>

                      <button 
                        onClick={() => setShowSubtitles(!showSubtitles)}
                        className={`p-1 rounded cursor-pointer ${showSubtitles ? 'text-teal-300' : 'text-white/60'}`}
                        title="Subtitles"
                      >
                        <Subtitles className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Lesson Objectives & Description */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900">
                    {t.learningObjectives}
                  </h4>
                  <span className="text-[11px] font-mono text-[#006672] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                    {currentLesson?.protocolId || currentCourse.code}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(currentLesson?.learningObjectives || [
                    "Master clinical specimen handling under ISO 15189 regulations.",
                    "Demonstrate zero-contamination technique in laboratory benches."
                  ]).map((obj, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700 leading-snug">{obj}</span>
                    </div>
                  ))}
                </div>

                {/* Subtitle / Transcript section */}
                {currentLesson?.transcript && currentLesson.transcript.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-700 block">
                      {isRTL ? 'النص الإكلينيكي المكتوب (Transcript):' : 'Verified Clinical Transcript:'}
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {currentLesson.transcript.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs p-1.5 hover:bg-slate-50 rounded transition-colors">
                          <span className="font-mono text-[11px] text-[#006672] font-bold shrink-0">
                            {item.time}
                          </span>
                          <span className="text-slate-600">
                            {isRTL && item.textAr ? item.textAr : item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: CLINICAL SOP DOCUMENT READER */}
          {activeTab === 'sop' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
              
              {/* Document Official Header */}
              <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      OFFICIAL SOP MANUAL
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-slate-500">
                      Doc Ref: SOP-{currentCourse.code}-2024
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isRTL && currentCourse.titleAr ? currentCourse.titleAr : currentCourse.title} — Standard Operating Procedure
                  </h3>
                </div>

                <a
                  href="#download"
                  onClick={(e) => {
                    e.preventDefault();
                    window.print();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-all cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isRTL ? 'تحميل وطباعة الدليل (PDF)' : 'Download SOP (PDF)'}</span>
                </a>
              </div>

              {/* SOP Article Content */}
              <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-sans">
                
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    1. PURPOSE & CLINICAL SCOPE (الغرض ونطاق التطبيق)
                  </h4>
                  <p>
                    {isRTL 
                      ? `يهدف هذا الدليل القياسي إلى تحديد المتطلبات الإلزامية لمقرر ${currentCourse.titleAr} وفق أعلى معايير الجودة العالمية ISO 15189:2022 واعتماد CAP. يلتزم جميع أخصائيي المختبرات الجدد بتطبيق الخطوات الموضحة بدقة قبل استلام العمل المستقل.`
                      : `This SOP establishes mandatory clinical procedures for ${currentCourse.title} in accordance with ISO 15189:2022 accreditation. All clinical technologists must demonstrate documented mastery before performing independent patient diagnostics.`}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    2. MANDATORY PERSONAL PROTECTIVE EQUIPMENT (معدات الوقاية الإلزامية)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-2">
                    <li>Fluid-resistant laboratory coat (fastened fully at all times).</li>
                    <li>Nitrile examination gloves (changed immediately upon puncture or contamination).</li>
                    <li>Full eye protection / face shield during open tube manipulation and centrifugation un-capping.</li>
                    <li>Closed-toe non-permeable laboratory footwear.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    3. STEP-BY-STEP METHODOLOGY & BENCH EXECUTION (خطوات العمل التنفيذية)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-2">
                    <li>Verify two primary patient identifiers against electronic LIMS requisition.</li>
                    <li>Inspect specimen primary container for hemolysis, clotting, or micro-leaks.</li>
                    <li>Ensure dual-axis opposing tube balancing in clinical centrifuges prior to cycle start.</li>
                    <li>Record analytical run parameters and monitor control points on Levey-Jennings plots.</li>
                  </ol>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-amber-900">
                    4. QUALITY CONTROL & PASS CRITERIA (معايير القبول والرقابة)
                  </h4>
                  <p>
                    {isRTL 
                      ? `يشترط اجتياز الاختبار الإلكتروني بنسبة لا تقل عن ${currentCourse.passScore}% كشرط مسبق للحصول على الشهادة واعتماد الصلاحية التشغيلية.`
                      : `A minimum passing score of ${currentCourse.passScore}% is mandatory on the digital assessment to unlock the subsequent curriculum module.`}
                  </p>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: PRESENTATION SLIDES */}
          {activeTab === 'slides' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t.tabPresentation} — {currentCourse.code}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Accredited clinical summary slide deck
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#006672] bg-teal-50 px-2 py-0.5 rounded">
                  Slide 1 / 4
                </span>
              </div>

              <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-8 text-white flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between text-teal-300 font-mono text-xs">
                  <span>SHALABY CLINICAL LABS</span>
                  <span>ORIENTATION SLIDES</span>
                </div>

                <div className="space-y-2 text-center max-w-xl mx-auto">
                  <span className="font-mono text-xs text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800">
                    CORE PROTOCOL SUMMARY
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">
                    {isRTL && currentCourse.titleAr ? currentCourse.titleAr : currentCourse.title}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mandatory standards for quality accreditation, patient safety, and operational excellence under ISO 15189:2022.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Course Code: {currentCourse.code}</span>
                  <span>Pass Score: ≥ {currentCourse.passScore}%</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PERSONAL NOTES */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  {isRTL ? 'ملاحظاتي السريرية حول الدرس' : 'My Timestamped Clinical Notes'}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {notes.length} {isRTL ? 'ملاحظة' : 'notes'}
                </span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={isRTL ? 'اكتب ملاحظة مهنية حول هذا الدرس...' : 'Add a clinical note at current timestamp...'}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#006672]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006672] text-white text-xs font-bold rounded-xl hover:bg-[#00525c] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2">
                {notes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-[11px] font-bold text-[#006672] bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60 shrink-0">
                        {note.timestamp}
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {note.content}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Course Syllabus & Materials Playlist */}
        <div className="space-y-4">
          
          {/* Syllabus Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                {t.curriculumPlaylist}
              </h3>
              <span className="text-[11px] font-mono text-slate-500">
                {courseLessons.length} {isRTL ? 'محاضرات' : 'Lectures'}
              </span>
            </div>

            <div className="space-y-2.5">
              {courseLessons.map((les, index) => {
                const isCurrent = currentLesson?.id === les.id;
                return (
                  <div
                    key={les.id}
                    onClick={() => handleLessonSelect(les)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-teal-50/70 border-[#006672] shadow-2xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isCurrent 
                          ? 'bg-[#006672] text-white' 
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        0{index + 1}
                      </div>

                      <div className="min-w-0">
                        <h4 className={`text-xs font-bold truncate ${isCurrent ? 'text-[#006672]' : 'text-slate-900'}`}>
                          {isRTL && les.titleAr ? les.titleAr : les.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">
                          {les.duration} · {les.protocolId || currentCourse.code}
                        </span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-[#006672] bg-teal-100 px-2 py-0.5 rounded-full shrink-0">
                        {t.playing}
                      </span>
                    ) : (
                      <Play className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Attached SOP documents list in sidebar */}
            {currentCourse.materials && currentCourse.materials.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  {isRTL ? 'المستندات وأدلة العمل المرفقة:' : 'Attached Manuals & SOPs:'}
                </span>
                <div className="space-y-1.5">
                  {currentCourse.materials.map(mat => (
                    <div 
                      key={mat.id}
                      onClick={() => setActiveTab('sop')}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between gap-2 text-xs cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate text-slate-800 font-semibold">
                          {isRTL && mat.titleAr ? mat.titleAr : mat.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">
                        {mat.durationOrPages}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ready for Assessment CTA */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-[#006672]">
                  {isRTL ? 'جاهز للاختبار التقييمي؟' : 'Ready for Knowledge Check?'}
                </p>
                <p className="text-[11px] text-slate-600">
                  {isRTL 
                    ? `يتكون الاختبار من 4 أسئلة بدرجة نجاح لا تقل عن ${currentCourse.passScore}%.` 
                    : `The exam contains 4 questions. Required passing score is ≥ ${currentCourse.passScore}%.`}
                </p>
              </div>

              <button
                onClick={handleStartExam}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#006672] hover:bg-[#00525c] text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span>{t.takeOnlineAssessment}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
