from .ModuleFile import *
#from .pdf_to_text import *

Customer_Requests = []
class ManagerCustomerRequestView(APIView):
    authentication_classes = [JWTAuthentication]
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

        if Customer_Requests:
            Customer_Requests.append(data)
            return Response({'success': 'Request sent successfully.'})
        
        Customer_Requests.append(data)
        channel_layer = get_channel_layer()
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
        

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)('customer_frontend', {
            'type': 'send_data',
            'data': data
        })
        
        Customer_Requests.pop(0)
        if Customer_Requests:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)('bandleader_frontend', {
                'type': 'send_data',
                'data': Customer_Requests[0]
            })


        return Response({'success': 'Request updated successfully.'})


class ManagerBandSongsListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

    def post(self, req):
        print(req.user)
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        song_number = req.data.get('song_number')
        song_name = req.data.get('song_name')
        song_artist = req.data.get('song_artist')
        song_genre = req.data.get('song_genre')
        song_durations = req.data.get('song_durations')
        song_year = req.data.get('song_year')
        song_cover = req.data.get('song_cover')
        cortes = req.data.get('cortes')
        bpm = req.data.get('bpm')
        song_lyrics = req.data.get('song_lyrics')

        band_song = BandSongsList(band_leader=band_leader, song_name=song_name, song_number=song_number, song_artist=song_artist, song_genre=song_genre, song_durations=song_durations, song_year=song_year, song_cover=song_cover, cortes=cortes, bpm=bpm, song_lyrics=song_lyrics )
        band_song.save()
        return Response({'success': 'Song added successfully.'})

    def put(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        song_id = req.data.get('song_id')
        song_number = req.data.get('song_number')
        song_name = req.data.get('song_name')
        song_artist = req.data.get('song_artist')
        song_genre = req.data.get('song_genre')
        song_durations = req.data.get('song_durations')
        song_year = req.data.get('song_year')
        song_cover = req.data.get('song_cover')
        cortes = req.data.get('cortes')
        bpm = req.data.get('bpm')
        song_lyrics = req.data.get('song_lyrics')

        # if any of the fields are empty then keep the old data
        band_song = BandSongsList.objects.get(id=song_id)
        if song_name:
            band_song.song_name = song_name
        if song_number:
            band_song.song_number = song_number
        if song_artist:
            band_song.song_artist = song_artist
        if song_genre:
            band_song.song_genre = song_genre
        if song_durations:
            band_song.song_durations = song_durations
        if song_year:
            band_song.song_year = song_year
        if song_cover:
            band_song.song_cover = song_cover
        if cortes:
            band_song.cortes = cortes
        if bpm:
            band_song.bpm = bpm
        if song_lyrics:
            band_song.song_lyrics = song_lyrics
        band_song.save()
        return Response({'success': 'Song updated successfully.'})

    def delete(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        song_id = req.GET.get('song_id')
        band_song = BandSongsList.objects.get(id=song_id)
        band_song.delete()
        return Response({'success': 'Song deleted successfully.'})

    def get(self, req):
        print(req.user)
        sort = req.GET.get('sort')
        view = req.GET.get('view')
        search = req.GET.get('search')
        single = req.GET.get('single')
        set_id = req.GET.get('set_id')

        if sort == 'name':
            band_songs = BandSongsList.objects.all().order_by('song_name')
        elif sort == 'artist':
            band_songs = BandSongsList.objects.all().order_by('song_artist')
        elif sort == 'genre':
            band_songs = BandSongsList.objects.all().order_by('song_genre')
        else:
            band_songs = BandSongsList.objects.all()

        if single:
            band_song = BandSongsList.objects.get(id=single)
            data = {
                'id': band_song.id,
                'song_number': band_song.song_number,
                'song_name': band_song.song_name,
                'song_artist': band_song.song_artist,
                'song_genre': band_song.song_genre,
                'song_durations': band_song.song_durations,
                'song_year': band_song.song_year,
                'cortes': band_song.cortes,
                'bpm': band_song.bpm,
                'song_lyrics': band_song.song_lyrics,
                'img': 'http://127.0.0.1:8000'+ str(band_song.song_cover.url)
            }
            return Response({'band_song': data})
       
        if view == 'likes':
            data = []
            count = 0
            for band_song in band_songs:
                if Venue.objects.filter(is_selected=True).exists():
                    venue = Venue.objects.get(is_selected=True)
                    if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).exists():
                        count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).count()
                    else:
                        count = 0


                if SongsInSet.objects.filter(song=band_song, set__id=set_id).exists():
                    is_in_set = True
                else:
                    is_in_set = False
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
                    'img': str(band_song.song_cover.url),
                    'is_inset': is_in_set
                }
                data.append(song_data)
        elif search:
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
            for band_song in band_songs:
                if Venue.objects.filter(is_selected=True).exists():
                    venue = Venue.objects.get(is_selected=True)
                    if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).exists():
                        count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song, venue=venue).count()
                        liked = True
                    else:
                        count = 0
                        liked = False
                
                if LikedBandSongsListInAllVenues.objects.filter(band_song=band_song).exists():
                    all_venues_count = LikedBandSongsListInAllVenues.objects.filter(band_song=band_song).count()
                else:
                    all_venues_count = 0
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
    
class ManagerUploadSongsListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]



    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        type = req.data.get('type')
        if type == 'data file':

            file = req.FILES.get('file')
            count = 0
            if not file:
                return Response({'error': 'No file found.'})
            else:
                channel_layer = get_channel_layer()
                file_content = file.read().decode('utf-8')
                # find the number of lines in the file
                line_count = sum(1 for line in file)
                for line in file_content.split('\n'):
                    if not line:
                        continue
                    else:
                        data = line.strip().split(' - ')
                        try:
                            [number, name, artist, cortes, year, genre, _, bpm, _, duration, cover] = [item.strip() for item in data[:11]]
                            print(number, name, artist, cortes, year, genre, bpm, duration, cover)

                            video_id = cover.split("=")[-1]
                            thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                            response = requests.get(thumbnail_url)
                            response.raise_for_status()
                            thumbnail = response.content
                            
                            if BandSongsList.objects.filter(song_number=number).exists():
                                print(f'exists {number}')
                                band_song = BandSongsList.objects.get(song_number=number)
                                band_song.song_name = name
                                band_song.song_artist = artist
                                band_song.song_genre = genre
                                band_song.song_durations = duration
                                band_song.song_year = year
                                band_song.cortes = cortes
                                band_song.bpm = bpm
                                band_song.song_cover.save(f"{video_id}.jpg", ContentFile(thumbnail), save=True)
                                band_song.save()
                            else:
                                band_song = BandSongsList(band_leader=band_leader, song_number=number, song_name=name, cortes=cortes, bpm=bpm, song_artist=artist, song_year=year, song_genre=genre, song_durations=duration)
                                band_song.song_cover.save(f"{video_id}.jpg", ContentFile(thumbnail), save=True)
                                band_song.save()
                            count += 1

                            data = {
                                'upload': f"Successfully Uploaded {count} out of {line_count}."
                            }
                            
                            async_to_sync(channel_layer.group_send)('bandleader_upload', {
                                'type': 'sending_data_file_response',
                                'data': data,
                            })

                            Response({'success': f"Successfully Uploaded {count} out of {line_count}"}, status=200)
                        
                        except Exception as e:

                            log = Logs.objects.create(log=f"Song ID: {number}, Song Name: {name}, Error: {e}, data: {data}, line: {line}", type='Data File')
                            log.save()
                            print(e)
                            pass
            return Response({'success': 'Successfully Uploaded files.'}, status=200)

        elif type == 'pdf':
            channel_layer = get_channel_layer()
            data = {
                'upload': f"Wait for the file to be processed."
            }

            async_to_sync(channel_layer.group_send)('bandleader_upload', {
                'type': 'sending_data_file_response',
                'data': data,
            })
            i = 0
            files = req.FILES.getlist('files')
            total_files = len(files)  
            
            if not files:
                return Response({'error': 'No file found.'})
            else:
                songs = BandSongsList.objects.all()
                for file in files:
                    log_check = True
                    file_name = file.name.lower().replace('.pdf', '').replace('official', '').replace('chords', '').strip()
                    try:
                        for song in songs:
                            if file_name == song.song_name.replace("'", "").lower():
                                output = write_to_text_file(file, file_name)
                                song.song_lyrics = output
                                song.save()
                                i += 1
                                data = {
                                    'upload': f"Successfully Uploaded {i} pdf out of {total_files} pdfs."
                                }

                                async_to_sync(channel_layer.group_send)('bandleader_upload', {
                                    'type': 'sending_data_file_response',
                                    'data': data,
                                })
                                log_check = False
                            # else:
                            #     log = Logs.objects.create(log=f"Song Name: {song.song_name}, Error: Pdf is missing.", type='PDF File')

                        
                        if log_check:
                            log = Logs.objects.create(log=f"PDF File: {file_name}, Error: Song not found", type='PDF File')
                            log.save()

                    except Exception as e:
                        print(e)
                        pass      

            return Response({'success': f"Successfully Uploaded {i} pdf out of {total_files} pdfs."}, status=200)


