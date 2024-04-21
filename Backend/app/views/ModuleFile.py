from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import redirect
from django.contrib.auth import logout
import requests
from ..models import *
from django.core.files.base import ContentFile
from rest_framework.permissions import AllowAny
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import re
from django.db.models import Count
import os
import shutil
from datetime import datetime
from time import sleep

