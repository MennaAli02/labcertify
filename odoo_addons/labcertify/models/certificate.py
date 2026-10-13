# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LabCertificate(models.Model):
    _name = 'lab.certificate'
    _description = 'Official Laboratory Digital Certificate & Credential'
    _order = 'id desc'

    certificate_id = fields.Char(string='Certificate ID', required=True, index=True)
    trainee_id = fields.Many2one('lab.trainee', string='Trainee', required=True, ondelete='cascade')
    trainee_name = fields.Char(string='Trainee Name (EN)', related='trainee_id.name', store=True)
    trainee_name_ar = fields.Char(string='Trainee Name (AR)', related='trainee_id.name_ar', store=True)
    employee_id = fields.Char(string='Employee ID', related='trainee_id.employee_id', store=True)

    course_id = fields.Many2one('lab.course', string='Course', ondelete='set null')
    course_external_id = fields.Char(string='Course External ID', related='course_id.external_id', store=True)
    course_code = fields.Char(string='Course Code', related='course_id.code', store=True)
    course_title = fields.Char(string='Course Title (EN)', related='course_id.title', store=True)
    course_title_ar = fields.Char(string='Course Title (AR)', related='course_id.title_ar', store=True)

    issue_date = fields.Char(string='Issue Date (Text)', default='05 September 2024')
    expiry_date = fields.Char(string='Expiry Date (Text)', default='05 September 2026')
    score = fields.Integer(string='Achieved Score (%)', default=92)
    passing_score = fields.Integer(string='Passing Threshold (%)', default=80)
    is_orientation_master = fields.Boolean(string='Is Master Credential', default=False)
    verification_code = fields.Char(string='Security Verification Code', default='VER-9824-OK')
    authorized_signer = fields.Char(string='Authorized Signer (EN)', default='Dr. Amira Shalaby, MD, FRCPath')
    authorized_signer_ar = fields.Char(string='Authorized Signer (AR)', default='أ.د. أميرة شلبي - استشاري التحاليل الطبية ومدير عام الجودة')
    status = fields.Selection([
        ('valid', 'Valid'),
        ('expired', 'Expired'),
        ('revoked', 'Revoked')
    ], string='Status', default='valid')

    def to_dict(self):
        self.ensure_one()
        return {
            'certificateId': self.certificate_id,
            'odooId': self.id,
            'traineeId': self.trainee_id.external_id if self.trainee_id else '',
            'traineeName': self.trainee_name or (self.trainee_id.name if self.trainee_id else ''),
            'traineeNameAr': self.trainee_name_ar or (self.trainee_id.name_ar if self.trainee_id else ''),
            'employeeId': self.employee_id or (self.trainee_id.employee_id if self.trainee_id else ''),
            'courseId': self.course_id.external_id if self.course_id else '',
            'courseTitle': self.course_title or (self.course_id.title if self.course_id else ''),
            'courseTitleAr': self.course_title_ar or (self.course_id.title_ar if self.course_id else ''),
            'courseCode': self.course_code or (self.course_id.code if self.course_id else ''),
            'issueDate': self.issue_date or '',
            'expiryDate': self.expiry_date or '',
            'score': self.score,
            'passingScore': self.passing_score,
            'isOrientationMaster': self.is_orientation_master,
            'verificationCode': self.verification_code or 'VER-9824-OK',
            'authorizedSigner': self.authorized_signer,
            'authorizedSignerAr': self.authorized_signer_ar,
            'status': self.status,
            'verifyUrl': f'https://shalabylabs.org/verify/{self.certificate_id}',
        }
