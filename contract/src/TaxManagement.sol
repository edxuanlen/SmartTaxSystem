// src/TaxManagement.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Tokens.sol";

contract TaxManagement {
    address public admin;
    RMBToken public rmbToken;
    TaxToken public taxToken;


    struct Employee {
        address employeeAddress;
        uint256 monthlySalary;
        address unitAddress;
    }

    struct Unit {
        address unitAddress;
        string unitName;
        address[] employees;
        uint256 totalTaxDue;
    }

    struct TaxInfo {
        uint256 taxAmount;
        uint256 netSalary;
    }

    struct TaxBracket {
        uint256 upperBound;
        uint256 taxRate;
    }

    TaxBracket[] public taxBrackets;

    mapping(address => Unit) public units;
    mapping(address => Employee) public employees;
    mapping(address => TaxInfo) public taxInfos;

    event EmployeeAdded(address indexed unitAddress, address indexed employeeAddress, uint256 monthlySalary);
    event UnitAdded(address indexed unitAddress, string unitName);
    event TaxCalculated(address indexed employeeAddress, uint256 taxAmount, uint256 netSalary);
    event TaxSettlement(address indexed unitAddress, uint256 totalTaxDue);
    event TaxPayment(address indexed unitAddress, uint256 taxAmount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyUnit() {
        require(units[msg.sender].unitAddress != address(0), "Only registered units can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
        rmbToken = new RMBToken();
        taxToken = new TaxToken();

        // 初始化税率
        taxBrackets.push(TaxBracket(0, 0));
        taxBrackets.push(TaxBracket(1500, 3));
        taxBrackets.push(TaxBracket(4500, 10));
        taxBrackets.push(TaxBracket(9000, 20));
        taxBrackets.push(TaxBracket(35000, 25));
        taxBrackets.push(TaxBracket(55000, 30));
        taxBrackets.push(TaxBracket(80000, 35));
        taxBrackets.push(TaxBracket(type(uint256).max, 45));
    }

    function addUnit(address _unitAddress, string memory _unitName) public onlyAdmin {
        require(units[_unitAddress].unitAddress == address(0), "Unit already exists");
        units[_unitAddress] = Unit(_unitAddress, _unitName, new address[](0), 0);
        rmbToken.mint(_unitAddress, 100000 * 10**18); // Mint 100,000 RMB Token
        emit UnitAdded(_unitAddress, _unitName);
    }

    function addEmployee(address _employeeAddress, uint256 _monthlySalary) public onlyUnit {
        require(employees[_employeeAddress].employeeAddress == address(0), "Employee already exists");
        employees[_employeeAddress] = Employee(_employeeAddress, _monthlySalary, msg.sender);
        units[msg.sender].employees.push(_employeeAddress);
        emit EmployeeAdded(msg.sender, _employeeAddress, _monthlySalary);
    }

    function calculateTax(uint256 income) public view returns (uint256 taxDue) {
        uint256 taxableIncome = income > 3500 ? income - 3500 : 0;
        if (taxableIncome == 0) return 0;

        for (uint256 i = 1; i < taxBrackets.length; i++) {
            if (taxableIncome > taxBrackets[i].upperBound) {
                taxDue += (taxBrackets[i].upperBound - taxBrackets[i-1].upperBound) * taxBrackets[i].taxRate / 100;
            } else {
                taxDue += (taxableIncome - taxBrackets[i-1].upperBound) * taxBrackets[i].taxRate / 100;
                break;
            }
        }
        return taxDue;
    }

    function calculateTaxForEmployee(address _employeeAddress) public onlyUnit {
        Employee storage employee = employees[_employeeAddress];
        require(employee.employeeAddress != address(0), "Employee not found");

        uint256 grossSalary = employee.monthlySalary;
        uint256 taxAmount = calculateTax(grossSalary);
        uint256 netSalary = grossSalary - taxAmount;

        taxInfos[_employeeAddress] = TaxInfo(taxAmount, netSalary);
        taxToken.mint(msg.sender, taxAmount); // Mint Tax Token to the unit

        emit TaxCalculated(_employeeAddress, taxAmount, netSalary);
    }

    function settleTaxes() public onlyUnit {
        Unit storage unit = units[msg.sender];
        uint256 totalTaxDue = 0;

        for (uint256 i = 0; i < unit.employees.length; i++) {
            address employeeAddress = unit.employees[i];
            calculateTaxForEmployee(employeeAddress);
            totalTaxDue += taxInfos[employeeAddress].taxAmount;
        }

        unit.totalTaxDue = totalTaxDue;
        emit TaxSettlement(msg.sender, totalTaxDue);
    }

    function payTaxes(address payer, uint256 rmbAmount, uint256 taxAmount) public onlyUnit {
        Unit storage unit = units[msg.sender];
        require(unit.totalTaxDue > 0, "No taxes due for this unit");

        // 调用 RMB Token 合约的 transferFrom 函数，将 RMB Token 转账给 admin
        rmbToken.transferFrom(payer, admin, rmbAmount);

        // 调用 Tax Token 合约的 transferFrom 函数，将 Tax Token 转账给 admin
        taxToken.transferFrom(payer, admin, taxAmount);

        // 清空税款
        unit.totalTaxDue = 0;

        emit TaxPayment(msg.sender, unit.totalTaxDue);
    }

}