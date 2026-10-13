# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabAuthController(http.Controller):

    @http.route(['/api/auth/login'], type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def login(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        data = parse_request_json()
        login = data.get('login') or data.get('username')
        password = data.get('password')
        role = data.get('role')

        env = request.env(user=1)
        
        # If logging in with standard Odoo credentials or role selector
        if role:
            trainee = env['lab.trainee'].sudo().search([('role', '=', role)], limit=1)
            if trainee:
                return json_response({
                    'success': True,
                    'user': trainee.to_dict(),
                    'token': f'bearer-{trainee.external_id}'
                })

        # Match by email or employeeId or username
        trainee = False
        if login:
            trainee = env['lab.trainee'].sudo().search([
                '|', ('email', '=', login),
                '|', ('employee_id', '=', login),
                ('external_id', '=', login)
            ], limit=1)

        if not trainee:
            # Fall back to default trainee persona
            trainee = env['lab.trainee'].sudo().search([('role', '=', 'trainee')], limit=1)

        if trainee:
            return json_response({
                'success': True,
                'user': trainee.to_dict(),
                'token': f'bearer-{trainee.external_id}'
            })

        return error_response('Invalid login credentials', status=401)

    @http.route(['/api/personas'], type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_personas(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        trainee = env['lab.trainee'].sudo().search([('role', '=', 'trainee')], limit=1)
        tr_admin = env['lab.trainee'].sudo().search([('role', '=', 'training_admin')], limit=1)
        sys_admin = env['lab.trainee'].sudo().search([('role', '=', 'system_admin')], limit=1)

        result = {
            'trainee': trainee.to_dict() if trainee else None,
            'training_admin': tr_admin.to_dict() if tr_admin else None,
            'system_admin': sys_admin.to_dict() if sys_admin else None,
        }
        return json_response(result)

    @http.route(['/api/profile'], type='http', auth='public', methods=['GET', 'PUT', 'OPTIONS'], csrf=False)
    def profile(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        role = request.httprequest.args.get('role', 'trainee')
        emp_id = request.httprequest.args.get('employeeId')

        domain = []
        if emp_id:
            domain = [('employee_id', '=', emp_id)]
        elif role:
            domain = [('role', '=', role)]

        trainee = env['lab.trainee'].sudo().search(domain, limit=1)
        if not trainee:
            trainee = env['lab.trainee'].sudo().search([], limit=1)

        if request.httprequest.method == 'PUT':
            data = parse_request_json()
            vals = {}
            if 'name' in data: vals['name'] = data['name']
            if 'nameAr' in data: vals['name_ar'] = data['nameAr']
            if 'email' in data: vals['email'] = data['email']
            if 'phone' in data: vals['phone'] = data['phone']
            if 'department' in data: vals['department'] = data['department']
            if 'branch' in data: vals['branch'] = data['branch']
            if 'overallProgress' in data: vals['overall_progress'] = data['overallProgress']
            if vals and trainee:
                trainee.write(vals)

        if not trainee:
            return error_response('Profile not found', status=404)

        return json_response(trainee.to_dict())
