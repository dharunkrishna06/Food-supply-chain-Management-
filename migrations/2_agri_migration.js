const Agri = artifacts.require("agriFoodSupplyChain");

module.exports = function (deployer) {
  deployer.deploy(Agri);
};
