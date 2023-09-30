import React, { memo, useState, useEffect } from 'react';
import ClaimRewards from '../../components/claim-rewards';
import PoolStake from '../../components/pool-stake';
import RewardStack from '../../components/reward-stake';
import MainLayout from '../../layouts/main-layout/main-layout';
import { useCustomStableCoin } from '../../hooks';
import './stake.scss';
import {
  getWeb3,
  TradingclaimRewards,
  mpwrtokencontract,
  tokenstackingContract,
  ListingclaimRewards,
  airdropContract,
  LPStakingContract,
  UNiswapContract,
} from '../../service/web3-service';
import {
  getTradingRewardsAction,
  getListingRewardsAction,
} from '../../redux/actions/trading-rewards';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import StakeTokenComponent from '../../components/stake-token/stake-token-component';
import {
  eventsAction,
  liquidityUsdAction,
  lpstakingSignatureAction,
  getAllDepositsAction,
  getTotalLpLockedAction,
  lpstakingWithDrawSignatureAction,
} from '../../redux/actions';
import '../create/create.css';
import { AddToToken } from '../../components/add-to-token';
import LpStaketable from './lpstake-maintable';
import AgovLpStakePool from '../../components/agov-weth-lp-staking/index';
import CardSkeleton from '../../components/skeleton/card-skeleton';
import * as Sentry from '@sentry/browser';
const Footer = React.lazy(() => import('../../components/footer/footer'));
declare const window: any;

// number type is not working
const lockedPeriod: any = [[3, 6, 9, 12], [0], [0]];
const lockedPeriodMpwr: any = [0, 3, 6, 9, 12];

