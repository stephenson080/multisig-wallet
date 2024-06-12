import { parseEther } from 'ethers';
import MultiSigWalletAbi from '../abi/MultiSigWallet.json';
import { showToast } from './toaster';
const MULTISIG_CONTRACT_ADDRESS = '0x9D1e369d68Bc381Ee8104CB8A7cE333583992695';

class MultiSigWallet {
    contract;
    client;
    fromAddress;

    constructor(_client: any, _fromAddress: any) {
        this.client = _client;
        this.fromAddress = _fromAddress;
        this.contract = new this.client.eth.Contract(
            MultiSigWalletAbi.abi,
            MULTISIG_CONTRACT_ADDRESS.trim()
        );
    }

    async getApprovers() {
        return await this.contract.methods.getApprovers().call();
    }

    async getTransfers() {
        return await this.contract.methods.getTransfers().call();
    }

    // createTransfer(uint amount, address payable to)
    async createTransfer(amount: any, to: any) {
        try {
            let action = await this.contract.methods.createTransfer(parseEther(amount), to);
            let gas = Math.floor((await action.estimateGas({ from: this.fromAddress })) * 1.4);

            let txn = await this._sendTransaction(action, gas, MULTISIG_CONTRACT_ADDRESS);
            // console.log({ txn });

            showToast('Transfer created successfully.', 'success')
            return { ok: true, data: txn };
        } catch (error: any) {
            showToast(error.code, 'failed')
            return { ok: false, data: error };
        }
    }


    async approveTransfer(id: any) {
        try {
            let action = await this.contract.methods.approveTransfer(id);
            let gas = Math.floor((await action.estimateGas({ from: this.fromAddress })) * 1.4);

            let txn = await this._sendTransaction(action, gas, MULTISIG_CONTRACT_ADDRESS);
            console.log({ txn });

            return { ok: true, data: txn };
        } catch (error) {
            return { ok: false, data: error };
        }
    }

    async _sendTransaction(action: any, gas: any, to: any) {
        return await this.client.eth.sendTransaction({
            from: this.fromAddress,
            to,
            data: action.encodeABI(),
            gas, //   300000 GAS
            gasPrice: 500000000000 //  wei
        });
    }
}


export default MultiSigWallet;