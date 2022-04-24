const AgriContractGetShipmentDetailsAfterUpdate = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractGetShipmentDetails", (accounts) => {

    let buyer1     = accounts[6];
    let seller1    = accounts[3];

    it("...test must success for getShipmentDetails()", async () => {

        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.buyerSignUp("Maayon", "Maayon Address", {from: buyer1});

        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1});
        await afsc.buyProduct("test productId_1", {from: buyer1, value:3000000000000000000});

        await afsc.updateShipmentDetails(1, "out for delivery", {from: seller1})

        let sellerShipmentDetailsDetails = await afsc.getShipmentDetails.call("test productId_1", 1, {from: seller1});

        assert.equal(sellerShipmentDetailsDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[1], "out for delivery", "product shipment details is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[2], buyer1, "product ordered by is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[3], "Maayon Address", "product delivery address is not same as expected");

    });


    it("...test must return empty for getShipmentDetails() for invalid productId", async () => {

        let sellerShipmentDetailsDetails = await afsc.getShipmentDetails.call("test productId_2", 1, {from: seller1});

        assert.equal(sellerShipmentDetailsDetails[0], "", "product Id is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[1], "", "product shipment details is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[2], 0x0000000000000000000000000000000000000000, "product ordered by is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[3], "", "product delivery address is not same as expected");

    });

    it("...test must return empty for getShipmentDetails() for invalid purchaseId", async () => {
 
        let sellerShipmentDetailsDetails = await afsc.getShipmentDetails.call("test productId_1", 2, {from: seller1});

        assert.equal(sellerShipmentDetailsDetails[0], "", "product Id is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[1], "", "product shipment details is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[2], 0x0000000000000000000000000000000000000000, "product ordered by is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[3], "", "product delivery address is not same as expected");

    });


    it("...test must return empty for getShipmentDetails() for both invalid productId and purchaseId", async () => {

        let sellerShipmentDetailsDetails = await afsc.getShipmentDetails.call("test productId_2", 2, {from: seller1});

        assert.equal(sellerShipmentDetailsDetails[0], "", "product Id is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[1], "", "product shipment details is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[2], 0x0000000000000000000000000000000000000000, "product ordered by is not same as expected");
        assert.equal(sellerShipmentDetailsDetails[3], "", "product delivery address is not same as expected");

    });

});