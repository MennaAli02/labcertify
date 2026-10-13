# -*- coding: utf-8 -*-
import json
from odoo import http, fields
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabQuizController(http.Controller):

    @http.route(['/api/questions', '/api/questions/'], type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_questions(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)

        if request.httprequest.method == 'POST':
            data = parse_request_json()
            course_id_str = data.get('courseId', 'course-1')
            course = env['lab.course'].sudo().search([
                '|', ('external_id', '=', course_id_str), ('code', '=', course_id_str)
            ], limit=1)
            if not course:
                course = env['lab.course'].sudo().search([], limit=1)

            opt1 = data.get('option1', '')
            opt2 = data.get('option2', '')
            opt3 = data.get('option3', '')
            opt4 = data.get('option4', '')
            options_list = [opt1, opt2, opt3, opt4]

            new_q = env['lab.quiz.question'].sudo().create({
                'external_id': f"q-{int(fields.Datetime.now().timestamp())}",
                'course_id': course.id,
                'question': data.get('question', ''),
                'question_ar': data.get('questionAr', data.get('question', '')),
                'option1': opt1,
                'option2': opt2,
                'option3': opt3,
                'option4': opt4,
                'options_json': json.dumps(options_list),
                'correct_index': int(data.get('correctIndex', 0)),
                'hint': data.get('hint', ''),
                'hint_ar': data.get('hintAr', data.get('hint', '')),
                'explanation': data.get('explanation', ''),
                'explanation_ar': data.get('explanationAr', data.get('explanation', '')),
                'module_ref': data.get('moduleRef', 'SOP Reference'),
                'difficulty': data.get('difficulty', 'Basic'),
            })

            # Record audit log
            env['lab.audit.log'].sudo().create({
                'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id_ref': 'SL-SYS-0004',
                'user_name': 'Eng. Khaled El-Sayed',
                'user_role': 'System Admin',
                'action': 'Added Question to Bank',
                'action_ar': 'إضافة سؤال جديد لبنك الأسئلة',
                'details': f"Added question for course {course.code}: '{new_q.question[:60]}...'",
                'details_ar': f"تم إضافة سؤال جديد للمقرر {course.code}",
                'target': f"QuestionBank: {course.code}",
                'status': 'Success'
            })

            return json_response(new_q.to_dict(), status=201)

        # GET questions
        course_id = request.httprequest.args.get('courseId')
        domain = []
        if course_id and course_id != 'all':
            course = env['lab.course'].sudo().search([
                '|', ('external_id', '=', course_id), ('code', '=', course_id)
            ], limit=1)
            if course:
                domain = [('course_id', '=', course.id)]

        questions = env['lab.quiz.question'].sudo().search(domain, order='course_id, question_number asc, id asc')
        return json_response([q.to_dict() for q in questions])

    @http.route(['/api/questions/<string:question_id>'], type='http', auth='public', methods=['DELETE', 'OPTIONS'], csrf=False)
    def delete_question(self, question_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        q = env['lab.quiz.question'].sudo().search([
            '|', ('external_id', '=', question_id), ('id', '=', int(question_id) if question_id.isdigit() else 0)
        ], limit=1)

        if not q:
            return error_response('Question not found', status=404)

        course_code = q.course_id.code if q.course_id else 'General'
        q.unlink()

        # Audit log
        env['lab.audit.log'].sudo().create({
            'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'user_id_ref': 'SL-SYS-0004',
            'user_name': 'Eng. Khaled El-Sayed',
            'user_role': 'System Admin',
            'action': 'Deleted Question',
            'action_ar': 'حذف سؤال من بنك الأسئلة',
            'details': f"Deleted question {question_id} from {course_code}",
            'details_ar': f"تم حذف السؤال {question_id} من مقرر {course_code}",
            'target': f"QuestionBank: {course_code}",
            'status': 'Warning'
        })

        return json_response({'success': True, 'message': 'Question deleted'})

    @http.route(['/api/quiz/submit'], type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def submit_quiz(self, **kwargs):
        """Submit assessment answers, compute official score, save attempt record, and issue certificate if passed."""
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        data = parse_request_json()

        course_id_str = data.get('courseId', 'course-1')
        trainee_id_str = data.get('traineeId', 'user-trainee-1')
        answers_map = data.get('answers', {})  # { questionIndex/id: selectedOptionIndex }
        attempt_num = int(data.get('attemptNumber', 1))

        course = env['lab.course'].sudo().search([
            '|', ('external_id', '=', course_id_str), ('code', '=', course_id_str)
        ], limit=1)
        if not course:
            return error_response('Course not found', status=404)

        trainee = env['lab.trainee'].sudo().search([
            '|', ('external_id', '=', trainee_id_str), ('employee_id', '=', trainee_id_str)
        ], limit=1)
        if not trainee:
            trainee = env['lab.trainee'].sudo().search([('role', '=', 'trainee')], limit=1)

        questions = env['lab.quiz.question'].sudo().search([('course_id', '=', course.id)], order='question_number asc, id asc')
        if not questions:
            questions = env['lab.quiz.question'].sudo().search([], limit=4)

        correct_count = 0
        total_count = len(questions)

        for idx, q in enumerate(questions):
            # Key can be index as string or integer, or question id
            chosen = answers_map.get(str(idx), answers_map.get(idx, answers_map.get(str(q.id), answers_map.get(q.id))))
            if chosen is not None and int(chosen) == q.correct_index:
                correct_count += 1

        score_pct = int(round((correct_count / max(total_count, 1)) * 100))
        passed = score_pct >= (course.pass_score or 80)

        # Save attempt
        attempt = env['lab.quiz.attempt'].sudo().create({
            'trainee_id': trainee.id,
            'course_id': course.id,
            'score_pct': score_pct,
            'correct_count': correct_count,
            'total_count': total_count,
            'passed': passed,
            'attempt_number': attempt_num,
            'answers_json': json.dumps(answers_map),
        })

        # Update enrollment
        enrollment = env['lab.trainee.course'].sudo().search([
            ('trainee_id', '=', trainee.id),
            ('course_id', '=', course.id)
        ], limit=1)

        if enrollment:
            enrollment.write({
                'score': score_pct,
                'attempts_used': attempt_num,
            })

        # Record audit log
        env['lab.audit.log'].sudo().create({
            'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'user_id_ref': trainee.employee_id,
            'user_name': trainee.name,
            'user_role': 'Trainee',
            'action': 'Assessment Passed' if passed else 'Assessment Failed',
            'action_ar': 'اجتياز الاختبار بنجاح' if passed else 'عدم اجتياز الاختبار',
            'details': f"Score: {score_pct}% ({correct_count}/{total_count}) on {course.code}. Attempt {attempt_num}/{course.allowed_attempts}.",
            'details_ar': f"الدرجة: {score_pct}% في {course.code}. المحاولة: {attempt_num}/{course.allowed_attempts}.",
            'target': f"Assessment: {course.code}",
            'status': 'Success' if passed else 'Warning'
        })

        cert_id = None
        next_course_id = None

        if passed:
            # Trigger pass_course logic
            course_ctl = LabCourseController()
            # We can invoke internal pass
            enrollment.write({'status': 'Completed', 'progress': 100})
            course.write({'status': 'Completed', 'progress': 100})

            # Check next course unlock
            all_courses = list(env['lab.course'].sudo().search([], order='module_number asc'))
            for idx, c in enumerate(all_courses):
                if c.id == course.id and idx + 1 < len(all_courses):
                    next_c = all_courses[idx + 1]
                    next_course_id = next_c.external_id
                    next_enr = env['lab.trainee.course'].sudo().search([
                        ('trainee_id', '=', trainee.id),
                        ('course_id', '=', next_c.id)
                    ], limit=1)
                    if next_enr:
                        next_enr.write({'status': 'In Progress', 'progress': 15})
                    next_c.write({'status': 'In Progress', 'progress': 15})
                    break

            cert_id = f"SL-CERT-{fields.Date.today().year}-{trainee.employee_id.replace('SL-', '')}-{course.module_number}"
            cert = env['lab.certificate'].sudo().search([
                ('trainee_id', '=', trainee.id),
                ('course_id', '=', course.id)
            ], limit=1)
            if not cert:
                cert = env['lab.certificate'].sudo().create({
                    'certificate_id': cert_id,
                    'trainee_id': trainee.id,
                    'course_id': course.id,
                    'issue_date': fields.Date.today().strftime('%d %B %Y'),
                    'expiry_date': fields.Date.today().replace(year=fields.Date.today().year + 2).strftime('%d %B %Y'),
                    'score': score_pct,
                    'passing_score': course.pass_score,
                    'status': 'valid'
                })

        return json_response({
            'success': True,
            'passed': passed,
            'score': score_pct,
            'correctCount': correct_count,
            'totalCount': total_count,
            'attemptsUsed': attempt_num,
            'maxAttempts': course.allowed_attempts,
            'certificateId': cert_id,
            'nextCourseUnlocked': next_course_id,
        })

    @http.route(['/api/quiz/reset-attempts'], type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def reset_quiz_attempts(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        data = parse_request_json()
        course_id_str = data.get('courseId', 'course-1')
        trainee_id_str = data.get('traineeId', 'user-trainee-1')

        course = env['lab.course'].sudo().search([
            '|', ('external_id', '=', course_id_str), ('code', '=', course_id_str)
        ], limit=1)
        trainee = env['lab.trainee'].sudo().search([
            '|', ('external_id', '=', trainee_id_str), ('employee_id', '=', trainee_id_str)
        ], limit=1)

        if course and trainee:
            enrollment = env['lab.trainee.course'].sudo().search([
                ('trainee_id', '=', trainee.id),
                ('course_id', '=', course.id)
            ], limit=1)
            if enrollment:
                enrollment.write({'attempts_used': 0})

            # Audit log
            env['lab.audit.log'].sudo().create({
                'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id_ref': 'SL-TRN-0012',
                'user_name': 'Dr. Sarah Mansour',
                'user_role': 'Training Admin',
                'action': 'Attempts Reset by Admin',
                'action_ar': 'إعادة تصفير محاولات الاختبار من المشرف',
                'details': f"Reset attempts for {trainee.name} on {course.code} to allow exam retake.",
                'details_ar': f"تم تصفير محاولات المتدرب {trainee.name} في اختبار {course.code}",
                'target': f"Course: {course.code}",
                'status': 'Success'
            })

        return json_response({'success': True, 'message': 'Quiz attempts reset successfully'})
