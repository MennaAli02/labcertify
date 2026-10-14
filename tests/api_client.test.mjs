import test from 'node:test';
import assert from 'node:assert/strict';
import { labCertifyApi } from '../src/services/api.js';

test('LabCertify API Client - Direct Odoo Backend Integration', async (t) => {

    await t.test('1. Authentication: should log in valid trainee and return profile', async () => {
        const res = await labCertifyApi.login('ahmed.mohamed@shalabylabs.com', 'clinical2024', 'trainee');
        assert.equal(res.success, true);
        assert.ok(res.user);
        assert.equal(res.user.role, 'trainee');
        assert.equal(res.user.name, 'Ahmed Mohamed');
        assert.ok(res.token);
    });

    await t.test('2. Authentication: should reject unknown email with 401', async () => {
        await assert.rejects(
            async () => {
                await labCertifyApi.login('nonexistent@shalabylabs.com', 'clinical2024', 'trainee');
            },
            (err) => {
                assert.equal(err.status, 401);
                assert.match(err.message, /Account not found/i);
                return true;
            }
        );
    });

    await t.test('3. Personas: should load 3 core personas from Odoo', async () => {
        const personas = await labCertifyApi.getPersonas();
        assert.ok(personas.trainee, 'Trainee persona missing');
        assert.ok(personas.training_admin, 'Training admin persona missing');
        assert.ok(personas.system_admin, 'System admin persona missing');
        assert.equal(personas.trainee.role, 'trainee');
        assert.equal(personas.training_admin.role, 'training_admin');
        assert.equal(personas.system_admin.role, 'system_admin');
    });

    await t.test('4. Profile: should fetch trainee profile with employeeId', async () => {
        const profile = await labCertifyApi.getProfile('trainee', 'SL-2024-0482');
        assert.ok(profile);
        assert.equal(profile.employeeId, 'SL-2024-0482');
        assert.equal(profile.name, 'Ahmed Mohamed');
    });

    await t.test('5. Courses: should fetch course curriculum for trainee', async () => {
        const courses = await labCertifyApi.getCourses('user-trainee-1');
        assert.ok(Array.isArray(courses));
        assert.ok(courses.length >= 5, 'Should have at least 5 orientation courses');
        const c1 = courses.find(c => c.id === 'course-1');
        assert.ok(c1, 'Course 1 must exist');
        assert.equal(c1.code, 'SP-100');
    });

    await t.test('6. Lessons: should fetch lessons for module', async () => {
        const lessons = await labCertifyApi.getLessons('course-1');
        assert.ok(Array.isArray(lessons));
        assert.ok(lessons.length > 0);
        assert.equal(lessons[0].moduleId, 'course-1');
    });

    await t.test('7. Lesson Notes: two-way send note to Odoo and delete it', async () => {
        const note = await labCertifyApi.addLessonNote('les-1-1', {
            content: 'Unit test automated note verification',
            timestamp: '00:45',
            traineeId: 'user-trainee-1'
        });
        assert.ok(note.id);
        assert.equal(note.content, 'Unit test automated note verification');

        const notes = await labCertifyApi.getLessonNotes('les-1-1');
        assert.ok(Array.isArray(notes));
        assert.ok(notes.some(n => String(n.id) === String(note.id)));

        const delRes = await labCertifyApi.deleteLessonNote(note.id);
        assert.equal(delRes.success, true);
    });

    await t.test('8. Questions Bank: should fetch quiz questions for course', async () => {
        const questions = await labCertifyApi.getQuestions('course-1');
        assert.ok(Array.isArray(questions));
        assert.ok(questions.length > 0);
        assert.equal(questions[0].courseId, 'course-1');
        assert.ok(Array.isArray(questions[0].options));
    });

    await t.test('9. Quiz Submission: should submit quiz and return calculated score from Odoo', async () => {
        const result = await labCertifyApi.submitQuiz({
            courseId: 'course-1',
            traineeId: 'user-trainee-1',
            answers: { 0: 1, 1: 2, 2: 0, 3: 1 },
            score: 100
        });
        assert.ok(result);
        assert.equal(typeof result.passed, 'boolean');
        assert.equal(typeof result.score, 'number');
    });

    await t.test('10. Certificates: should fetch official certificates for trainee', async () => {
        const certs = await labCertifyApi.getCertificates('user-trainee-1');
        assert.ok(Array.isArray(certs));
        assert.ok(certs.length > 0);
        assert.ok(certs[0].certificateId);
    });

    await t.test('11. Certificate Verification: should verify official certificate ID in Odoo', async () => {
        const verification = await labCertifyApi.verifyCertificate('SL-CERT-2024-0482-1');
        assert.ok(verification);
        assert.equal(verification.verified, true);
        assert.equal(verification.status, 'VALID');
        assert.ok(verification.certificate);
        assert.equal(verification.certificate.certificateId, 'SL-CERT-2024-0482-1');
    });

    await t.test('12. Trainees Roster: should fetch trainee roster with orientation status', async () => {
        const trainees = await labCertifyApi.getTrainees();
        assert.ok(Array.isArray(trainees));
        assert.ok(trainees.length > 0);
        assert.ok(trainees.some(t => t.employeeId === 'SL-2024-0482'));
    });

    await t.test('13. Trainee Reminder: should dispatch orientation reminder in Odoo', async () => {
        const res = await labCertifyApi.sendTraineeReminder('user-trainee-1');
        assert.equal(res.success, true);
    });

    await t.test('14. Governance Settings: should read and update system governance in Odoo', async () => {
        const original = await labCertifyApi.getSettings();
        assert.equal(typeof original.sequentialEnforced, 'boolean');

        const updated = await labCertifyApi.updateSettings({
            sequentialEnforced: true,
            defaultPassScore: 80
        });
        assert.equal(updated.sequentialEnforced, true);
        assert.equal(updated.defaultPassScore, 80);
    });

    await t.test('15. Audit Logs: should record and retrieve compliance audit trail in Odoo', async () => {
        const testAction = `Compliance Check - ${Date.now()}`;
        const created = await labCertifyApi.addAuditLog({
            action: testAction,
            actionAr: 'فحص الامتثال الآلي',
            details: 'Automated test suite verifying audit trail recording',
            userId: 'SL-SYS-0004',
            userName: 'Eng. Khaled El-Sayed',
            userRole: 'System Admin',
            target: 'System Verification'
        });
        assert.ok(created);
        assert.equal(created.action, testAction);

        const logs = await labCertifyApi.getAuditLogs({ search: testAction });
        assert.ok(Array.isArray(logs));
        assert.ok(logs.some(l => l.action === testAction));
    });

    await t.test('16. Forum & Community: should create post and like it in Odoo', async () => {
        const newPost = await labCertifyApi.createForumPost({
            author: 'Ahmed Mohamed',
            role: 'Trainee',
            content: `Automated test forum discussion - ${Date.now()}`
        });
        assert.ok(newPost.id);

        const liked = await labCertifyApi.likeForumPost(newPost.id);
        assert.ok(liked);
        assert.ok(liked.likes >= 1);
    });

    await t.test('17. Performance & Competencies: should fetch competency metrics from Odoo', async () => {
        const perf = await labCertifyApi.getPerformance();
        assert.ok(perf);
        const res = await labCertifyApi.getResources();
        assert.ok(Array.isArray(res));
    });

});
