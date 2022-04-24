const AgriContractGetOrderPlacedAfterUpdate = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractGetOrderPlacedAfterUpdate", (accounts) => {

    let buyer1     = accounts[6];
    let seller1    = accounts[3];

    it("...test must success for getOrderPlaced() by seller", async () => {
        
        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.buyerSignUp("Maayon", "Maayon Address", {from: buyer1});

        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1});
        await afsc.buyProduct("test productId_1", {from: buyer1, value:3000000000000000000});

        await afsc.updateShipmentDetails(1, "out for delivery", {from: seller1})

        let sellerOrderPlacedDetails = await afsc.getOrdersPlaced.call(0, {from: seller1});

        assert.equal(sellerOrderPlacedDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(sellerOrderPlacedDetails[1], 1, "product purchase Id is not same as expected");
        assert.equal(sellerOrderPlacedDetails[2], buyer1, "product ordered by is not same as expected");
        assert.equal(sellerOrderPlacedDetails[3], "out for delivery", "product shipment details is not same as expected");

    });

    it("...test must success for multiple getOrderPlaced() by seller", async () => {
        
        await afsc.addProduct("test productId_2", "test productName", "test category", 2, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_2", {from: buyer1, value:6000000000000000000})

        await afsc.updateShipmentDetails(2, "out for delivery", {from: seller1})

        let sellerOrderPlacedDetails = await afsc.getOrdersPlaced.call(1, {from: seller1});

        assert.equal(sellerOrderPlacedDetails[0], "test productId_2", "product Id is not same as expected");
        assert.equal(sellerOrderPlacedDetails[1], 2, "product purchase Id is not same as expected");
        assert.equal(sellerOrderPlacedDetails[2], buyer1, "product ordered by is not same as expected");
        assert.equal(sellerOrderPlacedDetails[3], "out for delivery", "product shipment details is not same as expected");

        await afsc.addProduct("test productId_3", "test productName", "test category", 3, 3, "test description", {from: seller1})
        await afsc.buyProduct("test productId_3", {from: buyer1, value:9000000000000000000})

        await afsc.updateShipmentDetails(3, "out for delivery", {from: seller1})

        sellerOrderPlacedDetails = await afsc.getOrdersPlaced.call(2, {from: seller1});

        assert.equal(sellerOrderPlacedDetails[0], "test productId_3", "product Id is not same as expected");
        assert.equal(sellerOrderPlacedDetails[1], 3, "product purchase Id is not same as expected");
        assert.equal(sellerOrderPlacedDetails[2], buyer1, "product ordered by is not same as expected");
        assert.equal(sellerOrderPlacedDetails[3], "out for delivery", "product shipment details is not same as expected");

    });

    it("...test must returns error for getOrderPlaced() when buyer access it instead of seller", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_4", "test productName", "test category", 2, 3, "test description", {from: seller1})
            await afsc.buyProduct("test productId_4", {from: buyer1, value:6000000000000000000})

            await afsc.updateShipmentDetails(4, "out for delivery", {from: seller1})

            let sellerOrderPlacedDetails = await afsc.getOrdersPlaced.call(3, {from: buyer1});

            assert.equal(sellerOrderPlacedDetails[0], "test productId_4", "product Id is not same as expected");
            assert.equal(sellerOrderPlacedDetails[1], 4, "product purchase Id is not same as expected");
            assert.equal(sellerOrderPlacedDetails[2], buyer1, "product ordered by is not same as expected");
            assert.equal(sellerOrderPlacedDetails[3], "out for delivery", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Only seller can able to access their order details', 'Error fails with unexpected error message')
    });

    it("...test must returns error for getOrderPlaced() when seller access it for unsold product", async () => {
        let err = null


        try{
            await afsc.addProduct("test productId_unsold", "test productName", "test category", 2, 3, "test description", {from: seller1})

            let sellerOrderPlacedDetails = await afsc.getOrdersPlaced.call(4, {from: seller1});

            assert.equal(sellerOrderPlacedDetails[0], "test productId_4", "product Id is not same as expected");
            assert.equal(sellerOrderPlacedDetails[1], 4, "product purchase Id is not same as expected");
            assert.equal(sellerOrderPlacedDetails[2], buyer1, "product ordered by is not same as expected");
            assert.equal(sellerOrderPlacedDetails[3], "out for delivery", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: invalid opcode', 'Error fails with unexpected error message')

    });

    it("...test must returns error for getOrderPlaced() when seller access for invalid product", async () => {
        let err = null

        try{

            let sellerOrderPlacedDetails = await afsc.getOrdersPlaced.call(4, {from: seller1});

            assert.equal(sellerOrderPlacedDetails[0], "test productId_4", "product Id is not same as expected");
            assert.equal(sellerOrderPlacedDetails[1], 4, "product purchase Id is not same as expected");
            assert.equal(sellerOrderPlacedDetails[2], buyer1, "product ordered by is not same as expected");
            assert.equal(sellerOrderPlacedDetails[3], "out for delivery", "product shipment details is not same as expected");

        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: invalid opcode', 'Error fails with unexpected error message')
    });

});