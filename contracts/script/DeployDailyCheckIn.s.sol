// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DeployDailyCheckIn is Script {
    function run() external returns (DailyCheckIn) {
        vm.startBroadcast();
        DailyCheckIn deployed = new DailyCheckIn();
        vm.stopBroadcast();
        return deployed;
    }
}
