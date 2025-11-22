// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {PixelBoardV2} from "./PixelBoardV2.sol";

contract PixelBoardTest is Test {
    PixelBoardV2 public pixelBoard;
    
    address public owner = address(0x1);
    address public buyer1 = address(0x2);
    address public buyer2 = address(0x3);
    
    function setUp() public {
        vm.prank(owner);
        pixelBoard = new PixelBoardV2();
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
            0, "QmTestMetadataCid123"
        );

        PixelBoardV2.Pixel memory pixel = pixelBoard.getPixel(0);
        assertEq(pixel.id, 0);
        assertEq(pixel.owner, buyer1);
        assertEq(pixel.metadataCid, "QmTestMetadataCid123");
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
            1, "QmTestMetadataCid456"
        );
        
        assertEq(buyer1.balance, initialBalance - 0.00000001 ether);
    }
    
    function testUpdatePixel() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            2, "QmOriginalMetadataCid"
        );
        
        vm.prank(buyer1);
        pixelBoard.updatePixel(2, "QmUpdatedMetadataCid");
        
        PixelBoardV2.Pixel memory pixel = pixelBoard.getPixel(2);
        assertEq(pixel.metadataCid, "QmUpdatedMetadataCid");
        assertEq(pixel.owner, buyer1);
    }
    
    function testRepurchasePixel() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            3, "QmFirstMetadataCid"
        );
        
        PixelBoardV2.Pixel memory pixel1 = pixelBoard.getPixel(3);
        assertEq(pixel1.owner, buyer1);
        assertEq(pixel1.purchaseCount, 1);
        assertEq(pixelBoard.ownerPixelCount(buyer1), 1);
        assertEq(pixelBoard.ownerPixelCount(buyer2), 0);
        
        vm.prank(buyer2);
        pixelBoard.purchasePixel{value: 0.00000002 ether}(
            3, "QmSecondMetadataCid"
        );
        
        PixelBoardV2.Pixel memory pixel2 = pixelBoard.getPixel(3);
        assertEq(pixel2.owner, buyer2);
        assertEq(pixel2.purchaseCount, 2);
        assertEq(pixel2.metadataCid, "QmSecondMetadataCid");
        
        assertEq(pixelBoard.ownerPixelCount(buyer1), 0);
        assertEq(pixelBoard.ownerPixelCount(buyer2), 1);
    }
    
    function testPriceDoubling() public {
        vm.deal(buyer1, 10 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "QmFirstMetadataCid"
        );
        
        uint256 price1 = pixelBoard.getPixelCurrentPrice(0);
        assertEq(price1, 0.00000002 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000002 ether}(
            0, "QmSecondMetadataCid"
        );
        
        uint256 price2 = pixelBoard.getPixelCurrentPrice(0);
        assertEq(price2, 0.00000004 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000004 ether}(
            0, "QmThirdMetadataCid"
        );
        
        uint256 price3 = pixelBoard.getPixelCurrentPrice(0);
        assertEq(price3, 0.00000008 ether);
        
        PixelBoardV2.Pixel memory pixel = pixelBoard.getPixel(0);
        assertEq(pixel.purchaseCount, 3);
    }
    
    function testCannotUpdateOthersPixel() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            4, "QmOwnerMetadataCid"
        );
        
        vm.prank(buyer2);
        vm.expectRevert(abi.encodeWithSelector(PixelBoardV2.NotPixelOwner.selector, 4));
        pixelBoard.updatePixel(4, "QmHackerMetadataCid");
    }
    
    function testInvalidPixelIndex() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(abi.encodeWithSelector(PixelBoardV2.InvalidPixelIndex.selector, 9));
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            9, "QmInvalidMetadataCid"
        );
    }
    
    function testInsufficientPayment() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            5, "QmFirstMetadataCid"
        );
        
        vm.prank(buyer1);
        vm.expectRevert(abi.encodeWithSelector(PixelBoardV2.InsufficientPayment.selector, 0.00000002 ether, 0.00000001 ether));
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            5, "QmSecondMetadataCid"
        );
    }
    
    function testEmptyMetadataCid() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(PixelBoardV2.EmptyMetadataCid.selector);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, ""
        );
    }
    
    function testGetAllPixels() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "QmFirstMetadataCid"
        );
        
        vm.prank(buyer2);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            1, "QmSecondMetadataCid"
        );

        PixelBoardV2.Pixel[] memory allPixels = pixelBoard.getAllPixels();
        
        assertEq(allPixels.length, 9);
        
        assertEq(allPixels[0].id, 0);
        assertEq(allPixels[0].owner, buyer1);
        assertEq(allPixels[0].metadataCid, "QmFirstMetadataCid");
        assertEq(allPixels[1].id, 1);
        assertEq(allPixels[1].owner, buyer2);
        assertEq(allPixels[1].metadataCid, "QmSecondMetadataCid");
        
        assertEq(allPixels[2].id, 2);
        assertEq(allPixels[2].owner, address(0));
        assertFalse(allPixels[2].isOwned);
    }
    
    function testOnlyOwnerCanWithdraw() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000001 ether}(
            0, "QmTestMetadataCid"
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
                string(abi.encodePacked("QmPixel", vm.toString(i), "MetadataCid"))
            );
        }
        
        assertEq(pixelBoard.totalPixelsSold(), 9);
        assertEq(pixelBoard.ownerPixelCount(buyer1), 9);
        
        PixelBoardV2.Pixel[] memory allPixels = pixelBoard.getAllPixels();
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
            0, "QmFirstMetadataCid"
        );
        
        uint256 priceAfterFirst = pixelBoard.getPixelPrice(0);
        assertEq(priceAfterFirst, 0.00000002 ether);
        
        vm.prank(buyer1);
        pixelBoard.purchasePixel{value: 0.00000002 ether}(
            0, "QmSecondMetadataCid"
        );
        
        uint256 priceAfterSecond = pixelBoard.getPixelPrice(0);
        assertEq(priceAfterSecond, 0.00000004 ether);
    }
}
