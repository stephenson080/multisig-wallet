import { useEffect } from "react";
import { useAccount } from "../context/UserContext";
import {
  createWallet,
  getApprovalsWallet,
} from "../web3/multiSigWalletFactory";
import { Layout } from "../components/Layout";
import { ethers } from "ethers";
import { MultiSigWalletFactory } from "../utils/MultiSigWalletFactory";

export function Home() {
  const account = useAccount();
  useEffect(() => {
    _getWallets();
  }, [account?.address, account?.provider]);
  async function _getWallets() {
    if (!account) return;
    if (!account.address) return;
    if (!account.provider) return;
    try {
      const wallets = await MultiSigWalletFactory.getApprovalsWallet(
        account.address,
        account.provider
      );
      console.log(wallets, "djdj");
    } catch (error) {
      console.log(error);
    }
  }

  async function _createMultiSigWallet() {
    try {
      if (!account) return;
      if (!account.address) return;
      if (!account.provider) return;
      console.log(account.provider, "pdpd");
      await MultiSigWalletFactory.createWallet(
        [account.address, "0xA6C3056b1B14FA5dFEa1D1c130cD9366FEf1B96b"],
        2,
        "New Wallet",
        account.provider,
        account.address
      );
    } catch (error) {}
  }
  return (
    <Layout>
      <div className="flex w-full h-full bg-white">
        {account ? (
          <div>
            <button onClick={_createMultiSigWallet}>Create Wallets</button>
          </div>
        ) : (
          <p>Connect Wallet</p>
        )}
      </div>
    </Layout>
  );
}
