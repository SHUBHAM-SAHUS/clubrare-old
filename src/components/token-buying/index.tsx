import React, { memo, useEffect, useState } from 'react';
import './buy-token.scss';
import { useToasts } from 'react-toast-notifications';
import { getWeb3, iloTokenContract } from '../../service/web3-service';
import { useDispatch, useSelector } from 'react-redux';
import { postHarvestInfoAction } from '../../redux';
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useCustomStableCoin } from '../../hooks';
const ilo_contract_address =
  process.env.REACT_APP_ILO_CONTRACT_ADDRESS?.toLowerCase();

const TokenBuying = (props: any) => {
  const {  customToWei } = useCustomStableCoin();
  const { t } = useTranslation();
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const address = localStorage.getItem('Wallet Address');

  const [harvestLoading, setHarvestLoading] = useState<any>(false);
  const [withdrawLoading, setWithdrawLoading] = useState<any>(false);
  const [usdAmount, setUsdAmount] = useState(0);
  const [usdAmountWith, setUsdAmountWith] = useState(0);
  const [show, setShow] = useState(false);

  const CURRENCYDetailS = useSelector(
    (state: any) => state.ratechangeReducer.ratechange,
  );
  const harvestInValue = '0';

  const harvestModal = () => {
    if (!props.saleActiveCheck) {
      addToast('Sale is not active.', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    }
    if (!props.checkWhiteListUser) {
      addToast('You are not a whitelisted user.', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    }
    setShow(true);
  };

  const handleHarvest = async () => {
    try {
      props.iloLoading(true);
      setHarvestLoading(true);

      const { web3 }: any = await getWeb3();
      const { iloContract }: any = await iloTokenContract(ilo_contract_address);
      const harvestVal: any =    await customToWei(
        props.harvestValue,
       web3, '',
      );

      const data: any = await iloContract.methods
        .harvest(props.merkle_proof)
        .send({ from: address, value: harvestVal });

      if (data) {
        const req: any = {
          transaction_hash: data.transactionHash,
        };
        try {
          const res: any = await dispatch(postHarvestInfoAction(req));
          if (res) {
            props.iloLoading(false);
            setHarvestLoading(false);
            props.checkUpdate();
            addToast('Harvest successfully.', {
              appearance: 'success',
              autoDismiss: true,
            });
            setShow(false);
          } else {
            props.iloLoading(false);
            setHarvestLoading(false);
            addToast('There is some issue, Please try again later', {
              appearance: 'error',
              autoDismiss: true,
            });
            setShow(false);
          }
        } catch (error: any) {
          props.iloLoading(false);
          setHarvestLoading(false);
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          });
          setShow(false);
        }
      } else {
        props.iloLoading(false);
        setHarvestLoading(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
        setShow(false);
      }
    } catch (error: any) {
      props.iloLoading(false);
      setHarvestLoading(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
      setShow(false);
    }
  };

  const handleWithdraw = async (e: any) => {
    e.preventDefault();

    try {
      props.iloLoading(true);
      setWithdrawLoading(true);

      const { iloContract }: any = await iloTokenContract(ilo_contract_address);
      const data: any = await iloContract.methods
        .claimReward()
        .send({ from: address });

      if (data) {
        props.iloLoading(false);
        setWithdrawLoading(false);
        props.checkUpdate();
        addToast('Withdraw successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        props.iloLoading(false);
        setWithdrawLoading(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error: any) {
      props.iloLoading(false);
      setWithdrawLoading(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const getUsdRate = async (price: any, type: string) => {
    const { ethRate } = CURRENCYDetailS;
    const usdAmount: any = price * ethRate;
    if (usdAmount && usdAmount > 0) {
      if (type == 'harvest') {
        setUsdAmount(usdAmount.toFixed(2));
      } else if (type == 'withdraw') {
        setUsdAmountWith(usdAmount.toFixed(2));
      }
    }
  };

  useEffect(() => {
    getUsdRate(props.harvestValue, 'harvest');
    getUsdRate(props.withdrawValue, 'withdraw');
  }, [props.harvestValue, props.withdrawValue]);

  return (
    <>
      <div className="token_launch_right Polltoken_stack_wrp">
        <div className="reward_col_inner token_launch_left">
          <div className="reward_stack_wrp">
            <div className="stack_club_token">
              <div className="reward_col_inner liquidity_ilo buytoken_wrp">
                <h3> {t('token-buying.heading')}</h3>
                <div className="reward_stack_inn">
                  <label>Harvest</label>
                  <div>
                    <form>
                      <div className="reward_input_wrp">
                        <input
                          type="number"
                          name="harvest"
                          placeholder="0.00"
                          value={props.harvestValue}
                          readOnly
                        />
                        <span className="mpwr">ETH</span>
                        <span>
                          {usdAmount ? `$ ${usdAmount} USD` : '$0.00 USD'}
                        </span>
                      </div>
                      <div className="reward_btn_wrp">
                        <button
                          type="button"
                          className={`crtbtn ${
                            (props.harvestValue === '' ||
                              props.harvestValue === harvestInValue ||
                              props.harvestValue === undefined ||
                              props.checkHarvestDone) &&
                            `disablebtn`
                          } `}
                          onClick={harvestModal}
                          disabled={
                            props.harvestValue === '' ||
                            props.harvestValue === harvestInValue ||
                            props.harvestValue === undefined ||
                            props.checkHarvestDone
                          }
                        >
                          Harvest
                        </button>
                      </div>
                      {props.checkHarvestDone && (
                        <span>{t('token-buying.participated')}</span>
                      )}
                    </form>
                  </div>
                </div>
                <div className="reward_stack_inn">
                  <label>{t('token-buying.Withdraw')}</label>
                  <div>
                    <form onSubmit={(e) => handleWithdraw(e)}>
                      <div className="reward_input_wrp">
                        <input
                          type="number"
                          name="withdraw"
                          placeholder="0.00"
                          value={props.withdrawValue}
                          readOnly
                        />
                        <span className="mpwr">MPWR</span>
                        <span></span>
                      </div>
                      <div className="reward_btn_wrp">
                        <button
                          type="submit"
                          className={`crtbtn ${
                            (props.withdrawValue === '' ||
                              props.withdrawValue === harvestInValue ||
                              props.withdrawValue === undefined ||
                              withdrawLoading) &&
                            `disablebtn`
                          } `}
                          disabled={
                            props.withdrawValue === '' ||
                            props.withdrawValue === harvestInValue ||
                            props.withdrawValue === undefined ||
                            withdrawLoading
                          }
                        >
                          {withdrawLoading ? 'Loading...' : 'Withdraw'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        className="harvest_modal"
        backdrop="static"
        centered
      >
        <Modal.Header
          style={{ pointerEvents: harvestLoading ? 'none' : 'auto' }}
          closeButton
          className="border-none justify-content-end"
        ></Modal.Header>
        <Modal.Body>
          <p>{t('token-buying.text')}</p>
        </Modal.Body>
        <Modal.Footer className="border-none">
          <button
            type="button"
            className={`blkfull_btn ${harvestLoading && 'disablebtn'}`}
            disabled={harvestLoading}
            onClick={() => setShow(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`blkfull_btn ${harvestLoading && 'disablebtn'}`}
            onClick={handleHarvest}
            disabled={harvestLoading}
          >
            {harvestLoading ? 'Loading...' : 'Confirm'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default memo(TokenBuying);
