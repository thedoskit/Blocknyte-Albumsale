const BlocknyteSale = artifacts.require("BlocknyteSale");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("BlocknyteSale", function (accounts) {
  it("should assert true", async function () {
    await BlocknyteSale.deployed();
    return assert.isTrue(true);
  });

  it("should get the right accounts", async function () {
    const contract = await BlocknyteSale.deployed()

    const owner = await contract.owner.call()
    const charity = await contract.charity.call()

    assert.isTrue(owner == 0x75dad606C5aF0020EDC255697521402306550d33)
    assert.isTrue(charity == 0xf7ECDD70BF5532a700D39379D343d9D847ff8dc4)
  })

  it("should split the payment", async function () {
    const contract = await BlocknyteSale.deployed()

    const startBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[2]))

    const purchase = await contract.purchase.sendTransaction({
      from: accounts[8],
      value: web3.utils.toWei("0.01", "ether")
    })

    const commission = web3.utils.toBN(web3.utils.toWei("0.008", "ether"))
    const endBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[2]))

    assert.equal(
      startBalance.add(commission).toString(), 
      endBalance.toString()
    )
  })

  it("should split the payment to the charity", async function () {
    const contract = await BlocknyteSale.deployed()

    const startBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]))

    const purchase = await contract.purchase.sendTransaction({
      from: accounts[9],
      value: web3.utils.toWei("0.01", "ether")
    })

    const commission = web3.utils.toBN(web3.utils.toWei("0.002", "ether"))
    const endBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[0]))

    assert.equal(
      startBalance.add(commission).toString(), 
      endBalance.toString()
    )
  })


});
