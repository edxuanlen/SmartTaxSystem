import datetime
from django.shortcuts import render
from django.http import HttpResponse
# from .models import Employee, TaxRecord

from rest_framework.decorators import api_view
from django.http import JsonResponse

from .serializers import UserSerializer

from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes,permission_classes

from . import TaxMgrContract, Web3Provider, RMBTokenContract, \
    TaxTokenContract, TaxmgrContractAddress

from taxSystem.models import PrivateKey

def submit_txn(private_key, transaction):
    # 签名交易
    signed_txn = Web3Provider.eth.account.sign_transaction(transaction, private_key)
    print("signed_txn: ", signed_txn)

    # 发送交易
    tx_hash = Web3Provider.eth.send_raw_transaction(signed_txn.rawTransaction)
    print("tx_hash: ", tx_hash)

    # 等待交易完成
    receipt = Web3Provider.eth.wait_for_transaction_receipt(tx_hash)
    print("receipt: ", receipt)

    return receipt

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_private_key(request):
    unused_query = PrivateKey.objects.filter(used=False).first()
    return JsonResponse({'pk': unused_query.private_key})


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
    PrivateKey.objects.filter(private_key = data['private_key']).update(used=True)

    # TODO(edxuanlen) 这里需要调用智能合约，将用户信息存储到区块链中
    try:
        unit_address = Web3Provider.eth.account.from_key(request.user.private_key).address
        employee_address = Web3Provider.eth.account.from_key(user.private_key).address

        # 构建交易
        nonce = Web3Provider.eth.get_transaction_count(unit_address)
        transaction = TaxMgrContract.functions.addEmployee(
            employee_address, int(user.monthly_salary)).build_transaction({
            'from': unit_address,
            'nonce': nonce,
        })
        print("transaction: ", transaction)

        submit_txn(request.user.private_key, transaction)

        txhash=TaxTokenContract.functions.approve(
            TaxmgrContractAddress, 100000000000).transact({'from': employee_address})
        Web3Provider.eth.wait_for_transaction_receipt(txhash)

        txhash=RMBTokenContract.functions.approve(
            TaxmgrContractAddress, 100000000000).transact({'from': employee_address})
        Web3Provider.eth.wait_for_transaction_receipt(txhash)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'status': 'employee created',
                         'user': UserSerializer(user).data})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_unit(request):
    if request.user.user_type != User.UserType.ADMIN:
        return JsonResponse({'error': 'Only ADMIN can create units.'}, status=403)
    data = request.data

    user = User.objects.create_user(
        username=data['username'],
        private_key=data['private_key'],
        user_type=User.UserType.UNIT,
        created_by=request.user,
        password='1234m,./',
        monthly_salary=0,
    )
    PrivateKey.objects.filter(private_key = data['private_key']).update(used=True)

    # TODO(edxuanlen) 这里需要调用智能合约，将用户信息存储到区块链中
     # 获取账户
    admin_pk = request.user.private_key

    try:
        admin_address =  Web3Provider.eth.account.from_key(admin_pk).address
        unit_address = Web3Provider.eth.account.from_key(user.private_key).address

        # 构建交易
        nonce = Web3Provider.eth.get_transaction_count(admin_address)
        transaction = TaxMgrContract.functions.addUnit(unit_address).build_transaction({
            'from': admin_address,
            'nonce': nonce,
        })
        print("transaction: ", transaction)

        submit_txn(admin_pk, transaction)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)

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


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_salary_info(request):
    try:
        # 获取当前用户
        user = request.user
         # 获取账户
        account =  Web3Provider.eth.account.from_key(user.private_key)
        print("Account: ", account)

        # 获取最新区块
        latest_block = Web3Provider.eth.block_number

        # 定义事件过滤器，假设事件名为TaxCalculated
        event_filter = TaxMgrContract.events.TaxCalculated.create_filter(
            fromBlock=0,  # 可调整为特定区块范围
            toBlock=latest_block,
            argument_filters={'employeeAddress': account.address}
        )

        # 获取事件日志
        events = event_filter.get_all_entries()

        salary_infos = []

        for event in events:
            dt = datetime.datetime.fromtimestamp(
            Web3Provider.eth.get_block(event.blockNumber).timestamp)
            date = dt.strftime('%Y-%m-%d %H:%M:%S')

            print("Event: ", event)
            print("employee address:", event['args']['employeeAddress'])
            print("taxAmount:", event['args']['taxAmount'])
            print("netSalary:", event['args']['netSalary'])
            print()

            salary_infos.append({
                'date': date,
                'monthly_salary': user.monthly_salary,
                'tax_amount': event['args']['taxAmount'],
                'net_salary': event['args']['netSalary'],
            })

            return JsonResponse({'salary_infos': salary_infos})

    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def settle_tax(request):
    try:
        account =  Web3Provider.eth.account.from_key(request.user.private_key)

        nonce = Web3Provider.eth.get_transaction_count(account.address)
        transaction = TaxMgrContract.functions.settleTaxes().build_transaction({
            'from': account.address,
            'nonce': nonce,
        })
        print("transaction: ", transaction)

        res = submit_txn(request.user.private_key, transaction)
        print(res)
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'success': True})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_tax_amount_due(request):
    try:
        account =  Web3Provider.eth.account.from_key(request.user.private_key)
        res = TaxMgrContract.functions.getTaxes().call({"from": account.address})
        return JsonResponse({'tax_amount_due': res})
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def pay_tax(request):
    private_key = request.user.private_key
    account =  Web3Provider.eth.account.from_key(private_key)
    amount = request.data['tax_amount_due']

    # 构建交易
    try:
        txhash=RMBTokenContract.functions.approve(
            TaxmgrContractAddress, amount).transact({'from': account.address})
        Web3Provider.eth.wait_for_transaction_receipt(txhash)
        txhash=TaxTokenContract.functions.approve(
            TaxmgrContractAddress, amount).transact({'from': account.address})
        Web3Provider.eth.wait_for_transaction_receipt(txhash)

        nonce = Web3Provider.eth.get_transaction_count(account.address)
        transaction = TaxMgrContract.functions.payTaxes(
            account.address, amount).build_transaction({
            'from': account.address,
            'nonce': nonce,
        })
        print("transaction: ", transaction)

        submit_txn(private_key, transaction)
    except Exception as e:
        print("err:", e)
        return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'success': True})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def tax_records(request):
    datas = []

    account =  Web3Provider.eth.account.from_key(request.user.private_key)
    print("Account: ", account.address)

    # 获取最新区块
    latest_block = Web3Provider.eth.block_number

    # 定义事件过滤器，假设事件名为TaxCalculated
    event_filter = TaxMgrContract.events.TaxPayment.create_filter(
        fromBlock=0,  # 可调整为特定区块范围
        toBlock=latest_block,
        argument_filters={'unitAddress': account.address}
    )

    # 获取事件日志
    events = event_filter.get_all_entries()

    for event in events:
        dt = datetime.datetime.fromtimestamp(
            Web3Provider.eth.get_block(event.blockNumber).timestamp)
        date = dt.strftime('%Y-%m-%d %H:%M:%S')
        print()

        datas.append({
            "unit_address": event['args']['unitAddress'],
            "total_tax_due": event['args']['totalTaxDue'],
            "tax_amount": event['args']['taxAmount'],
            "date": date,
        })

    return JsonResponse({'data': datas})

