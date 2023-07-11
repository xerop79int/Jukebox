from django.db import models
from django.conf import settings


class Venue(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    # user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name

class BandLeader(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    isactive = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class BandMember(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    isactive = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class BandSongsList(models.Model):
    band_leader = models.ForeignKey(BandLeader, on_delete=models.CASCADE)
    song_number = models.CharField(max_length=200, null=True, blank=True)
    song_name = models.CharField(max_length=200, null=True, blank=True)
    song_artist = models.CharField(max_length=200, null=True, blank=True)
    song_genre = models.CharField(max_length=200, null=True, blank=True)
    song_durations = models.CharField(max_length=200, null=True, blank=True)
    song_year = models.CharField(max_length=200, null=True, blank=True)
    song_cover = models.ImageField(upload_to='band_covers', default='default.jpeg', null=True, blank=True)
    cortes = models.CharField(max_length=200, null=True, blank=True)
    bpm = models.CharField(max_length=200, null=True, blank=True)
    song_lyrics = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.band_leader.name + ' - ' + self.song_name

class CustomerRequest(models.Model):
    customer_name = models.CharField(max_length=200, null=True, blank=True) 
    song = models.ForeignKey(BandSongsList, on_delete=models.CASCADE)
    song_decicated_to = models.CharField(max_length=200, null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    status = models.CharField(max_length=200, null=True, blank=True)


    def __str__(self):
        return self.customer_name + ' - ' + self.song.song_name

class SongsSet(models.Model):
    band_leader = models.ForeignKey(BandLeader, on_delete=models.CASCADE)
    song = models.ForeignKey(BandSongsList, on_delete=models.CASCADE)

    def __str__(self):
        return self.band_leader.name + ' - ' + self.song.song_name

class LikedBandSongsList(models.Model):
    # customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    band_song = models.ForeignKey(BandSongsList, on_delete=models.CASCADE)
    liked = models.BooleanField(default=False)

    def __str__(self):
        return self.band_song.song_name
    
class Sets(models.Model):
    Setname = models.CharField(max_length=200)

    def __str__(self):
        return self.Setname

class SongsInSet(models.Model):
    number = models.IntegerField(null=True, blank=True)
    song = models.ForeignKey(BandSongsList, on_delete=models.CASCADE)
    set = models.ForeignKey(Sets, on_delete=models.CASCADE)
    is_locked = models.BooleanField(default=False)

    def __str__(self):
        return str(self.number) + ' - ' + self.song.song_name + ' - ' + self.set.Setname
    
class Playlist(models.Model):
    SongsInSet = models.ForeignKey(SongsInSet, on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.SongsInSet.number) + ' - ' + self.SongsInSet.song.song_name + ' - ' + self.SongsInSet.set.Setname

class ShowStatus(models.Model):
    has_show_started = models.BooleanField(default=False)
