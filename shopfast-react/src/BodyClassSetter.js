// BodyClassSetter.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BodyClassSetter = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const pathSuffix = location.pathname.substring(1); // Remove leading slash
    if (pathSuffix.length === 0) {
        document.body.className = "home";
    } else {
        document.body.className = pathSuffix;
    }
  }, [location.pathname]);

  return children;
};

export default BodyClassSetter;
