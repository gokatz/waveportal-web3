import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import WaveItem from './components/WaveItem.jsx'
import AddWave from './components/AddWave.jsx'
import Intro from './components/Intro.jsx'

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [waves, setWaves] = useState([]);

  const contractAddress = "0x64FC0295286c4B86385D08aCDE3e2d9CC6582419";
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(currentAccount) {
      fetchAllWaves()
    }
  }, [currentAccount])


  const wavePortalContract = useMemo(() => {
    const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        return wavePortalContract
      }

    return null;
  }, [])

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAllWaves = async () => {
    if(wavePortalContract) {
      const waves = await wavePortalContract.getAllWaves();
      console.log(waves)
      let wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });
      setWaves(wavesCleaned);
    }

    return [];
  }


  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

    /*
  * New Wave Listener
  */
  useEffect(() => {
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      fetchAllWaves()
    };

    wavePortalContract?.on("NewWave", onNewWave);
  }, [])

  return (
    <div className="mainContainer">
      <div className="introContainer main">
        <Intro />
      </div>

      <div className="dataContainer">

        <div className="introContainer mobile">
          <Intro />
        </div>

        {
          !!currentAccount && (
            <>
              <div className="totalWaves">
                I've received {waves.length} 👋s so far!
              </div>

              <AddWave 
                contract={wavePortalContract}
              />
            </>
          )
        }

        {!currentAccount && (
          <button 
            className="waveButton" 
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}

        {waves.map((wave, index) => {
          return <WaveItem key={index} wave={wave} />
        })}
      </div>
    </div>
  );
}

export default App
