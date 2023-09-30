import { useState, useEffect } from 'react';
import './mpwr-dao-lp-staking-modal.scss';
import mpwr_icon from '../../assets/images/mpwr_icon.svg';
import CaretDoubleRightGreen from '../../assets/images/CaretDoubleRightGreen.svg';
import calendarblank from '../../assets/images/calendarblank.svg';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { eventsAction } from '../../redux/actions';
import erc20Artifacts from '../../smart-contract/erc-token.json';
import {
  EthMpwrLpStakingContract,
  GetCaver,
  KlaytnMpwrLpStakingContract,
} from '../../service/web3-service';
import { generateMpwrDepositeSignatureAction } from '../../redux/actions/mpwr-lpstacking-action';
import { Loading } from '..';
import moment from 'moment';
import { klaytnWallConnCheck } from '../../utils/klaytn-wallet-connection-check';

const klatn_icon =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/clubethimg.svg';

const klaytnMpwrlpStakAdd =
  process.env.REACT_APP_KLAYTN_MPWR_LP_STAKING_ADDRESS;
const ethMpwrlpStakAdd = process.env.REACT_APP_ETH_MPWR_LP_STAKING_ADDRESS;
const mpwrTokenAdd = process.env.REACT_APP_MPWR_KLAYTN_TOKEN_ADD;
const viewGuide = process.env.REACT_APP_MPWR_VIEW_GUIDE;

// propTypes is  props data type model
interface propTypes {
  ChekUserStep: (value:number)=>void;
  disableCheckHandler: (value:boolean)=>void;
  disableState: boolean;
  ethAmnt: string;
  mpwrAmnt: string;
  existingLockPeriod: string;
  checkMpwrHash: boolean;
}

