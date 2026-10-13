# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LabSystemSettings(models.Model):
    _name = 'lab.system.settings'
    _description = 'LabCertify System Governance & Workflow Policy Configuration'

    sequential_enforced = fields.Boolean(
        string='Strict Sequential Course Progression Enforced', 
        default=True,
        help='When true, users cannot access subsequent courses until prerequisite is 100% completed.'
    )
    default_pass_score = fields.Integer(string='Default Passing Score (%)', default=80)
    default_allowed_attempts = fields.Integer(string='Default Max Quiz Attempts', default=3)
    default_validity_months = fields.Integer(string='Default Certificate Validity (Months)', default=24)
    active = fields.Boolean(string='Active', default=True)

    @api.model
    def get_settings(self):
        record = self.search([], limit=1)
        if not record:
            record = self.create({
                'sequential_enforced': True,
                'default_pass_score': 80,
                'default_allowed_attempts': 3,
                'default_validity_months': 24,
            })
        return record

    def to_dict(self):
        self.ensure_one()
        return {
            'sequentialEnforced': self.sequential_enforced,
            'defaultPassScore': self.default_pass_score,
            'defaultAllowedAttempts': self.default_allowed_attempts,
            'defaultValidityMonths': self.default_validity_months,
        }
