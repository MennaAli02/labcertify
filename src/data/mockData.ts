import { 
  UserProfile, 
  Course, 
  LessonItem, 
  QuizQuestion, 
  ForumPost, 
  PerformanceItem, 
  CoreCompetency, 
  ResourceDocument,
  TraineeAccount,
  AuditLogEntry,
  CertificateRecord
} from '../types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuAPsc6frwqkN6TJw0lVlejnvGCgSjKeeegGNmCq52itX3bHXKSrzOGysASznD9kMc9Fg0s0Zvkz-UpoC-k1oSHfV-4Kyj__iGQXxKUKVwxy427Q5-riO40xOpKp_-9Fudjwlr9U2PNFByeRlcXdQ0b3j5O_PzjIynDtrZMQpfWZDB0M9Q5YZT3hOtHo9UxnfMvkil-1DD7dq5J1PXAzvhcYdqO7ncpi8Qaf9yY5lO7JSZI9C9ypvO4tvg";

export const SIGNATURE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuCWRU4uSQgRsTvacL4bkXtND90TsQihlyT8RNk-iyR2BBHwlxSJ_0ziLnf6ufJSumauLXbZsn55wHs0XiwnjKyTRhYlkUz9sbiVHt-MNwvtK-JhXhhMl5wk2h87FpexVJUHwPBVGtO9BpR_9iVI0wkJwVXh-ufRcY90vYLs12rhTNZ3Tuj747npkTDoD2F7kxqHCl2cUGRSnSmLW3zIT2EenFvkjdm7omdRAkfAf05dGFxjjBg6FDCOcw";

// 3 Core Personas for Role Switcher
export const mockPersonas: Record<string, UserProfile> = {
  trainee: {
    id: "user-trainee-1",
    name: "Ahmed Mohamed",
    nameAr: "أحمد محمد",
    title: "Medical Laboratory Technologist",
    titleAr: "أخصائي تحاليل طبية",
    role: "trainee",
    employeeId: "SL-2024-0482",
    department: "Clinical Chemistry & Hematology",
    departmentAr: "الكيمياء الإكلينيكية وأمراض الدم",
    branch: "Cairo Main Facility (Al-Nasr)",
    branchAr: "فرع القاهرة الرئيسي (النصر)",
    hireDate: "2024-09-01",
    orientationStartDate: "01 Sep 2024",
    orientationEndDate: "30 Nov 2024",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation Path",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات الطبية",
    phase: "Course 2: Laboratory Safety",
    phaseAr: "المقرر الثاني: السلامة والأمان الحيوي",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGgUBhTHQtOx4cCa4r8Jj9pCBL-Z07YKFjSf7em3NxZFQBtPP7yBbC2SsxYkRTDWegzmmj71XVB3dpi_IYu_D8t8BPQ7I8UyXItx8YZXouwPh2NWBmAFs7dnZWj89DMN9ERFYIaEh1keS445KPjAGw6-N3oa1Nx8nBrViO0o3zWlrSeZOFMuygDnonqgSUJybRYiPUbwlxZWhYhMy4ttdfI8HVY0Qj1PTyoWDWwpxnu9hDQ2gzdUXRRA",
    initials: "AM",
    credentialId: "SL-8924-AM",
    overallProgress: 20,
    email: "ahmed.mohamed@shalabylabs.com",
    phone: "+20 100 248 9912"
  },
  training_admin: {
    id: "user-admin-1",
    name: "Dr. Sarah Mansour",
    nameAr: "د. سارة منصور",
    title: "Head of Laboratory Training & Development",
    titleAr: "رئيسة التدريب والتطوير المهني بالمختبرات",
    role: "training_admin",
    employeeId: "SL-TRN-0012",
    department: "Clinical Education & Quality Training",
    departmentAr: "التعليم الإكلينيكي وتدريب الجودة",
    branch: "Headquarters (Cairo)",
    branchAr: "المقر الرئيسي (القاهرة)",
    hireDate: "2019-03-15",
    phase: "Training Supervision",
    phaseAr: "الإشراف والرقابة التدريبية",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuHaEnB3yQGNi0mnbYRO7SDI5gaYsJqGWcLx6StdQ0g5QUDKvIo3qpQyLQc3nramXV9vHwnShnNM-8CLuLmiYfFQVbm_d_s8GRIIX4W4399ChKFkG1tDEGMdV8UxKV27Vndv1MpcHMDG5vURDI40lkAz6T8mcC5wwVdE1B_Ha0qcJrPt7yY8r41w812VpobVFEsA0eYqoSgPlnsKOcC5s8lW9f0jVW11XKgF_hRI-5LyBTf6aGN3PQw",
    initials: "SM",
    credentialId: "SL-ADMIN-SM",
    overallProgress: 100,
    email: "sarah.mansour@shalabylabs.com",
    phone: "+20 102 334 1122"
  },
  system_admin: {
    id: "user-sys-1",
    name: "Eng. Khaled El-Sayed",
    nameAr: "م. خالد السيد",
    title: "Lead Systems & LIMS Administrator",
    titleAr: "مدير النظم والبرمجيات الطبية LIMS",
    role: "system_admin",
    employeeId: "SL-SYS-0004",
    department: "Health Informatics & IT Infrastructure",
    departmentAr: "المعلوماتية الصحية والبنية التقنية",
    branch: "Enterprise Operations Center",
    branchAr: "مركز العمليات التقنية الموحد",
    hireDate: "2018-01-10",
    phase: "LMS Systems Governance",
    phaseAr: "حوكمة نظم التدريب والرقابة",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    initials: "KE",
    credentialId: "SL-SYS-KE",
    overallProgress: 100,
    email: "khaled.elsayed@shalabylabs.com",
    phone: "+20 111 889 0041"
  }
};

export const initialUserProfile = mockPersonas.trainee;

// The 5 Mandatory Sequential Orientation Courses
export const mockSequentialCourses: Course[] = [
  {
    id: "course-1",
    moduleNumber: 1,
    code: "SP-100",
    title: "New Employee Orientation & Laboratory Organization",
    titleAr: "التهيئة والتعريف بأنظمة ومعايير المختبرات",
    description: "Introduction to Shalaby Labs code of conduct, organizational hierarchy, compliance protocols, and core patient identification policies.",
    descriptionAr: "الميثاق المهني لمعامل شلبي، الهيكل التنظيمي للمختبر، سياسات السرية والأمان، وإجراءات التعريف الدقيق بالمرضى.",
    category: "Orientation Fundamentals",
    categoryAr: "أساسيات التوجيه المهني",
    trainingType: "Orientation",
    trainingTypeAr: "مسار التوجيه الإلزامي",
    status: "Completed",
    progress: 100,
    estMinutes: 30,
    passScore: 80,
    allowedAttempts: 3,
    certificateAvailable: true,
    validityMonths: 24,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8cazw4juCQCBfRGq_bzncciOP2nna16naJJOnuOHNG4aWEhHh3AdomEp9IyczOVmf_abndRToBYWFFpVeSpa50fxBNvY_Ao1qAP5OqkFtD78ejcx-ubxhJUzFw4L4RRBWPbaxdeKMSEJFYkxqukGAsBirbr-G0yUx006qUBlLMyV4C5VK03D3aVrCf7SqrnR6nn4m-MtLj99VaGvzfKNp6TfTwwl5lj8VjnMXsbZLX6NHxBKlsVeh_A",
    instructor: "Dr. Sarah Mansour",
    instructorAr: "د. سارة منصور",
    cmeCredits: 2,
    materials: [
      {
        id: "mat-1-1",
        type: "video",
        title: "Welcome & Laboratory Governance Video",
        titleAr: "فيديو الترحيب وحوكمة المنظومة المخبرية",
        durationOrPages: "12 mins",
        durationOrPagesAr: "12 دقيقة"
      },
      {
        id: "mat-1-2",
        type: "pdf",
        title: "Employee Handbook & SOP Guidelines",
        titleAr: "دليل الموظف الجديد وسياسات المختبر SOP",
        durationOrPages: "24 pages",
        durationOrPagesAr: "24 صفحة"
      },
      {
        id: "mat-1-3",
        type: "instructions",
        title: "Mandatory Orientation Milestones & Checklist",
        titleAr: "قائمة مهام فترة التوجيه ومتطلبات الاجتياز",
        durationOrPages: "3 steps",
        durationOrPagesAr: "3 خطوات"
      }
    ]
  },
  {
    id: "course-2",
    moduleNumber: 2,
    code: "SP-101",
    title: "Laboratory Safety & Biosafety Level 2 Protocols",
    titleAr: "السلامة المهنية وبروتوكولات الأمان الحيوي BSL-2",
    description: "Personal protective equipment (PPE), chemical storage, emergency eyewash stations, biological spill cleanup, and fire safety.",
    descriptionAr: "معدات الوقاية الشخصية، التخزين الكيميائي الآمن، محطات غسيل العيون، إدارة الانسكابات البيولوجية، وإجراءات الإخلاء.",
    category: "Safety & Compliance",
    categoryAr: "السلامة والامتثال المهني",
    trainingType: "Orientation",
    trainingTypeAr: "مسار التوجيه الإلزامي",
    status: "In Progress",
    progress: 40,
    estMinutes: 45,
    passScore: 80,
    allowedAttempts: 3,
    prerequisiteCourseId: "course-1",
    prerequisiteCourseCode: "SP-100",
    certificateAvailable: true,
    validityMonths: 12,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9c4yqXcqESQ7PWpL_k8P038Kt5i5xvqsVrG3jM8UM9_XsTtEMzxhAnnT36M0ZydgjygROQXdJKYFalG9RQyUT_s7b075a5iIEJfd8LRaCl5MKbePu2C7ANHHbGlnNnn4j58jrLVjJSlu-cjxqj3uJRfOM1rbaLhU0Z1Bmt8KWAmoZevoOay4uQlX2KtGLGz8hgFTCsjP-TM0q78xTvX6TwG6mCuJi6GrUdZINhRvScl9HVQSQWKsfWA",
    instructor: "Dr. Eleanor Vance",
    instructorAr: "د. إليانور فانس",
    cmeCredits: 3,
    materials: [
      {
        id: "mat-2-1",
        type: "video",
        title: "BSL-2 Protective Equipment & Containment Video",
        titleAr: "فيديو معدات الوقاية الشخصية وإجراءات الاحتواء",
        durationOrPages: "18 mins",
        durationOrPagesAr: "18 دقيقة"
      },
      {
        id: "mat-2-2",
        type: "presentation",
        title: "Biological Spill Kit & Chemical Fume Hood Slides",
        titleAr: "شرائح التعامل مع الانسكابات وكبائن الغازات",
        durationOrPages: "32 slides",
        durationOrPagesAr: "32 شريحة"
      },
      {
        id: "mat-2-3",
        type: "pdf",
        title: "Safety SOP-101: Emergency Incident Protocols",
        titleAr: "دليل التشغيل القياسي SOP-101: خطط الطوارئ المخبرية",
        durationOrPages: "16 pages",
        durationOrPagesAr: "16 صفحة"
      }
    ]
  },
  {
    id: "course-3",
    moduleNumber: 3,
    code: "SP-102",
    title: "Infection Control & Hazardous Waste Management",
    titleAr: "مكافحة العدوى وإدارة النفايات الطبية الخطرة",
    description: "Sharps management, color-coded medical waste segregation, autoclaving validation, and post-exposure prophylaxis (PEP) protocols.",
    descriptionAr: "التعامل الآمن مع الأدوات الحادة، فرز النفايات الطبية حسب اللون، التحقق من دورات الأوتوكلاف، وبروتوكول ما بعد التعرض للوخز.",
    category: "Infection Prevention",
    categoryAr: "مكافحة العدوى والوقاية",
    trainingType: "Orientation",
    trainingTypeAr: "مسار التوجيه الإلزامي",
    status: "Locked",
    progress: 0,
    estMinutes: 40,
    passScore: 80,
    allowedAttempts: 3,
    prerequisiteCourseId: "course-2",
    prerequisiteCourseCode: "SP-101",
    certificateAvailable: true,
    validityMonths: 12,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfiPXundRl1LkDBYNDs1fplS5qTKu4Umg3TTxCeSJpaIEIlSyhXtJ3-ANEENKUNRd8Itf5-tggZjEEzy6N5gBWfCB0fpb0QSzaZd40bNMitqNAq1ZuHkRklC0Ta8P7kQ-xpxi_vVgRKcFh1Yc_Xz7o4w6pM1ImkVBU8FSsh9CMsmCpCc7usSRHZc7oo_StMWhlSNJK5kh3XBweFmJGxKmrZ3WG8TG_K1_0YgCIHDy-f9qFSFUQJpvr5g",
    instructor: "Dr. Tarek Hegazy",
    instructorAr: "د. طارق حجازي",
    cmeCredits: 3,
    materials: [
      {
        id: "mat-3-1",
        type: "video",
        title: "Waste Segregation & Sharps Injury Prevention Video",
        titleAr: "فيديو فرز النفايات والوقاية من وخز الإبر",
        durationOrPages: "15 mins",
        durationOrPagesAr: "15 دقيقة"
      },
      {
        id: "mat-3-2",
        type: "pdf",
        title: "SOP-102: Biohazard Waste Classification & Disposal",
        titleAr: "دليل SOP-102: تصنيف والتخلص من النفايات الحيوية الخطرة",
        durationOrPages: "14 pages",
        durationOrPagesAr: "14 صفحة"
      }
    ]
  },
  {
    id: "course-4",
    moduleNumber: 4,
    code: "SP-201",
    title: "Specimen Handling, Rejection & Accessioning Integrity",
    titleAr: "سحب ومعالجة العينات ومعايير القبول والرفض",
    description: "Order of draw, tube additives, centrifuge balancing, cold-chain bio-banking, critical sample rejection criteria, and barcode tracking.",
    descriptionAr: "ترتيب سحب العينات، موانع التجلط والمواد المضافة، موازنة الطرد المركزي، سلسلة التبريد، ومعايير رفض العينات غير المطابقة.",
    category: "Pre-Analytical Excellence",
    categoryAr: "مرحلة ما قبل التحليل",
    trainingType: "Orientation",
    trainingTypeAr: "مسار التوجيه الإلزامي",
    status: "Locked",
    progress: 0,
    estMinutes: 50,
    passScore: 80,
    allowedAttempts: 3,
    prerequisiteCourseId: "course-3",
    prerequisiteCourseCode: "SP-102",
    certificateAvailable: true,
    validityMonths: 24,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    instructor: "Dr. Marcus Reed",
    instructorAr: "د. ماركوس ريد",
    cmeCredits: 4,
    materials: [
      {
        id: "mat-4-1",
        type: "video",
        title: "Accessioning Verification & Centrifugation Video",
        titleAr: "فيديو تدقيق الاستلام الإلكتروني والطرد المركزي",
        durationOrPages: "22 mins",
        durationOrPagesAr: "22 دقيقة"
      },
      {
        id: "mat-4-2",
        type: "presentation",
        title: "Hemolysis, Lipemia & Icterus Visual Guide",
        titleAr: "دليل التحقق البصري من تكسر الدم وتجمع الدهون",
        durationOrPages: "28 slides",
        durationOrPagesAr: "28 شريحة"
      }
    ]
  },
  {
    id: "course-5",
    moduleNumber: 5,
    code: "SP-301",
    title: "Clinical Quality Control & Westgard Multirule Automation",
    titleAr: "ضبط ومراقبة الجودة الإكلينيكية وقواعد ويستغارد",
    description: "Levey-Jennings charts, Westgard rejection rules (1:2s, 1:3s, 2:2s, R:4s), calibration drift detection, and critical result escalation.",
    descriptionAr: "مخططات ليفي جينينغز، قواعد ويستغارد الإحصائية، اكتشاف الانحراف المنهجي للأجهزة، وبروتوكول إبلاغ النتائج الحرجة.",
    category: "Analytical Quality & Accreditation",
    categoryAr: "الجودة التحليلية والاعتماد",
    trainingType: "Orientation",
    trainingTypeAr: "مسار التوجيه الإلزامي",
    status: "Locked",
    progress: 0,
    estMinutes: 60,
    passScore: 80,
    allowedAttempts: 3,
    prerequisiteCourseId: "course-4",
    prerequisiteCourseCode: "SP-201",
    certificateAvailable: true,
    validityMonths: 12,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPsc6frwqkN6TJw0lVlejnvGCgSjKeeegGNmCq52itX3bHXKSrzOGysASznD9kMc9Fg0s0Zvkz-UpoC-k1oSHfV-4Kyj__iGQXxKUKVwxy427Q5-riO40xOpKp_-9Fudjwlr9U2PNFByeRlcXdQ0b3j5O_PzjIynDtrZMQpfWZDB0M9Q5YZT3hOtHo9UxnfMvkil-1DD7dq5J1PXAzvhcYdqO7ncpi8Qaf9yY5lO7JSZI9C9ypvO4tvg",
    instructor: "Dr. Amira Shalaby",
    instructorAr: "د. أميرة شلبي",
    cmeCredits: 5,
    materials: [
      {
        id: "mat-5-1",
        type: "video",
        title: "Westgard Rules Application & Calibration Lecture",
        titleAr: "محاضرة تطبيق قواعد ويستغارد ومعايرة الأجهزة",
        durationOrPages: "25 mins",
        durationOrPagesAr: "25 دقيقة"
      },
      {
        id: "mat-5-2",
        type: "pdf",
        title: "QC Manual: Out-of-Control Corrective Action Plan (CAPA)",
        titleAr: "دليل الجودة: خطة الإجراءات التصحيحية والوقائية CAPA",
        durationOrPages: "20 pages",
        durationOrPagesAr: "20 صفحة"
      }
    ]
  }
];

