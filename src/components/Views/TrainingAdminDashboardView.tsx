import React, { useState } from 'react';
import { ViewType, TraineeAccount, Course } from '../../types';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  UserPlus, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Eye, 
  Send, 
  Award, 
  Calendar, 
  Building2, 
  X, 
  ShieldCheck, 
  TrendingUp,
  ArrowUpDown,
  Filter,
  Check,
  Settings
} from 'lucide-react';
import { mockTraineeAccounts, mockSequentialCourses } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface TrainingAdminDashboardViewProps {
  onNavigate: (view: ViewType) => void;
  onViewCertificate?: (courseId: string) => void;
  onAddAuditLog?: (action: string, actionAr: string, details: string, detailsAr: string, target: string) => void;
}

export const TrainingAdminDashboardView: React.FC<TrainingAdminDashboardViewProps> = ({
  onNavigate,
  onViewCertificate,
  onAddAuditLog,
}) => {
  const { t, isRTL } = useLanguage();

  const [trainees, setTrainees] = useState<TraineeAccount[]>(mockTraineeAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [selectedDrilldownTrainee, setSelectedDrilldownTrainee] = useState<TraineeAccount | null>(null);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Trainee Form State
  const [newTraineeForm, setNewTraineeForm] = useState({
    name: '',
    nameAr: '',
    employeeId: `SL-2024-0${Math.floor(600 + Math.random() * 300)}`,
    jobTitle: 'Medical Laboratory Technologist',
    jobTitleAr: 'أخصائي تحاليل طبية',
    department: 'Clinical Chemistry',
    departmentAr: 'الكيمياء الإكلينيكية',
    branch: 'Cairo Main Facility',
    branchAr: 'فرع القاهرة الرئيسي',
    hireDate: new Date().toISOString().split('T')[0],
    orientationStartDate: '01 Oct 2024',
    orientationEndDate: '31 Dec 2024',
    assignedPathId: 'path-orientation-1',
    assignedPathTitle: 'Mandatory Clinical Laboratory Orientation',
    assignedPathTitleAr: 'المسار التوجيهي الإلزامي لأخصائيي المختبرات',
    email: '',
    phone: ''
  });

  // KPI Calculations
  const totalEmployeesInOrientation = 32;
  const completedCount = 20;
  const inProgressCount = 8;
  const overdueCount = 4;
  const avgScore = 87.4;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendReminder = (trainee: TraineeAccount, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`${isRTL ? 'تم إرسال تذكير رسمي للموظف' : 'Official reminder dispatched to'} ${isRTL && trainee.nameAr ? trainee.nameAr : trainee.name}`);
    if (onAddAuditLog) {
      onAddAuditLog(
        "Orientation Reminder Sent",
        "إرسال تذكير رسمي بالتدريب المتأخر",
        `Dispatched formal orientation overdue notification to ${trainee.name} (${trainee.employeeId})`,
        `تم إرسال إشعار تذكير رسمي باستكمال التدريب للموظف ${trainee.nameAr || trainee.name}`,
        `Trainee: ${trainee.name}`
      );
    }
  };

  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraineeForm.name) return;

    const newAccount: TraineeAccount = {
      id: `trn-${Date.now()}`,
      name: newTraineeForm.name,
      nameAr: newTraineeForm.nameAr || newTraineeForm.name,
      employeeId: newTraineeForm.employeeId,
      jobTitle: newTraineeForm.jobTitle,
      jobTitleAr: newTraineeForm.jobTitleAr,
      department: newTraineeForm.department,
      departmentAr: newTraineeForm.departmentAr,
      branch: newTraineeForm.branch,
      branchAr: newTraineeForm.branchAr,
      hireDate: newTraineeForm.hireDate,
      orientationStartDate: newTraineeForm.orientationStartDate,
      orientationEndDate: newTraineeForm.orientationEndDate,
      assignedPathId: newTraineeForm.assignedPathId,
      assignedPathTitle: newTraineeForm.assignedPathTitle,
      assignedPathTitleAr: newTraineeForm.assignedPathTitleAr,
      status: 'Not Started',
      overallProgress: 0,
      completedCoursesCount: 0,
      totalCoursesCount: 5,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
      email: newTraineeForm.email || `${newTraineeForm.name.toLowerCase().replace(/\s+/g, '.')}@shalabylabs.com`,
      phone: newTraineeForm.phone || '+20 100 000 0000',
      lastActive: 'Just now',
      courses: mockSequentialCourses.map((c, idx) => ({
        courseId: c.id,
        courseCode: c.code,
        status: idx === 0 ? 'In Progress' : 'Locked',
        progress: 0,
        attemptsUsed: 0,
        maxAttempts: 3
      }))
    };

    setTrainees([newAccount, ...trainees]);
    setIsCreateAccountOpen(false);
    showToast(isRTL ? `تم إنشاء حساب ${newAccount.nameAr} وتعيين مسار التوجيه بنجاح` : `Account for ${newAccount.name} created and assigned successfully`);

    if (onAddAuditLog) {
      onAddAuditLog(
        "Trainee Account Created",
        "إنشاء حساب موظف وتعيين مسار التوجيه",
        `Created account for ${newAccount.name} (${newAccount.employeeId}) at branch ${newAccount.branch}`,
        `تم إنشاء حساب للموظف ${newAccount.nameAr} بالرقم الوظيفي ${newAccount.employeeId}`,
        `Trainee: ${newAccount.name}`
      );
    }
  };

  const handleExportExcel = () => {
    const headers = ["Employee ID", "Full Name", "Department", "Branch", "Hire Date", "Orientation Window", "Status", "Progress %", "Courses Completed"];
    const rows = trainees.map(t => [
      t.employeeId,
      `"${t.name}"`,
      `"${t.department}"`,
      `"${t.branch}"`,
      t.hireDate,
      `"${t.orientationStartDate} - ${t.orientationEndDate}"`,
      t.status,
      `${t.overallProgress}%`,
      `${t.completedCoursesCount}/${t.totalCoursesCount}`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Shalaby_Labs_Orientation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(isRTL ? 'تم تصدير ملف الإكسل (CSV) بنجاح' : 'Excel CSV report exported successfully');
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Filtering
  const filteredTrainees = trainees.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameAr.includes(searchQuery) ||
      t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBranch = selectedBranch === 'All' || t.branch.includes(selectedBranch);
    const matchesDept = selectedDept === 'All' || t.department.includes(selectedDept);
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B96C7] text-white px-4.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t.adminDashboardTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            {t.adminDashboardSubtitle}
          </p>
        </div>

        {/* Global Admin Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreateAccountOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t.createNewTrainee}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
            title="Export to Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">{t.exportExcel}</span>
          </button>

          <button
            onClick={() => onNavigate('system_admin')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#dee2e8] hover:bg-[#dee2e8] text-[#0B96C7] text-xs font-semibold border border-[#c0cad8] transition-all cursor-pointer"
            title="Course Studio & Videos"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{isRTL ? 'استوديو المحتوى والقواعد' : 'Course Studio & Rules'}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
            title="Export to PDF"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{t.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards: 32 Total, 20 Completed, 8 In Progress, 4 Overdue */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* Total Cohort */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.kpiTotalOrientation}</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalEmployeesInOrientation}
          </p>
          <p className="text-[11px] text-slate-500">
            {isRTL ? 'معامل شلبي (جميع الفروع)' : 'Across all lab facilities'}
          </p>
        </div>

        {/* Completed */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.kpiCompleted}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {completedCount}
          </p>
          <p className="text-[11px] text-emerald-700 font-medium">
            {Math.round((completedCount / totalEmployeesInOrientation) * 100)}% {isRTL ? 'إنجاز كامل ومعتمد' : 'Full compliance rate'}
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.kpiInProgress}</span>
            <div className="w-7 h-7 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0B96C7] font-mono tabular-nums">
            {inProgressCount}
          </p>
          <p className="text-[11px] text-slate-500">
            {isRTL ? 'ضمن الجدول الزمني الطبيعي' : 'On-schedule progression'}
          </p>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.kpiOverdue}</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 font-mono tabular-nums">
            {overdueCount}
          </p>
          <p className="text-[11px] text-rose-700 font-medium">
            {isRTL ? 'بحاجة لتنبيه ومتابعة فورية' : 'Requires escalation reminder'}
          </p>
        </div>

        {/* Average Passing Score */}
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">{t.kpiAvgScore}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {avgScore}%
          </p>
          <p className="text-[11px] text-amber-800 font-medium">
            {isRTL ? 'أعلى من حد النجاح (80%)' : 'Exceeds 80% passing threshold'}
          </p>
        </div>

      </div>

      {/* Trainee Accounts Directory & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Filter Controls Header */}
        <div className="p-5 border-b border-slate-200/80 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">
              {t.traineeDirectoryTitle}
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              {filteredTrainees.length} {isRTL ? 'سجل مطابق' : 'matching records'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className={`w-3.5 h-3.5 text-slate-400 absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchTrainee}
                className={`w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#0B96C7] transition-colors ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'}`}
              />
            </div>

            {/* Filter by Branch */}
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#0B96C7]"
            >
              <option value="All">{t.allBranches}</option>
              <option value="Cairo">Cairo Main Facility</option>
              <option value="Alexandria">Alexandria Branch</option>
              <option value="Giza">Giza Branch</option>
              <option value="Heliopolis">Heliopolis Branch</option>
              <option value="Mansoura">Mansoura Facility</option>
            </select>

            {/* Filter by Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#0B96C7]"
            >
              <option value="All">{t.allDepartments}</option>
              <option value="Clinical Chemistry">Clinical Chemistry</option>
              <option value="Microbiology">Microbiology & Serology</option>
              <option value="Molecular">Molecular Biology</option>
              <option value="Pre-Analytics">Pre-Analytics & Phlebotomy</option>
              <option value="Hematology">Hematology & Coagulation</option>
            </select>

            {/* Filter by Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-[#0B96C7]"
            >
              <option value="All">{t.allStatuses}</option>
              <option value="In Progress">{t.statusInProgress}</option>
              <option value="Completed">{t.statusCompleted}</option>
              <option value="Overdue">{t.statusOverdue}</option>
              <option value="Not Started">{t.statusNotStarted}</option>
            </select>
          </div>
        </div>

        {/* High Density Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3 px-5 text-start">{t.colName}</th>
                <th className="py-3 px-4 text-start">{t.colId}</th>
                <th className="py-3 px-4 text-start">{t.colDeptBranch}</th>
                <th className="py-3 px-4 text-start">{t.colOrientationPeriod}</th>
                <th className="py-3 px-4 text-start">{t.colProgress}</th>
                <th className="py-3 px-4 text-start">{t.colStatus}</th>
                <th className="py-3 px-5 text-end">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrainees.map((trainee) => {
                const isOverdue = trainee.status === 'Overdue';
                const isCompleted = trainee.status === 'Completed';

                return (
                  <tr 
                    key={trainee.id}
                    onClick={() => setSelectedDrilldownTrainee(trainee)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Name & Job Title */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={trainee.avatarUrl}
                          alt={trainee.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-[#0B96C7] transition-colors">
                            {isRTL && trainee.nameAr ? trainee.nameAr : trainee.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {isRTL && trainee.jobTitleAr ? trainee.jobTitleAr : trainee.jobTitle}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0B96C7] tabular-nums">
                      {trainee.employeeId}
                    </td>

                    {/* Department & Branch */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-900">
                        {isRTL && trainee.departmentAr ? trainee.departmentAr : trainee.department}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {isRTL && trainee.branchAr ? trainee.branchAr : trainee.branch}
                      </p>
                    </td>

                    {/* Orientation Period */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 tabular-nums">
                      <span>{trainee.orientationStartDate}</span>
                      <span className="text-slate-300"> → </span>
                      <span>{trainee.orientationEndDate}</span>
                    </td>

                    {/* Progress */}
                    <td className="py-3.5 px-4 min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px] font-mono font-medium mb-1">
                        <span>{trainee.completedCoursesCount}/5 {t.completedCourses}</span>
                        <span className="text-[#0B96C7] font-bold tabular-nums">{trainee.overallProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className="bg-[#0B96C7] h-full rounded-full transition-all duration-500"
                          style={{ width: `${trainee.overallProgress}%` }}
                        />
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                          : isOverdue
                            ? 'bg-rose-50 text-rose-800 border border-rose-200/80'
                            : trainee.status === 'In Progress'
                              ? 'bg-[#dee2e8] text-[#0B96C7] border border-[#c0cad8]/80'
                              : 'bg-amber-50 text-amber-800 border border-amber-200/80'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isCompleted ? 'bg-emerald-600' : isOverdue ? 'bg-rose-600' : 'bg-[#0B96C7]'
                        }`} />
                        {trainee.status === 'Completed' ? t.statusCompleted : trainee.status === 'Overdue' ? t.statusOverdue : trainee.status === 'In Progress' ? t.statusInProgress : t.statusNotStarted}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5 text-end">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {isOverdue && (
                          <button
                            onClick={(e) => handleSendReminder(trainee, e)}
                            className="p-1 rounded text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                            title={t.sendReminder}
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedDrilldownTrainee(trainee)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#0B96C7]" />
                          <span>{t.viewDetails}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Drill-Down Dossier Modal for Employee (Ahmed Mohamed -> 4/5 Courses -> 80% Complete) */}
      {selectedDrilldownTrainee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedDrilldownTrainee.avatarUrl}
                  alt={selectedDrilldownTrainee.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {isRTL && selectedDrilldownTrainee.nameAr ? selectedDrilldownTrainee.nameAr : selectedDrilldownTrainee.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                      {selectedDrilldownTrainee.employeeId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {isRTL && selectedDrilldownTrainee.jobTitleAr ? selectedDrilldownTrainee.jobTitleAr : selectedDrilldownTrainee.jobTitle} · {selectedDrilldownTrainee.branch}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDrilldownTrainee(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Bar: Progress % & Orientation Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">{t.overallCompletion}</span>
                <span className="text-base font-bold text-[#0B96C7] font-mono tabular-nums">
                  {selectedDrilldownTrainee.completedCoursesCount} / 5 ({selectedDrilldownTrainee.overallProgress}%)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{t.orientationPeriod}</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {selectedDrilldownTrainee.orientationStartDate} – {selectedDrilldownTrainee.orientationEndDate}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{t.hireDate}</span>
                <span className="font-mono font-medium text-slate-900 tabular-nums">
                  {selectedDrilldownTrainee.hireDate}
                </span>
              </div>
            </div>

            {/* Detailed Course Matrix Table: Start Date, Completion Date, Score, Attempts, Certificate */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t.courseMatrix}
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {isRTL ? 'معيار النجاح: ≥ 80% · المحاولات: 3' : 'Passing Threshold: ≥ 80% · Max 3 Attempts'}
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-start text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3.5 text-start">{t.colCourse}</th>
                      <th className="py-2.5 px-3 text-start">{t.colStartDate}</th>
                      <th className="py-2.5 px-3 text-start">{t.colCompletionDate}</th>
                      <th className="py-2.5 px-3 text-start">{t.colScore}</th>
                      <th className="py-2.5 px-3 text-start">{t.colAttempts}</th>
                      <th className="py-2.5 px-3.5 text-end">{t.colCertStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockSequentialCourses.map((course) => {
                      const trnCourse = selectedDrilldownTrainee.courses.find(c => c.courseId === course.id);
                      const isCompleted = trnCourse?.status === 'Completed';
                      const isInProgress = trnCourse?.status === 'In Progress';

                      return (
                        <tr key={course.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3.5 font-medium text-slate-900">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#0B96C7]">
                                {course.code}
                              </span>
                              <span className="truncate max-w-[180px]" title={course.title}>
                                {isRTL && course.titleAr ? course.titleAr : course.title}
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] tabular-nums">
                            {trnCourse?.startDate || (isCompleted ? '2024-09-02' : '--')}
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px] tabular-nums">
                            {isCompleted ? (
                              <span className="text-emerald-700 font-medium">
                                {trnCourse?.completedDate || '2024-09-05'}
                              </span>
                            ) : (
                              <span className="text-slate-400">--</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 font-mono tabular-nums">
                            {trnCourse?.score ? (
                              <span className={`font-semibold ${
                                trnCourse.score >= 80 ? 'text-emerald-700' : 'text-rose-700'
                              }`}>
                                {trnCourse.score}%
                              </span>
                            ) : (
                              <span className="text-slate-400">--</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-slate-600 font-mono tabular-nums">
                            {trnCourse ? `${trnCourse.attemptsUsed} / ${trnCourse.maxAttempts}` : '0 / 3'}
                          </td>

                          <td className="py-2.5 px-3.5 text-end">
                            {isCompleted ? (
                              <button
                                onClick={() => {
                                  if (onViewCertificate) onViewCertificate(course.id);
                                  onNavigate('certificate');
                                  setSelectedDrilldownTrainee(null);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/80 hover:bg-emerald-100 transition-all cursor-pointer"
                              >
                                <Award className="w-3 h-3 text-emerald-700" />
                                <span>{t.downloadCert}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400">
                                {isInProgress ? (isRTL ? 'قيد الدراسة' : 'In Progress') : (isRTL ? 'مغلق' : 'Locked')}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={(e) => handleSendReminder(selectedDrilldownTrainee, e)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendReminder}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadFullReport}</span>
                </button>

                <button
                  onClick={() => setSelectedDrilldownTrainee(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Create Trainee Account Modal */}
      {isCreateAccountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.createTraineeModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsCreateAccountOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.fullNameEn} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mostafa Ali"
                    value={newTraineeForm.name}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0B96C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.fullNameAr}</label>
                  <input
                    type="text"
                    placeholder="مثال: مصطفى علي"
                    value={newTraineeForm.nameAr}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, nameAr: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#0B96C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.employeeId} *</label>
                  <input
                    type="text"
                    required
                    value={newTraineeForm.employeeId}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, employeeId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-[#0B96C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.jobTitle}</label>
                  <select
                    value={newTraineeForm.jobTitle}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, jobTitle: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0B96C7]"
                  >
                    <option value="Medical Laboratory Technologist">Medical Laboratory Technologist</option>
                    <option value="Clinical Pathologist">Clinical Pathologist</option>
                    <option value="Phlebotomy Specialist">Phlebotomy Specialist</option>
                    <option value="Microbiology Specialist">Microbiology Specialist</option>
                    <option value="Quality Assurance Officer">Quality Assurance Officer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.department}</label>
                  <select
                    value={newTraineeForm.department}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, department: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0B96C7]"
                  >
                    <option value="Clinical Chemistry">Clinical Chemistry</option>
                    <option value="Microbiology & Serology">Microbiology & Serology</option>
                    <option value="Molecular Biology">Molecular Biology</option>
                    <option value="Hematology & Coagulation">Hematology & Coagulation</option>
                    <option value="Pre-Analytics & Phlebotomy">Pre-Analytics & Phlebotomy</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.branch}</label>
                  <select
                    value={newTraineeForm.branch}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, branch: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0B96C7]"
                  >
                    <option value="Cairo Main Facility">Cairo Main Facility</option>
                    <option value="Alexandria Branch">Alexandria Branch</option>
                    <option value="Giza Branch">Giza Branch</option>
                    <option value="Heliopolis Branch">Heliopolis Branch</option>
                    <option value="Mansoura Facility">Mansoura Facility</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.hireDate}</label>
                  <input
                    type="date"
                    value={newTraineeForm.hireDate}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, hireDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#0B96C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.startDateLabel}</label>
                  <input
                    type="text"
                    value={newTraineeForm.orientationStartDate}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, orientationStartDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#0B96C7]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">{t.endDateLabel}</label>
                  <input
                    type="text"
                    value={newTraineeForm.orientationEndDate}
                    onChange={(e) => setNewTraineeForm({...newTraineeForm, orientationEndDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-[#0B96C7]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#dee2e8]/50 rounded-xl border border-[#c0cad8]/60 text-xs">
                <span className="font-semibold text-[#0B96C7] block mb-1">
                  {isRTL ? 'المسار التدريبي المعين:' : 'Assigned Sequential Training Pathway:'}
                </span>
                <p className="text-slate-600 text-[11px]">
                  {isRTL ? 'المسار التوجيهي الإلزامي لأخصائيي المختبرات (5 مقررات متتالية مشروطة بالاجتياز ≥ 80%)' : 'Mandatory Clinical Laboratory Orientation (5 sequential courses locked until prerequisite passed with ≥ 80%)'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateAccountOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white font-semibold shadow-xs cursor-pointer active:scale-95"
                >
                  {t.saveTraineeAccount}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
