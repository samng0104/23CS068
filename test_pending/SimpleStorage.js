const { expect } = require("chai");

describe("SimpleStorage", function () {

  let simpleStorage;
  let owner;

  beforeEach(async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    [owner] = await ethers.getSigners();
    simpleStorage = await SimpleStorage.deploy(); 
  });

  describe("updateData function", function () {

    it("Should set data correctly", async function () {
      await simpleStorage.updateData(10);
      expect(await simpleStorage.readData()).to.equal(10);
    });

    it("Should update data correctly", async function () {
      await simpleStorage.updateData(20);
      expect(await simpleStorage.readData()).to.equal(20);
    });

    it("Data should remain the same if not updated", async function () {
      expect(await simpleStorage.readData()).to.equal(0);
    });

    it("Can update data multiple times", async function () {
      await simpleStorage.updateData(30);
      expect(await simpleStorage.readData()).to.equal(30);
      await simpleStorage.updateData(40);
      expect(await simpleStorage.readData()).to.equal(40);
    });

    it("Does not allow negative number", async function () {
      await expect(simpleStorage.updateData(-1)).to.be.reverted;
    });

  });

  describe("readData function", function () {

    it("Should return 0 when no data has been set", async function () {
      expect(await simpleStorage.readData()).to.equal(0);
    });

    it("Should return correct data after it has been updated", async function () {
      await simpleStorage.updateData(50);
      expect(await simpleStorage.readData()).to.equal(50);
    });

  });

});