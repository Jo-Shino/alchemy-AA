// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Example {
  uint public x;

  event XChanged (uint);

    function change(uint _x) external {
      x = _x;
      emit XChanged(_x);
    }
}
