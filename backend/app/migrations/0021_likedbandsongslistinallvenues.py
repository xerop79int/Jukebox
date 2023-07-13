# Generated by Django 4.2.2 on 2023-07-13 18:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0020_songsinset_is_locked'),
    ]

    operations = [
        migrations.CreateModel(
            name='LikedBandSongsListInAllVenues',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('liked', models.BooleanField(default=False)),
                ('band_song', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.bandsongslist')),
                ('venue', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.venue')),
            ],
        ),
    ]
