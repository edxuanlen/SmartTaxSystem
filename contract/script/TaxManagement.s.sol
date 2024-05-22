// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/TaxManagement.sol";
import "../src/Tokens.sol";

contract DeployScript is Script {
    function run() public {
        vm.startBroadcast();

        RMBToken rmbToken = new RMBToken();

        TaxToken taxToken = new TaxToken();

        TaxManagement taxManagement = new TaxManagement();
        vm.stopBroadcast();

        console.log("Deployed RMBToken contract at:", address(rmbToken));
        console.log("Deployed TaxToken contract at:", address(taxToken));
        console.log("Deployed TaxManagement contract at:", address(taxManagement));
        console.log("Deployed MsgSender: ", msg.sender);
    }
}
