import { useState, useEffect } from 'react';
import './agov-dao-lp-staking-modal.scss';
import mpwr_icon from '../../assets/images/mpwr_icon.svg';
import caretDoubleRight from '../../assets/images/CaretDoubleRight.svg';
import calendarblank from '../../assets/images/calendarblank.svg';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { eventsAction } from '../../redux/actions';
import erc20Artifacts from '../../smart-contract/erc-token.json';
import {
  EthAgovLpStakingContract,
  GetCaver,
  KlaytnAgovLpStakingContract,
} from '../../service/web3-service';
import { generateAgovDepositeSignatureAction } from '../../redux/actions/agov-lpstacking-action';
import { Loading } from '..';
import moment from 'moment';
import { klaytnWallConnCheck } from '../../utils/klaytn-wallet-connection-check';

const klatn_icon =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/clubethimg.svg';

const klaytnAgovlpStakAdd =
  process.env.REACT_APP_KLAYTN_AGOV_LP_STAKING_ADDRESS;
const ethAgovlpStakAdd = process.env.REACT_APP_ETH_AGOV_LP_STAKING_ADDRESS;
const agovTokenAdd = process.env.REACT_APP_AGOV_TOKEN_ADD;
const viewGuide = process.env.REACT_APP_VIEW_GUIDE;

// propTypes is  props data type model
interface propTypes {
  ChekUserStep: (value:number)=>void;
  disableCheckHandler: (value:boolean)=>void;
  disableState: boolean;
  ethAmnt: string;
  agovAmnt: string;
  existingLockPeriod: string;
  checkAgovHash: boolean;
}

