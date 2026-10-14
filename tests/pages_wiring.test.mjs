import test from 'node:test';
import assert from 'node:assert/strict';
import { labCertifyApi } from '../src/services/api.js';

test('LabCertify Screen-by-Screen Data Wiring to Odoo Backend', async (suite) => {

    // =========================================================================
    // PAGE 1: ROLE SELECTION & USER LOGIN (RoleSelectionView + LoginView)
    // =========================================================================
    await suite.test('Screen 1: Role Selection & Login - wiring & authentication', async (t) => {
        // 1. Gets personas for RoleSelectionView
        const personas = await labCertifyApi.getPersonas();
        assert.ok(personas.trainee, 'Trainee persona loaded from Odoo');
        assert.ok(personas.training_admin, 'Training Admin persona loaded from Odoo');
        assert.ok(personas.system_admin, 'System Admin persona loaded from Odoo');

        // 2. Trainee login -> Odoo POST /api/auth/login
        const traineeLogin = await labCertifyApi.login('ahmed.mohamed@shalabylabs.com', 'clinical2024', 'trainee');
        assert.equal(traineeLogin.success, true);
        assert.equal(traineeLogin.user.role, 'trainee');
        assert.equal(traineeLogin.user.employeeId, 'SL-2024-0482');

        // 3. Training Admin login -> Odoo POST /api/auth/login
        const adminLogin = await labCertifyApi.login('sarah.mansour@shalabylabs.com', 'clinical2024', 'training_admin');
        assert.equal(adminLogin.success, true);
        assert.equal(adminLogin.user.role, 'training_admin');
        assert.equal(adminLogin.user.employeeId, 'SL-TRN-0012');

        // 4. System Admin login -> Odoo POST /api/auth/login
        const sysLogin = await labCertifyApi.login('khaled.elsayed@shalabylabs.com', 'clinical2024', 'system_admin');
        assert.equal(sysLogin.success, true);
        assert.equal(sysLogin.user.role, 'system_admin');
        assert.equal(sysLogin.user.employeeId, 'SL-SYS-0004');

        // 5. Unauthorized login blocked with 401
        await assert.rejects(
            async () => labCertifyApi.login('unauthorized.user@gmail.com', 'clinical2024', 'trainee'),
            (err) => err.status === 401
        );

        // 6. Role mismatch blocked with 401
        await assert.rejects(
            async () => labCertifyApi.login('ahmed.mohamed@shalabylabs.com', 'clinical2024', 'system_admin'),
            (err) => err.status === 401
        );
    });

    // =========================================================================
    // PAGE 2: TRAINEE ORIENTATION DASHBOARD (TraineeDashboardView)
    // =========================================================================
    await suite.test('Screen 2: Trainee Dashboard - profile & orientation courses data', async (t) => {
        // Gets user profile
        const profile = await labCertifyApi.getProfile('trainee', 'SL-2024-0482');
        assert.equal(profile.name, 'Ahmed Mohamed');
        assert.equal(profile.role, 'trainee');
        assert.ok(profile.department);
        assert.ok(profile.branch);

        // Gets courses curriculum with enrollment progress
        const courses = await labCertifyApi.getCourses('user-trainee-1');
        assert.ok(Array.isArray(courses));
        assert.ok(courses.length >= 5);

        // Verify status fields used by TraineeDashboardView
        const completedCourses = courses.filter(c => c.status === 'Completed');
        assert.ok(completedCourses.length >= 1, 'At least 1 completed course (Course 1)');
        const inProgressCourses = courses.filter(c => c.status === 'In Progress');
        assert.ok(inProgressCourses.length >= 1, 'At least 1 in-progress course (Course 2)');
    });

    // =========================================================================
    // PAGE 3: VIDEO LESSON PLAYER & SOP VIEWER (VideoLessonView)
    // =========================================================================
    await suite.test('Screen 3: Video Lesson Player - modules, notes two-way sync to Odoo', async (t) => {
        // 1. Get lessons for current course
        const lessons = await labCertifyApi.getLessons('course-1');
        assert.ok(Array.isArray(lessons));
        assert.ok(lessons.length > 0);
        const activeLesson = lessons[0];
        assert.ok(activeLesson.title);

        // 2. Trainee sends a new personal observation note to Odoo
        const noteContent = `Trainee SOP Note - MRN cross-check verified at ${Date.now()}`;
        const addedNote = await labCertifyApi.addLessonNote(activeLesson.id, {
            content: noteContent,
            timestamp: '01:30',
            traineeId: 'user-trainee-1'
        });
        assert.ok(addedNote.id, 'Note created with ID in Odoo');

        // 3. Gets lesson notes from Odoo to confirm presence
        const allNotes = await labCertifyApi.getLessonNotes(activeLesson.id);
        const found = allNotes.find(n => n.id === addedNote.id);
        assert.ok(found, 'Created note retrieved from Odoo backend');
        assert.equal(found.content, noteContent);

        // 4. Deletes personal note in Odoo
        const delRes = await labCertifyApi.deleteLessonNote(addedNote.id);
        assert.equal(delRes.success, true);
    });

    // =========================================================================
    // PAGE 4: QUIZ & CLINICAL ASSESSMENT (QuizAssessmentView)
    // =========================================================================
    await suite.test('Screen 4: Quiz Assessment - questions, submit, passCourse & audit log', async (t) => {
        // 1. Gets assessment questions from Odoo
        const questions = await labCertifyApi.getQuestions('course-1');
        assert.ok(Array.isArray(questions));
        assert.ok(questions.length > 0);

        // 2. Submits assessment answers to Odoo
        const submitResult = await labCertifyApi.submitQuiz({
            courseId: 'course-1',
            traineeId: 'user-trainee-1',
            answers: { 0: 1, 1: 2, 2: 0, 3: 1 },
            score: 92
        });
        assert.ok(submitResult);
        assert.equal(typeof submitResult.score, 'number');

        // 3. Records course completion & unlocks next course in Odoo
        const passResult = await labCertifyApi.passCourse('course-1', 92, 'user-trainee-1');
        assert.equal(passResult.success, true);
        assert.ok(passResult.certificateId, 'Certificate issued on pass');

        // 4. Sends audit trail log for completed assessment to Odoo
        const auditLog = await labCertifyApi.addAuditLog({
            action: 'Assessment Passed (Screen 4 Test)',
            actionAr: 'اجتياز الاختبار بنجاح (فحص الشاشة 4)',
            details: 'Score: 92% on SP-100 New Employee Orientation',
            detailsAr: 'الدرجة: 92% في اختبار SP-100',
            userId: 'SL-2024-0482',
            userName: 'Ahmed Mohamed',
            userRole: 'Trainee',
            target: 'Course: SP-100'
        });
        assert.ok(auditLog.id);
    });

    // =========================================================================
    // PAGE 5: ACCREDITED CERTIFICATE (CertificateView)
    // =========================================================================
    await suite.test('Screen 5: Certificate View - fetch official cert and verify code', async (t) => {
        // 1. Gets official certificates for trainee
        const certs = await labCertifyApi.getCertificates('user-trainee-1');
        assert.ok(Array.isArray(certs));
        assert.ok(certs.length > 0);
        const cert = certs[0];
        assert.ok(cert.certificateId);
        assert.ok(cert.issueDate);
        assert.ok(cert.authorizedSigner);

        // 2. Public verification endpoint (ISO 15189 compliance)
        const verification = await labCertifyApi.verifyCertificate(cert.certificateId);
        assert.equal(verification.verified, true);
        assert.equal(verification.status, 'VALID');
        assert.equal(verification.certificate.certificateId, cert.certificateId);
    });

    // =========================================================================
    // PAGE 6: TRAINING ADMIN DASHBOARD (TrainingAdminDashboardView)
    // =========================================================================
    await suite.test('Screen 6: Training Admin - roster, send reminder, create trainee in Odoo', async (t) => {
        // 1. Gets trainee roster
        const trainees = await labCertifyApi.getTrainees();
        assert.ok(Array.isArray(trainees));
        assert.ok(trainees.length > 0);

        // 2. Sends official reminder to trainee in Odoo
        const reminderRes = await labCertifyApi.sendTraineeReminder('user-trainee-1');
        assert.equal(reminderRes.success, true);

        // 3. Creates new trainee account with course enrollments in Odoo
        const testBadge = `SL-TEST-${Date.now().toString().slice(-4)}`;
        const newTrainee = await labCertifyApi.createTrainee({
            id: `trn-test-${Date.now()}`,
            name: 'Dr. Test Specialist',
            nameAr: 'د. أخصائي تجريبي',
            employeeId: testBadge,
            jobTitle: 'Clinical Microbiologist',
            department: 'Microbiology',
            branch: 'Alexandria Branch',
            hireDate: '2024-10-01',
            email: `test.${Date.now()}@shalabylabs.com`,
            phone: '+20 100 123 4567'
        });
        assert.ok(newTrainee.id);
        assert.equal(newTrainee.employeeId, testBadge);
        assert.ok(Array.isArray(newTrainee.courses));
        assert.equal(newTrainee.courses.length, 5, 'Should automatically enroll in the 5 orientation courses');
    });

    // =========================================================================
    // PAGE 7: SYSTEM ADMIN DASHBOARD & CONTENT STUDIO (SystemAdminDashboardView)
    // =========================================================================
    await suite.test('Screen 7: System Admin - settings, content studio CRUD & audit logs', async (t) => {
        // 1. Gets system settings
        const settings = await labCertifyApi.getSettings();
        assert.equal(typeof settings.sequentialEnforced, 'boolean');

        // 2. Updates governance settings in Odoo
        const updatedSettings = await labCertifyApi.updateSettings({
            sequentialEnforced: true,
            defaultPassScore: 85
        });
        assert.equal(updatedSettings.sequentialEnforced, true);
        assert.equal(updatedSettings.defaultPassScore, 85);

        // 3. Question Bank CRUD: Create question in Odoo
        const questionId = `q-test-${Date.now()}`;
        const createdQ = await labCertifyApi.createQuestion({
            id: questionId,
            courseId: 'course-1',
            question: 'What is the required hand hygiene contact time before specimen processing?',
            questionAr: 'ما هي المدة المطلوبة لتعقيم اليدين قبل معالجة العينات؟',
            options: ['10 seconds', '30-40 seconds with alcohol rub', '5 seconds', 'No requirement'],
            correctIndex: 1,
            explanation: 'WHO guidelines recommend 30-40 seconds contact time for alcohol-based hand rub.',
            moduleRef: 'SOP-HYG-001',
            difficulty: 'Easy'
        });
        assert.ok(createdQ.id);

        // 4. Delete question in Odoo
        const delQRes = await labCertifyApi.deleteQuestion(createdQ.id);
        assert.equal(delQRes.success, true);

        // 5. Course Content update
        const updatedCourse = await labCertifyApi.updateCourse('course-1', {
            estMinutes: 35
        });
        assert.equal(updatedCourse.estMinutes, 35);

        // 6. Audit Trail: Read compliance log
        const logs = await labCertifyApi.getAuditLogs();
        assert.ok(Array.isArray(logs));
        assert.ok(logs.length > 0);
    });

    // =========================================================================
    // PAGE 8: PERFORMANCE TRACKER & COACHING (PerformanceTrackerView + CoachingModuleView)
    // =========================================================================
    await suite.test('Screen 8: Performance & Coaching - analytics, forum discussion & likes in Odoo', async (t) => {
        // 1. Performance analytics
        const perf = await labCertifyApi.getPerformance();
        assert.ok(perf);

        // 2. Training resources
        const resources = await labCertifyApi.getResources();
        assert.ok(Array.isArray(resources));
        assert.ok(resources.length > 0);

        // 3. Coaching forum: Read posts from Odoo
        const posts = await labCertifyApi.getForumPosts();
        assert.ok(Array.isArray(posts));

        // 4. Send discussion post to Odoo
        const testPost = await labCertifyApi.createForumPost({
            author: 'Ahmed Mohamed',
            role: 'Trainee',
            content: `Clinical case discussion on specimen hemolysis - ${Date.now()}`,
            contentAr: 'مناقشة حالة إكلينيكية حول تكسر عينات الدم'
        });
        assert.ok(testPost.id);

        // 5. Like discussion post in Odoo
        const likeRes = await labCertifyApi.likeForumPost(testPost.id);
        assert.ok(likeRes.likes >= 1);
    });

});