export const mockModules = mockSequentialCourses;
export const mockCourses = mockSequentialCourses;

// Detailed Question Bank with Randomized Pool per course
export const mockQuestionBank: QuizQuestion[] = [
  // Course 1 (SP-100)
  {
    id: 101,
    courseId: "course-1",
    questionNumber: 1,
    totalQuestions: 4,
    question: "According to laboratory accreditation standards, what are the primary two patient identifiers required before specimen collection?",
    questionAr: "وفقاً لمعايير الاعتماد المخبري، ما هما المعرّفان الأساسيان الواجب التحقق منهما قبل سحب العينة؟",
    hint: "Recall standard patient safety goals regarding full names and unique medical records.",
    hintAr: "تذكر معايير أمان المرضى بخصوص الاسم الكامل ورقم الملف الطبي.",
    options: [
      "Patient's room number and bed location.",
      "Patient's full official name and unique Medical Record Number (MRN).",
      "Attending physician's name and clinic number.",
      "Insurance policy card number and test date."
    ],
    optionsAr: [
      "رقم غرفة المريض ورقم السرير.",
      "الاسم الرسمي الكامل للمريض ورقم السجل الطبي الموحد (MRN).",
      "اسم الطبيب المعالج ورقم العيادة.",
      "رقم بطاقة التأمين وتاريخ إجراء التحليل."
    ],
    correctIndex: 1,
    explanation: "Accreditation guidelines strictly mandate at least two unique identifiers (Full Name and MRN or Date of Birth). Room or bed numbers are never acceptable identifiers.",
    explanationAr: "تشترط معايير الاعتماد معرّفين فريدين على الأقل (الاسم الكامل ورقم الملف الطبي أو تاريخ الميلاد)، ولا يُعتمد رقم الغرفة أو السرير مطلقاً.",
    moduleRef: "SOP-001: Patient Identification Policy",
    moduleRefAr: "دليل SOP-001: سياسة التحقق من هوية المرضى",
    difficulty: "Basic"
  },
  {
    id: 102,
    courseId: "course-1",
    questionNumber: 2,
    totalQuestions: 4,
    question: "Under Shalaby Labs confidentiality and patient data regulations, when is an employee allowed to disclose lab results over the telephone?",
    questionAr: "في إطار سياسات سرية وحماية بيانات المرضى، متى يُسمح للموظف بإبلاغ نتائج التحاليل هاتفياً؟",
    hint: "Critical lab results have a strict documented verbal read-back procedure.",
    hintAr: "النتائج الحرجة تتطلب إجراءات إبلاغ شفهي محددة مع طلب إعادة القراءة للتأكيد.",
    options: [
      "To any caller who states they are a family relative.",
      "Only for authorized critical/panic values to verified clinical personnel using mandatory read-back.",
      "At any time if the caller knows the patient's age and tests.",
      "Never under any circumstances, even in acute emergency care."
    ],
    optionsAr: [
      "لأي متصل يدعي أنه من أفراد عائلة المريض.",
      "فقط في حالات النتائج الحرجة (Critical Values) للكوادر الطبية المعتمدة مع التحقق وإعادة القراءة Read-Back.",
      "في أي وقت إذا كان المتصل يعلم سن المريض ونوع الفحص.",
      "لا يُسمح إطلاقاً بأي حال من الأحوال حتى في الطوارئ."
    ],
    correctIndex: 1,
    explanation: "Verbal transmission of results is restricted to urgent critical values to licensed caregivers with documented read-back to prevent fatal diagnostic errors.",
    explanationAr: "يقتصر الإبلاغ الهاتفي على النتائج الحرجة المستعجلة للكوادر الطبية المرخصة مع توثيق إعادة القراءة منعاً للأخطاء الطبية القاتلة.",
    moduleRef: "SOP-004: Communication of Diagnostic Findings",
    moduleRefAr: "دليل SOP-004: سياسة إبلاغ النتائج التشخيصية",
    difficulty: "Intermediate"
  },
  {
    id: 103,
    courseId: "course-1",
    questionNumber: 3,
    totalQuestions: 4,
    question: "What is the mandatory action when a newly hired technologist observes an unverified calibration sticker on a hematology analyzer?",
    questionAr: "ما هو الإجراء الإلزامي عند ملاحظة ملصق معايرة غير معتمد أو منتهي على جهاز عد الدم؟",
    hint: "Instrumentation cannot be utilized for patient samples if calibration is out of compliance.",
    hintAr: "يمنع تشغيل الأجهزة لعينات المرضى إذا كانت المعايرة غير سارية وموثقة.",
    options: [
      "Proceed with patient runs and report it at the end of the shift.",
      "Immediately tag the instrument Out of Service and notify Quality & Training lead.",
      "Remove the sticker and run a single normal control.",
      "Calibrate the machine without recording changes in the maintenance log."
    ],
    optionsAr: [
      "الاستمرار في تحليل عينات المرضى والإبلاغ بنهاية الوردية.",
      "وضع علامة 'خارج الخدمة' فوراً وإبلاغ مسؤول الجودة والتدريب.",
      "إزالة الملصق وإجراء اختبار لمحلول ضابط واحد فقط.",
      "معايرة الجهاز دون توثيق التعديل في سجل الصيانة."
    ],
    correctIndex: 1,
    explanation: "Uncalibrated instruments must be isolated with 'Out of Service' lockout tags immediately to prevent erroneous clinical patient results.",
    explanationAr: "يجب عزل الجهاز فوراً بوضع علامة 'خارج الخدمة' لحماية عينات المرضى من أي نتائج مضللة وإبلاغ المشرف.",
    moduleRef: "SOP-007: Analyzer Validation Protocols",
    moduleRefAr: "دليل SOP-007: التحقق من جاهزية أجهزة التحليل",
    difficulty: "Basic"
  },
  {
    id: 104,
    courseId: "course-1",
    questionNumber: 4,
    totalQuestions: 4,
    question: "What constitutes the required sequential completion policy during the laboratory orientation period?",
    questionAr: "ما هي السياسة المنظمة لإتمام مقررات المسار التوجيهي للموظف الجديد في المختبر؟",
    hint: "Recall the core rule: no jumping courses, pass threshold >= 80%.",
    hintAr: "تذكر القاعدة الأساسية: عدم تخطي أي كورس، ونسبة نجاح 80% فأكثر.",
    options: [
      "Employees can complete any course in any desired order within 1 year.",
      "Employees must complete courses sequentially, reviewing all materials and scoring >= 80% to unlock each next stage.",
      "Only the final exam is graded; intermediate courses are optional.",
      "Quizzes can be skipped if the supervisor signs an oral waiver."
    ],
    optionsAr: [
      "يمكن للموظف إنجاز أي كورس بأي ترتيب يفضله خلال عام كامل.",
      "يجب إتمام المقررات بالتسلسل الصارم، ودراسة المحتوى وتحقيق 80% فأكثر لفتح الكورس التالي.",
      "الاختبار النهائي هو الوحيد الخاضع للتقييم والمقررات السابقة اختيارية.",
      "يمكن تخطي الاختبارات بموافقة شفهية من المشرف."
    ],
    correctIndex: 1,
    explanation: "Laboratory accreditation enforces strict sequential mastery: theoretical study, passing the threshold (>= 80%), and certification before proceeding.",
    explanationAr: "تفرض معايير التدريب المخبري التسلسل الصارم والاجتياز بنسبة 80% فأكثر قبل فك القفل عن الكورس التالي.",
    moduleRef: "Orientation Manual Section 1.2",
    moduleRefAr: "دليل التوجيه - البند 1.2",
    difficulty: "Basic"
  },

  // Course 2 (SP-101) - Lab Safety
  {
    id: 201,
    courseId: "course-2",
    questionNumber: 1,
    totalQuestions: 4,
    question: "When doffing personal protective equipment (PPE) after handling BSL-2 infectious samples, what is the mandatory sequence?",
    questionAr: "عند خلع معدات الوقاية الشخصية (PPE) بعد معالجة عينات BSL-2 المعدية، ما هو التسلسل الإلزامي لمنع التلوث الذاتي؟",
    hint: "Peel the most contaminated external surface first.",
    hintAr: "ابدأ بالعنصر الخارجي الأكثر تلوثاً.",
    options: [
      "Gloves first, followed by eye protection/goggles, lab coat/gown, and finally mask/respirator.",
      "Gown and gloves simultaneously, then eye protection.",
      "Face mask first, then gloves, then gown.",
      "Goggles first, then gown, and gloves last."
    ],
    optionsAr: [
      "القفازات أولاً، ثم النظارات الواقية، ثم معطف المختبر، وأخيراً القناع التنفسي.",
      "المعطف والقفازات معاً، ثم النظارات.",
      "قناع الوجه أولاً، ثم القفازات، ثم المعطف.",
      "النظارات أولاً، ثم المعطف، وأخيراً القفازات."
    ],
    correctIndex: 0,
    explanation: "Gloves harbor the highest pathogen burden and must be peeled off first. Eye protection, gown, and respirator follow in sequence followed immediately by hand hygiene.",
    explanationAr: "تعتبر القفازات الأكثر تلوثاً ويجب خلعها أولاً، تليها النظارات ثم المعطف ثم القناع، مع غسل اليدين فوراً.",
    moduleRef: "SOP-101.1: PPE Protocols",
    moduleRefAr: "دليل SOP-101.1: بروتوكول معدات الوقاية",
    difficulty: "Intermediate"
  },
  {
    id: 202,
    courseId: "course-2",
    questionNumber: 2,
    totalQuestions: 4,
    question: "What is the minimum required wet contact time for a 1:10 sodium hypochlorite solution to neutralize a blood spill on a laboratory bench?",
    questionAr: "ما هو الحد الأدنى لوقت الملامسة الرطبة لمحلول هيبوكلوريت الصوديوم 1:10 لتعقيم انسكاب دم على طاولة المختبر؟",
    hint: "Recall the required contact time to kill resistant bloodborne viruses (HBV, HCV, HIV).",
    hintAr: "تذكر الوقت الكافي للقضاء على الفيروسات الكبدية المقاومة.",
    options: [
      "30 seconds followed by immediate wipe.",
      "15 minutes of undisturbed wet dwell time.",
      "1 minute under ambient ventilation.",
      "60 minutes under intense heat lamp."
    ],
    optionsAr: [
      "30 ثانية مع المسح الفوري.",
      "15 دقيقة من الملامسة الرطبة دون تجفيف سريع.",
      "دقيقة واحدة في الهواء العادي.",
      "60 دقيقة تحت مصباح حراري."
    ],
    correctIndex: 1,
    explanation: "CDC and OSHA guidelines mandate a minimum of 15 minutes wet dwell time for 1:10 bleach solutions to inactivate Hepatitis B and C viruses.",
    explanationAr: "تشترط إرشادات السلامة 15 دقيقة على الأقل لبقاء المحلول رطباً لضمان تعطيل الفيروسات المنقولة بالدم كفيروس B و C.",
    moduleRef: "SOP-101.4: Chemical & Biological Spills",
    moduleRefAr: "دليل SOP-101.4: الانسكابات البيولوجية والكيميائية",
    difficulty: "Intermediate"
  },
  {
    id: 203,
    courseId: "course-2",
    questionNumber: 3,
    totalQuestions: 4,
    question: "Where must volatile flammable organic solvents (e.g., methanol, xylene) be safely stored?",
    questionAr: "أين يجب تخزين المذيبات العضوية القابلة للاشتعال والتطاير (مثل الميثانول والزيلين) بشكل آمن؟",
    hint: "Flammables require spark-proof containment and active ventilation.",
    hintAr: "المواد القابلة للاشتعال تتطلب خزانات مقاومة للحرارة والشرر.",
    options: [
      "On open laboratory benchtops near the sink.",
      "In a certified fire-rated, spark-proof flammable safety cabinet.",
      "In standard household breakroom refrigerators.",
      "Under ordinary wooden cabinetry near centrifuges."
    ],
    optionsAr: [
      "على أسطح العمل المكشوفة بجوار الأحواض.",
      "في خزانات أمان معدنية مقاومة للحريق والشرر الكهربائي.",
      "في ثلاجات استراحة الموظفين العادية.",
      "تحت الخزائن الخشبية بالقرب من أجهزة الطرد المركزي."
    ],
    correctIndex: 1,
    explanation: "Flammable solvents produce explosive vapors and must reside in certified fire-rated cabinets equipped with flame arresters.",
    explanationAr: "المذيبات المتطايرة تنتج أبخرة قابلة للانفجار وتستوجب الحفظ في خزانات معدنية مقاومة للاشتعال.",
    moduleRef: "SOP-101.8: Hazardous Chemical Management",
    moduleRefAr: "دليل SOP-101.8: إدارة المواد الكيميائية الخطرة",
    difficulty: "Intermediate"
  },
  {
    id: 204,
    courseId: "course-2",
    questionNumber: 4,
    totalQuestions: 4,
    question: "What should be done immediately if an accidental splash of biological serum enters a technologist's eyes?",
    questionAr: "ما هو الإجراء الفوري الواجب اتخاذه عند تناثر مصل حيوي أو دم في عين الأخصائي بالخطأ؟",
    hint: "Emergency eyewash stations must run continuously for at least 15 minutes.",
    hintAr: "يجب استخدام محطة غسيل العيون الطارئة لمدة 15 دقيقة متواصلة.",
    options: [
      "Blink rapidly and wipe eyes with clean tissue paper.",
      "Flush eyes immediately at the emergency eyewash station for a continuous 15 minutes and seek urgent medical evaluation.",
      "Apply eye drops and resume processing specimens.",
      "Wait until the end of the shift to report the splash."
    ],
    optionsAr: [
      "الرمش سريعاً ومسح العين بمنديل ورقي نظيف.",
      "غسل العين فوراً في محطة غسيل العيون لمدة 15 دقيقة متواصلة ومراجعة طبيب الطوارئ فوراً.",
      "وضع قطرة مرطبة واستكمال معالجة العينات.",
      "الانتظار حتى نهاية الوردية للإبلاغ عن الحادثة."
    ],
    correctIndex: 1,
    explanation: "Eye splashes require immediate continuous flushing for 15 minutes at an eyewash unit, followed by incident logging and post-exposure prophylaxis triage.",
    explanationAr: "يتطلب تناثر السوائل بالعين الغسيل الفوري المتواصل لمدة 15 دقيقة في محطة غسيل العيون ثم التقييم الطبي وتوثيق الحادث.",
    moduleRef: "SOP-101.12: Emergency Eyewash & Post-Exposure",
    moduleRefAr: "دليل SOP-101.12: إجراءات الطوارئ ومحطات غسيل العيون",
    difficulty: "Basic"
  },

  // Course 3 (SP-102) - Infection Control
  {
    id: 301,
    courseId: "course-3",
    questionNumber: 1,
    totalQuestions: 4,
    question: "At what fill level must rigid sharps disposal containers be permanently locked and disposed of to prevent needle-stick injuries?",
    questionAr: "عند أي مستوى امتلاء يجب إغلاق حاويات الأدوات الحادة والتخلص منها لمنع وخز الإبر؟",
    hint: "Never allow sharps bins to overflow.",
    hintAr: "لا تترك حاويات الأدوات الحادة تمتلئ حتى الحافة مطلقاً.",
    options: [
      "100% full to conserve biohazard supplies.",
      "3/4 (75%) full, or when sharps reach the indicated fill line.",
      "Halfway (50%) after each single patient.",
      "Only when the lid cannot be forced closed."
    ],
    optionsAr: [
      "عند امتلاء 100% لتوفير الحاويات.",
      "عند وصولها إلى 3/4 السعة (75%) أو خط الامتلاء المحدد.",
      "عند النصف (50%) بعد كل مريض.",
      "فقط عندما يتعذر إغلاق الغطاء بالقوة."
    ],
    correctIndex: 1,
    explanation: "OSHA mandates disposal of sharps bins when 3/4 full to prevent protruding needles and dangerous recapping attempts.",
    explanationAr: "تفرض معايير السلامة التخلص من الحاويات عند امتلاء 75% لمنع بروز الإبر وخطر الوخز.",
    moduleRef: "SOP-102.2: Sharps Safety",
    moduleRefAr: "دليل SOP-102.2: أمان الأدوات الحادة",
    difficulty: "Basic"
  },
  {
    id: 302,
    courseId: "course-3",
    questionNumber: 2,
    totalQuestions: 4,
    question: "What is the designated biohazard waste container color for infectious non-anatomical clinical waste in international laboratory protocols?",
    questionAr: "ما هو لون حاوية النفايات الحيوية المخصصة للمخلفات السريرية المعدية غير التشريحية وفقاً للبروتوكولات الدولية؟",
    hint: "Think about standard international biohazard color coding.",
    hintAr: "فكر في الترميز اللوني القياسي للنفايات البيولوجية الخطرة.",
    options: [
      "Yellow biohazard bag / container.",
      "Black household garbage bag.",
      "Blue recycling bin.",
      "Clear transparent plastic bin."
    ],
    optionsAr: [
      "الأكياس والحاويات الصفراء المخصصة للنفايات الحيوية الخطرة.",
      "الأكياس السوداء المخصصة للنفايات العادية.",
      "الحاويات الزرقاء لإعادة التدوير.",
      "الأكياس الشفافة العادية."
    ],
    correctIndex: 0,
    explanation: "Yellow bags and rigid yellow containers are universally designated for infectious laboratory waste destined for autoclaving or incineration.",
    explanationAr: "تُخصص الحاويات والأكياس الصفراء دولياً لكافة النفايات المخبرية المعدية الخاضعة للأوتوكلاف أو الحرق الطبي.",
    moduleRef: "SOP-102.4: Waste Color Coding",
    moduleRefAr: "دليل SOP-102.4: الترميز اللوني للنفايات",
    difficulty: "Basic"
  },
  {
    id: 303,
    courseId: "course-3",
    questionNumber: 3,
    totalQuestions: 4,
    question: "How is steam sterilization autoclave efficacy routinely validated in accredited clinical microbiology laboratories?",
    questionAr: "كيف يتم التحقق الدوري من كفاءة التعقيم بالبخار المضغوط (الأوتوكلاف) في المختبرات الطبية المعتمدة؟",
    hint: "Chemical indicators change color, but biological spores provide definitive proof of kill.",
    hintAr: "المؤشرات الكيميائية تغير اللون لكن الأبواغ البكتيرية هي الإثبات القاطع للقضاء على الميكروبات.",
    options: [
      "Only checking chamber pressure gauge once per month.",
      "Using Geobacillus stearothermophilus biological spore ampoules alongside physical and chemical integrators.",
      "Visual inspection of the outer wrapping paper color.",
      "Measuring ambient temperature outside the autoclave unit."
    ],
    optionsAr: [
      "فحص مقياس ضغط الغرفة فقط مرة شهرياً.",
      "استخدام أمبولات الأبواغ البيولوجية Geobacillus stearothermophilus مع المؤشرات الفيزيائية والكيميائية.",
      "المعاينة البصرية للون ورق التغليف الخارجي.",
      "قياس درجة حرارة الغرفة المحيطة بجهاز الأوتوكلاف."
    ],
    correctIndex: 1,
    explanation: "ISO 15189 requires weekly biological spore testing with Geobacillus stearothermophilus to ensure absolute lethality against heat-resistant bacterial endospores.",
    explanationAr: "تشترط معايير الاعتماد فحصاً دورياً بأبواغ Geobacillus stearothermophilus للتأكد التام من القضاء على الأبواغ البكتيرية المقاومة للحرارة.",
    moduleRef: "SOP-102.7: Autoclave QC Validation",
    moduleRefAr: "دليل SOP-102.7: التحقق من كفاءة التعقيم",
    difficulty: "Advanced"
  },
  {
    id: 304,
    courseId: "course-3",
    questionNumber: 4,
    totalQuestions: 4,
    question: "Following a contaminated needle-stick injury, what is the critical time window to initiate Post-Exposure Prophylaxis (PEP) for maximum preventive efficacy?",
    questionAr: "بعد التعرض لوخزة إبرة ملوثة، ما هي النافذة الزمنية الحرجة لبدء العلاج الوقائي بعد التعرض (PEP) لتحقيق أقصى فعالية؟",
    hint: "Antiviral prophylaxis is most effective within hours.",
    hintAr: "العلاج الوقائي بمضادات الفيروسات يكون في قمة فاعليته خلال ساعات قليلة.",
    options: [
      "Within 2 hours ideally, and no later than 72 hours post-exposure.",
      "Within 7 to 14 days after symptoms appear.",
      "Only after 1 month following repeat antibody titers.",
      "PEP is never necessary for laboratory staff."
    ],
    optionsAr: [
      "خلال ساعتين ويفضل ألا يتجاوز 72 ساعة من وقت التعرض للوخز.",
      "خلال 7 إلى 14 يوماً بعد ظهور أي أعراض.",
      "بعد شهر كامل فقط بعد فحص الأجسام المضادة.",
      "لا يلزم أخذ أي علاج وقائي للعاملين بالمختبر."
    ],
    correctIndex: 0,
    explanation: "CDC occupational health guidelines recommend initiating PEP as soon as possible, ideally within 2 hours and definitely within 72 hours of exposure.",
    explanationAr: "توصي الإرشادات ببدء العلاج الوقائي فوراً (خلال ساعتين وخلال 72 ساعة كحد أقصى) لتثبيط تكاثر الفيروسات المنقولة.",
    moduleRef: "SOP-102.9: Post-Exposure Prophylaxis Protocol",
    moduleRefAr: "دليل SOP-102.9: بروتوكول الوقاية بعد التعرض للوخز",
    difficulty: "Intermediate"
  },

  // Course 4 (SP-201) - Specimen Handling & Accessioning
  {
    id: 401,
    courseId: "course-4",
    questionNumber: 1,
    totalQuestions: 4,
    question: "According to CLSI GP41 standards, what is the correct order of draw for vacuum blood collection tubes?",
    questionAr: "وفقاً لمعايير CLSI GP41، ما هو الترتيب الصحيح لسحب أنابيب الدم الوريدي لمنع التلوث المتبادل للمواد المضافة؟",
    hint: "Blood cultures first, followed by sodium citrate, serum tubes, heparin, and EDTA last before fluoride.",
    hintAr: "مزارع الدم أولاً، تليها سترات الصوديوم، ثم أنابيب المصل، ثم الهيبارين، وأخيراً EDTA.",
    options: [
      "EDTA (Lavender) → Heparin (Green) → Serum (Red/Gold) → Blood Cultures.",
      "Blood Cultures → Sodium Citrate (Light Blue) → Serum (Red/Gold) → Heparin (Green) → EDTA (Lavender) → Sodium Fluoride (Gray).",
      "Sodium Fluoride (Gray) → EDTA (Lavender) → Heparin (Green) → Serum.",
      "Order does not matter as long as tubes are inverted 50 times."
    ],
    optionsAr: [
      "أنابيب EDTA (البنفسجي) → الهيبارين (الأخضر) → المصل (الأحمر/الذهبي) → مزارع الدم.",
      "مزارع الدم → سترات الصوديوم (الأزرق) → المصل (الأحمر/الذهبي) → الهيبارين (الأخضر) → EDTA (البنفسجي) → فلوريد الصوديوم (الرمادي).",
      "فلوريد الصوديوم (الرمادي) → EDTA → الهيبارين → المصل.",
      "الترتيب غير مهم طالما تم رج الأنبوب 50 مرة."
    ],
    correctIndex: 1,
    explanation: "Drawing EDTA before serum or blue tubes causes potassium cross-contamination and artificial chelation of calcium, ruining coagulation and electrolyte results.",
    explanationAr: "سحب أنابيب EDTA قبل أنابيب التجلط أو الكيمياء يؤدي إلى تلوث متبادل للبوتاسيوم وتثبيط الكالسيوم مما يفسد نتائج التجلط والشوارد.",
    moduleRef: "SOP-201.2: Phlebotomy Order of Draw",
    moduleRefAr: "دليل SOP-201.2: ترتيب سحب عينات الدم",
    difficulty: "Intermediate"
  },
  {
    id: 402,
    courseId: "course-4",
    questionNumber: 2,
    totalQuestions: 4,
    question: "Why must hemolyzed serum samples be strictly rejected for clinical serum potassium (K+) testing?",
    questionAr: "لماذا يجب رفض عينات المصل المتكسرة (Hemolyzed) تماماً لتحليل البوتاسيوم في الدم (K+)؟",
    hint: "Potassium concentration inside red blood cells is approximately 20 times higher than in serum.",
    hintAr: "تركيز البوتاسيوم داخل كريات الدم الحمراء أعلى بنحو 20 ضعفاً من تركيزه في المصل.",
    options: [
      "Hemolysis makes the serum turn green which clogs the analyzer pipette.",
      "Intracellular red blood cell potassium leaks into serum, causing falsely marked hyperkalemia that could trigger dangerous clinical mismanagement.",
      "Hemolyzed blood cannot be centrifuged under any circumstance.",
      "Hemolysis only affects glucose and has zero impact on potassium."
    ],
    optionsAr: [
      "التكسر يجعل لون المصل أخضراً مما يسد مجسات الجهاز.",
      "تسرب البوتاسيوم الداخلي من كريات الدم الحمراء المتكسرة إلى المصل يسبب ارتفاعاً كاذباً خطيراً في البوتاسيوم قد يضلل العلاج الطبي.",
      "العينات المتكسرة لا يمكن فصلها بالطرد المركزي إطلاقاً.",
      "التكسر يؤثر فقط على السكر ولا يؤثر على البوتاسيوم إطلاقاً."
    ],
    correctIndex: 1,
    explanation: "RBCs contain high intracellular K+ (~150 mmol/L compared to ~4 mmol/L in serum). Cell lysis artificially spikes serum K+, simulating severe hyperkalemia.",
    explanationAr: "تحتوي كريات الدم الحمراء على تركيز عالٍ جداً من البوتاسيوم، وتكسرها يفرغ هذا المخزون في المصل متسبباً في ارتفاع وهمي حرج للبوتاسيوم.",
    moduleRef: "SOP-201.5: Specimen Rejection Criteria (HIL)",
    moduleRefAr: "دليل SOP-201.5: معايير رفض العينات المتكسرة",
    difficulty: "Intermediate"
  },
  {
    id: 403,
    courseId: "course-4",
    questionNumber: 3,
    totalQuestions: 4,
    question: "What is the mandatory action when a centrifuge exhibits excessive vibration or grinding noise during specimen spinning?",
    questionAr: "ما هو الإجراء الإلزامي الفوري عند صدور اهتزاز عنيف أو صوت احتكاك من جهاز الطرد المركزي أثناء الدوران؟",
    hint: "Centrifuge imbalance can cause catastrophic bucket failure and aerosol release.",
    hintAr: "اختلال توازن جهاز الطرد قد يسبب انفجار الحوامل وتطاير رذاذ العينات.",
    options: [
      "Increase rotation speed (RPM) to force self-balance.",
      "Immediately cut power or press emergency stop, do NOT open lid until rotor stops completely, and wait 30 minutes if aerosol rupture is suspected.",
      "Hold down the centrifuge lid with hands until it finishes.",
      "Ignore noise if the timer is under 3 minutes."
    ],
    optionsAr: [
      "زيادة سرعة الدوران لإجبار الحوامل على التوازن الذاتي.",
      "فصل الطاقة فوراً أو الضغط على زر التوقف الطارئ، وعدم فتح الغطاء حتى يتوقف الدوران تماماً، والانتظار 30 دقيقة في حال الشك بكسر أنابيب لتفادي الرذاذ.",
      "الضغط باليدين على غطاء الجهاز حتى تنتهي الدورة.",
      "تجاهل الصوت إذا كان الوقت المتبقي أقل من 3 دقائق."
    ],
    correctIndex: 1,
    explanation: "Centrifuge imbalance can shatter glass/plastic tubes and generate hazardous aerosols. The unit must stop completely and be decontaminated per SOP-201.",
    explanationAr: "عدم توازن الطرد المركزي قد يؤدي لكسر الأنابيب وتطاير رذاذ ملوث، ويجب إيقافه فوراً وعدم الفتح قبل توقف الدوار والتعقيم وفق البروتوكول.",
    moduleRef: "SOP-201.8: Centrifugation Balancing & Safety",
    moduleRefAr: "دليل SOP-201.8: موازنة وأمان أجهزة الطرد المركزي",
    difficulty: "Basic"
  },
  {
    id: 404,
    courseId: "course-4",
    questionNumber: 4,
    totalQuestions: 4,
    question: "Under ISO 15189 pre-analytical guidelines, which condition requires immediate sample rejection without compromise?",
    questionAr: "تحت معايير ISO 15189 لمرحلة ما قبل التحليل، أي من الحالات التالية تستوجب رفض العينة فوراً دون أي استثناء؟",
    hint: "Unlabeled or mismatched tubes represent patient safety hazards.",
    hintAr: "الأنابيب غير المعرفة أو المتضاربة تمثل خطراً جسيماً على سلامة المريض.",
    options: [
      "Unlabeled primary specimen tube or label mismatch with the electronic LIMS accessioning order.",
      "Blood drawn before 8:00 AM.",
      "Sample delivered by a certified courier.",
      "A tube with 4.5 mL volume in a 5 mL container."
    ],
    optionsAr: [
      "أنبوبة عينة أولية غير ملصق عليها كود المريض، أو وجود تضارب بين بيانات الملصق والطلب الإلكتروني في LIMS.",
      "سحب العينة قبل الساعة 8:00 صباحاً.",
      "توصيل العينة عبر ناقل طبي معتمد.",
      "امتلاء الأنبوبة بحجم 4.5 مل في أنبوبة سعة 5 مل."
    ],
    correctIndex: 0,
    explanation: "Unlabeled or misidentified specimens carry high risk of catastrophic misdiagnosis. Relabeling is strictly forbidden under CAP and ISO accreditation rules.",
    explanationAr: "العينات مجهولة الهوية أو المتضاربة تشكل خطراً جسيماً للتشخيص الخاطئ، ويُحظر قطيعاً إعادة لصق بيانات عليها من جديد.",
    moduleRef: "SOP-201.10: Uncompromised Accessioning Safety",
    moduleRefAr: "دليل SOP-201.10: أمان استلام وتسجيل العينات",
    difficulty: "Basic"
  },

  // Course 5 (SP-301) - Clinical Quality Control & Westgard Multirules
  {
    id: 501,
    courseId: "course-5",
    questionNumber: 1,
    totalQuestions: 4,
    question: "In statistical laboratory quality control, what does a Westgard 1:3s violation signify?",
    questionAr: "في ضبط الجودة الإحصائي للمختبرات، إلى ماذا تشير مخالفة قاعدة ويستغارد 1:3s؟",
    hint: "A single control measurement exceeds ±3 standard deviations from the established mean.",
    hintAr: "قراءة كنترول واحدة تتجاوز ±3 انحرافات معيارية عن المتوسط الحسابي.",
    options: [
      "It is an informational note; patient runs may proceed normally.",
      "A run rejection rule indicating a severe random or systematic error; patient results MUST be held and not released.",
      "Controls are running exceptionally well.",
      "Re-calibrate only after 5 days of repeated occurrences."
    ],
    optionsAr: [
      "مجرد ملاحظة تحذيرية؛ ويمكن استخراج نتائج المرضى بشكل طبيعي.",
      "قاعدة رفض ملزمة للتشغيلة تدل على خطأ عشوائي أو منهجي جسيم؛ ويجب حظر إخراج نتائج المرضى لحين حل المشكلة.",
      "أن جهاز التحليل يعمل بأعلى درجات الدقة الإحصائية.",
      "إعادة المعايرة بعد 5 أيام فقط في حال تكررت الملاحظة."
    ],
    correctIndex: 1,
    explanation: "The 1:3s rule is an immediate run-rejection rule with high probability of error (exceeding 99.7% confidence interval). Patient reporting must be halted.",
    explanationAr: "تعتبر قاعدة 1:3s قاعدة رفض قطعية للتشغيلة لتجاوزها حدود الثقة 99.7%، ويُحظر اعتماد أي نتيجة مريض قبل الإجراء التصحيحي.",
    moduleRef: "SOP-301.2: Westgard Multirule Evaluation",
    moduleRefAr: "دليل SOP-301.2: تقييم قواعد ويستغارد الإحصائية",
    difficulty: "Intermediate"
  },
  {
    id: 502,
    courseId: "course-5",
    questionNumber: 2,
    totalQuestions: 4,
    question: "Which Westgard multirule violation is specifically sensitive to systematic error (calibration drift or reagent degradation)?",
    questionAr: "أي من مخالفات قواعد ويستغارد التالية حساسة بشكل خاص لاكتشاف الخطأ المنهجي Systematic Error (مثل انحراف المعايرة أو تدهور الكاشف)؟",
    hint: "Two consecutive control results exceeding 2 standard deviations on the same side of the mean.",
    hintAr: "قراءتان متتاليتان للكنترول تتجاوزان 2 انحراف معياري في نفس الاتجاه عن المتوسط.",
    options: [
      "2:2s and 10:x rules.",
      "1:2s warning rule only.",
      "R:4s rule within a single run.",
      "Random pipetting bubbles."
    ],
    optionsAr: [
      "قاعدتا 2:2s و 10:x.",
      "قاعدة التحذير 1:2s فقط.",
      "قاعدة R:4s في نفس الدورة.",
      "فقاعات السحب العشوائية."
    ],
    correctIndex: 0,
    explanation: "The 2:2s (two consecutive results >2s on same side) and 10:x (ten consecutive results on one side of mean) detect systematic bias, calibration shifts, or lot-to-lot reagent shifts.",
    explanationAr: "قاعدتا 2:2s و 10:x تكشفان الانحراف المنهجي والتحيز المستمر في الجهاز مثل انتهاء كفاءة الكاشف أو انحراف المنحنى المعياري.",
    moduleRef: "SOP-301.4: Systematic vs Random QC Errors",
    moduleRefAr: "دليل SOP-301.4: التمييز بين الأخطاء المنهجية والعشوائية",
    difficulty: "Advanced"
  },
  {
    id: 503,
    courseId: "course-5",
    questionNumber: 3,
    totalQuestions: 4,
    question: "When a quality control run is rejected due to an out-of-control rule, what is the mandatory troubleshooting sequence under CAP guidelines?",
    questionAr: "عند رفض تشغيلة ضبط الجودة بسبب خروجها عن السيطرة Out-of-Control، ما هو التسلسل الإلزامي للتعامل مع المشكلة وفقاً لمعايير CAP؟",
    hint: "Never keep repeating controls without investigating root cause.",
    hintAr: "لا تكرر الكنترول مراراً وتكراراً دون فحص السبب الجذري ومكونات الفحص.",
    options: [
      "Keep re-running the same control tube until one falls within ±1s by chance.",
      "Check expiration dates, reagent volumes, temperature, prepare fresh control vial, recalibrate if necessary, and log a formal CAPA action.",
      "Falsify the QC log to keep the turnaround time on track.",
      "Report patient results with an unverified asterisk."
    ],
    optionsAr: [
      "تكرار نفس أنبوبة الكنترول مراراً وتكراراً حتى تدخل بالصدفة ضمن النطاق المقبول.",
      "فحص تاريخ الصلاحية وحجم الكواشف ودرجة الحرارة، تحضير كنترول جديد طازج، إعادة المعايرة إن لزم، وتوثيق إجراء تصحيحي CAPA رسمي.",
      "تعديل سجل الجودة يدوياً للحفاظ على سرعة تسليم النتائج.",
      "إصدار نتائج المرضى مع وضع علامة نجمية غير معتمدة."
    ],
    correctIndex: 1,
    explanation: "Repeating controls blindly without root-cause troubleshooting violates accreditation standards. Causes (reagents, cal, maintenance) must be investigated and documented.",
    explanationAr: "تكرار الكنترول عشوائياً يخالف معايير الاعتماد الدولية، ويجب تتبع السبب الجذري (الكواشف، الصلاحية، المعايرة) وتوثيق خطة CAPA المعتمدة.",
    moduleRef: "SOP-301.7: Corrective Action & Preventative Action (CAPA)",
    moduleRefAr: "دليل SOP-301.7: خطة الإجراءات التصحيحية والوقائية CAPA",
    difficulty: "Intermediate"
  },
  {
    id: 504,
    courseId: "course-5",
    questionNumber: 4,
    totalQuestions: 4,
    question: "What is the mandatory protocol when a critical patient panic value (e.g., serum Potassium 6.9 mmol/L) is verified by repeat testing?",
    questionAr: "ما هو البروتوكول الإلزامي عند التحقق من قيمة حرجة خطيرة لنتيجة مريض (مثل بوتاسيوم 6.9 mmol/L) بعد تكرار الفحص؟",
    hint: "Critical panic results require rapid telephonic communication with closed-loop readback.",
    hintAr: "النتائج الحرجة تتطلب إبلاغاً هاتفياً فورياً مع القراءة العكسية للتأكيد (Read-back).",
    options: [
      "Send a standard postal letter to the patient's home address within 3 weeks.",
      "Immediately telephone the attending clinician, conduct formal read-back verification, and log the call timestamp, caller and receiver in LIMS within 30 minutes.",
      "Wait until morning rounds the next day to inform the nurse.",
      "Delete the result because it is too far outside normal reference range."
    ],
    optionsAr: [
      "إرسال خطاب بالبريد العادي لعنوان المريض خلال 3 أسابيع.",
      "الاتصال الهاتفي الفوري بالطبيب المعالج، وإجراء التحقق بالقراءة العكسية Read-back، وتوثيق وقت المكالمة وهوية المتصل والمستلم في LIMS خلال 30 دقيقة.",
      "الانتظار حتى مرور الوردية الصباحية في اليوم التالي لإبلاغ التمريض.",
      "حذف النتيجة لأنها تبدو بعيدة جداً عن المعدلات الطبيعية."
    ],
    correctIndex: 1,
    explanation: "Critical value panic protocols mandate urgent telephone notification with verified read-back within 30-60 minutes to prevent life-threatening cardiac events.",
    explanationAr: "تشترط معايير الاعتماد إبلاغاً هاتفياً عاجلاً للقيم الحرجة مع إعادة قراءة الطبيب للرقم Read-back وتوثيق ذلك إلكترونياً لتفادي توقف عضلة القلب.",
    moduleRef: "SOP-301.12: Critical Result Panic Notification Protocol",
    moduleRefAr: "دليل SOP-301.12: بروتوكول إبلاغ النتائج الحرجة والإنذار العاجل",
    difficulty: "Basic"
  }
];

