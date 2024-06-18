import { useEffect, useState } from "react";
import { useAccount } from "../context/UserContext";
import { Layout } from "../components/Layout";
import { ethers } from "ethers";
import { MultiSigWalletFactory } from "../utils/MultiSigWalletFactory";
import MultiSigWallet from "../utils/MultiSigWallet";
import { WalletDetails } from "../utils/type";
import { Modal } from "../components/Modal";
import { showToast } from "../utils/toaster";
import { Link } from "react-router-dom";
import { NoWalletConnected } from "../components/NoWalletConnected";
import { Empty } from "../components/Empty";
import { Loader } from "../components/Loader";
import { numReg } from "../utils/constants";
import { AddApprovalInput } from "../components/AddApprovalInput";

export function Home() {
  const account = useAccount();
  const [uiState, setUiState] = useState({
    loading: false,
    showModal: false,
    loadingData: false,
  });
  const [formState, setFormState] = useState<{
    quorem: number;
    approvals: string[];
    name: string;
  }>({
    quorem: 2,
    approvals: [],
    name: "",
  });
  const [walletDetails, setWalletDetails] = useState<WalletDetails[]>([]);
  useEffect(() => {
    _getWallets();
  }, [account?.address, account?.provider]);

  useEffect(() => {
    setInitialApprovals();
  }, [account?.address]);

  function setInitialApprovals() {
    if (!account) return;
    if (!account.address) return;
    setFormState({ ...formState, approvals: [account.address] });
  }

  async function _getWallets() {
    if (!account) return;
    if (!account.address) return;
    if (!account.provider) return;
    try {
      setUiState({ ...uiState, loadingData: true });
      const wallets = await MultiSigWalletFactory.getApprovalsWallet(
        account.address,
        account.provider,
      );

      const _walletDetails: WalletDetails[] = [];
      for (let wallet of wallets) {
        try {
          const detail = await getWalletDetails(wallet);
          const exist = _walletDetails.find(
            (w) => w.address === detail.address,
          );
          if (exist) continue;
          _walletDetails.push(detail);
        } catch (error) {
          throw error;
        }
      }
      setUiState({ ...uiState, loadingData: false });
      setWalletDetails([..._walletDetails]);
    } catch (error) {
      setUiState({ ...uiState, loadingData: false });
      console.log(error);
    }
  }

  function manageModal() {
    setUiState({ ...uiState, showModal: !uiState.showModal });
  }

  async function _createMultiSigWallet() {
    try {
      if (!account) return;
      if (!account.address) return;
      if (!account.provider) return;
      if (+formState.quorem < 2) {
        showToast("Invalid amount of quorom", "failed");
        return;
      }
      if (!formState.approvals) {
        showToast("Invalid Approval Value", "failed");
        return;
      }
      if (!formState.name) {
        showToast("Invalid Wallet Name", "failed");
        return;
      }
      if (formState.approvals.length < 2) {
        showToast("there should be at least 2 approval", "failed");
        return;
      }
      if (formState.quorem > formState.approvals.length) {
        showToast("number of quorem can't be greater than approvals", "failed");
        return;
      }
      for (let a of formState.approvals) {
        if (!ethers.isAddress(a)) {
          throw new Error(`${a} is not a valid Address`);
        }
      }

      setUiState({ ...uiState, loading: true });
      await MultiSigWalletFactory.createWallet(
        formState.approvals,
        formState.quorem,
        formState.name,
        account.provider,
        account.address,
      );
      showToast("Wallet Created!", "success");
      setUiState({ ...uiState, loading: false, showModal: false });
      _getWallets();
    } catch (error: any) {
      showToast(error.message, "failed");
      setUiState({ ...uiState, loading: false });
    }
  }

  async function getWalletDetails(address: string) {
    try {
      const instance = new MultiSigWallet(account?.provider, address);

      const promise = Promise.all([
        instance.getName(),
        instance.getApprovers(),
        account?.provider?.eth.getBalance(address),
      ]);
      const [name, approvals, balance] = await promise;
      const balanceInEth = account?.provider?.utils.fromWei(balance, "ether");
      const detail: WalletDetails = {
        address,
        name,
        approvals,
        balance: +(+balanceInEth).toFixed(3),
      };
      return detail;
    } catch (error) {
      throw error;
    }
  }

  function onApprovalChanged(id: number, value: string) {
    const updatedApproval = [...formState.approvals];
    updatedApproval[id] = value;
    setFormState({ ...formState, approvals: [...updatedApproval] });
  }

  function onApprovalRemoved(id: number) {
    const updatedApproval = [...formState.approvals];
    updatedApproval.splice(id, 1);
    setFormState({ ...formState, approvals: updatedApproval });
  }

  function addApproval() {
    const updatedApproval = [...formState.approvals];
    updatedApproval.push("");
    setFormState({ ...formState, approvals: [...updatedApproval] });
  }

  return (
    <Layout>
      <div className="flex w-full h-full bg-white">
        <Modal
          title="Add Wallet"
          show={uiState.showModal}
          onClose={manageModal}
        >
          <div className="flex flex-col w-full mt-6">
            <input
              type="text"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2"
              placeholder="enter wallet name..."
              required
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
            />
            <input
              type="number"
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2"
              placeholder="enter number of quorem"
              required
              onChange={(e) => {
                if (!numReg.test(e.target.value)) return;
                setFormState({ ...formState, quorem: +e.target.value });
              }}
            />
            {formState.approvals.map((a, i) => (
              <AddApprovalInput
                id={i}
                onChange={onApprovalChanged}
                onRemove={onApprovalRemoved}
                initialvalue={a}
                disabled={i === 0}
                key={i}
              />
            ))}
            <div
              onClick={addApproval}
              className="flex flex-row items-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 mx-1 text-blue-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <p className="font-sm text-blue-700">Add Approval</p>
            </div>

            <button
              onClick={_createMultiSigWallet}
              className="text-nowrap rounded-lg mt-6 w-full py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
              disabled={uiState.loading}
            >
              {uiState.loading ? "processing..." : "Create"}
            </button>
          </div>
        </Modal>
        {account ? (
          <div className="flex flex-col w-full">
            <div className="flex flex-row-reverse px-5 w-full my-3">
              <button
                onClick={manageModal}
                className="float-right text-nowrap rounded-lg mt-6 px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
              >
                Create Wallet
              </button>
            </div>
            {uiState.loadingData ? (
              <Loader />
            ) : (
              <div className="flex flex-col w-full overflow-y-auto px-5 py-5">
                {walletDetails.length > 0 ? (
                  <table className="w-full text-left text-sm text-slate-500  rtl:text-right">
                    <thead className="bg-blue-50 text-xs uppercase ">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Address
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Wallet balance
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletDetails.map((w, i) => {
                        return (
                          <tr
                            key={i}
                            className="border-b bg-white-50 hover:bg-blue-50 cursor-pointer"
                          >
                            <td
                              scope="row"
                              className="whitespace-nowrap px-6 py-4 font-medium"
                            >
                              {i + 1}
                            </td>
                            <td className="px-6 py-4">{w.address}</td>
                            <td className="px-6 py-4">{w.name}</td>
                            <td className="px-6 py-4">{w.balance} RWA</td>
                            <td className="px-6 py-4">
                              <Link to={`/wallet/transfers/${w.address}`}>
                                <button className="text-nowrap rounded-lg  w-full px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400">
                                  View Wallet
                                </button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <Empty>
                    <p>No Wallet</p>
                  </Empty>
                )}
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
