import { useState } from "react";
import server from "./server";

function AddAccount({ newWalletAddress, newWalletPrivateKey, setAccountList, privateKeyList, setPrivateKeyList}) {
    const [initialBalance, setInitialBalance] = useState("");
    const [storePrivateKeyLocally, setStorePrivateKeyLocally] = useState(false);

    const setValue = (setter) => (evt) => setter(evt.target.value);

    const handleCheckboxChange = (event) => {
      setStorePrivateKeyLocally(event.target.checked);
    };

    async function addAccount(evt) {
      evt.preventDefault();

      try {
        await server.post(`add`, {
          address: newWalletAddress,
          balance: parseInt(initialBalance),
        });

        // Store private key locally if checkbox is checked
        if (storePrivateKeyLocally) {
          privateKeyList[newWalletAddress] = newWalletPrivateKey;
          setPrivateKeyList(privateKeyList);
        }
      } catch (e) {
        alert(e.response.data.message);
        return
      }

      try {
        const {
          data: { balances },
        } = await server.get(`list`);
        setAccountList(balances);
      } catch (e) {
        alert(e.response.data.message);
      }
    }

    return (
        <form className="container addWallet" onSubmit={addAccount}>
          <h1>Add Account</h1>

          <div className="address">Address: {newWalletAddress}</div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={storePrivateKeyLocally}
              onChange={handleCheckboxChange}
            />
            <label>Store the private key locally (to mimic ownership of the account)</label>
          </div>

          <label>
            Set initial account balance 
            <input
              placeholder="1, 2, 3..."
              value={initialBalance}
              onChange={setValue(setInitialBalance)}
            ></input>
          </label>

          <input type="submit" className="button" value="Add Account" />

          <p>* In the event of a page refresh, all locally stored private keys are lost.</p>
    
        </form>
      );
}

export default AddAccount;
