import './eth-llc-nft-lp-staking-modal.scss';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import {
  getLlcNftDataAction,
  getTransactionInfoAction,
} from '../../redux/actions/eth-llc-nft-lp-staking-action';
import { useDispatch } from 'react-redux';
import { ClaimRewardModal } from './claim-reward';
import { getWeb3 } from '../../service/web3-service';
import moment from 'moment';
import { Spinner } from '../spinner';
import Tooltip from 'react-simple-tooltip';
import { useCustomStableCoin } from '../../hooks';

type Transaction = {
  eth_amount: string;
  eth_reward: string;
  unlock_time: string;
  llcId: string;
  token_id: string;
};

// propTypes is  props data type model
interface propTypes {
  disableCheckHandler: (value: boolean) => void;
  disableState: boolean;
  ChekUserStep: (value: number) => void;
  alertPopupShow: () => void;
}

const viewGuide = process.env.REACT_APP_ETH_VIEW_GUIDE;

export const Transactions = ({
  disableCheckHandler,
  disableState,
  ChekUserStep,
  alertPopupShow,
}: propTypes) => {
  const dispatch = useDispatch();
  const { customFromWei } = useCustomStableCoin();

  const [transactionData, setTransactionData] = useState<Array<Transaction>>(
    [],
  );
  const [claimRewardsModal, setClaimRewardsModal] = useState(false);
  const [loading, setLoading] = useState<boolean>();
  const [claimData, setClaimData] = useState<any>();
  const [stakeBtnDisable, setStakeBtnDisable] = useState<boolean>(false);

  const handleClaimRewardsClose = () => setClaimRewardsModal(false);

  const handleClaimRewardsShow = (data: any) => {
    setClaimRewardsModal(true);
    setClaimData(data);
  };

  const stakeHandler = () => {
    ChekUserStep(2);
  };

  useEffect(() => {
    alertPopupShow();
  }, []);

  // Transaction api data changes
  const transactionDataFunct = async () => {
    let showItems = [];
    setLoading(true);
    try {
      const res: any = await dispatch(getTransactionInfoAction());
      if (res) {
        const transactionResult: any = res?.data;
        const { web3 }: any = await getWeb3();
        for (let index = 0; index < transactionResult.length; index++) {
          const item = transactionResult[index];
          if (item) {
            item['eth_reward'] = await customFromWei(
              item?.eth_reward,
              web3,
              '',
            );
            item['eth_amount'] = await customFromWei(
              item?.eth_amount,
              web3,
              '',
            );
            showItems.push(item);
          }
        }
        setTransactionData(showItems);
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
    }
  };

  useEffect(() => {
    transactionDataFunct();
  }, []);

  // LLC Nft data function to get all the LLC NFT
  const llcNftDataHandler = async () => {
    try {
      let req = {
        cursor: '',
      };
      const res: any = await dispatch(getLlcNftDataAction(req));
      if (res?.data?.result?.length === 0) {
        setStakeBtnDisable(true);
      }
    } catch (err: any) {}
  };

  useEffect(() => {
    llcNftDataHandler();
  }, []);

  return (
    <>
      <div className="eth_llc_transact_page transections_wrp agovconnect_wallet_wrp agov_dao_lpStaking_modal">
        <div className="containe-fluid agov_dao">
          <div className="agovconnect_wallet_header">
            <div className="agov_modal_inn">
              <h1>TRANSACTIONS</h1>
            </div>
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
            <div className="transections_table_wrp">
              <div className="resposive_table">
                {loading ? (
                  <div className="transact_load_wrp">
                    <Spinner />
                  </div>
                ) : (
                  transactionData && (
                    <Table>
                      <thead>
                        <tr>
                          <th>ETH</th>
                          <th>LLC ID</th>
                          <th>UNLOCK</th>
                          <th>ETH REWARD</th>
                          <th>LP NFT</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionData.map((elm: any, i: number) => (
                          <tr key={i}>
                            <td>
                              <Tooltip
                                className="trans_tootlip_wrp cardtooltip_wrp"
                                content={elm?.eth_amount}
                              >
                                <span>
                                  {Number(elm?.eth_amount).toFixed(2)}
                                </span>
                              </Tooltip>
                            </td>
                            <td>{elm?.llcId}</td>
                            <td>
                              {moment(elm?.unlock_time).format('D MMM YYYY')}
                            </td>
                            <td>
                              <Tooltip
                                className="trans_tootlip_wrp cardtooltip_wrp"
                                content={elm?.eth_reward}
                              >
                                <span>
                                  {Number(elm?.eth_reward).toFixed(6)}
                                </span>
                              </Tooltip>
                            </td>
                            <td>
                              <Tooltip
                                className="trans_tootlip_wrp cardtooltip_wrp"
                                content={elm?.token_id}
                              >
                                <span>{elm?.token_id}</span>
                              </Tooltip>
                            </td>
                            <td className="club_createitem">
                              {elm?.status === 'claimed' ? (
                                <label>Already claimed</label>
                              ) : (
                                <button
                                  type="button"
                                  className={`claimbtn mintbtn ${
                                    elm?.unlock_time &&
                                    new Date(elm?.unlock_time) > new Date()
                                      ? 'disabled'
                                      : ''
                                  }`}
                                  disabled={
                                    elm?.unlock_time &&
                                    new Date(elm?.unlock_time) > new Date()
                                  }
                                  onClick={() => handleClaimRewardsShow(elm)}
                                >
                                  Claim
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="agovconnect_wallet_body">
            <div className="club_createitem">
              <button
                type="button"
                className={`mintbtn ${stakeBtnDisable ? 'disabled' : ''}`}
                disabled={stakeBtnDisable}
                onClick={stakeHandler}
              >
                STAKE
              </button>
            </div>
          </div>
        </div>
        <ClaimRewardModal
          show={claimRewardsModal}
          claimData={claimData}
          handleClose={() => {
            handleClaimRewardsClose();
          }}
          disableCheckHandler={disableCheckHandler}
          transactionDataApi={transactionDataFunct}
          llcNftDataApi={llcNftDataHandler}
          disableState={disableState}
        />
      </div>
    </>
  );
};
