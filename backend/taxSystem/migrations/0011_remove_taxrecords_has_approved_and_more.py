# Generated by Django 5.0.6 on 2024-05-24 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('taxSystem', '0010_remove_taxrecords_has_audit_taxrecords_audit_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taxrecords',
            name='has_approved',
        ),
        migrations.AddField(
            model_name='taxrecords',
            name='approve_status',
            field=models.IntegerField(default=0),
        ),
    ]