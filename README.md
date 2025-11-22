# Pixel Board

A decentralized pixel ownership platform built on the GIWA blockchain network. Users can purchase, own, and customize pixels with images, titles, and links.

## Features

- **Pixel Purchase System**: Buy pixels on a 3x3 grid with a dynamic pricing mechanism (price doubles with each purchase)
- **IPFS Storage**: Images and metadata are stored on IPFS via Pinata, with only CIDs stored on-chain for gas efficiency
- **Ownership Management**: Track pixel ownership, purchase history, and update pixel content
- **Web3 Integration**: Built with wagmi and viem for seamless blockchain interactions

## How It Works

1. Users connect their wallet and browse available pixels
2. Click on any pixel (empty or owned) to purchase it
3. Upload an image, add a title and link
4. Image and metadata are uploaded to IPFS
5. Transaction is confirmed on GIWA network
6. Pixel ownership is recorded on-chain with IPFS CID
7. **Dynamic Pricing**: Each pixel can be repurchased by anyone, with the price doubling after each purchase (e.g., 0.00000001 ETH → 0.00000002 ETH → 0.00000004 ETH...)

## Upcoming Features

- **Progressive UI Enhancement**: Pixel visual effects and styling will become more sophisticated based on the number of transactions (purchaseCount), creating a visual progression system that rewards frequently traded pixels.
