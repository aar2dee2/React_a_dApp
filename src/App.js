import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json'

export default function App() {
  // Creating a state variable to store the user's public wallet address
  const [currAccount, setCurrentAccount] = React.useState("")
  const contractAddress = "0xA26D8CEee1bBE0579Beb1B32394Ee7ca9B87cC32"
  const contractABI = abi.abi

  const checkIfWalletIsConnected = () => {
    //First make sure we have access to window.ethereum
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
    console.log(accounts)
    //There could be multiple accounts, check for one.
    if(accounts.length !== 0) {
      //Grab the first account we have access to.
      const account = accounts[0];
      console.log("Found an authorized account: ", account)
      //Store the user's public wallet address for later!
      setCurrentAccount(account);
      //I think getAllWaves should get called here
      getAllWaves()
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
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
  
  let waveCount = await wavePortalContract.getTotalWaves()
  console.log("Retrieved total wave count ...", waveCount.toNumber())

  const waveTxn = await wavePortalContract.wave("this is a message")
  console.log("Mining...", waveTxn.hash)
  await waveTxn.wait()
  console.log("Mined...", waveTxn.hash)

  waveCount = await wavePortalContract.getTotalWaves()
  console.log("Retrieved Total Wave Count...", waveCount.toNumber())
    
}

const[allWaves, setAllWaves] = React.useState([])
async function getAllWaves() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  let waves = await wavePortalContract.getAllWaves();

  let wavesCleaned = []
  waves.forEach(
    wave => {
      wavesCleaned.push({
        address: wave.address,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      })
    })

  setAllWaves(wavesCleaned)
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

        {allWaves.map((wave, index) => {
          return  (
            <div style={{backgroundColor: "OldLace", marginTop: "16px", padding: "8px", color: "black"}}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })
        }
      </div>
    </div>
  )
}
