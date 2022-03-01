import React, { useEffect, useState, useMemo } from "react";
import "./WaveItem.css";
import { BiWallet } from 'react-icons/bi';


const WaveItem = ({ wave }) => {
  return (<div className="waveDetails">
    <div className="wavePrimary">
      <small className="time">
        {getFormattedTime(wave.timestamp)}
      </small>
      <div className="waveMsg">👋 {wave.message}</div>
    </div>  

    <small>
      <BiWallet className="walletIcon" /> {wave.address}
    </small>
  </div>)
}

function getFormattedTime(t) {
  return t.toLocaleString()
}

export default WaveItem;