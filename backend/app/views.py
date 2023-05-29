from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth import login
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions
from rest_framework.views import APIView
from django.shortcuts import redirect
from django.contrib.auth import logout
from time import sleep
import requests
from .models import *
from django.core.files.base import ContentFile



# SIGN IN, SIGN UP AND LOGOUT VIEWS

class ManagerSigninView(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]
    
    def post(self, req):
        username = req.data.get('username')
        password = req.data.get('password')

        # check who is logging in
        if Customer.objects.filter(user__username=username).exists():
            account_type = 'customer'
        elif BandLeader.objects.filter(user__username=username).exists():
            # check if band leader is active
            if BandLeader.objects.filter(user__username=username, isactive=True).exists():
                account_type = 'band_leader'
            else:
                return Response({'error': 'Band leader\'s account is not active'})      
        elif BandMember.objects.filter(user__username=username).exists():
            # check if band member is active
            if BandMember.objects.filter(user__username=username, isactive=True).exists():
                account_type = 'band_member'
            else:
                return Response({'error': 'Band member\'s account is not active'})

        user = auth.authenticate(req, username=username, password=password)
        if user is not None:
            login(req, user)
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({'token': token.key, 'account_type': account_type})
        else:
            return Response({'error': 'Invalid credentials'})

class ManagerSignupView(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]

    def post(self, req):
        name = req.data.get('name')
        username = req.data.get('username')
        email = req.data.get('email')
        password = req.data.get('password')
        password2 = req.data.get('password2')
        account_type = req.data.get('account_type')

        if password == password2:
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists.'})
            elif User.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists.'})
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                if account_type == 'customer':
                    customer = Customer(user=user, name=name)
                    customer.save()
                elif account_type == 'band_leader':
                    band_leader = BandLeader(user=user, name=name)
                    band_leader.save()
                elif account_type == 'band_member':
                    band_member = BandMember(user=user, name=name)
                    band_member.save()
                else:
                    return Response({'error': 'Invalid account type.'})
                return Response({'success': 'User created successfully.'})
        else:
            return Response({'error': 'Passwords do not match.'})

class ManagerLogoutView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, req):
        logout(req)
        response = redirect('login')
        response.delete_cookie('token')
        return response


# CUSTOMER VIEWS

class ManagerCustomerRequestView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        customer = Customer.objects.get(user=req.user)
        song = req.data.get('song_id')
        band_song = BandSongsList.objects.get(id=song)

        # check if the song has already been requested
        if CustomerRequest.objects.filter(customer=customer, song=band_song).exists():
            return Response({'error': 'You have already requested this song.'})
    
        customer_request = CustomerRequest(customer=customer, song=band_song)
        customer_request.save()
        return Response({'success': 'Request sent successfully.'})
        
        # song_name = req.data.get('song_name')
        # song_artist = req.data.get('song_artist')
        # song_genre = req.data.get('song_genre')
        # song_dedicated_to = req.data.get('song_dedicated_to')


        # customer_request = CustomerRequest(customer=customer, song_name=song_name, song_artist=song_artist, song_genre=song_genre, song_dedicated_to=song_dedicated_to)
        # customer_request.save()

    def put(self, req):
        song_id = req.data.get('song_id')
        customer = Customer.objects.get(user=req.user)
        request = CustomerRequest.objects.get(id=song_id)

        if request.customer.user == req.user:
            return Response({'error': 'You cannot request a song that you have already requested.'})

        # Check if the song has already been requested
        if CustomerRequest.objects.filter(customer=customer, song_name=request.song_name, song_artist=request.song_artist, song_genre=request.song_genre).exists():
            return Response({'error': 'You have already requested this song.'})
        
        customer_request = CustomerRequest(customer=customer, song_name=request.song_name, song_artist=request.song_artist, song_genre=request.song_genre)
        customer_request.save()
        return Response({'success': 'Request sent successfully.'})


    # def get(self, req):
    #     view = req.GET.get('view')
    #     if view == 'all':
    #         # Get all customer requests except for the current user
    #         customer_requests = CustomerRequest.objects.exclude(customer__user=req.user)
    #         return Response({'customer_requests': customer_requests.values()})
    #     else:
    #         customer = Customer.objects.get(user=req.user)
    #         customer_requests = CustomerRequest.objects.filter(customer=customer)
    #         return Response({'customer_requests': customer_requests.values()})
    
class ManagerLikedBandSongsListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        customer = Customer.objects.get(user=req.user)
        song_id = req.data.get('song_id')
        band_song = BandSongsList.objects.get(id=song_id)
        if LikedBandSongsList.objects.filter(customer=customer, band_song=band_song).exists():
            return Response({'error': 'You have already liked this song.'})
        liked_band_song = LikedBandSongsList(customer=customer, band_song=band_song)
        # check if the song is liked or not
        if liked_band_song.liked:
            liked_band_song.liked = False
        else:
            liked_band_song.liked = True
        liked_band_song.save()
        return Response({'success': 'Song liked successfully.'})

    def get(self, req):
        customer = Customer.objects.get(user=req.user)
        liked_band_songs = LikedBandSongsList.objects.filter(customer=customer)
        return Response({'liked_band_songs': liked_band_songs.values()})



# BAND LEADER VIEWS
# 

class ManagerBandSongsListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        song_name = req.data.get('song_name')
        song_artist = req.data.get('song_artist')
        song_genre = req.data.get('song_genre')
        song_durations = req.data.get('song_durations')

        band_song = BandSongsList(band=band_leader.band, song_name=song_name, song_artist=song_artist, song_genre=song_genre, song_durations=song_durations)
        band_song.save()
        return Response({'success': 'Song added successfully.'})

    def get(self, req):
        print(req.user)
        sort = req.GET.get('sort')
        view = req.GET.get('view')
        search = req.GET.get('search')
        if sort == 'name':
            band_songs = BandSongsList.objects.all().order_by('song_name')
        elif sort == 'artist':
            band_songs = BandSongsList.objects.all().order_by('song_artist')
        elif sort == 'genre':
            band_songs = BandSongsList.objects.all().order_by('song_genre')
        else:
            band_songs = BandSongsList.objects.all()
       
        if view == 'likes':
            data = []
            for band_song in band_songs:
                if LikedBandSongsList.objects.filter(band_song=band_song).exists():
                    count = LikedBandSongsList.objects.filter(band_song=band_song).count()
                else:
                    count = 0
                song_data = {
                    'id': band_song.id,
                    'song_number': band_song.song_number,
                    'song_name': band_song.song_name,
                    'song_artist': band_song.song_artist,
                    'song_genre': band_song.song_genre,
                    'song_durations': band_song.song_durations,
                    'count': count,
                    'cortes': band_song.cortes,
                    'song_year': band_song.song_year,
                    'bpm': band_song.bpm,
                    'img': 'http://localhost:8000'+ str(band_song.song_cover.url)
                }
                data.append(song_data)
        elif search:
            data = []
            for band_song in band_songs:
                if search.lower() in band_song.song_name.lower():
                    if LikedBandSongsList.objects.filter(band_song=band_song).exists():
                        count = LikedBandSongsList.objects.filter(band_song=band_song).count()
                        liked = True
                    else:
                        count = 0
                        liked = False
                    song_data = {
                        'id': band_song.id,
                        'song_number': band_song.song_number,
                        'song_name': band_song.song_name,
                        'song_artist': band_song.song_artist,
                        'song_genre': band_song.song_genre,
                        'song_durations': band_song.song_durations,
                        'count': count,
                        'song_year': band_song.song_year,
                        'liked': liked,
                        'cortes': band_song.cortes,
                        'bpm': band_song.bpm,
                        'img': 'http://localhost:8000'+ str(band_song.song_cover.url)
                    }
                    data.append(song_data)
        else:

            data = []
            for band_song in band_songs:
                if LikedBandSongsList.objects.filter(band_song=band_song).exists():
                    count = LikedBandSongsList.objects.filter(band_song=band_song).count()
                    liked = True
                else:
                    count = 0
                    liked = False
                song_data = {
                    'id': band_song.id,
                    'song_number': band_song.song_number,
                    'song_name': band_song.song_name,
                    'song_artist': band_song.song_artist,
                    'song_genre': band_song.song_genre,
                    'song_durations': band_song.song_durations,
                    'count': count,
                    'liked': liked,
                    'song_year': band_song.song_year,
                    'cortes': band_song.cortes,
                    'bpm': band_song.bpm,
                    'img': 'http://localhost:8000'+ str(band_song.song_cover.url)
                }
                data.append(song_data)
                
        return Response({'band_songs': data})

