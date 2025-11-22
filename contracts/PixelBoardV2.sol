// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract PixelBoardV2 {
    uint256 public constant TOTAL_PIXELS = 9;
    
    uint256 public constant INITIAL_PIXEL_PRICE = 0.00000001 ether;
    
    struct Pixel {
        uint256 id;
        address owner;
        string metadataCid;
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
        string metadataCid,
        uint256 price,
        uint256 purchaseCount
    );
    
    event PixelUpdated(
        address indexed owner,
        uint256 indexed pixelId,
        string metadataCid
    );
    
    error NotPixelOwner(uint256 pixelId);
    error InvalidPixelIndex(uint256 pixelId);
    error InsufficientPayment(uint256 required, uint256 sent);
    error EmptyMetadataCid();
    
    constructor() {
        owner = msg.sender;
    }
    
    function getPixelPrice(uint256 pixelId) public view returns (uint256) {
        Pixel memory pixel = pixels[pixelId];


        return INITIAL_PIXEL_PRICE * (1 << pixel.purchaseCount);
    }
    
    function purchasePixel(
        uint256 pixelId,
        string calldata metadataCid
    ) external payable {

        if (pixelId >= TOTAL_PIXELS) {
            revert InvalidPixelIndex(pixelId);
        }
        

        if (bytes(metadataCid).length == 0) {
            revert EmptyMetadataCid();
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
            id: pixelId,
            owner: msg.sender,
            metadataCid: metadataCid,
            isOwned: true,
            purchaseCount: pixel.purchaseCount + 1,
            purchaseTime: block.timestamp
        });
        
 
        ownerPixelCount[msg.sender]++;
        

        emit PixelPurchased(msg.sender, pixelId, metadataCid, price, pixel.purchaseCount + 1);
        

        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }
    
    function updatePixel(
        uint256 pixelId,
        string calldata metadataCid
    ) external {

        if (pixelId >= TOTAL_PIXELS) {
            revert InvalidPixelIndex(pixelId);
        }
        

        if (pixels[pixelId].owner != msg.sender) {
            revert NotPixelOwner(pixelId);
        }
        
 
        if (bytes(metadataCid).length == 0) {
            revert EmptyMetadataCid();
        }
        
 
        pixels[pixelId].metadataCid = metadataCid;
        
 
        emit PixelUpdated(msg.sender, pixelId, metadataCid);
    }
    
    function getPixel(uint256 pixelId) external view returns (Pixel memory) {
        Pixel memory pixel = pixels[pixelId];
        if (!pixel.isOwned) {
            pixel.id = pixelId;
        }
        return pixel;
    }
    
    function getPixelCurrentPrice(uint256 pixelId) external view returns (uint256) {
        return getPixelPrice(pixelId);
    }
    
    function getAllPixels() external view returns (Pixel[] memory) {
        Pixel[] memory allPixels = new Pixel[](TOTAL_PIXELS);
        
        for (uint256 i = 0; i < TOTAL_PIXELS; i++) {
            allPixels[i] = pixels[i];
            if (!allPixels[i].isOwned) {
                allPixels[i].id = i;
            }
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