from .models import TaxRecords

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_tax_records(request):

    user = request.user

    try:
        for data in request.data:
            TaxRecords.objects.update_or_create(
                user=user,
                remaining_tax=data['total_tax_due'],
                payment_amount=data['tax_amount'],
                payment_date=data['date']
            )

        return JsonResponse({'success': True})
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def units_tax_record(request):

    records = []
    record_set = TaxRecords.objects.all()

    for record in record_set:
        records.append({
            "record_id": record.id,
            "unit_name" : record.user.username,
            "total_tax_due": record.remaining_tax,
            "payment_amount": record.payment_amount,
            "payment_date": record.payment_date,
            "submit_time": record.date_submit,
            "audit_status": record.audit_status,
            "approve_status": record.approve_status,
        })
    return JsonResponse({'success': True, 'records': records})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def audit_record(request):

    print("audit_record:", request.data)

    try:
        record_query = TaxRecords.objects.get(id=request.data['record_id'])

        # 审核unit
        account =  Web3Provider.eth.account.from_key(record_query.user.private_key)

        # 获取最新区块
        latest_block = Web3Provider.eth.block_number

        # 定义事件过滤器，假设事件名为TaxCalculated
        event_filter = TaxMgrContract.events.TaxPayment.create_filter(
            fromBlock=0,  # 可调整为特定区块范围
            toBlock=latest_block,
            argument_filters={'unitAddress': account.address}
        )

        # 获取事件日志
        events = event_filter.get_all_entries()

        for event in events:
            dt = datetime.datetime.fromtimestamp(
                Web3Provider.eth.get_block(event.blockNumber).timestamp)
            date = dt.strftime('%Y-%m-%d %H:%M:%S')
            if (date == record_query.payment_date.strftime("%Y-%m-%d %H:%M:%S")):
                print("MATCH !!!")
                record_query.audit_status = 1

        # 没查到，则设置为-1
        if record_query.audit_status != 1:
            record_query.audit_status = -1

        # TODO(edxuanlen): 是否要详细到每个人...
        record_query.save()

        record = {
                "record_id": record_query.id,
                "unit_name" : record_query.user.username,
                "total_tax_due": record_query.remaining_tax,
                "payment_amount": record_query.payment_amount,
                "payment_date": record_query.payment_date,
                "submit_time": record_query.date_submit,
                "audit_status": record_query.audit_status,
                "approve_status": record_query.approve_status
            }

        return JsonResponse({'success': True, 'record': record})
    except Exception as e:
        print(e)
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def audit_approve(request):

    record_query = TaxRecords.objects.get(id=request.data['record_id'])
    record_query.approve_status = 1

    record_query.save()

    record = {
                "record_id": record_query.id,
                "unit_name" : record_query.user.username,
                "total_tax_due": record_query.remaining_tax,
                "payment_amount": record_query.payment_amount,
                "payment_date": record_query.payment_date,
                "submit_time": record_query.date_submit,
                "audit_status": record_query.audit_status,
                "approve_status": record_query.approve_status
            }


    return JsonResponse({'success': True, 'record': record})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def audit_reject(request):

    record_query = TaxRecords.objects.get(id=request.data['record_id'])
    record_query.approve_status = -1

    record_query.save()

    record = {
                "record_id": record_query.id,
                "unit_name" : record_query.user.username,
                "total_tax_due": record_query.remaining_tax,
                "payment_amount": record_query.payment_amount,
                "payment_date": record_query.payment_date,
                "submit_time": record_query.date_submit,
                "audit_status": record_query.audit_status,
                "approve_status": record_query.approve_status
            }

    return JsonResponse({'success': True, 'record': record})