class ManagerSongsSetView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        song_id = req.data.get('song_id')
        band_song = BandSongsList.objects.get(id=song_id)
        if SongsSet.objects.filter(song=band_song).exists():
            return Response({'error': 'Song already added.'})
        song_set = SongsSet(song=band_song, band_leader=band_leader)
        song_set.save()
        return Response({'success': 'Song added successfully.'}, status=200)

    def get(self, req):
        print(req.user)
        song_sets = SongsSet.objects.all()
        data = []
        for song_set in song_sets:
            band_song = BandSongsList.objects.get(id=song_set.song.id)
            song_data = {
                    'id': band_song.id,
                    'song_number': band_song.song_number,
                    'song_name': band_song.song_name,
                    'song_artist': band_song.song_artist,
                    'song_genre': band_song.song_genre,
                    'song_durations': band_song.song_durations
            }
            data.append(song_data)
        
        return Response({'song_sets': data})
    
class ManagerUploadSongsListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]


    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        file = req.FILES.get('file')
        if not file:
            return Response({'error': 'No file found.'})
        else:
            file_content = file.read().decode('utf-8')
            for line in file_content.split('\n'):
                data = line.strip().split(' - ')
                try:
                    # number = data[0].strip()
                    # name = data[1].strip()
                    # artist = data[2].strip()
                    # cortes = data[3].strip()
                    # year = data[4].strip()
                    # genre = data[5].strip()
                    # bpm = data[7].strip() 
                    # duration = data[9].strip()
                    # cover = data[10].strip()

                    [number, name, artist, cortes, year, genre, _, bpm, _, duration, cover] = [item.strip() for item in data[:11]]


                    video_id = cover.split("=")[-1]
                    thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                    response = requests.get(thumbnail_url)
                    response.raise_for_status()
                    thumbnail = response.content

                    

                    
                    band_song = BandSongsList(band_leader=band_leader, song_number=number, song_name=name, cortes=cortes, bpm=bpm, song_artist=artist, song_year=year, song_genre=genre, song_durations=duration)
                    band_song.song_cover.save(f"{video_id}.jpg", ContentFile(thumbnail), save=True)
                    band_song.save()
                    print("saved")
                except Exception as e:
                    print(e)
                    pass


            return Response({'success': 'File uploaded successfully.'}, status=200)


# Have to check why the authorizations are not working on post request
class ManagerSetsView(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        print(req.user)
        # try:
        #     band_leader = BandLeader.objects.get(user=req.user)
        # except:
        #     return Response({'error': 'You are not a band leader.'})
        count = Sets.objects.all().count()
        name = req.data.get('name') + str(count + 1)
        if not name:
            return Response({'error': 'No name found.'})
        else:
            sets = Sets(Setname=name)
            sets.save()
            return Response({'success': 'Set created successfully.'}, status=200)
    
    def get(self, req):
        
        sets = Sets.objects.all()
        data = []
        for set in sets:
            set_data = {
                'id': set.id,
                'set_name': set.Setname
            }
            data.append(set_data)
        return Response({'sets': data})

class ManagerSongsInSetView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        
        set_id = req.data.get('set_id')
        song_id = req.data.get('song_id')

        # Check if the song is already in the set
        if SongsInSet.objects.filter(set__id=set_id, song__id=song_id).exists():
            return Response({'success': 'Song already added.'}, status=200)
        else:
            print(set_id, song_id)
            set = Sets.objects.get(id=set_id)
            song = BandSongsList.objects.get(id=song_id)
            songs_in_set = SongsInSet(set=set, song=song)
            songs_in_set.save()
            return Response({'success': 'Song added successfully to ' + set.Setname}, status=200)

    def get(self, req):
        set_id = req.GET.get('set_id')
        songs_in_set = SongsInSet.objects.filter(set__id=set_id)
        data = []
        for song_in_set in songs_in_set:
            song = BandSongsList.objects.get(id=song_in_set.song.id)
            song_data = {
                'id': song.id,
                'song_number': song.song_number,
                'song_name': song.song_name,
                'song_artist': song.song_artist,
                'song_genre': song.song_genre,
                'song_durations': song.song_durations
            }
            data.append(song_data)

        return Response({'songs_in_set': data})

    

