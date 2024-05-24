# Generated by Django 5.0.6 on 2024-05-24 07:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taxSystem', '0008_alter_taxrecords_payment_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxrecords',
            name='has_approved',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='taxrecords',
            name='has_audit',
            field=models.BooleanField(default=False),
        ),
    ]
