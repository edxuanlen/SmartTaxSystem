"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from xml.etree.ElementInclude import include
from django.contrib import admin
from django.urls import path
from taxSystem.views import current_user, create_employee, update_salary, \
    get_employees, get_salary_info, get_tax_amount_due, pay_tax, \
    create_unit, settle_tax, tax_records, upload_tax_records, salary_history, \
    units_tax_record, audit_record, audit_approve, audit_reject, get_private_key
from rest_framework.authtoken.views import obtain_auth_token

# router = DefaultRouter()
# router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/login/', obtain_auth_token, name='login'),
    path('api/current_user/', current_user, name='current-user'),

    path('api/private_key/', get_private_key, name='gen-private-key'),
    path('api/create_unit/', create_unit, name='create-unit'),
    path('api/create_employee/', create_employee, name='create-employee'),
    path('api/update_salary/', update_salary, name='update-salary'),
    path('api/salary-history/', salary_history, name='salary-history'),

    path('api/employees/', get_employees, name='get-employees'),
    path('api/salary_info/', get_salary_info, name='salary-info'),

    path('api/tax/settle/', settle_tax, name='settle-tax'),
    path('api/tax/amount_due/', get_tax_amount_due, name='amount-due'),
    path('api/tax/pay/', pay_tax, name='pay-tax'),
    path('api/tax/records/', tax_records, name='tax-records'),
    path('api/tax/upload_records/', upload_tax_records, name='upload-tax-records'),
    path('api/tax/unit_records/', units_tax_record, name='units-tax-record'),
    path('api/tax/audit/', audit_record, name='audit-record'),
    path('api/tax/approve/', audit_approve, name='audit-approve'),
    path('api/tax/reject/', audit_reject, name='audit-reject'),


    # path('api-auth/', include('rest_framework.urls')),
    # path('', views.home, name='home'),
    # path('tax_info/', views.tax_info, name='tax_info'),
    # path('pay_taxes/', views.pay_taxes, name='pay_taxes'),
]
