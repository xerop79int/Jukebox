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
import requests
from .models import *
from django.core.files.base import ContentFile
from rest_framework.permissions import AllowAny
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync






# SIGN IN, SIGN UP AND LOGOUT VIEWS

class ManagerSigninView(ObtainAuthToken):
    authentication_classes = [TokenAuthentication]
    
    def post(self, req):
        username = req.data.get('username')
        password = req.data.get('password')

        # check who is logging in
       
        if BandLeader.objects.filter(user__username=username).exists():
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
    permission_classes = [AllowAny]

    def post(self, req):
        customer_name = req.data.get('customer_name').lower()
        song = req.data.get('song_id')
        band_song = BandSongsList.objects.get(id=song)

        # check if the song has already been requested
        if CustomerRequest.objects.filter(customer_name=customer_name, song=band_song).exists():
            return Response({'error': 'You have already requested this song.'})
    
        customer_request = CustomerRequest(customer_name=customer_name, song=band_song)
        customer_request.save()

        # get the customerrequest object
        data = {
            'id': customer_request.id,
            'customer_name': customer_request.customer_name,
            'song_number': customer_request.song.song_number,
            'song_name': customer_request.song.song_name,
            'song_artist': customer_request.song.song_artist,
            'song_duration': customer_request.song.song_durations,
        }
        
        # get the channel layer
        channel_layer = get_channel_layer()
        # send the data to the group
        async_to_sync(channel_layer.group_send)('bandleader_frontend', {
            'type': 'send_data',
            'data': data
        })
       
        return Response({'success': 'Request sent successfully.'})
    
    def put(self, req):
        request_id = req.data.get('request_id')
        status = req.data.get('status')
        approved = req.data.get('approved')
        customer_request = CustomerRequest.objects.get(id=request_id)
        customer_request.status = status
        customer_request.is_approved = approved
        customer_request.save()


         # get the customerrequest object
        data = {
            'id': customer_request.id,
            'customer_name': customer_request.customer_name,
            'song_number': customer_request.song.song_number,
            'song_name': customer_request.song.song_name,
            'song_artist': customer_request.song.song_artist,
            'song_duration': customer_request.song.song_durations,
            'status': customer_request.status,
            'is_approved': customer_request.is_approved
        }
        
        # get the channel layer
        channel_layer = get_channel_layer()
        # send the data to the group
        async_to_sync(channel_layer.group_send)('customer_frontend', {
            'type': 'send_data',
            'data': data
        })

        return Response({'success': 'Request updated successfully.'})


    # def put(self, req):
    #     song_id = req.data.get('song_id')
    #     customer = Customer.objects.get(user=req.user)
    #     request = CustomerRequest.objects.get(id=song_id)

    #     if request.customer.user == req.user:
    #         return Response({'error': 'You cannot request a song that you have already requested.'})

    #     # Check if the song has already been requested
    #     if CustomerRequest.objects.filter(customer=customer, song_name=request.song_name, song_artist=request.song_artist, song_genre=request.song_genre).exists():
    #         return Response({'error': 'You have already requested this song.'})
        
    #     customer_request = CustomerRequest(customer=customer, song_name=request.song_name, song_artist=request.song_artist, song_genre=request.song_genre)
    #     customer_request.save()
    #     return Response({'success': 'Request sent successfully.'})


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
    permission_classes = [AllowAny]

    def post(self, req):
        song_id = req.data.get('song_id')
        band_song = BandSongsList.objects.get(id=song_id)
        liked_band_song = LikedBandSongsList(band_song=band_song)
        liked_band_song.liked = True
        liked_band_song.save()
        return Response({'success': 'Song liked successfully.'})

    def get(self, req):
        customer = Customer.objects.get(user=req.user)
        liked_band_songs = LikedBandSongsList.objects.filter(customer=customer)
        return Response({'liked_band_songs': liked_band_songs.values()})


