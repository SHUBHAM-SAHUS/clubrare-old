import React, { memo, useEffect, useState } from 'react';
import Layout from '../../layouts/main-layout/main-layout';
import './ilo.scss';
import { FrequentlyAskQus } from '../../redux';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { getWeb3, iloTokenContract } from '../../service/web3-service/index';
import { getWhitelistUserDataAction } from '../../redux';
import '../../components/reward-stake/reward-stack.scss';
const FrequentlyAsking = React.lazy(
  () => import('../../components/frequently-asking'),
);
const TokenBuying = React.lazy(() => import('../../components/token-buying'));
const TokenLaunch = React.lazy(() => import('../../components/token-launch'));
const Footer = React.lazy(() => import('../../components/footer/footer'));
const ilo_contract_address =
  process.env.REACT_APP_ILO_CONTRACT_ADDRESS?.toLowerCase();
import { useCustomStableCoin } from '../../hooks';

const IloPage = () => {
  const dispatch: any = useDispatch();
  const [iloLoading, setIloLoading] = useState<any>(false);
  const [userDetail, setUserDetail] = useState<any>('');
  const [saleActiveCheck, setSaleActiveCheck] = useState(false);
  const [withdrawValue, setWithdrawValue] = useState('');
  const [harvestValue, setHarvestValue] = useState('');
  const [checkWhiteListUser, setCheckWhiteListUser] = useState<any>(false);
  const [merkleProof, setMerkleProof] = useState<any>();
  const [totalClaimedRewVal, setTotalClaimedRewVal] = useState<any>();
  const [checkHarvestDone, setCheckHarvestDone] = useState<any>(false);
  const [showNote, setShowNote] = useState<any>(true);
  const { addToast } = useToasts();
  const wallet_address: any = localStorage.getItem('Wallet Address');

  const { customFromWei } = useCustomStableCoin();

  const getWithdrawValue = async (web3: any, iloContract: any) => {
    if (!wallet_address) return;
    const calTokenRes = await iloContract.methods
      .calculateTokens(wallet_address)
      .call();
    const calTokenValue = await customFromWei(calTokenRes, web3, '');
    setWithdrawValue(calTokenValue);
  };

  const getProposalOffers = async () => {
    try {
      setIloLoading(true);

      const { web3 }: any = await getWeb3();
      const { iloContract }: any = await iloTokenContract(ilo_contract_address);
      if (wallet_address) {
        const userInfoRes = await iloContract.methods
          .userInfo(wallet_address)
          .call();

        const tokensClaimed = userInfoRes.tokensClaimed;
        const convTokensClaimed = await customFromWei(tokensClaimed, web3, '');
        setTotalClaimedRewVal(convTokensClaimed);
        setCheckHarvestDone(userInfoRes.isDone);
        setUserDetail(userInfoRes);
      }

      const saleActiveRes = await iloContract.methods.saleActive().call();
      setSaleActiveCheck(saleActiveRes);

      const tokenPrice = await iloContract.methods.tokenPrice().call();
      const conTokenValue = await customFromWei(tokenPrice, web3, '');
      setHarvestValue(conTokenValue);

      if (wallet_address) {
        getWithdrawValue(web3, iloContract);

        const checkWhiteListRes = await dispatch(getWhitelistUserDataAction());
        if (checkWhiteListRes.code === 200) {
          setCheckWhiteListUser(true);
          setMerkleProof(checkWhiteListRes.data.merkle_proof);
        }
      }

      setIloLoading(false);
    } catch (err) {
      setIloLoading(false);
    }
  };

  useEffect(() => {
    if (wallet_address) {
      const interval = setInterval(async () => {
        try {
          const { web3 }: any = await getWeb3();
          const { iloContract }: any = await iloTokenContract(
            ilo_contract_address,
          );
          getWithdrawValue(web3, iloContract);
        } catch (err: any) {
          return false;
        }
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, []);

  useEffect(() => {
    dispatch(FrequentlyAskQus());
    getProposalOffers();
  }, []);

  return (
    <>
      <div style={{ pointerEvents: iloLoading ? 'none' : 'auto' }}>
        <Layout mainClassName="ilo_page_wrp" hideCursor={iloLoading}>
          <div className="container-fluid">
            {!checkHarvestDone && (
              <div>
                {saleActiveCheck && (
                  <div
                    className={`notify_wrp ${!showNote && 'hidenote'} ${
                      !checkWhiteListUser && 'notwhitelistnote'
                    }`}
                  >
                    <p>
                      {checkWhiteListUser
                        ? 'You have been whitelisted for our Presale'
                        : 'You have not been whitelisted for our Presale'}
                    </p>
                    <button
                      type="button"
                      className="closenotewrp"
                      onClick={() => setShowNote(false)}
                    >
                      X
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="row">
              <div className="col-4 ilo_page_left_wrp">
                <TokenLaunch
                  userDetail={userDetail}
                  checkHarvestDone={checkHarvestDone}
                  totalClaimedRewVal={totalClaimedRewVal}
                />
              </div>
              <div className="col-8 ilo_page_rightt_wrp">
                <TokenBuying
                  saleActiveCheck={saleActiveCheck}
                  harvestValue={harvestValue}
                  withdrawValue={withdrawValue}
                  checkWhiteListUser={checkWhiteListUser}
                  merkle_proof={merkleProof}
                  checkHarvestDone={checkHarvestDone}
                  iloLoading={setIloLoading}
                  checkUpdate={getProposalOffers}
                />
                <FrequentlyAsking />
              </div>
            </div>
          </div>
        </Layout>
        <Footer />
      </div>
    </>
  );
};

export default memo(IloPage);
