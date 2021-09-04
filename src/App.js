import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  // Creating a state variable to store the user's public wallet address
  const [currAccount, setCurrentAccount] = React.useState("")

  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have your metamask")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }

  // Check if we're authorized to access the user's wallet
  ethereum.request({ method: 'eth_accounts' })
  .then(accounts => {
    //There could be multiple accounts, check for one.
    if(accounts.length !== 0) {
      //Grab the first account we have access to.
      const account = accounts[0];
      console.log("Found an authorized account: ", account)

      //Store the user's public wallet address for later!
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found")
    }
  })

}

const connectWallet = () => {
  const { ethereum } = window;
  if (!ethereum) {
    alert("Get metamask")
  }
   ethereum.request({ method: "eth_requestAccounts" })
   .then(accounts => {
     console.log("Connected", accounts[0])
     setCurrentAccount(accounts[0])
   })
   .catch(err => console.log(err));
}

React.useEffect(() => {
  checkIfWalletIsConnected()
}, [])

const wave = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
    
}
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Sam and I work with Elixir and Solidity.  Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {currAccount ? null : (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )

        }

      </div>
    </div>
  );
}
