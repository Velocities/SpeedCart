import React from 'react';
import MySVG from '../ShopFast.svg';
import styles from './css/SiteLogo.module.css';

function SiteLogo() {
  return (
    <img src={MySVG} id={styles.siteLogoImg} width="120px" height="120px" alt="Logo Description" />
  );
}

export default SiteLogo;
