import { useState } from "react";

function Account({ setSenderAddress, accountList }) {
  const [walletsVisible, toggleVisibility] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const buttonText = walletsVisible ? "Hide Accounts State" : "Show Accounts State";

  const handleAddressChange = (event) => {
    const address = event.target.value;
    setSelectedAddress(address);
    setSenderAddress(address);
  };

  async function listWallets(evt) {
    evt.preventDefault();
    toggleVisibility(!walletsVisible);
  }

  return (
    <div className="container wallet">
      <h1>Select Acount</h1>

      <div>
        <label htmlFor="senderDropdown">Sender address:</label>
        <select id="senderDropdown" className="dropdown sender" value={selectedAddress} onChange={handleAddressChange}>
          <option value="">Select an acount address...</option>
          {Object.keys(accountList).map((address) => (
            <option key={address} value={address}>
              {address}
            </option>
          ))}
        </select>
      </div>

      <div className="balance">Balance: {accountList[selectedAddress]}</div>

      <button className="button" onClick={listWallets}>{buttonText}</button>
      
      {walletsVisible && (
      <div>
            <table className="walletsTable">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(accountList).map(([address, balance]) => (
                <tr key={address}>
                  <td>{address}</td>
                  <td>{balance}</td>
                </tr>
                ))}
              </tbody>
            </table>
      </div>
      )}
    </div>
  );
}

export default Account;
