const { expect } = require("chai");

describe("SimpleStorage", function () {

  let simpleStorage;
  let owner;
  const initial_value = 10;
  const updated_value = 20;
  const final_value = 30;

  beforeEach(async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    [owner] = await ethers.getSigners();
    simpleStorage = await SimpleStorage.deploy();
  });

  describe("updateData function", function () {

    it("Should set data correctly", async function () {
      await simpleStorage.updateData(initial_value);
      expect(await simpleStorage.readData()).to.equal(initial_value);
    });

    it("Should update data correctly", async function () {
      await simpleStorage.updateData(initial_value);
      await simpleStorage.updateData(updated_value);
      expect(await simpleStorage.readData()).to.equal(updated_value);
    });

    it("Data should remain the same if not updated", async function () {
      await simpleStorage.updateData(initial_value);
      expect(await simpleStorage.readData()).to.equal(initial_value);
    });

    it("Data can be changeable multiple times", async function () {
      await simpleStorage.updateData(initial_value);
      await simpleStorage.updateData(updated_value);
      await simpleStorage.updateData(final_value);
      expect(await simpleStorage.readData()).to.equal(final_value);
    });

  });

  describe("readData function", function () {

    it("Should return correct data after it has been updated", async function () {
      await simpleStorage.updateData(initial_value);
      expect(await simpleStorage.readData()).to.equal(initial_value);
    });

  });
});