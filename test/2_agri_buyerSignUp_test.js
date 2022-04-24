const AgriContractBuyer = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractBuyer", (accounts) => {

    let buyer1 = accounts[6];
    let buyer2 = accounts[7];
    let buyer3 = accounts[8];
    let buyer4 = accounts[9];


    it("...test must success for buyerSignUp()", async () => {
        await afsc.buyerSignUp("Ajay", "Ajay Address", {from: buyer1});
        let buyerDetails = await afsc.getBuyerDetails.call({from: buyer1});
        assert.equal(buyerDetails[0], "Ajay", "buyer name is not same as expected");
        assert.equal(buyerDetails[1], buyer1, "buyer address is not same as expected");
        assert.equal(buyerDetails[2], "Ajay Address", "buyer physical address is not same as expected");
        assert.equal(buyerDetails[3], true, "buyer created is not same as expected");
    });

    it("...test must succes for multiple buyerSignUp()", async () => {

        await afsc.buyerSignUp("Aj","Aj Address", {from: buyer2});
        let buyer2Details = await afsc.getBuyerDetails.call({from: buyer2});
        assert.equal(buyer2Details[0], "Aj", "buyer name is not same as expected");
        assert.equal(buyer2Details[1], buyer2, "buyer address is not same as expected");
        assert.equal(buyer2Details[2], "Aj Address", "buyer physical address is not same as expected");
        assert.equal(buyer2Details[3], true, "buyer created is not same as expected");

        await afsc.buyerSignUp("Maayon", "Maayon Address",  {from: buyer3});
        let buyer3Details = await afsc.getBuyerDetails.call({from: buyer3});
        assert.equal(buyer3Details[0], "Maayon", "buyer name is not same as expected");
        assert.equal(buyer3Details[1], buyer3, "buyer address is not same as expected");
        assert.equal(buyer3Details[2], "Maayon Address", "buyer physical address is not same as expected");
        assert.equal(buyer3Details[3], true, "buyer created is not same as expected");

    });

    it("...test must return error for buyerSignUp() when buyer is already registered as buyer", async () => {
        let err = null

        try{

            await afsc.buyerSignUp("Aj","Aj Address", {from: buyer2});
            let buyer2Details = await afsc.getBuyerDetails.call({from: buyer2});
            assert.equal(buyer2Details[0], "Aj", "buyer name is not same as expected");
            assert.equal(buyer2Details[1], buyer2, "buyer address is not same as expected");
            assert.equal(buyer2Details[2], "Aj Address", "buyer physical address is not same as expected");
            assert.equal(buyer2Details[3], true, "buyer created is not same as expected");

            await afsc.buyerSignUp("Maayon", "Maayon Address",  {from: buyer3});
            let buyer3Details = await afsc.getBuyerDetails.call({from: buyer3});
            assert.equal(buyer3Details[0], "Maayon", "buyer name is not same as expected");
            assert.equal(buyer3Details[1], buyer3, "buyer address is not same as expected");
            assert.equal(buyer3Details[2], "Maayon Address", "buyer physical address is not same as expected");
            assert.equal(buyer3Details[3], true, "buyer created is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert You are Already Registered as buyer -- Reason given: You are Already Registered as buyer.', 'Error fails with unexpected error message')
    });


    it("...test must return error for buyerSignUp() when buyer is already registered as seller", async () => {
        let err = null

        try{

            await afsc.sellerSignUp("Aju", {from: buyer4});
            await afsc.buyerSignUp("Aju","Aju Address", {from: buyer4});
            let buyer4Details = await afsc.getBuyerDetails.call({from: buyer4});
            assert.equal(buyer4Details[0], "Aju", "buyer name is not same as expected");
            assert.equal(buyer4Details[1], buyer4, "buyer address is not same as expected");
            assert.equal(buyer4Details[2], "Aju Address", "buyer physical address is not same as expected");
            assert.equal(buyer4Details[3], true, "buyer created is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert You are Already Registered as seller -- Reason given: You are Already Registered as seller.', 'Error fails with unexpected error message')
    });

});