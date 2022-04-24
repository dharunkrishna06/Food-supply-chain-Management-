const AgriContractRefundToBuyer = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractRefundToBuyer", (accounts) => {

    let buyer1     = accounts[6];
    let seller1    = accounts[3];
    let buyerUnknown = accounts[10];

    it("...test must success for refundToBuyer() by seller", async () => {

        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.buyerSignUp("Maayon", "Maayon Address", {from: buyer1});

        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1});
        await afsc.buyProduct("test productId_1", {from: buyer1, value:3000000000000000000});

        await afsc.cancelOrder("test productId_1", 1, {from: buyer1});

        await afsc.refundToBuyer("test productId_1", 1, {from: seller1, value:3000000000000000000})

        let buyerProductDetails = await afsc.buyerOrderDetails.call(0, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 1, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment Refunded", "product shipment details is not same as expected");

    });

    it("...test must success for multiple refundToBuyer() under same seller", async () => {
 
        await afsc.addProduct("test productId_2", "test productName", "test category", 2, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_2", {from: buyer1, value:6000000000000000000})

        await afsc.cancelOrder("test productId_2", 2, {from: buyer1});

        await afsc.refundToBuyer("test productId_2", 2, {from: seller1, value:6000000000000000000})

        let buyerProductDetails = await afsc.buyerOrderDetails.call(1, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_2", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 2, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment Refunded", "product shipment details is not same as expected");

        await afsc.addProduct("test productId_3", "test productName", "test category", 3, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_3", {from: buyer1, value:9000000000000000000})

        await afsc.cancelOrder("test productId_3", 3, {from: buyer1});

        await afsc.refundToBuyer("test productId_3", 3, {from: seller1, value:9000000000000000000})

        buyerProductDetails = await afsc.buyerOrderDetails.call(2, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment Refunded", "product shipment details is not same as expected");

    });

    it("...test must return error for refundToBuyer() when buyer access it", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_4", "test productName", "test category", 4, 3, "test description", {from: seller1})
            await afsc.buyProduct("test productId_4", {from: buyer1, value:12000000000000000000})

            await afsc.cancelOrder("test productId_4", 4, {from: buyer1});

            await afsc.refundToBuyer("test productId_4", 4, {from: buyer1, value:12000000000000000000})

            buyerProductDetails = await afsc.buyerOrderDetails.call(3, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_4", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 4, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment Refunded", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Only seller can able to make refund -- Reason given: Only seller can able to make refund.', 'Error fails with unexpected error message')
    });

    it("...test must return error for refundToBuyer() when order is not canceled", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_5", "test productName", "test category", 5, 3, "test description", {from: seller1})
            await afsc.buyProduct("test productId_5", {from: buyer1, value:15000000000000000000})

            await afsc.refundToBuyer("test productId_5", 5, {from: seller1, value:15000000000000000000})

            buyerProductDetails = await afsc.buyerOrderDetails.call(4, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_5", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 5, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment Refunded", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Order is either Active or not yet Cancelled -- Reason given: Order is either Active or not yet Cancelled.', 'Error fails with unexpected error message')
    });

    it("...test must return error for refundToBuyer() when seller refund less amount", async () => {
       
        let err = null

        try{

            await afsc.addProduct("test productId_6", "test productName", "test category", 6, 3, "test description", {from: seller1})
            await afsc.buyProduct("test productId_6", {from: buyer1, value:18000000000000000000})

            await afsc.cancelOrder("test productId_6", 6, {from: buyer1});

            await afsc.refundToBuyer("test productId_6", 6, {from: seller1, value:10000000000000000000})

            buyerProductDetails = await afsc.buyerOrderDetails.call(5, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_6", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 6, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "Order Canceled By Buyer, Payment Refunded", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Value Must be Equal to Product Price -- Reason given: Value Must be Equal to Product Price.', 'Error fails with unexpected error message')
    });



});