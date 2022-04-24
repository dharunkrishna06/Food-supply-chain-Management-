const AgriContractCancelOrder = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractCancelOrder", (accounts) => {

    let buyer1     = accounts[6];
    let seller1    = accounts[3];
    let buyerUnknown = accounts[10];

    it("...test must success for cancelOrder() by buyer", async () => {

        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.buyerSignUp("Maayon", "Maayon Address", {from: buyer1});

        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1});
        await afsc.buyProduct("test productId_1", {from: buyer1, value:3000000000000000000});

        await afsc.cancelOrder("test productId_1", 1, {from: buyer1});

        let buyerProductDetails = await afsc.buyerOrderDetails.call(0, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 1, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment will Be Refunded", "product shipment details is not same as expected");

    });

    it("...test must success for multiple cancelOrder() under same buyer", async () => {

        await afsc.addProduct("test productId_2", "test productName", "test category", 2, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_2", {from: buyer1, value:6000000000000000000})

        await afsc.cancelOrder("test productId_2", 2, {from: buyer1});

        let buyerProductDetails = await afsc.buyerOrderDetails.call(1, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_2", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 2, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment will Be Refunded", "product shipment details is not same as expected");

        await afsc.addProduct("test productId_3", "test productName", "test category", 3, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_3", {from: buyer1, value:9000000000000000000})
        
        await afsc.cancelOrder("test productId_3", 3, {from: buyer1});

        buyerProductDetails = await afsc.buyerOrderDetails.call(2, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment will Be Refunded", "product shipment details is not same as expected");

    });

    it("...test must return error for cancelOrder() when unknown buyer access it", async () => {
        
        let err = null

        try{

            await afsc.addProduct("test productId_4", "test productName", "test category", 4, 3, "test description", {from: seller1})
            await afsc.buyProduct("test productId_4", {from: buyer1, value:12000000000000000000})

            await afsc.cancelOrder("test productId_4", 4, {from: buyerUnknown});

            buyerProductDetails = await afsc.buyerOrderDetails.call(3, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_4", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 4, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment will Be Refunded", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }
        assert.equal(err , 'Error: The send transactions "from" field must be defined! -- Reason given: You are not Authorized to This Product PurchaseId.', 'Error fails with unexpected error message')
    });

});