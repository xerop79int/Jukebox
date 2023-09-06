from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Customer)
admin.site.register(BandLeader)
admin.site.register(BandMember)
admin.site.register(CustomerRequest)
admin.site.register(BandSongsList)
admin.site.register(LikedBandSongsList)
admin.site.register(SongsSet)
admin.site.register(Sets)
admin.site.register(Venue)
admin.site.register(LikedBandSongsListInAllVenues)


@admin.register(SongsInSet)
class SongsInSet(admin.ModelAdmin):
    ordering = ['number']

@admin.register(Playlist)
class Playlist(admin.ModelAdmin):
    ordering = ['SongsInSet__number']