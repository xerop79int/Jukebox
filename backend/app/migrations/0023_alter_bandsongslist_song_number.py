# Generated by Django 4.2.5 on 2023-10-05 17:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0022_venue_is_selected'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bandsongslist',
            name='song_number',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]