const { expect } = require("chai");

describe("NexusStakingAdapter", function() {
    let NexusStakingAdapter;
    let owner;
    let ERC20

    beforeEach(async function() {
        NexusStakingAdapter = await ethers.getContractFactory("NexusStakingAdapter");
        [owner, ERC20] = await ethers.getSigners();
        NexusStakingAdapter = await NexusStakingAdapter.deploy();
    });

    describe("adapterType() function", function() {
        it("Should return 'Asset'", async function() {
            expect(await NexusStakingAdapter.adapterType()).to.equal("Asset");
        });
    });

    describe("tokenType() function", function() {
        it("Should return 'ERC20'", async function() {
            expect(await NexusStakingAdapter.tokenType()).to.equal("ERC20");
        });
    });

    describe("getBalance(address, address) function", function() {
        it("Initial balance check", async function() {
            expect(await NexusStakingAdapter.getBalance(ERC20.address, owner.address)).to.equal(0);
        });

        it("Balance after locking tokens", async function() {
            // Here we suppose transfer and approve function works fine and the owner has enough balance of ERC20 tokens
            await ERC20.transfer(ProtocolAdapter.address, 1000);
            await ERC20.approve(NexusStakingAdapter.address, 1000);
            
            // Here we suppose getBalance record the locked tokens correctly
            expect(await NexusStakingAdapter.getBalance(ERC20.address, owner)).to.equal(1000);
        });

        it("Balance after part of tokens got released", async function() {
            // Here we suppose getBalance records the balance accurately after some tokens got released.
            // this.stage is just a mockup function, you have to replace it with actual function released the tokens
            await this.stage(ERC20.address, owner.address, 500);
            
            expect(await NexusStakingAdapter.getBalance(ERC20.address, owner)).to.equal(500);
        });

        it("Balance after all tokens get released", async function() {
            // this.stage is just a mock up function, you have to replace it with actual function released the tokens
            await this.stage(ERC20.address, owner.address, 500);
            
            expect(await NexusStakingAdapter.getBalance(ERC20.address, owner)).to.equal(0);
        });
    });
});