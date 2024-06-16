import { useEffect, useState } from "react";
import { useAccount } from "../context/UserContext";
import { Layout } from "../components/Layout";
import { ethers } from "ethers";
import { MultiSigWalletFactory } from "../utils/MultiSigWalletFactory";
import MultiSigWallet from "../utils/MultiSigWallet";
import { truncateAddress } from "../utils/helpers";
import { WalletDetails } from "../utils/type";
import { Modal } from "../components/Modal";
import { useFormik } from "formik";
import { showToast } from "../utils/toaster";
import { Link, Outlet } from "react-router-dom";

export function Home() {
  const account = useAccount();
  const [uiState, setUiState] = useState({
    loading: false,
    showModal: false,
  });
  const [walletDetails, setWalletDetails] = useState<WalletDetails[]>([]);
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
      if (wallets.length > 0) {
        const _walletDetails = [];
        for (let wallet of wallets) {
          try {
            const detail = await getWalletDetails(wallet);
            _walletDetails.push(detail);
          } catch (error) {
            throw error;
          }
        }
        setWalletDetails([..._walletDetails]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function manageModal() {
    setUiState({ ...uiState, showModal: !uiState.showModal });
  }

  async function _createMultiSigWallet(
    _approvals: string[],
    quorem: number,
    name: string
  ) {
    try {
      if (!account) return;
      if (!account.address) return;
      if (!account.provider) return;
      setUiState({ ...uiState, loading: true });
      await MultiSigWalletFactory.createWallet(
        _approvals,
        quorem,
        name,
        account.provider,
        account.address
      );
      showToast("Wallet Created!", "success");
      setUiState({ ...uiState, loading: false, showModal: false });
      _getWallets();
    } catch (error: any) {
      showToast(error.message, "failed");
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

  const formik = useFormik({
    initialValues: {
      name: "",
      quorem: "",
      approvals: "",
    },
    onSubmit: async (values) => {
      console.log(values.approvals, "sja");
      if (!values.approvals) {
        showToast("Invalid Approval Value", "failed");
        return;
      }
      let approvals = values.approvals.split(",");
      if (!account) {
        showToast("No web3 provider detected!", "failed");
        return;
      }
      if (!approvals || approvals.length <= 0) {
        showToast("Invalid Approval Value", "failed");
        return;
      }
      approvals = [account.address!, ...approvals];
      await _createMultiSigWallet(approvals, +values.quorem, values.name);
    },
  });
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
              name="approvals"
              value={formik.values.approvals}
              onChange={formik.handleChange}
              placeholder="approvals (0xxxxxxxx, 0xxxxxxxx)"
              className="h-full w-full mt-3 rounded-sm bg-white bg-opacity-30 px-3 py-2 text-sm text-black outline outline-1 outline-offset-2 focus:border-none focus:outline-none"
            />
            <input
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              placeholder="enter wallet name..."
              className="h-full w-full mt-3 rounded-sm bg-white bg-opacity-30 px-3 py-2 text-sm text-black outline outline-1 outline-offset-2 focus:border-none focus:outline-none"
            />
            <input
              type="text"
              name="quorem"
              value={formik.values.quorem}
              onChange={formik.handleChange}
              placeholder="enter number of quorem"
              className="h-full w-full mt-3 rounded-sm bg-white bg-opacity-30 px-3 py-2 text-sm text-black outline outline-1 outline-offset-2 focus:border-none focus:outline-none"
            />

            <button
              onClick={() => formik.handleSubmit()}
              className="text-nowrap rounded-lg mt-6 w-full py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
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

            <div className="flex flex-col w-full overflow-y-auto px-5 py-5">
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
                      Approvals
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
                  {walletDetails.length > 0 ? (
                    walletDetails.map((w, i) => {
                      const approvals = w.approvals.map((a) =>
                        truncateAddress(a)
                      );
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
                          <td className="px-6 py-4">
                            {/* {truncateAddress(w.address)} */}
                            {w.address}
                          </td>
                          <td className="px-6 py-4">{w.name}</td>
                          <td className="px-6 py-4">{approvals.join(",")}</td>
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
                    })
                  ) : (
                    <p>No Wallet</p>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>Connect Wallet</p>
        )}
      </div>
    </Layout>
  );
}
