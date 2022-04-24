const AgriContractSeller = artifacts.require("./agriFoodSupplyChain.sol");

before( async function() {
    afsc = await AgriContractSeller.deployed();
});


contract("AgriContractSeller", (accounts) => {

    let seller1    = accounts[0];
    let seller2 = accounts[1];
    let seller3 = accounts[2];

    it("...test must success for sellerSignUp()", async () => {
        await afsc.sellerSignUp("Ajay", {from: seller1});
        let sellerDetails = await afsc.getSellerDetails.call();
        assert.equal(sellerDetails[0], "Ajay", "seller name is not same as expected");
        assert.equal(sellerDetails[1], seller1, "seller address is not same as expected");
        assert.equal(sellerDetails[2], true, "seller created is not same as expected");
    });

    it("...test must succes for multiple sellerSignUp()", async () => {
``
        await afsc.sellerSignUp("Aj", {from: seller2});
        let seller2Detail = await afsc.getSellerDetails.call({from: seller2});
        assert.equal(seller2Detail[0], "Aj", "seller name is not same as expected");
        assert.equal(seller2Detail[1], seller2, "seller address is not same as expected");
        assert.equal(seller2Detail[2], true, "seller created is not same as expected");

        await afsc.sellerSignUp("Maayon", {from: seller3});
        let seller3Detail = await afsc.getSellerDetails.call({from: seller3});
        assert.equal(seller3Detail[0], "Maayon", "seller name is not same as expected");
        assert.equal(seller3Detail[1], seller3, "seller address is not same as expected");
        assert.equal(seller3Detail[2], true, "seller created is not same as expected");

    });

    it("...test must return error for sellerSignUp()  when seller is already registered as seller", async () => {
        let err = null

        try{
            await afsc.sellerSignUp("Aj", {from: seller1});
            let seller1Detail = await afsc.getSellerDetails.call({from: seller1});
            assert.equal(seller1Detail[0], "Aj", "seller name is not same as expected");
            assert.equal(seller1Detail[1], seller1, "seller address is not same as expected");
            assert.equal(seller1Detail[2], true, "seller created is not same as expected");

            await afsc.sellerSignUp("Maayon", {from: seller2});
            let seller2Detail = await afsc.getSellerDetails.call({from: seller2});
            assert.equal(seller2Detail[0], "Maayon", "seller name is not same as expected");
            assert.equal(seller2Detail[1], seller2, "seller address is not same as expected");
            assert.equal(seller2Detail[2], true, "seller created is not same as expected");

            await afsc.sellerSignUp("Aju", {from: seller3});
            let seller3Detail = await afsc.getSellerDetails.call({from: seller3});
            assert.equal(seller3Detail[0], "Aju", "seller name is not same as expected");
            assert.equal(seller3Detail[1], seller3, "seller address is not same as expected");
            assert.equal(seller3Detail[2], true, "seller created is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert You are Already Registered as seller -- Reason given: You are Already Registered as seller.', 'Error fails with unexpected error message')
    });

});