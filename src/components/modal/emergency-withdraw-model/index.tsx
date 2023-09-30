import { Button, Modal } from "react-bootstrap";
import React, { memo } from "react";
import "../token-withdraw-model/token-withdraw-model.scss";
import { Loading } from "../../loading";
import { imgConstants } from "../../../assets/locales/constants";

const EmergencyWithdrawModel = (props: any) => {
  return (
    <>
      <Modal
        {...props}
        open={props?.show}
        className="transfer_modal TokenWithdrawmodel"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ pointerEvents: props.cursor ? "none" : "auto" }}
      >
        <Modal.Header className="details_placebid_heading">
          <Modal.Title id="contained-modal-title-vcenter">
            Emergency Withdraw
          </Modal.Title>
          <Button
            className="details_placebidmodal_closebtn"
            style={{ pointerEvents: props.cursor ? "none" : "auto" }}
            onClick={props.onCloseModal}
          >
            <img src={imgConstants.close} alt="img" />
          </Button>
        </Modal.Header>

        <Modal.Body className="transfer_modal_style">
          <div className="launch_proposal_wrp">
            <div className="token_launch_heading_wrp">
              <h1>
                Note: You will not get market fee rewards and your current
                rewards will be count based on no lock up APR%.
              </h1>
            </div>

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
                    {props.stakingamount ? props.stakingamount : ""} MPWR {" "}
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}

            {props.rewards > 0 ? (
              <div className="row proposal_wrp">
                <div className="col-6 proposal_left_wrp pl-1">
                  <p className="mt-1">Rewards</p>
                </div>
                <div className="col-6 proposal_right_wrp pl-0 pr-0">
                  <span className="mt-1">
                    {props.rewards ? parseFloat(props.rewards).toFixed(10) : ""}{" "}
                    MPWR
                  </span>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </Modal.Body>
        <Modal.Footer
          className="placebid_btn_footer"
          style={{ pointerEvents: props.cursor ? "none" : "auto" }}
        >
          <Button
            className="ready_btn claim_btn"
            style={{ pointerEvents: props.cursor ? "none" : "auto" }}
            onClick={props.onCloseModal}
          >
            Cancel
          </Button>
          {props.type === "lpstacking" ? (
            <Button
              className="ready_btn"
              onClick={() => props.ReqpoolStaking('emergency', 0, props.did)}
            >
              {" "}
              {props.poolwithdrawloading ? (
                <div className="d-flex justify-content-center">
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
              onClick={() => props.ReqTokenStaking('emergency', props.did)}
            >
              {" "}
              {props.poolwithdrawloading ? (
                <div className="d-flex justify-content-center">
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
export default memo(EmergencyWithdrawModel);