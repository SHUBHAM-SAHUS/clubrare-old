import React from 'react';
import '../../assets/styles/spinner.css';

const Spinner = () => {
  return (
    <div className="clubarare_loader flex justify-center pt-10">
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export { Spinner };
