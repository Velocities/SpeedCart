// src/components/Home.js
import React from 'react';
import SiteLogo from './SiteLogo.js';
import styles from './css/Home.module.css';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function Home() {
  return (
    <div className={styles.topElement}>
      <h1>Welcome to SpeedCart</h1>
      <p>Explore the best way to manage your grocery lists.</p>
      <SiteLogo />
      <h2>Time Optimization</h2>
      <p>
        SpeedCart is a software application that gives plausible routes for your list of groceries
        so you can save time. In order to stay up to date with changes in these routes, SpeedCart
        maintains information with assistance of public APIs to ensure you always get an efficient
        route even when faced with roadwork on previously used routes.
      </p>
      <h2>Adaptability</h2>
      <p>
        Shopping often involves items that require near-constant refridgeration{String.fromCodePoint(0x003)}
        SpeedCart accounts for this by leaving such items at the end of your route for lower risk
        of spoiling your perishables.
      </p>
    </div>
  );
}

export default Home;
