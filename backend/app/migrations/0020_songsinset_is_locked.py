# Generated by Django 4.2.2 on 2023-07-11 06:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0019_remove_bandsongslist_song_pdf'),
    ]

    operations = [
        migrations.AddField(
            model_name='songsinset',
            name='is_locked',
            field=models.BooleanField(default=False),
        ),
    ]
