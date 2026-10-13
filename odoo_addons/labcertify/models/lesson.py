# -*- coding: utf-8 -*-
import json
from odoo import models, fields, api

class LabLesson(models.Model):
    _name = 'lab.lesson'
    _description = 'Laboratory Orientation Lesson (Video / SOP / Interactive)'
    _order = 'course_id, sequence asc, id asc'

    external_id = fields.Char(string='External ID', required=True, index=True)
    course_id = fields.Many2one('lab.course', string='Course / Module', required=True, ondelete='cascade')
    stage_number = fields.Char(string='Stage Number', default='01')
    lesson_number = fields.Integer(string='Lesson Number', default=1)
    title = fields.Char(string='Lesson Title (EN)', required=True)
    title_ar = fields.Char(string='Lesson Title (AR)')
    duration = fields.Char(string='Duration', default='12:30')
    lesson_type = fields.Char(string='Lesson Type', default='Video')
    status = fields.Selection([
        ('Completed', 'Completed'),
        ('Currently Playing', 'Currently Playing'),
        ('Not Started', 'Not Started'),
        ('Locked', 'Locked')
    ], string='Status', default='Not Started')
    completed = fields.Boolean(string='Completed', default=False)
    protocol_id = fields.Char(string='Protocol / SOP Reference ID', default='SOP-101.1')
    description = fields.Text(string='Description (EN)')
    description_ar = fields.Text(string='Description (AR)')
    video_url = fields.Char(string='Video Streaming URL')
    learning_objectives_json = fields.Text(string='Learning Objectives (EN JSON)', default='[]')
    learning_objectives_ar_json = fields.Text(string='Learning Objectives (AR JSON)', default='[]')
    transcript_json = fields.Text(string='Transcript Cue List (JSON)', default='[]')
    sequence = fields.Integer(string='Sequence Order', default=10)

    note_ids = fields.One2many('lab.lesson.note', 'lesson_id', string='Personal Notes')

    def to_dict(self):
        self.ensure_one()
        objectives = []
        objectives_ar = []
        transcript = []
        try:
            if self.learning_objectives_json:
                objectives = json.loads(self.learning_objectives_json)
        except Exception:
            objectives = []
        try:
            if self.learning_objectives_ar_json:
                objectives_ar = json.loads(self.learning_objectives_ar_json)
        except Exception:
            objectives_ar = []
        try:
            if self.transcript_json:
                transcript = json.loads(self.transcript_json)
        except Exception:
            transcript = []

        return {
            'id': self.external_id,
            'odooId': self.id,
            'moduleId': self.course_id.external_id if self.course_id else '',
            'stageNumber': self.stage_number or '01',
            'lessonNumber': self.lesson_number,
            'title': self.title,
            'titleAr': self.title_ar or self.title,
            'duration': self.duration or '10:00',
            'type': self.lesson_type or 'Video',
            'status': self.status or 'Not Started',
            'completed': self.completed or (self.status == 'Completed'),
            'protocolId': self.protocol_id or '',
            'description': self.description or '',
            'descriptionAr': self.description_ar or self.description or '',
            'videoUrl': self.video_url or '',
            'learningObjectives': objectives,
            'learningObjectivesAr': objectives_ar,
            'transcript': transcript,
        }


class LabLessonNote(models.Model):
    _name = 'lab.lesson.note'
    _description = 'Trainee Personal Lesson Note'
    _order = 'id desc'

    lesson_id = fields.Many2one('lab.lesson', string='Lesson', required=True, ondelete='cascade')
    trainee_id = fields.Many2one('lab.trainee', string='Trainee', ondelete='cascade')
    timestamp = fields.Char(string='Video Timestamp', default='00:00')
    content = fields.Text(string='Note Content', required=True)
    created_at_text = fields.Char(string='Created Text', default='Just now')

    def to_dict(self):
        self.ensure_one()
        return {
            'id': str(self.id),
            'lessonId': self.lesson_id.external_id if self.lesson_id else '',
            'timestamp': self.timestamp or '00:00',
            'content': self.content,
            'createdAt': self.created_at_text or 'Just now',
        }
