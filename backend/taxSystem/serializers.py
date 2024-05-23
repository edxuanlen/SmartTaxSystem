from rest_framework import serializers
from .models import CustomUser, Salary

class UserSerializer(serializers.ModelSerializer):
    date_joined = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = CustomUser
        fields = ['private_key', 'username', 'user_type', 'date_joined', 'monthly_salary']

class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = ['salary_date', 'gross_salary', 'net_salary', 'tax_amount']
