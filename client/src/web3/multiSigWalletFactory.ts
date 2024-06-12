import MultiSigWalletFactoryABI from "../abi/MultiSigWalletFactory.json";
import web3 from 'web3'

import { ethers } from "ethers";

const multiSigWalletFactoryAddress =
  "0xc6B148A9bDcc3D7Ca29F2888D07869638e667552";

function createMultiSigWalletFactoryReadInstance(provider: any) {
    const instance = new provider.eth.Contract(
        MultiSigWalletFactoryABI.abi,
        multiSigWalletFactoryAddress
    );
//   const instance = new provider..Contract(
//     multiSigWalletFactoryAddress,
//     MultiSigWalletFactoryABI.abi,
//     new ethers.VoidSigner(
//       multiSigWalletFactoryAddress,
//       ethers.getDefaultProvider("https://rpctestnet.xendrwachain.com")
//     )
//   );

  return instance;
}

function createMultiSigWalletFactoryWriteInstance(
  signer: ethers.ContractRunner
) {
  const instance = new ethers.Contract(
    multiSigWalletFactoryAddress,
    MultiSigWalletFactoryABI.abi,
    signer
  );

  return instance;
}

export async function createWallet(
  approvals: string[],
  quorem: number,
  _name: string,
  signer: ethers.ContractRunner
) {
  try {
    const instance = createMultiSigWalletFactoryWriteInstance(signer);
    console.table(instance)
    const trx = await instance.createWallet(approvals, quorem, _name);
    console.log(trx);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

export async function getApprovalsWallet(
  account: string,
  provider: ethers.Provider
) {
  try {
    const instance = createMultiSigWalletFactoryReadInstance(provider);
    console.log(instance, 'sd')
    const wallets = await instance.methods.getWalletsForApprover(account).call();
    console.log(wallets, 'wallet')
    return wallets;
  } catch (error) {}
}
