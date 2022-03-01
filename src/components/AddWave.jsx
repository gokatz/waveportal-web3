import React, { useEffect, useState, useMemo } from "react";
import "./AddWave.css";
import { BiError } from 'react-icons/bi';
import { FaEthereum } from 'react-icons/fa';


const AddWave = ({ contract }) => {

  const [message, setMsg] = useState("");
  const [error, setError] = useState("");
  const [won, setWon] = useState(false);
  const [isWaving, setWaving] = useState(false);

  const wave = async () => {
    if(!message) {
      setError("Enter a message to wave!")
      return;
    }

    setError("")
    setWon(false)

    try {
      if (contract) {
        /*
        * Execute the actual wave from your smart contract
        */
        setWaving(true)
        try {
          const waveTxn = await contract.wave(message, { gasLimit: 300000 });
          console.log("Mining...", waveTxn.hash);
  
          const txnData = await waveTxn.wait();
          console.log("Mined -- ", waveTxn.hash);

          let wonEvent = txnData.events?.find(e => e.event === 'Won');

          if(wonEvent) {
            setWon(true)

            setTimeout(() => {
              setWon(false)              
            }, 5000)
          }

          // States
          setMsg("")
          setError("");
        } catch (error) {
          console.log(error);
          // error.error is from the contract 
          // error from any other context
          let err = error.error || error;
          setError(err.message);
        }

        setWaving(false)
      } else {
        console.log("Contact not found");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setWaving(false);
    }
  }
  
  return (
    <div className="waveContainer">
      <textarea 
        rows={3} 
        placeholder="Enter your message!" 
        value={message} 
        onChange={e => setMsg(e.target.value)}
        disabled={isWaving} 
      />

      {
        !!error && <div className="waveResponse waveError">
          <BiError /> &nbsp; {error}
        </div>
      }

      {
        !!won && <div className="waveResponse waveWon">
          <FaEthereum /> &nbsp; Congrats, You won 0.0002 ETH for waving at me!
        </div>
      }

      <button 
        className="waveButton" 
        onClick={wave} 
        disabled={isWaving}
      >
        {isWaving ?  "Waving..." : "Wave at Me"}
      </button>
    </div>
  )
}

export default AddWave;