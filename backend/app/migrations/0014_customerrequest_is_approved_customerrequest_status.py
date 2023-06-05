# Generated by Django 4.2 on 2023-06-05 19:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_showstatus'),
    ]

    operations = [
        migrations.AddField(
            model_name='customerrequest',
            name='is_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='customerrequest',
            name='status',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]