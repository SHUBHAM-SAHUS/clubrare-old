import React, { useState, memo } from 'react';
import './claim-rewards.scss';
import { useHistory } from 'react-router-dom';
import { Claim } from '../claim';
import { imgConstants } from '../../assets/locales/constants';

const ClaimRewards = (props: any) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  return (
    <>
      <div className="claim_rewards_wrp">
        <div className="claim_rewards_inner">
          <div className="d-flex align-items-start justify-content-start img_wrp">
            <img src={imgConstants.claimreward} alt="claimreward" />
            <h2>Claim your ClubRare Rewards</h2>
          </div>
          <div className="claim_btn_wrp text-right">
            <button
              type="button"
              className={`${
                !props.airdropStashData.canClaim || props.claimSuccessCheck
                  ? 'disablebtn'
                  : ''
              }`}
              disabled={
                !props.airdropStashData.canClaim || props.claimSuccessCheck
                  ? true
                  : false
              }
              onClick={handleShow}
              style={{ display: 'none' }}
            >
              Claim
            </button>
            <button type="button" onClick={() => history.push('/list-nft')}>
              List Your Assets
            </button>
            <button type="button" onClick={() => history.push('/ilo')}>
              ILO
            </button>
            <a
              href="https://docs.clubrare.xyz/mpwr-tokenomics"
              rel="noreferrer"
              target="_blank"
            >
              Learn More
            </a>
          </div>
          <Claim
            cursor={props.cursor}
            setShowMethod={setShow}
            claimLoading={props.claimLoading}
            show={show}
            onHide={handleClose}
            rewards_mpwr_token={props.airdropStashData.mpwr_to_claim}
            handleClaim={props.handleClaim}
            stakeRewardLoading={props.stakeRewardLoading}
            handleStakeRewards={props.handleStakeRewards}
          />
        </div>
      </div>
    </>
  );
};

export default memo(ClaimRewards);
