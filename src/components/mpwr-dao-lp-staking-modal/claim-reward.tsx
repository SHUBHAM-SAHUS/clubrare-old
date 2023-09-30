import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { eventsAction } from '../../redux/actions/create-collectibles-action';
import { EthMpwrLpStakingContract } from '../../service/web3-service';
import { Loading } from '../../components/loading';
const close =
  'https://d1gqvtt7oelrdv.cloudfront.net/assets/images/hamburger_close.svg';

// propTypes is  props data type model
interface propTypes {
  handleClose: ()=>void;
  show: boolean;
  claimData: any;
  disableCheckHandler: (value:boolean)=>void;
  disableState: boolean;
  transactionDataApi: ()=>void;
}

const ethMpwrlpStakAdd = process.env.REACT_APP_ETH_MPWR_LP_STAKING_ADDRESS;

export const ClaimRewardModal = ({
  handleClose,
  show,
  claimData,
  disableCheckHandler,
  disableState,
  transactionDataApi,
}: propTypes) => {
  const ethWallAdd: any = localStorage.getItem('Wallet Address')?.toLowerCase();

  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);

  // ClaimReward Handler
  const claimRewardHandler = async () => {
    try {
      setLoading(true);
      disableCheckHandler(true);
      const { EthMpwrLpStakeContr }: any = await EthMpwrLpStakingContract(
        ethMpwrlpStakAdd,
      );
      try {
        const res = await EthMpwrLpStakeContr.methods
          .withdraw(claimData?.deposit_id)
          .send({ from: ethWallAdd });
        if (res) {
          const req = {
            transaction_hash: res.transactionHash,
            contract_address: EthMpwrLpStakeContr._address,
            network_id: '1',
          };
          await dispatch(eventsAction(req));
          transactionDataApi();
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
  };

  return (
    <div>
      <Modal
        className="claim_rewards_modal agov_dao_lpStaking_modal"
        show={show}
        onHide={() => handleClose()}
        style={{ pointerEvents: disableState ? 'none' : 'auto' }}
        centered
      >
        <Modal.Header style={{ pointerEvents: disableState ? 'none' : 'auto' }}>
          <Modal.Title>CLAIM REWARDS</Modal.Title>
          <button onClick={() => handleClose()}>
            <img src={close} alt="modal-close" />
          </button>
        </Modal.Header>
        <Modal.Body style={{ pointerEvents: disableState ? 'none' : 'auto' }}>
          <p>Total amount of rewards available to claim</p>
          <div className="rewards_wrp row ">
            <div className="rewards col-5 ">
              <h6>ETH REWARD</h6>
              <span>{Number(claimData?.eth_reward).toFixed(6)}</span>
            </div>
            <div className="rewards  col-3 ">
              <h6>LLC</h6>
              <span>{claimData?.LLC}</span>
            </div>
            <div className="rewards  col-4 ">
              <h6>LP NFT</h6>
              <span>{claimData?.token_id}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ pointerEvents: disableState ? 'none' : 'auto' }}>
          <div className="club_createitem stake_agov_next_btn">
            <button
              onClick={claimRewardHandler}
              type="button"
              className={`mintbtn ${loading ? 'disabled' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <Loading
                  className="icon-loading-style"
                  margin={'0'}
                  size={'50px'}
                />
              ) : (
                'CLAIM REWARDS'
              )}
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
