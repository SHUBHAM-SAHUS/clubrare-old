import React, { memo, useEffect, useState } from 'react';
import './eth-llc-nft-lp-staking-modal.scss';
import mpwr_icon from '../../assets/images/mpwr_icon.svg';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { Loading } from '..';
import { eventsAction } from '../../redux/actions/create-collectibles-action';
import { createCollectionContract, EthLlcLpStakingContract, getWeb3 } from '../../service/web3-service';
import { imgConstants } from '../../assets/locales/constants';
import { useCustomStableCoin } from '../../hooks';

const viewGuide = process.env.REACT_APP_ETH_VIEW_GUIDE;
const minEthVal = process.env.REACT_APP_MINIMUM_ETH_VALUE;
const llcCollAdd = process.env.REACT_APP_LLC_COLLECTION_ADD;
const ethLlclpStakAdd = process.env.REACT_APP_ETH_LLC_NFT_LP_STAKING;

// propTypes is  props data type model
interface propTypes {
  ChekUserStep: (value:number) => void;
  disableCheckHandler: (value:boolean) => void;
  disableState: boolean;
  currExistingNftId: string;
}

export const StakeEth = memo(
  ({
    ChekUserStep,
    disableCheckHandler,
    disableState,
    currExistingNftId
  }: propTypes) => {
    const dispatch = useDispatch();
    const { addToast } = useToasts();
      const { customToWei } = useCustomStableCoin();


    const walletAmnt = localStorage.getItem('wallet_amount');
    const ethWallAdd: any = localStorage.getItem('Wallet Address')?.toLowerCase();

    const [llcEthVal, setLlcEthVal] = useState<string>('');
    const [ethValErr, setEthValErr] = useState<string>('');
    const [startApprove, setStartApprove] = useState<boolean>(false);
    const [confirmAppove, setConfirmApprove] = useState<boolean>(false);
    const [startSendingEth, setStartSendingEth] = useState<boolean>(false);
    const [confirmSendingEth, setConfirmSendingEth] = useState<boolean>(false);
    const [nextBtnDisable, setNextBtnDisable] = useState<boolean>(false);

    // Next button disable condition handler
    useEffect(() => {
      if (walletAmnt && llcEthVal) {
        if (
          Number(llcEthVal) > Number(walletAmnt) ||
          Number(llcEthVal) < Number(minEthVal)
        ) {
          setEthValErr('Not enough ETH available');
        } else {
          setEthValErr('');
        }
      }
      if (ethValErr !== '' || llcEthVal === '' || llcEthVal === '0') {
        setNextBtnDisable(true);
      } else {
        setNextBtnDisable(false);
      }
    }, [llcEthVal, ethValErr]);

   
    // Approve LLC handler 
    const approveLLCHandler = async () => {
      setStartApprove(true);
      try {
        const { collectionsContract }: any = await createCollectionContract(
          llcCollAdd
        );
        const getApprRes = await collectionsContract.methods.getApproved(currExistingNftId).call();
        if (getApprRes?.toLowerCase() !== ethLlclpStakAdd?.toLowerCase()) {
          try {
            const approveRes = await collectionsContract.methods.approve(ethLlclpStakAdd, currExistingNftId).send({from: ethWallAdd});
            if (approveRes) {
              addToast('LLC approved successfully', {
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
    }

    // Sending Eth Handler
    const sendingEthHandler = async () => {
      try {
        setStartSendingEth(true);
        const { EthLlcLpStakeContr }: any = await EthLlcLpStakingContract(
          ethLlclpStakAdd
        );
        try {
          const { web3 }: any = await getWeb3();
    const priceInWei: string = await customToWei(llcEthVal,web3,'');
          const res = await EthLlcLpStakeContr.methods
            .deposit(currExistingNftId)
            .send({ from: ethWallAdd, value: priceInWei });
          if (res) {
            const req = {
              transaction_hash: res.transactionHash,
              contract_address: EthLlcLpStakeContr._address,
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
          return false;
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        disableCheckHandler(false);
        setStartSendingEth(false);
        return false;
      }
    };

    // Generate Signature handler
    const generateEthSignatureHandler = async () => {
      try {
        disableCheckHandler(true);
        const appRes = await approveLLCHandler();
        if (appRes) {
          await sendingEthHandler();
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

    return (
      <>
        <div className='agov_dao_lpStaking_modal stake_modal_wrp lockup_period_wrp'>
          <div className='container-fluid'>
            <div className='stake_modal_inner agov_dao lockup_period_inn'>
              <h1>StakE eTH</h1>
              <p>Input ETH amount to stake for 180 days</p>
              <p className='red-note-txt'>Note: Please add flashbots <a href='https://docs.clubrare.xyz/international/korean/agov-and-dao/agov-migration-guide' rel='noreferrer' target='_blank'>RPC URL</a> in your metamask to deposit over ethereum network</p>
              <div className='view_guidebtn_wrp'>
                <a
                  href={viewGuide}
                  target='_blank'
                  rel='noreferrer'
                  className='view_guid_btn'
                >
                  VIEW GUIDE
                </a>
              </div>
              <div className='diposit_wrp'>
                <div className='diposit_inner'>
                  <img src={mpwr_icon} alt='agov' />
                  <img className='klatn_icon' src={imgConstants.clubethimg} alt='klatn' />
                  <p>ETH</p>
                </div>
                <h6>
                  Minimum <span>2 ETH</span> required to stake
                </h6>
                <div className='diposit_input_wrp'>
                  <input
                    type='number'
                    name='agov-eth'
                    placeholder='0.0 ETH'
                    value={llcEthVal}
                    onChange={(e) => setLlcEthVal(e.target.value)}
                  />
                  <div className='diposit_input_error d-flex justify-content-between'>
                    <span>{Number(walletAmnt)?.toFixed(6)} ETH available</span>
                    <span className='error'>{ethValErr}</span>
                  </div>
                </div>
              </div>
              <div className='agov_process_wrp'>
                <div className='agov_process'>
                  <div
                    className={`agov_wrp ${
                      startApprove ? 'start_approv' : ''
                    } ${confirmAppove ? 'aproved' : ''}`}
                  >
                    <span className='approving_agov'></span>
                    Approving LLC
                  </div>
                  <hr
                    className={`agov_hr ${
                      confirmAppove ? 'start_approv aproved' : ''
                    }`}
                  />
                  <div
                    className={`agov_wrp ${
                      startSendingEth ? 'start_approv' : ''
                    } ${confirmSendingEth ? 'aproved' : ''}`}
                  >
                    <span className='approving_agov'></span>
                    Sending ETH-LLC NFT
                  </div>
                </div>
              </div>
              <div className='club_createitem stake_agov_next_btn'>
                <button
                  type='button'
                  disabled={nextBtnDisable || disableState}
                  className={`mintbtn ${(disableState || nextBtnDisable) ? 'disabled' : ''}`}
                  onClick={generateEthSignatureHandler}
                >
                  {disableState ? (
                    <Loading
                      className='icon-loading-style'
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
        </div>
      </>
    );
  }
);
