# accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('private_key', 'username', 'user_type', 'monthly_salary', 'created_by', 'is_staff', 'is_active',)
    list_filter = ('user_type', 'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('private_key', 'username', 'password', 'user_type', 'monthly_salary', 'created_by')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('private_key', 'username', 'password1', 'password2',
                       'user_type', 'monthly_salary', 'created_by', 'is_staff', 'is_active')}
        ),
    )
    search_fields = ('private_key', 'username',)
    ordering = ('username',)

admin.site.register(CustomUser, CustomUserAdmin)
