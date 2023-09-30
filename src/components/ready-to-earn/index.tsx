import React, { useState } from 'react';
import { Claim } from '../claim';
import './readytoearn.scss';
import { Modal, Button } from 'react-bootstrap';
import { imgConstants } from '../../assets/locales/constants';

const ReadyToEarn = (props: any) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="readytoearn_modal  readytoearn_reward_modal"
      >
        <Modal.Header>
          <Modal.Title>Ready to Earn</Modal.Title>
          <Button onClick={props.onHide}>
            <img src={imgConstants.close} alt="img" />
          </Button>
        </Modal.Header>

        <Modal.Body>
          <div className="Congratulations_wrp">
            <img src={imgConstants.Parachute} alt="img" />
            <div className="Congratulations">
              <h4>Congratulations!</h4>
              <p>All requirements have been met to claim your Airdrop</p>
            </div>
          </div>
          <div className="Additional_info_wrp">
            <h4>Additional info here</h4>
            <div className="rewards_wrp">
              <div className="rewards_heading">
                <img src={imgConstants.Medal} alt="img" />
                <h4>Reward</h4>
              </div>
              <div className="rewards_details_wrp">
                <div className="row rewards_details">
                  <div className="col-6 rewards_details_left_wrp pl-1 ">
                    <p>ClubRare Token</p>
                  </div>
                </div>
                <div className="row rewards_details">
                  <div className="col-6 rewards_details_left_wrp pl-1 ">
                    <p>Lazy Founder</p>
                  </div>
                  <div className="col-6 rewards_details_right_wrp pl-0 pr-0 ">
                    <span>1/2000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="ready_btn claim_btn">Claim</Button>
          <Button className="ready_btn">Stake Rewards</Button>
        </Modal.Footer>
      </Modal>
      <Claim show={show} onHide={handleClose} />
    </>
  );
};

export { ReadyToEarn };
