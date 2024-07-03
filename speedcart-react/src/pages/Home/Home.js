import React, { useState, useEffect } from 'react';

import SiteLogo from '@components/SiteLogo';
import TransitionSection from '@components/TransitionSection';
import TermsOfService from '@components/TermsOfService';

// Import images
import timeOptimizationImage from '@assets/images/phoneGPS.png'; // Image from: https://unsplash.com/photos/a-man-driving-a-car-with-a-flag-hanging-from-the-dash-ZIp6VRx_DaI
import adaptabilityImage from '@assets/images/freshProduce.jpg'; // Image from: https://unsplash.com/photos/row-of-vegetables-placed-on-multilayered-display-fridge-NpNvI4ilT4A
import reusabilityImage from '@assets/images/phoneAndLaptop.jpg';// Image from: https://unsplash.com/photos/silver-iphone-6-on-macbook-pro--aC2BL0GICs

import styles from './Home.module.css';

const Home = (props) => {
  const [showToS, setShowToS] = useState(true);

  useEffect(() => {
    const hasAcceptedToS = localStorage.getItem('acceptedToS');
    if (hasAcceptedToS) {
      setShowToS(false);
    }
    document.title = "SpeedCart | Your destination for optimal shopping routes";
  }, []);

  const handleToSAccept = () => {
    localStorage.setItem('acceptedToS', 'true');
    setShowToS(false);
  };

  return (
    <div id={props.id}>
      {showToS ? (
        <TermsOfService onAccept={handleToSAccept} />
      ) : (
        <>
          <TransitionSection additionalClasses="centerAlignment" showClasses={[styles.inView]} hiddenClasses={[styles.outOfView]}>
            <SiteLogo />
            <h1 className={styles.heading}>Welcome to SpeedCart</h1>
            <p>Explore the best way to manage your grocery lists</p>
          </TransitionSection>
          <TransitionSection additionalClasses="leftAlignment" showClasses={[styles.inView]} hiddenClasses={[styles.leftOutOfView, styles.outOfView]}>
            <div className={styles.content}>
              <h2 className={styles.subHeading}>Time Optimization</h2>
              <p>
                SpeedCart is a software application that gives plausible routes for your list of groceries
                so you can save time. In order to stay up to date with changes in these routes, SpeedCart
                maintains information with assistance of public APIs to ensure you always get an efficient
                route even when faced with roadwork on previously used routes.
              </p>
              <img src={timeOptimizationImage} alt="Time Optimization" className={styles.image} />
              <p>
                Our advanced algorithms prioritize your time by finding the shortest and fastest routes. 
                Whether you're shopping for a quick meal or stocking up for the week, SpeedCart ensures 
                you spend less time driving and more time enjoying your groceries.
              </p>
            </div>
          </TransitionSection>
          <TransitionSection additionalClasses="rightAlignment" showClasses={[styles.inView]} hiddenClasses={[styles.rightOutOfView, styles.outOfView]}>
            <div className={styles.content}>
              <h2 className={styles.subHeading}>Adaptability</h2>
              <p>
                Shopping often involves items that require near-constant refrigeration; SpeedCart
                accounts for this by leaving such items at the end of your route for lower risk
                of spoiling your perishables.
              </p>
              <img src={adaptabilityImage} alt="Adaptability" className={styles.image} />
              <p>
                Our system adapts to your needs, adjusting routes based on the specific requirements of your groceries. 
                No more worrying about melted ice cream or wilted greens. SpeedCart ensures your items remain fresh from 
                store to home.
              </p>
            </div>
          </TransitionSection>
          <TransitionSection additionalClasses="centerAlignment" showClasses={[styles.inView]} hiddenClasses={[styles.outOfView]} id="reusabilityFeature">
            <div className={styles.content}>
              <h2 className={styles.subHeading}>Reusability (date TBD)</h2>
              <p>
                Retaining knowledge of entire grocery lists becomes nearly impossible as they grow
                in length; SpeedCart will provide you the option of using a mobile app
                version that keeps track of the same lists you input on our site for use on the go,
                including the ability to modify those lists and reuse our site's functionality
                on an interface more suited to smaller screen sizes.
              </p>
              <img src={reusabilityImage} alt="Reusability" className={styles.image} />
              <p>
                With SpeedCart's reusability feature, you can save and reuse your grocery lists, making 
                your shopping experience even more efficient. Whether it's weekly groceries or special 
                event preparations, SpeedCart has you covered.
              </p>
            </div>
          </TransitionSection>
        </>
      )}
    </div>
  );
}

export default Home;
