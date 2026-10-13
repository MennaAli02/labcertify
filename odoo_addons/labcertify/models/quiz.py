# -*- coding: utf-8 -*-
import json
from odoo import models, fields, api

class LabQuizQuestion(models.Model):
    _name = 'lab.quiz.question'
    _description = 'Laboratory Orientation Quiz Question'
    _order = 'course_id, question_number asc, id asc'

    external_id = fields.Char(string='External ID', index=True)
    course_id = fields.Many2one('lab.course', string='Course / Module', required=True, ondelete='cascade')
    question_number = fields.Integer(string='Question Number', default=1)
    question = fields.Text(string='Question (EN)', required=True)
    question_ar = fields.Text(string='Question (AR)')
    hint = fields.Text(string='Hint (EN)')
    hint_ar = fields.Text(string='Hint (AR)')
    
    # Options (EN)
    option1 = fields.Char(string='Option 1 (EN)')
    option2 = fields.Char(string='Option 2 (EN)')
    option3 = fields.Char(string='Option 3 (EN)')
    option4 = fields.Char(string='Option 4 (EN)')

    # Options (AR)
    option1_ar = fields.Char(string='Option 1 (AR)')
    option2_ar = fields.Char(string='Option 2 (AR)')
    option3_ar = fields.Char(string='Option 3 (AR)')
    option4_ar = fields.Char(string='Option 4 (AR)')

    # JSON options storage for flexible option count
    options_json = fields.Text(string='Options JSON (EN)', default='[]')
    options_ar_json = fields.Text(string='Options JSON (AR)', default='[]')

    correct_index = fields.Integer(string='Correct Option Index (0-3)', default=0, required=True)
    explanation = fields.Text(string='Explanation (EN)')
    explanation_ar = fields.Text(string='Explanation (AR)')
    module_ref = fields.Char(string='SOP Module Reference (EN)', default='SOP-001')
    module_ref_ar = fields.Char(string='SOP Module Reference (AR)')
    difficulty = fields.Selection([
        ('Basic', 'Basic'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced')
    ], string='Difficulty', default='Basic')

    def _get_options(self):
        self.ensure_one()
        if self.options_json and self.options_json.strip() not in ('[]', ''):
            try:
                return json.loads(self.options_json)
            except Exception:
                pass
        opts = [self.option1, self.option2, self.option3, self.option4]
        return [o for o in opts if o]

    def _get_options_ar(self):
        self.ensure_one()
        if self.options_ar_json and self.options_ar_json.strip() not in ('[]', ''):
            try:
                return json.loads(self.options_ar_json)
            except Exception:
                pass
        opts = [self.option1_ar, self.option2_ar, self.option3_ar, self.option4_ar]
        valid = [o for o in opts if o]
        return valid if valid else self._get_options()

    def to_dict(self):
        self.ensure_one()
        opts = self._get_options()
        opts_ar = self._get_options_ar()
        return {
            'id': self.external_id or self.id,
            'odooId': self.id,
            'courseId': self.course_id.external_id if self.course_id else '',
            'questionNumber': self.question_number,
            'question': self.question,
            'questionAr': self.question_ar or self.question,
            'hint': self.hint or '',
            'hintAr': self.hint_ar or self.hint or '',
            'options': opts,
            'optionsAr': opts_ar,
            'correctIndex': self.correct_index,
            'explanation': self.explanation or '',
            'explanationAr': self.explanation_ar or self.explanation or '',
            'moduleRef': self.module_ref or '',
            'moduleRefAr': self.module_ref_ar or self.module_ref or '',
            'difficulty': self.difficulty or 'Basic',
        }


class LabQuizAttempt(models.Model):
    _name = 'lab.quiz.attempt'
    _description = 'Trainee Quiz Assessment Attempt Record'
    _order = 'id desc'

    trainee_id = fields.Many2one('lab.trainee', string='Trainee', required=True, ondelete='cascade')
    course_id = fields.Many2one('lab.course', string='Course', required=True, ondelete='cascade')
    score_pct = fields.Integer(string='Score (%)', required=True)
    correct_count = fields.Integer(string='Correct Answers Count')
    total_count = fields.Integer(string='Total Questions Count')
    passed = fields.Boolean(string='Passed', default=False)
    attempt_number = fields.Integer(string='Attempt Number', default=1)
    answers_json = fields.Text(string='Submitted Answers Map')
    timestamp = fields.Datetime(string='Timestamp', default=fields.Datetime.now)

    def to_dict(self):
        self.ensure_one()
        return {
            'id': self.id,
            'traineeId': self.trainee_id.external_id if self.trainee_id else '',
            'courseId': self.course_id.external_id if self.course_id else '',
            'scorePct': self.score_pct,
            'correctCount': self.correct_count,
            'totalCount': self.total_count,
            'passed': self.passed,
            'attemptNumber': self.attempt_number,
            'timestamp': fields.Datetime.to_string(self.timestamp),
        }
