import { useEffect, useState } from "react";
import MultiSigWallet from "../utils/MultiSigWallet.js";
import { useAccount } from "../context/UserContext.js";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

const SideBar = () => {
  const account = useAccount();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    getMultiSigWallet();
  }, []);

  function getMultiSigWallet() {
    const walletAddress = location.pathname.split("/").pop();
    if (!walletAddress) return;
    setWalletAddress(walletAddress);
  }

  return (
    <div>
      {/* Hamburger Icon */}
      <div className="md:hidden p-4">
        <button onClick={toggleSidebar}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`flex flex-col gap-7 w-1/6 h-screen bg-blue-100 px-3 py-4 md:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col w-full text-center">
          <h2 className="font-black">MultiSig Wallet</h2>
          <p className="text-xs italic">...for Asset Chain</p>
        </div>
        <div className="flex flex-col w-full bg-blue-50 px-3 py-4 pb-10">
          {account && walletAddress && (
            <>
              <Link to={`/wallet/transfers/${walletAddress}`}>
                <h4 className="text-sm font-bold">Transfer Funds {">>"}</h4>
              </Link>
              <Link to={`/wallet/transactions/${walletAddress}`}>
                <h4 className="text-sm font-bold">Transactions {">>"}</h4>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
