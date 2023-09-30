import { Button, Modal } from 'react-bootstrap';
import React, { memo } from 'react';
import reedem from '../../../assets/images/Reedem_mpvr_Withdraw.svg';
import './token-withdraw-model.scss';
import { Loading } from '../../loading';
import { imgConstants } from '../../../assets/locales/constants';

const TokenWithdrawmodel = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        open={props?.show}
        className="transfer_modal TokenWithdrawmodel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
      >
        <Modal.Header className="details_placebid_heading">
          <Modal.Title id="contained-modal-title-vcenter">
            Redeem MPWR
          </Modal.Title>
          <Button
            className="details_placebidmodal_closebtn"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.onCloseModal}
          >
            <img src={imgConstants.close} alt="img" />
          </Button>
        </Modal.Header>

        <Modal.Body className="transfer_modal_style">
          <div className="launch_proposal_wrp">
            <div className="token_launch_heading_wrp">
              <img src={reedem} alt="img" className="coin_img" />
              <h1>
                Your staked asset will be unstaked and redeemed for the
                following amount
              </h1>
            </div>

            <div className="row proposal_wrp">
              <div className="col-6 proposal_left_wrp pl-1">
                <p>Total Withdraw</p>
              </div>
              <div className="col-6 proposal_right_wrp pl-0 pr-0">
                <span>{props.totalwithdrablce} MPWR</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer
          className="placebid_btn_footer"
          style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
        >
          <Button
            className="ready_btn claim_btn"
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.onCloseModal}
          >
            Cancel
          </Button>
          <Button
            className="ready_btn"
            onClick={() => props.ReqTokenStaking('withdrawtoken')}
          >
            {' '}
            {props.tokenwithdrawloading ? (
              <div className="d-flex justify-content-center">
                {' '}
                <Loading margin={'0'} size={'25px'} />
              </div>
            ) : (
              'Confirm'
            )}{' '}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(TokenWithdrawmodel);
