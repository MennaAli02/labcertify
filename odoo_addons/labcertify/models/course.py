# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LabCourse(models.Model):
    _name = 'lab.course'
    _description = 'Laboratory Orientation Course'
    _order = 'module_number asc, sequence asc'

    external_id = fields.Char(string='External ID', required=True, index=True)
    module_number = fields.Integer(string='Module Number', required=True, default=1)
    code = fields.Char(string='Course Code', required=True, index=True)  # e.g. SP-100
    title = fields.Char(string='Title (EN)', required=True)
    title_ar = fields.Char(string='Title (AR)')
    description = fields.Text(string='Description (EN)')
    description_ar = fields.Text(string='Description (AR)')
    category = fields.Char(string='Category (EN)', default='Orientation Fundamentals')
    category_ar = fields.Char(string='Category (AR)', default='أساسيات التوجيه المهني')
    training_type = fields.Char(string='Training Type (EN)', default='Orientation')
    training_type_ar = fields.Char(string='Training Type (AR)', default='مسار التوجيه الإلزامي')
    
    status = fields.Selection([
        ('Locked', 'Locked'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed')
    ], string='Default Status', default='Locked')

    progress = fields.Integer(string='Default Progress (%)', default=0)
    est_minutes = fields.Integer(string='Estimated Duration (Minutes)', default=30)
    pass_score = fields.Integer(string='Passing Score Threshold (%)', default=80)
    allowed_attempts = fields.Integer(string='Allowed Attempts Limit', default=3)
    validity_months = fields.Integer(string='Certificate Validity (Months)', default=24)
    certificate_available = fields.Boolean(string='Certificate Available', default=True)
    image_url = fields.Char(string='Cover Image URL')
    instructor = fields.Char(string='Instructor (EN)', default='Dr. Sarah Mansour')
    instructor_ar = fields.Char(string='Instructor (AR)', default='د. سارة منصور')
    cme_credits = fields.Integer(string='CME Credits', default=2)

    prerequisite_course_id = fields.Many2one('lab.course', string='Prerequisite Course')
    prerequisite_course_code = fields.Char(string='Prerequisite Course Code', compute='_compute_prereq_code', store=True)

    sequence = fields.Integer(string='Sequence Order', default=10)

    material_ids = fields.One2many('lab.course.material', 'course_id', string='Course Materials')
    lesson_ids = fields.One2many('lab.lesson', 'course_id', string='Lessons')
    question_ids = fields.One2many('lab.quiz.question', 'course_id', string='Quiz Questions')

    @api.depends('prerequisite_course_id')
    def _compute_prereq_code(self):
        for rec in self:
            rec.prerequisite_course_code = rec.prerequisite_course_id.code if rec.prerequisite_course_id else False

    def to_dict(self, trainee_course=None):
        self.ensure_one()
        # If trainee enrollment record is provided, use trainee progress & status
        status = trainee_course.status if trainee_course else self.status
        progress = trainee_course.progress if trainee_course else self.progress

        return {
            'id': self.external_id,
            'odooId': self.id,
            'moduleNumber': self.module_number,
            'code': self.code,
            'title': self.title,
            'titleAr': self.title_ar or self.title,
            'description': self.description or '',
            'descriptionAr': self.description_ar or self.description or '',
            'category': self.category or 'Orientation',
            'categoryAr': self.category_ar or 'التوجيه',
            'trainingType': self.training_type or 'Orientation',
            'trainingTypeAr': self.training_type_ar or 'مسار التوجيه الإلزامي',
            'status': status,
            'progress': progress,
            'estMinutes': self.est_minutes,
            'passScore': self.pass_score,
            'allowedAttempts': self.allowed_attempts,
            'validityMonths': self.validity_months,
            'certificateAvailable': self.certificate_available,
            'imageUrl': self.image_url or '',
            'instructor': self.instructor or '',
            'instructorAr': self.instructor_ar or self.instructor or '',
            'cmeCredits': self.cme_credits,
            'prerequisiteCourseId': self.prerequisite_course_id.external_id if self.prerequisite_course_id else None,
            'prerequisiteCourseCode': self.prerequisite_course_code or None,
            'materials': [m.to_dict() for m in self.material_ids],
            'lessonCount': len(self.lesson_ids),
            'questionCount': len(self.question_ids),
        }


class LabCourseMaterial(models.Model):
    _name = 'lab.course.material'
    _description = 'Laboratory Course Material (Video, SOP PDF, Checklist)'
    _order = 'sequence asc, id asc'

    course_id = fields.Many2one('lab.course', string='Course', required=True, ondelete='cascade')
    external_id = fields.Char(string='External ID')
    material_type = fields.Selection([
        ('video', 'Video'),
        ('pdf', 'PDF Document'),
        ('instructions', 'Instructions / Checklist')
    ], string='Material Type', default='pdf', required=True)
    title = fields.Char(string='Title (EN)', required=True)
    title_ar = fields.Char(string='Title (AR)')
    duration_or_pages = fields.Char(string='Duration or Pages (EN)', default='12 pages')
    duration_or_pages_ar = fields.Char(string='Duration or Pages (AR)', default='12 صفحة')
    url = fields.Char(string='Resource URL')
    sequence = fields.Integer(string='Sequence Order', default=10)

    def to_dict(self):
        self.ensure_one()
        return {
            'id': self.external_id or f'mat-{self.id}',
            'type': self.material_type,
            'title': self.title,
            'titleAr': self.title_ar or self.title,
            'durationOrPages': self.duration_or_pages or '',
            'durationOrPagesAr': self.duration_or_pages_ar or self.duration_or_pages or '',
            'url': self.url or '',
        }
