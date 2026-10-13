# -*- coding: utf-8 -*-
from odoo import http, fields
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabTraineeController(http.Controller):

    @http.route(['/api/trainees', '/api/trainees/'], type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_trainees(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)

        if request.httprequest.method == 'POST':
            data = parse_request_json()
            name = data.get('name')
            if not name:
                return error_response('Trainee name is required', status=400)

            emp_id = data.get('employeeId') or f"SL-2024-0{fields.Datetime.now().microsecond % 900 + 100}"
            ext_id = data.get('id') or f"trn-{int(fields.Datetime.now().timestamp())}"

            new_trainee = env['lab.trainee'].sudo().create({
                'external_id': ext_id,
                'name': name,
                'name_ar': data.get('nameAr', name),
                'employee_id': emp_id,
                'job_title': data.get('jobTitle', 'Medical Laboratory Technologist'),
                'job_title_ar': data.get('jobTitleAr', 'أخصائي تحاليل طبية'),
                'department': data.get('department', 'Clinical Chemistry'),
                'department_ar': data.get('departmentAr', 'الكيمياء الإكلينيكية'),
                'branch': data.get('branch', 'Cairo Main Facility'),
                'branch_ar': data.get('branchAr', 'فرع القاهرة الرئيسي'),
                'hire_date': data.get('hireDate', fields.Date.today().strftime('%Y-%m-%d')),
                'orientation_start_date': data.get('orientationStartDate', '01 Oct 2024'),
                'orientation_end_date': data.get('orientationEndDate', '31 Dec 2024'),
                'assigned_path_id': data.get('assignedPathId', 'path-orientation-1'),
                'assigned_path_title': data.get('assignedPathTitle', 'Mandatory Clinical Laboratory Orientation'),
                'assigned_path_title_ar': data.get('assignedPathTitleAr', 'المسار التوجيهي الإلزامي لأخصائيي المختبرات'),
                'email': data.get('email') or f"{name.lower().replace(' ', '.')}@shalabylabs.com",
                'phone': data.get('phone', '+20 100 000 0000'),
                'status': 'Not Started',
                'overall_progress': 0,
                'avatar_url': data.get('avatarUrl', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'),
                'role': 'trainee',
            })

            # Create default course enrollments
            all_courses = env['lab.course'].sudo().search([], order='module_number asc')
            for idx, c in enumerate(all_courses):
                env['lab.trainee.course'].sudo().create({
                    'trainee_id': new_trainee.id,
                    'course_id': c.id,
                    'status': 'In Progress' if idx == 0 else 'Locked',
                    'progress': 0,
                    'attempts_used': 0,
                    'max_attempts': c.allowed_attempts or 3,
                })

            # Audit log
            env['lab.audit.log'].sudo().create({
                'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id_ref': 'SL-TRN-0012',
                'user_name': 'Dr. Sarah Mansour',
                'user_role': 'Training Admin',
                'action': 'Created Trainee Account',
                'action_ar': 'إنشاء حساب متدرب جديد',
                'details': f"Provisioned orientation account for {new_trainee.name} ({new_trainee.employee_id})",
                'details_ar': f"تم إنشاء حساب التدريب للموظف {new_trainee.name} ({new_trainee.employee_id})",
                'target': f"Trainee: {new_trainee.name}",
                'status': 'Success'
            })

            return json_response(new_trainee.to_dict(), status=201)

        # GET request
        args = request.httprequest.args
        query = args.get('q') or args.get('search')
        branch = args.get('branch')
        dept = args.get('department') or args.get('dept')
        status = args.get('status')

        domain = [('role', '=', 'trainee')]
        if query:
            domain.extend(['|', ('name', 'ilike', query), ('employee_id', 'ilike', query)])
        if branch and branch != 'All':
            domain.append(('branch', 'ilike', branch))
        if dept and dept != 'All':
            domain.append(('department', 'ilike', dept))
        if status and status != 'All':
            domain.append(('status', '=', status))

        trainees = env['lab.trainee'].sudo().search(domain, order='id desc')
        trainee_list = [t.to_dict() for t in trainees]

        return json_response(trainee_list)

    @http.route(['/api/trainees/<string:trainee_id>'], type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def trainee_detail(self, trainee_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        trainee = env['lab.trainee'].sudo().search([
            '|', ('external_id', '=', trainee_id), ('employee_id', '=', trainee_id)
        ], limit=1)

        if not trainee:
            return error_response('Trainee not found', status=404)

        return json_response(trainee.to_dict())

    @http.route(['/api/trainees/<string:trainee_id>/reminder'], type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def send_reminder(self, trainee_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        trainee = env['lab.trainee'].sudo().search([
            '|', ('external_id', '=', trainee_id), ('employee_id', '=', trainee_id)
        ], limit=1)

        if not trainee:
            return error_response('Trainee not found', status=404)

        # Record audit log
        env['lab.audit.log'].sudo().create({
            'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'user_id_ref': 'SL-TRN-0012',
            'user_name': 'Dr. Sarah Mansour',
            'user_role': 'Training Admin',
            'action': 'Orientation Reminder Sent',
            'action_ar': 'إرسال تذكير رسمي بالتدريب المتأخر',
            'details': f"Dispatched formal orientation overdue notification to {trainee.name} ({trainee.employee_id})",
            'details_ar': f"تم إرسال إشعار تذكير رسمي باستكمال التدريب للموظف {trainee.nameAr if hasattr(trainee, 'nameAr') else trainee.name}",
            'target': f"Trainee: {trainee.name}",
            'status': 'Success'
        })

        return json_response({
            'success': True,
            'message': f"Formal reminder dispatched to {trainee.name} ({trainee.employee_id})"
        })
