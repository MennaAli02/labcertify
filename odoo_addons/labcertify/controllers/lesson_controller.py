# -*- coding: utf-8 -*-
import json
from odoo import http, fields
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabLessonController(http.Controller):

    @http.route(['/api/lessons', '/api/lessons/'], type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_lessons(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)

        if request.httprequest.method == 'POST':
            data = parse_request_json()
            module_id_str = data.get('moduleId') or data.get('courseId', 'course-1')
            course = env['lab.course'].sudo().search([
                '|', ('external_id', '=', module_id_str), ('code', '=', module_id_str)
            ], limit=1)
            if not course:
                course = env['lab.course'].sudo().search([], limit=1)

            external_id = data.get('id') or f"les-{int(fields.Datetime.now().timestamp())}"
            objectives = data.get('learningObjectives') or []
            if data.get('learningObjective1'):
                objectives.append(data.get('learningObjective1'))
            if data.get('learningObjective2'):
                objectives.append(data.get('learningObjective2'))

            new_lesson = env['lab.lesson'].sudo().create({
                'external_id': external_id,
                'course_id': course.id,
                'title': data.get('title', 'New Video Lesson'),
                'title_ar': data.get('titleAr', data.get('title')),
                'duration': data.get('duration', '12:00'),
                'protocol_id': data.get('protocolId', f'SOP-{course.code}.1'),
                'video_url': data.get('videoUrl', ''),
                'description': data.get('description', ''),
                'description_ar': data.get('descriptionAr', ''),
                'learning_objectives_json': json.dumps(objectives),
                'status': data.get('status', 'Not Started'),
            })

            # Record audit log
            env['lab.audit.log'].sudo().create({
                'timestamp': fields.Datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id_ref': 'SL-SYS-0004',
                'user_name': 'Eng. Khaled El-Sayed',
                'user_role': 'System Admin',
                'action': 'Added Video Lesson',
                'action_ar': 'إضافة درس مرئي جديد',
                'details': f"Created lesson '{new_lesson.title}' in course {course.code}",
                'details_ar': f"تم إنشاء الدرس '{new_lesson.title_ar}' في مقرر {course.code}",
                'target': f"Lesson: {new_lesson.title}",
                'status': 'Success'
            })

            return json_response(new_lesson.to_dict(), status=201)

        # GET request
        module_id = request.httprequest.args.get('moduleId') or request.httprequest.args.get('courseId')
        domain = []
        if module_id:
            course = env['lab.course'].sudo().search([
                '|', ('external_id', '=', module_id), ('code', '=', module_id)
            ], limit=1)
            if course:
                domain = [('course_id', '=', course.id)]

        lessons = env['lab.lesson'].sudo().search(domain, order='sequence asc, id asc')
        return json_response([l.to_dict() for l in lessons])

    @http.route(['/api/lessons/<string:lesson_id>'], type='http', auth='public', methods=['GET', 'PUT', 'DELETE', 'OPTIONS'], csrf=False)
    def handle_single_lesson(self, lesson_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        lesson = env['lab.lesson'].sudo().search([
            '|', ('external_id', '=', lesson_id), ('id', '=', int(lesson_id) if lesson_id.isdigit() else 0)
        ], limit=1)

        if not lesson:
            return error_response('Lesson not found', status=404)

        if request.httprequest.method == 'DELETE':
            lesson_title = lesson.title
            lesson.unlink()
            return json_response({'success': True, 'message': f"Lesson '{lesson_title}' deleted"})

        if request.httprequest.method == 'PUT':
            data = parse_request_json()
            vals = {}
            if 'title' in data: vals['title'] = data['title']
            if 'titleAr' in data: vals['title_ar'] = data['titleAr']
            if 'duration' in data: vals['duration'] = data['duration']
            if 'protocolId' in data: vals['protocol_id'] = data['protocolId']
            if 'videoUrl' in data: vals['video_url'] = data['videoUrl']
            if 'description' in data: vals['description'] = data['description']
            if 'descriptionAr' in data: vals['description_ar'] = data['descriptionAr']
            if 'status' in data: vals['status'] = data['status']
            if 'learningObjectives' in data:
                vals['learning_objectives_json'] = json.dumps(data['learningObjectives'])
            if vals:
                lesson.write(vals)

        return json_response(lesson.to_dict())

    # Lesson personal notes
    @http.route(['/api/lessons/<string:lesson_id>/notes'], type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def lesson_notes(self, lesson_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        lesson = env['lab.lesson'].sudo().search([
            '|', ('external_id', '=', lesson_id), ('id', '=', int(lesson_id) if lesson_id.isdigit() else 0)
        ], limit=1)

        if not lesson:
            return error_response('Lesson not found', status=404)

        if request.httprequest.method == 'POST':
            data = parse_request_json()
            content = data.get('content')
            if not content:
                return error_response('Note content is required', status=400)

            note = env['lab.lesson.note'].sudo().create({
                'lesson_id': lesson.id,
                'timestamp': data.get('timestamp', '00:00'),
                'content': content,
                'created_at_text': data.get('createdAt', 'Just now'),
            })
            return json_response(note.to_dict(), status=201)

        notes = env['lab.lesson.note'].sudo().search([('lesson_id', '=', lesson.id)], order='id desc')
        return json_response([n.to_dict() for n in notes])

    @http.route(['/api/notes/<int:note_id>'], type='http', auth='public', methods=['DELETE', 'OPTIONS'], csrf=False)
    def delete_note(self, note_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        note = env['lab.lesson.note'].sudo().browse(note_id)
        if note.exists():
            note.unlink()
            return json_response({'success': True})
        return error_response('Note not found', status=404)
