import React from 'react';
import MySVG from '../SpeedCart.svg';
import styles from './css/SiteLogo.module.css';

function SiteLogo() {
  return (
    <img src={MySVG} id={styles.siteLogoImg} alt="Logo Description" />
  );
}

export default SiteLogo;
