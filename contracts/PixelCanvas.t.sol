// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {PixelCanvas} from "../contracts/PixelCanvas.sol";

contract PixelCanvasTest is Test {
    PixelCanvas public pixelCanvas;
    
    address public owner = address(0x1);
    address public buyer1 = address(0x2);
    address public buyer2 = address(0x3);
    
    function setUp() public {
        vm.prank(owner);
        pixelCanvas = new PixelCanvas();
    }
    
    function testInitialState() public {
        assertEq(pixelCanvas.CANVAS_SIZE(), 5);
        assertEq(pixelCanvas.PIXEL_PRICE(), 0.00000001 ether);
        assertEq(pixelCanvas.totalPixelsSold(), 0);
        assertEq(pixelCanvas.owner(), owner);
    }
    
    function testPurchasePixel() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            0, 0, "Hello World", "https://example.com"
        );
        
        // 픽셀 정보 확인
        PixelCanvas.Pixel memory pixel = pixelCanvas.getPixel(0, 0);
        assertEq(pixel.owner, buyer1);
        assertEq(pixel.text, "Hello World");
        assertEq(pixel.link, "https://example.com");
        assertTrue(pixel.isOwned);
        assertEq(pixel.purchaseTime, block.timestamp);
        
        // 소유자 픽셀 개수 확인
        assertEq(pixelCanvas.ownerPixelCount(buyer1), 1);
        assertEq(pixelCanvas.totalPixelsSold(), 1);
    }
    
    function testPurchasePixelWithExcessPayment() public {
        vm.deal(buyer1, 1 ether);
        
        uint256 initialBalance = buyer1.balance;
        
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.01 ether}(
            1, 1, "Test", "https://test.com"
        );
        
        // 초과 지불된 금액이 반환되었는지 확인
        assertEq(buyer1.balance, initialBalance - 0.00000001 ether);
    }
    
    function testUpdatePixel() public {
        // 먼저 픽셀 구매
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            2, 2, "Original", "https://original.com"
        );
        
        // 픽셀 업데이트
        vm.prank(buyer1);
        pixelCanvas.updatePixel(2, 2, "Updated", "https://updated.com");
        
        // 업데이트 확인
        PixelCanvas.Pixel memory pixel = pixelCanvas.getPixel(2, 2);
        assertEq(pixel.text, "Updated");
        assertEq(pixel.link, "https://updated.com");
        assertEq(pixel.owner, buyer1);
    }
    
    function testCannotPurchaseOwnedPixel() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        // 첫 번째 구매
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            3, 3, "First", "https://first.com"
        );
        
        // 같은 픽셀을 다시 구매하려고 시도
        vm.prank(buyer2);
        vm.expectRevert(abi.encodeWithSelector(PixelCanvas.PixelAlreadyOwned.selector, 18)); // 3*5+3=18
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            3, 3, "Second", "https://second.com"
        );
    }
    
    function testCannotUpdateOthersPixel() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        // buyer1이 픽셀 구매
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            4, 4, "Owner", "https://owner.com"
        );
        
        // buyer2가 다른 사람의 픽셀을 업데이트하려고 시도
        vm.prank(buyer2);
        vm.expectRevert(abi.encodeWithSelector(PixelCanvas.NotPixelOwner.selector, 24)); // 4*5+4=24
        pixelCanvas.updatePixel(4, 4, "Hacker", "https://hacker.com");
    }
    
    function testInvalidCoordinates() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(abi.encodeWithSelector(PixelCanvas.InvalidCoordinates.selector, 5, 0));
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            5, 0, "Invalid", "https://invalid.com"
        );
    }
    
    function testInsufficientPayment() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(abi.encodeWithSelector(PixelCanvas.InsufficientPayment.selector, 0.00000001 ether, 0.0005 ether));
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            0, 1, "Insufficient", "https://insufficient.com"
        );
    }
    
    function testEmptyText() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        vm.expectRevert(PixelCanvas.EmptyText.selector);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            0, 2, "", "https://empty.com"
        );
    }
    
    function testGetAllPixels() public {
        vm.deal(buyer1, 1 ether);
        vm.deal(buyer2, 1 ether);
        
        // 두 개의 픽셀 구매
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            0, 0, "First", "https://first.com"
        );
        
        vm.prank(buyer2);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            1, 1, "Second", "https://second.com"
        );
        
        // 모든 픽셀 조회
        PixelCanvas.Pixel[] memory allPixels = pixelCanvas.getAllPixels();
        
        // 총 25개 픽셀 확인
        assertEq(allPixels.length, 25);
        
        // 구매된 픽셀들 확인
        assertEq(allPixels[0].owner, buyer1);  // (0,0)
        assertEq(allPixels[6].owner, buyer2);  // (1,1)
        
        // 구매되지 않은 픽셀들 확인
        assertEq(allPixels[1].owner, address(0));  // (0,1)
        assertFalse(allPixels[1].isOwned);
    }
    
    function testWithdraw() public {
        vm.deal(buyer1, 1 ether);
        
        // 픽셀 구매로 컨트랙트에 이더 입금
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            0, 0, "Test", "https://test.com"
        );
        
        uint256 contractBalance = pixelCanvas.getContractBalance();
        assertEq(contractBalance, 0.00000001 ether);
        
        // 소유자가 인출 (owner에게 이더 지급)
        vm.deal(owner, 1 ether);
        uint256 ownerBalanceBefore = owner.balance;
        
        vm.prank(owner);
        pixelCanvas.withdraw();
        
        assertEq(owner.balance, ownerBalanceBefore + 0.00000001 ether);
        assertEq(pixelCanvas.getContractBalance(), 0);
    }
    
    function testOnlyOwnerCanWithdraw() public {
        vm.deal(buyer1, 1 ether);
        
        vm.prank(buyer1);
        pixelCanvas.purchasePixel{value: 0.00000001 ether}(
            0, 0, "Test", "https://test.com"
        );
        
        // 소유자가 아닌 사람이 인출하려고 시도
        vm.prank(buyer1);
        vm.expectRevert("Only owner can withdraw");
        pixelCanvas.withdraw();
    }
}
