from django.apps import AppConfig

class CustomerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        from app.models import CustomerRequest, Playlist, Sets
        CustomerRequest.objects.all().delete()
        Playlist.objects.all().delete()
        Sets.objects.all().delete()
