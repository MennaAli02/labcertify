# -*- coding: utf-8 -*-
import json
from odoo.http import request

CORS_HEADERS = [
    ('Access-Control-Allow-Origin', '*'),
    ('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH'),
    ('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control'),
    ('Access-Control-Max-Age', '86400'),
]

def make_cors_options_response():
    return request.make_response('', headers=CORS_HEADERS, status=204)

def json_response(data, status=200):
    headers = list(CORS_HEADERS) + [('Content-Type', 'application/json; charset=utf-8')]
    body = json.dumps(data, ensure_ascii=False, default=str)
    return request.make_response(body, headers=headers, status=status)

def error_response(message, status=400, details=None):
    payload = {
        'success': False,
        'error': message,
    }
    if details:
        payload['details'] = details
    return json_response(payload, status=status)

def parse_request_json():
    """Extract and parse JSON body from incoming HTTP request."""
    try:
        raw = request.httprequest.data
        if not raw:
            return {}
        if isinstance(raw, bytes):
            raw = raw.decode('utf-8')
        return json.loads(raw)
    except Exception:
        # Fall back to form data or empty dict
        try:
            return dict(request.httprequest.form)
        except Exception:
            return {}
