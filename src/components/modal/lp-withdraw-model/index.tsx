import { Button, Modal } from 'react-bootstrap';
import React, { memo } from 'react';
import './lp-withdraw-model.scss';
import { Loading } from '../../loading';
import { imgConstants } from '../../../assets/locales/constants';

const LPwithdrawmodel = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        open={props?.show}
        className='transfer_modal lpwithdraw_model'
        aria-labelledby='contained-modal-title-vcenter'
        style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
        centered
      >
        <Modal.Header className="details_placebid_heading">
          <Modal.Title id="contained-modal-title-vcenter">
            {props.type === "lpstacking" ? "Withdraw LP" : "Stake Amount"}
          </Modal.Title>
          <Button
            className='details_placebidmodal_closebtn'
            style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
            onClick={props.onCloseModal}
          >
            <img src={imgConstants.close} alt='img' />
          </Button>
        </Modal.Header>

        <Modal.Body className='transfer_modal_style'>
          <div className='launch_proposal_wrp'>
            <div className='token_launch_heading_wrp'></div>
            {props.amounttoken > 0 ? (
              <div className='row proposal_wrp'>
                <div className='col-6 proposal_left_wrp pl-1'>
                  <p>Market Fee</p>
                </div>
                <div className='col-6 proposal_right_wrp pl-0 pr-0'>
                  <span>{props.amounttoken ? parseFloat(props.amounttoken).toFixed(6) : ''} WETH</span>
                </div>
              </div>
            ) : (
              ''
            )}

            {props.nftid > 0 ? (
              <div className="row proposal_wrp">
                <div className="col-6 proposal_left_wrp pl-1">
                  <p>NFT_Id</p>
                </div>
                <div className="col-6 proposal_right_wrp pl-0 pr-0">
                  <span>{props.nftid ? props.nftid : ""} </span>
                </div>
              </div>
            ) : (
              ""
            )}

            {props.type === "stacking" ? (
              <div className="row proposal_wrp">
                <div className="col-6 proposal_left_wrp pl-1">
                  <p>Stake Amount</p>
                </div>
                <div className="col-6 proposal_right_wrp pl-0 pr-0">
                  <span>
                    {props.stakingamount ? props.stakingamount : ''}&nbsp;
                    {props.pool_id === '1'
                      ? 'ETH'
                      : props.pool_id === '2'
                        ? 'ETH'
                        : 'MPWR'}
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}

            {props.rewards > 0 ? (
              <div className='row proposal_wrp'>
                <div className='col-6 proposal_left_wrp pl-1'>
                  <p className='mt-1'>Rewards</p>
                </div>
                <div className="col-6 proposal_right_wrp pl-0 pr-0">
                  <span className="mt-1">
                    {props.rewards ? parseFloat(props.rewards).toFixed(6) : ''}
                    &nbsp;
                    {props.pool_id === '1'
                      ? 'ETH'
                      : props.pool_id === '2'
                        ? 'ETH'
                        : 'MPWR'}
                  </span>
                </div>
              </div>
            ) : (
              ''
            )}
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

          {props.type === "lpstacking" ? (
            <Button
              className="ready_btn"
              onClick={() => props.ReqpoolStaking('withdrabtn', 0, props.did)}
            >
              {" "}
              {props.poolwithdrawloading ? (
                <div className="d-flex justify-center">
                  {" "}
                  <Loading margin={"0"} size={"25px"} />
                </div>
              ) : (
                "Confirm"
              )}{" "}
            </Button>
          ) : (
            <Button
              className="ready_btn"
              onClick={() => props.ReqTokenStaking('withdrabtn', props.did)}
            >
              {" "}
              {props.poolwithdrawloading ? (
                <div className="d-flex justify-center">
                  {" "}
                  <Loading margin={"0"} size={"25px"} />
                </div>
              ) : (
                "Confirm"
              )}{" "}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(LPwithdrawmodel);