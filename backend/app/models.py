from django.db import models
from django.conf import settings


class Customer(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
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

class CustomerRequest(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    song_name = models.CharField(max_length=200)
    song_artist = models.CharField(max_length=200)
    song_genre = models.CharField(max_length=200)
    song_dedicated_to = models.CharField(max_length=200, null=True, blank=True)
    request_denied = models.BooleanField(default=False)
    request_denied_reason = models.CharField(max_length=200, null=True, blank=True)  


    def __str__(self):
        return self.customer.name + ' - ' + self.song_name


class BandSongsList(models.Model):
    band_leader = models.ForeignKey(BandLeader, on_delete=models.CASCADE)
    song_name = models.CharField(max_length=200)
    song_artist = models.CharField(max_length=200)
    song_genre = models.CharField(max_length=200)
    song_durations = models.CharField(max_length=200)

    def __str__(self):
        return self.band_leader.name + ' - ' + self.song_name
