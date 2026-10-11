import React, { useState, useEffect } from 'react';
import { ViewType, Course, AuditLogEntry, QuizQuestion } from '../../types';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Lightbulb, 
  RotateCcw, 
  Award,
  BookOpen,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface QuizAssessmentViewProps {
  onNavigate: (view: ViewType) => void;
  selectedCourseId?: string;
  courses: Course[];
  questions: QuizQuestion[];
  onPassCourse?: (courseId: string, score: number) => void;
  onViewCertificate?: (courseId: string) => void;
  onAddAuditLog?: (action: string, actionAr: string, details: string, detailsAr: string, target: string) => void;
}

export const QuizAssessmentView: React.FC<QuizAssessmentViewProps> = ({ 
  onNavigate,
  selectedCourseId: initialCourseId,
  courses,
  questions: allQuestions,
  onPassCourse,
  onViewCertificate,
  onAddAuditLog,
}) => {
  const { t, isRTL } = useLanguage();
  
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || courses[1]?.id || courses[0]?.id || "course-2"
  );

  useEffect(() => {
    if (initialCourseId && initialCourseId !== selectedCourseId) {
      setSelectedCourseId(initialCourseId);
      // Reset quiz for new course
      setCurrentQuestionIndex(0);
      setAnswers({});
      setSubmittedQuestions({});
      setQuizFinished(false);
      setAttemptsUsed(1);
      setSecondsRemaining(600);
    }
  }, [initialCourseId]);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Questions filtered by active course or fall back to questions pool
  const courseQuestions = allQuestions.filter(q => q.courseId === selectedCourseId);
  const questions = courseQuestions.length > 0 ? courseQuestions : allQuestions.slice(0, 4);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Track user answers by question index: { [questionIdx]: selectedOptionIdx }
  const [answers, setAnswers] = useState<Record<number, number>>({});
  // Track whether an answer was formally checked on that step
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});

  const [quizFinished, setQuizFinished] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes clinical exam timer
  
  const maxAttempts = activeCourse.allowedAttempts || 3;
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const selectedOption = answers[currentQuestionIndex] !== undefined ? answers[currentQuestionIndex] : null;
  const isCurrentSubmitted = Boolean(submittedQuestions[currentQuestionIndex]);

  // Timer countdown
  useEffect(() => {
    if (quizFinished) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [quizFinished]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (idx: number) => {
    if (isCurrentSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: idx
    }));
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setSubmittedQuestions(prev => ({
      ...prev,
      [currentQuestionIndex]: true
    }));
  };

  // Calculate final score cleanly and without ambiguity
  const calculateFinalScore = (answersMap: Record<number, number>) => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answersMap[idx] === q.correctIndex) {
        correct++;
      }
    });
    const pct = Math.round((correct / questions.length) * 100);
    return { correct, pct };
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Final submission of the assessment
      const { correct, pct } = calculateFinalScore(answers);
      setQuizFinished(true);

      const passThreshold = activeCourse.passScore || 80;
      const passed = pct >= passThreshold;

      if (passed && onPassCourse) {
        onPassCourse(activeCourse.id, pct);
      }

      if (onAddAuditLog) {
        onAddAuditLog(
          passed ? "Assessment Passed" : "Assessment Failed",
          passed ? "اجتياز الاختبار بنجاح" : "عدم اجتياز الاختبار",
          `Score: ${pct}% (${correct}/${questions.length}) on ${activeCourse.code} (${activeCourse.title}). Attempt: ${attemptsUsed}/${maxAttempts}.`,
          `الدرجة: ${pct}% في اختبار ${activeCourse.code}. المحاولة: ${attemptsUsed}/${maxAttempts}.`,
          `Assessment: ${activeCourse.code}`
        );
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleRestartQuiz = () => {
    if (attemptsUsed >= maxAttempts) return;
    setAttemptsUsed(attemptsUsed + 1);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmittedQuestions({});
    setQuizFinished(false);
    setSecondsRemaining(600);
  };

  const handleAdminResetAttempts = () => {
    setAttemptsUsed(1);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSubmittedQuestions({});
    setQuizFinished(false);
    setSecondsRemaining(600);
    if (onAddAuditLog) {
      onAddAuditLog(
        "Attempts Reset by Admin",
        "إعادة تصفير محاولات الاختبار من المشرف",
        `Reset attempt limit for ${activeCourse.code} to allow trainee retake.`,
        `تم إعادة تصفير المحاولات للكورس ${activeCourse.code} للسماح للمتدرب بإعادة الاختبار.`,
        `Course: ${activeCourse.code}`
      );
    }
  };

  // FINISHED ASSESSMENT SCREEN
  if (quizFinished) {
    const { correct, pct } = calculateFinalScore(answers);
    const passingThreshold = activeCourse.passScore || 80;
    const passed = pct >= passingThreshold;
    const attemptsRemaining = maxAttempts - attemptsUsed;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200 py-6 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto shadow-xs ${
            passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <div className="space-y-1.5">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              passed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {passed ? t.assessmentPassed : t.assessmentFailed}
            </span>

            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {isRTL && activeCourse.titleAr ? activeCourse.titleAr : activeCourse.title}
            </h2>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {passed 
                ? (isRTL ? 'تهانينا! تم تسجيل نتيجتك رسمياً في سجل التدريب، إصدار الشهادة المعتمدة، وفتح المقرر التالي في مسار التوجيه الإلزامي.' : 'Congratulations! Your score has been verified in the central registry, your accredited certificate issued, and the next sequential course unlocked.')
                : (isRTL ? `نسبة النجاح المطلوبة هي ${passingThreshold}% على الأقل. يرجى مراجعة دليل إجراءات العمل SOP قبل إعادة المحاولة.` : `Passing threshold is at least ${passingThreshold}%. Review the course SOP before attempting again.`)
              }
            </p>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">{t.finalScore}</span>
              <span className={`font-mono text-xl font-black tabular-nums ${passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                {pct}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t.passScoreRequired}</span>
              <span className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                ≥ {passingThreshold}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">{t.attemptsUsedLabel}</span>
              <span className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                {attemptsUsed} / {maxAttempts}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {passed ? (
              <>
                <button
                  onClick={() => {
                    if (onViewCertificate) onViewCertificate(activeCourse.id);
                    onNavigate('certificate');
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>{t.viewCertificate}</span>
                </button>

                <button
                  onClick={() => onNavigate('trainee_dashboard')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B96C7] hover:bg-[#087fa8] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <span>{isRTL ? 'متابعة مسار التوجيه التالي' : 'Continue Next Module'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </>
            ) : (
              <>
                {attemptsRemaining > 0 ? (
                  <button
                    onClick={handleRestartQuiz}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B96C7] hover:bg-[#087fa8] text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.retakeQuiz} ({attemptsRemaining} {t.attemptsLeft})</span>
                  </button>
                ) : (
                  <div className="space-y-3 w-full">
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                      <p className="font-bold">{t.attemptsExhausted}</p>
                      <p className="text-[11px] mt-0.5">{t.attemptsExhaustedDesc}</p>
                    </div>

                    {/* Admin Instant Reset Action */}
                    <button
                      onClick={handleAdminResetAttempts}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-300 transition-all cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5 text-[#0B96C7]" />
                      <span>{t.resetAttempts}</span>
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onNavigate('video_lesson')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#0B96C7]" />
                  <span>{isRTL ? 'مراجعة فيديوهات وكتيبات الـ SOP' : 'Review Videos & SOP Manual'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE QUESTION SCREEN
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Examination Status Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('video_lesson')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Back to Course Content"
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                {activeCourse.code}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-bold text-slate-900 truncate max-w-xs">
                {isRTL && activeCourse.titleAr ? activeCourse.titleAr : activeCourse.title}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Attempts badge */}
          <div className="flex items-center gap-1.5 font-mono text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
            <span>{t.attemptsUsedLabel}:</span>
            <span className="font-bold text-slate-900">{attemptsUsed}/{maxAttempts}</span>
          </div>

          {/* Exam timer badge */}
          <div className="flex items-center gap-1.5 font-mono text-[#0B96C7] bg-[#dee2e8] px-3 py-1 rounded-lg border border-[#c0cad8]/60 font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Question Progress Indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>{t.questionOf} {currentQuestionIndex + 1} / {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0B96C7] rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Examination Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        
        {/* Question Header & Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
              QUESTION 0{currentQuestionIndex + 1} · {currentQ.difficulty || 'Intermediate'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Ref: {currentQ.moduleRef}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed pt-1">
            {isRTL && currentQ.questionAr ? currentQ.questionAr : currentQ.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQ.correctIndex;
            const showValidation = isCurrentSubmitted;

            let cardStyle = "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800";

            if (showValidation) {
              if (isCorrect) {
                cardStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold ring-1 ring-emerald-500";
              } else if (isSelected && !isCorrect) {
                cardStyle = "bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-500";
              } else {
                cardStyle = "bg-slate-50/50 border-slate-200 opacity-60 text-slate-500";
              }
            } else if (isSelected) {
              cardStyle = "bg-[#dee2e8]/60 border-[#0B96C7] text-[#0B96C7] font-semibold ring-1 ring-[#0B96C7]/30 shadow-xs";
            }

            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${cardStyle}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  showValidation && isCorrect
                    ? 'bg-emerald-600 text-white'
                    : showValidation && isSelected && !isCorrect
                      ? 'bg-rose-600 text-white'
                      : isSelected
                        ? 'bg-[#0B96C7] text-white'
                        : 'bg-slate-100 text-slate-600'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>

                <div className="flex-1 min-w-0 pt-0.5 leading-snug">
                  {isRTL && currentQ.optionsAr?.[idx] ? currentQ.optionsAr[idx] : option}
                </div>

                {showValidation && (
                  <div className="shrink-0 pt-0.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isSelected ? (
                      <XCircle className="w-5 h-5 text-rose-600" />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Study Hint / Explanation Box */}
        {isCurrentSubmitted && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-700 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 font-bold text-[#0B96C7]">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{isRTL ? 'الشرح والتوثيق المعتمد:' : 'Clinical Explanation & Rationale:'}</span>
            </div>
            <p className="leading-relaxed">
              {isRTL && currentQ.explanationAr ? currentQ.explanationAr : currentQ.explanation}
            </p>
          </div>
        )}

        {/* Bottom Navigation Toolbar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition-all ${
              currentQuestionIndex === 0 
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-50' 
                : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            <span>{t.previousQuestion}</span>
          </button>

          <div className="flex items-center gap-2">
            {!isCurrentSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedOption === null
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer'
                }`}
              >
                {t.submitAnswer}
              </button>
            ) : null}

            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all ${
                selectedOption === null
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#0B96C7] hover:bg-[#087fa8] text-white cursor-pointer active:scale-95'
              }`}
            >
              <span>{currentQuestionIndex === questions.length - 1 ? (isRTL ? 'إنهاء وتصحيح الاختبار' : 'Finish & Grade Exam') : t.nextQuestion}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
