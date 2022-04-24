const AgriContractUpdateShipmentDetails = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractUpdateShipmentDetails", (accounts) => {

    let buyer1     = accounts[6];
    let seller1    = accounts[3];

    it("...test must success for updateShipmentDetails() by seller", async () => {
        
        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.buyerSignUp("Maayon", "Maayon Address", {from: buyer1});

        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1});
        await afsc.buyProduct("test productId_1", {from: buyer1, value:3000000000000000000});

        await afsc.updateShipmentDetails(1, "out for delivery", {from: seller1})

        let buyerProductDetails = await afsc.buyerOrderDetails.call(0, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 1, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "out for delivery", "product shipment details is not same as expected");

    });

    it("...test must success for multiple updateShipmentDetails() by seller", async () => {
        
        await afsc.addProduct("test productId_2", "test productName", "test category", 2, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_2", {from: buyer1, value:6000000000000000000})

        await afsc.updateShipmentDetails(2, "out for delivery", {from: seller1})

        let buyerProductDetails = await afsc.buyerOrderDetails.call(1, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_2", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 2, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "out for delivery", "product shipment details is not same as expected");

        await afsc.addProduct("test productId_3", "test productName", "test category", 3, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_3", {from: buyer1, value:9000000000000000000})

        await afsc.updateShipmentDetails(3, "out for delivery", {from: seller1})

        buyerProductDetails = await afsc.buyerOrderDetails.call(2, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "out for delivery", "product shipment details is not same as expected");

    });

    it("...test must return error for updateShipment() for unsold product", async () => {
        let err = null

        try{

            await afsc.updateShipmentDetails(4, "out for delivery", {from: seller1})

            buyerProductDetails = await afsc.buyerOrderDetails.call(3, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "out of delivery", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Order is either inActive or cancelled -- Reason given: Order is either inActive or cancelled.', 'Error fails with unexpected error message')
    });


    it("...test must return error for updateShipment() when buyer access it", async () => {
        let err = null

        try{

            await afsc.updateShipmentDetails(3, "canceled order", {from: buyer1})

            buyerProductDetails = await afsc.buyerOrderDetails.call(2, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "canceled order", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Only seller can able to update shipment details -- Reason given: Only seller can able to update shipment details.', 'Error fails with unexpected error message')
    });


});