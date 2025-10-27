// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract PixelBoard {
    uint256 public constant TOTAL_PIXELS = 9;
    
    uint256 public constant INITIAL_PIXEL_PRICE = 0.00000001 ether;
    
    struct Pixel {
        address owner;
        string text;
        string imageUrl;
        string link; 
        bool isOwned;
        uint256 purchaseCount;
        uint256 purchaseTime;
    }
    
    mapping(uint256 => Pixel) public pixels;
    
    mapping(address => uint256) public ownerPixelCount;
    
    uint256 public totalPixelsSold;
    
    address public owner;
    
    event PixelPurchased(
        address indexed buyer,
        uint256 indexed pixelId,
        string text,
        string imageUrl,
        string link,
        uint256 price,
        uint256 purchaseCount
    );
    
    event PixelUpdated(
        address indexed owner,
        uint256 indexed pixelId,
        string text,
        string imageUrl,
        string link
    );
    
    error NotPixelOwner(uint256 pixelId);
    error InvalidPixelIndex(uint256 pixelId);
    error InsufficientPayment(uint256 required, uint256 sent);
    error EmptyText();
    
    constructor() {
        owner = msg.sender;
    }
    
    function getPixelPrice(uint256 pixelId) public view returns (uint256) {
        Pixel memory pixel = pixels[pixelId];


        return INITIAL_PIXEL_PRICE * (1 << pixel.purchaseCount);
    }
    
    function purchasePixel(
        uint256 pixelId,
        string calldata text,
        string calldata imageUrl,
        string calldata link
    ) external payable {

        if (pixelId >= TOTAL_PIXELS) {
            revert InvalidPixelIndex(pixelId);
        }
        

        if (bytes(text).length == 0) {
            revert EmptyText();
        }
        
        Pixel memory pixel = pixels[pixelId];
        uint256 price = getPixelPrice(pixelId);
        

        if (msg.value < price) {
            revert InsufficientPayment(price, msg.value);
        }
        

        if (pixel.isOwned) {
            ownerPixelCount[pixel.owner]--;
        } else {
    
            totalPixelsSold++;
        }
        
 
        pixels[pixelId] = Pixel({
            owner: msg.sender,
            text: text,
            imageUrl: imageUrl,
            link: link,
            isOwned: true,
            purchaseCount: pixel.purchaseCount + 1,
            purchaseTime: block.timestamp
        });
        
 
        ownerPixelCount[msg.sender]++;
        
 
        emit PixelPurchased(msg.sender, pixelId, text, imageUrl, link, price, pixel.purchaseCount + 1);
        

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
    
    function updatePixel(
        uint256 pixelId,
        string calldata text,
        string calldata imageUrl,
        string calldata link
    ) external {

        if (pixelId >= TOTAL_PIXELS) {
            revert InvalidPixelIndex(pixelId);
        }
        

        if (pixels[pixelId].owner != msg.sender) {
            revert NotPixelOwner(pixelId);
        }
        
 
        if (bytes(text).length == 0) {
            revert EmptyText();
        }
        
 
        pixels[pixelId].text = text;
        pixels[pixelId].imageUrl = imageUrl;
        pixels[pixelId].link = link;
        
 
        emit PixelUpdated(msg.sender, pixelId, text, imageUrl, link);
    }
    
    function getPixel(uint256 pixelId) external view returns (Pixel memory) {
        return pixels[pixelId];
    }
    
    function getPixelCurrentPrice(uint256 pixelId) external view returns (uint256) {
        return getPixelPrice(pixelId);
    }
    
    function getAllPixels() external view returns (Pixel[] memory) {
        Pixel[] memory allPixels = new Pixel[](TOTAL_PIXELS);
        
        for (uint256 i = 0; i < TOTAL_PIXELS; i++) {
            allPixels[i] = pixels[i];
        }
        
        return allPixels;
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
