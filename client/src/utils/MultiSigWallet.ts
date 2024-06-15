import { parseEther } from "ethers";
import MultiSigWalletAbi from "../abi/MultiSigWallet.json";
import { showToast } from "./toaster";
import { Transaction } from "./type";
const MULTISIG_CONTRACT_ADDRESS = "0x9D1e369d68Bc381Ee8104CB8A7cE333583992695";

class MultiSigWallet {
  contract;
  client;

  constructor(_client: any, walletAddress: string) {
    this.client = _client;
    this.contract = new this.client.eth.Contract(
      MultiSigWalletAbi.abi,
      walletAddress
    );
  }

  async getName() {
    return await this.contract.methods.name().call();
  }

  async getApprovers() {
    return await this.contract.methods.getApprovers().call();
  }

  async getTransfers(): Promise<any[]> {
    return await this.contract.methods.getTransfers().call();
  }

  async getTransactions(): Promise<Transaction[]> {
    const transactionCount = await this.contract.methods
      .transactionCount()
      .call();
    const transactions = [];
    for (let i = 1; i < transactionCount; i++) {
      const _transaction = await this.contract.methods.getTransaction(i).call();
      if (_transaction && _transaction.id) {
        transactions.push(_transaction);
      }
    }
    return transactions;
  }

  // createTransfer(uint amount, address payable to)
  async createTransfer(
    amount: any,
    to: any,
    walletAddress: string,
    fromAddress: string
  ) {
    try {
      let action = await this.contract.methods.createTransfer(
        parseEther(amount),
        to
      );
      let gas = Math.floor(
        (await action.estimateGas({ from: fromAddress })) * 1.4
      );

      let txn = await this._sendTransaction(
        action,
        gas,
        walletAddress,
        fromAddress
      );
      // console.log({ txn });

      return { ok: true, data: txn };
    } catch (error: any) {
      throw error;
    }
  }

  async createTransaction(
    to: string,
    data: string,
    walletAddress: string,
    fromAddress: string
  ) {
    try {
      let action = await this.contract.methods.createTransaction(to, data);
      let gas = Math.floor(
        (await action.estimateGas({ from: fromAddress })) * 1.4
      );

      let txn = await this._sendTransaction(
        action,
        gas,
        walletAddress,
        fromAddress
      );
      // console.log({ txn });

      return { ok: true, data: txn };
    } catch (error: any) {
      throw error;
    }
  }

  async approveTransfer(id: any, walletAddress: string, fromAddress: string) {
    try {
      let action = await this.contract.methods.approveTransfer(id);
      let gas = Math.floor(
        (await action.estimateGas({ from: fromAddress })) * 1.4
      );

      let txn = await this._sendTransaction(
        action,
        gas,
        walletAddress,
        fromAddress
      );
      console.log({ txn });

      return { ok: true, data: txn };
    } catch (error) {
      throw error;
    }
  }

  async approveTransaction(id: any, walletAddress: string, fromAddress: string) {
    try {
      let action = await this.contract.methods.approveTransaction(id);
      let gas = Math.floor(
        (await action.estimateGas({ from: fromAddress })) * 1.4
      );

      let txn = await this._sendTransaction(
        action,
        gas,
        walletAddress,
        fromAddress
      );
      console.log({ txn });

      return { ok: true, data: txn };
    } catch (error) {
      throw error;
    }
  }

  async _sendTransaction(action: any, gas: any, to: any, fromAddress: string) {
    return await this.client.eth.sendTransaction({
      from: fromAddress,
      to,
      data: action.encodeABI(),
      gas, //   300000 GAS
      gasPrice: 500000000000, //  wei
    });
  }
}

export default MultiSigWallet;
