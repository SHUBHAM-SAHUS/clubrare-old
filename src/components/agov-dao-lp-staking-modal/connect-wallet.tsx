import './agov-dao-lp-staking-modal.scss';
import kikaslogo from '../../assets/images/kikaslogo.jpg';
import metamaskicon from '../../assets/images/metamasklogo.svg';
import { memo } from 'react';
import { Loading } from '../loading';

const viewGuide = process.env.REACT_APP_VIEW_GUIDE;

// propTypes is  props data type model
interface propTypes {
  isMetamaskConnected: boolean;
  isKaikasConnected: boolean;
  metaMaskHandler: ()=>void;
  metamaskloading: boolean;
  kaikasLoading: boolean;
  kaikasHandler: ()=>void;
  firstbtnstate: boolean;
  ChekUserStep: (value:number)=>void;
  userStakedStatus: boolean;
  isTransactHis: boolean;
  checkAgovHash: boolean;
}

export const AgovConnectWallet = memo(
  ({
    isMetamaskConnected,
    isKaikasConnected,
    metaMaskHandler,
    metamaskloading,
    kaikasLoading,
    kaikasHandler,
    firstbtnstate,
    ChekUserStep,
    userStakedStatus,
    isTransactHis,
    checkAgovHash,
  }: propTypes) => {
    const nextStepCondCheck = () => {
      if (userStakedStatus || isTransactHis) {
        ChekUserStep(4);
      } else if (checkAgovHash) {
        ChekUserStep(3);
      } else {
        ChekUserStep(2);
      }
    };

    return (
      <>
        <div className="agovconnect_wallet_wrp agov_dao_lpStaking_modal">
          <div className="containe-fluid agovconnect_wallet_content agov_dao">
            <div className="agovconnect_wallet_header">
              <div className="agov_modal_inn">
                <h1>CONNECT WALLETS</h1>
                <p>Connect your Kaikas and MetaMask wallets to continue</p>
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
            </div>
            <div className="agovconnect_wallet_body">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 kaikaslogo_left">
                  <figure>
                    <img
                      className="kaikaslogo"
                      src={kikaslogo}
                      alt="kaikas-logo"
                    />
                  </figure>
                  <div className="club_createitem">
                    <button
                      type="button"
                      className={
                        isKaikasConnected ? 'mintbtn disconnect' : 'mintbtn'
                      }
                      onClick={() => kaikasHandler()}
                    >
                      {isKaikasConnected ? (
                        <div>
                          {' '}
                          {kaikasLoading ? 'Loading...' : 'DISCONNECT'}{' '}
                        </div>
                      ) : (
                        <div>
                          {' '}
                          {kaikasLoading ? (
                            <div className="d-flex justify-center">
                              {' '}
                              <Loading margin={'0'} size={'25px'} />{' '}
                            </div>
                          ) : (
                            'CONNECT WALLET'
                          )}{' '}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 metamasklogo_right">
                  <figure>
                    <img
                      className="metamasklogo"
                      src={metamaskicon}
                      alt="kaikas-logo"
                    />
                  </figure>
                  <div className="club_createitem">
                    <button
                      type="button"
                      className={
                        isMetamaskConnected ? 'mintbtn disconnect' : 'mintbtn'
                      }
                      onClick={() => metaMaskHandler()}
                    >
                      {isMetamaskConnected ? (
                        <div>
                          {' '}
                          {metamaskloading ? 'Loading...' : 'DISCONNECT'}{' '}
                        </div>
                      ) : (
                        <div>
                          {' '}
                          {metamaskloading ? (
                            <div className="d-flex justify-center">
                              {' '}
                              <Loading margin={'0'} size={'25px'} />{' '}
                            </div>
                          ) : (
                            'CONNECT WALLET'
                          )}{' '}
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="club_createitem">
                <button
                  type="button"
                  className={firstbtnstate ? 'mintbtn' : 'mintbtn disable'}
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
  },
);