export const LockUpPeriod = memo(
  ({
    ChekUserStep,
    disableCheckHandler,
    disableState,
    ethAmnt,
    mpwrAmnt,
    existingLockPeriod,
    checkMpwrHash,
  }: propTypes) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();

    const klaytnWallAdd: any = localStorage
      .getItem('KlaytnWalletAddress')
      ?.toLowerCase();
    const ethWallAdd: any = localStorage
      .getItem('Wallet Address')
      ?.toLowerCase();

    const [submitStakingDisBtn, setSubmitStakingDisBtn] =
      useState<boolean>(false);
    const [lockupPeriod, setLockupPeriod] =
      useState<string>(existingLockPeriod);
    const [startApprove, setStartApprove] = useState<boolean>(false);
    const [confirmAppove, setConfirmApprove] = useState<boolean>(false);
    const [startSendingMpwr, setStartSendingMpwr] = useState<boolean>(false);
    const [confirmSendingMpwr, setConfirmSendingMpwr] =
      useState<boolean>(false);
    const [startSendingEth, setStartSendingEth] = useState<boolean>(false);
    const [confirmSendingEth, setConfirmSendingEth] = useState<boolean>(false);

    // set lockup period handler
    const lockupPeriodHandler = (e: any) => {
      setLockupPeriod(e.target.value);
    };

    // disable submit button condition
    useEffect(() => {
      if (lockupPeriod === '') {
        setSubmitStakingDisBtn(true);
      } else {
        setSubmitStakingDisBtn(false);
      }
    }, [lockupPeriod]);

    // Approve Mpwr handler
    const approveMpwrHandler = async (mpwrAmntVal: string) => {
      setStartApprove(true);
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();
      const send_obj = { from: klaytnWallAdd, gas: null };

      const erc20Contract = new caver.klay.Contract(
        erc20Artifacts.abi,
        mpwrTokenAdd,
      );
      try {
        const getallowance = await erc20Contract.methods
          .allowance(klaytnWallAdd, klaytnMpwrlpStakAdd)
          .call();
        if (Number(mpwrAmntVal) > Number(getallowance)) {
          try {
            const approveRes = await erc20Contract.methods
              .approve(klaytnMpwrlpStakAdd, mpwrAmntVal)
              .send(send_obj);
            if (approveRes) {
              addToast('Mpwr approve successfully', {
                appearance: 'success',
                autoDismiss: true,
              });
              setStartApprove(false);
              setConfirmApprove(true);
              return true;
            }
          } catch (err: any) {
            addToast(err.message, {
              appearance: 'error',
              autoDismiss: true,
            });
            disableCheckHandler(false);
            setStartApprove(false);
            return false;
          }
        } else {
          setStartApprove(false);
          setConfirmApprove(true);
          return true;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        setStartApprove(false);
        return false;
      }
    };

    // Sending Mpwr handler
    const sendingMpwrHandler = async (data: any) => {
      try {
        setStartSendingMpwr(true);
        await klaytnWallConnCheck();
        const { KlaytnMpwrLpStakeContr }: any =
          await KlaytnMpwrLpStakingContract(klaytnMpwrlpStakAdd, true);
        try {
          const res = await KlaytnMpwrLpStakeContr.methods
            .deposit(
              data?.klaytn_address,
              data?.round_id,
              data?.mpwr_amount,
              data?.locking_period,
              data?.apr,
              data?.klaytn_signature_time,
              data?.klaytn_signature,
            )
            .send({ from: klaytnWallAdd, gas: null });
          if (res) {
            const req = {
              transaction_hash: res.transactionHash,
              contract_address: KlaytnMpwrLpStakeContr._address,
              network_id: '2',
            };
            const eventRes: any = await dispatch(eventsAction(req));
            setStartSendingMpwr(false);
            setConfirmSendingMpwr(true);
            if (eventRes?.status === 200) {
              const query = {
                lock: +lockupPeriod,
              };
              const res: any = await dispatch(
                generateMpwrDepositeSignatureAction(query),
              );
              await sendingEthHandler(res.data);
            }
            return true;
          }
        } catch (err: any) {
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
          disableCheckHandler(false);
          setStartSendingMpwr(false);
          setStartApprove(false);
          return false;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        setStartSendingMpwr(false);
        setStartApprove(false);
        return false;
      }
    };

    // Sending Eth Handler
    const sendingEthHandler = async (data: any) => {
      try {
        setStartSendingEth(true);
        const { EthMpwrLpStakeContr }: any = await EthMpwrLpStakingContract(
          ethMpwrlpStakAdd,
        );
        try {
          const res = await EthMpwrLpStakeContr.methods
            .deposit(
              data?.ethereum_address,
              data?.mpwr_amount,
              data?.round_id,
              data?.locking_period,
              data?.eth_reward,
              data?.eth_signature_time,
              data?.eth_signature,
            )
            .send({ from: ethWallAdd, value: data?.eth_amount });
          if (res) {
            const req = {
              transaction_hash: res.transactionHash,
              contract_address: EthMpwrLpStakeContr._address,
              network_id: '1',
            };
            await dispatch(eventsAction(req));
            setStartSendingEth(false);
            setConfirmSendingEth(true);
            disableCheckHandler(false);
            ChekUserStep(4);
            return true;
          }
        } catch (err: any) {
          addToast(err.message, {
            appearance: 'error',
            autoDismiss: true,
          });
          disableCheckHandler(false);
          setStartSendingEth(false);
          setStartSendingMpwr(false);
          return false;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        setStartSendingEth(false);
        setStartSendingMpwr(false);
        return false;
      }
    };

    // Generate Signature handler
    const generateEthMpwrSignatureHandler = async () => {
      try {
        disableCheckHandler(true);
        const query = {
          lock: +lockupPeriod,
        };
        const res: any = await dispatch(
          generateMpwrDepositeSignatureAction(query),
        );
        if (res.status) {
          if (!confirmSendingMpwr) {
            const appRes = await approveMpwrHandler(res.data.mpwr_amount);
            if (appRes) {
              await sendingMpwrHandler(res.data);
            }
          } else {
            await sendingEthHandler(res.data);
          }
        } else {
          addToast('Something went wrong. Please try again later.', {
            appearance: 'error',
            autoDismiss: true,
          });
          disableCheckHandler(false);
          return false;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        return false;
      }
    };

    useEffect(() => {
      if (checkMpwrHash) {
        setConfirmApprove(true);
        setConfirmSendingMpwr(true);
      }
    }, [checkMpwrHash]);

    return (
      <>
        <div className="lockup_period_wrp agovconnect_wallet_wrp agov_dao_lpStaking_modal">
          <div className="containe-fluid agovconnect_wallet_content lockup_period_inn agov_dao">
            <div className="agovconnect_wallet_header">
              <div className="agov_modal_inn">
                <h1>SELECT YOUR LOCK-UP PERIOD</h1>
                <p className="mobile_text">
                  You will only be able to unstake your tokens after the lock-up
                  period has ended
                </p>
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
                <p>You will stake</p>
                <h3>{ethAmnt} ETH</h3>
                <h3>{mpwrAmnt} MPWR</h3>
              </div>
            </div>
            <div className="lockup_period_inn_content">
              <div className="reward_comm_box row">
                <label htmlFor="nintydays">
                  <div className="reward_comm_left col">
                    <div className="row">
                      <div className="col-9 pr-0 text-left">
                        <div className="flex">
                          <img src={mpwr_icon} alt="agov" />
                          <img
                            className="klatn_icon"
                            src={klatn_icon}
                            alt="klatn"
                          />
                          <p className="agov_eth">MPWR-ETH</p>
                        </div>
                        <h3>90 DAYS</h3>
                        <div className="reward_wrp">
                          <h5>REWARDS</h5>
                          <div className="flex">
                            <img
                              src={CaretDoubleRightGreen}
                              alt="CaretDoubleRightGreen"
                            />
                            <h6>1 LLC for every 1 ETH</h6>
                          </div>
                          <div className="flex">
                            <img
                              src={CaretDoubleRightGreen}
                              alt="CaretDoubleRightGreen"
                            />
                            <h6>ETH rewards of 12% APR</h6>
                          </div>
                          <div className="flex mt-4">
                            <img
                              src={calendarblank}
                              alt="CaretDoubleRightGreen"
                            />
                            <h6>
                              Locked-up until{' '}
                              {moment(
                                new Date(
                                  new Date().setDate(new Date().getDate() + 90),
                                ),
                              ).format('D MMM YYYY')}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 text-right checkbox_wrp">
                        <div className="checkbox">
                          <input
                            type="radio"
                            id="nintydays"
                            name="radiobtn"
                            value="90"
                            checked={lockupPeriod === '90'}
                            onChange={lockupPeriodHandler}
                          />
                          <span></span>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
                <label htmlFor="oneeightydays">
                  <div className="reward_comm_right reward_comm_left col">
                    <div className="row">
                      <div className="col-9 pr-0 text-left">
                        <div className="flex">
                          <img src={mpwr_icon} alt="agov" />
                          <img
                            className="klatn_icon"
                            src={klatn_icon}
                            alt="klatn"
                          />
                          <p className="agov_eth">MPWR-ETH</p>
                        </div>
                        <h3>180 DAYS</h3>
                        <div className="reward_wrp">
                          <h5>REWARDS</h5>
                          <div className="flex">
                            <img
                              src={CaretDoubleRightGreen}
                              alt="CaretDoubleRightGreen"
                            />
                            <h6>2 LLC for every 1 ETH</h6>
                          </div>
                          <div className="flex">
                            <img
                              src={CaretDoubleRightGreen}
                              alt="CaretDoubleRightGreen"
                            />
                            <h6>ETH rewards of 12% APR</h6>
                          </div>
                          <div className="flex mt-4">
                            <img
                              src={calendarblank}
                              alt="CaretDoubleRightGreen"
                            />
                            <h6>
                              Locked-up until{' '}
                              {moment(
                                new Date(
                                  new Date().setDate(
                                    new Date().getDate() + 180,
                                  ),
                                ),
                              ).format('D MMM YYYY')}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 text-right checkbox_wrp">
                        <div className="checkbox">
                          <input
                            type="radio"
                            id="oneeightydays"
                            name="radiobtn"
                            value="180"
                            checked={lockupPeriod === '180'}
                            onChange={lockupPeriodHandler}
                          />
                          <span> </span>
                          <br />
                        </div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            <div className="agov_process_wrp">
              <div className="agov_process">
                <div
                  className={`agov_wrp ${startApprove ? 'start_approv' : ''} ${
                    confirmAppove ? 'aproved' : ''
                  }`}
                >
                  <span className="approving_agov"></span>
                  Approving MPWR
                </div>
                <hr
                  className={`agov_hr ${
                    confirmAppove ? 'start_approv aproved' : ''
                  }`}
                />
                <div
                  className={`agov_wrp ${
                    startSendingMpwr ? 'start_approv' : ''
                  } ${confirmSendingMpwr ? 'aproved' : ''}`}
                >
                  <span className="approving_agov"></span>
                  Sending MPWR
                </div>
                <hr
                  className={`agov_hr ${
                    confirmSendingMpwr ? 'start_approv aproved' : ''
                  }`}
                />
                <div
                  className={`agov_wrp ${
                    startSendingEth ? 'start_approv' : ''
                  } ${confirmSendingEth ? 'aproved' : ''}`}
                >
                  <span className="approving_agov"></span>
                  Sending ETH
                </div>
              </div>
            </div>
            <div className="club_createitem stake_agov_next_btn">
              <button
                type="button"
                disabled={submitStakingDisBtn || disableState}
                className={`mintbtn ${
                  submitStakingDisBtn || disableState ? 'disabled' : ''
                }`}
                onClick={generateEthMpwrSignatureHandler}
              >
                {disableState ? (
                  <Loading
                    className="icon-loading-style"
                    margin={'0'}
                    size={'50px'}
                  />
                ) : (
                  'SUBMIT STAKING'
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  },
);
