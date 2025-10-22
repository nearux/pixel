// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract PixelCanvas {
    // 캔버스 크기 (5x5)
    uint256 public constant CANVAS_SIZE = 5;
    
    // 픽셀당 가격 (매우 저렴하게 설정)
    uint256 public constant PIXEL_PRICE = 0.001 ether; // 0.001 ETH
    
    // 픽셀 정보 구조체
    struct Pixel {
        address owner;           // 소유자 주소
        string text;            // 표시할 텍스트
        string link;            // 링크 URL
        bool isOwned;           // 소유 여부
        uint256 purchaseTime;   // 구매 시간
    }
    
    // 픽셀 데이터 저장 (x, y 좌표를 키로 사용)
    mapping(uint256 => Pixel) public pixels;
    
    // 소유자별 픽셀 개수 추적
    mapping(address => uint256) public ownerPixelCount;
    
    // 총 판매된 픽셀 개수
    uint256 public totalPixelsSold;
    
    // 컨트랙트 소유자
    address public owner;
    
    // 이벤트들
    event PixelPurchased(
        address indexed buyer,
        uint256 indexed pixelId,
        uint256 x,
        uint256 y,
        string text,
        string link,
        uint256 price
    );
    
    event PixelUpdated(
        address indexed owner,
        uint256 indexed pixelId,
        string text,
        string link
    );
    
    // 에러들
    error PixelAlreadyOwned(uint256 pixelId);
    error NotPixelOwner(uint256 pixelId);
    error InvalidCoordinates(uint256 x, uint256 y);
    error InsufficientPayment(uint256 required, uint256 sent);
    error EmptyText();
    
    constructor() {
        owner = msg.sender;
    }
    
    // 좌표를 픽셀 ID로 변환
    function _getPixelId(uint256 x, uint256 y) internal pure returns (uint256) {
        return x * CANVAS_SIZE + y;
    }
    
    // 픽셀 구매 함수
    function purchasePixel(
        uint256 x,
        uint256 y,
        string calldata text,
        string calldata link
    ) external payable {
        // 좌표 유효성 검사
        if (x >= CANVAS_SIZE || y >= CANVAS_SIZE) {
            revert InvalidCoordinates(x, y);
        }
        
        // 텍스트 비어있지 않은지 확인
        if (bytes(text).length == 0) {
            revert EmptyText();
        }
        
        uint256 pixelId = _getPixelId(x, y);
        
        // 이미 소유된 픽셀인지 확인
        if (pixels[pixelId].isOwned) {
            revert PixelAlreadyOwned(pixelId);
        }
        
        // 결제 금액 확인
        if (msg.value < PIXEL_PRICE) {
            revert InsufficientPayment(PIXEL_PRICE, msg.value);
        }
        
        // 픽셀 정보 저장
        pixels[pixelId] = Pixel({
            owner: msg.sender,
            text: text,
            link: link,
            isOwned: true,
            purchaseTime: block.timestamp
        });
        
        // 소유자 픽셀 개수 증가
        ownerPixelCount[msg.sender]++;
        totalPixelsSold++;
        
        // 이벤트 발생
        emit PixelPurchased(msg.sender, pixelId, x, y, text, link, PIXEL_PRICE);
        
        // 초과 지불된 금액 반환
        if (msg.value > PIXEL_PRICE) {
            payable(msg.sender).transfer(msg.value - PIXEL_PRICE);
        }
    }
    
    // 픽셀 텍스트/링크 업데이트 (소유자만)
    function updatePixel(
        uint256 x,
        uint256 y,
        string calldata text,
        string calldata link
    ) external {
        uint256 pixelId = _getPixelId(x, y);
        
        // 소유자 확인
        if (pixels[pixelId].owner != msg.sender) {
            revert NotPixelOwner(pixelId);
        }
        
        // 텍스트 비어있지 않은지 확인
        if (bytes(text).length == 0) {
            revert EmptyText();
        }
        
        // 픽셀 정보 업데이트
        pixels[pixelId].text = text;
        pixels[pixelId].link = link;
        
        // 이벤트 발생
        emit PixelUpdated(msg.sender, pixelId, text, link);
    }
    
    // 특정 픽셀 정보 조회
    function getPixel(uint256 x, uint256 y) external view returns (Pixel memory) {
        uint256 pixelId = _getPixelId(x, y);
        return pixels[pixelId];
    }
    
    // 모든 픽셀 정보 조회
    function getAllPixels() external view returns (Pixel[] memory) {
        Pixel[] memory allPixels = new Pixel[](CANVAS_SIZE * CANVAS_SIZE);
        
        for (uint256 x = 0; x < CANVAS_SIZE; x++) {
            for (uint256 y = 0; y < CANVAS_SIZE; y++) {
                uint256 pixelId = _getPixelId(x, y);
                allPixels[pixelId] = pixels[pixelId];
            }
        }
        
        return allPixels;
    }
    
    // 컨트랙트 잔액 조회
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    // 소유자가 수익 인출 (컨트랙트 소유자만)
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
