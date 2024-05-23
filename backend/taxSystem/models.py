from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from datetime import datetime
# Create your models here.

# class Employee(models.Model):
#     name = models.CharField(max_length=100)
#     salary = models.DecimalField(max_digits=10, decimal_places=2)
#     # 其他字段...

# class TaxRecord(models.Model):
#     employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
#     pre_tax_salary = models.DecimalField(max_digits=10, decimal_places=2)
#     post_tax_salary = models.DecimalField(max_digits=10, decimal_places=2)
#     # 其他字段...

class CustomUserManager(BaseUserManager):
    def create_user(self, private_key, username, user_type, monthly_salary=None,
                    created_by=None, password=None, **extra_fields):
        if not private_key:
            raise ValueError('The private_key field must be set')
        private_key = private_key
        user = self.model(private_key=private_key,
                          user_type=user_type,
                          created_by=created_by,
                          monthly_salary=monthly_salary,
                          username=username,
                          **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, private_key, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        user_type = 'admin'

        return self.create_user(private_key, username, user_type, password=password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    class UserType(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        UNIT = 'unit', _('Unit')
        EMPLOYEE = 'employee', _('Employee')

    username = models.CharField(max_length=150, unique=True)
    private_key = models.CharField(max_length=128, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(default=datetime.now, blank=True)
    monthly_salary = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = CustomUserManager()

    user_type = models.CharField(max_length=10, choices=UserType.choices,
                                 default=UserType.EMPLOYEE)
    created_by = models.ForeignKey('self', null=True, blank=True,
                                   on_delete=models.SET_NULL,
                                   related_name='created_users')


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['private_key']

    def __str__(self):
        return self.private_key


from django.conf import settings

class Salary(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    salary_date = models.DateField()
    gross_salary = models.DecimalField(max_digits=10, decimal_places=2)
    net_salary = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.user.username} - {self.salary_date}"
