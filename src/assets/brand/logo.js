import React from 'react';
import myImage from './logo.png'; // Adjust the path as necessary

export const Logo = ({ height }) => {
  return (
    <div className="d-flex justify-content-start align-items-center">
      {height === 'Big' ? (
        <>
          <img
            src={myImage}
            alt="Description of Image"
            height={55}
            width={80}
          />
          <span className="brand-name">thletically</span>
        </>
      ) : null}
    </div>
  );
};

// export default logo;
