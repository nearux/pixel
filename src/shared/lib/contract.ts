// PixelCanvas 컨트랙트 ABI
export const PIXEL_CANVAS_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "CANVAS_SIZE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PIXEL_PRICE",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EmptyText",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "sent",
        type: "uint256",
      },
    ],
    name: "InsufficientPayment",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
    ],
    name: "InvalidCoordinates",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pixelId",
        type: "uint256",
      },
    ],
    name: "NotPixelOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "pixelId",
        type: "uint256",
      },
    ],
    name: "PixelAlreadyOwned",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pixelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "link",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "PixelPurchased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "pixelId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "link",
        type: "string",
      },
    ],
    name: "PixelUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "getAllPixels",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "string",
            name: "link",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isOwned",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "purchaseTime",
            type: "uint256",
          },
        ],
        internalType: "struct PixelCanvas.Pixel",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
    ],
    name: "getPixel",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "text",
            type: "string",
          },
          {
            internalType: "string",
            name: "link",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isOwned",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "purchaseTime",
            type: "uint256",
          },
        ],
        internalType: "struct PixelCanvas.Pixel",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "ownerPixelCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        internalType: "string",
        name: "link",
        type: "string",
      },
    ],
    name: "purchasePixel",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "pixels",
    outputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        internalType: "string",
        name: "link",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isOwned",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "purchaseTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPixelsSold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "y",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "text",
        type: "string",
      },
      {
        internalType: "string",
        name: "link",
        type: "string",
      },
    ],
    name: "updatePixel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// 픽셀 데이터 타입
export interface PixelData {
  owner: string;
  text: string;
  link: string;
  isOwned: boolean;
  purchaseTime: bigint;
}
