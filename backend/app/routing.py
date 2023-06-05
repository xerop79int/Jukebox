from django.urls import re_path
from app import consumers


websocket_urlpatterns = [
    re_path(r'ws/bandleadercustomerrequests/$', consumers.BandLeaderConsumer.as_asgi()),
]