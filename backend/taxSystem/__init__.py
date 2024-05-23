import json
from web3 import Web3

endpoint_uri="http://127.0.0.1:8545"
# 获取部署的合约地址
# 打开并读取JSON文件
with open('../contract/broadcast/TaxManagement.s.sol/31337/run-latest.json', 'r') as file:
    data = json.load(file)

# 遍历交易记录并查找 contractName 为 RMBToken 的交易
for transaction in data['transactions']:
    contract_name = transaction.get('contractName')
    contract_address = Web3.to_checksum_address(transaction.get('contractAddress'))
    if contract_name == 'TaxManagement':
        taxmgr_contract_address = contract_address


print("TaxManagement contract address: ", taxmgr_contract_address)


# 配置 web3 contract 实例

with open('../contract/out/ERC20.sol/ERC20.json', 'r') as f:
    erc20_json = json.load(f)
    erc20_abi = erc20_json['abi']

with open('../contract/out/TaxManagement.sol/TaxManagement.json', 'r') as f:
    taxmgr_json = json.load(f)
    taxmgr_abi = taxmgr_json['abi']

Web3Provider = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))


TaxMgrContract = Web3Provider.eth.contract(address=taxmgr_contract_address, abi=taxmgr_abi)

rmbtk_contract_address = TaxMgrContract.functions.getRMBTokenAddress().call()
taxtk_contract_address = TaxMgrContract.functions.getTaxTokenAddress().call()


print("RMBToken contract address: ", rmbtk_contract_address)
print("TaxToken contract address: ", taxtk_contract_address)

RMBTokenContract = Web3Provider.eth.contract(address=rmbtk_contract_address, abi=erc20_abi)
TaxTokenContract = Web3Provider.eth.contract(address=taxtk_contract_address, abi=erc20_abi)
