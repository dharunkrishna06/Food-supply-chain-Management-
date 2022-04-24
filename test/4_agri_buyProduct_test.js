const AgriContractBuyProduct = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractBuyProduct", (accounts) => {

    let buyer1     = accounts[6];
    let seller1    = accounts[3];
    let buyerUnknown = accounts[5];

    it("...test must success for buyProduct() by buyer", async () => {
        
        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.buyerSignUp("Maayon", "Maayon Address", {from: buyer1});

        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1});
        await afsc.buyProduct("test productId_1", {from: buyer1, value:3000000000000000000});

        let buyerProductDetails = await afsc.buyerOrderDetails.call(0, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 1, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

    });

    it("...test must success for multiple buyProduct() under same buyer", async () => {
        
        await afsc.addProduct("test productId_2", "test productName", "test category", 2, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_2", {from: buyer1, value:6000000000000000000})

        let buyerProductDetails = await afsc.buyerOrderDetails.call(1, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_2", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 2, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

        await afsc.addProduct("test productId_3", "test productName", "test category", 3, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_3", {from: buyer1, value:9000000000000000000})

        buyerProductDetails = await afsc.buyerOrderDetails.call(2, {from: buyer1});

        assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
        assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
        assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
        assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

    });

    it("...test must return error for buyProduct() when buyer buy sold product", async () => {
        let err = null

        try{

            await afsc.buyProduct("test productId_3", {from: buyer1, value:9000000000000000000})

            buyerProductDetails = await afsc.buyerOrderDetails.call(2, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_3", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Product is InActive -- Reason given: Product is InActive.', 'Error fails with unexpected error message')
    });

    it("...test must return error for buyProduct() when buyer is unknown", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_4", "test productName", "test category", 4, 3, "test description", {from: seller1})

            await afsc.buyProduct("test productId_4", {from: buyerUnknown, value:12000000000000000000});

            buyerProductDetails = await afsc.buyerOrderDetails.call(3, {from: buyerUnknown});

            assert.equal(buyerProductDetails[0], "test productId_4", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 4, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }
        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert You Must Be Registered as Buyer to Buy the product -- Reason given: You Must Be Registered as Buyer to Buy the product.', 'Error fails with unexpected error message')
    });


    it("...test must return error for buyProduct() when buyer tries to buy product with less amount", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_5", "test productName", "test category", 4, 3, "test description", {from: seller1})

            await afsc.buyProduct("test productId_5", {from: buyer1, value:10000000000000000000})

            buyerProductDetails = await afsc.buyerOrderDetails.call(3, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_5", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Ether Value Must be Equal to Price of Product -- Reason given: Ether Value Must be Equal to Price of Product.', 'Error fails with unexpected error message')
    });


    it("...test must return error for buyProduct() when buyer tries to buy invalid product", async () => {
        let err = null

        try{

            await afsc.buyProduct("test productId_6", {from: buyer1, value:10000000000000000000})

            buyerProductDetails = await afsc.buyerOrderDetails.call(3, {from: buyer1});

            assert.equal(buyerProductDetails[0], "test productId_5", "product Id is not same as expected");
            assert.equal(buyerProductDetails[1], "Order Placed With Seller", "product order status is not same as expected");
            assert.equal(buyerProductDetails[2], 3, "product purchase Id is not same as expected");
            assert.equal(buyerProductDetails[3], "", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Product is InActive -- Reason given: Product is InActive.', 'Error fails with unexpected error message')
    });

});