export const LockUpPeriod = memo(
  ({
    ChekUserStep,
    disableCheckHandler,
    disableState,
    ethAmnt,
    agovAmnt,
    existingLockPeriod,
    checkAgovHash,
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
    const [startSendingAgov, setStartSendingAgov] = useState<boolean>(false);
    const [confirmSendingAgov, setConfirmSendingAgov] =
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

    // Approve Agov handler
    const approveAgovHandler = async (agovAmntVal: string) => {
      setStartApprove(true);
      await klaytnWallConnCheck();
      const { caver }: any = await GetCaver();
      const send_obj = { from: klaytnWallAdd, gas: null };

      const erc20Contract = new caver.klay.Contract(
        erc20Artifacts.abi,
        agovTokenAdd,
      );
      try {
        const getallowance = await erc20Contract.methods
          .allowance(klaytnWallAdd, klaytnAgovlpStakAdd)
          .call();
        if (Number(agovAmntVal) > Number(getallowance)) {
          try {
            const approveRes = await erc20Contract.methods
              .approve(klaytnAgovlpStakAdd, agovAmntVal)
              .send(send_obj);
            if (approveRes) {
              addToast('Agov approve successfully', {
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

    // Sending Agov handler
    const sendingAgovHandler = async (data: any) => {
      try {
        setStartSendingAgov(true);
        await klaytnWallConnCheck();
        const { KlaytnAgovLpStakeContr }: any =
          await KlaytnAgovLpStakingContract(klaytnAgovlpStakAdd, true);
        try {
          const res = await KlaytnAgovLpStakeContr.methods
            .deposit(
              data?.klaytn_address,
              data?.round_id,
              data?.agov_amount,
              data?.locking_period,
              data?.apr,
              data?.klaytn_signature_time,
              data?.klaytn_signature,
            )
            .send({ from: klaytnWallAdd, gas: null });
          if (res) {
            const req = {
              transaction_hash: res.transactionHash,
              contract_address: KlaytnAgovLpStakeContr._address,
              network_id: '2',
            };
            const eventRes: any = await dispatch(eventsAction(req));
            setStartSendingAgov(false);
            setConfirmSendingAgov(true);
            if (eventRes?.status === 200) {
              const query = {
                lock: +lockupPeriod,
              };
              const res: any = await dispatch(
                generateAgovDepositeSignatureAction(query),
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
          setStartSendingAgov(false);
          setStartApprove(false);
          return false;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        setStartSendingAgov(false);
        setStartApprove(false);
        return false;
      }
    };

    // Sending Eth Handler
    const sendingEthHandler = async (data: any) => {
      try {
        setStartSendingEth(true);
        const { EthAgovLpStakeContr }: any = await EthAgovLpStakingContract(
          ethAgovlpStakAdd,
        );
        try {
          const res = await EthAgovLpStakeContr.methods
            .deposit(
              data?.ethereum_address,
              data?.agov_amount,
              data?.round_id,
              data?.locking_period,
              data?.mpwr_reward,
              data?.eth_signature_time,
              data?.eth_signature,
            )
            .send({ from: ethWallAdd, value: data?.eth_amount });
          if (res) {
            const req = {
              transaction_hash: res.transactionHash,
              contract_address: EthAgovLpStakeContr._address,
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
          setStartSendingAgov(false);
          return false;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        setStartSendingEth(false);
        setStartSendingAgov(false);
        return false;
      }
    };

    // Generate Signature handler
    const generateEthAgovSignatureHandler = async () => {
      try {
        disableCheckHandler(true);
        const query = {
          lock: +lockupPeriod,
        };
        const res: any = await dispatch(
          generateAgovDepositeSignatureAction(query),
        );
        if (res.status) {
          if (!confirmSendingAgov) {
            const appRes = await approveAgovHandler(res.data.agov_amount);
            if (appRes) {
              await sendingAgovHandler(res.data);
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
      if (checkAgovHash) {
        setConfirmApprove(true);
        setConfirmSendingAgov(true);
      }
    }, [checkAgovHash]);

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
                <h3>{agovAmnt} AGOV</h3>
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
                          <p className="agov_eth">AGOV-ETH</p>
                        </div>
                        <h3>90 DAYS</h3>
                        <div className="reward_wrp">
                          <h5>REWARDS</h5>
                          <div className="flex">
                            <img
                              src={caretDoubleRight}
                              alt="caretDoubleRight"
                            />
                            <h6>Round 1: MPWR rewards of 30% APR</h6>
                          </div>
                          <div className="flex">
                            <img
                              src={caretDoubleRight}
                              alt="caretDoubleRight"
                            />
                            <h6>Round 2: MPWR rewards of 20% APR</h6>
                          </div>
                          <div className="flex">
                            <img
                              src={caretDoubleRight}
                              alt="caretDoubleRight"
                            />
                            <h6>Round 3: MPWR rewards of 10% APR</h6>
                          </div>
                          <div className="flex mt-4">
                            <img src={calendarblank} alt="caretDoubleRight" />
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
                          <p className="agov_eth">AGOV-ETH</p>
                        </div>
                        <h3>180 DAYS</h3>
                        <div className="reward_wrp">
                          <h5>REWARDS</h5>
                          <div className="flex">
                            <img
                              src={caretDoubleRight}
                              alt="caretDoubleRight"
                            />
                            <h6>Round 1: MPWR rewards of 30% APR</h6>
                          </div>
                          <div className="flex">
                            <img
                              src={caretDoubleRight}
                              alt="caretDoubleRight"
                            />
                            <h6>Round 2: MPWR rewards of 20% APR</h6>
                          </div>
                          <div className="flex">
                            <img
                              src={caretDoubleRight}
                              alt="caretDoubleRight"
                            />
                            <h6>Round 3: MPWR rewards of 10% APR</h6>
                          </div>
                          <div className="flex mt-4">
                            <img src={calendarblank} alt="caretDoubleRight" />
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
                  Approving AGOV
                </div>
                <hr
                  className={`agov_hr ${
                    confirmAppove ? 'start_approv aproved' : ''
                  }`}
                />
                <div
                  className={`agov_wrp ${
                    startSendingAgov ? 'start_approv' : ''
                  } ${confirmSendingAgov ? 'aproved' : ''}`}
                >
                  <span className="approving_agov"></span>
                  Sending AGOV
                </div>
                <hr
                  className={`agov_hr ${
                    confirmSendingAgov ? 'start_approv aproved' : ''
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
                onClick={generateEthAgovSignatureHandler}
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