# Have to check why the authorizations are not working on post request
class ManagerSetsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, req):
        try:
            show = Show.objects.get(is_selected=True)
            count = Sets.objects.filter(show=show).count()
            name = req.data.get('name') + str(count + 1)
            sets = Sets(Setname=name, show=show)
            sets.save()
            return Response({'success': 'Set created successfully.'}, status=200)
        except:
            count = Sets.objects.filter(show=None).count()
            name = req.data.get('name') + str(count + 1)
            sets = Sets(Setname=name)
            sets.save()
            return Response({'success': 'Master Set created successfully.'}, status=200)
    
    def delete(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        set_id = req.GET.get('delete')
        if not set_id:
            return Response({'error': 'No set id found.'})
        else:
            sets = Sets.objects.get(id=set_id)
            sets.delete()
            return Response({'success': 'Set deleted successfully.'}, status=200)
    
    def get(self, req):
        
        try:
            show = Show.objects.get(is_selected=True)
            sets = Sets.objects.filter(show=show)
            data = []
            for set in sets:
                set_data = {
                    'id': set.id,
                    'set_name': set.Setname
                }
                data.append(set_data)
            return Response({'sets': data})
        except:
            sets = Sets.objects.filter(show=None)
            data = []
            for set in sets:
                set_data = {
                    'id': set.id,
                    'set_name': set.Setname
                }
                data.append(set_data)
            return Response({'sets': data})
     

class ManagerVenueView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        venue_name = req.data.get('venue_name')
        venue_address = req.data.get('venue_address')
        venue_city = req.data.get('venue_city')
        venue_state = req.data.get('venue_state')
        venue_zip = req.data.get('venue_zip')
        venue_contact = req.data.get('venue_contact_name')
        venue_phone = req.data.get('venue_phone_number')
        venue_facebook = req.data.get('venue_facebook')
        venue_url = req.data.get('venue_url')

        if Venue.objects.filter(name=venue_name).exists():
            return Response({'Success': 'Venue already exists.'})

        venue = Venue(name=venue_name, address=venue_address, city=venue_city, state=venue_state, zipcode=venue_zip, contact_name=venue_contact, phone_number=venue_phone, facebook=venue_facebook, url=venue_url)
        venue.save()

        return Response({'success': 'Venue has been added successfully.'})
    
    def put(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        venue_id = req.data.get('venue_id')
        venue_name = req.data.get('venue_name')
        venue_address = req.data.get('venue_address')
        venue_city = req.data.get('venue_city')
        venue_state = req.data.get('venue_state')
        venue_zip = req.data.get('venue_zip')
        venue_contact = req.data.get('venue_contact_name')
        venue_phone = req.data.get('venue_phone_number')
        venue_facebook = req.data.get('venue_facebook')
        venue_url = req.data.get('venue_url')

        venue = Venue.objects.get(id=venue_id)
        venue.name = venue_name
        venue.address = venue_address
        venue.city = venue_city
        venue.state = venue_state
        venue.zipcode = venue_zip
        venue.contact_name = venue_contact
        venue.phone_number = venue_phone
        venue.facebook = venue_facebook
        venue.url = venue_url
        venue.save()
        # Playlist.objects.all().delete()

        return Response({'success': 'Venue has been activated successfully.'})
    
    def delete(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        venue_name = req.GET.get('venue_name')
        print(venue_name)
        venue = Venue.objects.get(name=venue_name)
        venue.delete()
        return Response({'success': 'Venue has been deleted successfully.'})

    def get(self, req):
        # check if the Venue model is empty
        selected_venue = req.GET.get('selected_venue')
        if selected_venue:
            venue = Venue.objects.get(name=selected_venue)
            # convert the venue object to json
            venue = {
                'id': venue.id,
                'name': venue.name,
                'address': venue.address,
                'city': venue.city,
                'state': venue.state,
                'zipcode': venue.zipcode,
                'contact_name': venue.contact_name,
                'phone_number': venue.phone_number,
                'facebook': venue.facebook,
                'url': venue.url,
            }
            return Response({'success': 'Venue has been activated successfully.', 'venue': venue})
        if Venue.objects.all().exists():
            venues = Venue.objects.all()
            data = []
            for venue in venues:
                data.append({
                    'id': venue.id,
                    'name': venue.name,
                    'city': venue.city,
                    'state': venue.state,
                })
            return Response({'venue': data})
        else:
            return Response({'error': 'No venues found.'})


class ManagerShowView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})

        show_date = req.data.get('show_date')
        show_start_time = req.data.get('show_start_time')
        show_end_time = req.data.get('show_end_time')
        show_facebook = req.data.get('show_facebook_event_name')
        show_venue = req.data.get('show_venue')
        sets = req.data.get('sets')

        show_date_obj = datetime.strptime(show_date, '%Y-%m-%d')
        suffix = "" if show_date_obj.day <= 0 else ["th", "st", "nd", "rd"][
                    0 if (show_date_obj.day > 3 and show_date_obj.day < 21) or show_date_obj.day % 10 > 3 else show_date_obj.day % 10
                ]
        formatted_date = show_date_obj.strftime("%A %h %e{suffix}, %Y").format(suffix=suffix)
        show_name = f"{show_venue} - {formatted_date}"
        
        show_venue = Venue.objects.get(name=show_venue)

        show = Show(name=show_name, date=show_date, start_time=show_start_time, end_time=show_end_time, facebook_event=show_facebook, venue=show_venue)
        show.save()
        # remove all the empty from sets list
        sets = list(filter(None, sets))
        for set in sets:

            set = Sets.objects.get(id=set)
            # name = f"Set {Sets.objects.filter(show=show).count() + 1}"
            # create a duplicate set
            new_set = Sets(Setname=set.Setname, show=show)
            new_set.save()
            songs  = SongsInSet.objects.filter(set=set)
            for song in songs:
                song = SongsInSet(number=song.number, set=new_set, song=song.song, is_locked=song.is_locked)
                song.save()
            
        return Response({'success': 'Show has been added successfully.'})
    
    def put(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        
        start = req.data.get('start')
        stop = req.data.get('stop')
        if start:
            if Show.objects.filter(is_selected=True).exists():
                show = Show.objects.get(is_selected=True)
                show.is_selected = False
                show.save()

                venue = Venue.objects.get(name=show.venue.name)
                venue.is_selected = False
                venue.save()

            show_name = req.data.get('show_name')
            print(show_name)
            show = Show.objects.get(name=show_name)
            show.is_selected = True
            show.save()
            venue = Venue.objects.get(name=show.venue.name)
            venue.is_selected = True
            venue.save()
            return Response({'success': 'Show has been activated successfully.'})
        elif stop:
            show = Show.objects.get(is_selected=True)
            show.is_selected = False
            show.save()
            venue = Venue.objects.get(name=show.venue.name)
            venue.is_selected = False
            venue.save()
            return Response({'success': 'Show has been deactivated successfully.'})
        else:
            selected_show = req.data.get('selected_show')
            show_date = req.data.get('show_date')
            show_start_time = req.data.get('show_start_time')
            show_end_time = req.data.get('show_end_time')
            show_facebook = req.data.get('show_facebook_event_name')
            show_venue = req.data.get('show_venue')
            sets = req.data.get('sets')

            # show_date = datetime.strptime(show_date, '%m-%d-%Y').strftime('%Y-%m-%d')
            sets = list(filter(None, sets))
            show_venue = Venue.objects.get(name=show_venue)
            show = Show.objects.get(id=selected_show)
            pre_sets = Sets.objects.filter(show=show)

            # delete all the previous sets
            for set in pre_sets:
                set.delete()

            for set in sets:
                set = Sets.objects.get(id=set)
                # name = f"Set {Sets.objects.filter(show=show).count() + 1}"
                # create a duplicate set
                new_set = Sets(Setname=set.Setname, show=show)
                new_set.save()
                songs  = SongsInSet.objects.filter(set=set)
                for song in songs:
                    song = SongsInSet(number=song.number, set=new_set, song=song.song, is_locked=song.is_locked)
                    song.save()
            
            show_date_obj = datetime.strptime(show_date, '%Y-%m-%d')
            suffix = "" if show_date_obj.day <= 0 else ["th", "st", "nd", "rd"][
                    0 if (show_date_obj.day > 3 and show_date_obj.day < 21) or show_date_obj.day % 10 > 3 else show_date_obj.day % 10
                ]
            formatted_date = show_date_obj.strftime("%A %h %e{suffix}, %Y").format(suffix=suffix)
            show_name = f"{show_venue.name} - {formatted_date}"

            show.name = show_name     
            show.date = show_date
            show.start_time = show_start_time
            show.end_time = show_end_time
            show.facebook_event = show_facebook
            show.venue = show_venue
            show.save()
            return Response({'success': 'Show has been updated successfully.'})
    
    def delete(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})

        show_id = req.GET.get('show_id')
        show = Show.objects.get(id=show_id)
        show.delete()
        return Response({'success': 'Show has been deleted successfully.'})

    def get(self, req):

        show = req.GET.get('selected_show')
        future = req.GET.get('future')
        past = req.GET.get('past')
        if show:
            show = Show.objects.get(id=show)
            suffix = "" if show.date.day <= 0 else ["th", "st", "nd", "rd"][
                    0 if (show.date.day > 3 and show.date.day < 21) or show.date.day % 10 > 3 else show.date.day % 10
                ]
            formatted_date = show.date.strftime("%A %h %e{suffix}, %Y").format(suffix=suffix)
            sets = Sets.objects.filter(show=show)
            sets_data = []
            for set in sets:
                sets_data.append({
                    'id': set.id,
                    'set_name': set.Setname,
                })
            show = {
                'id': show.id,
                'name': show.name,
                'date': show.date,
                'formatted_date': formatted_date,
                'start_time': show.start_time.strftime("%I:%M"),
                'end_time': show.end_time.strftime("%I:%M"),
                'facebook_event_name': show.facebook_event,
                'sets': sets_data,
                'venue': {
                    'id': show.venue.id,
                    'name': show.venue.name,
                    'city': show.venue.city,
                    'state': show.venue.state,
                }
            }
            return Response({'success': 'Show has been activated successfully.', 'show': show})
        
        if future:
            shows = Show.objects.filter(date__gte=datetime.today()).order_by('date')
            data = []
            
            for show in shows:

                suffix = "" if show.date.day <= 0 else ["th", "st", "nd", "rd"][
                    0 if (show.date.day > 3 and show.date.day < 21) or show.date.day % 10 > 3 else show.date.day % 10
                ]
                formatted_date = show.date.strftime("%A %h %e{suffix}, %Y").format(suffix=suffix)
                check = show.is_selected
                data.append({
                    'id': show.id,
                    'name': show.name,
                    'date': formatted_date,
                    'start_time': show.start_time.strftime("%I:%M %p"),
                    'end_time': show.end_time.strftime("%I:%M %p"),
                    'facebook_event': show.facebook_event,
                    'city': show.venue.city,
                    'state': show.venue.state,
                    'venue': show.venue.name,
                    'check': check
                })
            return Response({'show': data})

        if past:
            shows = Show.objects.filter(date__lte=datetime.today()).order_by('date')
            data = []
            for show in shows:
                suffix = "" if show.date.day <= 0 else ["th", "st", "nd", "rd"][
                    0 if (show.date.day > 3 and show.date.day < 21) or show.date.day % 10 > 3 else show.date.day % 10
                ]
                formatted_date = show.date.strftime("%A %h %e{suffix}, %Y").format(suffix=suffix)
                data.append({
                    'id': show.id,
                    'name': show.name,
                    'date': formatted_date,
                    'start_time': show.start_time.strftime("%I:%M %p"),
                    'end_time': show.end_time.strftime("%I:%M %p"),
                    'facebook_event': show.facebook_event,
                    'city': show.venue.city,
                    'state': show.venue.state,
                    'venue': show.venue.name
                })
            return Response({'show': data})

        # check if the Venue model is empty
        if Show.objects.all().exists():
            shows = Show.objects.all()
            data = []
            for show in shows:
                data.append({
                    'id': show.id,
                    'name': show.name,
                    'date': show.date,
                    'start_time': show.start_time,
                    'end_time': show.end_time,
                    'facebook_event': show.facebook_event,
                    'city': show.venue.city,
                    'state': show.venue.state,
                    'venue': show.venue.name
                })
            return Response({'show': data})
        else:
            return Response({'error': 'No shows found.'})

class ManagerSongsInSetView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, req):
        try:
            band_leader = BandLeader.objects.get(user=req.user)
        except:
            return Response({'error': 'You are not a band leader.'})
        
        set_id = req.data.get('set_id')
        song_id = req.data.get('song_id')
        set = Sets.objects.get(id=set_id)

        if SongsInSet.objects.filter(set=set, song_id=song_id).exists():
            del_song = SongsInSet.objects.filter(set=set, song_id=song_id).first()
            Playlist.objects.filter(SongsInSet=del_song).delete()
            del_song.delete()

            all_songs_in_set = SongsInSet.objects.filter(set=set).order_by('number')
            if all_songs_in_set.exists():
                first = all_songs_in_set.first()
                if Playlist.objects.filter(SongsInSet=first).exists():
                    Playlist.objects.filter(SongsInSet=first).update(status='now')
                if all_songs_in_set.count() > 1:
                    second = all_songs_in_set[1]
                    if Playlist.objects.filter(SongsInSet=second).exists():
                        Playlist.objects.filter(SongsInSet=second).update(status='next')
            count = 1
            for song in all_songs_in_set:
                song.number = count
                song.save()
                count += 1
            
            return Response({'success': 'Song removed successfully.'}, status=200)

        if SongsInSet.objects.filter(set=set).exists():
            all_songs_in_set = SongsInSet.objects.filter(set=set).order_by('number')
            count = 1
            for song in all_songs_in_set:
                song.number = count
                song.save()
                count += 1
        
        number = SongsInSet.objects.filter(set=set).count() + 1
        song = SongsInSet(number=number, set_id=set_id, song_id=song_id)
        song.save()

        return Response({'success': 'Song added successfully to ' + set.Setname}, status=200)
        

    def put(self, req):
        customer_request = req.data.get('request_id')
        set_name = req.data.get('set_name')
        song_id = req.data.get('song_id')
        place = req.data.get('place')
        locking = req.data.get('locking')

        try:
            set_id = set_name.split(' ')[-1]
            set = Sets.objects.get(id=set_id)
        except:
            pass

        if locking == 'lock':
            request = SongsInSet.objects.get(set=set, song__id=song_id)
            request.is_locked = True
            request.save()
            return Response({'success': 'Request locked successfully.'}, status=200)
        elif locking == 'unlock':
            request = SongsInSet.objects.get(set=set, song__id=song_id)
            request.is_locked = False
            request.save()
            return Response({'success': 'Request unlocked successfully.'}, status=200)

        

        if place >= 1 and place <=3:
            
            if place == 1:
                if Playlist.objects.filter(status='now').exists():
                    song_in_set = Playlist.objects.get(status='now').SongsInSet
                    number = song_in_set.number
                    set = song_in_set.set 
            elif place == 2:
                if Playlist.objects.filter(status="next").exists():
                    song_in_set = Playlist.objects.get(status='next').SongsInSet
                    number = song_in_set.number
                    set = song_in_set.set
            elif place == 3:
                if Playlist.objects.filter(status="next").exists():
                    song_in_set = Playlist.objects.get(status='next').SongsInSet
                    number = song_in_set.number
                    set = song_in_set.set
                    number = SongsInSet.objects.filter(set=set).count()
            
            should_next_update = True
            while True:
                if SongsInSet.objects.filter(number=number+1).exists():
                    song_in_set = SongsInSet.objects.get(number=number+1, set=set)
                    if song_in_set.is_locked == True:
                        number += 1
                        should_next_update = False
                    else:
                        break
                else:
                    break

            if SongsInSet.objects.filter(number=number+1).exists():
                delete = SongsInSet.objects.get(number=number+1, set=set)
                delete.delete()
            elif place == 3:
                delete = SongsInSet.objects.get(number=number, set=set)
                delete.delete()
                number -= 1
            request = CustomerRequest.objects.get(id=customer_request)
            song = request.song
            new = SongsInSet(number=int(number+1), set=set, song_id=song.id, is_locked=True)
            new.save()

            all_songs_in_set = SongsInSet.objects.all().order_by('number')
            for song_in_set in all_songs_in_set:
                if Playlist.objects.filter(SongsInSet=song_in_set).exists():
                    continue
                else:
                    new_playlist = Playlist(SongsInSet=song_in_set)
                    new_playlist.save()
            
            if should_next_update == True and place == 1:
                Playlist.objects.filter(SongsInSet=new).update(status='next')
            

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
                    'img': str(now_song.song_cover.url)
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
                    'img': str(next_song.song_cover.url)
                }
                data.append(next_data)
            
            
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)('customer_frontend', {
                'type': 'send_playlist',
                'playlist': data,
            })

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)('bandmember_frontend', {
                'type': 'send_playlist',
                'playlist': data,
            })
        

        # Song Movement Code
        if place > 3:
            song = BandSongsList.objects.get(id=customer_request).id
            songinset = SongsInSet.objects.get(song=song, set=set)
            number = songinset.number

        if place == 4:
            # check if the song with the number - 1 is the now song and return a response that song can't be moved
            print(set)
            if SongsInSet.objects.get(number=number-1, set=set).is_locked == True:
                return Response({'success': 'Previous Song is locked, So this song cannot be moved up'})
            if SongsInSet.objects.get(number=number,  set=set).is_locked == True:
                return Response({'success': 'Song is locked'})
            # if Playlist.objects.get(status='now').SongsInSet.number == number-1:
            #     return Response({'success': 'Song can not be moved'}, status=200)
            if number == 1:
                return Response({'success': 'This song is the first in the queue so cannot be moved up'}, status=200)
            if SongsInSet.objects.filter(number=number-1).exists():
                pre = SongsInSet.objects.get(number=number-1, set=set)
                pre.number += 1
                pre.save()
                SongsInSet.objects.filter(song=song).update(number=number-1)

                return Response({'success': 'Song position updated'}, status=200)
        
        if place == 5:
            # check if the song with the number + 1 is the now song and return a response that song can't be moved
            print(set)
            if SongsInSet.objects.filter(number=number+1, set=set).exists():
                print(SongsInSet.objects.filter(number=number+1, set=set))
                if SongsInSet.objects.get(number=number+1, set=set).is_locked == True:
                    return Response({'success': 'Next Song is locked, So this song cannot be moved down'})
            
            if SongsInSet.objects.filter(number=number).exists():
                if SongsInSet.objects.get(number=number, set=set).is_locked == True:
                    return Response({'success': 'Song is locked'})
            if SongsInSet.objects.all().count() == number:
                return Response({'success': 'This song is the last song so cannot be moved down'}, status=200)

            if SongsInSet.objects.filter(number=number+1).exists():
                next = SongsInSet.objects.get(number=number+1, set=set)
                next.number -= 1
                next.save()
                SongsInSet.objects.filter(song=song).update(number=number+1)
            
            return Response({'success': 'Song position updated'}, status=200)
        

            

        return Response({'success': 'Song added successfully to the playlist'}, status=200)


    def delete(self, req):
        set_id = req.GET.get('set_id')
        song_id = req.GET.get('song_id')
        
        songinset = SongsInSet.objects.get(set__id=set_id, song__id=song_id)
        song_playlist = Playlist.objects.get(SongsInSet=songinset)
        # if the playlist.status is not empty, then update the status of the next song to the playlist.statu
        if song_playlist.status != '':
            next_song = SongsInSet.objects.get(number=songinset.number+1)
            next_song_playlist = Playlist.objects.get(SongsInSet=next_song)
            next_song_playlist.status = song_playlist.status
            next_song_playlist.save()

        songinset.delete()

        return Response({'success': 'Song deleted successfully'}, status=200)

        


    def get(self, req):
        set_id = req.GET.get('set_id')

        try:
            songs_in_set = SongsInSet.objects.filter(set__id=set_id).order_by('number')
        except:
            return Response({'error': 'No set id found.'})
        
        data = []
        count = 0
        for song_in_set in songs_in_set:
            song = BandSongsList.objects.get(id=song_in_set.song.id)
            count += 1
            song_data = {
                'numbering': count,
                'id': song.id,
                'number': song_in_set.number,
                'song_number': song.song_number,
                'song_name': song.song_name,
                'song_artist': song.song_artist,
                'song_year': song.song_year,
                'cortes': song.cortes,
                'song_genre': song.song_genre,
                'song_durations': song.song_durations,
                'is_locked': song_in_set.is_locked
            }
            data.append(song_data)

        return Response({'songs_in_set': data})