# Customer Songs List View   
class ManagerCustomerSongsListView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def get(self, req):
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
            set = Sets.objects.get(id=set_id)
            song = BandSongsList.objects.get(id=song_id)
            
            
            All_Sets = Sets.objects.all().order_by('id')
            count = 0
            for i in All_Sets:
                if i.id == set_id:
                    count += SongsInSet.objects.filter(set=i).count() + 1
                    break
                else:
                    count += SongsInSet.objects.filter(set=i).count()


            # get all the songs with number greater or equal to the count and update the number
            # the code is not working properly because it is updating the number again if it is already updated
            all_songs_in_set = SongsInSet.objects.filter(number__gte=count)
            for song_in_set in all_songs_in_set:
                song_in_set.number = int(song_in_set.number) + 1
                song_in_set.save()

            
            songs_in_set = SongsInSet(number=count, set=set, song=song)
            songs_in_set.save()



            # get all the songs in the set and order them by number then add them to the playlist
            # if the song is already in the Playlist but the number is different then update the number

            all_songs_in_set = SongsInSet.objects.all().order_by('number')
            for song_in_set in all_songs_in_set:
                if Playlist.objects.filter(SongsInSet__id=song_in_set.id).exists():
                    Playlist.objects.filter(SongsInSet__id=song_in_set.id).delete()
                    playlist = Playlist(SongsInSet=song_in_set)
                    playlist.save()
                else:
                    playlist = Playlist(SongsInSet=song_in_set)
                    playlist.save()
            
            if ShowStatus.objects.filter(has_show_started=True).exists():
                pass
            else:
                if Playlist.objects.filter(status='now').exists() and Playlist.objects.filter(status='now').exclude(SongsInSet__number=1).exists():
                    Playlist.objects.filter(status='now').update(status='')
                    Playlist.objects.filter(SongsInSet__number=1).update(status='now')
                elif Playlist.objects.filter(status='now').exists() and Playlist.objects.filter(status='now').exclude(SongsInSet__number=2).exists():
                    Playlist.objects.filter(status='now').update(status='')
                    Playlist.objects.filter(SongsInSet__number=2).update(status='next')
                else:
                    if Playlist.objects.filter(SongsInSet__number=1).exists():
                        Playlist.objects.filter(SongsInSet__number=1).update(status='now')
                    if Playlist.objects.filter(SongsInSet__number=2).exists():
                        Playlist.objects.filter(SongsInSet__number=2).update(status='next')
                    



            return Response({'success': 'Song added successfully to ' + set.Setname}, status=200)

    def put(self, req):
        customer_request = req.data.get('request_id')
        place = req.data.get('place')


        if place > 3:
            song = BandSongsList.objects.get(id=customer_request).id
            songinset = SongsInSet.objects.get(song=song)
            number = songinset.number
        else:
            request = CustomerRequest.objects.get(id=customer_request)
            song_id = request.song.id

        if place == 1:
            if Playlist.objects.filter(status='now').exists():
                number = Playlist.objects.get(status='now').SongsInSet.number
                set_id = SongsInSet.objects.get(number=number).set.id

                count = int(number) + 1
                all_songs_in_set = SongsInSet.objects.filter(number__gte=count)
                for song_in_set in all_songs_in_set:
                    song_in_set.number = int(song_in_set.number) + 1
                    song_in_set.save()

                new = SongsInSet(number=int(number)+1, set_id=set_id, song_id=song_id)
                new.save()

                # add the new song to the playlist
                if Playlist.objects.filter(status='next').exists():
                    Playlist.objects.filter(status='next').update(status='')
                playlist = Playlist(SongsInSet=new, status='next')
                playlist.save()

        if place == 2:
            if Playlist.objects.filter(status="next").exists():
                number = Playlist.objects.get(status='next').SongsInSet.number
                set_id = SongsInSet.objects.get(number=number).set.id

                count = int(number) + 1
                all_songs_in_set = SongsInSet.objects.filter(number__gte=count)
                for song_in_set in all_songs_in_set:
                    song_in_set.number = int(song_in_set.number) + 1
                    song_in_set.save()

                new = SongsInSet(number=int(number)+1, set_id=set_id, song_id=song_id)
                new.save()

                # add the new song to the playlist
                playlist = Playlist(SongsInSet=new)
                playlist.save()

        if place == 3:
            if Playlist.objects.filter(status="next").exists():
                number = Playlist.objects.get(status='next').SongsInSet.number
                set_id = SongsInSet.objects.get(number=number).set.id
                number = SongsInSet.objects.filter(set__id=set_id).count()

                count = int(number) + 1
                all_songs_in_set = SongsInSet.objects.filter(number__gte=count)
                for song_in_set in all_songs_in_set:
                    song_in_set.number = int(song_in_set.number) + 1
                    song_in_set.save()

                new = SongsInSet(number=int(number)+1, set_id=set_id, song_id=song_id)
                new.save()

                # add the new song to the playlist
                playlist = Playlist(SongsInSet=new)
                playlist.save()
        

        if place == 4:
            # check if the song with the number - 1 is the now song and return a response that song can't be moved
            if Playlist.objects.get(status='now').SongsInSet.number == number-1:
                return Response({'success': 'Song can not be moved'}, status=200)
            if number == 1:
                return Response({'success': 'This song is the first in the queue so cannot be moved up'}, status=200)
            if SongsInSet.objects.filter(number=number-1).exists():
                pre = SongsInSet.objects.get(number=number-1)
                pre.number += 1
                pre.save()
                SongsInSet.objects.filter(song=song).update(number=number-1)

                return Response({'success': 'Song position updated'}, status=200)
        
        if place == 5:
            if SongsInSet.objects.all().count() == number:
                return Response({'success': 'This song is the last song so cannot be moved down'}, status=200)
            if SongsInSet.objects.filter(number=number+1).exists():
                next = SongsInSet.objects.get(number=number+1)
                next.number -= 1
                next.save()
                SongsInSet.objects.filter(song=song).update(number=number+1)
            
            return Response({'success': 'Song position updated'}, status=200)
        

            

        return Response({'success': 'Song added successfully to the playlist'}, status=200)





    def get(self, req):
        set_id = req.GET.get('set_id')
        songs_in_set = SongsInSet.objects.filter(set__id=set_id).order_by('number')
        data = []
        for song_in_set in songs_in_set:
            song = BandSongsList.objects.get(id=song_in_set.song.id)
            song_data = {
                'id': song.id,
                'number': song_in_set.number,
                'song_number': song.song_number,
                'song_name': song.song_name,
                'song_artist': song.song_artist,
                'song_genre': song.song_genre,
                'song_durations': song.song_durations
            }
            data.append(song_data)

        return Response({'songs_in_set': data})

