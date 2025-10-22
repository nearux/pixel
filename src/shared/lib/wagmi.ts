import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

// GIWA Sepolia Testnet 설정
const giwaSepolia = {
  id: 91342,
  name: "GIWA Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_GIWA_SEPOLIA_RPC_URL!],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_GIWA_SEPOLIA_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: "GIWA Sepolia Explorer",
      url: "https://sepolia-explorer.giwa.io",
    },
  },
  testnet: true,
} as const;

export const config = createConfig({
  chains: [giwaSepolia, sepolia, mainnet],
  connectors: [metaMask()],
  transports: {
    [giwaSepolia.id]: http(),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
