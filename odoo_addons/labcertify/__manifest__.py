# -*- coding: utf-8 -*-
{
    'name': 'LabCertify - Laboratory Accreditation & Training LMS',
    'version': '1.0.0',
    'summary': 'Clinical Laboratory Onboarding, SOP Training, Sequential Enforcement & Certification System',
    'description': """
LabCertify - Enterprise Clinical Laboratory LMS & Certification Backend for Odoo 19
=====================================================================================
- Medical laboratory technologist mandatory orientation and sequential course management
- Video lessons, SOP documents, takeaways, and digital notes
- Clinical quiz assessments with strict passing scores, timer tracking, and attempt limits
- Automated ISO 15189:2022 compliant digital certificate issuance & QR verification
- Training Admin supervision, compliance metrics, automated reminders, and account provisioning
- System Admin Content Studio, curriculum rules, question banks, and security audit trail logs
- Full REST JSON API integration for React Single Page Application (SPA)
    """,
    'category': 'Human Resources/Education',
    'author': 'Shalaby Clinical Laboratories',
    'website': 'https://shalabylabs.org',
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'data/initial_data.xml',
        'views/course_views.xml',
        'views/trainee_views.xml',
        'views/quiz_views.xml',
        'views/certificate_views.xml',
        'views/audit_views.xml',
        'views/menu_views.xml',
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}
