const { expect } = require("chai");

describe("EY", function () {
  let EY;
  let owner;
  let addr1;
  let addr2;
  let initialSupply;

  beforeEach(async function () {
    const EYToken = await ethers.getContractFactory("EY");
    [owner, addr1, addr2] = await ethers.getSigners();

    initialSupply = 10000;

    EY = await EYToken.deploy(initialSupply, "EYToken", 1, "EY");
  });

  describe("totalSupply function", function () {
    it("Should return the correct initial supply", async function () {
      expect(await EY.totalSupply()).to.equal(initialSupply);
    });
  });

  describe("balanceOf function", function () {
    it("Should return the correct initial balance of owner", async function () {
      expect(await EY.balanceOf(owner.address)).to.equal(initialSupply);
    });
  });

  describe("transfer function", function () {
    it("Should transfer the correct amount of tokens", async function () {
      await EY.transfer(addr1.address, 500);
      expect(await EY.balanceOf(addr1.address)).to.equal(500);
      expect(await EY.balanceOf(owner.address)).to.equal(initialSupply - 500);
    });

    it("Should fail if sender doesnât have enough tokens", async function () {
      const promise = EY.connect(addr1).transfer(addr2.address, 1);
      await expect(promise).to.be.rejected;
    });
    
    it("Checking the actual token transfer", async function () {
      await EY.transfer(addr1.address, 300);
      await EY.transfer(addr1.address, 200);
      expect(await EY.balanceOf(addr1.address)).to.equal(500);
    });
  });

  describe("approve and allowance functions", function () {
    it("Approve and check allowance", async function () {
      await EY.approve(addr1.address, 500);
      expect(await EY.allowance(owner.address, addr1.address)).to.equal(500);
    });
    
    it("Changes the spender's allowance", async function () {
      await EY.approve(addr1.address, 100);
      await EY.approve(addr1.address, 200);
      expect(await EY.allowance(owner.address, addr1.address)).to.equal(200);
    });
  });

  describe("transferFrom function", function () {
    it("Transfer from an approved account", async function () {
      await EY.approve(addr1.address, 500);
      await EY.connect(addr1).transferFrom(owner.address, addr2.address, 100);
      expect(await EY.balanceOf(addr2.address)).to.equal(100);
      expect(await EY.allowance(owner.address, addr1.address)).to.equal(400);
    });

    it("Should fail if trying to transfer more than allowed", async function () {
      await EY.approve(addr1.address, 50);
      const promise = EY.connect(addr1).transferFrom(owner.address, addr2.address, 100);
      await expect(promise).to.be.rejected;
    });
  });

});