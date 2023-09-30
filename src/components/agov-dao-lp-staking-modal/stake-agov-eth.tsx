import React, { memo, useEffect, useState } from 'react';
import './agov-dao-lp-staking-modal.scss';
import mpwr_icon from '../../assets/images/mpwr_icon.svg';
import erc20Artifacts from '../../smart-contract/erc-token.json';
import { GetCaver } from '../../service/web3-service';
import { useDispatch } from 'react-redux';
import { getAgovAmountAction } from '../../redux/actions/agov-lpstacking-action';
import { useToasts } from 'react-toast-notifications';
import { getAgovConversionRateV2 } from '../../utils/agov-dao-lp-staking-price-converter';
import { Loading } from '..';
import { useCustomStableCoin } from '../../hooks';

const agovToken = process.env.REACT_APP_AGOV_TOKEN_ADD;
const viewGuide = process.env.REACT_APP_VIEW_GUIDE;
const minEthVal = process.env.REACT_APP_MINIMUM_ETH_AGOV_VALUE;

const klatn_icon =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/clubethimg.svg';

// propTypes is  props data type model
interface propTypes {
  ChekUserStep: (val:number)=>void;
  disableCheckHandler: (value:boolean)=>void;
  disableState: boolean;
  agovEthValueHandler: (res:any)=>void;
}

export const StakeAgovEth = memo(
  ({
    ChekUserStep,
    disableCheckHandler,
    disableState,
    agovEthValueHandler,
  }: propTypes) => {
    const { customFromWei} = useCustomStableCoin();
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const walletAmnt = localStorage.getItem('wallet_amount');
    const klayWalletAdd = localStorage.getItem('KlaytnWalletAddress');

    const [agovEthVal, setAgovEthVal] = useState<string>('');
    const [agovConvtVal, setAgovConvtVal] = useState<string>('');
    const [agovBal, setAgovBal] = useState<string>('');
    const [ethValErr, setEthValErr] = useState<string>('');
    const [agovValErr, setAgovValErr] = useState<string>('');
    const [nextBtnDisable, setNextBtnDisable] = useState<boolean>(false);
    const [convLoader, setConvLoader] = useState<boolean>(false);

    // get current user agov balance function
    const getAGOVBalance = async () => {
      const { caver }: any = await GetCaver();
      const erc20Contract = new caver.klay.Contract(
        erc20Artifacts.abi, //ABI
        agovToken, //Address
      );
      try {
        const res = await erc20Contract.methods.balanceOf(klayWalletAdd).call();
        const bal =  await customFromWei (res,caver,'');
        return bal;
      } catch (err) {}
    };

    useEffect(() => {
      const getData = async () => {
        const bal = await getAGOVBalance();
        setAgovBal(bal);
      };
      getData();
    }, []);

    // generate agov deposite handler
    const stakeEthAgovHandler = async () => {
      try {
        disableCheckHandler(true);
        const query = {
          eth_amount: agovEthVal,
          klaytn_address: klayWalletAdd,
        };
        const res: any = await dispatch(getAgovAmountAction(query));
        if (res.status) {
          agovEthValueHandler(res.data);
          disableCheckHandler(false);
          ChekUserStep(3);
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
      }
    };

    // convert eth to agov function call
    useEffect(() => {
      const fetchData = async () => {
        if (agovEthVal) {
          setConvLoader(true);
          try {
            const res: any = await getAgovConversionRateV2(agovEthVal);
            if (res) {
              const agov_amount: any = Math.round(res);
              setAgovConvtVal(agov_amount);
              setConvLoader(false);
            }
          } catch (err: any) {
            setConvLoader(false);
          }
        }
      };
      fetchData();
    }, [agovEthVal]);

    // Next button disable condition handler
    useEffect(() => {
      if (walletAmnt && agovEthVal) {
        if (
          Number(agovEthVal) > Number(walletAmnt) ||
          Number(agovEthVal) < Number(minEthVal)
        ) {
          setEthValErr('Not enough ETH available');
        } else {
          setEthValErr('');
        }
      }
      if (agovConvtVal && agovBal) {
        if (Number(agovConvtVal) > Number(agovBal)) {
          setAgovValErr('Not enough AGOV available');
        } else {
          setAgovValErr('');
        }
      } else {
        setAgovValErr('Not enough AGOV available');
      }
      if (
        ethValErr !== '' ||
        agovValErr !== '' ||
        agovEthVal === '' ||
        agovEthVal === '0' ||
        agovConvtVal === '' ||
        agovConvtVal === '0'
      ) {
        setNextBtnDisable(true);
      } else {
        setNextBtnDisable(false);
      }
    }, [agovEthVal, agovConvtVal, agovValErr, ethValErr]);

    return (
      <>
        <div className="agov_dao_lpStaking_modal stake_modal_wrp">
          <div className="container-fluid">
            <div className="stake_modal_inner agov_dao">
              <h1>STAKE ETH/AGOV</h1>
              <p>Input ETH amount to continue. Minimum 2 ETH required</p>
              <p className="red-note-txt">
                Note: Please add flashbots{' '}
                <a
                  href="https://docs.clubrare.xyz/international/korean/agov-and-dao/agov-migration-guide"
                  rel="noreferrer"
                  target="_blank"
                >
                  RPC URL
                </a>{' '}
                in your metamask to deposit over ethereum network
              </p>
              <div className="view_guidebtn_wrp">
                <a
                  href={viewGuide}
                  target="_blank"
                  rel="noreferrer"
                  className="view_guid_btn"
                >
                  VIEW GUIDE
                </a>
              </div>
              <div className="diposit_wrp">
                <div className="diposit_inner">
                  <img src={mpwr_icon} alt="agov" />
                  <img className="klatn_icon" src={klatn_icon} alt="klatn" />
                  <p>AGOV-ETH</p>
                </div>
                <h6>
                  Minimum <span>2 ETH</span> required to stake
                </h6>
                <div className="diposit_input_wrp">
                  <input
                    type="number"
                    name="agov-eth"
                    placeholder="0.0 ETH"
                    value={agovEthVal}
                    onChange={(e) => setAgovEthVal(e.target.value)}
                  />
                  <div className="diposit_input_error d-flex justify-content-between">
                    <span>{Number(walletAmnt)?.toFixed(6)} ETH available</span>
                    <span className="error">{ethValErr}</span>
                  </div>
                  <div className="agov_lpstake_input_wrp">
                    <input
                      className="disabled"
                      type="number"
                      name="agov"
                      placeholder="0.0 AGOV"
                      readOnly
                      value={agovConvtVal}
                    />
                    <div className="diposit_input_error d-flex justify-content-between">
                      <span>{Number(agovBal)?.toFixed(6)} AGOV available</span>
                      <span className="error">{agovValErr}</span>
                    </div>
                    {convLoader ? (
                      <Loading
                        className="icon-loading-style agov_conv_loader"
                        margin={'0'}
                        size={'50px'}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              <div className="club_createitem stake_agov_next_btn">
                <button
                  type="button"
                  className={`mintbtn ${
                    disableState || nextBtnDisable ? 'disabled' : ''
                  }`}
                  disabled={disableState || nextBtnDisable}
                  onClick={stakeEthAgovHandler}
                >
                  {disableState ? (
                    <Loading
                      className="icon-loading-style"
                      margin={'0'}
                      size={'50px'}
                    />
                  ) : (
                    'NEXT'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);
