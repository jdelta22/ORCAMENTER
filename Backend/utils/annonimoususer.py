import uuid

def get_visitor_id(request):
    visitor_id = request.COOKIES.get('visitor_id')
    if not visitor_id:
        visitor_id = str(uuid.uuid4())
    return visitor_id