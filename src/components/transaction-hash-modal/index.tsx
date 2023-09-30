import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showHideModalAction } from '../../redux/actions/modal-actions';
import './transaction-modal.css';
declare const window: any;

const TransactionHashModal = (props: any) => {
  const transactionHash = useSelector(
    (state: any) => state.modalReducer.transactionHash,
  );
  const isModalVisible = useSelector(
    (state: any) => state.modalReducer.isModalVisible,
  );
  const dispatch = useDispatch();
  const copyToClipboard = () => {
    const element = document.getElementById('hashelement');
    if (element) {
      const range = document.createRange();
      range.selectNode(element);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
    }
  };
  return (
    <React.Fragment>
      {isModalVisible ? (
        <div className="transfer-address-backdrop">
          <div className="transfer-address-container">
            <div style={{ width: '100%' }}>
              <div className="w-100 d-flex justify-content-between mb-2">
                <label
                  className="field-label mb-1"
                  style={{ marginLeft: '5%' }}
                >
                  Please Secure the transaction hash
                </label>
                <i
                  onClick={copyToClipboard}
                  className="fas fa-copy"
                  style={{
                    marginRight: '5%',
                    color: '#ffc30b',
                    cursor: 'pointer',
                  }}
                ></i>
              </div>
              <div className="transaction-hash-cnt rounded" id="hashelement">
                {transactionHash}
              </div>
              <span
                style={{
                  color: 'red',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  marginLeft: '5%',
                }}
              >
                {props.submitError}
              </span>
            </div>
            <div className="btn-cnt">
              <button
                onClick={() => {
                  dispatch(showHideModalAction(false));
                }}
                className="transfer-btns"
                style={{}}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export { TransactionHashModal };
