import React from 'react';
import MySVG from '../../assets/images/SpeedCart.svg';
import styles from './SiteLogo.module.css';

function SiteLogo() {
  return (
    <img src={MySVG} id={styles.siteLogoImg} alt="Logo Description" />
  );
}

export default SiteLogo;