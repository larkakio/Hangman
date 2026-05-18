// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {DailyCheckIn} from "../src/DailyCheckIn.sol";

contract DailyCheckInTest is Test {
    DailyCheckIn checkIn;
    address user = makeAddr("user");

    function setUp() public {
        checkIn = new DailyCheckIn();
        vm.warp(2 days);
    }

    function test_checkIn_sets_streak() public {
        vm.prank(user);
        checkIn.checkIn();

        assertEq(checkIn.streak(user), 1);
        assertFalse(checkIn.canCheckIn(user));
    }

    function test_revert_same_day() public {
        vm.startPrank(user);
        checkIn.checkIn();
        vm.expectRevert("DailyCheckIn: already checked in today");
        checkIn.checkIn();
        vm.stopPrank();
    }

    function test_revert_with_eth() public {
        vm.deal(user, 1 ether);
        vm.prank(user);
        vm.expectRevert("DailyCheckIn: no ETH accepted");
        checkIn.checkIn{value: 0.01 ether}();
    }

    function test_streak_increments_next_day() public {
        vm.prank(user);
        checkIn.checkIn();
        assertEq(checkIn.streak(user), 1);

        vm.warp(block.timestamp + 1 days);
        vm.prank(user);
        checkIn.checkIn();
        assertEq(checkIn.streak(user), 2);
    }

    function test_streak_resets_after_gap() public {
        vm.prank(user);
        checkIn.checkIn();

        vm.warp(block.timestamp + 2 days);
        vm.prank(user);
        checkIn.checkIn();
        assertEq(checkIn.streak(user), 1);
    }
}
