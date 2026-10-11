export type Language = 'en' | 'ar';

export type UserRole = 'trainee' | 'training_admin' | 'system_admin';

export type ViewType = 
  | 'dashboard'
  | 'trainee_dashboard'
  | 'training_admin'
  | 'system_admin'
  | 'video_lesson'
  | 'course_player'
  | 'quiz'
  | 'performance'
  | 'certificate'
  | 'active_modules'
  | 'resources'
  | 'support'
  | 'leadership_path'
  | 'coaching';

export type TrainingType = 
  | 'Orientation'
  | 'Annual Mandatory'
  | 'Refresher'
  | 'Competency'
  | 'Department'
  | 'Policy Update'
  | 'Recertification';

export interface UserProfile {
  id: string;
  name: string;
  nameAr?: string;
  title: string;
  titleAr?: string;
  role: UserRole;
  employeeId: string;
  department: string;
  departmentAr?: string;
  branch: string;
  branchAr?: string;
  hireDate: string;
  orientationStartDate?: string;
  orientationEndDate?: string;
  assignedPathTitle?: string;
  assignedPathTitleAr?: string;
  phase: string;
  phaseAr?: string;
  avatarUrl: string;
  initials: string;
  credentialId: string;
  overallProgress: number;
  email?: string;
  phone?: string;
}

export interface CourseMaterial {
  id: string;
  type: 'video' | 'pdf' | 'presentation' | 'instructions';
  title: string;
  titleAr: string;
  url?: string;
  content?: string;
  durationOrPages: string;
  durationOrPagesAr?: string;
}

export interface Course {
  id: string;
  moduleNumber: number;
  code: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: string;
  categoryAr: string;
  trainingType: TrainingType;
  trainingTypeAr: string;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Locked';
  progress: number;
  estMinutes: number;
  imageUrl: string;
  isStarred?: boolean;
  instructor?: string;
  instructorAr?: string;
  cmeCredits?: number;
  passScore: number; // e.g. 80
  allowedAttempts: number; // e.g. 3
  prerequisiteCourseId?: string;
  prerequisiteCourseCode?: string;
  certificateAvailable: boolean;
  validityMonths?: number; // e.g. 12 months
  materials?: CourseMaterial[];
}

export type TrainingModule = Course;

export interface TraineeCourseProgress {
  courseId: string;
  courseCode: string;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Locked';
  progress: number;
  startDate?: string;
  completedDate?: string;
  score?: number;
  attemptsUsed: number;
  maxAttempts: number;
  certificateId?: string;
  certificateIssuedDate?: string;
}

export interface TraineeAccount {
  id: string;
  name: string;
  nameAr: string;
  employeeId: string;
  jobTitle: string;
  jobTitleAr: string;
  department: string;
  departmentAr: string;
  branch: string;
  branchAr: string;
  hireDate: string;
  orientationStartDate: string;
  orientationEndDate: string;
  assignedPathId: string;
  assignedPathTitle: string;
  assignedPathTitleAr: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  overallProgress: number;
  completedCoursesCount: number;
  totalCoursesCount: number;
  avatarUrl: string;
  email: string;
  phone: string;
  courses: TraineeCourseProgress[];
  lastActive: string;
}

export interface TranscriptItem {
  time: string;
  seconds: number;
  text: string;
  textAr: string;
}

export interface LessonNote {
  id: string;
  timestamp: string;
  content: string;
  createdAt: string;
}

export interface LessonItem {
  id: string;
  moduleId: string;
  stageNumber?: string;
  title: string;
  titleAr?: string;
  duration: string;
  type: 'Video' | 'Interactive Module' | 'Case Study';
  status: 'Completed' | 'Currently Playing' | 'Locked' | 'Not Started' | 'In Progress';
  completed: boolean;
  videoUrl?: string;
  description?: string;
  descriptionAr?: string;
  protocolId?: string;
  learningObjectives?: string[];
  learningObjectivesAr?: string[];
  transcript?: TranscriptItem[];
}

export interface QuizQuestion {
  id: number;
  questionNumber: number;
  totalQuestions: number;
  question: string;
  questionAr?: string;
  hint: string;
  hintAr?: string;
  options: string[];
  optionsAr?: string[];
  correctIndex: number;
  explanation: string;
  explanationAr?: string;
  moduleRef: string;
  moduleRefAr?: string;
  courseId?: string;
  moduleId?: string;
  difficulty?: 'Basic' | 'Intermediate' | 'Advanced';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'Trainee' | 'Training Admin' | 'System Admin';
  action: string;
  actionAr: string;
  details: string;
  detailsAr: string;
  target: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Security Alert';
}

export interface CertificateRecord {
  certificateId: string;
  traineeName: string;
  traineeNameAr: string;
  employeeId: string;
  courseTitle: string;
  courseTitleAr: string;
  courseCode: string;
  issueDate: string;
  expiryDate?: string;
  score: number;
  passingScore: number;
  isOrientationMaster?: boolean;
  verificationCode: string;
  authorizedSigner: string;
  authorizedSignerAr: string;
}

export interface ForumPost {
  id: string;
  author: string;
  role: string;
  roleAr?: string;
  avatarUrl: string;
  timeAgo: string;
  timeAgoAr?: string;
  content: string;
  contentAr?: string;
  likes: number;
  userLiked?: boolean;
  replies: number;
}

export interface PerformanceItem {
  id: string;
  title: string;
  titleAr?: string;
  completedDate: string;
  completedDateAr?: string;
  score: number;
  maxScore: number;
  summary: string;
  summaryAr?: string;
  tags: string[];
  tagsAr?: string[];
  icon: string;
}

export interface CoreCompetency {
  id: string;
  name: string;
  nameAr?: string;
  level: string;
  levelAr?: string;
  mastered: boolean;
}

export interface ResourceDocument {
  id: string;
  title: string;
  titleAr?: string;
  category?: 'Safety' | 'Specimen' | 'QC' | 'Leadership';
  format: 'PDF' | 'XLSX' | 'External Link';
  size?: string;
  icon: string;
  downloadUrl?: string;
}
