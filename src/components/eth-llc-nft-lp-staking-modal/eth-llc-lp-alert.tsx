import React, { memo } from 'react';
import alert_close from '../../assets/images/alert_close.svg';
interface propsTypes{
  CloseAlertpopup: () => void;
  dataText:string;
  toastIcon:string;
}

const EthLlcAlert = ({ CloseAlertpopup, dataText, toastIcon }: propsTypes) => {
  return (
    <div>
      <div className='agov_dao_lpStaking_alert_wrp'>
        <div className='container-fluid'>
          <div className='agov_dao_lpStaking_alert'>
            <div className='alert_text'>
              <img src={toastIcon} alt='alert' />
              <p>{dataText}</p>
            </div>
            <div className='alert_dismis'>
              <button type='button' onClick={() => CloseAlertpopup()}>
                DISMISS
              </button>
              <img
                src={alert_close}
                alt='close'
                onClick={() => CloseAlertpopup()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(EthLlcAlert);