class ManagerPlaylistView(APIView):
    authentication_classes = []
    
    
    def post(self, req, *args, **kwargs):
        movement = req.data.get('movement')


        if movement == 'playset':
            
            if not Venue.objects.filter(is_selected=True).exists():
                return Response({'error': "Create a Venue and Start the Show first"}, status=200)
            
            data = []
            set_name = req.data.get('set_name')
            set_id = set_name.split(' ')[-1]
            set = Sets.objects.get(id=set_id)
            set_name = set.Setname
            songs_in_set = SongsInSet.objects.filter(set=set).order_by("number")

            if Playlist.objects.filter(status='now').exists():
                    current_now = Playlist.objects.get(status='now')
                    current_now.status = ""
                    current_now.save()
            if Playlist.objects.filter(status='next').exists():
                current_next = Playlist.objects.get(status='next')
                current_next.status = ""
                current_next.save()


            if songs_in_set.count() == 1:
                song1 = songs_in_set[0]         
            elif songs_in_set.count() >= 2:
                song1 = songs_in_set[0]
                song2 = songs_in_set[1]
            
            # add all the songs in the set to the playlist
            count = 1
            for song_in_set in songs_in_set:
                song_in_set.number = count
                song_in_set.save()
                count += 1
                if Playlist.objects.filter(SongsInSet=song_in_set).exists():
                    continue
                playlist = Playlist(SongsInSet=song_in_set)
                playlist.save()


            try:
                
                playlist_song1 = Playlist.objects.get(SongsInSet=song1)
                playlist_song1.status = 'now'
                playlist_song1.save()

                playlist_song2 = Playlist.objects.get(SongsInSet=song2)
                playlist_song2.status = 'next'
                playlist_song2.save()
            except:
                pass

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)('bandmember_frontend', {
                'type': 'send_playlist',
                'playlist': data,
            })

            return Response({'success': f'Playing the {set_name}' })


        if movement == 'next':
            data = []
            if Playlist.objects.filter(status='now').exists() and Playlist.objects.filter(status='next').exists():
                if not Playlist.objects.get(status='next').SongsInSet.number > Playlist.objects.all().count():
                    
                    Playlist.objects.filter(status='now').update(status='')
                    current_next = Playlist.objects.get(status='next').SongsInSet
                    Playlist.objects.filter(status='next').update(status='now')
                    if SongsInSet.objects.filter(number=current_next.number+1, set=current_next.set).exists():
                        next = SongsInSet.objects.get(number=current_next.number+1, set=current_next.set)
                        Playlist.objects.filter(SongsInSet=next).update(status='next')
                    
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)('bandmember_frontend', {
                        'type': 'send_playlist',
                        'playlist': data,
                    })
                    return Response({'success': 'Playlist updated successfully'})
        if movement == 'previous':
            data = []
            if Playlist.objects.filter(status='now').exists():
                if Playlist.objects.get(status='now').SongsInSet.number != 1:
                    Playlist.objects.filter(status='next').update(status='')
                    current_now = Playlist.objects.get(status='now').SongsInSet
                    Playlist.objects.filter(status='now').update(status='next')
                    if SongsInSet.objects.filter(number=current_now.number-1, set=current_now.set).exists():
                        previous = SongsInSet.objects.get(number=current_now.number-1, set=current_now.set)
                        Playlist.objects.filter(SongsInSet=previous).update(status='now')
                    
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)('bandmember_frontend', {
                        'type': 'send_playlist',
                        'playlist': data,
                    })
                    return Response({'success': 'Playlist updated successfully'})
        if movement == 'play':
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
                    'img': str(now_song.song_cover.url)
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
                    'img': str(next_song.song_cover.url)
                }
                data.append(next_data)
            
            
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)('customer_frontend', {
                'type': 'send_playlist',
                'playlist': data,
            })

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)('bandmember_frontend', {
                'type': 'send_playlist',
                'playlist': data,
            })

            if Playlist.objects.filter(status='now').exists():
                now = Playlist.objects.get(status='now').SongsInSet
                now_song = BandSongsList.objects.get(id=now.song.id)

                bpm = int(now_song.bpm)
                song_duration = now_song.song_durations
                song_duration = sum(x * int(t) for x, t in zip([1, 60, 3600], reversed(song_duration.split(":"))))
                # get the number of lines from lyrics
                if now_song.song_lyrics:
                    num_lines = now_song.song_lyrics.count('\n') + 1

                num_lines = num_lines / 5
                SCROLL_SPEED = 1
                LINE_DURATION = song_duration / num_lines
                BEAT_DURATION = 60 / bpm
                BEATS_PER_LINE = LINE_DURATION / BEAT_DURATION
                auto_scroll_value = BEATS_PER_LINE * SCROLL_SPEED
                bps = 60 / bpm
                print(bps)

            return Response({'success': 'Playlist updated successfully', 'bps': bps, 'Scroll': auto_scroll_value})
                

        return Response({'success': 'Playlist updated successfully'})


    def get(self, req):
        data = []

        if Playlist.objects.filter(status='now').exists():
            now = Playlist.objects.get(status='now').SongsInSet
            now_song = now.song

            if Venue.objects.filter(is_selected=True).exists():
                venue = Venue.objects.get(is_selected=True)
                if LikedBandSongsListInAllVenues.objects.filter(band_song=now_song, venue=venue).exists():
                    count = LikedBandSongsListInAllVenues.objects.filter(band_song=now_song, venue=venue).count()
                else:
                    count = 0
            
            if LikedBandSongsListInAllVenues.objects.filter(band_song=now_song).exists():
                all_venues_count = LikedBandSongsListInAllVenues.objects.filter(band_song=now_song).count()
            else:
                all_venues_count = 0
            
            now_data = {
                'id': now_song.id,
                'number': now.number,
                'song_number': now_song.song_number,
                'song_name': now_song.song_name,
                'song_artist': now_song.song_artist,
                'song_genre': now_song.song_genre,
                'song_durations': now_song.song_durations,
                'img': str(now_song.song_cover.url),
                'cortes': now_song.cortes,
                'bpm': now_song.bpm,
                'song_year': now_song.song_year,
                'count': count,
                'lyric': now_song.song_lyrics,
                'all_venues_count': all_venues_count,
            }
            data.append(now_data)
        
        if Playlist.objects.filter(status='next').exists():
            next = Playlist.objects.get(status='next').SongsInSet
            next_song = next.song
            next_data = {
                'id': next_song.id,
                'number': next.number,
                'song_number': next_song.song_number,
                'song_name': next_song.song_name,
                'song_artist': next_song.song_artist,
                'song_genre': next_song.song_genre,
                'song_durations': next_song.song_durations,
                'img': str(next_song.song_cover.url),
                'cortes': next_song.cortes,
                'bpm': next_song.bpm,
                'song_year': next_song.song_year,

            }
            data.append(next_data)
        
        if data == []:
            return Response({'success': "empty"}, status=200)
        
        return Response({'playlist': data})

