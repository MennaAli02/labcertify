# LabCertify Backend API Documentation (Odoo 19)

This document provides complete documentation for the custom **LabCertify** Odoo 19 module (`labcertify`), its REST JSON API endpoints, authentication flows, and mapping to the React frontend screens.

---

## 1. System Overview & Connection Architecture

- **Odoo Instance**: Odoo 19
- **Host Port**: `http://localhost:8019/`
- **Database**: `labcertify`
- **Module Name**: `labcertify`

## 2. Authentication & Session Context

To interact with database `labcertify`, client requests should establish an authenticated session context using Odoo's standard session authentication. Once authenticated, the browser cookie `session_id` is automatically attached to all requests.

### 2.1 Authenticate Session
- **Endpoint**: `POST /web/session/authenticate`
- **Content-Type**: `application/json`
- **Request Body**:
```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "db": "labcertify",
    "login": "",
    "password": ""
  }
}
```
- **Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "uid": 2,
    "is_system": true,
    "db": "labcertify",
    "name": "",
    "username": ""
  }
}
```

---

## 3. Endpoints Catalogue

### 3.1 Auth & Personas
Used for the global Role Switcher and Trainee Profile in `TopNavBar.jsx` and `App.jsx`.

#### `GET /api/personas`
Retrieves the 3 core system personas: Trainee (`Ahmed Mohamed`), Training Admin (`Dr. Sarah Mansour`), and System Admin (`Eng. Khaled El-Sayed`).
- **Response**:
```json
{
  "trainee": {
    "id": "user-trainee-1",
    "name": "Ahmed Mohamed",
    "nameAr": "أحمد محمد",
    "employeeId": "SL-2024-0482",
    "role": "trainee",
    "overallProgress": 20,
    "department": "Clinical Chemistry & Hematology"
  },
  "training_admin": {
    "id": "user-admin-1",
    "name": "Dr. Sarah Mansour",
    "nameAr": "د. سارة منصور",
    "role": "training_admin"
  },
  "system_admin": {
    "id": "user-sys-1",
    "name": "Eng. Khaled El-Sayed",
    "nameAr": "م. خالد السيد",
    "role": "system_admin"
  }
}
```

#### `GET /api/profile?role=trainee`
Gets the active user's profile and orientation enrollment statistics.

#### `PUT /api/profile`
Updates user profile settings (name, phone, department, branch).

---

### 3.2 Courses & Curriculum
Used in `TraineeDashboardView.jsx`, `SystemAdminDashboardView.jsx`, and `SideNavBar.jsx`.

#### `GET /api/courses`
Lists all 5 mandatory sequential orientation courses, including completion status and progress percentage.
- **Optional Query**: `?traineeId=user-trainee-1`
- **Response**:
```json
[
  {
    "id": "course-1",
    "moduleNumber": 1,
    "code": "SP-100",
    "title": "New Employee Orientation & Laboratory Organization",
    "titleAr": "التهيئة والتعريف بأنظمة ومعايير المختبرات",
    "description": "Introduction to Shalaby Labs code of conduct, organizational hierarchy...",
    "descriptionAr": "الميثاق المهني لمعامل شلبي، الهيكل التنظيمي للمختبر...",
    "category": "Orientation Fundamentals",
    "status": "Completed",
    "progress": 100,
    "estMinutes": 30,
    "passScore": 80,
    "allowedAttempts": 3,
    "validityMonths": 24,
    "certificateAvailable": true,
    "materials": [
      {
        "id": "mat-1-1",
        "type": "video",
        "title": "Welcome & Laboratory Governance Video",
        "durationOrPages": "12 mins"
      }
    ]
  },
  {
    "id": "course-2",
    "moduleNumber": 2,
    "code": "SP-101",
    "title": "Laboratory Safety & Biosafety Level 2 Protocols",
    "titleAr": "السلامة المهنية وبروتوكولات الأمان الحيوي BSL-2",
    "status": "In Progress",
    "progress": 40,
    "passScore": 80,
    "allowedAttempts": 3,
    "prerequisiteCourseId": "course-1",
    "prerequisiteCourseCode": "SP-100"
  }
]
```

#### `GET /api/courses/<course_id>`
Fetches details of a specific course (`course-1`, `course-2`, etc.).

#### `PUT /api/courses/<course_id>`
Updates course configuration from System Admin Content Studio (e.g., passing score, allowed attempts, validity period).
- **Request Body**:
```json
{
  "passScore": 85,
  "allowedAttempts": 3,
  "validityMonths": 24,
  "title": "Updated Course Title"
}
```

#### `POST /api/courses/<course_id>/pass`
Fires when a trainee passes a course assessment:
1. Marks the course as **Completed** (100% progress).
2. Unlocks the next sequential course (sets **In Progress**, 15% progress) if `sequentialEnforced` is active.
3. Automatically issues a digital certificate.
4. Records an entry in the compliance audit trail.
- **Request Body**:
```json
{
  "score": 92,
  "traineeId": "user-trainee-1"
}
```
- **Response**:
```json
{
  "success": true,
  "courseId": "course-2",
  "status": "Completed",
  "progress": 100,
  "score": 92,
  "nextCourseUnlocked": "course-3",
  "overallProgress": 40,
  "certificateId": "SL-CERT-2024-0482-2"
}
```

---

### 3.3 Video Lessons & Notes
Used in `VideoLessonView.jsx` and Content Studio in `SystemAdminDashboardView.jsx`.

#### `GET /api/lessons?moduleId=course-2`
Lists all video lessons, learning objectives, protocols, and transcripts for a course.
- **Response**:
```json
[
  {
    "id": "les-2-1",
    "moduleId": "course-2",
    "stageNumber": "01",
    "title": "BSL-2 Safety Guidelines & Personal Protective Gear",
    "titleAr": "معدات الوقاية الشخصية وإرشادات الأمان الحيوي",
    "duration": "14:20",
    "status": "Currently Playing",
    "protocolId": "SOP-101.1",
    "videoUrl": "https://...",
    "learningObjectives": [
      "Master correct order of doffing PPE without hand contamination.",
      "Demonstrate emergency flush procedure for ocular chemical exposure."
    ],
    "transcript": [
      {
        "time": "00:20",
        "seconds": 20,
        "text": "Biosafety Level 2 laboratories handle clinical blood...",
        "textAr": "تتعامل مختبرات المستوى الثاني للأمان الحيوي BSL-2 مع عينات الدم..."
      }
    ]
  }
]
```

#### `POST /api/lessons`
Creates a new video lesson or SOP module in Content Studio.

#### `PUT /api/lessons/<lesson_id>`
Updates video details, description, or learning objectives.

#### `DELETE /api/lessons/<lesson_id>`
Removes a video lesson.

#### `GET /api/lessons/<lesson_id>/notes`
Gets personal time-stamped study notes for a specific video lesson.

#### `POST /api/lessons/<lesson_id>/notes`
Adds a timestamped note:
```json
{
  "timestamp": "02:15",
  "content": "Important: Verify patient MRN against electronic LIMS before spinning."
}
```

---

### 3.4 Question Bank & Assessment
Used in `QuizAssessmentView.jsx` and Question Studio in `SystemAdminDashboardView.jsx`.

#### `GET /api/questions?courseId=course-2`
Returns multiple-choice quiz questions with 4 options, hints, and explanations.
- **Response**:
```json
[
  {
    "id": "q-201",
    "courseId": "course-2",
    "questionNumber": 1,
    "question": "What is the mandatory minimum duration for flushing eyes at an emergency eyewash station after accidental chemical splash?",
    "questionAr": "ما هو الحد الأدنى الإلزامي لغسيل العينين في محطة غسيل العيون الطارئة عند التعرض لرذاذ كيميائي؟",
    "options": [
      "2 minutes with gentle blinking.",
      "5 minutes with eyes closed.",
      "15 full consecutive minutes holding eyelids open.",
      "30 seconds followed by sterile saline drops."
    ],
    "optionsAr": [
      "دقيقتان مع الرمش الخفيف.",
      "5 دقائق مع إغلاق العينين.",
      "15 دقيقة كاملة متواصلة مع إبقاء الجفون مفتوحة بالقوة.",
      "30 ثانية تليها قطرات محلول ملحي معقم."
    ],
    "correctIndex": 2,
    "hint": "Chemical ocular decontamination requires prolonged irrigation...",
    "explanation": "OSHA and CDC guidelines require a minimum of 15 continuous minutes of irrigation...",
    "moduleRef": "SOP-012: Chemical Safety & Eyewash Protocols",
    "difficulty": "Basic"
  }
]
```

#### `POST /api/questions`
Adds a new question to the bank from System Admin Dashboard.

#### `DELETE /api/questions/<question_id>`
Deletes a question from the bank.

#### `POST /api/quiz/submit`
Submits quiz answers, evaluates score against passing threshold, stores attempt, and triggers progression:
- **Request Body**:
```json
{
  "courseId": "course-2",
  "traineeId": "user-trainee-1",
  "answers": { "0": 2, "1": 1 },
  "attemptNumber": 1
}
```
- **Response**:
```json
{
  "success": true,
  "passed": true,
  "score": 100,
  "correctCount": 2,
  "totalCount": 2,
  "attemptsUsed": 1,
  "maxAttempts": 3,
  "certificateId": "SL-CERT-2024-0482-2",
  "nextCourseUnlocked": "course-3"
}
```

#### `POST /api/quiz/reset-attempts`
Allows Training/System Admin to reset quiz attempts for a trainee who exhausted their limit.

---

### 3.5 Trainees & Supervision
Used in `TrainingAdminDashboardView.jsx`.

#### `GET /api/trainees`
Lists all trainee accounts with filters for branch, department, and status.
- **Query Parameters**:
  - `q` or `search`: Search by name or employee ID
  - `branch`: Filter by branch (e.g. `Cairo Main Facility`)
  - `department`: Filter by department (e.g. `Clinical Chemistry`)
  - `status`: Filter by status (`In Progress`, `Completed`, `Overdue`, `Not Started`)
- **Response**: Array of trainee account records with detailed progress per course.

#### `POST /api/trainees`
Provisions a new trainee account and initializes orientation course enrollments:
```json
{
  "name": "Nouran El-Shazly",
  "nameAr": "نوران الشاذلي",
  "employeeId": "SL-2024-0599",
  "jobTitle": "Medical Laboratory Technologist",
  "department": "Clinical Chemistry",
  "branch": "Cairo Main Facility",
  "hireDate": "2024-10-01",
  "email": "nouran.elshazly@shalabylabs.com",
  "phone": "+20 101 234 5678"
}
```

#### `POST /api/trainees/<trainee_id>/reminder`
Dispatches an overdue orientation reminder notification to the trainee and logs an audit trail event.

---

### 3.6 Certificates & Public Verification
Used in `CertificateView.jsx`.

#### `GET /api/certificates/<course_id_or_cert_id>`
Fetches certificate data for rendering the print/PDF certificate. Supports:
- Course ID: `course-1`, `course-2`, etc.
- Certificate ID: `SL-CERT-2024-0482-1`
- Master Credential: `master`
- **Response**:
```json
{
  "certificateId": "SL-CERT-2024-0482-1",
  "traineeName": "Ahmed Mohamed",
  "traineeNameAr": "أحمد محمد",
  "employeeId": "SL-2024-0482",
  "courseTitle": "New Employee Orientation & Laboratory Organization (SP-100)",
  "courseTitleAr": "التهيئة والتعريف بأنظمة ومعايير المختبرات (SP-100)",
  "courseCode": "SP-100",
  "issueDate": "05 September 2024",
  "expiryDate": "05 September 2026",
  "score": 92,
  "passingScore": 80,
  "verificationCode": "VER-9824-OK",
  "authorizedSigner": "Dr. Amira Shalaby, MD, FRCPath",
  "status": "valid",
  "verifyUrl": "https://shalabylabs.org/verify/SL-CERT-2024-0482-1"
}
```

#### `GET /api/verify/<certificate_id>`
Public ISO 15189:2022 validation endpoint for QR code verification.

---

### 3.7 Compliance Audit Trail
Used in `SystemAdminDashboardView.jsx` (Audit Tab).

#### `GET /api/audit-logs`
Lists compliance logs with real-time searching and severity filtering (`Success`, `Warning`, `Security Alert`).

#### `POST /api/audit-logs`
Adds an audit event to the tamper-evident registry:
```json
{
  "action": "Updated Course Settings",
  "actionAr": "تعديل إعدادات الكورس",
  "details": "Configured passScore = 80%, allowedAttempts = 3 on SP-101",
  "target": "Course: SP-101",
  "status": "Success"
}
```

---

### 3.8 System Settings & Governance
Used in `SystemAdminDashboardView.jsx` (Rules & Governance Tab).

#### `GET /api/settings`
Returns current system governance rules:
```json
{
  "sequentialEnforced": true,
  "defaultPassScore": 80,
  "defaultAllowedAttempts": 3,
  "defaultValidityMonths": 24
}
```

#### `POST /api/settings`
Updates strict sequential progression and default thresholds.

---

### 3.9 Community Coaching & Performance
Used in `CoachingModuleView.jsx` and `PerformanceTrackerView.jsx`.

#### `GET /api/forum/posts` & `POST /api/forum/posts`
GROW coaching framework discussion threads and comments.

#### `POST /api/forum/posts/<post_id>/like`
Toggles like status on a coaching post.

#### `GET /api/performance`
Clinical competency scores and historical accreditation milestones.

#### `GET /api/resources`
Downloadable laboratory handbooks, checklists, and reference SOP charts.

---

## 4. React Screen Mapping Matrix

| React Screen Component | Primary Backend Endpoints | Frontend File Path |
| :--- | :--- | :--- |
| **Top Navigation Bar** | `GET /api/personas`, `GET /api/profile` | `src/components/Navigation/TopNavBar.jsx` |
| **Trainee Dashboard** | `GET /api/courses`, `GET /api/profile` | `src/components/Views/TraineeDashboardView.jsx` |
| **Video Lesson Player** | `GET /api/lessons`, `GET/POST /api/lessons/:id/notes` | `src/components/Views/VideoLessonView.jsx` |
| **Quiz Assessment** | `GET /api/questions`, `POST /api/quiz/submit` | `src/components/Views/QuizAssessmentView.jsx` |
| **Certificate View** | `GET /api/certificates/:id`, `GET /api/verify/:id` | `src/components/Views/CertificateView.jsx` |
| **Training Admin View** | `GET /api/trainees`, `POST /api/trainees`, `POST /api/trainees/:id/reminder` | `src/components/Views/TrainingAdminDashboardView.jsx` |
| **System Admin Studio** | `PUT /api/courses/:id`, `CRUD /api/lessons`, `CRUD /api/questions` | `src/components/Views/SystemAdminDashboardView.jsx` |
| **Audit Trail View** | `GET /api/audit-logs`, `POST /api/audit-logs` | `src/components/Views/SystemAdminDashboardView.jsx` |
| **Performance Tracker** | `GET /api/performance`, `GET /api/resources` | `src/components/Views/PerformanceTrackerView.jsx` |
| **Coaching Module** | `GET/POST /api/forum/posts`, `POST /api/forum/posts/:id/like` | `src/components/Views/CoachingModuleView.jsx` |

---

## 5. Frontend Client Usage

The frontend service [`src/services/api.js`](file:///c:/Users/USER/Documents/labcertify/src/services/api.js) provides convenient wrappers for all endpoints:

```javascript
import { labCertifyApi } from './services/api';

// Example 1: Fetch Courses
const courses = await labCertifyApi.getCourses();

// Example 2: Submit Quiz
const result = await labCertifyApi.submitQuiz({
  courseId: 'course-2',
  traineeId: 'user-trainee-1',
  answers: { 0: 2, 1: 1 },
  attemptNumber: 1
});

// Example 3: Pass Course and Unlock Next
await labCertifyApi.passCourse('course-2', 95, 'user-trainee-1');
```
