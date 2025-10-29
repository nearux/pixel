import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PixelBoardModule = buildModule("PixelBoardModule", (m) => {
  const PixelBoard = m.contract("PixelBoard", []);

  return { PixelBoard };
});

export default PixelBoardModule;
