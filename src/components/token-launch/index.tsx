import React, { memo, useEffect, useState } from 'react';
import { imgConstants } from '../../assets/locales/constants';
import './token-launch.scss';
import { useTranslation } from 'react-i18next';
const dateformat = require('dateformatter').format;

const TokenLaunch = (props: any) => {
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState<any>();
  const [endTime, setEndTime] = useState<any>();
  const [harvestDone, setHarvestDone] = useState<any>();

  useEffect(() => {
    if (
      !isNaN(props.userDetail.startTime) ||
      !isNaN(props.userDetail.endTime)
    ) {
      const startDate = dateformat('d/m/Y', props.userDetail.startTime * 1000);
      setStartTime(startDate);
      const endDate = dateformat('d/m/Y', props.userDetail.endTime * 1000);
      setEndTime(endDate);
    }
    setHarvestDone(props.checkHarvestDone);
  }, [props]);

  return (
    <>
      <div className="token_launch_wrp">
        <div className="token_launch_heading_wrp">
          <img src={imgConstants.rocketLaunch} alt="ClubRare Token Launch" />
          <h1>{t('token-lunch.heading')}</h1>
        </div>
        <div className="thankyou_parti_wrp">
          <div className="row">
            <div className="col-6">
              <span>
                <strong>{t('token-lunch.heading1')}</strong>
              </span>
            </div>
            <div className="col-6 text-end thank_eth_wrp">
              <div className="d-flex justify-content-end">
                <img src={imgConstants.ethIcon} alt="eth" />
                <span>94 ETH</span>
              </div>
            </div>
          </div>
          <p>{t('token-lunch.text1')}</p>
        </div>
        <div className="launch_proposal_wrp">
          <div className="launch_proposal_heading">
            <img src={imgConstants.gift} alt="Proposal Offer" />
            <h5>{t('token-lunch.heading2')}</h5>
          </div>
          <div className="row proposal_wrp">
            <div className="col-6 proposal_left_wrp pl-1">
              <p>{t('token-lunch.Total')}</p>
            </div>
            <div className="col-6 proposal_right_wrp pl-0 pr-0">
              <span>100MPWR</span>
            </div>
          </div>
          <div className="row proposal_wrp ">
            <div className="col-6 proposal_left_wrp pl-1">
              <p>{t('token-lunch.Price-per-Position')}</p>
            </div>
            <div className="col-6 proposal_right_wrp pl-0 pr-0">
              <span>1 ETH</span>
            </div>
          </div>
          {harvestDone && (
            <div>
              {startTime && endTime && (
                <>
                  <div className="row proposal_wrp">
                    <div className="col-6 proposal_left_wrp pl-1">
                      <p>Start</p>
                    </div>
                    <div className="col-6 proposal_right_wrp pl-0 pr-0">
                      <span>{startTime}</span>
                    </div>
                  </div>
                  <div className="row proposal_wrp ">
                    <div className="col-6 proposal_left_wrp pl-1">
                      <p>End Time</p>
                    </div>
                    <div className="col-6 proposal_right_wrp pl-0 pr-0">
                      <span>{endTime}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="launch_proposal_wrp launch_reward_wrp">
          <div className="launch_proposal_heading">
            <img src={imgConstants.Medal} alt="Reward" />
            <h5>{t('token-lunch.Reward')}</h5>
          </div>
          <div className="row proposal_wrp"></div>
          <div className="row proposal_wrp">
            <div className="col-7 proposal_left_wrp pl-1">
              <p>{t('token-lunch.Claimed')}</p>
            </div>
            <div className="col-5 proposal_right_wrp pl-0 pr-0">
              <span>
                {props.totalClaimedRewVal ? props.totalClaimedRewVal : 0}
              </span>
            </div>
          </div>
          <div className="row proposal_wrp">
            <div className="col-7 proposal_left_wrp pl-1">
              <p>{t('token-lunch.Unclaimed')}</p>
            </div>
            <div className="col-5 proposal_right_wrp pl-0 pr-0">
              <span>
                {props.totalClaimedRewVal ? 100 - props.totalClaimedRewVal : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(TokenLaunch);
