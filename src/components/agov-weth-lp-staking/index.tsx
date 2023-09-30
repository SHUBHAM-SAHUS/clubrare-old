import React, { memo, useEffect } from 'react';
import '../../pages/home/top-members.css';
import { Dropdown } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AgovLpStackemodal from '../modal/agov-weth-lpstake-modal';
import { Spinner } from '../spinner';
import { getconversionrateapiAction } from '../../redux/actions/approval-list';
import { useDispatch } from 'react-redux';
import BookOpen from '../../assets/images/BookOpen.svg';
const buyAgovEthLpStake = process.env.REACT_APP_BUY_AGOV_ETH_LP_ADDRESS;

const AgovLpStakePool = ({
  ReqpoolStaking,
  cursor,
  poolstakeloading,
  handleSelectAgov,
  agovLpStakingModal,
  handleCloseStackingMdal,
  handleAgovModalOpen,
  AprStake,
  avlamount,
  uniswapAgovIdList,
  handleAgovUniswapSelect,
  agovUniswapId,
  showlistdata,
}: any) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getconversionrateapiAction());
  }, []);

  const handleCheckSelect = () => {
    handleAgovModalOpen(true);
  };

  return (
    <>
      <div className="reward_stack_wrp polling_stack_wrp earn_lp_pool_staking">
        <div className="">
          <div className="reward_col_inner" style={{ marginTop: '27px' }}>
            <h3>AGOV/WETH LP Staking</h3>
            <p>Stake your AGOV/WETH LP NFT and Earn up to</p>
            {/* <h6>12% APR Rewards</h6> */}
            {AprStake?.pool_2?.length > 0 &&
              AprStake?.pool_2?.map((item: any) => (
                <h6>{item[1].toFixed(2)}% APR Rewards</h6>
              ))}
            <div className="row  reward_liquidity_wrp">
              <div className="col-8">
                <a href={buyAgovEthLpStake} rel="noreferrer" target="_blank">
                  Add Liquidity on Uniswap
                </a>
              </div>
              <div className="col-4">
                <a
                  href="https://userguide.clubrare.com/agov-and-mpwr-lp-staking-guide-en-kr"
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={BookOpen} alt="Guide" />
                  Guide
                </a>
              </div>
            </div>
            <hr />
            <div className="row reedemable-section">
              <div className="col-12 single_switch_wrp">
                <p>Total Liquidity Locked</p>
                <h6>$ {avlamount ? avlamount?.toFixed(6) : 0}</h6>
              </div>
              <div className="col-lg-6 col-6 col-md-6 col-sm-12 text-right single_switch_wrp"></div>
            </div>
            <div className="reward_stack_inn">
              <div>
                <div className="reward_input_wrp select_nft_wrp">
                  <div className="select_nft_lft">
                    <h3 className="text-left">Select NFT ID</h3>
                  </div>
                  <div className="select_nft_right">
                    <DropdownButton
                      title={` Select  ${agovUniswapId ? agovUniswapId : ''}`}
                      id="dropdown-menu-align-right"
                      className="select-nft-dropdown-menu-align-right"
                    >
                      <div className="select_dropdwnnft">
                        {uniswapAgovIdList &&
                          uniswapAgovIdList?.map((item: any) => (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  handleAgovUniswapSelect(
                                    item?.NftId,
                                    item?.poolId,
                                  )
                                }
                              >
                                {item.NftId}
                              </Dropdown.Item>
                            </>
                          ))}
                      </div>
                      {showlistdata ? <Spinner /> : ''}
                    </DropdownButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="reedemable-section">
              <h3>Select Lock-up period</h3>
              <>
                {AprStake?.pool_2?.length > 0 &&
                  AprStake?.pool_2?.map((item: any, i: any) => (
                    <span className="custradiowrp" key={i}>
                      <label htmlFor={`apr_2-${item[0]}`}>
                        <input
                          type="radio"
                          id={`apr_2-${item[0]}`}
                          name="radio"
                          defaultChecked={item[0] === 0}
                          onChange={(e: any) => handleSelectAgov(item[2], 2, e)}
                          value={item[0]}
                        />
                        <span className="radiomark"></span>
                        <span className="radio_label_month">
                          {item[0] <= 0 ? 'No Locking' : `Days ${item[0]}`}{' '}
                          &nbsp;
                        </span>
                        <span className="radio_label_apr">
                          {' '}
                          |&nbsp;{item[1].toFixed(2)}% APR (Reward will be given
                          by ETH)
                        </span>
                      </label>
                    </span>
                  ))}
              </>
            </div>
            <div className="reward_stack_inn stack_btn_wrp">
              <div className="reward_btn_wrp">
                <button
                  type="button"
                  className={agovUniswapId > 0 ? 'crtbtn' : 'disablebtn'}
                  onClick={handleCheckSelect}
                  disabled={agovUniswapId > 0 ? false : true}
                >
                  Stake
                </button>
                <AgovLpStackemodal
                  show={agovLpStakingModal}
                  onCloseModal={handleCloseStackingMdal}
                  ReqpoolStaking={ReqpoolStaking}
                  poolstakeloading={poolstakeloading}
                  cursor={cursor}
                  uniswapId={agovUniswapId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(AgovLpStakePool);
