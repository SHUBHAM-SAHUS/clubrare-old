import React, { memo, useEffect, useState } from "react";
import TokenStateModel from "../modal/token-state-model";
import { getconversionrateapiAction } from "../../redux/actions/approval-list";
import { useDispatch, useSelector } from "react-redux";
import  BookOpen from "../../assets/images/BookOpen.svg"
const buyMpwr = process.env.REACT_APP_BUY_MPWR_ADDRESS;

const StakeTokenComponent = ({
  ReqTokenStaking,
  cursor,
  stakehandlechangetoken,
  ErrorMsgforTokenStake,
  tokenstakeInputValue,
  tokenstakeloading,
  mpwrbalance,
  tokenstackingmodel,
  handleCloseStackingModel,
  handleOpenStackingModel,
  tvlstackinglstake,
  handleStackingperiodSelect,
  stackingperiod,
  AprStacking,
  updateStateRedio,
  valueOfRedioBtn
}: any) => {
  const dispatch = useDispatch();

  const rateVal = useSelector(
    (state: any) => state.ratechangeReducer.ratechange
  );

  useEffect(() => {
    dispatch(getconversionrateapiAction());
  }, []);
const [reloadedRwdioSelect,setReloadedRwdioSelect]=useState<boolean>(false)

  function truncateDecimals (num: any, digits: any) {
    var numS = num.toString(),
        decPos = numS.indexOf('.'),        
        substrLength = decPos == -1 ? numS.length : 1 + decPos + digits,
        trimmedResult = numS.substr(0, substrLength),
        finalResult = isNaN(trimmedResult) ? 0 : trimmedResult;
    return finalResult;
}

  useEffect(()=>{
    if (stackingperiod===0 && !valueOfRedioBtn) {
      setReloadedRwdioSelect(true)
    }
    setTimeout(()=>{
      setReloadedRwdioSelect(false)
      updateStateRedio(false)
    },500)
  },[stackingperiod])

  return (
    <>
      <div className="reward_col_inner">
        <div className="reward_stack_wrp earn_lp_pool_staking">
          <div className="stack_club_token">
            <div className="reward_col_inner">
              <h3>$MPWR Staking</h3>
              <p>Stake your ClubRare Token ($MPWR) and Earn up to</p>
              <h6>35% APR Rewards</h6>
              <div className="row reward_liquidity_wrp ">
                <div className="col-8">
                  <a href={buyMpwr} rel="noreferrer" target="_blank">Buy $MPWR</a>
                </div>
                <div className="col-4">
                  <a href="https://docs.clubrare.xyz/usdmpwr-utility-token/mpwr-features" rel="noreferrer" target="_blank"><img src={BookOpen} alt="Guide"/>Guide</a>
                </div>
              </div>
              <hr/>
              <div className="mt-3 tvl_wrp">
                <p>Total Value Locked</p>
                <h6>
                  $ {tvlstackinglstake ? Number(rateVal.mpwrRate * tvlstackinglstake).toFixed(6) : 0}
                </h6>
                <h6 className="">
                  {/* APR: {AprStacking}% */}
                </h6>
              </div>
              <div className='reward_stack_inn'>
                <label>Stake</label>
                <div className='reward_input_wrp'>
                  <input
                    type='number'
                    placeholder='0.00'
                    value={tokenstakeInputValue}
                    onChange={(e: any) => stakehandlechangetoken(e)}
                  ></input>
                  {/* <span className='mpwr'>MPWR</span> */}
                  <span style={{
                    cursor:"pointer"
                  }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={mpwrbalance}
                  >               
                  Available balance:{truncateDecimals(mpwrbalance, 2)}
                  </span>
                </div>
              </div>
              <h6 className="text-danger fnt_size_errmsg">
                {" "}
                {ErrorMsgforTokenStake.TokenStakeValueError}{" "}
              </h6>
              <div className="topcollection_head text-right"></div>
              <div className="row reedemable-section">
                {/* <div className="col-lg-4 col-4 col-md-4 col-sm-12 text-left single_switch_wrp liqpooltxt">
                  <h2>{AprStacking}% APR</h2>
                </div>
                <div className="col-lg-8 col-8 col-md-8 col-sm-12 text-right single_switch_wrp locked-option-month">
                  <div className="topcollection_head text-right lockedopt_wrp">
                    <DropdownButton
                      title={`Locked Option Month ${stackingperiod}`}
                      id="dropdown-menu-align-right"
                      onSelect={(e: any) => handleStackingperiodSelect(e)}
                    >
                      <Dropdown.Item eventKey="0">0 Months</Dropdown.Item>
                      <Dropdown.Item eventKey="3">3 Months</Dropdown.Item>
                      <Dropdown.Item eventKey="6">6 Months</Dropdown.Item>
                      <Dropdown.Item eventKey="9">9 Months</Dropdown.Item>
                      <Dropdown.Item eventKey="12">12 Months</Dropdown.Item>
                    </DropdownButton>
                  </div>
                </div> */}
                <h3>Select Lock-up period</h3>
                {
                  !reloadedRwdioSelect ? (
                    (AprStacking && AprStacking.length > 0) && 
                      AprStacking.map((item: any, i: any) => (
                        <span className="custradiowrp" key={i}>
                          <label htmlFor={`stake-apr-${item[0]}`}>
                          <input type="radio" id={`stake-apr-${item[0]}`} name="stake-radios" 
                          onChange={() => handleStackingperiodSelect(item[2])} 
                          value={item[0]}  
                          defaultChecked={item[0] === 0} />
                          <span className="radiomark"></span>
                          <span className="radio_label_month">{item[0] <= 0 ? "No Locking" : `Days ${item[0]}`} &nbsp;</span>
                          <span className="radio_label_apr"> |&nbsp;{item[1]}% APR &nbsp; (Reward will be given by MPWR)</span>
                        </label>
                        </span>
                      ))
                    
                  ):null
                }
                
              </div>
              <div  className="reward_stack_inn stack_btn_wrp">
                <div className='reward_btn_wrp'>
                  <button
                    type='button'
                    onClick={() => handleOpenStackingModel(true)}
                    className={`crtbtn ${
                      (tokenstakeInputValue === '' || ErrorMsgforTokenStake.TokenStakeValueError !== '') &&
                      `disablebtn`
                    }`}
                    disabled={tokenstakeInputValue === '' || ErrorMsgforTokenStake.TokenStakeValueError !== ''}
                  >
                    Stake
                  </button>

                  <TokenStateModel
                    show={tokenstackingmodel}
                    onCloseModal={handleCloseStackingModel}
                    tokenstakeInputValue={tokenstakeInputValue}
                    tokenstakeloading={tokenstakeloading}
                    cursor={cursor}
                    ReqTokenStaking={ReqTokenStaking}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(StakeTokenComponent);