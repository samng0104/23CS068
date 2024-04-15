const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Lock contract", function () {
    let Lock, lock, owner, addr1;
    const unlockTime = Math.floor(Date.now() / 1000) + 30; // 30 seconds from the current time

    beforeEach(async function () {
        Lock = await ethers.getContractFactory("Lock");
        [owner, addr1] = await ethers.getSigners();
        lock = await Lock.deploy(unlockTime, {value: ethers.utils.parseEther("1")});
    });

    describe("Constructor", function () {

        it("Should set correct owner", async function () {
            expect(await lock.owner()).to.equal(owner.address);
        });

        it("Should set correct unlock time", async function () {
            expect(await lock.unlockTime()).to.equal(unlockTime);
        });
    });

    describe("withdraw function", function () {

        it("Should only allow owner to withdraw", async function () {
            await ethers.provider.send("evm_increaseTime", [31]); // Increase time to unlock
            await expect(lock.connect(addr1).withdraw()).to.be.revertedWith("You aren't the owner");
        });

        it("Should not allow to withdraw before unlock time", async function () {
            await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
        });

        it("Should allow to withdraw after unlock time and emit correct event", async function () {
            await ethers.provider.send("evm_increaseTime", [31]); // Increase time to unlock
            await expect(lock.withdraw())
                .to.emit(lock, 'Withdrawal')
                .withArgs(ethers.utils.parseEther("1"), await ethers.provider.getBlockNumber());
            });
    });
});