class ManagerScrollShareView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, req):
        scroll = req.data.get('scroll')
        measure = req.data.get('measure')
        beat = req.data.get('beat')

        print(scroll)

        channel_layer = get_channel_layer()
        # send the data to the group
        async_to_sync(channel_layer.group_send)('bandmember_frontend', {
            'type': 'send_data',
            'scroll': scroll,
            'measure': measure,
            'beat': beat
        })

        return Response({'success': 'Scroll sent successfully'})
    

class ManagerModifyBPMView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    
    def post(self, req):

        bpm = req.data.get('bpm')
        action = req.data.get('action')

        if action == 'get':
            if Playlist.objects.filter(status='next').exists():
                now = Playlist.objects.get(status='now').SongsInSet
                now_song = BandSongsList.objects.get(id=now.song.id)
                song_duration = now_song.song_durations
                song_duration = sum(x * int(t) for x, t in zip([1, 60, 3600], reversed(song_duration.split(":"))))
                # get the number of lines from lyrics
                if now_song.song_lyrics:
                    num_lines = now_song.song_lyrics.count('\n') + 1


                num_lines = num_lines / 5
                SCROLL_SPEED = 1
                LINE_DURATION = song_duration / num_lines
                BEAT_DURATION = 60 / bpm
                BEATS_PER_LINE = LINE_DURATION / BEAT_DURATION
                auto_scroll_value = BEATS_PER_LINE * SCROLL_SPEED
                self.bps = 60 / bpm

                return Response({'success': 'BPM updated successfully', 'bps': self.bps, 'Scroll': auto_scroll_value})
    
        elif action == 'save':
            if Playlist.objects.filter(status='now').exists():
                now = Playlist.objects.get(status='now').SongsInSet
                now_song = BandSongsList.objects.get(id=now.song.id)
                now_song.bpm = bpm
                now_song.save()
            
            return Response({'success': 'BPM updated successfully', 'bpm': bpm })
            


        return Response({'success': 'BPM updated successfully'})
        

