# -*- coding: utf-8 -*-
from odoo import http, fields
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabSettingsController(http.Controller):

    @http.route(['/api/settings', '/api/settings/'], type='http', auth='public', methods=['GET', 'POST', 'PUT', 'OPTIONS'], csrf=False)
    def handle_settings(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        settings = env['lab.system.settings'].sudo().get_settings()

        if request.httprequest.method in ('POST', 'PUT'):
            data = parse_request_json()
            vals = {}
            if 'sequentialEnforced' in data:
                vals['sequential_enforced'] = bool(data['sequentialEnforced'])
            if 'defaultPassScore' in data:
                vals['default_pass_score'] = int(data['defaultPassScore'])
            if 'defaultAllowedAttempts' in data:
                vals['default_allowed_attempts'] = int(data['defaultAllowedAttempts'])
            if 'defaultValidityMonths' in data:
                vals['default_validity_months'] = int(data['defaultValidityMonths'])

            if vals:
                settings.write(vals)

                # Record audit log
                env['lab.audit.log'].sudo().create({
                    'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'user_id_ref': 'SL-SYS-0004',
                    'user_name': 'Eng. Khaled El-Sayed',
                    'user_role': 'System Admin',
                    'action': 'Updated System Settings',
                    'action_ar': 'تعديل سياسات وحوكمة المنظومة',
                    'details': f"Updated governance settings: sequentialEnforced={settings.sequential_enforced}",
                    'details_ar': f"تم تحديث الإعدادات: التتابع الإلزامي={settings.sequential_enforced}",
                    'target': "System Settings",
                    'status': 'Success'
                })

        return json_response(settings.to_dict())
