import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { autoConnectWallet, getAddress, loadProvider } from "../utils/script";

// Define the shape of the context state
interface AccountContextState {
  provider: any;
  address: string | null;
  updateAddress: (address: string) => void;
}

// Define the props for the provider component
interface AccountProviderProps {
  children: ReactNode;
}

// set default state of the context state
export const AccountContext = createContext<AccountContextState>({
  address: null,
  provider: null,
  updateAddress: (_a: string) => {},
});

// The UserProvider component that wraps its children components in a UserContext Provider,
// allowing descendant components to subscribe to updates from the user object
export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
}) => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState<string | null>(null);

  let account = { provider, address };



  const fetchData = async () => {
    const provider = await loadProvider();
    const address = await autoConnectWallet();

    setProvider(provider);
    setAddress(address ? address : null);

  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      setAddress(accounts[0]);
    });
  }, []);

  

  return (
    <AccountContext.Provider
      value={{
        ...account,
        updateAddress(address) {
          setAddress(address);
        },
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

// this hook provides an easy way for descendant components to access the user data stored in the UserContext
export const useAccount = (): AccountContextState | undefined =>
  useContext(AccountContext);
