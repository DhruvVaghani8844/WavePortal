import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import abi from "./utils/WavePortal.json";


const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x8Fb3097a35cD6eF984C36F427C808aF046Ce42bd";
  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  const checkIfalletIsConnected = () => { // First make sure we have access to window.ethereum
    const {ethereum } = window;
     if (!ethereum) {
    console.log("Make sure you have metamask!") 
    return
    } else {
    console.log("We have the ethereum object", ethereum) 
  }
    // Check if we access to an authorized account.
    
    ethereum.request({ method: 'eth_accounts' })
    .then(accounts => {
    console.log(accounts)
    if (accounts.length != 0) { 
      const account = accounts [0];
    console.log("Found an authrorized account: ", account);
    setCurrentAccount (account);

    getAllWaves();
    } else {
    console.log("No authorized account found");
    }
  })
}
const getAllWaves = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      /*
       * Call the getAllWaves method from your Smart Contract
       */
      const waves = await wavePortalContract.getAllWaves();


      /*
       * We only need address, timestamp, and message in our UI so let's
       * pick those out
       */
      let wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });

      /*
       * Store our data in React State
       */
      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!")
    }
  } catch (error) {
    console.log(error);
  }
}



  



const wave = async () => {
  try {
    const { ethereum } = window;
   


    if (ethereum) {
      console.log(ethereum);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log("contract ",contractAddress,"abi", contractABI,"signer" ,signer);
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log(wavePortalContract);
      // let count = await wavePortalContract.getTotalWaves();
      // console.log("Retrieved total wave count...", count);
      let count=0;

      /*
      * Execute the actual wave from your smart contract
      */
     
      const waveTxn = await wavePortalContract.wave();
      alert("Mining...", waveTxn.hash);

      await waveTxn.wait();
      alert("Mined -- ", waveTxn.hash);

      count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error);
  }
}


  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };
  

  /*
   * This runs our function when the page loads.
   * More technically, when the App component "mounts".
   */
  useEffect(async () => {
    // const account = await findMetaMaskAccount();
    // if (account !== null) {
    //   setCurrentAccount(account);
    checkIfalletIsConnected();
    // }
  }, []);
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Dhruv Vaghani and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
export default App;