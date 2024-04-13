const { ethers } = require('hardhat');
const { expect } = require('chai');

describe("Lock Contract", function () {
  let lock;
  let owner, addr1;
  let addr1Balance;

  before(async () => {
    const [deployer, account1] = await ethers.getSigners();
    owner = deployer;
    addr1 = account1;
    addr1Balance = await addr1.getBalance();

    const Lock = await ethers.getContractFactory("Lock");
    lock = await Lock.deploy(addr1Balance.add(ethers.utils.parseEther('1')));
  });

  it("The owner should be set correctly", async () => {
    expect(await lock.owner()).to.equal(owner.address);
  });

  it("The unlockTime should be set correctly", async () => {
    expect(await lock.unlockTime()).to.equal(addr1Balance.add(ethers.utils.parseEther('1')));
  });

  it("Attempt to withdraw before time should fail", async () => {
    await expect(lock.connect(owner).withdraw())
           .to.be.revertedWith("You can't withdraw yet");
  });

  it("Attempt to withdraw by non-owner should fail", async () => {
    const currentBlockTime = (await ethers.provider.getBlock('latest')).timestamp;
    // Fast-forward to after unlockTime
    await ethers.provider.send("evm_increaseTime", [currentBlockTime + 86400]);
    await ethers.provider.send("evm_mine");
    await expect(lock.connect(addr1).withdraw())
           .to.be.revertedWith("You aren't the owner");
  });

  it("Owner should be able to withdraw after unlockTime", async () => {
    const ownerBalanceBefore = await owner.getBalance();
    await expect(() => lock.connect(owner).withdraw())
           .to.changeEtherBalance(lock, -ownerBalanceBefore);
  });
});