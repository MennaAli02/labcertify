import React, { useState, useEffect } from 'react';
import { mockPersonas, mockSequentialCourses, mockAuditTrailLogs, mockLessons, mockQuestionBank } from './data/mockData';
import { labCertifyApi } from './services/api';

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
import { RoleSelectionView } from './components/Views/RoleSelectionView';
import { LoginView } from './components/Views/LoginView';

export default function App() {
    const [currentView, setCurrentView] = useState('role_select');
    const [user, setUser] = useState(mockPersonas.trainee);
    const [loginError, setLoginError] = useState(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // Centralized Courses State (persisted to localStorage & synced with Odoo)
    const [courses, setCourses] = useState(() => {
        try {
            const saved = localStorage.getItem('shalaby_courses_v3');
            return saved ? JSON.parse(saved) : mockSequentialCourses;
        }
        catch {
            return mockSequentialCourses;
        }
    });

    // Centralized Lessons State (persisted to localStorage & synced with Odoo)
    const [lessons, setLessons] = useState(() => {
        try {
            const saved = localStorage.getItem('shalaby_lessons_v3');
            return saved ? JSON.parse(saved) : mockLessons;
        }
        catch {
            return mockLessons;
        }
    });

    // Centralized Questions State (persisted to localStorage & synced with Odoo)
    const [questions, setQuestions] = useState(() => {
        try {
            const saved = localStorage.getItem('shalaby_questions_v3');
            return saved ? JSON.parse(saved) : mockQuestionBank;
        }
        catch {
            return mockQuestionBank;
        }
    });

    // Rule: Strict sequential enforcement toggle (ON by default)
    const [sequentialEnforced, setSequentialEnforced] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(courses[1] || courses[0]);
    const [selectedCertificateCourseId, setSelectedCertificateCourseId] = useState("course-1");
    const [auditLogs, setAuditLogs] = useState(mockAuditTrailLogs);

    // Modals state
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Initial Data Sync with Odoo 19 Backend — called after successful login
    const syncFromBackend = async (loggedInUser) => {
        const uid = loggedInUser?.employeeId || loggedInUser?.id || null;
        const role = loggedInUser?.role || 'trainee';
        try {
            const [liveCourses, liveLessons, liveQuestions, liveLogs, liveSettings] = await Promise.all([
                labCertifyApi.getCourses(uid).catch(() => null),
                labCertifyApi.getLessons().catch(() => null),
                labCertifyApi.getQuestions().catch(() => null),
                labCertifyApi.getAuditLogs().catch(() => null),
                labCertifyApi.getSettings().catch(() => null),
            ]);

            if (liveCourses && Array.isArray(liveCourses) && liveCourses.length > 0) {
                setCourses(liveCourses);
                setSelectedCourse(prev => liveCourses.find(c => c.id === prev?.id) || liveCourses[1] || liveCourses[0]);
            }
            if (liveLessons && Array.isArray(liveLessons) && liveLessons.length > 0) {
                setLessons(liveLessons);
            }
            if (liveQuestions && Array.isArray(liveQuestions) && liveQuestions.length > 0) {
                setQuestions(liveQuestions);
            }
            if (liveLogs && Array.isArray(liveLogs) && liveLogs.length > 0) {
                setAuditLogs(liveLogs);
            }
            if (liveSettings && typeof liveSettings.sequentialEnforced === 'boolean') {
                setSequentialEnforced(liveSettings.sequentialEnforced);
            }
        } catch (err) {
            console.warn('[LabCertify] Backend sync error, continuing with local storage:', err);
        }
    };

    // Initial seed on mount (anonymous — no user-scoped data yet)
    useEffect(() => {
        let isMounted = true;
        async function seedInitialData() {
            try {
                const [liveCourses, liveLessons, liveQuestions, liveLogs, liveSettings] = await Promise.all([
                    labCertifyApi.getCourses().catch(() => null),
                    labCertifyApi.getLessons().catch(() => null),
                    labCertifyApi.getQuestions().catch(() => null),
                    labCertifyApi.getAuditLogs().catch(() => null),
                    labCertifyApi.getSettings().catch(() => null),
                ]);

                if (!isMounted) return;

                if (liveCourses && Array.isArray(liveCourses) && liveCourses.length > 0) {
                    setCourses(liveCourses);
                    setSelectedCourse(prev => liveCourses.find(c => c.id === prev?.id) || liveCourses[1] || liveCourses[0]);
                }
                if (liveLessons && Array.isArray(liveLessons) && liveLessons.length > 0) {
                    setLessons(liveLessons);
                }
                if (liveQuestions && Array.isArray(liveQuestions) && liveQuestions.length > 0) {
                    setQuestions(liveQuestions);
                }
                if (liveLogs && Array.isArray(liveLogs) && liveLogs.length > 0) {
                    setAuditLogs(liveLogs);
                }
                if (liveSettings && typeof liveSettings.sequentialEnforced === 'boolean') {
                    setSequentialEnforced(liveSettings.sequentialEnforced);
                }
            } catch (err) {
                console.warn('[LabCertify] Backend seed error, continuing with local storage:', err);
            }
        }

        seedInitialData();
        return () => { isMounted = false; };
    }, []);

    // Save courses when updated & sync to Odoo
    const handleUpdateCourse = (updatedCourse) => {
        setCourses(prev => {
            const updated = prev.map(c => c.id === updatedCourse.id ? updatedCourse : c);
            try {
                localStorage.setItem('shalaby_courses_v3', JSON.stringify(updated));
            }
            catch (e) {
                console.error(e);
            }
            return updated;
        });
        if (selectedCourse.id === updatedCourse.id) {
            setSelectedCourse(updatedCourse);
        }
        labCertifyApi.updateCourse(updatedCourse.id, updatedCourse).catch(err => {
            console.warn('[LabCertify] Backend course update failed:', err);
        });
    };

    // Add video lesson to course & sync to Odoo
    const handleAddLesson = (newLesson) => {
        setLessons(prev => {
            const updated = [newLesson, ...prev];
            try {
                localStorage.setItem('shalaby_lessons_v3', JSON.stringify(updated));
            }
            catch (e) {
                console.error(e);
            }
            return updated;
        });
        labCertifyApi.createLesson(newLesson).catch(err => {
            console.warn('[LabCertify] Backend create lesson failed:', err);
        });
    };

    // Update existing video lesson & sync to Odoo
    const handleUpdateLesson = (updatedLesson) => {
        setLessons(prev => {
            const updated = prev.map(l => l.id === updatedLesson.id ? updatedLesson : l);
            try {
                localStorage.setItem('shalaby_lessons_v3', JSON.stringify(updated));
            }
            catch (e) {
                console.error(e);
            }
            return updated;
        });
        labCertifyApi.updateLesson(updatedLesson.id, updatedLesson).catch(err => {
            console.warn('[LabCertify] Backend update lesson failed:', err);
        });
    };

    // Delete video lesson & sync to Odoo
    const handleDeleteLesson = (lessonId) => {
        setLessons(prev => {
            const updated = prev.filter(l => l.id !== lessonId);
            try {
                localStorage.setItem('shalaby_lessons_v3', JSON.stringify(updated));
            }
            catch (e) {
                console.error(e);
            }
            return updated;
        });
        labCertifyApi.deleteLesson(lessonId).catch(err => {
            console.warn('[LabCertify] Backend delete lesson failed:', err);
        });
    };

    // Add question to question bank & sync to Odoo
    const handleAddQuestion = (newQuestion) => {
        setQuestions(prev => {
            const updated = [newQuestion, ...prev];
            try {
                localStorage.setItem('shalaby_questions_v3', JSON.stringify(updated));
            }
            catch (e) {
                console.error(e);
            }
            return updated;
        });
        labCertifyApi.createQuestion(newQuestion).catch(err => {
            console.warn('[LabCertify] Backend create question failed:', err);
        });
    };

    // Delete question from question bank & sync to Odoo
    const handleDeleteQuestion = (questionId) => {
        setQuestions(prev => {
            const updated = prev.filter(q => q.id !== questionId);
            try {
                localStorage.setItem('shalaby_questions_v3', JSON.stringify(updated));
            }
            catch (e) {
                console.error(e);
            }
            return updated;
        });
        labCertifyApi.deleteQuestion(questionId).catch(err => {
            console.warn('[LabCertify] Backend delete question failed:', err);
        });
    };

    const completedCoursesCount = courses.filter(c => c.status === 'Completed').length;

    /**
     * Shared login handler used by both RenderView and the early-return block.
     * Rules:
     *   - If backend returns 401 / auth error  → show error, DO NOT navigate (no mock fallback)
     *   - If backend unreachable (network error) → fall back to mockPersonas so demo works offline
     *   - If backend succeeds                   → use real user, sync data, navigate
     */
    const handleLogin = async (role, emailOrUser, password) => {
        const targetRole = role || 'trainee';
        setIsLoggingIn(true);
        setLoginError(null);
        try {
            // Real backend authentication
            const result = await labCertifyApi.login(emailOrUser, password, targetRole);
            // Backend responded with success
            const backendUser = result.user;
            setUser(backendUser);
            syncFromBackend(backendUser); // fire-and-forget refresh
            setIsLoggingIn(false);
            if (backendUser.role === 'training_admin') {
                setCurrentView('training_admin');
            } else if (backendUser.role === 'system_admin') {
                setCurrentView('system_admin');
            } else {
                setCurrentView('trainee_dashboard');
            }
        } catch (err) {
            setIsLoggingIn(false);
            const status = err.status || 0;
            const isAuthError = status === 401 || status === 403;
            const isBackendReachable = status !== 0; // status=0 means network/fetch error

            if (isAuthError) {
                // Backend is up but credentials are wrong — block login, show error
                setLoginError(err.message || 'Invalid credentials. Please check your email and password.');
                console.warn('[LabCertify] Auth rejected by backend:', err.message);
            } else if (isBackendReachable) {
                // Backend returned a non-auth error (500 etc.) — show generic error
                setLoginError('Login service unavailable. Please try again.');
                console.warn('[LabCertify] Backend login error:', err);
            } else {
                // Network error — backend is unreachable, validate strictly against the 3 authorized accounts
                console.warn('[LabCertify] Backend unreachable, checking offline authentication:', err);
                const inputClean = (emailOrUser || '').trim().toLowerCase();
                const matchedPersona = Object.values(mockPersonas).find(p => 
                    p.email?.toLowerCase() === inputClean || 
                    p.employeeId?.toLowerCase() === inputClean ||
                    p.id?.toLowerCase() === inputClean
                );

                if (!matchedPersona) {
                    setLoginError('Account not found. Access is restricted to authorized personnel.');
                    return;
                }

                if (matchedPersona.role !== targetRole) {
                    const roleNames = {
                        trainee: 'Trainee',
                        training_admin: 'Training Admin',
                        system_admin: 'System Admin'
                    };
                    setLoginError(`Role mismatch: This account is registered as ${roleNames[matchedPersona.role] || matchedPersona.role}, not ${roleNames[targetRole] || targetRole}.`);
                    return;
                }

                const validPasswords = ['clinical2024'];
                if (matchedPersona.role === 'training_admin' || matchedPersona.role === 'system_admin') {
                    validPasswords.push('admin');
                }

                if (!validPasswords.includes((password || '').trim())) {
                    setLoginError('Invalid password. Please check your credentials.');
                    return;
                }

                setUser(matchedPersona);
                if (matchedPersona.role === 'training_admin') {
                    setCurrentView('training_admin');
                } else if (matchedPersona.role === 'system_admin') {
                    setCurrentView('system_admin');
                } else {
                    setCurrentView('trainee_dashboard');
                }
            }
        }
    };

    // Add audit trail entry & sync to Odoo
    const handleAddAuditLog = (action, actionAr, details, detailsAr, target) => {
        const newEntry = {
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
        labCertifyApi.addAuditLog(newEntry).catch(err => {
            console.warn('[LabCertify] Backend audit log sync failed:', err);
        });
    };

    // PASS COURSE LOGIC:
    // 1. Mark current course as Completed with 100% progress
    // 2. Unlock the immediate next sequential course if sequentialEnforced is true
    // 3. Issue certificate and update user orientation progress
    // 4. Sync status with Odoo backend
    const handlePassCourse = (courseId, score) => {
        setCourses(prevCourses => {
            const courseIndex = prevCourses.findIndex(c => c.id === courseId);
            if (courseIndex === -1)
                return prevCourses;
            const updated = prevCourses.map((c, idx) => {
                if (c.id === courseId) {
                    return {
                        ...c,
                        status: 'Completed',
                        progress: 100
                    };
                }
                // Unlock next course in sequential line if locked
                if (idx === courseIndex + 1 && (c.status === 'Locked' || !sequentialEnforced)) {
                    return {
                        ...c,
                        status: 'In Progress',
                        progress: 15
                    };
                }
                return c;
            });
            try {
                localStorage.setItem('shalaby_courses_v3', JSON.stringify(updated));
            }
            catch (e) {
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

        labCertifyApi.passCourse(courseId, score, user.id).catch(err => {
            console.warn('[LabCertify] Backend passCourse sync failed:', err);
        });
    };

    const handleToggleSequential = (enabled) => {
        setSequentialEnforced(enabled);
        labCertifyApi.updateSettings({ sequentialEnforced: enabled }).catch(err => {
            console.warn('[LabCertify] Backend update settings failed:', err);
        });
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
            case 'trainee_dashboard':
                return (<TraineeDashboardView user={user} courses={courses} onNavigate={setCurrentView} onSelectCourse={(c) => {
                        setSelectedCourse(c);
                    }} onSelectQuizCourse={(c) => {
                        setSelectedCourse(c);
                    }} onViewCertificate={(courseId) => {
                        setSelectedCertificateCourseId(courseId);
                    }}/>);
            case 'training_admin':
                return (<TrainingAdminDashboardView user={user.role === 'training_admin' ? user : mockPersonas.training_admin} onNavigate={setCurrentView} onViewCertificate={(courseId) => {
                        setSelectedCertificateCourseId(courseId);
                    }} onAddAuditLog={handleAddAuditLog}/>);
            case 'system_admin':
                return (<SystemAdminDashboardView user={user.role === 'system_admin' ? user : mockPersonas.system_admin} onNavigate={setCurrentView} auditLogs={auditLogs} onAddAuditLog={handleAddAuditLog} courses={courses} onUpdateCourse={handleUpdateCourse} lessons={lessons} onAddLesson={handleAddLesson} onUpdateLesson={handleUpdateLesson} onDeleteLesson={handleDeleteLesson} questions={questions} onAddQuestion={handleAddQuestion} onDeleteQuestion={handleDeleteQuestion} sequentialEnforced={sequentialEnforced} onToggleSequentialEnforced={handleToggleSequential}/>);
            case 'video_lesson':
            case 'course_player':
                return (<VideoLessonView onNavigate={setCurrentView} initialCourseId={selectedCourse.id} courses={courses} lessons={lessons} user={user} onSelectCourseForQuiz={(courseId) => {
                        const crs = courses.find(c => c.id === courseId);
                        if (crs)
                            setSelectedCourse(crs);
                        setCurrentView('quiz');
                    }}/>);
            case 'quiz':
                return (<QuizAssessmentView onNavigate={setCurrentView} selectedCourseId={selectedCourse.id} courses={courses} questions={questions} onPassCourse={handlePassCourse} onViewCertificate={(courseId) => {
                        setSelectedCertificateCourseId(courseId);
                    }} onAddAuditLog={handleAddAuditLog}/>);
            case 'performance':
            case 'resources':
                return (<PerformanceTrackerView user={user} onNavigate={setCurrentView}/>);
            case 'certificate':
                return (<CertificateView user={user} onNavigate={setCurrentView} selectedCourseId={selectedCertificateCourseId}/>);
            case 'leadership_path':
                return <LeadershipPathView onNavigate={setCurrentView}/>;
            case 'coaching':
                return <CoachingModuleView onNavigate={setCurrentView}/>;
            case 'role_select':
                return (
                    <RoleSelectionView
                        selectedRole={user?.role || 'trainee'}
                        onSelectRole={(role) => {
                            if (mockPersonas[role]) {
                                setUser(mockPersonas[role]);
                            }
                        }}
                        onConfirmRole={(role) => {
                            const targetRole = role || user?.role || 'trainee';
                            if (mockPersonas[targetRole]) {
                                setUser(mockPersonas[targetRole]);
                            }
                            setCurrentView('login');
                        }}
                        onOpenSupport={() => setIsSupportOpen(true)}
                    />
                );
            case 'login':
                return (
                    <LoginView
                        initialRole={user?.role || 'trainee'}
                        isLoggingIn={isLoggingIn}
                        loginError={loginError}
                        onLogin={handleLogin}
                        onBackToRoleSelect={() => setCurrentView('role_select')}
                        onOpenSupport={() => setIsSupportOpen(true)}
                    />
                );
            default:
                return (<TraineeDashboardView user={user} courses={courses} onNavigate={setCurrentView} onSelectCourse={(c) => {
                        setSelectedCourse(c);
                    }} onSelectQuizCourse={(c) => {
                        setSelectedCourse(c);
                    }} onViewCertificate={(courseId) => {
                        setSelectedCertificateCourseId(courseId);
                    }}/>);
        }
    };

    // When on Role Selection or Login screen, display the full immersive centered page experience
    if (currentView === 'role_select' || currentView === 'login') {
        return (
            <div className="h-screen max-h-screen w-full max-w-full overflow-hidden bg-[#dee2e8] flex items-center justify-center">
                {currentView === 'role_select' ? (
                    <RoleSelectionView
                        selectedRole={user?.role || 'trainee'}
                        onSelectRole={(role) => {
                            if (mockPersonas[role]) {
                                setUser(mockPersonas[role]);
                            }
                        }}
                        onConfirmRole={(role) => {
                            const targetRole = role || user?.role || 'trainee';
                            if (mockPersonas[targetRole]) {
                                setUser(mockPersonas[targetRole]);
                            }
                            setLoginError(null);
                            setCurrentView('login');
                        }}
                        onOpenSupport={() => setIsSupportOpen(true)}
                    />
                ) : (
                    <LoginView
                        initialRole={user?.role || 'trainee'}
                        isLoggingIn={isLoggingIn}
                        loginError={loginError}
                        onLogin={handleLogin}
                        onBackToRoleSelect={() => setCurrentView('role_select')}
                        onOpenSupport={() => setIsSupportOpen(true)}
                    />
                )}
                <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)}/>
            </div>
        );
    }

    return (<div className="h-screen w-full max-w-full overflow-x-hidden overflow-y-hidden bg-[#dee2e8] text-[#485261] flex flex-col selection:bg-[#6bbada]/30 selection:text-[#0b96c7] transition-colors duration-200">
      
      {/* Top Header Bar */}
      <TopNavBar currentView={currentView} onNavigate={setCurrentView} user={user} onChangeUser={setUser} onOpenNotifications={() => setIsNotificationsOpen(true)} onOpenSupport={() => setIsSupportOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)} onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} isSidebarOpen={isSidebarOpen} unreadCount={2} onLogout={() => setCurrentView('role_select')} />

      {/* Main Container Layout â€” spans full width without horizontal overflow */}
      <div className="flex-1 flex w-full max-w-full overflow-hidden min-w-0">
        
        {/* Navigation Sidebar with Collapsed/Expanded Rail Mode */}
        <SideNavBar currentView={currentView} onNavigate={setCurrentView} isMobileOpen={isMobileNavOpen} onCloseMobile={() => setIsMobileNavOpen(false)} completedModulesCount={completedCoursesCount} totalModulesCount={courses.length} user={user} isOpen={isSidebarOpen} onToggleCollapse={() => setIsSidebarOpen(prev => !prev)}/>

        {/* Dynamic View Content Area â€” expands to fit all screen when sidebar collapsed */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 w-full max-w-full min-w-0 overflow-y-auto overflow-x-hidden">
          {renderView()}
        </main>

      </div>

      {/* Interactive Global Modals */}
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onNavigate={setCurrentView}/>

      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)}/>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onNavigate={setCurrentView} onSelectModule={setSelectedCourse}/>

    </div>);
}
