import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { eventsAction } from '../../redux/actions/create-collectibles-action';
import { EthLlcLpStakingContract } from '../../service/web3-service';
import { Loading } from '../../components/loading'
import { imgConstants } from '../../assets/locales/constants';
import Tooltip from 'react-simple-tooltip';

// propTypes is  props data type model
interface propTypes {
  handleClose: () => void;
  show: boolean;
  claimData: any;
  disableCheckHandler: (value:boolean) => void;
  disableState: boolean;
  transactionDataApi: () => void;
  llcNftDataApi: () => void;
}

const ethLlclpStakAdd = process.env.REACT_APP_ETH_LLC_NFT_LP_STAKING;

export const ClaimRewardModal = ({
  handleClose,
  show,
  claimData,
  disableCheckHandler,
  disableState,
  transactionDataApi,
  llcNftDataApi,
}: propTypes) => {

  const ethWallAdd = localStorage.getItem('Wallet Address')?.toLowerCase();

  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  // ClaimReward Handler
  const claimRewardHandler = async () => {
    try {
      setLoading(true);
      disableCheckHandler(true);
      const { EthLlcLpStakeContr }: any = await EthLlcLpStakingContract(ethLlclpStakAdd);
      try {
        const res = await EthLlcLpStakeContr.methods.withdraw(claimData?.deposit_id).send({ from: ethWallAdd });
        if (res) {
          const req = {
            transaction_hash: res.transactionHash,
            contract_address: EthLlcLpStakeContr._address,
            network_id: '1',
          };
          await dispatch(eventsAction(req));
          transactionDataApi();
          llcNftDataApi();
          setLoading(false);
          disableCheckHandler(false);
          handleClose();
        }
      } catch (err: any) {
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
        setLoading(false);
        disableCheckHandler(false);
        handleClose();
      }
    } catch (err: any) {
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
      setLoading(false);
      disableCheckHandler(false);
      handleClose();
    }
  }

  return (
    <div>
      <Modal
        className='eth_llc_claim_popup claim_rewards_modal agov_dao_lpStaking_modal'
        show={show} onHide={() => handleClose()}
        style={{ pointerEvents: disableState ? 'none' : 'auto' }}
        centered >
        <Modal.Header style={{ pointerEvents: disableState ? 'none' : 'auto' }}>
          <Modal.Title>CLAIM REWARDS</Modal.Title>
          <button onClick={() => handleClose()} ><img src={imgConstants.hamburgerClose} alt='modal-close' /></button>
        </Modal.Header>
        <Modal.Body style={{ pointerEvents: disableState ? 'none' : 'auto' }}>
          <p>Total amount of rewards available to claim</p>
          <div className='rewards_wrp row ' >
            <div className='rewards col-5 ' >
              <h6>ETH REWARD</h6>
              <Tooltip className='trans_tootlip_wrp cardtooltip_wrp'
                  content={claimData?.eth_reward}
                >
                <span>{Number(claimData?.eth_reward).toFixed(6)}</span>
              </Tooltip>
            </div>
            <div className='rewards  col-3 ' >
              <h6>LLC ID</h6>
              <span>{claimData?.llcId}</span>
            </div>
            <div className='rewards  col-4 ' >
              <h6>LP NFT</h6>
              <Tooltip
                className='trans_tootlip_wrp cardtooltip_wrp'
                content={claimData?.token_id}
              >
                <span>{claimData?.token_id}</span>
              </Tooltip>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ pointerEvents: disableState ? 'none' : 'auto' }}>
          <div className='club_createitem stake_agov_next_btn'>
            <button onClick={claimRewardHandler} type='button' className={`mintbtn ${loading ? 'disabled' : ''}`} disabled={loading}>{loading ?
              <Loading
                className='icon-loading-style'
                margin={'0'}
                size={'50px'}
              /> : 'CLAIM REWARDS'}</button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
