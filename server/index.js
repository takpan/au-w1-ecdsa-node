// Import modules
const express = require("express");
const cors = require("cors");
const secp256k1 = require("ethereum-cryptography/secp256k1")
const keccak = require("ethereum-cryptography/keccak")
const utils = require("ethereum-cryptography/utils");

// Express
const app = express();
const port = 3042;

// Middleware
app.use(cors());
app.use(express.json());

// Object to store the accounts' balance
const balances = {};

// Endpoint to get balance of a specific address
app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

// Endpoint to add a new wallet
app.post("/add", (req, res) => {
  const { address, balance } = req.body;
  if (!address) {
    return res.status(400).send({ message: "No address value has been set" });
  }

  if (typeof balance !== 'number' || balance < 0) {
    return res.status(400).send({ message: "Please set a valid initial wallet balance" });
  }
  
  if (balances.hasOwnProperty(address)) {
    return res.status(400).send({ message: "Wallet has already been created" });
  }

  balances[address] = balance;
  res.send({ balances });
});

// Endpoint to get list of addresses
app.get("/list", (req, res) => {
  res.send({ balances });
});


app.post("/send", (req, res) => {
  const { sender, recipient, amount, signatureHexStr } = req.body;

  // Hash message
  const msg = sender + recipient + amount;
  const msgHash = keccak.keccak256(utils.utf8ToBytes(msg));

  // Recover public key
  const signature = secp256k1.secp256k1.Signature.fromCompact(signatureHexStr).addRecoveryBit(1);
  const publicKey = signature.recoverPublicKey(utils.toHex(msgHash)).toRawBytes();

  // Compare sender address with those obtained from recovered public key
  const recoveredAddress = "0x" + utils.toHex(keccak.keccak256(publicKey.slice(1)).slice(-20));

  if (sender !== recoveredAddress) {
    return res.status(400).send({ message: "Recovered public key from signature does not correspond to the sender's address. Are you the owner of the account?" });
  }

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds" });
  }


  // Update balances
  balances[sender] -= amount;
  balances[recipient] += amount;
  res.send({ balance: balances[sender] });

});

// start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
