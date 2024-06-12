import { useEffect, useState } from "react";
import MultiSigWallet from "../utils/MultiSigWallet.js";
import { useAccount } from "../context/UserContext.js";
import { useFormik } from "formik";

const SideBar = () => {
  // const account = useAccount();
  // const [approvers, setApprovers] = useState([]);
  // const [isLoading, setisLoading] = useState(false);

  // const fetchApprovers = async () => {
  //   try {
  //     if (!account?.provider || !account?.address) {
  //       return;
  //     }

  //     const approvers = await new MultiSigWallet(
  //       account?.provider,
  //       account?.address
  //     ).getApprovers();

  //     setApprovers(approvers);
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // };

  // const formik = useFormik({
  //   initialValues: {
  //     to: "",
  //     amount: "",
  //   },
  //   onSubmit: async (values) => {
  //     await new MultiSigWallet(
  //       account?.provider,
  //       account?.address
  //     ).createTransfer(String(values.amount), values.to);

  //     setisLoading(false);
  //     fetchTransfers();
  //   },
  // });

  // useEffect(() => {
  //   fetchApprovers();
  // }, [account?.provider, account?.address]);

  return (
    <div className="flex flex-col gap-7 w-1/6 h-screen bg-blue-100 px-3 py-4">
      <div className="flex flex-col w-full text-center">
        <h2 className="font-black">MultiSig Wallet</h2>
        <p className="text-xs italic">...for Asset Chain</p>
      </div>
      <div className="flex flex-col w-full bg-blue-50 px-3 py-4 pb-10">
        <h4 className="text-sm font-bold">Transfer Funds {">>"}</h4>
        <h4 className="text-sm font-bold">Transactions {">>"}</h4>

        {/* <div className="flex flex-col w-full mt-6">
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
          >
            {isLoading ? "processing..." : "Send"}
          </button>
        </div> */}
      </div>
      {/* <div className="flex flex-col w-full bg-blue-50 px-3 py-4 pb-10">
        <h4 className="text-sm font-bold">Approvers {">>"}</h4>

        <div className="flex flex-col w-full mt-6 ">
          {approvers.length > 0 &&
            approvers.map((e, i) => (
              <div
                key={i}
                className="flex flex-col w-full overflow-auto mt-3 rounded-sm px-3 py-1 text-xs text-black border-b break-words break-all"
              >
                {e}
              </div>
            ))}
        </div>
      </div> */}
    </div>
  );
};

export default SideBar;