const Stack = () => {
  let interval: any = null;
  const walletAddress = localStorage.getItem('Wallet Address')?.toLowerCase();
  const tradingClaimRewards =
    process.env.REACT_APP_TRADING_CLAIM_REWARDS_CONTRACT_ADDRESS?.toLowerCase();
  const lpStakeContractAddress =
    process.env.REACT_APP_LPSTAKING_CONTRACT_ADDRESS?.toLowerCase();
  const mpwrToken =
    process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS?.toLowerCase();
  const stakingToken =
    process.env.REACT_APP_TOKEN_STAKING_CONTRACT_ADDRESS?.toLowerCase();
  const claimReward =
    process.env.REACT_APP_LISTING_CLAIM_REWARDS_CONTRACT_ADDRESS?.toLowerCase();
  const uniswap = process.env.REACT_APP_UNISWAP_CONTRACT_ADDRESS?.toLowerCase();
  const wethToken = process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase();
  const ethAgovToken = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD?.toLowerCase();
  const { customFromWei, customToWei } = useCustomStableCoin();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [cursor, Setcursor] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [stakentoken, Setstaketoken] = useState('');
  const [listingloading, Setlistingloading] = useState<boolean>(false);
  const [tradingloading, Settradingloading] = useState<boolean>(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [tradingRewardsbalance, SettradingRewardsbalance] = useState<number>(0);
  const [listingRewardsbalance, SetListingRewardsbalance] = useState<number>(0);
  const [tradingRewardRes, setTradingRewardRes] = useState<any>();
  const [listingRewrdsRes, SetlistingRewardsRes] = useState<any>();
  const [lockedoption, Setlockedoption] = useState<number>(3);
  const [poolPeriodValue, setpoolPeriodValue] = useState<number>(0);
  const [addTokenLoading, setAddTokenLoading] = useState<boolean>(false);
  const [stakeRewardLoading, setStakeRewardLoading] = useState<boolean>(false);
  const [claimSuccessCheck, setClaimSuccessCheck] = useState<boolean>(false);
  const [airdropStashData, setAirdropStashData] = useState<any>([]);
  const [tokenstakeError, SettokenstakeError] = useState({
    TokenStakeValueError: '',
  });
  const [mpwrtoken, setmpwrtoken] = useState<string>('0');
  const [tokenstackingmodel, Settokenstackingmodel] = useState<boolean>(false);
  const [Lpstackingmodel, SetLpstackingmodel] = useState<boolean>(false);
  const [lpwithdrawmodel, Setlpwithdrawmodel] = useState<boolean>(false);
  const [showPoolLoading, setShowPoolLoading] = useState<boolean>(false);
  const [showAgovPoolLoading, setShowAgovPoolLoading] =
    useState<boolean>(false);
  const [showPageLoading, setShowPageLoading] = useState<boolean>(false);

  const [AprLpStake, LpSetAprStake] = useState<any>({
    pool_0: [],
    pool_1: [],
    pool_2: [],
  });
  const [tvlLplstake, setLptvlStake] = useState<number>(0);
  const [commonloading, Setcommoloading] = useState<boolean>(false);
  const [lpemergencywithdrawmodel, Setlpemergencywithdrawmodel] =
    useState<boolean>(false);
  const [swaplistid, Setswaplistid] = useState<number>(0);
  const [uniswaplist, Setuniswaplist] = useState<any>([]);
  const [showlistdata, Setshowlistdata] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<any>(null);
  const [lpimage, Setlpimage] = useState<any>();
  const [AprStacking, SetAprstackig] = useState<any>();
  const [stackingperiod, Setstackingperiod] = useState<number>(0);
  const [tvlstackinglstake, Setstackingtvlstake] = useState<number>(0);
  const [stackingspinner, Setstackingspinner] = useState<boolean>(false);
  const [spinnerloading, Setspinnerloading] = useState<boolean>(false);
  const [lpStakingMpwrDepositList, setLpStakingMpwrDepositList] =
    useState<any>();
  const [getstackingtabledata, Setgetstackingtabledata] = useState<any>();
  const [valueOfRedio, setValueOfRedio] = useState<boolean>(false);
  const [isLpstakingValueChange, setIsLpstakingValueChange] =
    useState<boolean>(false);
  const [poolIdByPosition, setPoolIdByPosition] = useState<number>(1);
  const [ifInputChecked, setIfInputChecked] = useState<boolean>(false);
  const [uniswapAgovIdList, setUniswapAgovIdList] = useState<any>([]);
  const [agovInputChecked, setAgovInputChecked] = useState<boolean>(false);
  const [agovUniswapId, setAgovUniswapId] = useState<number>(0);
  const [agovLpStakingModal, setAgovLpStakingModal] = useState<boolean>(false);
  const [agovNftTvlAmount, setAgovNftTvlAmount] = useState<number>(0);
  const [showDepositLoading, setShowDepositLoading] = useState<boolean>(false);

  // fetch list of all deposits data
  const getMpwrWethLpStakeDeposits = async () => {
    if (!walletAddress) {
      return;
    }
    setShowDepositLoading(true);
    Setspinnerloading(true);
    const allDepositsResult: any = await dispatch(getAllDepositsAction());
    try {
      if (allDepositsResult && allDepositsResult.data?.length > 0) {
        setLpStakingMpwrDepositList(allDepositsResult?.data);
      }
      setShowDepositLoading(false);
      Setspinnerloading(false);
    } catch (err) {
      setShowDepositLoading(false);
      Setspinnerloading(false);
    }
  };

  useEffect(() => {
    getMpwrWethLpStakeDeposits();
  }, []);

  const getStackingTableInfo = async () => {
    if (!walletAddress) {
      return;
    }
    setShowDepositLoading(true);
    Setstackingspinner(true);
    const { web3 }: any = await getWeb3();
    const { StackingContract }: any = await tokenstackingContract(stakingToken);
    try {
      let getDeposits = await StackingContract.methods
        .getDeposits(walletAddress)
        .call();

      if (getDeposits && getDeposits.length > 0) {
        const stakingList = [];
        for (const obj of getDeposits) {
          if (obj.stake > 0) {
            const element: any = {
              APR: obj.APR,
              depositId: obj.depositId,
              lastRewardCalculated: obj.lastRewardCalculated,
              period: obj.period,
              poolId: obj.poolId,
              reward: obj.reward,
              stake: obj.stake,
              Nft_id: obj.NFTId,
              isDyanmic: obj.isDyanmic,
            };
            const stakeVal = await customFromWei(element?.stake, web3, '');
            element.stakeInEth = Number(stakeVal);
            let calculatedRewards = await StackingContract.methods
              .calculateReward(walletAddress, obj.depositId, false)
              .call();
            element.calculatedRewards = await customFromWei(
              calculatedRewards,
              web3,
              '',
            );
            let emergencycalculatedRewards = await StackingContract.methods
              .calculateReward(walletAddress, obj.depositId, true)
              .call();
            element.emergencycalculatedRewards = await customFromWei(
              emergencycalculatedRewards,
              web3,
              '',
            );
            try {
              let marketfee = await StackingContract.methods
                .getHavestAmount(walletAddress, obj.depositId)
                .call();
              element.marketfee = customFromWei(marketfee, web3, '');
            } catch (err) {
              return err;
            }
            stakingList.push(element);
          }
        }
        Setgetstackingtabledata(stakingList);
      }
      setShowDepositLoading(false);
      Setstackingspinner(false);
    } catch (err) {
      setShowDepositLoading(false);
      Setstackingspinner(false);
    }
  };

  useEffect(() => {
    getStackingTableInfo();
  }, []);
  const AprLpStakingfunction = async () => {
    const { lpStakeContr }: any = await LPStakingContract(
      lpStakeContractAddress,
    );
    let sub_array: any = [];
    let super_array: any = [];
    let sub_array_II: any = [];
    let super_array_II: any = [];
    let sub_array_pool_third: any = [];
    let super_array_pool_third: any = [];
    const { web3 }: any = await getWeb3();
    for (let i = 0; i < lockedPeriod.length; i++) {
      const element = lockedPeriod[i];
      if (i === 0) {
        for (let j of element) {
          try {
            const aprAmount: string = await lpStakeContr.methods
              .vestingAPRPerPool(i, j)
              .call(); //pool :0
            sub_array.push([j * 30, Number(aprAmount) / 1000, j]);
            super_array.push(sub_array.slice(0));
          } catch (err) {
            setShowPageLoading(false);
            return false;
          }
        }
      } else if (i === 1) {
        for (let j of element) {
          try {
            const stakingTotalLockedValue: any = await dispatch(
              getTotalLpLockedAction(i),
            );
            if (stakingTotalLockedValue && stakingTotalLockedValue?.data) {
              const ethWeiValue: any = await customToWei(
                stakingTotalLockedValue?.data.ethRate.toString(),
                web3,
                '',
              );
              const totalLockedValue: any = await customToWei(
                stakingTotalLockedValue?.data.lpLockedInPool.toString(),
                web3,
                '',
              );
              const aprAmount: string = await lpStakeContr.methods
                .getDyanmicAPR(i, j, ethWeiValue, totalLockedValue)
                .call(); //pool :1
              sub_array_II.push([j * 30, Number(aprAmount) / 1000, j]);
              super_array_II.push(sub_array_II.slice(0));
            }
          } catch (err) {
            setShowPageLoading(false);
            return false;
          }
        }
      } else if (i === 2) {
        for (let k of element) {
          try {
            const stakingTotalLockedValue: any = await dispatch(
              getTotalLpLockedAction(i),
            );
            if (stakingTotalLockedValue && stakingTotalLockedValue?.data) {
              const ethWeiValue: any = await customToWei(
                stakingTotalLockedValue?.data.ethRate.toString(),
                web3,
                '',
              );
              const totalLockedValue: any = await customToWei(
                stakingTotalLockedValue?.data.lpLockedInPool.toString(),
                web3,
                '',
              );
              const aprAmount: string = await lpStakeContr.methods
                .getDyanmicAPR(i, k, ethWeiValue, totalLockedValue)
                .call(); //pool :2
              sub_array_pool_third.push([k * 30, Number(aprAmount) / 1000, k]);
              super_array_pool_third.push(sub_array_pool_third.slice(0));
            }
          } catch (err) {
            setShowPageLoading(false);
            return false;
          }
        }
      }
    }
    const lastElement: any = super_array[super_array.length - 1];
    const lastElementII: any = super_array_II[super_array_II.length - 1];
    const lastElementThird: any =
      super_array_pool_third[super_array_pool_third.length - 1];
    LpSetAprStake({
      pool_0: lastElement,
      pool_1: lastElementII,
      pool_2: lastElementThird,
    });
    setShowPageLoading(false);
  };

  useEffect(() => {
    setShowPageLoading(true);
    AprLpStakingfunction();
    lpStakingAprChanges();
    return () => {
      clearInterval(interval);
    };
  }, []);

  // update APR every 5 sec
  const lpStakingAprChanges = () => {
    interval = setInterval(() => {
      AprLpStakingfunction();
    }, 5000);
    return () => clearInterval(interval);
  };

  const handleLiquidityInUsd = async () => {
    const result: any = await dispatch(liquidityUsdAction());
    if (result?.data) {
      setLptvlStake(result?.data?.pool0Amount + result?.data?.pool1Amount);
      setAgovNftTvlAmount(result?.data?.pool2Amount);
    } else {
      return false;
    }
  };

  useEffect(() => {
    handleLiquidityInUsd();
  }, []);

  const TvlStakingfunction = async () => {
    const { web3 }: any = await getWeb3();
    const { StackingContract }: any = await tokenstackingContract(stakingToken);
    try {
      const Tvlamount = await StackingContract.methods
        .periodPoolMap(stackingperiod)
        .call();
      const TvlNum: any = await customFromWei(Tvlamount?.tvl, web3, '');
      const tvlnum1 = Number(parseFloat(TvlNum).toFixed(3));

      Setstackingtvlstake(tvlnum1);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    TvlStakingfunction();
  }, [tvlstackinglstake, stackingperiod]);

  const AprforStakingfunction = async () => {
    const { StackingContract }: any = await tokenstackingContract(stakingToken);
    let sub_array: any = [];
    let super_array: any = [];
    for (let i of lockedPeriodMpwr) {
      try {
        const Apramount: any = await StackingContract.methods
          .vestingAPRPerPool(0, i)
          .call();
        let aprNum = Number(Apramount);
        sub_array.push([i * 30, aprNum / 1000, i]);
        super_array.push(sub_array.slice(0));
      } catch (err) {
        return false;
      }
    }
    let lastElement: any = super_array[super_array.length - 1];
    SetAprstackig(lastElement);
  };

  useEffect(() => {
    AprforStakingfunction();
  }, [AprStacking]);

  const getMpwrBalance = async () => {
    if (!walletAddress) {
      return;
    }
    const { web3 }: any = await getWeb3();
    try {
      const { mpwrContract }: any = await mpwrtokencontract(mpwrToken);
      let result_MpWR_balance = await mpwrContract.methods
        .balanceOf(walletAddress)
        .call();
      const Mwr_balance = await customFromWei(result_MpWR_balance, web3, '');
      setmpwrtoken(Mwr_balance);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    getMpwrBalance();
  }, [mpwrtoken]);

  //  listingRewards && tradingrewards module ***
  const listingRewards = async () => {
    if (!walletAddress) {
      return;
    }
    const { web3 }: any = await getWeb3();
    try {
      const listingRes: any = await getListingRewardsAction();
      if (listingRes) {
        SetlistingRewardsRes(listingRes);

        const { listingRewardsContract }: any = await ListingclaimRewards(
          claimReward,
        );
        const trading_rewards_balance = await listingRewardsContract.methods
          .canClaim(
            walletAddress,
            (listingRes?.total_rewards).toLocaleString('fullwide', {
              useGrouping: false,
            }),
            listingRes?.merkle_proof,
          )
          .call();
        const mpwr_amount: any = await customFromWei(
          trading_rewards_balance[1],
          web3,
          '',
        );

        SetListingRewardsbalance(Number(parseFloat(mpwr_amount).toFixed(3)));
      } else {
        SetlistingRewardsRes(0);
      }
    } catch (err) {
      Sentry.captureException(err);
      return err;
    }
  };
  const ReqRewardsListingfun = async (props: string) => {
    if (!walletAddress) {
      return;
    }
    const { listingRewardsContract }: any = await ListingclaimRewards(
      claimReward,
    );
    const { tradingRewardsContract }: any = await TradingclaimRewards(
      tradingClaimRewards,
    );
    if (props === 'listing') {
      Setlistingloading(true);
      Setcursor(true);
      try {
        const claimResult = await listingRewardsContract.methods
          .claim(
            (listingRewrdsRes?.total_rewards).toLocaleString('fullwide', {
              useGrouping: false,
            }),
            listingRewrdsRes?.merkle_proof,
          )
          .send({ from: walletAddress });

        const listinghashresult = {
          transaction_hash: claimResult?.transactionHash,
          contract_address: claimReward,
          network_id: '1',
        };

        dispatch(eventsAction(listinghashresult));
        listingRewards();

        addToast(' Listing rewards successfully updated', {
          appearance: 'success',
          autoDismiss: true,
        });
        Setlistingloading(false);
        Setcursor(false);
      } catch (err) {
        Setlistingloading(false);
        Setcursor(false);
      }
    } else if (props === 'trading') {
      Settradingloading(true);
      Setcursor(true);
      try {
        const claimResult = await tradingRewardsContract.methods
          .claim(
            (tradingRewardRes?.total_rewards).toLocaleString('fullwide', {
              useGrouping: false,
            }),
            tradingRewardRes?.merkle_proof,
          )
          .send({ from: walletAddress });

        const tradinghashresult = {
          transaction_hash: claimResult?.transactionHash,
          contract_address: tradingClaimRewards,
          network_id: '1',
        };

        dispatch(eventsAction(tradinghashresult));
        tradingRewards();

        addToast(' Trading rewards successfully updated', {
          appearance: 'success',
          autoDismiss: true,
        });
        Settradingloading(false);
        Setcursor(false);
      } catch (err) {
        Settradingloading(false);
        Setcursor(false);
      }
    } else if (props === 'marketing') {
    }
  };

  useEffect(() => {
    listingRewards();
  }, [listingRewardsbalance]);

  const tradingRewards = async () => {
    if (!walletAddress) {
      return;
    }
    const { web3 }: any = await getWeb3();
    try {
      const tradingRes = await getTradingRewardsAction();
      if (tradingRes) {
        setTradingRewardRes(tradingRes);

        const { tradingRewardsContract }: any = await TradingclaimRewards(
          tradingClaimRewards,
        );
        const trading_rewards_balance = await tradingRewardsContract.methods
          .canClaim(
            walletAddress,
            (tradingRes?.total_rewards).toLocaleString('fullwide', {
              useGrouping: false,
            }),
            tradingRes?.merkle_proof,
          )
          .call();
        const mpwr_amount: any = await customFromWei(
          trading_rewards_balance[1],
          web3,
          '',
        );

        SettradingRewardsbalance(Number(parseFloat(mpwr_amount).toFixed(3)));
      } else {
        SettradingRewardsbalance(0);
      }
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    tradingRewards();
  }, [tradingRewardsbalance]);

  // LP stacking module*****
  // redio button check
  const handleSelect = (data: any, poolPeriod: number, e: any) => {
    setIsLpstakingValueChange(true);
    Setlockedoption(+data);
    setpoolPeriodValue(poolPeriod);
    setIfInputChecked(e.currentTarget.checked);
  };

  const handleSelectAgov = (data: any, poolPeriod: number, e: any) => {
    setIsLpstakingValueChange(true);
    Setlockedoption(+data);
    setpoolPeriodValue(poolPeriod);
    setAgovInputChecked(e.currentTarget.checked);
  };

  const handleSwapSelect = async (data: any, poolIdByPosition: number) => {
    setShowPoolLoading(true);
    setPoolIdByPosition(poolIdByPosition);
    Setswaplistid(+data);
    if (lockedoption === 0) {
      setpoolPeriodValue(1);
    } else {
      setpoolPeriodValue(poolIdByPosition);
    }
    setIfInputChecked(false);
    const { UniSwapContr }: any = await UNiswapContract(uniswap);
    try {
      let imagedata = await UniSwapContr.methods.tokenURI(+data).call();
      let buff: any = new Buffer(imagedata.split(',')[1], 'base64').toString();
      let base64ToStringNew = JSON.parse(buff);
      Setlpimage(base64ToStringNew.image);
      setShowPoolLoading(false);
    } catch (err) {
      setShowPoolLoading(false);
      return false;
    }
  };

  const handleAgovUniswapSelect = async (
    data: any,
    poolIdByPosition: number,
  ) => {
    setShowAgovPoolLoading(true);
    Setlockedoption(0);
    setPoolIdByPosition(poolIdByPosition);
    setAgovUniswapId(+data);
    setpoolPeriodValue(poolIdByPosition);
    setAgovInputChecked(false);
    const { UniSwapContr }: any = await UNiswapContract(uniswap);
    try {
      let imagedata = await UniSwapContr.methods.tokenURI(+data).call();
      let buff: any = new Buffer(imagedata.split(',')[1], 'base64').toString();
      let base64ToStringNew = JSON.parse(buff);
      Setlpimage(base64ToStringNew.image);
      setShowAgovPoolLoading(false);
    } catch (err) {
      setShowAgovPoolLoading(false);
      return false;
    }
  };

  const handleStackingperiodSelect = async (data: number) => {
    setValueOfRedio(true);
    Setstackingperiod(+data);
  };
  // list of uniswap ids
  const getuniswaplist = async () => {
    if (!walletAddress) {
      return;
    }
    Setshowlistdata(true);
    try {
      const { UniSwapContr }: any = await UNiswapContract(uniswap);
      let uniswaplist = await UniSwapContr.methods
        .balanceOf(walletAddress)
        .call();
      if (uniswaplist) {
        let tokenId = [];
        let obj = {};
        let agovUniswapIds = [];
        let agovObj = {};
        const { UniSwapContr }: any = await UNiswapContract(uniswap);
        for (var i = 0; i < parseInt(uniswaplist); i++) {
          let NftId = await UniSwapContr.methods
            .tokenOfOwnerByIndex(walletAddress, i)
            .call();
          let result = await UniSwapContr.methods.positions(NftId).call();
          const { token0, token1, liquidity } = result;
          if (
            Number(liquidity) > 0 &&
            ((token0.toLowerCase() === wethToken &&
              token1.toLowerCase() === mpwrToken) ||
              (token1.toLowerCase() === wethToken &&
                token0.toLowerCase() === mpwrToken) ||
              (token0.toLowerCase() === wethToken &&
                token1.toLowerCase() === ethAgovToken) ||
              (token1.toLowerCase() === wethToken &&
                token0.toLowerCase() === ethAgovToken))
          ) {
            if (
              token0.toLowerCase() === ethAgovToken ||
              token1.toLowerCase() === ethAgovToken
            ) {
              agovObj = {
                poolId: 2,
                NftId: NftId,
              };
              agovUniswapIds.push(agovObj);
            } else {
              obj = {
                poolId: 0,
                NftId: NftId,
              };
              tokenId.push(obj);
            }
          }
        }
        const result1 = await Promise.all(tokenId);
        Setuniswaplist(result1);
        let agovResult = await Promise.all(agovUniswapIds);
        setUniswapAgovIdList(agovResult);
        Setshowlistdata(false);
      }
    } catch (err) {
      Setshowlistdata(false);
    }
  };

  // stake and withdraw by pool
  const handleLpStakeByPool = async (
    props: string,
    agovUniswapStakeId: number,
    did: number,
  ) => {
    if (!walletAddress) {
      return;
    }
    try {
      const networkId = '1';
      const { lpStakeContr }: any = await LPStakingContract(
        lpStakeContractAddress,
      );
      if (props === 'stakebtn') {
        Setcommoloading(true);
        Setcursor(true);
        const resultRes: any = await dispatch(
          lpstakingSignatureAction(agovUniswapStakeId, poolPeriodValue),
        );
        if (resultRes && resultRes.data) {
          let demoData = {
            poolPeriodValue: poolPeriodValue,
            agovUniswapStakeId: agovUniswapStakeId,
            amount_USD: resultRes?.data?.amount_USD,
            ethRate: resultRes?.data?.ethRate,
            mpwrRate: resultRes?.data?.mpwrRate,
            totalVolume_USD_inWei: resultRes?.data?.totalVolume_USD_inWei,
            lockedoption: lockedoption,
            eth_signature: resultRes?.data?.eth_signature,
            Date: new Date(),
          };
          Sentry.captureMessage(JSON.stringify(resultRes));
          Sentry.captureMessage(JSON.stringify(demoData));
          try {
            const { UniSwapContr }: any = await UNiswapContract(uniswap);
            let result_is_approved = await UniSwapContr.methods
              .isApprovedForAll(walletAddress, lpStakeContractAddress)
              .call();
            if (!result_is_approved) {
              result_is_approved = await UniSwapContr.methods
                .setApprovalForAll(lpStakeContractAddress, true)
                .send({ from: walletAddress });
            }
            if (result_is_approved) {
              try {
                const stakedResponse: any = await lpStakeContr.methods
                  .stake(
                    poolPeriodValue,
                    agovUniswapStakeId,
                    resultRes?.data?.amount_USD,
                    resultRes?.data?.ethRate,
                    resultRes?.data?.mpwrRate,
                    resultRes?.data?.totalVolume_USD_inWei,
                    lockedoption,
                    resultRes?.data?.eth_signature,
                  )
                  .send({ from: walletAddress });
                if (stakedResponse) {
                  const stakedQueryRequest = {
                    transaction_hash: stakedResponse?.transactionHash,
                    contract_address: lpStakeContractAddress,
                    network_id: networkId,
                  };
                  dispatch(eventsAction(stakedQueryRequest));
                  addToast(' Token staked successfully', {
                    appearance: 'success',
                    autoDismiss: true,
                  });
                }
                handleLiquidityInUsd();
                Setcommoloading(false);
                Setcursor(false);
                handleCloseStackingMdal();
                Setlockedoption(3);
                getMpwrWethLpStakeDeposits();
                Setswaplistid(0);
                setAgovUniswapId(0);
                setPoolIdByPosition(1);
                getuniswaplist();
              } catch (err: any) {
                Setcommoloading(false);
                handleCloseStackingMdal();
                Setcursor(false);
                Setlockedoption(3);
                Setswaplistid(0);
                setAgovUniswapId(0);
                setPoolIdByPosition(1);
                Sentry.captureException(err);
                addToast(err.message, {
                  appearance: 'error',
                  autoDismiss: true,
                });
              }
            }
          } catch (err) {
            handleCloseStackingMdal();
            Setlockedoption(3);
            Setswaplistid(0);
            setAgovUniswapId(0);
            setPoolIdByPosition(1);
            Setcursor(false);
            Setcommoloading(false);
            Sentry.captureException(err);
            addToast('There is some issue, Please try again later', {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } else {
          handleCloseStackingMdal();
          Setlockedoption(3);
          Setswaplistid(0);
          setAgovUniswapId(0);
          setPoolIdByPosition(1);
          Setcursor(false);
          Setcommoloading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
          return;
        }
      } else if (props === 'withdrabtn') {
        Setcommoloading(true);
        Setcursor(true);
        try {
          const lpStakingApiRes: any = await dispatch(
            lpstakingWithDrawSignatureAction(
              popupData?.data?.Nft_id,
              +popupData?.data?.poolId,
              did,
            ),
          );
          if (lpStakingApiRes && lpStakingApiRes?.data) {
            await lpStakeContr.methods
              .withdraw(
                +popupData?.data?.poolId,
                did,
                lpStakingApiRes?.data?.ethRate,
                lpStakingApiRes?.data?.mpwrRate,
                lpStakingApiRes?.data?.amount_USD,
                lpStakingApiRes?.data?.totalVolume_USD_inWei,
                lpStakingApiRes?.data?.eth_signature,
              )
              .send({ from: walletAddress });
            addToast('Withdraw successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
            handleLiquidityInUsd();
            getMpwrWethLpStakeDeposits();
            handleClosewithdraw();
            Setcommoloading(false);
            Setcursor(false);
            getuniswaplist();
          } else {
            handleClosewithdraw();
            Setcommoloading(false);
            Setcursor(false);
            addToast(lpStakingApiRes?.message, {
              appearance: 'error',
              autoDismiss: true,
            });
          }
        } catch (err) {
          handleClosewithdraw();
          Setcommoloading(false);
          Setcursor(false);
          Sentry.captureException(err);
        }
      }
    } catch (error: any) {
      Setcommoloading(false);
      Setcursor(false);
      Sentry.captureException(error);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  useEffect(() => {
    getuniswaplist();
  }, []);

  //  fetchlpmpwr balnace --
  const stakehandlechangetoken = (e: any) => {
    if (e.target.value > mpwrtoken) {
      Setstaketoken(e.target.value);
      SettokenstakeError({
        ...tokenstakeError,
        TokenStakeValueError: `Not enough balance to complete this transaction ${mpwrtoken}  available to stake`,
      });
    } else if (e.target.value.length > 18) {
      Setstaketoken(e.target.value);
      SettokenstakeError({
        ...tokenstakeError,
        TokenStakeValueError: 'Do not enter more than 18 character value',
      });
    } else if (
      (e.target.value < 0 || e.target.value == 0) &&
      e.target.value.length >= 1
    ) {
      Setstaketoken(e.target.value);
      SettokenstakeError({
        ...tokenstakeError,
        TokenStakeValueError: `Please enter greater than 0`,
      });
    } else {
      Setstaketoken(e.target.value);
      SettokenstakeError({
        ...tokenstakeError,
        TokenStakeValueError: '',
      });
    }
  };

  // Mpwr staking by pool**
  const ReqTokenStaking = async (props: string, did: any) => {
    if (!walletAddress) {
      return;
    }
    const { web3 }: any = await getWeb3();
    const { StackingContract }: any = await tokenstackingContract(stakingToken);
    const { mpwrContract }: any = await mpwrtokencontract(mpwrToken);
    if (props === 'staketoken') {
      if (tokenstakeError.TokenStakeValueError) {
        return;
      }
      const valueconvert: any = await customToWei(stakentoken, web3, '');
      try {
        let result_allwoence_balance = await mpwrContract.methods
          .allowance(walletAddress, stakingToken)
          .call();
        const allowence_balance = parseInt(result_allwoence_balance);
        const newvalueconvert = parseInt(valueconvert);

        if (allowence_balance <= newvalueconvert) {
          Setcommoloading(true);
          Setcursor(true);
          try {
            let approvetakelResult = await mpwrContract.methods
              .approve(stakingToken, valueconvert)
              .send({ from: walletAddress });

            if (approvetakelResult.status) {
              try {
                await StackingContract.methods
                  .stake(0, valueconvert, stackingperiod)
                  .send({ from: walletAddress });
                Setcommoloading(false);
                Setcursor(false);
                addToast('Token staked successfully', {
                  appearance: 'success',
                  autoDismiss: true,
                });
                getMpwrBalance();
                getStackingTableInfo();
                handleCloseStackingModel();
                Setstackingperiod(0);
              } catch (err) {
                Setcommoloading(false);
                Setcursor(false);
                handleCloseStackingModel();
                Setstackingperiod(0);
              }
            }
          } catch (err) {
            Setcommoloading(false);
            Setcursor(false);
            handleCloseStackingModel();
            Setstackingperiod(0);
          }
        } else {
          Setcommoloading(true);
          Setcursor(true);
          try {
            await StackingContract.methods
              .stake(0, valueconvert, stackingperiod)
              .send({ from: walletAddress });
            Setcommoloading(false);
            Setcursor(false);
            addToast(' Staked successfully', {
              appearance: 'success',
              autoDismiss: true,
            });
            Setcommoloading(false);
            getStackingTableInfo();
            Setcursor(false);
            getMpwrBalance();

            handleCloseStackingModel();
            Setstackingperiod(0);
          } catch (err) {
            Setcommoloading(false);
            Setcursor(false);
            handleCloseStackingModel();
            Setstackingperiod(0);
          }
        }
      } catch (err) {
        Setcommoloading(false);
        Setcursor(false);
        handleCloseStackingModel();
        Setstackingperiod(0);
      }
    } else if (props === 'withdrabtn') {
      Setcommoloading(true);
      Setcursor(true);
      try {
        await StackingContract.methods
          .withdraw(0, did, false)
          .send({ from: walletAddress });

        addToast(' Withdraw successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
        Setcommoloading(false);
        TvlStakingfunction();
        getMpwrBalance();
        handleClosewithdraw();
        Setcursor(false);
        getStackingTableInfo();
      } catch (err) {
        Setcommoloading(false);
        handleClosewithdraw();
        Setcursor(false);
      }
    } else if (props === 'emergency') {
      Setcommoloading(true);
      Setcursor(true);
      try {
        await StackingContract.methods
          .withdraw(0, did, true)
          .send({ from: walletAddress });

        addToast('Withdraw successfully', {
          appearance: 'success',
          autoDismiss: true,
        });
        Setcommoloading(false);
        Setcursor(false);

        getStackingTableInfo();
        getMpwrBalance();
        handleClosewithdraw();
        TvlStakingfunction();
        getMpwrBalance();
      } catch (err) {
        Setcommoloading(false);
        handleClosewithdraw();
        Setcursor(false);
      }
    }
  };

  const commingSoon = () => {
    addToast('Coming soon', { appearance: 'success', autoDismiss: true });
  };

  const handleCloseStackingMdal = () => {
    SetLpstackingmodel(false);
    setAgovLpStakingModal(false);
  };

  // check pool value is correct or not
  const handleOpenStackingMdal = async (props: boolean) => {
    SetLpstackingmodel(true);
  };

  const handleAgovModalOpen = () => {
    setAgovLpStakingModal(true);
  };

  const handleClosewithdraw = () => {
    Setlpwithdrawmodel(false);
    Setlpemergencywithdrawmodel(false);
    setPopupData(null);
  };

  const handleOpenwithdraw = (dataitem: any, contracttype: string) => {
    Setlpwithdrawmodel(true);
    const data = {
      data: dataitem,
      type: contracttype,
    };
    setPopupData(data);
  };

  const handleCloseEmergencymodel = () => {
    Setlpwithdrawmodel(false);
    Setlpemergencywithdrawmodel(false);
    setPopupData(null);
  };

  const handleOpenEmergencymodel = (dataitem: any, contracttype: string) => {
    Setlpemergencywithdrawmodel(true);
    const data = {
      data: dataitem,
      type: contracttype,
    };
    setPopupData(data);
  };

  const handleCloseStackingModel = () => {
    Settokenstackingmodel(false);
    Setstaketoken('');
  };

  const handleOpenStackingModel = (props: boolean) => {
    Settokenstackingmodel(true);
  };

  useEffect(() => {
    getAirdropStashData();
  }, []);

  const getAirdropStashData = async () => {
    /* TODO : AirdropStash Hide (July 30 2022) */
    return false;
  };

  const addToken = async () => {
    const tokenAddress = mpwrToken;
    const tokenSymbol = 'MPWR';
    const tokenDecimals = 18;
    setAddTokenLoading(true);
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
          },
        },
      });
      setAddTokenLoading(false);
    } catch (err: any) {
      setAddTokenLoading(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleClaim = async () => {
    setClaimLoading(true);
    Setcursor(true);
    try {
      const { airdropContr }: any = await airdropContract(
        process.env.REACT_APP_AIRDROP_ADDRESS,
      );
      const walletAdd = localStorage.getItem('Wallet Address');
      const merkleProof = airdropStashData.merkle_proof;
      const amount = airdropStashData.mpwr_to_claim;
      const res: any = await airdropContr.methods
        .claim(amount, merkleProof, false)
        .send({ from: walletAdd });

      if (res) {
        handleShow();
        setClaimLoading(false);
        Setcursor(false);
        setClaimSuccessCheck(true);
        getAirdropStashData();
        addToast('Claim successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        setClaimLoading(false);
        Setcursor(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (err: any) {
      setClaimLoading(false);
      Setcursor(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleStakeRewards = async () => {
    Setcursor(true);
    setStakeRewardLoading(true);
    try {
      const { airdropContr }: any = await airdropContract(
        process.env.REACT_APP_AIRDROP_ADDRESS,
      );
      const walletAdd = localStorage.getItem('Wallet Address');
      const merkleProof = airdropStashData.merkle_proof;
      const amount = airdropStashData.mpwr_to_claim;
      const res: any = await airdropContr.methods
        .claim(amount, merkleProof, true)
        .send({ from: walletAdd });
      if (res) {
        handleShow();
        Setcursor(false);
        setStakeRewardLoading(false);
        getAirdropStashData();
        setClaimSuccessCheck(true);
        addToast('Rewards staked successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        Setcursor(false);
        setStakeRewardLoading(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (err: any) {
      Setcursor(false);
      setStakeRewardLoading(false);
      addToast(err.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  return (
    <>
      <MainLayout mainClassName="stake_reward_page_wrp" hideCursor={cursor}>
        {showPageLoading ? (
          <div className="reward_cardskeleton_inner">
            {[1, 2].map((loading) => (
              <div className="reward_cardskeleton" key={loading}>
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="container-fluid stack_main_wrp row "
            style={{ pointerEvents: cursor ? 'none' : 'auto' }}
          >
            <div className="col-4 stack_left">
              <ClaimRewards
                comingsoon={commingSoon}
                claimLoading={claimLoading}
                cursor={cursor}
                airdropStashData={airdropStashData}
                handleClaim={handleClaim}
                handleStakeRewards={handleStakeRewards}
                stakeRewardLoading={stakeRewardLoading}
                claimSuccessCheck={claimSuccessCheck}
              />
              <AgovLpStakePool
                ReqpoolStaking={handleLpStakeByPool}
                poolstakeloading={commonloading}
                handleSelectAgov={handleSelectAgov}
                cursor={cursor}
                agovLpStakingModal={agovLpStakingModal}
                handleCloseStackingMdal={handleCloseStackingMdal}
                handleAgovModalOpen={handleAgovModalOpen}
                lockedoption={lockedoption}
                AprStake={AprLpStake}
                avlamount={agovNftTvlAmount}
                uniswapAgovIdList={uniswapAgovIdList}
                handleAgovUniswapSelect={handleAgovUniswapSelect}
                agovUniswapId={agovUniswapId}
                showlistdata={showlistdata}
                lpimage={lpimage}
                lpstakeValueOfRedio={isLpstakingValueChange}
                lpstakeupdateStateRedio={() => setIsLpstakingValueChange(false)}
                poolIdByPosition={poolIdByPosition}
                agovInputChecked={agovInputChecked}
                showAgovPoolLoading={showAgovPoolLoading}
              />
            </div>
            <div className="col-8 stack_right">
              <RewardStack
                ReqRewardsListingfun={ReqRewardsListingfun}
                listingloading={listingloading}
                tradingloading={tradingloading}
                listingrewards={listingRewardsbalance}
                tradingRewards={tradingRewardsbalance}
              />
              <div className="row Polltoken_stack_wrp">
                <div className="col-lg-6 polltoken_stack_inn">
                  <PoolStake
                    ReqpoolStaking={handleLpStakeByPool}
                    poolstakeloading={commonloading}
                    handleSelect={handleSelect}
                    cursor={cursor}
                    Lpstackingmodel={Lpstackingmodel}
                    handleCloseStackingMdal={handleCloseStackingMdal}
                    handleOpenStackingMdal={handleOpenStackingMdal}
                    lockedoption={lockedoption}
                    AprStake={AprLpStake}
                    avlamount={tvlLplstake}
                    uniswaplist={uniswaplist}
                    handleSwapSelect={handleSwapSelect}
                    swaplistid={swaplistid}
                    showlistdata={showlistdata}
                    lpimage={lpimage}
                    lpstakeValueOfRedio={isLpstakingValueChange}
                    lpstakeupdateStateRedio={() =>
                      setIsLpstakingValueChange(false)
                    }
                    poolIdByPosition={poolIdByPosition}
                    checkInputCheck={ifInputChecked}
                    showPoolLoading={showPoolLoading}
                  />
                </div>
                <div className="col-lg-6 earn_lp_pool_staking">
                  <StakeTokenComponent
                    ReqTokenStaking={ReqTokenStaking}
                    cursor={cursor}
                    stakehandlechangetoken={stakehandlechangetoken}
                    ErrorMsgforTokenStake={tokenstakeError}
                    tokenstakeInputValue={stakentoken}
                    tokenstakeloading={commonloading}
                    mpwrbalance={mpwrtoken}
                    tokenstackingmodel={tokenstackingmodel}
                    handleCloseStackingModel={handleCloseStackingModel}
                    handleOpenStackingModel={handleOpenStackingModel}
                    tvlstackinglstake={tvlstackinglstake}
                    handleStackingperiodSelect={handleStackingperiodSelect}
                    valueOfRedioBtn={valueOfRedio}
                    updateStateRedio={() => setValueOfRedio(false)}
                    stackingperiod={stackingperiod}
                    AprStacking={AprStacking}
                  />
                </div>
                <AddToToken
                  hideCursor={cursor}
                  setShowMethod={setShow}
                  addTokenLoading={addTokenLoading}
                  show={show}
                  onHide={handleClose}
                  addToken={addToken}
                  airdropStashData={airdropStashData}
                />
              </div>
              <LpStaketable
                lpstakingDepositsData={lpStakingMpwrDepositList}
                lpwithdrawmodel={lpwithdrawmodel}
                handleClosewithdraw={handleClosewithdraw}
                handleOpenwithdraw={handleOpenwithdraw}
                handleCloseEmergencymodel={handleCloseEmergencymodel}
                handleOpenEmergencymodel={handleOpenEmergencymodel}
                lpemergencywithdrawmodel={lpemergencywithdrawmodel}
                popupData={popupData}
                ReqpoolStaking={handleLpStakeByPool}
                poolwithdrawloading={commonloading}
                cursor={cursor}
                spinnerloading={spinnerloading}
                getstackingtabledata={getstackingtabledata}
                ReqTokenStaking={ReqTokenStaking}
                stackingspinner={stackingspinner}
                showDepositLoading={showDepositLoading}
              />
            </div>
          </div>
        )}
      </MainLayout>
      <Footer />
    </>
  );
};

export default memo(Stack);
