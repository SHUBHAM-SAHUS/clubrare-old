import React, { memo } from "react";
import { Button, Modal } from "react-bootstrap";
import coin from "../../../assets/images/pool-stacking-Coins.svg";
import { imgConstants } from "../../../assets/locales/constants";
import { Loading } from "../../loading";
import "./lp-staking-modal.scss";

const LpStakingModel = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        open={props?.show}
        className='transfer_modal lpstacking_modal'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
      >
        <Modal.Header className='details_placebid_heading'>
          <Modal.Title id='contained-modal-title-vcenter'>Liquidity Pool Staking</Modal.Title>
          <Button
            className='details_placebidmodal_closebtn'
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.onCloseModal}
          >
            <img src={imgConstants.close} alt="img" />
          </Button>
        </Modal.Header>

        <Modal.Body className="transfer_modal_style">
          <div className="launch_proposal_wrp">
            <img src={coin} alt="img" className="coin_img" />
            <div className="row proposal_wrp">
              <div className="col-6 proposal_left_wrp pl-1">
                <p>NFT_Id</p>
              </div>
              <div className="col-6 proposal_right_wrp pl-0 pr-0">
                <span>{props.nftid} </span>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className='placebid_btn_footer' style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}>
          <Button
            className='ready_btn claim_btn'
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.onCloseModal}
          >
            Cancel
          </Button>

          <Button className='ready_btn' onClick={() => props.ReqpoolStaking('stakebtn', props.nftid, 0)}>
            {' '}
            {props.poolstakeloading ? (
              <div className='d-flex justify-content-center'>
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

export default memo(LpStakingModel);