class ManagerPlaylistView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, req):
        movement = req.data.get('movement')

        if movement == 'next':
            if Playlist.objects.filter(status='now').exists() and Playlist.objects.filter(status='next').exists():
                if not Playlist.objects.get(status='next').SongsInSet.number > Playlist.objects.all().count():
                    next = Playlist.objects.get(status='next')
                    next_number = int(Playlist.objects.get(status='next').SongsInSet.number) + 1
                    Playlist.objects.filter(status='now').update(status='')
                    Playlist.objects.filter(id=next.id).update(status='now')
                    Playlist.objects.filter(SongsInSet__number=next_number).update(status='next')
        if movement == 'previous':
            if Playlist.objects.filter(status='now').exists():
                if Playlist.objects.get(status='now').SongsInSet.number != 1:
                    now_number = int(Playlist.objects.get(status='now').SongsInSet.number) - 1
                    Playlist.objects.filter(status='next').update(status='')
                    Playlist.objects.filter(status='now').update(status='next')
                    Playlist.objects.filter(SongsInSet__number=now_number).update(status='now')
        

        # Send Now and next song to the customer frontend
        data = []
        if Playlist.objects.filter(status='now').exists():
            now = Playlist.objects.get(status='now').SongsInSet
            now_song = BandSongsList.objects.get(id=now.song.id)
            now_data = {
                'id': now_song.id,
                'number': now.number,
                'song_number': now_song.song_number,
                'song_name': now_song.song_name,
                'song_artist': now_song.song_artist,
                'song_genre': now_song.song_genre,
                'song_durations': now_song.song_durations,
                'img': 'http://localhost:8000'+ str(now_song.song_cover.url)
            }
            data.append(now_data)
        
        if Playlist.objects.filter(status='next').exists():
            next = Playlist.objects.get(status='next').SongsInSet
            next_song = BandSongsList.objects.get(id=next.song.id)
            next_data = {
                'id': next_song.id,
                'number': next.number,
                'song_number': next_song.song_number,
                'song_name': next_song.song_name,
                'song_artist': next_song.song_artist,
                'song_genre': next_song.song_genre,
                'song_durations': next_song.song_durations,
                'img': 'http://localhost:8000'+ str(next_song.song_cover.url)
            }
            data.append(next_data)
        
            # get the channel layer
            channel_layer = get_channel_layer()
            # send the data to the group
            async_to_sync(channel_layer.group_send)('customer_frontend', {
                'type': 'send_playlist',
                'playlist': data
            })
        

                
        
        return Response({'success': 'Playlist updated successfully'}, status=200)

    def get(self, req):
        data = []
        if Playlist.objects.filter(status='now').exists():
            now = Playlist.objects.get(status='now').SongsInSet
            now_song = BandSongsList.objects.get(id=now.song.id)
            now_data = {
                'id': now_song.id,
                'number': now.number,
                'song_number': now_song.song_number,
                'song_name': now_song.song_name,
                'song_artist': now_song.song_artist,
                'song_genre': now_song.song_genre,
                'song_durations': now_song.song_durations,
                'img': 'http://localhost:8000'+ str(now_song.song_cover.url),
                'cortes': now_song.cortes,
                'bpm': now_song.bpm,
                'song_year': now_song.song_year,
            }
            data.append(now_data)
        
        if Playlist.objects.filter(status='next').exists():
            next = Playlist.objects.get(status='next').SongsInSet
            next_song = BandSongsList.objects.get(id=next.song.id)
            next_data = {
                'id': next_song.id,
                'number': next.number,
                'song_number': next_song.song_number,
                'song_name': next_song.song_name,
                'song_artist': next_song.song_artist,
                'song_genre': next_song.song_genre,
                'song_durations': next_song.song_durations,
                'img': 'http://localhost:8000'+ str(next_song.song_cover.url),
                'cortes': next_song.cortes,
                'bpm': next_song.bpm,
                'song_year': next_song.song_year,
            }
            data.append(next_data)
        
        if data == []:
            return Response({'success': "empty"}, status=200)
        
        return Response({'playlist': data})
        


    


