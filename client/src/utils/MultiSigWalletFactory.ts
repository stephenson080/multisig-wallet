import MultiSigWalletFactoryABI from "../abi/MultiSigWalletFactory.json";
import web3 from 'web3'

import { ethers } from "ethers";

const multiSigWalletFactoryAddress =
  "0xb37DcfF1576Ae516992D4BB17dF694E3df258e17";


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
    //       ethers.getDefaultProvider("https://enugu-rpc.assetchain.org")
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
          const trx = await this._sendTransaction(provider,account, action,gas, multiSigWalletFactoryAddress)
          return trx
        } catch (error: any) {
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