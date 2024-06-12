// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ExternalContract {
    uint public unlockTime;
    address payable public owner;

    address user;
    uint256 amount;
    uint256 fee;

    uint public storedValue;

    event Withdrawal(uint amount, uint when);

    constructor() payable {
    
        owner = payable(msg.sender);
    }

    // function withdraw() public {
    //     // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
    //     // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

    //     require(block.timestamp >= unlockTime, "You can't withdraw yet");
    //     require(msg.sender == owner, "You aren't the owner");

    //     emit Withdrawal(address(this).balance, block.timestamp);

    //     owner.transfer(address(this).balance);
    // }

    receive() external payable {}


    function setValue(uint _value) external payable {
        storedValue = _value;
    }

    function withdraw(address payable _user, uint256 _amount) public{
        _user.transfer(_amount);
    }
}
