import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {
  const checkIfWalletIsConnected = () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have your metamask")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }
  }

  React.useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const wave = () => {
    
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
      </div>
    </div>
  );
}
