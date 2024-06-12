import { connectToBrowserProvider } from "../utils/script";
import { truncateAddress } from "../utils/helpers";
import {useAccount } from "../context/UserContext";

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

  // useEffect(() => {
  //   let userAddress = connectToBrowserProvider();
  //   if (userAddress) setuserAddress(userAddress);
  // }, []);
  return (
    <div className="flex py-3 justify-end px-5 bg-blue-50">
      {account && account.address ? (
        <p className="text-sm font-bold capitalize">
          connected address: {truncateAddress(account.address)}
        </p>
      ) : (
        <button
          onClick={connectWallet}
          // disabled={disabled}
          className="text-nowrap rounded-lg px-5 py-2 text-[14px]/[20px] text-white capitalize bg-blue-400"
        >
          connect wallet
        </button>
      )}

      {/* {userAddress === "" && (
        <button
          onClick={connectWallet}
          // disabled={disabled}
          className="text-nowrap rounded-lg px-5 py-2 text-[14px]/[20px] text-white capitalize bg-blue-400"
        >
          connect wallet
        </button>
      )} */}
    </div>
  );
};

export default Header;
