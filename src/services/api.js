/**
 * LabCertify API Client for Odoo 19 Backend
 * Base URL: http://localhost:8019 or relative proxy via Vite (/api)
 */

const BASE_URL = ''; // Relative path leverages Vite dev server proxy to http://localhost:8019

let isSessionInitialized = false;
let sessionInitPromise = null;

/**
 * Ensure Odoo active session for database `labcertify`
 */
export async function ensureOdooSession(db = 'labcertify', login = 'admin', password = 'admin') {
    if (isSessionInitialized) return true;
    if (sessionInitPromise) return sessionInitPromise;

    sessionInitPromise = (async () => {
        try {
            const resp = await fetch(`${BASE_URL}/web/session/authenticate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'call',
                    params: { db, login, password }
                })
            });
            const data = await resp.json();
            if (data.result && data.result.uid) {
                isSessionInitialized = true;
                return true;
            }
        } catch (err) {
            console.warn('[LabCertify API] Failed to initialize Odoo session, continuing with direct requests:', err);
        }
        return false;
    })();

    return sessionInitPromise;
}

/**
 * Generic Fetch Wrapper with automatic session & JSON parsing
 */
async function apiRequest(endpoint, options = {}) {
    await ensureOdooSession();

    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Accept': 'application/json',
        'X-Odoo-Database': 'labcertify',
        ...(options.headers || {})
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
    });

    if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`API error ${response.status} on ${endpoint}: ${errorText}`);
        err.status = response.status;
        throw err;
    }

    return response.json();
}

/**
 * Dedicated fetch for /api/auth/login — does NOT bootstrap an Odoo admin session first.
 * The user's own credentials are the auth event.
 */
async function loginRequest(endpoint, body) {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Odoo-Database': 'labcertify',
        },
        credentials: 'include',
        body: JSON.stringify(body),
    });

    let data;
    try {
        data = await response.json();
    } catch {
        const err = new Error(`Login request failed with status ${response.status}`);
        err.status = response.status;
        throw err;
    }

    if (!response.ok || data.success === false) {
        const err = new Error(data.error || data.message || 'Invalid credentials');
        err.status = response.status || 401;
        throw err;
    }

    return data;
}

export const labCertifyApi = {
    // Session & Auth
    ensureSession: ensureOdooSession,

    /**
     * Authenticate a user by role, email/username, and password.
     * Maps to POST /api/auth/login — uses its own fetch (not the admin-bootstrapped apiRequest).
     * Throws with err.status=401 on invalid credentials.
     */
    login: (loginId, password, role) => loginRequest('/api/auth/login', {
        login: loginId, password, role
    }),

    getPersonas: () => apiRequest('/api/personas'),
    getProfile: (role = 'trainee', employeeId = null) => {
        const params = new URLSearchParams();
        if (role) params.set('role', role);
        if (employeeId) params.set('employeeId', employeeId);
        const qs = params.toString();
        return apiRequest(`/api/profile${qs ? `?${qs}` : ''}`);
    },
    updateProfile: (profileData) => apiRequest('/api/profile', { method: 'PUT', body: profileData }),

    // Courses Curriculum
    getCourses: (traineeId) => {
        const query = traineeId ? `?traineeId=${encodeURIComponent(traineeId)}` : '';
        return apiRequest(`/api/courses${query}`);
    },
    getCourse: (courseId) => apiRequest(`/api/courses/${encodeURIComponent(courseId)}`),
    updateCourse: (courseId, courseData) => apiRequest(`/api/courses/${encodeURIComponent(courseId)}`, { method: 'PUT', body: courseData }),
    passCourse: (courseId, score, traineeId) => apiRequest(`/api/courses/${encodeURIComponent(courseId)}/pass`, {
        method: 'POST',
        body: { score, traineeId }
    }),

    // Lessons & Content Studio
    getLessons: (moduleId) => {
        const query = moduleId ? `?moduleId=${encodeURIComponent(moduleId)}` : '';
        return apiRequest(`/api/lessons${query}`);
    },
    getLesson: (lessonId) => apiRequest(`/api/lessons/${encodeURIComponent(lessonId)}`),
    createLesson: (lessonData) => apiRequest('/api/lessons', { method: 'POST', body: lessonData }),
    updateLesson: (lessonId, lessonData) => apiRequest(`/api/lessons/${encodeURIComponent(lessonId)}`, { method: 'PUT', body: lessonData }),
    deleteLesson: (lessonId) => apiRequest(`/api/lessons/${encodeURIComponent(lessonId)}`, { method: 'DELETE' }),

    // Personal Lesson Notes
    getLessonNotes: (lessonId) => apiRequest(`/api/lessons/${encodeURIComponent(lessonId)}/notes`),
    addLessonNote: (lessonId, noteData) => apiRequest(`/api/lessons/${encodeURIComponent(lessonId)}/notes`, { method: 'POST', body: noteData }),
    deleteLessonNote: (noteId) => apiRequest(`/api/notes/${noteId}`, { method: 'DELETE' }),

    // Question Bank & Assessments
    getQuestions: (courseId) => {
        const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : '';
        return apiRequest(`/api/questions${query}`);
    },
    createQuestion: (questionData) => apiRequest('/api/questions', { method: 'POST', body: questionData }),
    deleteQuestion: (questionId) => apiRequest(`/api/questions/${encodeURIComponent(questionId)}`, { method: 'DELETE' }),
    submitQuiz: (payload) => apiRequest('/api/quiz/submit', { method: 'POST', body: payload }),
    resetQuizAttempts: (courseId, traineeId) => apiRequest('/api/quiz/reset-attempts', { method: 'POST', body: { courseId, traineeId } }),

    // Trainees & Supervision
    getTrainees: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.set('search', params.search);
        if (params.branch) searchParams.set('branch', params.branch);
        if (params.dept) searchParams.set('dept', params.dept);
        if (params.status) searchParams.set('status', params.status);
        const qStr = searchParams.toString();
        return apiRequest(`/api/trainees${qStr ? `?${qStr}` : ''}`);
    },
    getTrainee: (traineeId) => apiRequest(`/api/trainees/${encodeURIComponent(traineeId)}`),
    createTrainee: (traineeData) => apiRequest('/api/trainees', { method: 'POST', body: traineeData }),
    sendTraineeReminder: (traineeId) => apiRequest(`/api/trainees/${encodeURIComponent(traineeId)}/reminder`, { method: 'POST' }),

    // Certificates
    getCertificates: (traineeId) => {
        const query = traineeId ? `?traineeId=${encodeURIComponent(traineeId)}` : '';
        return apiRequest(`/api/certificates${query}`);
    },
    getCertificate: (identifier) => apiRequest(`/api/certificates/${encodeURIComponent(identifier)}`),
    verifyCertificate: (certId) => apiRequest(`/api/verify/${encodeURIComponent(certId)}`),

    // Audit Trail
    getAuditLogs: (params = {}) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.set('search', params.search);
        if (params.severity) searchParams.set('severity', params.severity);
        const qStr = searchParams.toString();
        return apiRequest(`/api/audit-logs${qStr ? `?${qStr}` : ''}`);
    },
    addAuditLog: (logData) => apiRequest('/api/audit-logs', { method: 'POST', body: logData }),

    // Governance & System Settings
    getSettings: () => apiRequest('/api/settings'),
    updateSettings: (settingsData) => apiRequest('/api/settings', { method: 'POST', body: settingsData }),

    // Community Coaching & Performance
    getForumPosts: () => apiRequest('/api/forum/posts'),
    createForumPost: (postData) => apiRequest('/api/forum/posts', { method: 'POST', body: postData }),
    likeForumPost: (postId) => apiRequest(`/api/forum/posts/${encodeURIComponent(postId)}/like`, { method: 'POST' }),
    getPerformance: () => apiRequest('/api/performance'),
    getResources: () => apiRequest('/api/resources'),
};