class ManagerDisplayView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):
        display = True

        return Response({'display': display})

metronome = True
class ManagerDisplayMetronomeView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):
        global metronome
        metronome = not metronome
        display = metronome

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)('bandmember_frontend', {
            'type': 'send_metronome',
            'displaymetronome': display
        })

        return Response({'displaymetronome': display})
    

class ManagerBackupView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):
        name = req.GET.get('name')
        # get the directory of the django project
        django_main_directory = str(settings.BASE_DIR)
        prev_django_dir = os.path.abspath(os.path.join(django_main_directory, os.pardir))

        # check if the db.sqlite3 file exists
        if os.path.isfile(django_main_directory + '/db.sqlite3'):
            # create a backup folder if it does not exist
            
            if not os.path.exists(os.path.join(prev_django_dir, 'JukeBox_backup')):
                os.makedirs(os.path.join(prev_django_dir, 'JukeBox_backup'))

            shutil.copyfile(django_main_directory + '/db.sqlite3', f"{os.path.join(prev_django_dir, 'JukeBox_backup')}/{name}_{datetime.now().strftime('%d-%m-%Y-%H-%M-%S')}.sqlite3")
        else:
            return Response({'error': 'No database file found.'})
        return Response({'success': 'Backup created successfully'})
        
    
    def delete(self, req):
        
        filename = req.GET.get('filename')
        
        django_main_directory = str(settings.BASE_DIR)
        prev_django_dir = os.path.abspath(os.path.join(django_main_directory, os.pardir))
        
        # check if the backup folder exists
        if(os.path.join(prev_django_dir, 'JukeBox_backup')):
            #os.system(f'rm -rf {os.path.join(prev_django_dir, 'JukeBox_backup', filename)}')
        
            return Response({'success': 'Backup deleted successfully'})
        else:
            return Response({'error': 'No backup file found.'})

