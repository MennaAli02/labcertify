import React, { useState, useEffect } from 'react';
import { ViewType, UserProfile, Course, AuditLogEntry, LessonItem, QuizQuestion } from './types';
import { 
  initialUserProfile, 
  mockPersonas,
  mockSequentialCourses, 
  mockAuditTrailLogs,
  mockOfficialCertificates,
  mockLessons,
  mockQuestionBank
} from './data/mockData';

// Top & Side Navigation
import { TopNavBar } from './components/Navigation/TopNavBar';
import { SideNavBar } from './components/Navigation/SideNavBar';

// Modals
import { NotificationsModal } from './components/Modals/NotificationsModal';
import { SupportModal } from './components/Modals/SupportModal';
import { SearchModal } from './components/Modals/SearchModal';

// Views
import { TraineeDashboardView } from './components/Views/TraineeDashboardView';
import { TrainingAdminDashboardView } from './components/Views/TrainingAdminDashboardView';
import { SystemAdminDashboardView } from './components/Views/SystemAdminDashboardView';
import { VideoLessonView } from './components/Views/VideoLessonView';
import { QuizAssessmentView } from './components/Views/QuizAssessmentView';
import { PerformanceTrackerView } from './components/Views/PerformanceTrackerView';
import { CertificateView } from './components/Views/CertificateView';
import { LeadershipPathView } from './components/Views/LeadershipPathView';
import { CoachingModuleView } from './components/Views/CoachingModuleView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('trainee_dashboard');
  const [user, setUser] = useState<UserProfile>(mockPersonas.trainee);

  // Centralized Courses State (persisted to localStorage)
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('shalaby_courses_v3');
      return saved ? JSON.parse(saved) : mockSequentialCourses;
    } catch {
      return mockSequentialCourses;
    }
  });

  // Centralized Lessons State (persisted to localStorage)
  const [lessons, setLessons] = useState<LessonItem[]>(() => {
    try {
      const saved = localStorage.getItem('shalaby_lessons_v3');
      return saved ? JSON.parse(saved) : mockLessons;
    } catch {
      return mockLessons;
    }
  });

  // Centralized Questions State (persisted to localStorage)
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('shalaby_questions_v3');
      return saved ? JSON.parse(saved) : mockQuestionBank;
    } catch {
      return mockQuestionBank;
    }
  });

  // Rule: Strict sequential enforcement toggle (ON by default)
  const [sequentialEnforced, setSequentialEnforced] = useState<boolean>(true);

  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[1] || courses[0]);
  const [selectedCertificateCourseId, setSelectedCertificateCourseId] = useState<string>("course-1");
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(mockAuditTrailLogs);

  // Modals state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Save courses when updated
  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => {
      const updated = prev.map(c => c.id === updatedCourse.id ? updatedCourse : c);
      try {
        localStorage.setItem('shalaby_courses_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });

    if (selectedCourse.id === updatedCourse.id) {
      setSelectedCourse(updatedCourse);
    }
  };

  // Add video lesson to course
  const handleAddLesson = (newLesson: LessonItem) => {
    setLessons(prev => {
      const updated = [newLesson, ...prev];
      try {
        localStorage.setItem('shalaby_lessons_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Update existing video lesson
  const handleUpdateLesson = (updatedLesson: LessonItem) => {
    setLessons(prev => {
      const updated = prev.map(l => l.id === updatedLesson.id ? updatedLesson : l);
      try {
        localStorage.setItem('shalaby_lessons_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Delete video lesson
  const handleDeleteLesson = (lessonId: string) => {
    setLessons(prev => {
      const updated = prev.filter(l => l.id !== lessonId);
      try {
        localStorage.setItem('shalaby_lessons_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Add question to question bank
  const handleAddQuestion = (newQuestion: QuizQuestion) => {
    setQuestions(prev => {
      const updated = [newQuestion, ...prev];
      try {
        localStorage.setItem('shalaby_questions_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Delete question from question bank
  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(prev => {
      const updated = prev.filter(q => q.id !== questionId);
      try {
        localStorage.setItem('shalaby_questions_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const completedCoursesCount = courses.filter(c => c.status === 'Completed').length;

  // Add audit trail entry
  const handleAddAuditLog = (
    action: string, 
    actionAr: string, 
    details: string, 
    detailsAr: string, 
    target: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      userId: user.employeeId,
      userName: user.name,
      userRole: user.role === 'training_admin' ? 'Training Admin' : user.role === 'system_admin' ? 'System Admin' : 'Trainee',
      action,
      actionAr,
      details,
      detailsAr,
      target,
      ipAddress: "192.168.1.105",
      status: action.includes("Failed") || action.includes("Warning") ? "Warning" : action.includes("Blocked") ? "Security Alert" : "Success"
    };

    setAuditLogs(prev => [newEntry, ...prev]);
  };

  // PASS COURSE LOGIC (Linear, conflict-free rule engine):
  // 1. Mark current course as Completed with 100% progress
  // 2. Unlock the immediate next sequential course if sequentialEnforced is true
  // 3. Issue certificate and update user orientation progress
  const handlePassCourse = (courseId: string, score: number) => {
    setCourses(prevCourses => {
      const courseIndex = prevCourses.findIndex(c => c.id === courseId);
      if (courseIndex === -1) return prevCourses;

      const updated = prevCourses.map((c, idx) => {
        if (c.id === courseId) {
          return {
            ...c,
            status: 'Completed' as const,
            progress: 100
          };
        }
        // Unlock next course in sequential line if locked
        if (idx === courseIndex + 1 && (c.status === 'Locked' || !sequentialEnforced)) {
          return {
            ...c,
            status: 'In Progress' as const,
            progress: 15
          };
        }
        return c;
      });

      try {
        localStorage.setItem('shalaby_courses_v3', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Update user progress
      const completedNow = updated.filter(c => c.status === 'Completed').length;
      const pct = Math.round((completedNow / updated.length) * 100);
      setUser(prev => ({
        ...prev,
        overallProgress: pct,
        phase: `Course ${courseIndex + 2} Unlocked`
      }));

      return updated;
    });

    setSelectedCertificateCourseId(courseId);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
      case 'trainee_dashboard':
        return (
          <TraineeDashboardView
            user={user}
            courses={courses}
            onNavigate={setCurrentView}
            onSelectCourse={(c) => {
              setSelectedCourse(c);
            }}
            onSelectQuizCourse={(c) => {
              setSelectedCourse(c);
            }}
            onViewCertificate={(courseId) => {
              setSelectedCertificateCourseId(courseId);
            }}
          />
        );
      case 'training_admin':
        return (
          <TrainingAdminDashboardView
            onNavigate={setCurrentView}
            onViewCertificate={(courseId) => {
              setSelectedCertificateCourseId(courseId);
            }}
            onAddAuditLog={handleAddAuditLog}
          />
        );
      case 'system_admin':
        return (
          <SystemAdminDashboardView
            onNavigate={setCurrentView}
            auditLogs={auditLogs}
            onAddAuditLog={handleAddAuditLog}
            courses={courses}
            onUpdateCourse={handleUpdateCourse}
            lessons={lessons}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLesson}
            onDeleteLesson={handleDeleteLesson}
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            sequentialEnforced={sequentialEnforced}
            onToggleSequentialEnforced={setSequentialEnforced}
          />
        );
      case 'video_lesson':
      case 'course_player':
        return (
          <VideoLessonView 
            onNavigate={setCurrentView}
            initialCourseId={selectedCourse.id}
            courses={courses}
            lessons={lessons}
            user={user}
            onSelectCourseForQuiz={(courseId) => {
              const crs = courses.find(c => c.id === courseId);
              if (crs) setSelectedCourse(crs);
              setCurrentView('quiz');
            }}
          />
        );
      case 'quiz':
        return (
          <QuizAssessmentView 
            onNavigate={setCurrentView}
            selectedCourseId={selectedCourse.id}
            courses={courses}
            questions={questions}
            onPassCourse={handlePassCourse}
            onViewCertificate={(courseId) => {
              setSelectedCertificateCourseId(courseId);
            }}
            onAddAuditLog={handleAddAuditLog}
          />
        );
      case 'performance':
      case 'resources':
        return (
          <PerformanceTrackerView 
            user={user} 
            onNavigate={setCurrentView} 
          />
        );
      case 'certificate':
        return (
          <CertificateView 
            user={user} 
            onNavigate={setCurrentView}
            selectedCourseId={selectedCertificateCourseId}
          />
        );
      case 'leadership_path':
        return <LeadershipPathView onNavigate={setCurrentView} />;
      case 'coaching':
        return <CoachingModuleView onNavigate={setCurrentView} />;
      default:
        return (
          <TraineeDashboardView
            user={user}
            courses={courses}
            onNavigate={setCurrentView}
            onSelectCourse={setSelectedCourse}
          />
        );
    }
  };

  return (
    <div className="h-screen w-full max-w-full overflow-x-hidden overflow-y-hidden bg-[#dee2e8] text-[#485261] flex flex-col selection:bg-[#6bbada]/30 selection:text-[#0b96c7] transition-colors duration-200">
      
      {/* Top Header Bar */}
      <TopNavBar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onChangeUser={setUser}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
        unreadCount={2}
      />

      {/* Main Container Layout — spans full width without horizontal overflow */}
      <div className="flex-1 flex w-full max-w-full overflow-hidden min-w-0">
        
        {/* Navigation Sidebar with Collapsed/Expanded Rail Mode */}
        <SideNavBar
          currentView={currentView}
          onNavigate={setCurrentView}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          completedModulesCount={completedCoursesCount}
          totalModulesCount={courses.length}
          user={user}
          isOpen={isSidebarOpen}
          onToggleCollapse={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Dynamic View Content Area — expands to fit all screen when sidebar collapsed */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-full min-w-0 overflow-y-auto overflow-x-hidden">
          {renderView()}
        </main>

      </div>

      {/* Interactive Global Modals */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={setCurrentView}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentView}
        onSelectModule={setSelectedCourse}
      />

    </div>
  );
}
