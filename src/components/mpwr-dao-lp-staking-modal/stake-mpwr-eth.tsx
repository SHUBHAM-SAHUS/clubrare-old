import React, { memo, useEffect, useState } from 'react';
import './mpwr-dao-lp-staking-modal.scss';
import mpwr_icon from '../../assets/images/mpwr_icon.svg';
import erc20Artifacts from '../../smart-contract/erc-token.json';
import { GetCaver } from '../../service/web3-service';
import { useDispatch } from 'react-redux';
import { getMpwrAmountAction } from '../../redux/actions/mpwr-lpstacking-action';
import { useToasts } from 'react-toast-notifications';
import { getMpwrConversionRateV2 } from '../../utils/mpwr-dao-lp-staking-price-converter';
import { Loading } from '..';
import {  useCustomStableCoin } from '../../hooks';


const mpwrToken = process.env.REACT_APP_MPWR_KLAYTN_TOKEN_ADD;
const viewGuide = process.env.REACT_APP_MPWR_VIEW_GUIDE;
const minEthVal = process.env.REACT_APP_MINIMUM_ETH_MPWR_VALUE;

const klatn_icon =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/clubethimg.svg';

// propTypes is  props data type model
interface propTypes {
  ChekUserStep: (value:number)=>void;
  disableCheckHandler: (value:boolean)=>void;
  disableState: boolean;
  mpwrEthValueHandler: (res:any)=>void;
}

export const StakeMpwrEth = memo(
  ({
    ChekUserStep,
    disableCheckHandler,
    disableState,
    mpwrEthValueHandler,
  }: propTypes) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
      const { customFromWei } = useCustomStableCoin();

    const walletAmnt = localStorage.getItem('wallet_amount');
    const klayWalletAdd = localStorage.getItem('KlaytnWalletAddress');

    const [mpwrEthVal, setMpwrEthVal] = useState<string>('');
    const [mpwrConvtVal, setMpwrConvtVal] = useState<string>('');
    const [mpwrBal, setMpwrBal] = useState<string>('');
    const [ethValErr, setEthValErr] = useState<string>('');
    const [mpwrValErr, setMpwrValErr] = useState<string>('');
    const [nextBtnDisable, setNextBtnDisable] = useState<boolean>(false);
    const [convLoader, setConvLoader] = useState<boolean>(false);

    // get current user mpwr balance function
    const getMpwrBalance = async () => {
      const { caver }: any = await GetCaver();
      const erc20Contract = new caver.klay.Contract(
        erc20Artifacts.abi, //ABI
        mpwrToken, //Address
      );
      try {
        const res = await erc20Contract.methods.balanceOf(klayWalletAdd).call();
        const bal = await customFromWei(res,caver,'');
        return bal;
      } catch (err) {}
    };

    useEffect(() => {
      const getData = async () => {
        const bal = await getMpwrBalance();
        setMpwrBal(bal);
      };
      getData();
    }, []);

    // generate mpwr deposite handler
    const stakeEthMpwrHandler = async () => {
      try {
        disableCheckHandler(true);
        const query = {
          eth_amount: mpwrEthVal,
          klaytn_address: klayWalletAdd,
        };
        const res: any = await dispatch(getMpwrAmountAction(query));
        if (res.status) {
          mpwrEthValueHandler(res.data);
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

    // convert eth to mpwr function call
    useEffect(() => {
      const fetchData = async () => {
        if (mpwrEthVal) {
          setConvLoader(true);
          try {
            const res: any = await getMpwrConversionRateV2(mpwrEthVal);
            if (res) {
              const mpwr_amount: any = Math.round(res);
              setMpwrConvtVal(mpwr_amount);
              setConvLoader(false);
            }
          } catch (err: any) {
            setConvLoader(false);
          }
        }
      };
      fetchData();
    }, [mpwrEthVal]);

    // Next button disable condition handler
    useEffect(() => {
      if (walletAmnt && mpwrEthVal) {
        if (
          Number(mpwrEthVal) > Number(walletAmnt) ||
          Number(mpwrEthVal) < Number(minEthVal)
        ) {
          setEthValErr('Not enough ETH available');
        } else {
          setEthValErr('');
        }
      }
      if (mpwrConvtVal && mpwrBal) {
        if (Number(mpwrConvtVal) > Number(mpwrBal)) {
          setMpwrValErr('Not enough MPWR available');
        } else {
          setMpwrValErr('');
        }
      } else {
        setMpwrValErr('Not enough MPWR available');
      }
      if (
        ethValErr !== '' ||
        mpwrValErr !== '' ||
        mpwrEthVal === '' ||
        mpwrEthVal === '0' ||
        mpwrConvtVal === '' ||
        mpwrConvtVal === '0'
      ) {
        setNextBtnDisable(true);
      } else {
        setNextBtnDisable(false);
      }
    }, [mpwrEthVal, mpwrConvtVal, mpwrValErr, ethValErr]);

    return (
      <>
        <div className="agov_dao_lpStaking_modal stake_modal_wrp">
          <div className="container-fluid">
            <div className="stake_modal_inner agov_dao">
              <h1>STAKE ETH/MPWR</h1>
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
                  <p>MPWR-ETH</p>
                </div>
                <h6>
                  Minimum <span>2 ETH</span> required to stake
                </h6>
                <div className="diposit_input_wrp">
                  <input
                    type="number"
                    name="agov-eth"
                    placeholder="0.0 ETH"
                    value={mpwrEthVal}
                    onChange={(e) => setMpwrEthVal(e.target.value)}
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
                      placeholder="0.0 MPWR"
                      readOnly
                      value={mpwrConvtVal}
                    />
                    <div className="diposit_input_error d-flex justify-content-between">
                      <span>{Number(mpwrBal)?.toFixed(6)} MPWR available</span>
                      <span className="error">{mpwrValErr}</span>
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
                  onClick={stakeEthMpwrHandler}
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
