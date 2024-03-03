import Account from "./Account";
import Transfer from "./Transfer";
import CreateWallet from "./CreateWallet";
import AddAccount from "./AddAccount";
import "./App.scss";
import { useState, useEffect } from "react";
import server from "./server";

function App() {
  const [senderAddress, setSenderAddress] = useState("");
  const [newWalletPrivateKey, setNewPrivateKey] = useState("");
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [accountList, setAccountList] = useState("");
  const [privateKeyList, setPrivateKeyList] = useState({});

  // Fetch the addresses from the server to initialize the select address drop-down lists
  useEffect(() => {
    getKnownAddresses();
  }, []);

  async function getKnownAddresses() {
    try {
      const {
        data: { balances },
      } = await server.get(`list`);
      setAccountList(balances);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
      <div className="app">
        <div className="row">
          <CreateWallet 
            setNewWalletAddress={setNewWalletAddress}
            setNewPrivateKey={setNewPrivateKey}
          />
          <AddAccount
            newWalletAddress={newWalletAddress}
            newWalletPrivateKey={newWalletPrivateKey}
            setAccountList={setAccountList}
            privateKeyList={privateKeyList}
            setPrivateKeyList={setPrivateKeyList}
          />
        </div>
        <div className="row">
          <Account
            setSenderAddress={setSenderAddress}
            accountList={accountList}
          />
          <Transfer 
            senderAddress={senderAddress}
            privateKeyList={privateKeyList}
            accountList={accountList}
            setAccountList={setAccountList}
          />
        </div>
        {/* <div>
          <TransactionHistory />
        </div> */}
      </div>
  );
}

export default App;
