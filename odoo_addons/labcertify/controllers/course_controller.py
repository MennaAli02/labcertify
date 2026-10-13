# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabCourseController(http.Controller):

    @http.route(['/api/courses', '/api/courses/'], type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def list_courses(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        trainee_id = request.httprequest.args.get('traineeId')
        
        trainee = None
        if trainee_id:
            trainee = env['lab.trainee'].sudo().search([
                '|', ('external_id', '=', trainee_id), ('employee_id', '=', trainee_id)
            ], limit=1)

        courses = env['lab.course'].sudo().search([], order='module_number asc, sequence asc')

        # Map each course with optional trainee enrollment details
        course_list = []
        for course in courses:
            enrollment = None
            if trainee:
                enrollment = env['lab.trainee.course'].sudo().search([
                    ('trainee_id', '=', trainee.id),
                    ('course_id', '=', course.id)
                ], limit=1)
            course_list.append(course.to_dict(trainee_course=enrollment))

        return json_response(course_list)

    @http.route(['/api/courses/<string:course_id>'], type='http', auth='public', methods=['GET', 'PUT', 'OPTIONS'], csrf=False)
    def course_detail(self, course_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        course = env['lab.course'].sudo().search([
            '|', ('external_id', '=', course_id), ('code', '=', course_id)
        ], limit=1)

        if not course:
            return error_response('Course not found', status=404)

        if request.httprequest.method == 'PUT':
            data = parse_request_json()
            vals = {}
            if 'title' in data: vals['title'] = data['title']
            if 'titleAr' in data: vals['title_ar'] = data['titleAr']
            if 'description' in data: vals['description'] = data['description']
            if 'descriptionAr' in data: vals['description_ar'] = data['descriptionAr']
            if 'passScore' in data: vals['pass_score'] = int(data['passScore'])
            if 'allowedAttempts' in data: vals['allowed_attempts'] = int(data['allowedAttempts'])
            if 'validityMonths' in data: vals['validity_months'] = int(data['validityMonths'])
            if 'status' in data: vals['status'] = data['status']
            if 'progress' in data: vals['progress'] = int(data['progress'])
            if 'estMinutes' in data: vals['est_minutes'] = int(data['estMinutes'])
            if 'imageUrl' in data: vals['image_url'] = data['imageUrl']
            if 'category' in data: vals['category'] = data['category']
            if 'categoryAr' in data: vals['category_ar'] = data['categoryAr']

            if vals:
                course.write(vals)

        return json_response(course.to_dict())

    @http.route(['/api/courses/<string:course_id>/pass'], type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def pass_course(self, course_id, **kwargs):
        """Pass course, set status=Completed, 100% progress, unlock next course, issue certificate."""
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        data = parse_request_json()
        score = int(data.get('score', 90))
        trainee_id_param = data.get('traineeId', 'user-trainee-1')

        course = env['lab.course'].sudo().search([
            '|', ('external_id', '=', course_id), ('code', '=', course_id)
        ], limit=1)

        if not course:
            return error_response('Course not found', status=404)

        trainee = env['lab.trainee'].sudo().search([
            '|', ('external_id', '=', trainee_id_param), ('employee_id', '=', trainee_id_param)
        ], limit=1)

        if not trainee:
            trainee = env['lab.trainee'].sudo().search([('role', '=', 'trainee')], limit=1)

        settings = env['lab.system.settings'].sudo().get_settings()
        sequential_enforced = settings.sequential_enforced

        # Update or create course enrollment for this trainee
        enrollment = env['lab.trainee.course'].sudo().search([
            ('trainee_id', '=', trainee.id),
            ('course_id', '=', course.id)
        ], limit=1)

        if enrollment:
            enrollment.write({
                'status': 'Completed',
                'progress': 100,
                'score': score,
                'completed_date': fields.Date.today().strftime('%d %b %Y'),
            })
        else:
            enrollment = env['lab.trainee.course'].sudo().create({
                'trainee_id': trainee.id,
                'course_id': course.id,
                'status': 'Completed',
                'progress': 100,
                'score': score,
                'completed_date': fields.Date.today().strftime('%d %b %Y'),
            })

        # Also update base course record status
        course.write({'status': 'Completed', 'progress': 100})

        # Find all courses ordered
        all_courses = env['lab.course'].sudo().search([], order='module_number asc')
        courses_list = list(all_courses)
        current_idx = -1
        for idx, c in enumerate(courses_list):
            if c.id == course.id:
                current_idx = idx
                break

        next_course_unlocked = None
        if current_idx >= 0 and current_idx + 1 < len(courses_list):
            next_course = courses_list[current_idx + 1]
            next_enrollment = env['lab.trainee.course'].sudo().search([
                ('trainee_id', '=', trainee.id),
                ('course_id', '=', next_course.id)
            ], limit=1)

            if next_enrollment:
                if next_enrollment.status == 'Locked' or not sequential_enforced:
                    next_enrollment.write({'status': 'In Progress', 'progress': 15})
            else:
                env['lab.trainee.course'].sudo().create({
                    'trainee_id': trainee.id,
                    'course_id': next_course.id,
                    'status': 'In Progress',
                    'progress': 15,
                })
            next_course.write({'status': 'In Progress', 'progress': 15})
            next_course_unlocked = next_course.external_id

        # Issue Certificate if certificate_available
        cert = env['lab.certificate'].sudo().search([
            ('trainee_id', '=', trainee.id),
            ('course_id', '=', course.id)
        ], limit=1)

        cert_id_str = f"SL-CERT-{fields.Date.today().year}-{trainee.employee_id.replace('SL-', '')}-{course.module_number}"
        if not cert:
            cert = env['lab.certificate'].sudo().create({
                'certificate_id': cert_id_str,
                'trainee_id': trainee.id,
                'course_id': course.id,
                'issue_date': fields.Date.today().strftime('%d %B %Y'),
                'expiry_date': fields.Date.today().replace(year=fields.Date.today().year + 2).strftime('%d %B %Y'),
                'score': score,
                'passing_score': course.pass_score,
                'is_orientation_master': False,
                'status': 'valid',
            })
            if enrollment:
                enrollment.write({
                    'certificate_id_ref': cert.certificate_id,
                    'certificate_issued_date': cert.issue_date,
                })

        # Recompute overall progress
        all_trainee_courses = env['lab.trainee.course'].sudo().search([('trainee_id', '=', trainee.id)])
        completed_count = len(all_trainee_courses.filtered(lambda ec: ec.status == 'Completed'))
        total_courses_count = max(len(courses_list), 1)
        pct = int((completed_count / total_courses_count) * 100)

        phase_msg = f"Course {current_idx + 2} Unlocked" if (current_idx + 1 < len(courses_list)) else "All Courses Completed"
        trainee.write({
            'overall_progress': pct,
            'phase': phase_msg,
        })

        # Record audit log
        env['lab.audit.log'].sudo().create({
            'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'user_id_ref': trainee.employee_id,
            'user_name': trainee.name,
            'user_role': 'Trainee',
            'action': 'Assessment Passed',
            'action_ar': 'اجتياز الاختبار بنجاح',
            'details': f'Score: {score}% on {course.code} ({course.title}). Certified issued: {cert_id_str}.',
            'details_ar': f'الدرجة: {score}% في {course.code}. تم إصدار الشهادة: {cert_id_str}.',
            'target': f'Course: {course.code}',
            'status': 'Success'
        })

        return json_response({
            'success': True,
            'courseId': course.external_id,
            'status': 'Completed',
            'progress': 100,
            'score': score,
            'nextCourseUnlocked': next_course_unlocked,
            'overallProgress': pct,
            'certificateId': cert.certificate_id,
        })
