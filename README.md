
## 需求拆解
用户： 能够查阅工资明细、税前工资、税后工资
所在单位： 上传税务信息，查看个人基本信息，处理税款支付，上传员工纳税信息
纳税机关税务管理员： 纳税人信息管理，税务审批和处理，税务监督和稽查

1. 前后端架构
    主要用 django + react 前后端分离
    税务相关的逻辑用 kanache 部署合约
    个人信息，税务信息流水 等存储到 SQLite

2. 合约相关设计
    a. 定义税务规则
        需要定义税务规则，包括税率、税种、征收对象、征收时间。
    b. 税务产生
        每个员工都在合约上有一个对应的账号，并且有月薪信息，根据定义的税务规则产生税务
    c. 税务的计算和分配
        单位账号会计算所有所属员工的账号的税务，统计后发送给税务机关单位。
    d. 税务监督和稽查
        由于有历史交易区块，合约可以检查是否有异常的税务行为

3. 数据库落库
    a. 用户和单位纳税信息管理
        存储用户的工资明细，税前工资、税后工资等
    c. 纳税机关税务管理
        各个单位的纳税记录，以及区块信息，方便追溯对应的区块记录


```
用户/单位/管理员 (React)
       |
       v
   [Django API]
       |  \
       |   \ Web3.py
       |    \
       v     v
[SQLite3] [智能合约]
              |
              v
          [Kanache]
```


交互说明：
用户/单位/管理员：通过React前端界面进行操作，如查看信息、提交数据等。
React -> Django API：前端通过HTTP请求与后端通信，请求数据处理或业务逻辑执行。
Django -> SQLite3：后端负责读写数据库，进行数据持久化操作。
Django -> 智能合约：后端通过Web3.py与部署在Kanache的智能合约交互，如请求税务数据、发送执行命令等。
智能合约 -> Kanache：智能合约部署在Kanache，执行区块链操作。

开发流程：
前端开发：使用React开发，包括用户登录、信息展示、数据提交等功能。 0.7 d
后端开发：使用Django开发API接口，处理前端请求，管理数据库，与智能合约交互。 1 d
智能合约开发：使用Solidity编写合约，使用Kanache进行本地测试。 0.8 d
整合测试：将前端、后端、智能合约整合，进行全流程的测试。 0.5 d



## 项目初始化

### 前端开发
+ React：
    + 创建React项目 (npx create-react-app fronent)。
    + 设置路由结构（使用 react-router-dom），包括用户登录、工资明细查看、税务信息提交等页面。
    + 开发组件，如登录表单、工资明细表、税务信息提交表单等。
    + 使用 axios 或 fetch 实现与Django API的通信。

### 后端开发
+ Django：
    + pip3 install django
    + 创建Django项目和应用 (django-admin startproject backend 和 python manage.py startapp core)。
    + 设置数据库连接，初期使用SQLite (settings.py)。
    + 定义模型，如用户(User)、单位(Unit)、工资明细(SalaryDetail)、税务信息(TaxInfo)等。
    + 开发API接口，使用Django REST Framework (DRF)。
    + 实现认证和权限管理，使用JWT（如 djangorestframework-simplejwt）。

### 智能合约开发
+ Solidity：
    + 使用Solidity编写智能合约，包括税务规则、税务产生、税务计算和分配等功能。
    + 使用Forge + Kanache部署智能合约。




## 项目运行


### 启动EVM节点部署合约

```bash
forge install
```

在两个终端中执行

```bash

anvil

forge script ./script/TaxManagement.s.sol --broadcast --rpc-url http://127.0.0.1:8545 --sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 启动 Django 后台服务

```bash
cd backend
pip3 install -r requirements.txt

python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py init_pk

# 创建Admin
# private_key = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
python3 manage.py createsuperuser

python3 manager.py runserver
```


### 启动 React 前端服务

```bash
cd frontend
npm install .
npm run start
```
