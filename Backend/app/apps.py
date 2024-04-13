from django.apps import AppConfig

class CustomerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        from app.models import CustomerRequest, Playlist, Show, Venue
        CustomerRequest.objects.all().delete()
        Playlist.objects.all().delete()
        if Show.objects.filter(is_selected=True).exists():
            show = Show.objects.get(is_selected=True)
            show.is_selected = False
            show.save()
        if Venue.objects.filter(is_selected=True).exists():
            venue = Venue.objects.get(is_selected=True)
            venue.is_selected = False
            venue.save()
        # Sets.objects.all().delete()
