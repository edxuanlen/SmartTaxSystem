from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = CustomUser
        fields = ['private_key', 'username', 'user_type', 'date_joined', 'monthly_salary']
