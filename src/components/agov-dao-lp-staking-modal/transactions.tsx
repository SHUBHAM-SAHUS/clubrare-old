import './agov-dao-lp-staking-modal.scss';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { useCustomStableCoin } from '../../hooks';
import {
  getIsUserStakedAction,
  getTransactionInfoAction,
} from '../../redux/actions/agov-lpstacking-action';
import { useDispatch } from 'react-redux';
import { ClaimRewardModal } from './claim-reward';
import {
  EthAgovLpStakingContract,
  GetCaver,
  getWeb3,
} from '../../service/web3-service';
import moment from 'moment';
import { Spinner } from '../spinner';
import Tooltip from 'react-simple-tooltip';

type Transaction = {
  eth_amount: string;
  agov_amount: string;
  unlock_time: string;
  MPWR: string;
  LLC: string;
  token_id: string;
};

// propTypes is  props data type model
interface propTypes {
  disableCheckHandler: (value: boolean) => void;
  disableState: boolean;
  userStakedStatus: boolean;
  ChekUserStep: (res: number) => void;
  alertPopupShow: () => void;
  isWhitelistCheck: boolean;
  setUserStakedStatus: (res: boolean) => void;
}

const viewGuide = process.env.REACT_APP_VIEW_GUIDE;
const ethAgovlpStakAdd = process.env.REACT_APP_ETH_AGOV_LP_STAKING_ADDRESS;

export const Transactions = ({
  disableCheckHandler,
  disableState,
  userStakedStatus,
  ChekUserStep,
  alertPopupShow,
  isWhitelistCheck,
  setUserStakedStatus,
}: propTypes) => {
  const { customFromWei } = useCustomStableCoin();

  const klaytnWallAdd: any = localStorage
    .getItem('KlaytnWalletAddress')
    ?.toLowerCase();
  const dispatch = useDispatch();

  const [transactionData, setTransactionData] = useState<Array<Transaction>>(
    [],
  );
  const [claimRewardsModal, setClaimRewardsModal] = useState(false);
  const [loading, setLoading] = useState<boolean>();
  const [claimData, setClaimData] = useState<any>();

  const handleClaimRewardsClose = () => setClaimRewardsModal(false);

  const handleClaimRewardsShow = (data: any) => {
    setClaimRewardsModal(true);
    setClaimData(data);
  };

  const stakeHandler = () => {
    if (!userStakedStatus) {
      ChekUserStep(1);
    }
  };

  // check user staked status api call
  useEffect(() => {
    async function fetchData() {
      const res: any = await dispatch(getIsUserStakedAction());
      if (res) {
        setUserStakedStatus(res.status);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    alertPopupShow();
  }, []);

  // Transaction api data changes
  const transactionDataFunct = async () => {
    const showItems = [];
    setLoading(true);
    try {
      const query: { klaytn_address: string } = {
        klaytn_address: klaytnWallAdd,
      };
      const res: any = await dispatch(getTransactionInfoAction(query));
      if (res) {
        const transactionResult: any = res?.data;
        const { caver }: any = await GetCaver();
        const { web3 }: any = await getWeb3();
        const { EthAgovLpStakeContr }: any = await EthAgovLpStakingContract(
          ethAgovlpStakAdd,
        );
        for (let index = 0; index < transactionResult.length; index++) {
          const item = transactionResult[index];
          if (item) {
            const ethAmVal = await customFromWei(item?.eth_amount, web3, '');
            const agovAmVal = await customFromWei(item?.agov_amount, caver, '');
            item['ethAmVal'] = ethAmVal;
            item['agovAmVal'] = agovAmVal;
            try {
              const resMpwr = item?.mpwr_reward;
              item['MPWR'] = await customFromWei(
                resMpwr,
                web3,''
              );
            } catch (err: any) {}
            try {
              const resLlc = await EthAgovLpStakeContr.methods
                .rewardOfLLC(item?.deposit_id)
                .call();
              item['LLC'] = resLlc;
            } catch (err: any) {}
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

  return (
    <>
      <div className="transections_wrp agovconnect_wallet_wrp agov_dao_lpStaking_modal">
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
                          <th>AGOV</th>
                          <th>UNLOCK</th>
                          <th>MPWR</th>
                          <th>LLC</th>
                          <th>LP NFT</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionData.map((elm: any, i: number) => (
                          <tr key={i}>
                            <td>{Number(elm?.ethAmVal)?.toFixed(2)}</td>
                            <td>
                              <Tooltip
                                className="trans_tootlip_wrp cardtooltip_wrp"
                                content={elm?.agovAmVal}
                              >
                                <span>{elm?.agovAmVal}</span>
                              </Tooltip>
                            </td>
                            <td>
                              {moment(elm?.unlock_time).format('D MMM YYYY')}
                            </td>
                            <td>{Number(elm?.MPWR).toFixed(6)}</td>
                            <td>{elm?.LLC}</td>
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
                className={`mintbtn ${
                  userStakedStatus || !isWhitelistCheck ? 'disabled' : ''
                }`}
                disabled={userStakedStatus || !isWhitelistCheck}
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
          handleClose={(): void => {
            handleClaimRewardsClose();
          }}
          disableCheckHandler={disableCheckHandler}
          transactionDataApi={transactionDataFunct}
          disableState={disableState}
        />
      </div>
    </>
  );
};
