from django.urls import path
from .views import *

urlpatterns = [
    path('login', ManagerSigninView.as_view()),
    path('register', ManagerSignupView.as_view()),
    path('customerrequest', ManagerCustomerRequestView.as_view()),
    path('songslist', ManagerBandSongsListView.as_view()),
    path('likedbandsongslist', ManagerLikedBandSongsListView.as_view()),
    # path('songsset', ManagerSongsSetView.as_view()),
    path('upload', ManagerUploadSongsListView.as_view()),
    path('sets', ManagerSetsView.as_view()),
    path('songsinset', ManagerSongsInSetView.as_view()),
]