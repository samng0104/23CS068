const { expect } = require("chai");

describe("Simple Storage", function() {
  let simpleStorage;
  let owner;

  beforeEach(async function() {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    [owner] = await ethers.getSigners();
    simpleStorage = await SimpleStorage.deploy();
  });

  describe("updateData", function() {
    it("should update data state variable correctly", async function() {
      await simpleStorage.updateData(10);
      expect(await simpleStorage.readData()).to.equal(10);
    });

    it("should store the latest value", async function() {
      await simpleStorage.updateData(20);
      expect(await simpleStorage.readData()).to.equal(20);
    });

    it("should update value even if the new number is 0", async function() {
      await simpleStorage.updateData(0);
      expect(await simpleStorage.readData()).to.equal(0);
    });

    it("should update value even if the value is the same as the last one", async function() {
      await simpleStorage.updateData(20);
      await simpleStorage.updateData(20);
      expect(await simpleStorage.readData()).to.equal(20);
    });
  });

  describe("readData", function() {
    it("should return the correct data", async function() {
      await simpleStorage.updateData(10);
      expect(await simpleStorage.readData()).to.equal(10);
    });

    it("should return 0 if data is not set", async function() {
      expect(await simpleStorage.readData()).to.equal(0);
    });
  });
});