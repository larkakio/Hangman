// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DailyCheckIn — once-per-calendar-day check-in on Base (gas only, no fee).
/// @dev lastCheckInDay stores epoch day + 1 so zero means "never checked in".
contract DailyCheckIn {
    event CheckedIn(address indexed user, uint256 dayIndex, uint256 streak);

    mapping(address => uint256) public lastCheckInDay;
    mapping(address => uint256) public streak;

    function currentDay() public view returns (uint256) {
        return block.timestamp / 1 days;
    }

    function canCheckIn(address user) external view returns (bool) {
        uint256 stored = lastCheckInDay[user];
        if (stored == 0) return true;
        return stored - 1 < currentDay();
    }

    function checkIn() external payable {
        require(msg.value == 0, "DailyCheckIn: no ETH accepted");

        uint256 day = currentDay();
        uint256 stored = lastCheckInDay[msg.sender];
        require(stored == 0 || stored - 1 < day, "DailyCheckIn: already checked in today");

        uint256 prevDay = stored == 0 ? type(uint256).max : stored - 1;
        uint256 newStreak = prevDay == day - 1 ? streak[msg.sender] + 1 : 1;

        streak[msg.sender] = newStreak;
        lastCheckInDay[msg.sender] = day + 1;

        emit CheckedIn(msg.sender, day, newStreak);
    }
}
