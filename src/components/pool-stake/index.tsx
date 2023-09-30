import React, { memo, useEffect, useState } from "react";
import "../../pages/home/top-members.css";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import LpStakingModel from "../modal/lp-staking-model";
import { Spinner } from "../spinner";
import { getconversionrateapiAction } from "../../redux/actions/approval-list";
import { useDispatch } from "react-redux";
import BookOpen from "../../assets/images/BookOpen.svg";
const buyMpwrEthLP = process.env.REACT_APP_BUY_MPWR_ETH_LP_ADDRESS;

const PoolStake = ({
  ReqpoolStaking,
  cursor,
  poolstakeloading,
  handleSelect,
  Lpstackingmodel,
  handleCloseStackingMdal,
  handleOpenStackingMdal,
  lockedoption,
  AprStake,
  avlamount,
  uniswaplist,
  handleSwapSelect,
  swaplistid,
  showlistdata,
  lpimage,
  lpstakeValueOfRedio,
  lpstakeupdateStateRedio,
}: any) => {
  const dispatch = useDispatch();
  const [reloadRedioSelect, setReloadedRedioSelect] = useState<boolean>(false);
  useEffect(() => {
    dispatch(getconversionrateapiAction());
  }, []);
  useEffect(() => {
    if (lockedoption === 3 && !lpstakeValueOfRedio) {
      setReloadedRedioSelect(true);
    }
    setTimeout(() => {
      setReloadedRedioSelect(false);
      lpstakeupdateStateRedio(false);
    }, 500);
  }, [lockedoption]);

const handleCheckSelect=()=>{
  handleOpenStackingMdal(true);
}

  return (
    <>
      <div className="reward_stack_wrp polling_stack_wrp earn_lp_pool_staking">
        <div className="">
          <div className="reward_col_inner">
            <h3>MPWR/WETH LP Staking</h3>
            <p>Stake your MPWR/WETH LP NFT and Earn up to</p>
            <h6>180% APR Rewards</h6>
            <div className="row  reward_liquidity_wrp">
              <div className="col-8">
                <a href={buyMpwrEthLP} rel="noreferrer" target="_blank">
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
                <h6>
                  $ {avlamount
                    ? avlamount?.toFixed(6)
                    : 0}
                </h6>
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
                      title={` Select  ${swaplistid ? swaplistid : ''}`}
                      id="dropdown-menu-align-right"
                      className="select-nft-dropdown-menu-align-right"
                    >
                      <div className="select_dropdwnnft">
                        {uniswaplist &&
                          uniswaplist?.map((item: any, index: number) => (
                            <>
                              <Dropdown.Item
                                onClick={() =>
                                  handleSwapSelect(item?.NftId, item?.poolId)
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
              {
              // showPoolLoading ? <Spinner /> : 
              <>
                 {!reloadRedioSelect ? (
                  <>
                    {AprStake?.pool_1 &&
                      AprStake?.pool_1?.length > 0 &&
                      AprStake?.pool_1?.map((item_1: any, j: any) => (
                        <span className="custradiowrp" key={j}>
                          <label htmlFor={`apr-${item_1[0]}`}>
                            <input 
                              type="radio"
                              id={`apr-${item_1[0]}`}
                              name="radios"
                              onChange={(e: any) => handleSelect(item_1[2],1,e)}
                              value={item_1[0]}
                              // defaultChecked={item_1[0] === 0}
                            />
                            <span className="radiomark"></span>
                            <span className="radio_label_month">
                              {item_1[0] <= 0
                                ? "No Locking"
                                : `Days ${item_1[0]}`}{" "}
                              &nbsp;
                            </span>
                            <span className="radio_label_apr">
                              |&nbsp;{item_1[1].toFixed(2)}% APR (Reward will be given by ETH)
                            </span>
                          </label>
                        </span>
                      ))}
                  </>
                ) : null}
                {!reloadRedioSelect
                  ? AprStake?.pool_0 &&
                    AprStake?.pool_0?.length > 0 &&
                    AprStake?.pool_0?.map((item: any, i: any) => (
                      <span className="custradiowrp" key={i}>
                        <label htmlFor={`apr_0-${item[0]}`}>
                          <input
                            type="radio"
                            id={`apr_0-${item[0]}`}
                            name="radios"
                            onChange={(e: any) => handleSelect(item[2], 0, e)}
                            value={item[0]}
                            defaultChecked={item[2] === 3}
                          />
                          <span className="radiomark"></span>
                          <span className="radio_label_month">
                            {item[0] <= 0 ? "No Locking" : `Days ${item[0]}`}{" "}
                            &nbsp;
                          </span>
                          <span className="radio_label_apr">
                            |&nbsp;{item[1]}% APR (Reward will be given by MPWR)
                          </span>
                        </label>
                      </span>
                    ))
                  : null}
              </>
              }
           
            </div>
            <div className="reward_stack_inn stack_btn_wrp">
              <div className="reward_btn_wrp">
                <button
                  type="button"
                  className={swaplistid > 0 ? "crtbtn" : "disablebtn"}
                  onClick={handleCheckSelect}
                  disabled={swaplistid > 0 ? false : true}
                >
                  Stake
                </button>
                <LpStakingModel
                  show={Lpstackingmodel}
                  onCloseModal={handleCloseStackingMdal}
                  ReqpoolStaking={ReqpoolStaking}
                  poolstakeloading={poolstakeloading}
                  cursor={cursor}
                  nftid={swaplistid}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(PoolStake);