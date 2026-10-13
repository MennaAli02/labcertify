# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LabAuditLog(models.Model):
    _name = 'lab.audit.log'
    _description = 'Laboratory Compliance & Action Audit Trail'
    _order = 'id desc'

    external_id = fields.Char(string='External ID', index=True)
    timestamp = fields.Char(string='Timestamp String', required=True, default=lambda self: fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'))
    user_id_ref = fields.Char(string='User / Employee ID', required=True)
    user_name = fields.Char(string='User Name', required=True)
    user_role = fields.Char(string='User Role', default='Trainee')
    action = fields.Char(string='Action (EN)', required=True)
    action_ar = fields.Char(string='Action (AR)')
    details = fields.Text(string='Details (EN)')
    details_ar = fields.Text(string='Details (AR)')
    target = fields.Char(string='Target Object', default='System')
    ip_address = fields.Char(string='Client IP Address', default='127.0.0.1')
    status = fields.Selection([
        ('Success', 'Success'),
        ('Warning', 'Warning'),
        ('Security Alert', 'Security Alert')
    ], string='Status', default='Success')

    def to_dict(self):
        self.ensure_one()
        return {
            'id': self.external_id or f'log-{self.id}',
            'odooId': self.id,
            'timestamp': self.timestamp,
            'userId': self.user_id_ref,
            'userName': self.user_name,
            'userRole': self.user_role,
            'action': self.action,
            'actionAr': self.action_ar or self.action,
            'details': self.details or '',
            'detailsAr': self.details_ar or self.details or '',
            'target': self.target or 'System',
            'ipAddress': self.ip_address or '127.0.0.1',
            'status': self.status,
        }
