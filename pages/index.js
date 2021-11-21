import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head'
import abi from '../utils/WavePortal.json'

const contractAddress = "0xa75ac43434D97dA0254329774627ceD354af6977";
const contractABI = abi.abi

function getContractFactory() {
  const { ethereum } = window;

  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    alert("Ethereum object doesn't exist!");
  }
}

export default function Home() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentWave, setCurrentWave] = useState(0)
  const [isLoading, setLoading] = useState(false)

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
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
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
        retriveTotalWave();
      } catch (error) {
        console.log(error)
      }
    }

    const retriveTotalWave = async () => {
      const _wavePortalContract = getContractFactory();
      const _count = await _wavePortalContract.getTotalWaves();
      setCurrentWave(_count.toNumber())
    }

  useEffect(() => {
    checkIfWalletIsConnected();
    currentAccount && retriveTotalWave()
  }, [currentAccount])
  
  const wave = async () => {

    if (!currentAccount) {
      alert("Connect your wallet first please")
      return
    }

    setLoading(true)
    try {
      const { ethereum } = window;

      if (ethereum) {
        const wavePortalContract = getContractFactory();

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        setCurrentWave(count.toNumber())
        setLoading(false)
      } else {
        console.log("Ethereum object doesn't exist!");
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
          I am Ihsan! Connect your Ethereum wallet and wave at me!
        </div>

        {
          currentAccount && <div className="bio">
            Total Wave: {currentWave}
          </div>
        }

        <button disabled={isLoading} className="waveButton" onClick={wave}>
          {isLoading ? 'Loading' : 'Wave at Me'}
        </button>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
      <style jsx>{`
        .mainContainer {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 64px;
        }

        .dataContainer {
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-width: 600px;
        }

        .header {
          text-align: center;
          font-size: 32px;
          font-weight: 600;
        }

        .bio {
          text-align: center;
          color: gray;
          margin-top: 16px;
        }

        .waveButton {
          cursor: pointer;
          margin-top: 16px;
          padding: 8px;
          border: 0;
          border-radius: 5px;   
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        code {
          font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
            monospace;
        }
      `}</style>
    </div>
  );
}
