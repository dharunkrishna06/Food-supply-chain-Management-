const AgriContractAddProduct = artifacts.require("./agriFoodSupplyChain.sol");

contract("AgriContractAddProduct", (accounts) => {

    let seller1    = accounts[0];
    let seller2    = accounts[1];
    let sellerUnknown = accounts[2];


    it("...test must success for addProduct() by seller", async () => {
        
        await afsc.sellerSignUp("Ajay", {from: seller1});
        await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1})

        let productDetails = await afsc.getProductDetails.call("test productId_1", {from: seller1});

        assert.equal(productDetails[0], "test productId_1", "product Id is not same as expected");
        assert.equal(productDetails[1], "test productName", "product Name is not same as expected");
        assert.equal(productDetails[2], "test category", "product category is not same as expected");
        assert.equal(productDetails[3], "test description", "product description is not same as expected");
        assert.equal(productDetails[4], 1000000000000000000, "product price is not same as expected");
        assert.equal(productDetails[5], 3, "product quantity is not same as expected");
        assert.equal(productDetails[6], seller1, "product seller is not same as expected");
    });

    it("...test must success for multiple addProduct() under same seller", async () => {
        await afsc.sellerSignUp("Ajay", {from: seller2});
        await afsc.addProduct("test productId_2", "test productName", "test category", 2, 3, "test description", {from: seller2})

        let productDetails = await afsc.getProductDetails.call("test productId_2", {from: seller2});

        assert.equal(productDetails[0], "test productId_2", "product Id is not same as expected");
        assert.equal(productDetails[1], "test productName", "product Name is not same as expected");
        assert.equal(productDetails[2], "test category", "product category is not same as expected");
        assert.equal(productDetails[3], "test description", "product description is not same as expected");
        assert.equal(productDetails[4], 2000000000000000000, "product price is not same as expected");
        assert.equal(productDetails[5], 3, "product quantity is not same as expected");
        assert.equal(productDetails[6], seller2, "product seller is not same as expected");

        await afsc.addProduct("test productId_3", "test productName", "test category", 3, 3, "test description", {from: seller2})

        productDetails = await afsc.getProductDetails.call("test productId_3", {from: seller2});

        assert.equal(productDetails[0], "test productId_3", "product Id is not same as expected");
        assert.equal(productDetails[1], "test productName", "product Name is not same as expected");
        assert.equal(productDetails[2], "test category", "product category is not same as expected");
        assert.equal(productDetails[3], "test description", "product description is not same as expected");
        assert.equal(productDetails[4], 3000000000000000000, "product price is not same as expected");
        assert.equal(productDetails[5], 3, "product quantity is not same as expected");
        assert.equal(productDetails[6], seller2, "product seller is not same as expected");
    });

    it("...test must return error for addProduct() when seller register existing product", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: seller1})

            let productDetails = await afsc.getProductDetails.call("test productId_1", {from: seller1});

            assert.equal(productDetails[0], "test productId_1", "product Id is not same as expected");
            assert.equal(productDetails[1], "test productName", "product Name is not same as expected");
            assert.equal(productDetails[2], "test category", "product category is not same as expected");
            assert.equal(productDetails[3], "test description", "product description is not same as expected");
            assert.equal(productDetails[4], 1000000000000000000, "product price is not same as expected");
            assert.equal(productDetails[5], 3, "product quantity is not same as expected");
            assert.equal(productDetails[6], seller1, "product seller is not same as expected");
        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert Product With this Id is already Active. Use other UniqueId -- Reason given: Product With this Id is already Active. Use other UniqueId.', 'Error fails with unexpected error message')
    });

    it("...test must return error for addProduct() when seller is unknown", async () => {
        let err = null

        try{

            await afsc.addProduct("test productId_1", "test productName", "test category", 1, 3, "test description", {from: sellerUnknown})

            let productDetails = await afsc.getProductDetails.call("test productId_1", {from: sellerUnknown});

            assert.equal(productDetails[0], "test productId_1", "product Id is not same as expected");
            assert.equal(productDetails[1], "test productName", "product Name is not same as expected");
            assert.equal(productDetails[2], "test category", "product category is not same as expected");
            assert.equal(productDetails[3], "test description", "product description is not same as expected");
            assert.equal(productDetails[4], 1000000000000000000, "product price is not same as expected");
            assert.equal(productDetails[5], 3, "product quantity is not same as expected");
            assert.equal(productDetails[6], sellerUnknown, "product seller is not same as expected");
        }catch(error){
            err = error
        }

        assert.equal(err , 'Error: Returned error: VM Exception while processing transaction: revert You are not Registered as Seller -- Reason given: You are not Registered as Seller.', 'Error fails with unexpected error message')
    });

});