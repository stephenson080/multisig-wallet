import { connectToBrowserProvider } from "../utils/script";
import { truncateAddress } from "../utils/helpers";
import { useAccount } from "../context/UserContext";

const Header = () => {
  const account = useAccount();

  const connectWallet = async () => {
    let userAddress = await connectToBrowserProvider();
    if (userAddress) {
      if (account?.updateAddress) {
        account.updateAddress(userAddress);
      }
    }
  };

  function disconnectWallet() {
    account?.updateAddress("");
    localStorage.removeItem("connectedAccount");
    location.replace("/");
  }
  return (
    <div
      className={`flex py-3 items-center ${
        account?.wallet ? "justify-between" : "justify-end"
      } px-5 bg-blue-50`}
    >
      {account && account.wallet && (
        <div>
          <h2>{account.wallet.name}</h2>
          <p className="text-gray-400">Bal: {account.wallet.balance} RWA</p>
          <p className="text-gray-400">
            {account.wallet.approvals.length} Wallet Approvals
          </p>
        </div>
      )}
      {account && account.address ? (
        <div className="flex flex-row items-center">
          <p className="text-sm font-bold capitalize mx-1">
            connected address: {truncateAddress(account.address)}
          </p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 cursor-pointer"
            data-tooltip-target="tooltip-default"
            onClick={disconnectWallet}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
            />
          </svg>
          <div
            id="tooltip-default"
            role="tooltip"
            className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-small text-black transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip"
          >
            Disconnect Wallet
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="text-nowrap rounded-lg px-5 py-2 text-[14px]/[20px] text-white capitalize bg-blue-400"
        >
          connect wallet
        </button>
      )}
    </div>
  );
};

export default Header;
