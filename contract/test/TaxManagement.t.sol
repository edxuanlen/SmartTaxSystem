// test/TaxManagementTest.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/Tokens.sol";
import "../src/TaxManagement.sol";
import {console} from "forge-std/console.sol";

contract TaxManagementTest is Test {
    TaxManagement public taxManagement;
    RMBToken public rmbToken;
    TaxToken public taxToken;

    address public admin = address(msg.sender);
    address public unit = address(0x2);
    address public employee = address(0x3);

    function setUp() public {
        vm.startPrank(admin);

        taxManagement = new TaxManagement();
        // rmbToken = taxManagement.getRMBToken();
        // taxToken = taxManagement.getTaxToken();
        vm.stopPrank();
    }

    function testAddUnit() public {
        vm.startPrank(admin);
        taxManagement.addUnit(unit, "Test Unit");
        (address unitAddress, string memory unitName, uint256 totalTaxDue) = taxManagement.units(unit);
        assertEq(unitAddress, unit);
        assertEq(unitName, "Test Unit");
        assertEq(totalTaxDue, 0);
        // assertEq(rmbToken.balanceOf(unit), 100000 * 10**18);
        vm.stopPrank();
    }

    function testAddEmployee() public {
        vm.startPrank(admin);
        taxManagement.addUnit(unit, "Test Unit");
        vm.stopPrank();

        vm.startPrank(unit);
        taxManagement.addEmployee(employee, 10000);
        (address employeeAddress, uint256 monthlySalary, address unitAddress) = taxManagement.employees(employee);
        assertEq(employeeAddress, employee);
        assertEq(monthlySalary, 10000);
        assertEq(unitAddress, unit);
        vm.stopPrank();
    }

    function testCalculateTax() public view {
        uint256 income = 10000;
        uint256 tax = taxManagement.calculateTax(income);
        income -= 3500;
        uint256 expectedTax = (1500 * 3 / 100) + ((4500 - 1500) * 10 / 100) + ((income - 4500) * 20 / 100);
        assertEq(tax, expectedTax);
    }

    function testCalculateTaxForEmployee() public {
        vm.startPrank(admin);
        taxManagement.addUnit(unit, "Test Unit");
        vm.stopPrank();

        vm.startPrank(unit);
        taxManagement.addEmployee(employee, 10000);
        taxManagement.calculateTaxForEmployee(employee);
        vm.stopPrank();

        TaxManagement.TaxInfo memory taxInfo = taxManagement.getEmployeeTaxInfo(employee);
        uint256 income = 10000-3500;
        uint256 expectedTax = (1500 * 3 / 100) + ((4500 - 1500) * 10 / 100) + ((income - 4500) * 20 / 100);
        uint256 expectedNetSalary = 10000 - expectedTax;
        assertEq(taxInfo.taxAmount, expectedTax);
        assertEq(taxInfo.netSalary, expectedNetSalary);
    }

    function testSettleTaxes() public {
        vm.startPrank(admin);
        taxManagement.addUnit(unit, "Test Unit");
        vm.stopPrank();

        vm.startPrank(unit);
        taxManagement.addEmployee(employee, 10000);
        taxManagement.settleTaxes();
        vm.stopPrank();

        (, , uint256 totalTaxDue) = taxManagement.units(unit);
        uint256 expectedTax = (1500 * 3 / 100) + ((4500 - 1500) * 10 / 100) +  ((10000 - 3500 - 4500) * 20 / 100);
        assertEq(totalTaxDue, expectedTax);
    }

    function testPayTaxes() public {
        vm.startPrank(admin);
        taxManagement.addUnit(unit, "Test Unit");
        vm.stopPrank();

        vm.startPrank(unit);
        taxManagement.addEmployee(employee, 10000);
        taxManagement.settleTaxes();
        (, , uint256 totalTaxDue) = taxManagement.units(unit);

        // rmbToken.approve(admin, totalTaxDue);
        // rmbToken.approve(unit, totalTaxDue);
        // rmbToken.approve(msg.sender, totalTaxDue);
        // rmbToken.approve(unit, totalTaxDue);
        taxManagement.payTaxes();
        vm.stopPrank();

        // assertEq(rmbToken.balanceOf(admin), totalTaxDue);
        // assertEq(taxToken.balanceOf(admin), totalTaxDue);
        (, , uint256 newTotalTaxDue) = taxManagement.units(unit);
        assertEq(newTotalTaxDue, 0);
    }


}
