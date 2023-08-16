from django.urls import re_path
from app import consumers


websocket_urlpatterns = [
    re_path(r'ws/bandleadercustomerrequests/$', consumers.BandLeaderConsumer.as_asgi()),
    re_path(r'ws/customerrequestsresponse/$', consumers.CustomerConsumer.as_asgi()),
    re_path(r'ws/bandmember/$', consumers.BandMemberConsumer.as_asgi())
]