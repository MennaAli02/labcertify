import React, { useState, useEffect } from 'react';
import { Users, Check, CheckCircle2, Clock, AlertTriangle, Search, UserPlus, FileSpreadsheet, FileText, Download, Eye, Send, Award, Calendar, X, ShieldCheck, TrendingUp, Settings, ArrowRight } from 'lucide-react';
import { mockTraineeAccounts, mockSequentialCourses, mockPersonas } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { TablePagination } from '../Common/TablePagination';
import { labCertifyApi } from '../../services/api';

export const TrainingAdminDashboardView = ({ user = mockPersonas.training_admin, onNavigate, onViewCertificate, onAddAuditLog, }) => {
    const { t, isRTL } = useLanguage();
    const [trainees, setTrainees] = useState(mockTraineeAccounts);

    // Fetch live trainees from Odoo backend
    useEffect(() => {
        labCertifyApi.getTrainees()
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setTrainees(data);
                }
            })
            .catch(err => console.warn('[TrainingAdmin] Backend load trainees:', err));
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('All');
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    // Pagination state (default: 5 rows per table)
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    // Reset to page 1 whenever filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedBranch, selectedDept, selectedStatus]);
    // Modals state
    const [selectedDrilldownTrainee, setSelectedDrilldownTrainee] = useState(null);
    const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
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
    const totalEmployeesInOrientation = trainees.length;
    const completedCount = trainees.filter(t => t.status === 'Completed').length;
    const inProgressCount = trainees.filter(t => t.status === 'In Progress').length;
    const overdueCount = trainees.filter(t => t.status === 'Overdue').length;
    const complianceRate = Math.round((completedCount / totalEmployeesInOrientation) * 100);
    const avgScore = 87.4;
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };
    const handleSendReminder = (trainee, e) => {
        e.stopPropagation();
        showToast(`${isRTL ? 'تم إرسال تذكير رسمي للموظف' : 'Official reminder dispatched to'} ${isRTL && trainee.nameAr ? trainee.nameAr : trainee.name}`);
        if (onAddAuditLog) {
            onAddAuditLog("Orientation Reminder Sent", "إرسال تذكير رسمي بالتدريب المتأخر", `Dispatched formal orientation overdue notification to ${trainee.name} (${trainee.employeeId})`, `تم إرسال إشعار تذكير رسمي باستكمال التدريب للموظف ${trainee.nameAr || trainee.name}`, `Trainee: ${trainee.name}`);
        }
        // Send reminder via Odoo backend
        labCertifyApi.sendTraineeReminder(trainee.id).catch(err => {
            console.warn('[TrainingAdmin] Backend send reminder:', err);
        });
    };
    const handleCreateAccountSubmit = (e) => {
        e.preventDefault();
        if (!newTraineeForm.name)
            return;
        const newAccount = {
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
            onAddAuditLog("Trainee Account Created", "إنشاء حساب موظف وتعيين مسار التوجيه", `Created account for ${newAccount.name} (${newAccount.employeeId}) at branch ${newAccount.branch}`, `تم إنشاء حساب للموظف ${newAccount.nameAr} بالرقم الوظيفي ${newAccount.employeeId}`, `Trainee: ${newAccount.name}`);
        }
        // Save to Odoo backend
        labCertifyApi.createTrainee(newAccount).then(created => {
            if (created && created.id) {
                setTrainees(prev => [created, ...prev.filter(t => t.id !== newAccount.id)]);
            }
        }).catch(err => {
            console.warn('[TrainingAdmin] Backend create trainee:', err);
        });
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
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.nameAr.includes(searchQuery) ||
            t.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBranch = selectedBranch === 'All' || t.branch.includes(selectedBranch);
        const matchesDept = selectedDept === 'All' || t.department.includes(selectedDept);
        const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
        return matchesSearch && matchesBranch && matchesDept && matchesStatus;
    });
    // Pagination calculation
    const totalTraineePages = Math.max(1, Math.ceil(filteredTrainees.length / pageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalTraineePages);
    const paginatedTrainees = filteredTrainees.slice(
        (safeCurrentPage - 1) * pageSize,
        safeCurrentPage * pageSize
    );
    return (<div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (<div className="fixed bottom-6 right-6 z-50 bg-[#0B96C7] text-white px-4.5 py-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0"/>
          <span>{toastMessage}</span>
        </div>)}

      {/* 1. Clinical Training Administration Passport / Cohort Dossier Card */}
      <div className="bg-white rounded-2xl border border-[#c0cad8] shadow-xs overflow-hidden">
        
        {/* Accreditation & Governance Stripe */}
        <div className="bg-[#dee2e8]/40 border-b border-[#c0cad8]/80 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-[#485261]">
            <ShieldCheck className="w-4 h-4 text-[#0B96C7]"/>
            <span className="font-semibold text-[#485261]">
              {isRTL ? 'برنامج التأهيل والتدريب المخبري المعتمد — الرقابة الإدارية' : 'Mandatory Clinical Laboratory Qualification — Training Governance'}
            </span>
            <span className="text-[#c0cad8]">|</span>
            <span className="text-[11px] text-[#9995A6] font-mono">ISO 15189:2022 · CAP #8472910</span>
            <span className="text-[#c0cad8]">|</span>
            <span className="text-[10px] font-mono font-medium text-[#485261] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
              {isRTL ? 'رقابة الدفعة التدريبية النشطة' : 'Active Cohort Governance'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border text-emerald-700 bg-emerald-50 border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"/>
              {isRTL ? 'الرقابة الإدارية: مفعلة ومكتملة' : 'Oversight: Active & Verified'}
            </span>
          </div>
        </div>

        {/* Main Overview: Administrator Identity & Cohort Action Hub */}
        <div className="p-6 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Admin Identity & Orientation Dossier */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative shrink-0">
                  <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-[#c0cad8] shadow-xs"/>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0B96C7] text-white flex items-center justify-center ring-2 ring-white shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]"/>
                  </span>
                </div>

                <div className="space-y-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold font-sans text-[#485261] tracking-tight leading-snug">
                    {t.welcomeBack}, {isRTL && user.nameAr ? user.nameAr : user.name}
                  </h1>

                  <p className="text-xs sm:text-sm font-semibold text-[#0B96C7]">
                    {isRTL && user.titleAr ? user.titleAr : user.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-xs text-[#9995A6]">
                    <span className="font-mono text-[#485261] font-semibold">
                      <span className="text-[#9995A6] font-sans font-normal">{t.employeeId}:</span> {user.employeeId}
                    </span>
                    <span className="text-[#c0cad8]">·</span>
                    <span className="text-[#485261]">
                      {isRTL && user.departmentAr ? user.departmentAr : user.department}
                    </span>
                    <span className="text-[#c0cad8]">·</span>
                    <span className="text-[#485261]">
                      {isRTL && user.branchAr ? user.branchAr : user.branch}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compact Active Cohort Schedule Row */}
              <div className="bg-[#dee2e8]/30 p-3.5 rounded-xl border border-[#c0cad8]/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#485261]">
                  <Calendar className="w-4 h-4 text-[#0B96C7] shrink-0"/>
                  <span className="font-semibold text-[#485261]">
                    {isRTL ? 'دورة التوجيه والتأهيل الحالية:' : 'Active Cohort Window:'}
                  </span>
                  <span className="font-mono font-bold text-[#485261] tabular-nums">
                    01 Sep 2024 – 30 Nov 2024
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#c0cad8] font-mono font-bold text-xs text-[#485261] shadow-2xs">
                    {totalEmployeesInOrientation} {isRTL ? 'متدربين مسجلين' : 'Trainees Enrolled'} · {completedCount} {isRTL ? 'معتمدين' : 'Certified'} ({complianceRate}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Executive Cohort Actions Hub */}
            <div className="lg:col-span-5 xl:col-span-5 bg-[#dee2e8]/30 p-5 rounded-xl border border-[#c0cad8] flex flex-col justify-between space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#0B96C7] flex items-center gap-1.5 font-mono">
                  <Users className="w-4 h-4"/>
                  {isRTL ? 'إجراءات إدارة الدفعة' : 'Cohort Management Hub'}
                </span>
                <span className="text-xs font-mono font-bold text-[#485261] bg-white px-2 py-0.5 rounded border border-[#c0cad8]">
                  {complianceRate}% {isRTL ? 'إنجاز الدفعة' : 'Cohort Compliance'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#485261]">
                  {isRTL ? 'المسار التوجيهي الإلزامي لأخصائيي المختبرات' : 'Mandatory Clinical Laboratory Qualification Track'}
                </h3>
                <p className="text-[11px] text-[#9995A6] leading-relaxed">
                  {isRTL
            ? 'إدارة تسجيل المتدربين الجدد، متابعة التحصيل، استخراج التقارير الرسمية وإرسال تذكيرات الالتزام بالموعد النهائي.'
            : 'Enroll new lab technicians, audit sequential progression, dispatch compliance reminders, and export accredited records.'}
                </p>

                {/* Cohort Progress bar */}
                <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#c0cad8]/70 mt-1">
                  <div className="bg-[#0B96C7] h-full rounded-full transition-all duration-500" style={{ width: `${complianceRate}%` }}/>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button onClick={() => setIsCreateAccountOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95">
                  <UserPlus className="w-4 h-4"/>
                  <span>{t.createNewTrainee}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`}/>
                </button>

                <div className="grid grid-cols-3 gap-2">
                  <button onClick={handleExportExcel} className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-[#dee2e8]/40 text-[#485261] text-xs font-semibold rounded-lg border border-[#c0cad8] transition-all cursor-pointer" title="Export to Excel">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700"/>
                    <span className="truncate">{t.exportExcel}</span>
                  </button>

                  <button onClick={() => onNavigate('system_admin')} className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-[#dee2e8]/40 text-[#485261] text-xs font-semibold rounded-lg border border-[#c0cad8] transition-all cursor-pointer" title="Course Studio & Rules">
                    <Settings className="w-3.5 h-3.5 text-[#0B96C7]"/>
                    <span className="truncate">{isRTL ? 'استوديو المحتوى' : 'Studio'}</span>
                  </button>

                  <button onClick={handleExportPDF} className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white hover:bg-[#dee2e8]/40 text-[#485261] text-xs font-semibold rounded-lg border border-[#c0cad8] transition-all cursor-pointer" title="Export to PDF">
                    <FileText className="w-3.5 h-3.5 text-[#485261]"/>
                    <span className="truncate">{t.exportPdf}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 2. Key Metrics Row (Standardized 5 KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Metric 1: Total Cohort Enrolled */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.kpiTotalOrientation}</span>
            <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#485261] flex items-center justify-center shrink-0">
              <Users className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {totalEmployeesInOrientation} <span className="text-xs font-normal text-[#9995A6]">Trainees</span>
          </p>
          <p className="text-xs text-[#9995A6] font-medium">
            {isRTL ? 'معامل شلبي (جميع الفروع)' : 'Across all lab facilities'}
          </p>
        </div>

        {/* Metric 2: Completed / Certified */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.kpiCompleted}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {completedCount} <span className="text-xs font-normal text-[#9995A6]">Certified</span>
          </p>
          <p className="text-xs text-emerald-700 font-medium">
            {complianceRate}% {isRTL ? 'إنجاز كامل ومعتمد' : 'Full compliance rate'}
          </p>
        </div>

        {/* Metric 3: In Progress */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.kpiInProgress}</span>
            <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {inProgressCount} <span className="text-xs font-normal text-[#9995A6]">{t.activeModules}</span>
          </p>
          <p className="text-xs text-[#0B96C7] font-medium">
            {isRTL ? 'ضمن الجدول الزمني الطبيعي' : 'On-schedule progression'}
          </p>
        </div>

        {/* Metric 4: Overdue Escalations */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.kpiOverdue}</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {overdueCount} <span className="text-xs font-normal text-[#9995A6]">Overdue</span>
          </p>
          <p className="text-xs text-rose-700 font-medium">
            {isRTL ? 'بحاجة لتنبيه ومتابعة فورية' : 'Requires escalation reminder'}
          </p>
        </div>

        {/* Metric 5: Average Score */}
        <div className="bg-white p-5 rounded-xl border border-[#c0cad8] shadow-2xs hover:border-[#6bbada] transition-all flex flex-col justify-between h-full space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#485261]">{t.kpiAvgScore}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4.5 h-4.5"/>
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#485261] font-mono tabular-nums">
            {avgScore}% <span className="text-xs font-normal text-[#9995A6]">Average</span>
          </p>
          <p className="text-xs text-amber-800 font-medium">
            {isRTL ? 'أعلى من حد النجاح (80%)' : 'Exceeds 80% pass threshold'}
          </p>
        </div>

      </div>

      {/* 3. Trainee Accounts Directory & Filter Section */}
      <div className="bg-white rounded-2xl p-6 lg:p-7 border border-[#c0cad8] shadow-xs space-y-5">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#c0cad8]/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                COHORT ROSTER
              </span>
              <h2 className="text-lg font-bold text-[#485261] tracking-tight">
                {t.traineeDirectoryTitle}
              </h2>
            </div>
            <p className="text-xs text-[#9995A6] mt-1 max-w-3xl leading-relaxed">
              {isRTL
            ? 'استعراض شامل لجميع المتدربين، مراقبة درجات الاختبارات، التحقق من الشهادات الرسمية، وإرسال تنبيهات الالتزام بالمواعيد.'
            : 'Search, inspect prerequisite compliance, view full drill-down transcripts, and dispatch formal reminders to candidates.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#485261] bg-[#dee2e8]/40 px-3 py-1.5 rounded-lg border border-[#c0cad8] shrink-0 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500"/>
            <span>{filteredTrainees.length} {isRTL ? 'سجل مطابق' : 'matching records'}</span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className={`w-3.5 h-3.5 text-[#9995A6] absolute top-3 ${isRTL ? 'right-3' : 'left-3'}`}/>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchTrainee} className={`w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl py-2 text-xs text-[#485261] placeholder:text-[#9995A6] focus:outline-none focus:border-[#0B96C7] focus:bg-white transition-colors ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'}`}/>
          </div>

          {/* Filter by Branch */}
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white cursor-pointer">
            <option value="All">{t.allBranches}</option>
            <option value="Cairo">Cairo Main Facility</option>
            <option value="Alexandria">Alexandria Branch</option>
            <option value="Giza">Giza Branch</option>
            <option value="Heliopolis">Heliopolis Branch</option>
            <option value="Mansoura">Mansoura Facility</option>
          </select>

          {/* Filter by Department */}
          <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} className="bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white cursor-pointer">
            <option value="All">{t.allDepartments}</option>
            <option value="Clinical Chemistry">Clinical Chemistry</option>
            <option value="Microbiology">Microbiology & Serology</option>
            <option value="Molecular">Molecular Biology</option>
            <option value="Pre-Analytics">Pre-Analytics & Phlebotomy</option>
            <option value="Hematology">Hematology & Coagulation</option>
          </select>

          {/* Filter by Status */}
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white cursor-pointer">
            <option value="All">{t.allStatuses}</option>
            <option value="In Progress">{t.statusInProgress}</option>
            <option value="Completed">{t.statusCompleted}</option>
            <option value="Overdue">{t.statusOverdue}</option>
            <option value="Not Started">{t.statusNotStarted}</option>
          </select>
        </div>

        {/* Directory Table */}
        <div className="border border-[#c0cad8] rounded-xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-start text-xs">
              <thead className="bg-[#dee2e8]/40 text-[#485261] font-semibold uppercase tracking-wider border-b border-[#c0cad8]/80">
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
              <tbody className="divide-y divide-[#c0cad8]/40">
                {paginatedTrainees.map((trainee) => {
            const isOverdue = trainee.status === 'Overdue';
            const isCompleted = trainee.status === 'Completed';
            return (<tr key={trainee.id} onClick={() => setSelectedDrilldownTrainee(trainee)} className="hover:bg-[#dee2e8]/20 transition-colors cursor-pointer group">
                      {/* Name & Job Title */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img src={trainee.avatarUrl} alt={trainee.name} className="w-8 h-8 rounded-lg object-cover border border-[#c0cad8] shrink-0"/>
                          <div>
                            <p className="font-semibold text-[#485261] group-hover:text-[#0B96C7] transition-colors">
                              {isRTL && trainee.nameAr ? trainee.nameAr : trainee.name}
                            </p>
                            <p className="text-[11px] text-[#9995A6]">
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
                        <p className="font-medium text-[#485261]">
                          {isRTL && trainee.departmentAr ? trainee.departmentAr : trainee.department}
                        </p>
                        <p className="text-[11px] text-[#9995A6]">
                          {isRTL && trainee.branchAr ? trainee.branchAr : trainee.branch}
                        </p>
                      </td>

                      {/* Orientation Period */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#485261] tabular-nums">
                        <span>{trainee.orientationStartDate}</span>
                        <span className="text-[#c0cad8]"> → </span>
                        <span>{trainee.orientationEndDate}</span>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="flex items-center justify-between text-[11px] font-mono font-medium mb-1">
                          <span className="text-[#9995A6]">{trainee.completedCoursesCount}/5 {t.completedCourses}</span>
                          <span className="text-[#0B96C7] font-bold tabular-nums">{trainee.overallProgress}%</span>
                        </div>
                        <div className="w-full bg-[#dee2e8] h-1.5 rounded-full overflow-hidden border border-[#c0cad8]/60">
                          <div className="bg-[#0B96C7] h-full rounded-full transition-all duration-500" style={{ width: `${trainee.overallProgress}%` }}/>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isCompleted
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200/80'
                    : isOverdue
                        ? 'text-rose-700 bg-rose-50 border-rose-200/80'
                        : trainee.status === 'In Progress'
                            ? 'text-[#0B96C7] bg-[#dee2e8] border-[#c0cad8]/80'
                            : 'text-amber-700 bg-amber-50 border-amber-200/80'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-600' : isOverdue ? 'bg-rose-600' : trainee.status === 'In Progress' ? 'bg-[#0B96C7]' : 'bg-amber-500'}`}/>
                          {trainee.status === 'Completed' ? t.statusCompleted : trainee.status === 'Overdue' ? t.statusOverdue : trainee.status === 'In Progress' ? t.statusInProgress : t.statusNotStarted}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-end">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {isOverdue && (<button onClick={(e) => handleSendReminder(trainee, e)} className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer" title={t.sendReminder}>
                              <Send className="w-3.5 h-3.5"/>
                            </button>)}

                          <button onClick={() => setSelectedDrilldownTrainee(trainee)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#dee2e8]/40 hover:bg-[#dee2e8] text-[#485261] text-xs font-semibold border border-[#c0cad8] transition-all cursor-pointer">
                            <Eye className="w-3.5 h-3.5 text-[#0B96C7]"/>
                            <span>{t.viewDetails}</span>
                          </button>
                        </div>
                      </td>
                    </tr>);
        })}
              </tbody>
            </table>
          </div>

          {/* Pagination bar under the table */}
          <TablePagination
            currentPage={safeCurrentPage}
            totalItems={filteredTrainees.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        </div>

      </div>

      {/* Drill-Down Dossier Modal */}
      {selectedDrilldownTrainee && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#c0cad8]">
              <div className="flex items-center gap-3.5">
                <img src={selectedDrilldownTrainee.avatarUrl} alt={selectedDrilldownTrainee.name} className="w-12 h-12 rounded-xl object-cover border border-[#c0cad8]"/>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#485261]">
                      {isRTL && selectedDrilldownTrainee.nameAr ? selectedDrilldownTrainee.nameAr : selectedDrilldownTrainee.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#0B96C7] bg-[#dee2e8] px-2 py-0.5 rounded border border-[#c0cad8]/60">
                      {selectedDrilldownTrainee.employeeId}
                    </span>
                  </div>
                  <p className="text-xs text-[#9995A6] font-medium">
                    {isRTL && selectedDrilldownTrainee.jobTitleAr ? selectedDrilldownTrainee.jobTitleAr : selectedDrilldownTrainee.jobTitle} · {selectedDrilldownTrainee.branch}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedDrilldownTrainee(null)} className="p-1.5 text-[#9995A6] hover:text-[#485261] hover:bg-[#dee2e8]/40 rounded-lg cursor-pointer">
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#dee2e8]/30 rounded-xl border border-[#c0cad8] text-xs">
              <div>
                <span className="text-[#9995A6] block text-[11px]">{t.overallCompletion}</span>
                <span className="text-base font-bold text-[#0B96C7] font-mono tabular-nums">
                  {selectedDrilldownTrainee.completedCoursesCount} / 5 ({selectedDrilldownTrainee.overallProgress}%)
                </span>
              </div>
              <div>
                <span className="text-[#9995A6] block text-[11px]">{t.orientationPeriod}</span>
                <span className="font-mono font-medium text-[#485261] tabular-nums">
                  {selectedDrilldownTrainee.orientationStartDate} – {selectedDrilldownTrainee.orientationEndDate}
                </span>
              </div>
              <div>
                <span className="text-[#9995A6] block text-[11px]">{t.hireDate}</span>
                <span className="font-mono font-medium text-[#485261] tabular-nums">
                  {selectedDrilldownTrainee.hireDate}
                </span>
              </div>
            </div>

            {/* Detailed Course Matrix */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#485261]">
                  {t.courseMatrix}
                </h4>
                <span className="text-[11px] text-[#9995A6] font-mono">
                  {isRTL ? 'معيار النجاح: ≥ 80% · المحاولات: 3' : 'Passing Threshold: ≥ 80% · Max 3 Attempts'}
                </span>
              </div>

              <div className="border border-[#c0cad8] rounded-xl overflow-hidden">
                <table className="w-full text-start text-xs">
                  <thead className="bg-[#dee2e8]/40 text-[#485261] font-semibold border-b border-[#c0cad8]">
                    <tr>
                      <th className="py-2.5 px-3.5 text-start">{t.colCourse}</th>
                      <th className="py-2.5 px-3 text-start">{t.colStartDate}</th>
                      <th className="py-2.5 px-3 text-start">{t.colCompletionDate}</th>
                      <th className="py-2.5 px-3 text-start">{t.colScore}</th>
                      <th className="py-2.5 px-3 text-start">{t.colAttempts}</th>
                      <th className="py-2.5 px-3.5 text-end">{t.colCertStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c0cad8]/40">
                    {mockSequentialCourses.map((course) => {
                const trnCourse = selectedDrilldownTrainee.courses.find(c => c.courseId === course.id);
                const isCompleted = trnCourse?.status === 'Completed';
                const isInProgress = trnCourse?.status === 'In Progress';
                return (<tr key={course.id} className="hover:bg-[#dee2e8]/20">
                          <td className="py-2.5 px-3.5 font-medium text-[#485261]">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-[#0B96C7]">
                                {course.code}
                              </span>
                              <span className="truncate max-w-[180px]" title={course.title}>
                                {isRTL && course.titleAr ? course.titleAr : course.title}
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-[#9995A6] font-mono text-[11px] tabular-nums">
                            {trnCourse?.startDate || (isCompleted ? '2024-09-02' : '--')}
                          </td>

                          <td className="py-2.5 px-3 font-mono text-[11px] tabular-nums">
                            {isCompleted ? (<span className="text-emerald-700 font-medium">
                                {trnCourse?.completedDate || '2024-09-05'}
                              </span>) : (<span className="text-[#9995A6]">--</span>)}
                          </td>

                          <td className="py-2.5 px-3 font-mono tabular-nums">
                            {trnCourse?.score ? (<span className={`font-semibold ${trnCourse.score >= 80 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                {trnCourse.score}%
                              </span>) : (<span className="text-[#9995A6]">--</span>)}
                          </td>

                          <td className="py-2.5 px-3 text-[#485261] font-mono tabular-nums">
                            {trnCourse ? `${trnCourse.attemptsUsed} / ${trnCourse.maxAttempts}` : '0 / 3'}
                          </td>

                          <td className="py-2.5 px-3.5 text-end">
                            {isCompleted ? (<button onClick={() => {
                            if (onViewCertificate)
                                onViewCertificate(course.id);
                            onNavigate('certificate');
                            setSelectedDrilldownTrainee(null);
                        }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/80 hover:bg-emerald-100 transition-all cursor-pointer">
                                <Award className="w-3 h-3 text-emerald-700"/>
                                <span>{t.downloadCert}</span>
                              </button>) : (<span className="text-[11px] text-[#9995A6]">
                                {isInProgress ? (isRTL ? 'قيد الدراسة' : 'In Progress') : (isRTL ? 'مغلق' : 'Locked')}
                              </span>)}
                          </td>
                        </tr>);
            })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#c0cad8]">
              <button onClick={(e) => handleSendReminder(selectedDrilldownTrainee, e)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200/80 transition-all cursor-pointer">
                <Send className="w-3.5 h-3.5"/>
                <span>{t.sendReminder}</span>
              </button>

              <div className="flex items-center gap-2">
                <button onClick={() => {
                window.print();
            }} className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer">
                  <Download className="w-3.5 h-3.5"/>
                  <span>{t.downloadFullReport}</span>
                </button>

                <button onClick={() => setSelectedDrilldownTrainee(null)} className="px-4 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] text-xs font-semibold transition-all cursor-pointer">
                  {t.close}
                </button>
              </div>
            </div>

          </div>
        </div>)}

      {/* Create Trainee Account Modal */}
      {isCreateAccountOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#485261]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-xl border border-[#c0cad8] space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#c0cad8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#dee2e8] text-[#0B96C7] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4"/>
                </div>
                <h3 className="text-base font-bold text-[#485261]">
                  {t.createTraineeModalTitle}
                </h3>
              </div>
              <button onClick={() => setIsCreateAccountOpen(false)} className="p-1.5 text-[#9995A6] hover:text-[#485261] hover:bg-[#dee2e8]/40 rounded-lg cursor-pointer">
                <X className="w-4 h-4"/>
              </button>
            </div>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-3.5 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.fullNameEn} *</label>
                  <input type="text" required placeholder="e.g. Mostafa Ali" value={newTraineeForm.name} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, name: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.fullNameAr}</label>
                  <input type="text" placeholder="مثال: مصطفى علي" value={newTraineeForm.nameAr} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, nameAr: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.employeeId} *</label>
                  <input type="text" required value={newTraineeForm.employeeId} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, employeeId: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.jobTitle}</label>
                  <select value={newTraineeForm.jobTitle} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, jobTitle: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white">
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
                  <label className="font-semibold text-[#485261] block mb-1">{t.department}</label>
                  <select value={newTraineeForm.department} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, department: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white">
                    <option value="Clinical Chemistry">Clinical Chemistry</option>
                    <option value="Microbiology & Serology">Microbiology & Serology</option>
                    <option value="Molecular Biology">Molecular Biology</option>
                    <option value="Hematology & Coagulation">Hematology & Coagulation</option>
                    <option value="Pre-Analytics & Phlebotomy">Pre-Analytics & Phlebotomy</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.branch}</label>
                  <select value={newTraineeForm.branch} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, branch: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white">
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
                  <label className="font-semibold text-[#485261] block mb-1">{t.hireDate}</label>
                  <input type="date" value={newTraineeForm.hireDate} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, hireDate: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.startDateLabel}</label>
                  <input type="text" value={newTraineeForm.orientationStartDate} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, orientationStartDate: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
                <div>
                  <label className="font-semibold text-[#485261] block mb-1">{t.endDateLabel}</label>
                  <input type="text" value={newTraineeForm.orientationEndDate} onChange={(e) => setNewTraineeForm({ ...newTraineeForm, orientationEndDate: e.target.value })} className="w-full bg-[#dee2e8]/30 border border-[#c0cad8] rounded-xl px-3 py-2 text-xs font-mono text-[#485261] focus:outline-none focus:border-[#0B96C7] focus:bg-white"/>
                </div>
              </div>

              <div className="p-3 bg-[#dee2e8]/40 rounded-xl border border-[#c0cad8] text-xs">
                <span className="font-semibold text-[#0B96C7] block mb-1">
                  {isRTL ? 'المسار التدريبي المعين:' : 'Assigned Sequential Training Pathway:'}
                </span>
                <p className="text-[#485261] text-[11px]">
                  {isRTL ? 'المسار التوجيهي الإلزامي لأخصائيي المختبرات (5 مقررات متتالية مشروطة بالاجتياز ≥ 80%)' : 'Mandatory Clinical Laboratory Orientation (5 sequential courses locked until prerequisite passed with ≥ 80%)'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#c0cad8]">
                <button type="button" onClick={() => setIsCreateAccountOpen(false)} className="px-4 py-2 rounded-lg bg-white hover:bg-[#dee2e8]/40 text-[#485261] border border-[#c0cad8] font-semibold cursor-pointer">
                  {t.cancel}
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-[#0B96C7] hover:bg-[#087fa8] text-white font-semibold shadow-xs cursor-pointer active:scale-95">
                  {t.saveTraineeAccount}
                </button>
              </div>

            </form>

          </div>
        </div>)}

    </div>);
};
