# Generated by Django 5.1.3 on 2024-11-20 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='date_of_birth',
            field=models.DateField(blank=True, null=True),
        ),
    ]
