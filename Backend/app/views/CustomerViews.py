from .ModuleFile import *

class ManagerLikedBandSongsListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, req):
        song_id = req.data.get('song_id')
        venue_name = Venue.objects.get(is_selected=True).name

        band_song = BandSongsList.objects.get(id=song_id)
        liked_band_song = LikedBandSongsList(band_song=band_song)
        liked_band_song.liked = True
        liked_band_song.save()
        venue = Venue.objects.get(name=venue_name)
        venue_liked_band_song = LikedBandSongsListInAllVenues(venue=venue, band_song=band_song)
        venue_liked_band_song.liked = True
        venue_liked_band_song.save()

        return Response({'success': 'Song liked successfully.'})

    def get(self, req):
        customer = Customer.objects.get(user=req.user)
        liked_band_songs = LikedBandSongsList.objects.filter(customer=customer)
        return Response({'liked_band_songs': liked_band_songs.values()})


# Customer Songs List View   
class ManagerCustomerSongsListView(APIView):
    authentication_classes = []
    # permission_classes = [AllowAny]

    def get(self, req):
        sort = req.GET.get('sort')
        view = req.GET.get('view')
        search = req.GET.get('search')
        venue = req.GET.get('venue')

        
        if sort == 'name':
            band_songs = BandSongsList.objects.all().order_by('song_name')
        elif sort == 'artist':
            band_songs = BandSongsList.objects.all().order_by('song_artist')
        elif sort == 'genre':
            band_songs = BandSongsList.objects.all().order_by('song_genre')
        elif sort == 'year':
            band_songs = BandSongsList.objects.all().order_by('song_year').reverse()
        elif sort == 'this_venue_likes':
            count = 0
            liked = False
            if Venue.objects.filter(is_selected=True).exists():
                venue = Venue.objects.get(is_selected=True)
                sorted_band_songs = LikedBandSongsListInAllVenues.objects.values(
                    'band_song'
                ).annotate(
                    like_count=Count('band_song', filter=models.Q(venue=venue, liked=True))
                ).order_by('-like_count')

                data = []
                for band_song in sorted_band_songs:
                    band_song_obj = BandSongsList.objects.get(id=band_song['band_song'])
                    if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song_obj, venue=venue).exists():
                        count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song_obj, venue=venue).count()
                        all_venues_count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song_obj).count()
                        liked = True
                    else:
                        count = 0
                        all_venues_count = 0
                        liked = False
                    
                    song_data = {
                        'id': band_song_obj.id,
                        'song_number': band_song_obj.song_number,
                        'song_name': band_song_obj.song_name,
                        'song_artist': band_song_obj.song_artist,
                        'song_genre': band_song_obj.song_genre,
                        'song_durations': band_song_obj.song_durations,
                        'count': count,
                        'all_venues_count': all_venues_count,
                        'liked': liked,
                        'song_year': band_song_obj.song_year,
                        'cortes': band_song_obj.cortes,
                        'bpm': band_song_obj.bpm,
                        'img': str(band_song_obj.song_cover.url)
                    }
                    data.append(song_data)
                
                print(data)
                return Response({'band_songs': data})

                
            else:
                return Response({'error': 'No venue selected.'})
        elif sort == 'all_venues_likes':
            band_songs = BandSongsList.objects.all().order_by('song_name')

        else:
            band_songs = BandSongsList.objects.all().order_by('song_number')
       
        if view == 'likes':
            print('like')
            data = []
            count = 0
            for band_song in band_songs:
                if Venue.objects.filter(is_selected=True).exists():
                    venue = Venue.objects.get(is_selected=True)
                    if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).exists():
                        count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).count()
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
                    'img': str(band_song.song_cover.url)
                }
                data.append(song_data)
        elif search:
            print('search')
            count = 0
            liked = False
            data = []
            for band_song in band_songs:
                if search.lower() in band_song.song_name.lower():
                    if Venue.objects.filter(is_selected=True).exists():
                        venue = Venue.objects.get(is_selected=True)
                        if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).exists():
                            count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).count()
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
                        'img': str(band_song.song_cover.url)
                    }
                    data.append(song_data)
        else:
            data = []
            count = 0
            all_venues_count = 0
            liked = False
            for band_song in band_songs:
                if Venue.objects.filter(is_selected=True).exists():
                    venue = Venue.objects.get(is_selected=True)
                    if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).exists():
                        count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).count()
                        all_venues_count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song).count()
                        liked = True
                    else:
                        count = 0
                        all_venues_count = 0
                        liked = False
                
                # if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song).exists():
                #     all_venues_count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song).count()
                # else:
                #     all_venues_count = 0
                song_data = {
                    'id': band_song.id,
                    'song_number': band_song.song_number,
                    'song_name': band_song.song_name,
                    'song_artist': band_song.song_artist,
                    'song_genre': band_song.song_genre,
                    'song_durations': band_song.song_durations,
                    'count': count,
                    'all_venues_count': all_venues_count,
                    'liked': liked,
                    'song_year': band_song.song_year,
                    'cortes': band_song.cortes,
                    'bpm': band_song.bpm,
                    'img': str(band_song.song_cover.url)
                }
                data.append(song_data)
            
                
        return Response({'band_songs': data})


