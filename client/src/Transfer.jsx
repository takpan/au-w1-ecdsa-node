import { useState, useEffect } from "react";
import server from "./server";
import  { keccak256 } from "ethereum-cryptography/keccak";
import  { secp256k1 } from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ senderAddress, privateKeyList, accountList, setAccountList }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState();
  const [privateKey, setPrivateKey] = useState("");
  const [privateKeyPromptVisible, setPrivateKeyPromptVisible] = useState(false);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  useEffect(() => {
    updatePrivateKeyPromptVisibility();
  }, [senderAddress]);

  async function updatePrivateKeyPromptVisibility() {
    if (senderAddress !== "" && !privateKeyList.hasOwnProperty(senderAddress)) {
      alert("Private key for the sender address was not found locally, please type it manually. If you have the ownership of the account and you have not store the private key securely, your 'funds' have been lost!");
      setPrivateKeyPromptVisible(true);
    } else {
      setPrivateKeyPromptVisible(false);
      setPrivateKey(privateKeyList[senderAddress] || "")
    }
  }

  async function transfer(evt) {
    evt.preventDefault();

    // Validate sender and recipient addresses
    if (!senderAddress || !recipientAddress) {
      alert("Sender and recipient addresses must be selected.");
      return;
    }

    if (senderAddress === recipientAddress) {
      alert("Sender and recipient addresses cannot be the same.");
      return;
    }

    if (!/^[0-9A-Fa-f]+$/.test(privateKey.slice(2))) {
      alert("Invalid private key");
      return;
    }

    // Create signature
    const msg = senderAddress + recipientAddress + toString(sendAmount);
    const msgHash = keccak256(utf8ToBytes(msg));
    const signature = secp256k1.sign(msgHash, BigInt(privateKey));
    const signatureHexStr = signature.toCompactHex();

    try {
      // Send transaction to the server
        await server.post(`send`, {
        sender: senderAddress,
        recipient: recipientAddress,
        amount: parseInt(sendAmount),
        signatureHexStr: signatureHexStr,
        recovery: signature.recovery
      });

      // Fetch updated balances from the server
      const {
        data: { balances },
      } = await server.get(`list`);
      setAccountList(balances);
    } catch (e) {
      alert(e.response.data.message);
    }
  }

  const handleAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  };

  return (
      <form className="container transfer" onSubmit={transfer}>
        <h1>Send Transaction</h1>

        <label>
          Send Amount
          <input
            placeholder="1, 2, 3..."
            value={sendAmount}
            onChange={setValue(setSendAmount)}
          ></input>
        </label>

        <div>
          <label htmlFor="recipientDropdown">Recipent Address:</label>
          <select id="recipientDropdown" className="dropdown recipient" value={recipientAddress} onChange={handleAddressChange}>
            <option value="">Select a wallet address...</option>
            {Object.keys(accountList).map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>

        {privateKeyPromptVisible && (
        <label>
          Type the private key of the sender's address:
          <input
            placeholder="0x..."
            onChange={setValue(setPrivateKey)}
          ></input>
        </label>
        )}

        <input type="submit" className="button" value="Transfer" />
      </form>
  );
}

export default Transfer;
