from django.shortcuts import render
from django.http import HttpResponse
# from .models import Employee, TaxRecord

from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.http import JsonResponse

from .serializers import UserSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.decorators import authentication_classes,permission_classes


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


# @api_view(['POST'])
# def login_view(request):
#     username = request.data.get('username')
#     password = request.data.get('password')
#     print(username, password)
#     user = authenticate(request, username=username, password=password)
#     print(user)

#     if user is not None:
#         token, _ = Token.objects.get_or_create(user=user)
#         # 登录成功，返回成功消息
#         return JsonResponse({'success': True,
#                              'message': 'Login successful!',
#                              'token': token.key})
#     else:
#         # 登录失败，返回错误消息
#         return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=400)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    print("current_user:", request.user)
    serializer = UserSerializer(request.user)
    return JsonResponse({'user': serializer.data})


from django.contrib.auth import get_user_model
User = get_user_model()

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_employee(request):

    if request.user.user_type != User.UserType.UNIT:
        return JsonResponse({'error': 'Only units can create employees.'}, status=403)
    data = request.data

    user = User.objects.create_user(
        username=data['username'],
        private_key=data['private_key'],
        user_type=User.UserType.EMPLOYEE,
        created_by=request.user,
        monthly_salary=data['monthly_salary'],
        password='1234m,./'
    )

    # TODO(edxuanlen) 这里需要调用智能合约，将用户信息存储到区块链中

    return JsonResponse({'status': 'employee created',
                         'user': UserSerializer(user).data})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_employees(request):
    try:
        employees = User.objects.filter(created_by=request.user)

        return JsonResponse({'employees': UserSerializer(employees, many=True).data})
    except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


from .models import Salary
from .serializers import SalarySerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_salary_info(request):
    try:
        # 获取当前用户
        user = request.user

        # 从区块链获取薪酬记录
        salary_records = get_salary_records_from_blockchain(user.private_key)

        # 更新数据库
        for record in salary_records:
            Salary.objects.update_or_create(
                user=user,
                salary_date=record['salary_date'],
                defaults={
                    'gross_salary': record['gross_salary'],
                    'net_salary': record['net_salary'],
                    'tax_amount': record['tax_amount']
                }
            )

        # 获取用户的所有薪酬记录
        salaries = Salary.objects.filter(user=user)
        serializer = SalarySerializer(salaries, many=True)
        return JsonResponse({'salaries': serializer.data}, safe=False)

    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)

from . import TaxMgrContract, Web3Provider

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_tax_amount_due(request):
    try:
        account =  Web3Provider.eth.account.from_key(request.user.private_key)
        res = TaxMgrContract.functions.getTaxes().call({"from": account.address})
        # print("taxes: ", res)
        return JsonResponse({'tax_amount_due': res})
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def pay_tax(request):
    return JsonResponse({'success': True})

