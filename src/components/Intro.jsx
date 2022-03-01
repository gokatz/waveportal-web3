import React, { useEffect, useState, useMemo } from "react";
import "./Intro.css";
import { BiWallet } from 'react-icons/bi';
import logoUrl from '../assets/logo.png'

const Intro = () => {
  return (
    <>
      <img src={logoUrl} className="profilePic"/>
      <div className="header">
      👋 Hey there!
      </div>
  
      <div className="bio">
        I am Gokul and I Build stuff over internet and I love it! Connect your Ethereum wallet and wave at me!
      </div>

      <div className="bio">
        Know more of my work on <a href="https://gokatz.me" target="_blank">gokatz.me</a>
      </div>
    </>
  )
}

export default Intro;