# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LabTrainee(models.Model):
    _name = 'lab.trainee'
    _description = 'Laboratory Trainee Profile & Orientation Status'
    _order = 'name asc, id asc'

    external_id = fields.Char(string='External ID', required=True, index=True)
    user_id = fields.Many2one('res.users', string='Related System User')
    name = fields.Char(string='Name (EN)', required=True)
    name_ar = fields.Char(string='Name (AR)')
    employee_id = fields.Char(string='Employee ID / Badge', required=True, index=True)
    job_title = fields.Char(string='Job Title (EN)', default='Medical Laboratory Technologist')
    job_title_ar = fields.Char(string='Job Title (AR)', default='أخصائي تحاليل طبية')
    role = fields.Selection([
        ('trainee', 'Trainee'),
        ('training_admin', 'Training Admin'),
        ('system_admin', 'System Admin')
    ], string='Role', default='trainee', required=True)
    
    department = fields.Char(string='Department (EN)', default='Clinical Chemistry & Hematology')
    department_ar = fields.Char(string='Department (AR)', default='الكيمياء الإكلينيكية وأمراض الدم')
    branch = fields.Char(string='Branch Facility (EN)', default='Cairo Main Facility (Al-Nasr)')
    branch_ar = fields.Char(string='Branch Facility (AR)', default='فرع القاهرة الرئيسي (النصر)')
    
    hire_date = fields.Char(string='Hire Date', default='2024-09-01')
    orientation_start_date = fields.Char(string='Orientation Start Date', default='01 Sep 2024')
    orientation_end_date = fields.Char(string='Orientation End Date', default='30 Nov 2024')
    
    assigned_path_id = fields.Char(string='Assigned Path ID', default='path-orientation-1')
    assigned_path_title = fields.Char(string='Assigned Path Title (EN)', default='Mandatory Clinical Laboratory Orientation')
    assigned_path_title_ar = fields.Char(string='Assigned Path Title (AR)', default='المسار التوجيهي الإلزامي لأخصائيي المختبرات الطبية')
    
    phase = fields.Char(string='Current Phase (EN)', default='Course 2: Laboratory Safety')
    phase_ar = fields.Char(string='Current Phase (AR)', default='المقرر الثاني: السلامة والأمان الحيوي')
    
    avatar_url = fields.Char(string='Avatar URL')
    initials = fields.Char(string='Initials', default='AM')
    credential_id = fields.Char(string='Credential ID', default='SL-8924-AM')
    email = fields.Char(string='Email')
    phone = fields.Char(string='Phone')
    
    status = fields.Selection([
        ('Not Started', 'Not Started'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
        ('Overdue', 'Overdue')
    ], string='Orientation Status', default='In Progress')
    
    overall_progress = fields.Integer(string='Overall Progress (%)', default=0)
    last_active = fields.Char(string='Last Active', default='Just now')

    enrollment_ids = fields.One2many('lab.trainee.course', 'trainee_id', string='Enrolled Courses')
    certificate_ids = fields.One2many('lab.certificate', 'trainee_id', string='Certificates')

    def to_dict(self):
        self.ensure_one()
        enrollments = [e.to_dict() for e in self.enrollment_ids]
        completed_count = len([e for e in enrollments if e.get('status') == 'Completed'])
        total_count = len(enrollments) if enrollments else 5

        return {
            'id': self.external_id,
            'odooId': self.id,
            'name': self.name,
            'nameAr': self.name_ar or self.name,
            'employeeId': self.employee_id,
            'jobTitle': self.job_title,
            'jobTitleAr': self.job_title_ar or self.job_title,
            'title': self.job_title,
            'titleAr': self.job_title_ar or self.job_title,
            'role': self.role,
            'department': self.department,
            'departmentAr': self.department_ar or self.department,
            'branch': self.branch,
            'branchAr': self.branch_ar or self.branch,
            'hireDate': self.hire_date,
            'orientationStartDate': self.orientation_start_date,
            'orientationEndDate': self.orientation_end_date,
            'assignedPathId': self.assigned_path_id,
            'assignedPathTitle': self.assigned_path_title,
            'assignedPathTitleAr': self.assigned_path_title_ar or self.assigned_path_title,
            'phase': self.phase,
            'phaseAr': self.phase_ar or self.phase,
            'avatarUrl': self.avatar_url or '',
            'initials': self.initials or (self.name[:2].upper() if self.name else 'TR'),
            'credentialId': self.credential_id or f'SL-{self.employee_id}',
            'email': self.email or '',
            'phone': self.phone or '',
            'status': self.status,
            'overallProgress': self.overall_progress,
            'completedCoursesCount': completed_count,
            'totalCoursesCount': total_count,
            'lastActive': self.last_active or 'Just now',
            'courses': enrollments,
        }


class LabTraineeCourse(models.Model):
    _name = 'lab.trainee.course'
    _description = 'Trainee Course Enrollment & Progress Tracking'
    _order = 'course_id asc, id asc'

    trainee_id = fields.Many2one('lab.trainee', string='Trainee', required=True, ondelete='cascade')
    course_id = fields.Many2one('lab.course', string='Course', required=True, ondelete='cascade')
    course_external_id = fields.Char(string='Course External ID', related='course_id.external_id', store=True)
    course_code = fields.Char(string='Course Code', related='course_id.code', store=True)

    status = fields.Selection([
        ('Locked', 'Locked'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ], string='Status', default='Locked')

    progress = fields.Integer(string='Progress (%)', default=0)
    score = fields.Integer(string='Quiz Score (%)', default=0)
    attempts_used = fields.Integer(string='Attempts Used', default=0)
    max_attempts = fields.Integer(string='Max Allowed Attempts', default=3)
    start_date = fields.Char(string='Start Date')
    completed_date = fields.Char(string='Completed Date')
    certificate_id_ref = fields.Char(string='Certificate ID Ref')
    certificate_issued_date = fields.Char(string='Certificate Issued Date')

    def to_dict(self):
        self.ensure_one()
        return {
            'courseId': self.course_id.external_id if self.course_id else '',
            'courseCode': self.course_id.code if self.course_id else '',
            'status': self.status,
            'progress': self.progress,
            'score': self.score,
            'attemptsUsed': self.attempts_used,
            'maxAttempts': self.max_attempts,
            'startDate': self.start_date or '',
            'completedDate': self.completed_date or '',
            'certificateId': self.certificate_id_ref or '',
            'certificateIssuedDate': self.certificate_issued_date or '',
        }
