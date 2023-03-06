// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BlocknyteSales
 * @dev This contract implements a simple sale mechanism for a limited amount of sales.
 */
contract BlocknyteSale {
  uint256 public totalSales; // The total number of sales made.
  uint256 public maxSales; // The maximum number of sales that can be made.

  address public owner; // The owner of the contract.
  address public charity; // The charity to which a portion of the sale proceeds will be sent.

  mapping (address => bool) public hasPurchased; // A mapping of addresses to their purchase status.

  /**
   * @dev Initializes the contract with an initial number of totalSales, maxSales, the owner's address, and the charity's address.
   */
  constructor() {
    totalSales = 0;
    maxSales = 100;

    owner = msg.sender;
    charity = 0xf7ECDD70BF5532a700D39379D343d9D847ff8dc4;
  }

  /**
   * @dev Checks if a purchase can be made, i.e., totalSales is less than maxSales.
   */
  function canPurchase() public view returns (bool) {
    return totalSales < maxSales;
  }

  /**
   * @dev Checks if the caller has already purchased the item.
   */
  function hasAccess() public view returns (bool) {
    return hasPurchased[msg.sender];
  }

  /**
   * @dev Allows the caller to make a purchase if certain conditions are met.
   * The caller must not have already purchased the item, and the contract must not have reached the maximum number of sales.
   * A portion of the sale proceeds are transferred to the charity, and the rest is transferred to the contract owner.
   * The purchase status for the caller's address is updated, and the total number of sales is incremented.
   */
  function purchase() public payable returns (bool) {
    require(canPurchase() == true, "Maximum sales limit reached");
    require(msg.value == 0.01 ether, "Incorrect amount sent");
    require(!hasAccess(), "Item already purchased");

    //uint256 amountToOwner = ;
    //uint256 amountToCharity =;

    payable(owner).transfer(msg.value * 80 / 100);
    payable(charity).transfer( msg.value * 20 / 100);

    totalSales += 1;

    hasPurchased[msg.sender] = true;

    return true;
  }
}
