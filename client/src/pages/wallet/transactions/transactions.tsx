import { useEffect, useState } from "react";
import { useAccount } from "../../../context/UserContext";
import { Transaction, WalletDetails } from "../../../utils/type";
import MultiSigWallet from "../../../utils/MultiSigWallet";
import { Layout } from "../../../components/Layout";
import { Modal } from "../../../components/Modal";
import { useFormik } from "formik";
import { showToast } from "../../../utils/toaster";
import { ethers } from "ethers";
import { abiToFunction, truncateAddress } from "../../../utils/helpers";
import { AbiInput } from "../../../utils/type";
import { SAMPLEABI, SAMPLE_CONTRACT_ADDRESS } from "../../../utils/constants";
import { NoWalletConnected } from "../../../components/NoWalletConnected";

interface FormState {
  selectedFunction: AbiInput | null;
  functions: AbiInput[];
  useSampleAbi: boolean;
  inputValues: any;
  abi: string;
  contractaddress: string;
}

export function WalletTransactions() {
  const account = useAccount();
  const [wallet, setWallet] = useState<WalletDetails>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [uiState, setUiState] = useState({
    loading: false,
    showModal: false,
  });
  const [formState, setFormState] = useState<FormState>({
    selectedFunction: null,
    functions: [],
    useSampleAbi: true,
    inputValues: {},
    contractaddress: SAMPLE_CONTRACT_ADDRESS,
    abi: SAMPLEABI,
  });

  useEffect(() => {
    _getWallet();
  }, [account?.address, account?.provider]);

  useEffect(() => {
    _getWallet();
  }, [account?.address, account?.provider]);
  useEffect(() => {
    getFunctions();
  }, [formState.useSampleAbi]);

  function getFunctions(ABI?: any) {
    if (formState.useSampleAbi) {
      const _function = abiToFunction();
      setFormState({
        ...formState,
        functions: [..._function],
        abi: ABI ? ABI : SAMPLEABI,
      });
    } else {
      try {
        const _function = abiToFunction(ABI ? [...JSON.parse(ABI)] : undefined);
        setFormState({
          ...formState,
          functions: [..._function],
          abi: ABI ? ABI : SAMPLEABI,
        });
      } catch (error) {
        setFormState({
          ...formState,
          abi: ABI ? ABI : SAMPLEABI,
        });
        showToast("Error parsing abi to functions", "failed");
      }
    }
  }

  function getSelectedFunction(id: number) {
    const _selectedFunction = formState.functions[id];
    if (_selectedFunction) {
      const inputValues: any = {};
      for (let input of _selectedFunction.inputs) {
        inputValues[input.name] = "";
      }
      setFormState({
        ...formState,
        selectedFunction: { ..._selectedFunction },
      });
    }
  }

  function onInputChanged(input: { name: string; value: string }) {
    const updatedInputValue = { ...formState.inputValues };
    if (updatedInputValue[input.name]) {
      updatedInputValue[input.name] = input.value;
    } else {
      updatedInputValue[input.name] = input.value;
    }

    setFormState({
      ...formState,
      inputValues: updatedInputValue,
    });
  }

  async function _getWallet() {
    if (!account) return;
    if (!account.address || !account.provider) return;
    const walletAddress = location.pathname.split("/").pop();
    if (!walletAddress) return;
    try {
      setUiState({ ...uiState, loading: true });
      const { detail, _transactions } = await getWalletDetails(walletAddress);

      setWallet(detail);
      setTransactions(_transactions);
      setUiState({ ...uiState, loading: false });
    } catch (error) {
      setUiState({ ...uiState, loading: false });
    }
  }
  async function getWalletDetails(address: string) {
    try {
      const instance = new MultiSigWallet(account?.provider, address);

      const promise = Promise.all([
        instance.getName(),
        instance.getApprovers(),
        instance.getTransactions(),
        account?.provider?.eth.getBalance(address),
      ]);
      const [name, approvals, _transactions, balance] = await promise;
      const balanceInEth: string = account?.provider?.utils.fromWei(
        balance,
        "ether"
      );
      const detail: WalletDetails = {
        address,
        name,
        approvals,
        balance: +(+balanceInEth).toFixed(3),
      };
      return { detail, _transactions };
    } catch (error) {
      throw error;
    }
  }

  async function _approve(id: number, walletAddress: string) {
    try {
      if (!wallet) return;
      if (!account) return;
      if (!account.address || !account.provider) return;
      setUiState({ ...uiState, loading: true });
      try {
        await new MultiSigWallet(
          account.provider,
          wallet.address
        ).approveTransaction(id, walletAddress, account.address);
        setUiState({ ...uiState, loading: false });
        showToast("Operattion Successful", "success");
        _getWallet();
      } catch (error) {
        throw error;
      }
    } catch (error: any) {
      showToast(error.message, "failed");
      setUiState({ ...uiState, loading: false });
    }
  }

  function manageModal() {
    setUiState({ ...uiState, showModal: !uiState.showModal });
  }

  async function onSubmit() {
    try {
      if (!formState.selectedFunction) return;
      if (!formState.contractaddress) return;
      if (!account) return;
      if (!wallet) return;
      if (!account.provider || !account.address) return;
      setUiState({ ...uiState, loading: true });
      const inputs = [];
      for (let inp of formState.selectedFunction.inputs) {
        let value = formState.inputValues[inp.name];

        if (value) {
          if (inp.type === "number") {
            value = ethers.parseEther(value.toString());
          }
          inputs.push(value);
        }
      }
      if (formState.selectedFunction.inputs.length !== inputs.length) {
        throw new Error("Fill and Selected Function Field");
      }
      const _interface = new ethers.Interface(formState.abi);
      const data = _interface.encodeFunctionData(
        formState.selectedFunction.name,
        inputs
      );
      await new MultiSigWallet(
        account.provider,
        wallet.address
      ).createTransaction(
        formState.contractaddress,
        data,
        wallet.address,
        account.address
      );
      setUiState({ ...uiState, loading: false });
      showToast("Transaction Added!", "success");
      _getWallet();
    } catch (error: any) {
      showToast(error.message, "failed");
      setUiState({ ...uiState, loading: false });
    }
  }

  return (
    <Layout>
      <div className="flex w-full h-full bg-white">
        <Modal
          title="Add Transaction"
          show={uiState.showModal}
          onClose={manageModal}
        >
          <div className="flex flex-col w-full mt-6">
            <div className="flex flex-col w-full mt-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formState.useSampleAbi}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      useSampleAbi: e.target.checked,
                      contractaddress: SAMPLE_CONTRACT_ADDRESS,
                      abi: SAMPLEABI,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  Use Sample Contract
                </span>
              </label>
              <input
                type="text"
                name="contract_address"
                value={formState.contractaddress}
                placeholder="Enter Contract Address"
                className=" w-full mt-3 border border-gray-300 px-3 py-1 text-sm text-black  focus:border-none focus:outline-none"
                disabled={formState.useSampleAbi}
                onChange={(e) =>
                  setFormState({
                    ...formState,
                    contractaddress: e.target.value,
                  })
                }
              />

              <textarea
                name="abi"
                className="block p-2.5 h-200 w-full text-sm  rounded-lg border border-gray-300 my-3 focus:border-none focus:outline-none"
                placeholder="Enter Contract ABI..."
                rows={20}
                value={formState.abi}
                onChange={(e) => {
                  getFunctions(e.target.value);
                }}
                disabled={formState.useSampleAbi}
              ></textarea>
              {formState.functions.length > 0 && (
                <select
                  name="selected_function"
                  className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-none focus:outline-none block w-full p-2.5"
                  onChange={(e) => getSelectedFunction(+e.target.value)}
                >
                  <option>Choose a function</option>
                  {formState.functions.map((f, i) => (
                    <option key={i} value={i}>
                      {f.name}
                    </option>
                  ))}
                </select>
              )}
              {formState.selectedFunction &&
                formState.selectedFunction.inputs.map((i) => (
                  <input
                    key={i.name}
                    type={i.type}
                    name={i.name}
                    placeholder={`Enter ${i.name}`}
                    className=" w-full mt-3 border border-gray-300 px-3 py-1 text-sm text-black  focus:border-none focus:outline-none"
                    onChange={(e) =>
                      onInputChanged({ name: i.name, value: e.target.value })
                    }
                  />
                ))}
              <button
                onClick={onSubmit}
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
              <h4 className="font-black">Transactions</h4>
              <button
                onClick={manageModal}
                className="float-right text-nowrap rounded-lg px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
              >
                Add Transaction
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
                      Amount&nbsp;($)
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Recipient
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Approvals
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Executed
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Approve
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 &&
                    transactions.map((e, i: any) => (
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
                        <td className="px-6 py-4">{truncateAddress(e.data)}</td>
                        <td className="px-6 py-4">{truncateAddress(e.to)}</td>
                        <td className="px-6 py-4">{e.approvals}</td>
                        <td className="px-6 py-4">
                          {e.executed ? "true" : "false"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => _approve(e.id, wallet!.address)}
                            className="text-nowrap rounded-lg mt-6 w-full px-3 py-3 text-[16px]/[20px] text-white capitalize bg-blue-400"
                            disabled={uiState.loading}
                          >
                            {uiState.loading ? "processing..." : "Approve"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <NoWalletConnected />
        )}
      </div>
    </Layout>
  );
}
