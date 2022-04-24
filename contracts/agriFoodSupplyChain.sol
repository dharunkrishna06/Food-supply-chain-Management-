// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

contract agriFoodSupplyChain {

   address payable public owner;

    constructor() public {
       owner=msg.sender;
    }

    uint id = 1;
    uint purchaseId;

    // seller struct consists of all Required details about the seller
    struct seller {
        string name;
        address addr;
        bool isCreated;
    }

    // struct product with all required variables and made string mapping to struct
    struct product{
        string productId;
        string productName;
        string category;
        uint price; // in wel
        uint quantity; // in kgs
        uint totalPrice;
        string description;
        address payable seller;
        bool isActive;
    }

    // struct ordersPlaced with required Tracking Detail
    struct ordersPlaced {
        string productId;
        uint purchaseId;
        address orderedBy;
    }

    // Struct sellerShipment with all required variables for Tracking and Updating Details
    struct sellerShipment {
        string productId;
        uint purchaseId;
        string shipmentStatus;
        string deliveryAddress;
        address  payable orderedBy;
        bool isActive;
        bool isCanceled;
    }

    // Struct user with required user details
    struct buyer{
        string name;
        address addr;
        string deliveryAddress;
        bool isCreated;
    }

    // struct orders with order detail
    struct orders{
        string productId;
        string orderStatus;
        uint purchaseId;
        string shipmentStatus;
    }

    // seller details in a mapping called sellers with address index
    mapping(address => seller) public sellers;

    // string mapping to struct so update or buy Product with productId String
    mapping (string => product) products;
    product[] public allProducts;

    // mapped struct array with seller address so that every seller can Track all his listed product orders placed by buyers.
    mapping (address => ordersPlaced[]) sellerOrders;

    // mapped sellerShipment struct to address and nested uint
    // seller can update shipment details with unique purchaseId
    mapping (address => mapping(uint=>sellerShipment))sellerShipments;

    // buyer details in a mapping called buyers with address index
    mapping (address => buyer) buyers;

    // mapped orders struct to address
    mapping (address => orders[]) buyerOrders;

    // log messages

    // when user register is success
    event UserCreated(
        string userName,
        address userAddress,
        string userType,
        bool isCreated
    );

    // when seller added their product successfully
    event AddedProduct(
        string productId,
        string productName,
        string category,
        uint price,
        uint quantity,
        uint totalPrice,
        string description,
        address payable seller,
        bool isActive
    );

    // when buyer bought the product successfully
    event BuyedProduct(
        string productId,
        string productName,
        address sellerAddress,
        uint purchaseId,
        bool isBought
    );

    // when seller update the shipment details
    event UpdatedShipmentDetails(
        uint purchaseId,
        string shipmentDetails,
        bool isActive
    );

    // when seller make refund
    event RefundDetails(
        string productId,
        uint purchaseId,
        string productName,
        address refundBySeller,
        address refundTobuyer,
        uint refundPrice,
        string refundStatus,
        bool isRefunded
    );

    // when buyer cancel the order
    event CancelOrderDetails(
        string productId,
        uint purchaseId,
        string productName,
        address canceledBy,
        string shipmentStatus,
        bool isCanceled,
        bool isActive
    );

    /// @notice - sellerSignUp to signup into the system
    /// @param _name - seller name of type string
    function sellerSignUp(string memory _name) public payable{

        // Checks if seller is already Registered. if registered, condition will be false and it reverts back to initial state
        require(!sellers[msg.sender].isCreated, "You are Already Registered as seller");

        owner.transfer(msg.value);

        sellers[msg.sender].name = _name;
        sellers[msg.sender].addr = msg.sender;
        sellers[msg.sender].isCreated =true;

        // log this transaction
        emit UserCreated(
                        _name,
                        msg.sender,
                        "seller",
                        true
        );

    }


    /// @notice - only registered seller can see thir details
    function getSellerDetails() public view returns(string memory, address, bool) {

        return(sellers[msg.sender].name,
               sellers[msg.sender].addr,
               sellers[msg.sender].isCreated);

    }

    /// @notice - only registered seller can sell their products
    /// @param _productId - seller will give product id of type string
    /// @param _productName - seller will give product name  of type string
    /// @param _category - seller will give product category  of type string
    /// @param _price - seller will give product price  of type uint
    /// @param _quantity - seller will give product quantity  of type uint
    /// @param _description - seller will give product details  of type string
    function addProduct(string memory _productId,
                        string memory _productName,
                        string memory _category,
                        uint _price,
                        uint _quantity,
                        string memory _description) public {

        //  To check whether seller paid bank guarantee or not
        require(sellers[msg.sender].isCreated,"You are not Registered as Seller");

        // To check if product with the same productId is active already
        require(!products[_productId].isActive, "Product With this Id is already Active. Use other UniqueId");

        product memory Product = product(_productId,
                                        _productName,
                                        _category,
                                        _price * 10**18,
                                        _quantity,
                                        (_price * 10**18) * _quantity,
                                        _description,
                                        msg.sender,
                                        true);


        products[_productId].productId = _productId;
        products[_productId].productName = _productName;
        products[_productId].category = _category;
        products[_productId].description = _description;
        products[_productId].price = _price  * 10**18; // converting wels to ether
        products[_productId].quantity = _quantity;
        products[_productId].totalPrice = products[_productId].price *  products[_productId].quantity;
        products[_productId].seller = msg.sender;
        products[_productId].isActive = true;

        allProducts.push(Product);

        // log this transaction
        emit AddedProduct(
                        _productId,
                        _productName,
                        _category,
                        _price * 10**18,
                        _quantity,
                        products[_productId].price *  products[_productId].quantity,
                        _description,
                        msg.sender,
                        true
        );

    }

    /// @notice - only registered product details will be displayed
    function getProductDetails(string memory _productId) public view returns(string memory, string memory, string memory, string memory, uint, uint, address) {

        return(products[_productId].productId,
                products[_productId].productName,
                products[_productId].category,
                products[_productId].description,
                products[_productId].price,
                products[_productId].quantity,
                products[_productId].seller
        );

    }


    /// @notice - buyerSignUp for buyer signup
    /// @param _name - buyer will give his/her name  of type string
    /// @param _deliveryAddress - buyer will give product delivery address of type string
    function buyerSignUp(string memory _name, string memory _deliveryAddress) public {

        // Checks if buyer is already Registered as seller. if registered, condition will be false and it reverts back to initial state
        require(sellers[msg.sender].addr != msg.sender, "You are Already Registered as seller");

        // Checks if buyer is already Registered. if registered, condition will be false and it reverts back to initial state
        require(!buyers[msg.sender].isCreated, "You are Already Registered as buyer");


        buyers[msg.sender].name = _name;
        buyers[msg.sender].addr = msg.sender;
        buyers[msg.sender].deliveryAddress = _deliveryAddress;
        buyers[msg.sender].isCreated = true;

        // log this transaction
        emit UserCreated(
                        _name,
                        msg.sender,
                        "buyer",
                        true
        );

    }

    /// @notice - only registered buyer can see thir details
    function getBuyerDetails() public view returns(string memory, address, string memory, bool) {

        return(buyers[msg.sender].name,
               buyers[msg.sender].addr,
               buyers[msg.sender].deliveryAddress,
               buyers[msg.sender].isCreated);

    }

    /// @notice - only registered buyer can buy the products
    /// @param _productId - buyer will give product id for buying the product  of type string
    function buyProduct(string memory _productId)  public payable {

        // buyer is Registered or not
        require(buyers[msg.sender].isCreated, "You Must Be Registered as Buyer to Buy the product");

        // product must be Active
        require(products[_productId].isActive, "Product is InActive");

        // msg.value is equal to product price or not
        require(msg.value == products[_productId].totalPrice, "Ether Value Must be Equal to Price of Product");

        // amount will be transferred to the seller and a unique purchaseId will be allocated to purchase.
        products[_productId].seller.transfer(msg.value);

        purchaseId = id++;

        // Order details will be pushed to userOrders, sellerOrders and sellerShipments
        orders memory order = orders(_productId,
                                    "Order Placed With Seller",
                                    purchaseId,
                                    sellerShipments[products[_productId].seller][purchaseId].shipmentStatus);

        buyerOrders[msg.sender].push(order);

        ordersPlaced memory ord = ordersPlaced(_productId, purchaseId, msg.sender);
        sellerOrders[products[_productId].seller].push(ord);

        sellerShipments[products[_productId].seller][purchaseId].productId=_productId;
        sellerShipments[products[_productId].seller][purchaseId].orderedBy= msg.sender;
        sellerShipments[products[_productId].seller][purchaseId].purchaseId= purchaseId;
        sellerShipments[products[_productId].seller][purchaseId].deliveryAddress = buyers[msg.sender].deliveryAddress;
        sellerShipments[products[_productId].seller][purchaseId].isActive= true;

        products[_productId].isActive = false;

        // log this transaction
        emit BuyedProduct(
                        _productId,
                        products[_productId].productName,
                        products[_productId].seller,
                        purchaseId,
                        true
        );


    }

    /// @notice - only registered seller can see the order details of their product
    /// @param _index - seller will give index of the product of type uint
    function getOrdersPlaced(uint _index) public view returns(string memory, uint, address, string memory) {

        // only seller can get order details for is product
        require(sellers[msg.sender].addr == msg.sender, "Only seller can able to access their order details");

        return(sellerOrders[msg.sender][_index].productId,
               sellerOrders[msg.sender][_index].purchaseId,
               sellerOrders[msg.sender][_index].orderedBy,
               sellerShipments[msg.sender][sellerOrders[msg.sender][_index].purchaseId].shipmentStatus);

    }

    /// @notice - any one with productId and pruchaseID can track Orders Placed. A unique purchaseId will be allocated to buyer on particular purchase
    /// @param _purchaseId - user will give purchase id of type uint
    /// @param _productId - user will give product id of type string
    function getShipmentDetails(string memory _productId, uint _purchaseId) public view returns(string memory,string memory,address,string memory) {

        return(sellerShipments[products[_productId].seller][_purchaseId].productId,
              sellerShipments[products[_productId].seller][_purchaseId].shipmentStatus,
              sellerShipments[products[_productId].seller][_purchaseId].orderedBy,
              sellerShipments[products[_productId].seller][_purchaseId].deliveryAddress);

    }

    /// @notice - only registered seller can Update Shipment details with purchaseId
    /// @param _purchaseId - seller will give purchase id of type uint
    /// @param _shipmentDetails - seller will give shipment details of type string
    function updateShipmentDetails(uint _purchaseId, string memory _shipmentDetails) public {

        // only seller can get order details for their product
        require(sellers[msg.sender].addr == msg.sender, "Only seller can able to update shipment details");

        // Shipment details are Pushed to mapping only when Buyer Placed his order
        // checks if product on particular purchaseId is active or not
        require(sellerShipments[msg.sender][_purchaseId].isActive, "Order is either inActive or cancelled");

        sellerShipments[msg.sender][_purchaseId].shipmentStatus= _shipmentDetails;

        // log this transaction
        emit UpdatedShipmentDetails(
                                    _purchaseId,
                                    _shipmentDetails,
                                    true
        );

    }

    /// @notice - only registered buyer can see the order details of their product bought
    /// @param _index - buyer will give index of the product of type uint
    function buyerOrderDetails (uint _index) public view returns(string memory, string memory, uint, string memory) {

        // only buyer can get order details for their orde
        require(buyers[msg.sender].addr == msg.sender, "Only buyer can able to get details for their product");

        return(buyerOrders[msg.sender][_index].productId,
               buyerOrders[msg.sender][_index].orderStatus,
               buyerOrders[msg.sender][_index].purchaseId,
               sellerShipments[products[buyerOrders[msg.sender][_index].productId].seller][buyerOrders[msg.sender][_index].purchaseId].shipmentStatus);

    }

    /// @notice - only registered seller can makes refund to the buyer
    /// @param _productId - seller will give product id of the product of type string
    /// @param _purchaseId - seller will give purchase id of the product of type uint
    function refundToBuyer(string memory _productId, uint _purchaseId) public payable {

        // only seller can access refund
        require(sellers[msg.sender].addr == msg.sender, "Only seller can able to make refund");

        // Check if Product with particular purchaseId is active or not
        require (!sellerShipments[products[_productId].seller][purchaseId].isActive || sellerShipments[msg.sender][_purchaseId].isCanceled,"Order is either Active or not yet Cancelled");


        // If seller Released amount equal to product price
        require(msg.value==products[_productId].totalPrice,"Value Must be Equal to Product Price");

        sellerShipments[msg.sender][_purchaseId].orderedBy.transfer(msg.value);
        sellerShipments[products[_productId].seller][_purchaseId].shipmentStatus = "Order Canceled By Buyer, Payment Refunded";

        // log this transaction
        emit RefundDetails(
                            _productId,
                            _purchaseId,
                            products[_productId].productName,
                            products[_productId].seller,
                            sellerShipments[msg.sender][_purchaseId].orderedBy,
                            msg.value,
                            sellerShipments[products[_productId].seller][_purchaseId].shipmentStatus,
                            true
        );

    }

    /// @notice - only registered buyer of the product can cancle the order
    /// @param _productId - buyer will give product id of the product of type string
    /// @param _purchaseId - buyer will give purchase id of the product of type unit
    function cancelOrder(string memory _productId, uint _purchaseId)  public payable {

        // if product with particular purchaseId is ordered by the current caller or not
        require(sellerShipments[products[_productId].seller][_purchaseId].orderedBy == msg.sender, "You are not Authorized to This Product PurchaseId");

        // if product with particular purchaseId is active or not
        require (sellerShipments[products[_productId].seller][purchaseId].isActive, "You Already Canceled This order");

        sellerShipments[products[_productId].seller][_purchaseId].shipmentStatus= "Order Canceled By Buyer, Payment will Be Refunded";

        // sets isCanceled flag to true, isActive flag to false
        sellerShipments[products[_productId].seller][_purchaseId].isCanceled = true;
        sellerShipments[products[_productId].seller][_purchaseId].isActive = false;

        // log this transaction
        emit CancelOrderDetails(
                            _productId,
                            _purchaseId,
                            products[_productId].productName,
                            msg.sender,
                            sellerShipments[products[_productId].seller][_purchaseId].shipmentStatus,
                            sellerShipments[products[_productId].seller][_purchaseId].isCanceled,
                            sellerShipments[products[_productId].seller][_purchaseId].isActive
        );

    }

}