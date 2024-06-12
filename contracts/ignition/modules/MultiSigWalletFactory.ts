import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MultiSigWalletFactoryModule = buildModule("MultiSigWalletFactoryModule", (m) => {
  
    const multiSigWalletFactory = m.contract("MultiSigWalletFactory")
  
    return { multiSigWalletFactory };
  });
  
  export default MultiSigWalletFactoryModule;