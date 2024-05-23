// src/RMBToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {console} from "forge-std/console.sol";


contract RMBToken is ERC20 {
    address public admin;

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    constructor() ERC20("RMB Token", "RMB") {
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == admin, "Only admin can mint RMB tokens.");

        _mint(to, amount);
    }
}


contract TaxToken is ERC20 {
    address public admin;

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    constructor() ERC20("Tax Token", "TAX") {
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == admin, "Only admin can mint Tax tokens");
        _mint(to, amount);
    }
}
