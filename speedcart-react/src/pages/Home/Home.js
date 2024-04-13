// src/components/Home.js
import React, { useState, useEffect } from 'react';
import SiteLogo from '../../components/SiteLogo';
//import styles from './css/Home.module.css';
import mainSiteStyles from '../main.module.css';
import TransitionSection from '../../components/TransitionSection';
import TermsOfService from '../../components/TermsOfService';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const Home = (props) => {
  const [showToS, setShowToS] = useState(true); // Adjust the initial state as needed

  useEffect(() => {
    // Check if the user has already accepted the ToS
    const hasAcceptedToS = localStorage.getItem('acceptedToS');
    if (hasAcceptedToS) {
      setShowToS(false);
    }
  }, []);

  const handleToSAccept = () => {
    // Store the acceptance of ToS in local storage
    localStorage.setItem('acceptedToS', 'true');
    setShowToS(false);
  };

  return (
    <div className={mainSiteStyles.topElement} id={props.id}>
      {showToS ? (
        <TermsOfService onAccept={handleToSAccept} />
      ) : (
        <>
          <TransitionSection additionalClasses="centerAlignment">
            <SiteLogo />
              {/* Put back default styles that get removed upon wrapping with section element */}
              <h1 style={{ fontSize: '2em', marginBlockStart: '0.67em', marginBlockEnd: '0.67em' }}>Welcome to SpeedCart</h1>
              <p>Explore the best way to manage your grocery lists.</p>
          </TransitionSection>
          <TransitionSection additionalClasses="leftAlignment">
            <h2>Time Optimization</h2>
            <p>
              SpeedCart is a software application that gives plausible routes for your list of groceries
              so you can save time. In order to stay up to date with changes in these routes, SpeedCart
              maintains information with assistance of public APIs to ensure you always get an efficient
              route even when faced with roadwork on previously used routes.
            </p>
          </TransitionSection>
          <TransitionSection additionalClasses="rightAlignment">
            <h2>Adaptability</h2>
            <p>
              Shopping often involves items that require near-constant refridgeration{'\u003B'} SpeedCart
              accounts for this by leaving such items at the end of your route for lower risk
              of spoiling your perishables.
            </p>
          </TransitionSection>
          <TransitionSection additionalClasses="centerAlignment" id="reusabilityFeature">
              <h2>Reusability (date TBD)</h2>
              <p>
                Retaining knowledge of entire grocery lists becomes nearly impossible as they grow
                in length{'\u003B'} SpeedCart will provide you the option of using a mobile app
                version that keeps track of the same lists you input on our site for use on the go,
                including the ability to modify those lists and reuse our site's functionality
                on an interface more suited to smaller screen sizes.
              </p>
          </TransitionSection>
        </>
      )}
      
    </div>
  );
}

export default Home;
