# -*- coding: utf-8 -*-
from odoo import http, fields
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabAuditController(http.Controller):

    @http.route(['/api/audit-logs', '/api/audit-logs/'], type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_audit_logs(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)

        if request.httprequest.method == 'POST':
            data = parse_request_json()
            action = data.get('action')
            if not action:
                return error_response('Action is required', status=400)

            # Determine status if not explicitly provided
            status = data.get('status')
            if not status:
                if 'Failed' in action or 'Warning' in action:
                    status = 'Warning'
                elif 'Blocked' in action or 'Alert' in action:
                    status = 'Security Alert'
                else:
                    status = 'Success'

            log = env['lab.audit.log'].sudo().create({
                'external_id': f"log-{int(fields.Datetime.now().timestamp())}",
                'timestamp': data.get('timestamp') or fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id_ref': data.get('userId', 'SL-2024-0482'),
                'user_name': data.get('userName', 'Ahmed Mohamed'),
                'user_role': data.get('userRole', 'Trainee'),
                'action': action,
                'action_ar': data.get('actionAr', action),
                'details': data.get('details', ''),
                'details_ar': data.get('detailsAr', ''),
                'target': data.get('target', 'System'),
                'ip_address': data.get('ipAddress', '192.168.1.105'),
                'status': status,
            })
            return json_response(log.to_dict(), status=201)

        # GET audit logs
        args = request.httprequest.args
        search = args.get('search') or args.get('q')
        severity = args.get('severity') or args.get('status')

        domain = []
        if severity and severity != 'All':
            domain.append(('status', '=', severity))

        if search:
            domain.extend([
                '|', ('action', 'ilike', search),
                '|', ('user_name', 'ilike', search),
                '|', ('user_id_ref', 'ilike', search),
                '|', ('details', 'ilike', search),
                ('target', 'ilike', search)
            ])

        logs = env['lab.audit.log'].sudo().search(domain, order='id desc')
        return json_response([l.to_dict() for l in logs])
