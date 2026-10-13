# -*- coding: utf-8 -*-
from odoo import http, fields
from odoo.http import request
from .cors_utils import json_response, error_response, parse_request_json, make_cors_options_response

class LabCommunityController(http.Controller):

    @http.route(['/api/forum/posts', '/api/forum/posts/'], type='http', auth='public', methods=['GET', 'POST', 'OPTIONS'], csrf=False)
    def handle_forum_posts(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)

        if request.httprequest.method == 'POST':
            data = parse_request_json()
            content = data.get('content')
            if not content:
                return error_response('Comment content is required', status=400)

            post = env['lab.forum.post'].sudo().create({
                'external_id': f"post-{int(fields.Datetime.now().timestamp())}",
                'author': data.get('author', 'Dr. Sarah Al-Mansouri'),
                'author_ar': data.get('authorAr', 'د. سارة المنصوري'),
                'role': data.get('role', 'SENIOR SPECIALIST'),
                'role_ar': data.get('roleAr', 'أخصائي إكلينيكي أول'),
                'avatar_url': data.get('avatarUrl', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGgUBhTHQtOx4cCa4r8Jj9pCBL-Z07YKFjSf7em3NxZFQBtPP7yBbC2SsxYkRTDWegzmmj71XVB3dpi_IYu_D8t8BPQ7I8UyXItx8YZXouwPh2NWBmAFs7dnZWj89DMN9ERFYIaEh1keS445KPjAGw6-N3oa1Nx8nBrViO0o3zWlrSeZOFMuygDnonqgSUJybRYiPUbwlxZWhYhMy4ttdfI8HVY0Qj1PTyoWDWwpxnu9hDQ2gzdUXRRA'),
                'time_ago': 'Just now',
                'time_ago_ar': 'الآن',
                'content': content,
                'content_ar': data.get('contentAr', content),
                'likes': 0,
                'user_liked': False,
                'replies': 0,
            })
            return json_response(post.to_dict(), status=201)

        posts = env['lab.forum.post'].sudo().search([], order='id desc')
        return json_response([p.to_dict() for p in posts])

    @http.route(['/api/forum/posts/<string:post_id>/like'], type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False)
    def toggle_like(self, post_id, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        post = env['lab.forum.post'].sudo().search([
            '|', ('external_id', '=', post_id), ('id', '=', int(post_id) if post_id.isdigit() else 0)
        ], limit=1)

        if not post:
            return error_response('Post not found', status=404)

        if post.user_liked:
            post.write({
                'likes': max(0, post.likes - 1),
                'user_liked': False
            })
        else:
            post.write({
                'likes': post.likes + 1,
                'user_liked': True
            })

        return json_response(post.to_dict())

    @http.route(['/api/performance'], type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_performance(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        env = request.env(user=1)
        competencies = env['lab.competency'].sudo().search([], order='sequence asc')
        records = env['lab.performance.record'].sudo().search([], order='id desc')

        return json_response({
            'competencies': [c.to_dict() for c in competencies],
            'history': [r.to_dict() for r in records],
            'overallScore': 78,
            'grade': 'Grade A Practitioner',
            'gradeAr': 'ممارس سريري ممتاز (فئة أ)',
        })

    @http.route(['/api/resources'], type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False)
    def get_resources(self, **kwargs):
        if request.httprequest.method == 'OPTIONS':
            return make_cors_options_response()

        resources = [
            {
                "id": "res-1",
                "title": "Shalaby Labs New Employee Orientation Handbook v3.2",
                "titleAr": "دليل الموظف الجديد في معامل شلبي v3.2",
                "category": "Safety",
                "format": "PDF",
                "size": "3.4 MB",
                "icon": "picture_as_pdf"
            },
            {
                "id": "res-2",
                "title": "BSL-2 Laboratory Safety Manual & Spill Protocol",
                "titleAr": "دليل السلامة والأمان الحيوي BSL-2 وبروتوكول الانسكابات",
                "category": "Safety",
                "format": "PDF",
                "size": "2.8 MB",
                "icon": "picture_as_pdf"
            },
            {
                "id": "res-3",
                "title": "Specimen Collection Order of Draw Reference Chart",
                "titleAr": "مخطط الترتيب القياسي لسحب أنابيب العينات",
                "category": "Specimen",
                "format": "PDF",
                "size": "1.2 MB",
                "icon": "picture_as_pdf"
            },
            {
                "id": "res-4",
                "title": "Westgard Multirule Decision Flowchart (ISO 15189)",
                "titleAr": "مخطط شجرة اتخاذ القرار لقواعد ويستغارد (ISO 15189)",
                "category": "QC",
                "format": "PDF",
                "size": "1.9 MB",
                "icon": "picture_as_pdf"
            },
            {
                "id": "res-5",
                "title": "Laboratory Orientation Audit & KPI Template",
                "titleAr": "نموذج تدقيق ومؤشرات أداء فترة التوجيه المخبري",
                "category": "Leadership",
                "format": "XLSX",
                "size": "650 KB",
                "icon": "table_chart"
            }
        ]
        return json_response(resources)
