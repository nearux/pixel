export const PIXEL_BOARD_V2_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EmptyMetadataCid",
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
        name: "pixelId",
        type: "uint256",
      },
    ],
    name: "InvalidPixelIndex",
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
        internalType: "string",
        name: "metadataCid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "purchaseCount",
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
        name: "metadataCid",
        type: "string",
      },
    ],
    name: "PixelUpdated",
    type: "event",
  },
  {
    inputs: [],
    name: "INITIAL_PIXEL_PRICE",
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
    name: "TOTAL_PIXELS",
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
    name: "getAllPixels",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadataCid",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isOwned",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "purchaseCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "purchaseTime",
            type: "uint256",
          },
        ],
        internalType: "struct PixelBoardV2.Pixel[]",
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
        name: "pixelId",
        type: "uint256",
      },
    ],
    name: "getPixel",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "string",
            name: "metadataCid",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isOwned",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "purchaseCount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "purchaseTime",
            type: "uint256",
          },
        ],
        internalType: "struct PixelBoardV2.Pixel",
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
        internalType: "uint256",
        name: "pixelId",
        type: "uint256",
      },
    ],
    name: "getPixelCurrentPrice",
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
        name: "pixelId",
        type: "uint256",
      },
    ],
    name: "getPixelPrice",
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
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "string",
        name: "metadataCid",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isOwned",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "purchaseCount",
        type: "uint256",
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
    inputs: [
      {
        internalType: "uint256",
        name: "pixelId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "metadataCid",
        type: "string",
      },
    ],
    name: "purchasePixel",
    outputs: [],
    stateMutability: "payable",
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
        name: "pixelId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "metadataCid",
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

export interface ContractPixel {
  id: bigint;
  owner: string;
  metadataCid: string;
  isOwned: boolean;
  purchaseCount: bigint;
  purchaseTime: bigint;
}

export interface Pixel extends Omit<ContractPixel, "id" | "purchaseCount"> {
  pixelIndex: number;
}
