import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Recaptcha from 'react-recaptcha';
import CustomCheckbox from '@components/CustomCheckbox';

import inputStyles from '@modularStyles/inputs.module.css';

import styles from './SitePolicies.module.css';

const SitePolicies = ({ onAccept }) => {
  const [tosChecked, setTosChecked] = useState(false);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);
  const [captchaScore, setCaptchaScore] = useState(null);

  const handleAccept = (event) => {
    event.preventDefault();
    console.log("Accepted SpeedCart policies");
    // Perform validation and accept logic
    onAccept();
  };

  const handleCaptchaVerify = (token) => {
    // Perform verification on your backend
    // You can also send the token to your backend for validation

    // Assuming you receive a score from your backend
    // and set it in state
    const score = 0.7; // Example score received from backend
    setCaptchaScore(score);

    // You can also call onAccept here if needed
    // e.g., if the score is above a certain threshold
    if (score >= 0.5) {
      // Log a success message
      console.log('reCAPTCHA verification succeeded!');
      onAccept();
    }
  };


  return (
    <form>
      <h2>Terms of Service and Privacy Policy</h2>
      <CustomCheckbox 
        name="acceptToS" 
        checked={tosChecked}
        onChange={() => setTosChecked(!tosChecked)} 
      >
        I agree to the&nbsp;<Link to="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className={styles.staticStyledLink}>Terms of Service</Link>
      </CustomCheckbox>
      <CustomCheckbox 
        name="acceptPrivacyPolicy"
        checked={privacyPolicyChecked} 
        onChange={() => setPrivacyPolicyChecked(!privacyPolicyChecked)}
      >
        I agree to the&nbsp;<Link to="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className={styles.staticStyledLink}>Privacy Policy</Link>
      </CustomCheckbox>
      {/* Privacy Policy checkbox */}
      <Recaptcha
        sitekey="6LfKG7opAAAAAKt1thtSlyKGuBMcEM5lzRquyjw1"
        // handle reCAPTCHA verification
        onChange={handleCaptchaVerify}
      />
      <br />
      <input type="submit" value="Submit" className={`${inputStyles.smallButton} ${inputStyles.input}`} onClick={handleAccept}
      disabled={!tosChecked || !privacyPolicyChecked} />
      {captchaScore && <p>Captcha Score: {captchaScore}</p>}
    </form>
  );
};

export default SitePolicies;
