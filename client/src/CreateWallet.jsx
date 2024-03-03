import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

function CreateWallet({ setNewWalletAddress, setNewPrivateKey }) {
    const [newAddress, setNewAddress] = useState("");
    const [newAddrPrivateKey, setNewAddrPrivateKey] = useState("");
    const [mouseDown, setMouseDown] = useState(false);
    
    const handlePrivateKeyClick = (evt) => {
        if (newAddress !== "") {
            setMouseDown(evt.type === 'mousedown');
        }
      };

    function createAddress() {
        const privateKey = secp256k1.utils.randomPrivateKey();
        const publicKey = secp256k1.getPublicKey(privateKey); // create a compressed public key
        const address = keccak256(publicKey.slice(1)).slice(-20);
        const privateKeyHex = "0x" + toHex(privateKey);
        const addresHex = "0x" + toHex(address);
        setNewAddress(addresHex);
        setNewAddrPrivateKey(privateKeyHex);
        setNewWalletAddress(addresHex);
        setNewPrivateKey(privateKeyHex);
    }

    return (
    <div className="container createAddress">
        <h1>Create Wallet</h1>

        <button className="button" onClick={createAddress}>Create a new wallet</button>

        <div className="address">Address: {newAddress}</div>

        <div>
            {!mouseDown ? (
                <div className="key" onMouseDown={handlePrivateKeyClick}>
                    Click to reveal private key
                </div>
            ) : (
                <div className="newContent">
                    <div className="key" onMouseUp={handlePrivateKeyClick}>{newAddrPrivateKey}</div>
                </div>
            )}
        </div>
    </div>
    );
}

export default CreateWallet;