export const mockQuizQuestions = mockQuestionBank;

// The 32 Trainee Accounts for Training Admin Dashboard (20 Completed, 8 In Progress, 4 Overdue)
export const mockTraineeAccounts: TraineeAccount[] = [
  {
    id: "trn-01",
    name: "Ahmed Mohamed",
    nameAr: "أحمد محمد",
    employeeId: "SL-2024-0482",
    jobTitle: "Medical Laboratory Technologist",
    jobTitleAr: "أخصائي تحاليل طبية",
    department: "Clinical Chemistry",
    departmentAr: "الكيمياء الإكلينيكية",
    branch: "Cairo Main Facility",
    branchAr: "فرع القاهرة الرئيسي",
    hireDate: "2024-09-01",
    orientationStartDate: "01 Sep 2024",
    orientationEndDate: "30 Nov 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "In Progress",
    overallProgress: 20,
    completedCoursesCount: 1,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGgUBhTHQtOx4cCa4r8Jj9pCBL-Z07YKFjSf7em3NxZFQBtPP7yBbC2SsxYkRTDWegzmmj71XVB3dpi_IYu_D8t8BPQ7I8UyXItx8YZXouwPh2NWBmAFs7dnZWj89DMN9ERFYIaEh1keS445KPjAGw6-N3oa1Nx8nBrViO0o3zWlrSeZOFMuygDnonqgSUJybRYiPUbwlxZWhYhMy4ttdfI8HVY0Qj1PTyoWDWwpxnu9hDQ2gzdUXRRA",
    email: "ahmed.mohamed@shalabylabs.com",
    phone: "+20 100 248 9912",
    lastActive: "Today at 09:14 AM",
    courses: [
      {
        courseId: "course-1",
        courseCode: "SP-100",
        status: "Completed",
        progress: 100,
        startDate: "2024-09-02",
        completedDate: "2024-09-05",
        score: 92,
        attemptsUsed: 1,
        maxAttempts: 3,
        certificateId: "SL-CERT-2024-0482-1",
        certificateIssuedDate: "05 Sep 2024"
      },
      {
        courseId: "course-2",
        courseCode: "SP-101",
        status: "In Progress",
        progress: 40,
        startDate: "2024-09-06",
        attemptsUsed: 0,
        maxAttempts: 3
      },
      {
        courseId: "course-3",
        courseCode: "SP-102",
        status: "Locked",
        progress: 0,
        attemptsUsed: 0,
        maxAttempts: 3
      },
      {
        courseId: "course-4",
        courseCode: "SP-201",
        status: "Locked",
        progress: 0,
        attemptsUsed: 0,
        maxAttempts: 3
      },
      {
        courseId: "course-5",
        courseCode: "SP-301",
        status: "Locked",
        progress: 0,
        attemptsUsed: 0,
        maxAttempts: 3
      }
    ]
  },
  {
    id: "trn-02",
    name: "Dr. Mona Farouk",
    nameAr: "د. منى فاروق",
    employeeId: "SL-2024-0391",
    jobTitle: "Senior Clinical Microbiologist",
    jobTitleAr: "أخصائية أولى ميكروبيولوجيا إكلينيكية",
    department: "Microbiology & Serology",
    departmentAr: "الميكروبيولوجي والمناعة",
    branch: "Alexandria Branch (Sidi Gaber)",
    branchAr: "فرع الإسكندرية (سيدي جابر)",
    hireDate: "2024-07-01",
    orientationStartDate: "01 Jul 2024",
    orientationEndDate: "30 Sep 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "Completed",
    overallProgress: 100,
    completedCoursesCount: 5,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuHaEnB3yQGNi0mnbYRO7SDI5gaYsJqGWcLx6StdQ0g5QUDKvIo3qpQyLQc3nramXV9vHwnShnNM-8CLuLmiYfFQVbm_d_s8GRIIX4W4399ChKFkG1tDEGMdV8UxKV27Vndv1MpcHMDG5vURDI40lkAz6T8mcC5wwVdE1B_Ha0qcJrPt7yY8r41w812VpobVFEsA0eYqoSgPlnsKOcC5s8lW9f0jVW11XKgF_hRI-5LyBTf6aGN3PQw",
    email: "mona.farouk@shalabylabs.com",
    phone: "+20 122 344 5566",
    lastActive: "Yesterday at 04:30 PM",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "Completed", progress: 100, startDate: "2024-07-02", completedDate: "2024-07-04", score: 96, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0391-1" },
      { courseId: "course-2", courseCode: "SP-101", status: "Completed", progress: 100, startDate: "2024-07-05", completedDate: "2024-07-10", score: 90, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0391-2" },
      { courseId: "course-3", courseCode: "SP-102", status: "Completed", progress: 100, startDate: "2024-07-12", completedDate: "2024-07-18", score: 88, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0391-3" },
      { courseId: "course-4", courseCode: "SP-201", status: "Completed", progress: 100, startDate: "2024-07-20", completedDate: "2024-07-26", score: 94, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0391-4" },
      { courseId: "course-5", courseCode: "SP-301", status: "Completed", progress: 100, startDate: "2024-08-01", completedDate: "2024-08-12", score: 92, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0391-5" }
    ]
  },
  {
    id: "trn-03",
    name: "Youssef Karim",
    nameAr: "يوسف كريم",
    employeeId: "SL-2024-0512",
    jobTitle: "Quality Control Analyst",
    jobTitleAr: "محلل مراقبة جودة مخبرية",
    department: "Clinical Chemistry",
    departmentAr: "الكيمياء الإكلينيكية",
    branch: "Giza Branch (Dokki)",
    branchAr: "فرع الجيزة (الدقي)",
    hireDate: "2024-06-15",
    orientationStartDate: "15 Jun 2024",
    orientationEndDate: "15 Sep 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "Overdue",
    overallProgress: 40,
    completedCoursesCount: 2,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    email: "youssef.karim@shalabylabs.com",
    phone: "+20 101 992 4433",
    lastActive: "6 days ago",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "Completed", progress: 100, startDate: "2024-06-16", completedDate: "2024-06-20", score: 85, attemptsUsed: 2, maxAttempts: 3, certificateId: "SL-CERT-0512-1" },
      { courseId: "course-2", courseCode: "SP-101", status: "Completed", progress: 100, startDate: "2024-06-22", completedDate: "2024-07-01", score: 80, attemptsUsed: 2, maxAttempts: 3, certificateId: "SL-CERT-0512-2" },
      { courseId: "course-3", courseCode: "SP-102", status: "In Progress", progress: 15, startDate: "2024-07-05", attemptsUsed: 1, maxAttempts: 3, score: 65 },
      { courseId: "course-4", courseCode: "SP-201", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-5", courseCode: "SP-301", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 }
    ]
  },
  {
    id: "trn-04",
    name: "Nour El-Din Hassan",
    nameAr: "نور الدين حسن",
    employeeId: "SL-2024-0560",
    jobTitle: "Molecular Diagnostics Technologist",
    jobTitleAr: "أخصائي تشخيص جزيئي وPCR",
    department: "Molecular Biology",
    departmentAr: "البيولوجيا الجزيئية والجينات",
    branch: "Cairo Main Facility",
    branchAr: "فرع القاهرة الرئيسي",
    hireDate: "2024-08-10",
    orientationStartDate: "10 Aug 2024",
    orientationEndDate: "10 Nov 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "In Progress",
    overallProgress: 60,
    completedCoursesCount: 3,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGgUBhTHQtOx4cCa4r8Jj9pCBL-Z07YKFjSf7em3NxZFQBtPP7yBbC2SsxYkRTDWegzmmj71XVB3dpi_IYu_D8t8BPQ7I8UyXItx8YZXouwPh2NWBmAFs7dnZWj89DMN9ERFYIaEh1keS445KPjAGw6-N3oa1Nx8nBrViO0o3zWlrSeZOFMuygDnonqgSUJybRYiPUbwlxZWhYhMy4ttdfI8HVY0Qj1PTyoWDWwpxnu9hDQ2gzdUXRRA",
    email: "nour.hassan@shalabylabs.com",
    phone: "+20 114 772 3311",
    lastActive: "Today at 11:20 AM",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "Completed", progress: 100, startDate: "2024-08-11", completedDate: "2024-08-15", score: 94, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0560-1" },
      { courseId: "course-2", courseCode: "SP-101", status: "Completed", progress: 100, startDate: "2024-08-16", completedDate: "2024-08-22", score: 86, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0560-2" },
      { courseId: "course-3", courseCode: "SP-102", status: "Completed", progress: 100, startDate: "2024-08-24", completedDate: "2024-09-02", score: 90, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0560-3" },
      { courseId: "course-4", courseCode: "SP-201", status: "In Progress", progress: 30, startDate: "2024-09-05", attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-5", courseCode: "SP-301", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 }
    ]
  },
  {
    id: "trn-05",
    name: "Layla Mahmoud",
    nameAr: "ليلى محمود",
    employeeId: "SL-2024-0610",
    jobTitle: "Phlebotomy & Specimen Specialist",
    jobTitleAr: "أخصائية سحب وفرز العينات",
    department: "Pre-Analytics & Phlebotomy",
    departmentAr: "المرحلة ما قبل التحليلية وسحب العينات",
    branch: "Heliopolis Branch (Korba)",
    branchAr: "فرع مصر الجديدة (الكوربة)",
    hireDate: "2024-09-20",
    orientationStartDate: "20 Sep 2024",
    orientationEndDate: "20 Dec 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "Not Started",
    overallProgress: 0,
    completedCoursesCount: 0,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuHaEnB3yQGNi0mnbYRO7SDI5gaYsJqGWcLx6StdQ0g5QUDKvIo3qpQyLQc3nramXV9vHwnShnNM-8CLuLmiYfFQVbm_d_s8GRIIX4W4399ChKFkG1tDEGMdV8UxKV27Vndv1MpcHMDG5vURDI40lkAz6T8mcC5wwVdE1B_Ha0qcJrPt7yY8r41w812VpobVFEsA0eYqoSgPlnsKOcC5s8lW9f0jVW11XKgF_hRI-5LyBTf6aGN3PQw",
    email: "layla.mahmoud@shalabylabs.com",
    phone: "+20 109 443 1188",
    lastActive: "3 days ago",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "In Progress", progress: 10, startDate: "2024-09-21", attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-2", courseCode: "SP-101", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-3", courseCode: "SP-102", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-4", courseCode: "SP-201", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-5", courseCode: "SP-301", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 }
    ]
  },
  {
    id: "trn-06",
    name: "Dr. Khaled Abdel-Rahman",
    nameAr: "د. خالد عبد الرحمن",
    employeeId: "SL-2024-0322",
    jobTitle: "Clinical Hematology Specialist",
    jobTitleAr: "أخصائي أمراض الدم الإكلينيكية",
    department: "Hematology & Coagulation",
    departmentAr: "أمراض الدم والتجلط",
    branch: "Mansoura Facility",
    branchAr: "فرع المنصورة",
    hireDate: "2024-06-01",
    orientationStartDate: "01 Jun 2024",
    orientationEndDate: "01 Sep 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "Completed",
    overallProgress: 100,
    completedCoursesCount: 5,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    email: "khaled.abdelrahman@shalabylabs.com",
    phone: "+20 102 991 8844",
    lastActive: "1 week ago",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "Completed", progress: 100, score: 98, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0322-1" },
      { courseId: "course-2", courseCode: "SP-101", status: "Completed", progress: 100, score: 92, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0322-2" },
      { courseId: "course-3", courseCode: "SP-102", status: "Completed", progress: 100, score: 86, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0322-3" },
      { courseId: "course-4", courseCode: "SP-201", status: "Completed", progress: 100, score: 90, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0322-4" },
      { courseId: "course-5", courseCode: "SP-301", status: "Completed", progress: 100, score: 95, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0322-5" }
    ]
  },
  {
    id: "trn-07",
    name: "Mariam Soliman",
    nameAr: "مريم سليمان",
    employeeId: "SL-2024-0498",
    jobTitle: "Blood Bank Technologist",
    jobTitleAr: "أخصائية بنك الدم والمطابقة",
    department: "Immunohematology",
    departmentAr: "المناعة الدموية وبنك الدم",
    branch: "Cairo Main Facility",
    branchAr: "فرع القاهرة الرئيسي",
    hireDate: "2024-06-10",
    orientationStartDate: "10 Jun 2024",
    orientationEndDate: "10 Sep 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "Overdue",
    overallProgress: 60,
    completedCoursesCount: 3,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuHaEnB3yQGNi0mnbYRO7SDI5gaYsJqGWcLx6StdQ0g5QUDKvIo3qpQyLQc3nramXV9vHwnShnNM-8CLuLmiYfFQVbm_d_s8GRIIX4W4399ChKFkG1tDEGMdV8UxKV27Vndv1MpcHMDG5vURDI40lkAz6T8mcC5wwVdE1B_Ha0qcJrPt7yY8r41w812VpobVFEsA0eYqoSgPlnsKOcC5s8lW9f0jVW11XKgF_hRI-5LyBTf6aGN3PQw",
    email: "mariam.soliman@shalabylabs.com",
    phone: "+20 120 445 6677",
    lastActive: "5 days ago",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "Completed", progress: 100, score: 88, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0498-1" },
      { courseId: "course-2", courseCode: "SP-101", status: "Completed", progress: 100, score: 84, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0498-2" },
      { courseId: "course-3", courseCode: "SP-102", status: "Completed", progress: 100, score: 82, attemptsUsed: 2, maxAttempts: 3, certificateId: "SL-CERT-0498-3" },
      { courseId: "course-4", courseCode: "SP-201", status: "In Progress", progress: 20, attemptsUsed: 1, maxAttempts: 3, score: 60 },
      { courseId: "course-5", courseCode: "SP-301", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 }
    ]
  },
  {
    id: "trn-08",
    name: "Omar Sharif",
    nameAr: "عمر شريف",
    employeeId: "SL-2024-0551",
    jobTitle: "Clinical Chemist",
    jobTitleAr: "كيميائي إكلينيكي",
    department: "Clinical Chemistry",
    departmentAr: "الكيمياء الإكلينيكية",
    branch: "Alexandria Branch (Smouha)",
    branchAr: "فرع الإسكندرية (سموحة)",
    hireDate: "2024-08-25",
    orientationStartDate: "25 Aug 2024",
    orientationEndDate: "25 Nov 2024",
    assignedPathId: "path-orientation-1",
    assignedPathTitle: "Mandatory Clinical Laboratory Orientation",
    assignedPathTitleAr: "المسار التوجيهي الإلزامي لأخصائيي المختبرات",
    status: "In Progress",
    overallProgress: 40,
    completedCoursesCount: 2,
    totalCoursesCount: 5,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    email: "omar.sharif@shalabylabs.com",
    phone: "+20 115 667 8899",
    lastActive: "Yesterday at 02:15 PM",
    courses: [
      { courseId: "course-1", courseCode: "SP-100", status: "Completed", progress: 100, score: 90, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0551-1" },
      { courseId: "course-2", courseCode: "SP-101", status: "Completed", progress: 100, score: 85, attemptsUsed: 1, maxAttempts: 3, certificateId: "SL-CERT-0551-2" },
      { courseId: "course-3", courseCode: "SP-102", status: "In Progress", progress: 45, attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-4", courseCode: "SP-201", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 },
      { courseId: "course-5", courseCode: "SP-301", status: "Locked", progress: 0, attemptsUsed: 0, maxAttempts: 3 }
    ]
  }
];

// Regulatory Audit Trail Log (Immutable chronological audit records)
export const mockAuditTrailLogs: AuditLogEntry[] = [
  {
    id: "log-109",
    timestamp: "2024-09-26 11:14:02",
    userId: "SL-TRN-0012",
    userName: "Dr. Sarah Mansour",
    userRole: "Training Admin",
    action: "Assigned Orientation Path",
    actionAr: "تعيين مسار التوجيه الإلزامي",
    details: "Assigned Mandatory Clinical Orientation Path to Ahmed Mohamed (SL-2024-0482)",
    detailsAr: "تم تعيين مسار التوجيه الإلزامي للموظف أحمد محمد (SL-2024-0482)",
    target: "Trainee: Ahmed Mohamed",
    ipAddress: "192.168.10.45",
    status: "Success"
  },
  {
    id: "log-108",
    timestamp: "2024-09-26 09:42:15",
    userId: "SL-2024-0482",
    userName: "Ahmed Mohamed",
    userRole: "Trainee",
    action: "Assessment Passed",
    actionAr: "اجتياز الاختبار بنجاح",
    details: "Passed Course SP-100 Assessment with 92% (Attempt 1/3). Next course unlocked.",
    detailsAr: "اجتاز اختبار المقرر SP-100 بنسبة 92% (المحاولة 1 من 3)، وفك قفل المقرر التالي.",
    target: "Course: SP-100",
    ipAddress: "10.0.4.121",
    status: "Success"
  },
  {
    id: "log-107",
    timestamp: "2024-09-26 09:42:16",
    userId: "SYSTEM_AUTO",
    userName: "LMS Automation Engine",
    userRole: "System Admin",
    action: "Certificate Generated",
    actionAr: "توليد شهادة معتمدة بالباركود",
    details: "Generated official Certificate SL-CERT-2024-0482-1 with QR verification badge.",
    detailsAr: "تم إصدار الشهادة الرسمية برقم SL-CERT-2024-0482-1 مع رمز التحقق الإلكتروني QR.",
    target: "Cert: SL-CERT-2024-0482-1",
    ipAddress: "127.0.0.1",
    status: "Success"
  },
  {
    id: "log-106",
    timestamp: "2024-09-25 16:30:10",
    userId: "SL-2024-0512",
    userName: "Youssef Karim",
    userRole: "Trainee",
    action: "Assessment Failed",
    actionAr: "عدم اجتياز الاختبار",
    details: "Score 65% on SP-102 Assessment (Below 80% threshold). Attempts used: 1/3.",
    detailsAr: "حقق نسبة 65% في اختبار SP-102 (أقل من نسبة 80%). المحاولات المستخدمة 1 من 3.",
    target: "Course: SP-102",
    ipAddress: "10.0.8.94",
    status: "Warning"
  },
  {
    id: "log-105",
    timestamp: "2024-09-25 14:12:00",
    userId: "SL-SYS-0004",
    userName: "Eng. Khaled El-Sayed",
    userRole: "System Admin",
    action: "Updated Course Settings",
    actionAr: "تعديل إعدادات الكورس",
    details: "Configured passScore = 80%, allowedAttempts = 3 on SP-101. Anti-tampering check verified.",
    detailsAr: "تم تثبيت نسبة النجاح 80% والمحاولات 3 على كورس SP-101 مع التحقق من نزاهة السجل.",
    target: "Course: SP-101",
    ipAddress: "192.168.10.12",
    status: "Success"
  },
  {
    id: "log-104",
    timestamp: "2024-09-24 10:05:22",
    userId: "SL-TRN-0012",
    userName: "Dr. Sarah Mansour",
    userRole: "Training Admin",
    action: "Created Trainee Account",
    actionAr: "إنشاء حساب موظف جديد",
    details: "Provisioned new Trainee account for Layla Mahmoud (SL-2024-0610), Branch: Heliopolis.",
    detailsAr: "تم إنشاء حساب متدرب جديد للموظفة ليلى محمود (SL-2024-0610) فرع مصر الجديدة.",
    target: "Trainee: Layla Mahmoud",
    ipAddress: "192.168.10.45",
    status: "Success"
  },
  {
    id: "log-103",
    timestamp: "2024-09-23 08:30:19",
    userId: "ANONYMOUS_IP",
    userName: "Unauthenticated Request",
    userRole: "Trainee",
    action: "Score Modification Blocked",
    actionAr: "حظر محاولة تعديل درجة",
    details: "Direct POST request to alter quiz score without administrative token was intercepted and rejected.",
    detailsAr: "تم اعتراض وإحباط محاولة لتعديل درجات اختبار دون توقيع إداري معتمد.",
    target: "Security Guard",
    ipAddress: "45.132.88.19",
    status: "Security Alert"
  }
];

// Official Certificate Data
export const mockOfficialCertificates: Record<string, CertificateRecord> = {
  "course-1": {
    certificateId: "SL-CERT-2024-0482-1",
    traineeName: "Ahmed Mohamed",
    traineeNameAr: "أحمد محمد",
    employeeId: "SL-2024-0482",
    courseTitle: "New Employee Orientation & Laboratory Organization (SP-100)",
    courseTitleAr: "التهيئة والتعريف بأنظمة ومعايير المختبرات (SP-100)",
    courseCode: "SP-100",
    issueDate: "05 September 2024",
    expiryDate: "05 September 2026",
    score: 92,
    passingScore: 80,
    isOrientationMaster: false,
    verificationCode: "VER-9824-OK",
    authorizedSigner: "Dr. Amira Shalaby, MD, FRCPath",
    authorizedSignerAr: "أ.د. أميرة شلبي - استشاري التحاليل الطبية ومدير عام الجودة"
  },
  "master": {
    certificateId: "SL-MASTER-ORIENT-2024",
    traineeName: "Ahmed Mohamed",
    traineeNameAr: "أحمد محمد",
    employeeId: "SL-2024-0482",
    courseTitle: "Master Clinical Laboratory Orientation & Quality Credential",
    courseTitleAr: "شهادة إتمام التأهيل والتوجيه المخبري الإكلينيكي الشامل",
    courseCode: "ORIENT-MASTER",
    issueDate: "Pending Completion of Modules",
    score: 92,
    passingScore: 80,
    isOrientationMaster: true,
    verificationCode: "VER-MASTER-PENDING",
    authorizedSigner: "Dr. Ibrahim Shalaby, MD",
    authorizedSignerAr: "أ.د. إبراهيم شلبي - رئيس مجلس الإدارة والمشرف العام"
  }
};

export const mockLessons: LessonItem[] = [
  // Course 1
  {
    id: "les-1-1",
    moduleId: "course-1",
    stageNumber: "01",
    title: "Clinical Hierarchy & Regulatory Accreditations (CAP & ISO 15189)",
    titleAr: "الهيكل التنظيمي للمختبر ومعايير الاعتماد الدولي",
    duration: "08:45",
    type: "Video",
    status: "Completed",
    completed: true,
    protocolId: "SOP-100.1",
    description: "Overview of Shalaby Labs standard operational hierarchy, medical confidentiality agreements, and quality standards.",
    descriptionAr: "شرح الهيكل التنظيمي العام، معايير الجودة الدولية ISO 15189، والتزامات سرية بيانات المرضى.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8cazw4juCQCBfRGq_bzncciOP2nna16naJJOnuOHNG4aWEhHh3AdomEp9IyczOVmf_abndRToBYWFFpVeSpa50fxBNvY_Ao1qAP5OqkFtD78ejcx-ubxhJUzFw4L4RRBWPbaxdeKMSEJFYkxqukGAsBirbr-G0yUx006qUBlLMyV4C5VK03D3aVrCf7SqrnR6nn4m-MtLj99VaGvzfKNp6TfTwwl5lj8VjnMXsbZLX6NHxBKlsVeh_A",
    learningObjectives: [
      "Understand line management reporting and supervisory chains.",
      "Comply with strict HIPAA and local patient privacy charters."
    ],
    learningObjectivesAr: [
      "فهم التسلسل الإداري وسلسلة المسؤوليات في المختبر.",
      "الالتزام الصارم بمواثيق سرية المرضى."
    ],
    transcript: [
      { time: "00:15", seconds: 15, text: "Welcome to Shalaby Central Laboratories Orientation Program.", textAr: "أهلاً بكم في البرنامج التوجيهي لمعامل شلبي المركزية." },
      { time: "01:30", seconds: 90, text: "Our facility adheres strictly to ISO 15189:2022 and College of American Pathologists (CAP) standards.", textAr: "تلتزم مختبراتنا بدقة بأعلى معايير ISO 15189 والكلية الأمريكية لأطباء علم الأمراض CAP." },
      { time: "04:10", seconds: 250, text: "Patient identification and specimen integrity are the fundamental pillars of clinical accuracy.", textAr: "التحقق الدقيق من هوية المريض وسلامة العينة هما الركيزتان الأساسيتان لدقة النتائج المخبرية." }
    ]
  },
  {
    id: "les-1-2",
    moduleId: "course-1",
    stageNumber: "02",
    title: "Patient Identification & Code of Conduct Protocols",
    titleAr: "إجراءات التحقق من هوية المريض وميثاق الشرف المهني",
    duration: "11:20",
    type: "Video",
    status: "Completed",
    completed: true,
    protocolId: "SOP-100.2",
    description: "Dual-identifier verification protocols at specimen reception and electronic accessioning.",
    descriptionAr: "التحقق الثنائي من الاسم ورقم الملف الطبي وتجنب أخطاء التبديل عند الاستلام.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8cazw4juCQCBfRGq_bzncciOP2nna16naJJOnuOHNG4aWEhHh3AdomEp9IyczOVmf_abndRToBYWFFpVeSpa50fxBNvY_Ao1qAP5OqkFtD78ejcx-ubxhJUzFw4L4RRBWPbaxdeKMSEJFYkxqukGAsBirbr-G0yUx006qUBlLMyV4C5VK03D3aVrCf7SqrnR6nn4m-MtLj99VaGvzfKNp6TfTwwl5lj8VjnMXsbZLX6NHxBKlsVeh_A",
    learningObjectives: [
      "Master two-identifier verification before any specimen draw.",
      "Understand ethical handling of diagnostic data and confidential patient charts."
    ],
    learningObjectivesAr: [
      "إتقان التحقق من المعرفين المستقلين للمريض قبل أي إجراء مخبري.",
      "الحفاظ الكامل على سرية التقارير والنتائج الطبية."
    ]
  },

  // Course 2
  {
    id: "les-2-1",
    moduleId: "course-2",
    stageNumber: "01",
    title: "BSL-2 Safety Guidelines & Personal Protective Gear",
    titleAr: "معدات الوقاية الشخصية وإرشادات الأمان الحيوي",
    duration: "14:20",
    type: "Video",
    status: "Currently Playing",
    completed: false,
    protocolId: "SOP-101.1",
    description: "Detailed protocols for PPE donning, doffing, eye wash emergency stations, and chemical hood air velocities.",
    descriptionAr: "بروتوكولات ارتداء وخلع معدات الوقاية الشخصية، محطات غسيل العيون، ومعدل سحب الهواء في كبائن الأمان.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9c4yqXcqESQ7PWpL_k8P038Kt5i5xvqsVrG3jM8UM9_XsTtEMzxhAnnT36M0ZydgjygROQXdJKYFalG9RQyUT_s7b075a5iIEJfd8LRaCl5MKbePu2C7ANHHbGlnNnn4j58jrLVjJSlu-cjxqj3uJRfOM1rbaLhU0Z1Bmt8KWAmoZevoOay4uQlX2KtGLGz8hgFTCsjP-TM0q78xTvX6TwG6mCuJi6GrUdZINhRvScl9HVQSQWKsfWA",
    learningObjectives: [
      "Master correct order of doffing PPE without hand contamination.",
      "Demonstrate emergency flush procedure for ocular chemical exposure."
    ],
    learningObjectivesAr: [
      "إتقان تسلسل خلع معدات الوقاية دون تلويث اليدين.",
      "تطبيق بروتوكول غسيل العين الطارئ لمدة 15 دقيقة."
    ],
    transcript: [
      { time: "00:20", seconds: 20, text: "Biosafety Level 2 laboratories handle clinical blood and bodily fluids containing potential pathogens.", textAr: "تتعامل مختبرات المستوى الثاني للأمان الحيوي BSL-2 مع عينات الدم وسوائل الجسم المحتوية على مسببات أمراض." },
      { time: "03:45", seconds: 225, text: "Always peel gloves off inside-out without touching the outer contaminated latex surface.", textAr: "انزع القفازات دائماً من الداخل إلى الخارج دون ملامسة السطح الخارجي الملوث." },
      { time: "08:10", seconds: 490, text: "In case of chemical or splash to the eyes, proceed immediately to the eyewash station and hold eyelids open for 15 full minutes.", textAr: "في حال تناثر أي سائل بالعين توجه فوراً لمحطة غسيل العيون وافتح الجفون لـ 15 دقيقة كاملة." }
    ]
  },
  {
    id: "les-2-2",
    moduleId: "course-2",
    stageNumber: "02",
    title: "Biological Spill Kit Management & Chemical Storage",
    titleAr: "إدارة الانسكابات البيولوجية والتخزين الكيميائي الآمن",
    duration: "12:15",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-101.4",
    description: "Step-by-step procedures for deploying biological spill kits and handling corrosive acid bottles.",
    descriptionAr: "خطوات استخدام طقم الانسكابات البيولوجية والتخزين الصحيح للأحماض والمذيبات المتطايرة.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9c4yqXcqESQ7PWpL_k8P038Kt5i5xvqsVrG3jM8UM9_XsTtEMzxhAnnT36M0ZydgjygROQXdJKYFalG9RQyUT_s7b075a5iIEJfd8LRaCl5MKbePu2C7ANHHbGlnNnn4j58jrLVjJSlu-cjxqj3uJRfOM1rbaLhU0Z1Bmt8KWAmoZevoOay4uQlX2KtGLGz8hgFTCsjP-TM0q78xTvX6TwG6mCuJi6GrUdZINhRvScl9HVQSQWKsfWA",
    learningObjectives: [
      "Correctly cordon off a biological spill and allow 15 minutes of bleach dwell time.",
      "Store flammable organic solvents in certified flame-rated cabinets."
    ],
    learningObjectivesAr: [
      "تطويق موقع الانسكاب وإتاحة 15 دقيقة تفاعل لمحلول الكلور المخفف.",
      "تخزين المذيبات القابلة للاشتعال في خزانات الأمان المقاومة للحرارة."
    ]
  },

  // Course 3
  {
    id: "les-3-1",
    moduleId: "course-3",
    stageNumber: "01",
    title: "Sharps Safety & Color-Coded Biohazard Waste Segregation",
    titleAr: "أمان الأدوات الحادة وفرز النفايات الطبية الملونة",
    duration: "13:30",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-102.1",
    description: "Puncture-proof sharps container criteria, 75% fill disposal limits, and yellow vs black waste streams.",
    descriptionAr: "معايير حاويات الأدوات الحادة المانعة للثقب والتخلص عند امتلاء 75% وفصل النفايات المعدية الصفراء.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfiPXundRl1LkDBYNDs1fplS5qTKu4Umg3TTxCeSJpaIEIlSyhXtJ3-ANEENKUNRd8Itf5-tggZjEEzy6N5gBWfCB0fpb0QSzaZd40bNMitqNAq1ZuHkRklC0Ta8P7kQ-xpxi_vVgRKcFh1Yc_Xz7o4w6pM1ImkVBU8FSsh9CMsmCpCc7usSRHZc7oo_StMWhlSNJK5kh3XBweFmJGxKmrZ3WG8TG_K1_0YgCIHDy-f9qFSFUQJpvr5g",
    learningObjectives: [
      "Eliminate recapping of contaminated hypodermic needles.",
      "Identify correct biohazard stream for blood-soaked gauze versus ordinary waste."
    ],
    learningObjectivesAr: [
      "المنع القاطع لإعادة تغطية الإبر بعد سحب الدم.",
      "الفرز السليم للنفايات المشبعة بالدماء في الأكياس الصفراء."
    ],
    transcript: [
      { time: "00:10", seconds: 10, text: "Sharps injuries remain the number one preventable risk in clinical laboratory medicine.", textAr: "إصابات وخز الأدوات الحادة هي الخطر الأول القابل للمنع في مختبرات التحاليل الطبية." },
      { time: "04:20", seconds: 260, text: "Sharps boxes must never be filled above the 75% line to prevent protruding needles.", textAr: "يُحظر ملء حاويات الأدوات الحادة لأكثر من خط 75% لمنع بروز الإبر وخطر الوخز." }
    ]
  },
  {
    id: "les-3-2",
    moduleId: "course-3",
    stageNumber: "02",
    title: "Autoclaving Validation & Post-Exposure Prophylaxis (PEP)",
    titleAr: "التحقق من كفاءة الأوتوكلاف وإجراءات الوقاية بعد التعرض (PEP)",
    duration: "10:45",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-102.5",
    description: "Biological spore testing with Geobacillus stearothermophilus and 2-hour window PEP management.",
    descriptionAr: "اختبارات الأبواغ البيولوجية الدورية والتعامل السريع مع حوادث الوخز خلال نافذة الساعتين.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfiPXundRl1LkDBYNDs1fplS5qTKu4Umg3TTxCeSJpaIEIlSyhXtJ3-ANEENKUNRd8Itf5-tggZjEEzy6N5gBWfCB0fpb0QSzaZd40bNMitqNAq1ZuHkRklC0Ta8P7kQ-xpxi_vVgRKcFh1Yc_Xz7o4w6pM1ImkVBU8FSsh9CMsmCpCc7usSRHZc7oo_StMWhlSNJK5kh3XBweFmJGxKmrZ3WG8TG_K1_0YgCIHDy-f9qFSFUQJpvr5g",
    learningObjectives: [
      "Perform weekly biological indicator spore tests for steam sterilizers.",
      "Initiate urgent reporting and occupational health PEP triage."
    ],
    learningObjectivesAr: [
      "إجراء اختبارات الأبواغ الأسبوعية لأجهزة التعقيم بالبخار.",
      "تفعيل بروتوكول العلاج الوقائي العاجل بعد التعرض للوخز."
    ]
  },

  // Course 4
  {
    id: "les-4-1",
    moduleId: "course-4",
    stageNumber: "01",
    title: "Phlebotomy Order of Draw & Additive Carryover Prevention",
    titleAr: "الترتيب القياسي لسحب أنابيب الدم ومنع التلوث المتبادل",
    duration: "16:10",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-201.1",
    description: "CLSI GP41 tube sequencing from blood culture to blue citrate, red/gold serum, green heparin, and purple EDTA.",
    descriptionAr: "تسلسل السحب القياسي لمنع تلوث البوتاسيوم وموانع التجلط وضمان دقة اختبارات التخثر والشوارد.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    learningObjectives: [
      "Execute exact order of draw to avoid pseudohyperkalemia and erroneous PT/INR results.",
      "Properly invert additive tubes 5 to 8 times without aggressive shaking."
    ],
    learningObjectivesAr: [
      "تنفيذ ترتيب السحب المعتمد لتفادي الارتفاع الوهمي للبوتاسيوم وتخثر عينات التحاليل.",
      "تقليب الأنابيب بلطف من 5 إلى 8 مرات لتجانس مانع التجلط."
    ],
    transcript: [
      { time: "00:15", seconds: 15, text: "Pre-analytical errors account for over 68% of all laboratory diagnostic mistakes.", textAr: "تشكل أخطاء ما قبل التحليل أكثر من 68% من مجمل أخطاء التشخيص المخبري." },
      { time: "05:10", seconds: 310, text: "Drawing EDTA before chemistry serum tubes causes potassium contamination that can mimic a cardiac emergency.", textAr: "سحب أنبوبة EDTA قبل أنابيب الكيمياء ينقل البوتاسيوم ويُظهر نتائج تحاكي التوقف القلبي كذباً." }
    ]
  },
  {
    id: "les-4-2",
    moduleId: "course-4",
    stageNumber: "02",
    title: "Centrifuge Balancing & Hemolysis Rejection Thresholds",
    titleAr: "موازنة الطرد المركزي ومعايير رفض العينات المتكسرة HIL",
    duration: "13:50",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-201.6",
    description: "Centrifuge balance geometry, hemolysis (H), icterus (I), lipemia (L) indices, and rejection logging in LIMS.",
    descriptionAr: "موازنة أوزان الطرد المركزي، تقييم تكسر الدم وتجمع الدهون والصفراء، وتوثيق رفض العينات غير المطابقة.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwUsZNPxMzYeGBRAjUJHubDNpr3REdJAYWQSJrnYwzbLnATIsPu5OWeJAgbXXC3DLjQnuZjQV40SMA8JuWO4_cfwyHgcbps9PPyAzebImxiR6LnhBU2bNozcfHPua4iPVkZ6bJkRuxGeDwhmemGs2Y3pvEg_1zHRmeblNKIhqxaUB35HxpVohx0-jpQbRrfLjnABnxnkVs8Cg1x9OCHK-SVhMJEfOmaGNrlSCaU4wC2g-z_tTc68eJxMRZa6p1RLQ4_KQrckn7B9so",
    learningObjectives: [
      "Operate clinical centrifuges with exact opposing weight balance.",
      "Evaluate visual serum indices and log formal rejection notifications."
    ],
    learningObjectivesAr: [
      "تشغيل أجهزة الطرد المركزي بموازنة دقيقة للأنابيب المتقابلة.",
      "تقييم نقاء المصل وتوثيق رفض العينات المتكسرة رسمياً."
    ]
  },

  // Course 5
  {
    id: "les-5-1",
    moduleId: "course-5",
    stageNumber: "01",
    title: "Westgard Multirule Application & Levey-Jennings QC Charts",
    titleAr: "تطبيق قواعد ويستغارد ومخططات ليفي جينينغز لضبط الجودة",
    duration: "18:25",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-301.1",
    description: "Comprehensive breakdown of 1:2s warning, 1:3s rejection, 2:2s systematic shift, and R:4s range violations.",
    descriptionAr: "شرح تفصيلي لقواعد ضبط الجودة الإحصائية: قاعدة التحذير 1:2s وقواعد الرفض 1:3s و 2:2s و R:4s.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPsc6frwqkN6TJw0lVlejnvGCgSjKeeegGNmCq52itX3bHXKSrzOGysASznD9kMc9Fg0s0Zvkz-UpoC-k1oSHfV-4Kyj__iGQXxKUKVwxy427Q5-riO40xOpKp_-9Fudjwlr9U2PNFByeRlcXdQ0b3j5O_PzjIynDtrZMQpfWZDB0M9Q5YZT3hOtHo9UxnfMvkil-1DD7dq5J1PXAzvhcYdqO7ncpi8Qaf9yY5lO7JSZI9C9ypvO4tvg",
    learningObjectives: [
      "Distinguish between random analytical error and systematic calibration drift.",
      "Plot and interpret daily two-level controls on Levey-Jennings charts."
    ],
    learningObjectivesAr: [
      "التمييز بين الأخطاء العشوائية والانحراف المنهجي للأجهزة.",
      "قراءة وتفسير مستويات الكنترول على مخططات ليفي جينينغز."
    ],
    transcript: [
      { time: "00:20", seconds: 20, text: "Quality control is the clinical conscience of the laboratory.", textAr: "ضبط الجودة هو الضمير المهني الحي لمختبر التحاليل الطبية." },
      { time: "06:15", seconds: 375, text: "When a 1:3s violation occurs, you must halt all patient sample reporting immediately.", textAr: "عند مخالفة قاعدة 1:3s يجب إيقاف استخراج نتائج المرضى فوراً وبلا استثناء." }
    ]
  },
  {
    id: "les-5-2",
    moduleId: "course-5",
    stageNumber: "02",
    title: "Out-of-Control Corrective Action Plan (CAPA) & Critical Panic Values",
    titleAr: "خطة الإجراءات التصحيحية CAPA وبروتوكول إبلاغ النتائج الحرجة",
    duration: "15:40",
    type: "Video",
    status: "Not Started",
    completed: false,
    protocolId: "SOP-301.8",
    description: "Root-cause investigation workflow, documentation of CAPA logs, and 30-minute closed-loop critical value telephonic escalation.",
    descriptionAr: "مسار التحقيق في أسباب خروج الكنترول وتوثيق إجراءات CAPA وإبلاغ النتائج الحرجة هاتفياً خلال 30 دقيقة مع القراءة العكسية.",
    videoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPsc6frwqkN6TJw0lVlejnvGCgSjKeeegGNmCq52itX3bHXKSrzOGysASznD9kMc9Fg0s0Zvkz-UpoC-k1oSHfV-4Kyj__iGQXxKUKVwxy427Q5-riO40xOpKp_-9Fudjwlr9U2PNFByeRlcXdQ0b3j5O_PzjIynDtrZMQpfWZDB0M9Q5YZT3hOtHo9UxnfMvkil-1DD7dq5J1PXAzvhcYdqO7ncpi8Qaf9yY5lO7JSZI9C9ypvO4tvg",
    learningObjectives: [
      "Document complete CAPA investigation without repeating controls blindly.",
      "Execute telephone panic escalation with verified doctor read-back."
    ],
    learningObjectivesAr: [
      "توثيق تحقيق CAPA الشامل دون إعادة الكنترول عشوائياً.",
      "تنفيذ إبلاغ النتائج الحرجة هاتفياً مع التحقق بالقراءة العكسية."
    ]
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: "post-1",
    author: "Dr. Sarah Mansour",
    role: "HEAD OF TRAINING",
    roleAr: "رئيسة التدريب والتطوير",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcuHaEnB3yQGNi0mnbYRO7SDI5gaYsJqGWcLx6StdQ0g5QUDKvIo3qpQyLQc3nramXV9vHwnShnNM-8CLuLmiYfFQVbm_d_s8GRIIX4W4399ChKFkG1tDEGMdV8UxKV27Vndv1MpcHMDG5vURDI40lkAz6T8mcC5wwVdE1B_Ha0qcJrPt7yY8r41w812VpobVFEsA0eYqoSgPlnsKOcC5s8lW9f0jVW11XKgF_hRI-5LyBTf6aGN3PQw",
    timeAgo: "2 hours ago",
    timeAgoAr: "منذ ساعتين",
    content: "Welcome to all newly appointed clinical specialists! Please remember that all 5 orientation modules must be completed sequentially before independent bench testing begins.",
    contentAr: "أهلاً بجميع الزملاء الجدد! نذكركم بأن المقررات الخمسة إلزامية ومتسلسلة ويجب اجتيازها بالكامل قبل استلام العمل المستقل.",
    likes: 24,
    userLiked: true,
    replies: 7
  }
];

export const mockPerformanceHistory: PerformanceItem[] = [
  {
    id: "perf-1",
    title: "New Employee Orientation & Lab Organization (SP-100)",
    titleAr: "التهيئة والتعريف بأنظمة ومعايير المختبرات (SP-100)",
    completedDate: "Sep 05, 2024",
    completedDateAr: "05 سبتمبر 2024",
    score: 92,
    maxScore: 100,
    summary: "Successfully passed on First Attempt. Verified by Training Admin.",
    summaryAr: "تم الاجتياز بنجاح من المحاولة الأولى بنسبة 92%. موثق إلكترونياً.",
    tags: ["Accredited", "First Attempt", "Orientation"],
    tagsAr: ["معتمد", "محاولة أولى", "مسار توجيه"],
    icon: "verified"
  }
];

export const mockCoreCompetencies: CoreCompetency[] = [
  { id: "c1", name: "Laboratory Organization & Policies", nameAr: "التنظيم والسياسات المخبرية", level: "Verified Competency", levelAr: "كفاءة موثقة", mastered: true },
  { id: "c2", name: "BSL-2 Biosafety Containment", nameAr: "الأمان الحيوي واحتواء BSL-2", level: "In Assessment", levelAr: "قيد التقييم", mastered: false },
  { id: "c3", name: "Infection Control & Sharps Handling", nameAr: "مكافحة العدوى والأدوات الحادة", level: "Prerequisite Locked", levelAr: "مغلق بالمتطلب السابق", mastered: false },
  { id: "c4", name: "Centrifuge & Sample Accessioning", nameAr: "سحب واستلام العينات والطرد", level: "Prerequisite Locked", levelAr: "مغلق بالمتطلب السابق", mastered: false },
  { id: "c5", name: "Westgard QC & Critical Reporting", nameAr: "قواعد ويستغارد وإبلاغ النتائج الحرجة", level: "Prerequisite Locked", levelAr: "مغلق بالمتطلب السابق", mastered: false }
];

export const mockResources: ResourceDocument[] = [
  {
    id: "res-1",
    title: "Shalaby Labs New Employee Orientation Handbook v3.2",
    titleAr: "دليل الموظف الجديد في معامل شلبي v3.2",
    category: "Safety",
    format: "PDF",
    size: "3.4 MB",
    icon: "picture_as_pdf"
  },
  {
    id: "res-2",
    title: "BSL-2 Laboratory Safety Manual & Spill Protocol",
    titleAr: "دليل السلامة والأمان الحيوي BSL-2 وبروتوكول الانسكابات",
    category: "Safety",
    format: "PDF",
    size: "2.8 MB",
    icon: "picture_as_pdf"
  },
  {
    id: "res-3",
    title: "Specimen Collection Order of Draw Reference Chart",
    titleAr: "مخطط الترتيب القياسي لسحب أنابيب العينات",
    category: "Specimen",
    format: "PDF",
    size: "1.2 MB",
    icon: "picture_as_pdf"
  },
  {
    id: "res-4",
    title: "Westgard Multirule Decision Flowchart (ISO 15189)",
    titleAr: "مخطط شجرة اتخاذ القرار لقواعد ويستغارد (ISO 15189)",
    category: "QC",
    format: "PDF",
    size: "1.9 MB",
    icon: "picture_as_pdf"
  },
  {
    id: "res-5",
    title: "Laboratory Orientation Audit & KPI Template",
    titleAr: "نموذج تدقيق ومؤشرات أداء فترة التوجيه المخبري",
    category: "Leadership",
    format: "XLSX",
    size: "650 KB",
    icon: "table_chart"
  }
];

export const mockAllLessons = mockLessons;


