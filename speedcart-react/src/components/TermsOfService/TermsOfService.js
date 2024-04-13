// src/components/TermsOfService.js
import React, {useState} from 'react';
import ReCAPTCHA from 'react-recaptcha';

const TermsOfService = ({ onAccept }) => {
  const [captchaScore, setCaptchaScore] = useState(null);

  const handleAccept = (event) => {
    event.preventDefault();
    console.log("accepted ToS");
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
      <h2>Terms of Service</h2>
      <label htmlFor="accept">
        I agree to the Terms of Service
      </label>
      <input type="checkbox" name="accept" />
      {/* Privacy Policy checkbox */}
      <ReCAPTCHA
        sitekey="6LfKG7opAAAAAKt1thtSlyKGuBMcEM5lzRquyjw1"
        // handle reCAPTCHA verification
        onChange={handleCaptchaVerify}
      />
      <input type="submit" value="Accept" onClick={handleAccept} />
      {captchaScore && <p>Captcha Score: {captchaScore}</p>}
    </form>
  );
};

export default TermsOfService;