class ManagerRestoreView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):
        
        django_main_directory = str(settings.BASE_DIR)
        prev_django_dir = os.path.abspath(os.path.join(django_main_directory, os.pardir))

        restore_dir = os.path.join(prev_django_dir, 'JukeBox_backup')

        if os.path.exists(os.path.join(prev_django_dir, 'JukeBox_backup')):
            # check if the backup folder has more any file in it
            if len(os.listdir(os.path.join(prev_django_dir, 'JukeBox_backup'))) > 0:
                # get all the files in the backup folder
                restore_files = os.listdir(restore_dir)
                # restore_files = os.path.join(restore_dir, os.listdir(restore_dir))
                return Response({'restore_files': restore_files})
                # shutil.copyfile(restore_file, django_main_directory + '/db.sqlite3')
            else:
                return Response({'error': 'No backup file found.'})
        else:
            return Response({'error': 'No backup file found.'})

    def post(self, req):

        file_name = req.data.get('restore_file')
        django_main_directory = str(settings.BASE_DIR)
        prev_django_dir = os.path.abspath(os.path.join(django_main_directory, os.pardir))
        restore_dir = os.path.join(prev_django_dir, 'JukeBox_backup')
        shutil.copyfile(f"{restore_dir}/{file_name}", django_main_directory + '/db.sqlite3')

        return Response({'success': 'Backup restored successfully'})

class ManagerLogsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, req):

        logs = Logs.objects.all().order_by('-date')
        data = []
        for log in logs:
            data.append({
                'id': log.id,
                'type': log.type,
                'date': datetime.strftime(log.date, '%m-%d-%Y %H:%M:%S'),
                'log': log.log,
            })
        return Response({'logs': data, 'success': 'Logs fetched successfully'})
