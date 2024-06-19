import { useEffect, useState } from "react";
import { useAccount } from "../../../context/UserContext";
import { Transfer, WalletDetails } from "../../../utils/type";
import MultiSigWallet from "../../../utils/MultiSigWallet";
import { Layout } from "../../../components/Layout";
import { Modal } from "../../../components/Modal";
import { useFormik } from "formik";
import { showToast } from "../../../utils/toaster";
import { ethers } from "ethers";
import { NoWalletConnected } from "../../../components/NoWalletConnected";
import { Loader } from "../../../components/Loader";
import { ApprovalsList } from "../../../components/ApprovalsList";

export function WalletTransfers() {
  const account = useAccount();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [uiState, setUiState] = useState({
    loading: false,
    showModal: false,
    loadingData: false,
  });

  useEffect(() => {
    _getWallet();
  }, [account?.address, account?.provider]);

  useEffect(() => {
    _getWallet();
  }, [account?.address, account?.provider]);

  async function _getWallet() {
    if (!account) return;
    if (!account.address || !account.provider) return;
    const walletAddress = location.pathname.split("/").pop();
    if (!walletAddress) return;
    try {
      setUiState({ ...uiState, loadingData: true });
      const { detail, _transfers } = await getWalletDetails(walletAddress);

      account.updateWallet(detail);
      setTransfers(_transfers);
      setUiState({ ...uiState, loadingData: false });
    } catch (error) {
      setUiState({ ...uiState, loadingData: false });
    }
  }
  async function getWalletDetails(address: string) {
    try {
      const instance = new MultiSigWallet(account?.provider, address);

      const promise = Promise.all([
        instance.getName(),
        instance.getApprovers(),
        instance.getTransfers(),
        account?.provider?.eth.getBalance(address),
      ]);
      const [name, approvals, _transfers, balance] = await promise;
      const balanceInEth: string = account?.provider?.utils.fromWei(
        balance,
        "ether",
      );
      const detail: WalletDetails = {
        address,
        name,
        approvals,
        balance: +(+balanceInEth).toFixed(3),
      };
      return { detail, _transfers };
    } catch (error) {
      throw error;
    }
  }

  async function _approve(id: number, walletAddress: string) {
    try {
      if (!account) return;
      if (!account.wallet) return;
      if (!account.address || !account.provider) return;
      setUiState({ ...uiState, loading: true });
      try {
        await new MultiSigWallet(
          account.provider,
          account.wallet.address,
        ).approveTransfer(id, walletAddress, account.address);
        setUiState({ ...uiState, loading: false });
        showToast("Operation Successful!", "success");
        _getWallet();
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      showToast(error.message, "failed");
      setUiState({ ...uiState, loading: false });
    }
  }

  const formik = useFormik({
    initialValues: {
      to: "",
      amount: "",
    },
    onSubmit: async (values) => {
      if (!account) return;
      if (!account.wallet) return;
      if (!account.address || !account.provider) return;
      try {
        if (account.wallet.balance < +values.amount)
          throw new Error("Insufficent Balance to create Transfer");
        setUiState({ ...uiState, loading: true });
        await new MultiSigWallet(
          account.provider,
          account.wallet.address,
        ).createTransfer(
          String(values.amount),
          values.to,
          account.wallet.address,
          account.address,
        );
        setUiState({ ...uiState, loading: false });
        showToast("Transfer added!", "success");
        _getWallet();
      } catch (error: any) {
        showToast(error.message, "failed");
        setUiState({ ...uiState, loading: false });
      }
    },
  });

  function manageModal() {
    setUiState({ ...uiState, showModal: !uiState.showModal });
  }

  return (
    <Layout>
      <div className="flex w-full h-full bg-white">
        <Modal
          title="Add Transfer"
          show={uiState.showModal}
          onClose={manageModal}
        >
          <div className="flex flex-col w-full mt-6">
            <div className="flex flex-col w-full mt-6">
              <input
                type="number"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                placeholder="Amount"
                className="h-full w-full mt-3 rounded-sm bg-white bg-opacity-30 px-3 py-1 text-sm text-black outline outline-1 outline-offset-2 focus:border-none focus:outline-none"
              />
              <input
                type="text"
                name="to"
                value={formik.values.to}
                onChange={formik.handleChange}
                placeholder="To"
                className="h-full w-full mt-3 rounded-sm bg-white bg-opacity-30 px-3 py-1 text-sm text-black outline outline-1 outline-offset-2 focus:border-none focus:outline-none"
              />
              <button
                onClick={() => formik.handleSubmit()}
                className="text-nowrap rounded-lg mt-6 w-full py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
                disabled={uiState.loading}
              >
                {uiState.loading ? "processing..." : "Send"}
              </button>
            </div>
          </div>
        </Modal>
        {account ? (
          <div className="flex flex-col w-full">
            <div className="flex flex-row px-5 w-full my-3 justify-between items-center">
              <h2 className="font-black">Transfers</h2>
              <button
                onClick={manageModal}
                className="float-right text-nowrap rounded-lg px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
              >
                Add Transfer
              </button>
            </div>
            <ApprovalsList
              approvals={
                account && account.wallet ? account.wallet.approvals : []
              }
            />
            {uiState.loadingData ? (
              <Loader />
            ) : (
              <div className="flex flex-col w-full overflow-y-auto px-5 py-5">
                <table className="w-full text-left text-sm text-slate-500  rtl:text-right">
                  <thead className="bg-blue-50 text-xs uppercase ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Amount&nbsp;($)
                      </th>
                      <th scope="col" className="px-6 py-3">
                        To Address
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Approvals
                      </th>
                      <th scope="col" className="px-6 py-3">
                        sent
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Approve
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers?.length > 0 &&
                      transfers.map((e, i) => (
                        <tr
                          key={i}
                          className="border-b bg-white-50 hover:bg-blue-50 cursor-pointer"
                        >
                          <td
                            scope="row"
                            className="whitespace-nowrap px-6 py-4 font-medium"
                          >
                            {Number(e.id) + 1}
                          </td>
                          <td className="px-6 py-4">
                            {ethers.formatEther(e.amount)}
                          </td>
                          <td className="px-6 py-4">{e.to}</td>
                          <td className="px-6 py-4">{e.approvals}</td>
                          <td className="px-6 py-4">
                            {e.sent ? "true" : "false"}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                _approve(e.id, account.wallet!.address)
                              }
                              className="text-nowrap rounded-lg mt-6 w-full px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
                              disabled={uiState.loading || e.sent}
                            >
                              {uiState.loading
                                ? "processing..."
                                : e.sent
                                  ? "Sent"
                                  : "Approve"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <NoWalletConnected />
        )}
      </div>
    </Layout>
  );
}
