const BlocknyteSale = artifacts.require("BlocknyteSale");

module.exports = function (deployer) {
  deployer.deploy(BlocknyteSale);
};
