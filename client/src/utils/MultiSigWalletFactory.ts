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

export class MultiSigWalletFactory {
    private static getInstance(provider: any) {
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
    static async getApprovalsWallet(
        account: string,
        provider: ethers.Provider
      ) {
        try {
          const instance = this.getInstance(provider);
          const wallets = await instance.methods.getWalletsForApprover(account).call();
          console.log(wallets, 'wallet')
          return wallets;
        } catch (error) {
            throw error
        }
      }

      static async createWallet(
        approvals: string[],
        quorem: number,
        _name: string,
        provider: any,
        account: string
      ) {
        try {
          const instance = this.getInstance(provider);
          const action  = await instance.methods.createWallet(approvals, quorem, _name);
          let gas = Math.floor((await action.estimateGas({ from: account })) * 1.4);
          const trx = this._sendTransaction(provider,account, action,gas, multiSigWalletFactoryAddress)
          console.log({ trx });
        } catch (error: any) {
          console.error(error.message);
          throw error;
        }
      }

      static async _sendTransaction(provider: any, from: string, action: any, gas: any, to: any) {
        return await provider.eth.sendTransaction({
            from,
            to,
            data: action.encodeABI(),
            gas, //   300000 GAS
            gasPrice: 500000000000 //  wei
        });
    }
}