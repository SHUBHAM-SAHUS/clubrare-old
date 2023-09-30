import React, { useEffect, useState } from 'react';
import wallet from '../../assets/images/wallet.svg';
import './airdrops.scss';
import { Claim } from '../claim';
import { Spinner } from '../spinner';
import { getWeb3 } from '../../service/web3-service';
import { imgConstants } from '../../assets/locales/constants';
import { useCustomStableCoin } from '../../hooks';

const AirDrops = (props: any) => {
    const { customFromWei } = useCustomStableCoin();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mpwrClaimVal, setMpwrClaimVal] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      const { web3 }: any = await getWeb3();
      const pr = await customFromWei(
        props.airdropStashData.mpwr_to_claim,web3,
        ''
      );
      setMpwrClaimVal(Number(pr).toFixed(6));
    }
    fetchData();
  }, [props.airdropStashData]);

  return (
    <React.Fragment>
      <div className="Airdrops_wrp">
        <div className="Airdrops_heading">
          <img src={imgConstants.Parachute} alt="parachute" />
          <h1>Airdrop Stash</h1>
          <img src={imgConstants.Parachute} alt="parachute" />
        </div>
        {props.airdropStashLoading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <div className="Airdrops_volume_wrp">
              <div className="Airdrops_volume">
                <h5>{props.airdropStashData.userOpenSeaVol}</h5>
                <div className="Airdrops_volume_wallet">
                  <img src={imgConstants.ethIcon} alt="img" />
                  <span className="eth">ETH</span>
                </div>
                <p>OpenSea Volume</p>
              </div>
              <div className="Airdrops_volume">
                <h5>{mpwrClaimVal}</h5>
                <div className="Airdrops_volume_wallet">
                  <figure>
                    <img src={imgConstants.mpwr_icon} alt="img" />
                  </figure>
                  <span className="mpvr">MPWR</span>
                </div>
                <p>To Claim</p>
              </div>
            </div>
            {props.claimSuccessCheck ? (
              <div className="claim_airdrop_wrp">
                <div className="claim_airdrop">
                  <div className="claim_airdrop_header">
                    <img src={wallet} alt="img" />
                    <h5>Add tokens to your wallet</h5>
                  </div>
                </div>
                <button
                  className="claim_airdrop_button_wrp"
                  onClick={props.addToken}
                >
                  Add token to Metamask
                </button>
              </div>
            ) : (
              <div className="claim_airdrop_wrp">
                <div className="claim_airdrop">
                  <div className="claim_airdrop_header">
                    <img src={imgConstants.Medal} alt="img" />
                    <h5>Claim your Airdrop by listing</h5>
                  </div>
                </div>
                <div className="claim_airdrop_nft_wrp">
                  <div className="claim_nft">
                    <h5>
                      {props.airdropStashData.nft_listed}/
                      {props.airdropStashData.nft_to_list}
                    </h5>
                    <p> All NFTs</p>
                  </div>
                  <div className="claim_nft">
                    <h5>
                      {props.airdropStashData.collection_listed}/
                      {props.airdropStashData.collection_to_list}
                    </h5>
                    <p>Collections</p>
                  </div>
                </div>
                <button
                  className="claim_airdrop_button_wrp"
                  disabled={!props.airdropStashData?.canClaim}
                  onClick={handleShow}
                >
                  Claim
                </button>
              </div>
            )}
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
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
};

export { AirDrops };
