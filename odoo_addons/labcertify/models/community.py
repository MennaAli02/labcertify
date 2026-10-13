# -*- coding: utf-8 -*-
from odoo import models, fields, api

class LabForumPost(models.Model):
    _name = 'lab.forum.post'
    _description = 'Laboratory Clinical Coaching & Discussion Post'
    _order = 'id desc'

    external_id = fields.Char(string='External ID', index=True)
    author = fields.Char(string='Author (EN)', required=True)
    author_ar = fields.Char(string='Author (AR)')
    role = fields.Char(string='Role (EN)', default='SENIOR SPECIALIST')
    role_ar = fields.Char(string='Role (AR)', default='أخصائي إكلينيكي أول')
    avatar_url = fields.Char(string='Avatar URL')
    time_ago = fields.Char(string='Time Ago (EN)', default='Just now')
    time_ago_ar = fields.Char(string='Time Ago (AR)', default='الآن')
    content = fields.Text(string='Content (EN)', required=True)
    content_ar = fields.Text(string='Content (AR)')
    likes = fields.Integer(string='Likes Count', default=0)
    user_liked = fields.Boolean(string='Liked by Current User', default=False)
    replies = fields.Integer(string='Replies Count', default=0)

    def to_dict(self):
        self.ensure_one()
        return {
            'id': self.external_id or f'post-{self.id}',
            'odooId': self.id,
            'author': self.author,
            'authorAr': self.author_ar or self.author,
            'role': self.role,
            'roleAr': self.role_ar or self.role,
            'avatarUrl': self.avatar_url or '',
            'timeAgo': self.time_ago or 'Just now',
            'timeAgoAr': self.time_ago_ar or self.time_ago or 'الآن',
            'content': self.content,
            'contentAr': self.content_ar or self.content,
            'likes': self.likes,
            'userLiked': self.user_liked,
            'replies': self.replies,
        }


class LabCompetency(models.Model):
    _name = 'lab.competency'
    _description = 'Clinical Laboratory Core Competency'
    _order = 'sequence asc, id asc'

    external_id = fields.Char(string='External ID', index=True)
    name = fields.Char(string='Name (EN)', required=True)
    name_ar = fields.Char(string='Name (AR)')
    level = fields.Char(string='Level (EN)', default='Verified Competency')
    level_ar = fields.Char(string='Level (AR)', default='كفاءة موثقة')
    mastered = fields.Boolean(string='Mastered', default=False)
    sequence = fields.Integer(string='Sequence', default=10)

    def to_dict(self):
        self.ensure_one()
        return {
            'id': self.external_id or f'comp-{self.id}',
            'name': self.name,
            'nameAr': self.name_ar or self.name,
            'level': self.level,
            'levelAr': self.level_ar or self.level,
            'mastered': self.mastered,
        }


class LabPerformanceRecord(models.Model):
    _name = 'lab.performance.record'
    _description = 'Trainee Historical Assessment & Performance Record'
    _order = 'id desc'

    external_id = fields.Char(string='External ID', index=True)
    trainee_id = fields.Many2one('lab.trainee', string='Trainee', ondelete='cascade')
    title = fields.Char(string='Title (EN)', required=True)
    title_ar = fields.Char(string='Title (AR)')
    completed_date = fields.Char(string='Completed Date (EN)')
    completed_date_ar = fields.Char(string='Completed Date (AR)')
    score = fields.Integer(string='Achieved Score (%)', default=90)
    max_score = fields.Integer(string='Max Score', default=100)
    summary = fields.Text(string='Summary (EN)')
    summary_ar = fields.Text(string='Summary (AR)')
    tags = fields.Char(string='Tags (Comma separated)', default='Accredited, First Attempt, Orientation')
    icon = fields.Char(string='Icon Key', default='verified')

    def to_dict(self):
        self.ensure_one()
        tag_list = [t.strip() for t in (self.tags or '').split(',') if t.strip()]
        return {
            'id': self.external_id or f'perf-{self.id}',
            'title': self.title,
            'titleAr': self.title_ar or self.title,
            'completedDate': self.completed_date or '',
            'completedDateAr': self.completed_date_ar or self.completed_date or '',
            'score': self.score,
            'maxScore': self.max_score,
            'summary': self.summary or '',
            'summaryAr': self.summary_ar or self.summary or '',
            'tags': tag_list,
            'icon': self.icon or 'verified',
        }
