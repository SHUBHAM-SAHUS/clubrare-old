import { useState, useEffect } from 'react';
import '../add-to-token/add-to-token.scss';
import { Modal, Button } from 'react-bootstrap';
import { getWeb3 } from '../../service/web3-service';
import { imgConstants } from '../../assets/locales/constants';
import { useCustomStableCoin } from '../../hooks';


const Claim = (props: any) => {
  const [mpwrClaimVal, setMpwrClaimVal] = useState<any>();
  const { customFromWei } = useCustomStableCoin();

  useEffect(() => {
    async function fetchData() {
      const { web3 }: any = await getWeb3();
      const pr = await customFromWei(props.rewards_mpwr_token, web3,'');
      setMpwrClaimVal(Number(pr).toFixed(6));
    }
    if (props.rewards_mpwr_token) fetchData();
  }, [props.rewards_mpwr_token]);

  useEffect(() => {
    if (!props.claimLoading) {
      props.setShowMethod(false);
    }
  }, [props.claimLoading]);

  useEffect(() => {
    if (!props.stakeRewardLoading) {
      props.setShowMethod(false);
    }
  }, [props.stakeRewardLoading]);

  return (
    <>
      <Modal
        {...props}
        show={props.show}
        onHide={props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="readytoearn_modal  readytoearn_reward_modal"
        backdrop="static"
        style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}
      >
        <Modal.Header style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}>
          <Modal.Title>Ready to Earn</Modal.Title>
          <Button onClick={props.onHide}>
            <img src={imgConstants.close} alt="img" />
          </Button>
        </Modal.Header>

        <Modal.Body style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}>
          <div className="Congratulations_wrp">
            <img src={imgConstants.Parachute} alt="img" />
            <div className="Congratulations">
              <h4>Congratulations!</h4>
              <p>All requirements have been met to claim your Airdrop</p>
            </div>
          </div>
          <div className="Additional_info_wrp">
            <h4>Earn Double Rewards</h4>
            <p>
              Stack your airdrop amount and earn $MPWR & $WETH. We distribute
              market fees(0.5%) when you stack $MPWR.
            </p>
            <div className="rewards_wrp">
              <div className="rewards_heading">
                <img src={imgConstants.Medal} alt="img" />
                <h4>Reward</h4>
              </div>
              <div className="rewards_details_wrp">
                <div className="row rewards_details">
                  <div className="col-6 rewards_details_left_wrp pl-1 ">
                    <p>MPWR Token</p>
                  </div>
                  <div className="col-6 rewards_details_right_wrp pl-0 pr-0 ">
                    <span>{mpwrClaimVal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ pointerEvents: props.cursor ? 'none' : 'auto' }}>
          <Button
            className="ready_btn claim_btn"
            disabled={props.claimLoading}
            onClick={props.handleClaim}
          >
            {props.claimLoading ? 'Loading...' : 'Claim'}
          </Button>
          <Button
            className="ready_btn"
            disabled={props.stakeRewardLoading}
            onClick={props.handleStakeRewards}
          >
            {props.stakeRewardLoading ? 'Loading...' : 'Stake Rewards'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { Claim };
