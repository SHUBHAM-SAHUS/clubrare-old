import React, { memo } from 'react';
import { Loading } from '../loading';
import './reward-stack.scss';
import { useTranslation } from 'react-i18next';

const RewardsStake = ({
  ReqRewardsListingfun,
  listingloading,
  tradingloading,
  listingrewards,
  tradingRewards,
}: any) => {
  const { t } = useTranslation();
  return (
    <>
      {}
      <div className='reward_stack_wrp reward_coll_wrp row'>
        <div className='col-12'>
          <div className='reward_col_inner reward_coll_inn'>
            <h2>{t('reward-stack.heading')}</h2>
            <p className='earn_text'>{t('reward-stack.text')}</p>
            <hr/>
            <div className='row row_collreward_btn_wrp'>
              <div className='col-6 collreward_btn_wrp mt-3'>
                <div className='Rewards_mpwr'>
                    <p className='rew_text'>{t('reward-stack.Listing-Rewards')}</p>
                    <h4> {listingrewards} MPWR</h4>
                </div>
                <div className='collreward_btn'>
                  <button
                    type='button'
                    className={`crtbtn ${listingrewards > 0 ? 'crtbtn' : `disablebtn`}`}
                    disabled={listingrewards > 0 ? false : true}
                    onClick={() => ReqRewardsListingfun('listing')}
                  >
                    {listingloading ? (
                      <div className='d-flex justify-content-center'>
                        <Loading margin={'0'} size={'25px'} />
                      </div>
                    ) : (
                      'Collect Rewards'
                    )}
                  </button>
                  <p className='tred_text'>{t('reward-stack.Phygital-Item')}</p>
                </div>
              </div>
              <div className='col-6 collreward_btn_wrp mt-3'>
                <div className=' Rewards_mpwr'>
                    <p className='rew_text'>{t('reward-stack.Trading-Rewards')}</p>
                    <h4>{tradingRewards} MPWR</h4>
                </div>
                <div className='collreward_btn'>
                  <button
                    type='button'
                    className={`crtbtn ${tradingRewards > 0 ? 'crtbtn' : `disablebtn`}`}
                    onClick={() => ReqRewardsListingfun('trading')}
                    disabled={tradingRewards > 0 ? false : true}
                  >
                    {tradingloading ? (
                      <div className='d-flex justify-content-center'>
                        {' '}
                        <Loading margin={'0'} size={'25px'} />
                      </div>
                    ) : (
                      'Collect Rewards'
                    )}
                  </button>
                  <p className='tred_text'>{t('reward-stack.Earn-trading-rewards')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(RewardsStake);