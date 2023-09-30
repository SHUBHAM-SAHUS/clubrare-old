import './eth-llc-nft-lp-staking-modal.scss';
import metamaskicon from '../../assets/images/metamasklogo.svg';
import { memo } from 'react';
import { Loading } from '../loading';

const viewGuide = process.env.REACT_APP_ETH_VIEW_GUIDE

// propTypes is  props data type model
interface propTypes {
  isMetamaskConnected: boolean;
  metaMaskHandler: () => void;
  metamaskloading: boolean;
  firstbtnstate:boolean;
  ChekUserStep: (value:number) => void;
  isTransactHis:boolean;
  currTermCheck:boolean;
  handleTermsChecked: (value:boolean) => void;
}

export const EthLlcConnectWallet = memo(
  ({
    isMetamaskConnected,
    metaMaskHandler,
    metamaskloading,
    firstbtnstate,
    ChekUserStep,
    isTransactHis,
    currTermCheck,
    handleTermsChecked
  }: propTypes) => {

    const nextStepCondCheck = () => {
      if(isTransactHis) {
        ChekUserStep(4)
      } else {
        ChekUserStep(2)
      }
    }

    const onChecked = (e: any) => {
      handleTermsChecked(e.target.checked);
    };

    return (
      <>
        <div className='eth_llc_connect_wallet_wrp agovconnect_wallet_wrp agov_dao_lpStaking_modal'>
          <div className='containe-fluid agovconnect_wallet_content agov_dao'>
            <div className='agovconnect_wallet_header'>
              <div className='agov_modal_inn'>
                <h1>CONNECT WALLETS</h1>
                {!isMetamaskConnected ? 
                  <p>Connect your MetaMask wallet to continue</p> :
                  <p>MetaMask wallet connected. Click next to Stake ETH-LLC NFT</p>
                }
              </div>
              <div className='view_guidebtn_wrp'>
                <a href={viewGuide} target='_blank' rel='noreferrer' className='view_guid_btn'>
                  VIEW GUIDE
                </a>
              </div>
            </div>
            <div className='agovconnect_wallet_body'>
              {!isMetamaskConnected &&
              <div className='metamasklogo_right'>
                <label className='inline-flex items-center terms-input-wrp'>
                  <div className='ml-2 text-center connect_wallet_wrp'>
                    <label>
                      <input
                        checked={currTermCheck}
                        type='checkbox'
                        onChange={onChecked}
                        className='form-checkbox text-pink-50'
                      />
                      <span className='text-left ... pl-3'>
                        Please check you have added Flashbots Protect RPC to your Metamask.
                      </span>
                    </label>
                    <p>In order to continue, you must click the above checkbox.</p>
                  </div>
                </label>
                <figure>
                  <img
                    className='metamasklogo'
                    src={metamaskicon}
                    alt='metamask-logo'
                  />
                </figure>
                <div className='club_createitem'>
                  <button
                    type='button'
                    className={
                      isMetamaskConnected ? 'mintbtn connectmetamaskbtn disconnect' : 'mintbtn connectmetamaskbtn'
                    }
                    onClick={() => metaMaskHandler()}
                  >
                    <div>
                      {metamaskloading ? (
                        <div className='d-flex justify-center'>
                          <Loading margin={'0'} size={'25px'} />
                        </div>
                      ) : (
                        'CONNECT WALLET'
                      )}
                    </div>
                  </button>
                </div>
              </div> }
              <div className='club_createitem'>
                <button type='button' className={firstbtnstate?'mintbtn connectwallnextbtn':'mintbtn connectwallnextbtn disable' }  
                disabled={!firstbtnstate}
                onClick={nextStepCondCheck}
                >
                  NEXT
                </button>
              </div> 
            </div>
          </div>
        </div>
      </>
    );
  }
);
