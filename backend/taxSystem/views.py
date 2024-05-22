from django.shortcuts import render
from django.http import HttpResponse
# from .models import Employee, TaxRecord

from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse


def home(request):
    return render(request, 'home.html')

# def tax_info(request):
#     # 查询税务信息并传递给模板
#     employees = Employee.objects.all()
#     tax_records = TaxRecord.objects.all()
#     context = {'employees': employees, 'tax_records': tax_records}
#     return render(request, 'tax_info.html', context)

# def pay_taxes(request):
#     # 支付税款逻辑，调用智能合约等
#     # 这部分逻辑需要根据具体情况实现
#     return HttpResponse("Taxes paid successfully!")


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    print(username, password)
    user = authenticate(request, username=username, password=password)

    if user is not None:
        # 登录成功，返回成功消息
        return JsonResponse({'success': True, 'message': 'Login successful!'})
    else:
        # 登录失败，返回错误消息
        return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=400)
