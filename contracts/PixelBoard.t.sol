// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {PixelBoard} from "./PixelBoard.sol";

contract PixelBoardTest is Test {
    PixelBoard public pixelBoard;
    
    address public owner = address(0x1);
    address public buyer1 = address(0x2);
    address public buyer2 = address(0x3);
    
    function setUp() public {
        vm.prank(owner);
        pixelBoard = new PixelBoard();
    }
    
    function testInitialState() public {
        assertEq(pixelBoard.TOTAL_PIXELS(), 9);
        assertEq(pixelBoard.INITIAL_PIXEL_PRICE(), 0.00000001 ether);
        assertEq(pixelBoard.totalPixelsSold(), 0);
        assertEq(pixelBoard.owner(), owner);
    }
    
    function testPurchasePixel() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "Hello World", "https://example.com/image.png", "https://example.com"
        );

        PixelBoard.Pixel memory pixel = pixelBoard.getPixel(0);
        assertEq(pixel.id, 0);
        assertEq(pixel.owner, buyer1);
        assertEq(pixel.text, "Hello World");
        assertEq(pixel.imageUrl, "https://example.com/image.png");
        assertEq(pixel.link, "https://example.com");
        assertTrue(pixel.isOwned);
        assertEq(pixel.purchaseCount, 1);
        assertEq(pixel.purchaseTime, block.timestamp);

        assertEq(pixelBoard.ownerPixelCount(buyer1), 1);
        assertEq(pixelBoard.totalPixelsSold(), 1);
    }
    
    function testPurchasePixelWithExcessPayment() public {
        vm.deal(buyer1, 1 ether);
        
        uint256 initialBalance = buyer1.balance;
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.01 ether}(
            1, "Test", "https://test.com/img.png", "https://test.com"
        );
        
        assertEq(buyer1.balance, initialBalance - 0.00000001 ether);
    }
    
    function testUpdatePixel() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            2, "Original", "https://original.com/old.png", "https://original.com"
        );
        
        vm.prank(buyer1);
        pixelBoard.updatePixel(2, "Updated", "https://updated.com/new.png", "https://updated.com");
        
        PixelBoard.Pixel memory pixel = pixelBoard.getPixel(2);
        assertEq(pixel.text, "Updated");
        assertEq(pixel.imageUrl, "https://updated.com/new.png");
        assertEq(pixel.link, "https://updated.com");
        assertEq(pixel.owner, buyer1);
    }
    
    function testRepurchasePixel() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            3, "First", "https://first.com/1.png", "https://first.com"
        );
        
        PixelBoard.Pixel memory pixel1 = pixelBoard.getPixel(3);
        assertEq(pixel1.owner, buyer1);
        assertEq(pixel1.purchaseCount, 1);
        assertEq(pixelBoard.ownerPixelCount(buyer1), 1);
        assertEq(pixelBoard.ownerPixelCount(buyer2), 0);
        
        vm.prank(buyer2);
        pixelBoard.purchasePixel{value: 0.00000002 ether}(
            3, "Second", "https://second.com/2.png", "https://second.com"
        );
        
        PixelBoard.Pixel memory pixel2 = pixelBoard.getPixel(3);
        assertEq(pixel2.owner, buyer2);
        assertEq(pixel2.purchaseCount, 2);
        assertEq(pixel2.text, "Second");
        assertEq(pixel2.imageUrl, "https://second.com/2.png");
        assertEq(pixel2.link, "https://second.com");
        
        assertEq(pixelBoard.ownerPixelCount(buyer1), 0);
        assertEq(pixelBoard.ownerPixelCount(buyer2), 1);
    }
    
    function testPriceDoubling() public {
        vm.deal(buyer1, 10 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "First", "https://1.com/img.png", "https://1.com"
        );
        
        uint256 price1 = pixelBoard.getPixelCurrentPrice(0);
        assertEq(price1, 0.00000002 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000002 ether}(
            0, "Second", "https://2.com/img.png", "https://2.com"
        );
        
        uint256 price2 = pixelBoard.getPixelCurrentPrice(0);
        assertEq(price2, 0.00000004 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000004 ether}(
            0, "Third", "https://3.com/img.png", "https://3.com"
        );
        
        uint256 price3 = pixelBoard.getPixelCurrentPrice(0);
        assertEq(price3, 0.00000008 ether);
        
        PixelBoard.Pixel memory pixel = pixelBoard.getPixel(0);
        assertEq(pixel.purchaseCount, 3);
    }
    
    function testCannotUpdateOthersPixel() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            4, "Owner", "https://owner.com/img.png", "https://owner.com"
        );
        
        vm.prank(buyer2);
        vm.expectRevert(abi.encodeWithSelector(PixelBoard.NotPixelOwner.selector, 4));
        pixelBoard.updatePixel(4, "Hacker", "https://hacker.com/img.png", "https://hacker.com");
    }
    
    function testInvalidPixelIndex() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(abi.encodeWithSelector(PixelBoard.InvalidPixelIndex.selector, 9));
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            9, "Invalid", "https://invalid.com/img.png", "https://invalid.com"
        );
    }
    
    function testInsufficientPayment() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            5, "First", "https://first.com/img.png", "https://first.com"
        );
        
        vm.prank(buyer1);
        vm.expectRevert(abi.encodeWithSelector(PixelBoard.InsufficientPayment.selector, 0.00000002 ether, 0.00000001 ether));
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            5, "Second", "https://second.com/img.png", "https://second.com"
        );
    }
    
    function testEmptyText() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(PixelBoard.EmptyText.selector);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "", "https://empty.com/img.png", "https://empty.com"
        );
    }
    
    function testGetAllPixels() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "First", "https://first.com/img.png", "https://first.com"
        );
        
        vm.prank(buyer2);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            1, "Second", "https://second.com/img.png", "https://second.com"
        );

        PixelBoard.Pixel[] memory allPixels = pixelBoard.getAllPixels();
        
        assertEq(allPixels.length, 9);
        
        assertEq(allPixels[0].id, 0);
        assertEq(allPixels[0].owner, buyer1);
        assertEq(allPixels[1].id, 1);
        assertEq(allPixels[1].owner, buyer2);
        
        assertEq(allPixels[2].id, 2);
        assertEq(allPixels[2].owner, address(0));
        assertFalse(allPixels[2].isOwned);
    }
    
    function testOnlyOwnerCanWithdraw() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "Test", "https://test.com/img.png", "https://test.com"
        );
        
        vm.prank(buyer1);
        vm.expectRevert("Only owner can withdraw");
        pixelBoard.withdraw();
    }
    
    function testPurchaseAllPixels() public {
        vm.deal(buyer1, 10 ether);
        
        for (uint i = 0; i < 9; i++) {
            vm.prank(buyer1);
            pixelBoard.purchasePixel{value: 0.00000001 ether}(
                i, 
                string(abi.encodePacked("Pixel ", vm.toString(i))),
                string(abi.encodePacked("https://pixel", vm.toString(i), ".com/img.png")),
                string(abi.encodePacked("https://pixel", vm.toString(i), ".com"))
            );
        }
        
        assertEq(pixelBoard.totalPixelsSold(), 9);
        assertEq(pixelBoard.ownerPixelCount(buyer1), 9);
        
        PixelBoard.Pixel[] memory allPixels = pixelBoard.getAllPixels();
        for (uint i = 0; i < 9; i++) {
            assertEq(allPixels[i].id, i);
            assertTrue(allPixels[i].isOwned);
            assertEq(allPixels[i].owner, buyer1);
        }
    }
    
    function testGetPixelPrice() public {
        vm.deal(buyer1, 10 ether);
        
        uint256 initialPrice = pixelBoard.getPixelPrice(0);
        assertEq(initialPrice, 0.00000001 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "First", "https://1.com/img.png", "https://1.com"
        );
        
        uint256 priceAfterFirst = pixelBoard.getPixelPrice(0);
        assertEq(priceAfterFirst, 0.00000002 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000002 ether}(
            0, "Second", "https://2.com/img.png", "https://2.com"
        );
        
        uint256 priceAfterSecond = pixelBoard.getPixelPrice(0);
        assertEq(priceAfterSecond, 0.00000004 ether);
    }
}
