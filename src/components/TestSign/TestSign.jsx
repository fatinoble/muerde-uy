import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


const TestSign = ({ styleClassName }) => {
  const [isTestEnv, setIsTestEnv] = useState(false);

  useEffect(() => {
    const testEnv = Cookies.get('test');
    if (testEnv) {
      setIsTestEnv(true);
    }
  }, []);

  return (
    isTestEnv && <div className={styleClassName}>Test</div>
  );
};

export default TestSign;
