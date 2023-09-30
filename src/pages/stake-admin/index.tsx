import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/main-layout/main-layout';
import './stake-admin.scss';
import { useToasts } from 'react-toast-notifications';
import Switch from 'react-switch';
import { useCustomStableCoin } from '../../hooks';
import {
  getWeb3,
  tokenstackingContract,
  LPStakingContract,
  mpwrtokencontract,
} from '../../service/web3-service';
import {
  RewardActive,
  RewardLive,
  CurrentTVL,
  CurrentAPR,
  getPerDayEth,
  calulateDynamicApr,
  calulateDynamicAprByEthChanges,
  SetAPR,
  LpStakingRewardActive,
  LpStakingRewardLive,
  LpStakingRewardResume,
  RewardPause,
  AddLiquidityWithAllowanceCheck,
  RemoveLiquidity,
  TotalReward,
  CurrentMpwrStakingAPR,
  CurrentMpwrStakingTVL,
  SetMpwrStakingAPR,
  AddRewardLiquidityWithAllowanceCheck,
  RemoveRewardLiquidity,
  TotalMpwrReward,
  setETHOnPeriod,
} from '../../service/stake-admin';
import { Accordion } from 'react-bootstrap';
import { Spinner } from '../../components/spinner';
import Footer from '../../components/footer/footer';
import { StakeUserInformation } from '../../components/stake-user-information';
import { useHistory } from 'react-router-dom';
import { getTotalLpLockedAction } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
const lockedPeriod: any = [[3, 6, 9, 12], [0], [0]];

const StakeAdmin = () => {
  const { customFromWei, customToWei } = useCustomStableCoin();
  const staking_token =
    process.env.REACT_APP_TOKEN_STAKING_CONTRACT_ADDRESS?.toLowerCase();
  const tokenMpwr = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
  const wallet_address = localStorage.getItem('Wallet Address')?.toLowerCase();
  const LPstakeContAdd =
    process.env.REACT_APP_LPSTAKING_CONTRACT_ADDRESS?.toLowerCase();
  const profileDetails = useSelector(
    (state: any) => state.profileReducers.profile_details,
  );
  const { addToast } = useToasts();
  const history = useHistory();
  const dispatch = useDispatch();
  const [cursor, setCursor] = useState<boolean>(false);
  const [currentApr, setCurrentApr] = useState<any>([]);
  const [currentMpwrStakingApr, setCurrentMpwrStakingApr] = useState<any>([]);
  const [initialCurrentApr, setinitialCurrentApr] = useState<any>('');
  const [initialCurrMpwrStakingApr, setInitialCurrMpwrStakingApr] =
    useState<any>('');
  const [activeReward, setActiveReward] = useState<boolean>(false);
  const [lpStakingActiveReward, setLpStakingActiveReward] =
    useState<boolean>(false);
  const [aprLoading, setAprLoading] = useState<boolean>(false);
  const [mpwrStakingAprLoading, setMpwrStakingAprLoading] =
    useState<boolean>(false);
  const [liquidityValue, setLiquidityValue] = useState<any>();
  const [liquidityErr, setLiquidityErr] = useState<any>();
  const [liquidityLoading, setLiquidityLoading] = useState<boolean>(false);
  const [addRewardLiqValue, setAddRewardLiqValue] = useState<any>();
  const [addRewardLiqErr, setAddRewardLiqErr] = useState<any>();
  const [addRewardLiqLoading, setAddRewardLiqLoading] =
    useState<boolean>(false);
  const [removeLiquidityValue, setRemoveLiquidityValue] = useState<any>();
  const [removeLiquidityErr, setRemoveLiquidityErr] = useState<any>();
  const [removeLiquidityLoading, setRemoveLiquidityLoading] =
    useState<boolean>(false);
  const [removeRewardLiqValue, setRemoveRewardLiqValue] = useState<any>();
  const [removeRewardLiqErr, setRemoveRewardLiqErr] = useState<any>();
  const [removeRewardLiqLoading, setRemoveRewardLiqLoading] =
    useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [totalAllotedLpReward, setTotalAllotedLpReward] = useState<any>();
  const [totalAllotedMpwrReward, setTotalAllotedMpwrReward] = useState<any>();
  const [reqLiqForNextMonth, setReqLiqForNextMonth] = useState<any>(0);
  const [reqRewardLiqForNextMonth, setReqRewardLiqForNextMonth] =
    useState<any>(0);
  const [stakePoolId, setStakePoolId] = useState<number>(0);
  const [initialCurrentAprPoolSecond, setinitialCurrentAprPoolSecond] =
    useState<any>('');
  const [initialCurrentAprPoolThird, setinitialCurrentAprPoolThird] =
    useState<any>('');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [currentAprValue, setCurrentAprValue] = useState<number>(0);
  const [aprValueLoading, setAprValueLoading] = useState<boolean>(false);

  const getUserBalance = async () => {
    const { web3 }: any = await getWeb3();
    try {
      const { mpwrContract }: any = await mpwrtokencontract(tokenMpwr);
      const mpwrBalance = await mpwrContract.methods
        .balanceOf(wallet_address)
        .call();
      const mpwrBal = await customFromWei(mpwrBalance, web3, tokenMpwr);
      setUserBalance(Number(parseFloat(mpwrBal).toFixed(3)));
    } catch (err) {
      return false;
    }
  };

  const getPoolData = async () => {
    const { web3 }: any = await getWeb3();
    try {
      const { lpStakeContr }: any = await LPStakingContract(LPstakeContAdd);
      try {
        const poolData = await lpStakeContr.methods.pools(0).call();
        const allotedRew: any = await customFromWei(
          poolData.totalAllotedReward,
          web3,
          '',
        );
        if (allotedRew) {
          setTotalAllotedLpReward(Number(parseFloat(allotedRew).toFixed(6)));
        }
      } catch (err) {
        return false;
      }
      const { StackingContract }: any = await tokenstackingContract(
        staking_token,
      );
      try {
        const poolData = await StackingContract.methods.pools(0).call();
        const allotedRew: any = await customFromWei(
          poolData.totalAllotedReward,
          web3,
          '',
        );
        if (allotedRew) {
          setTotalAllotedMpwrReward(Number(parseFloat(allotedRew).toFixed(6)));
        }
      } catch (err) {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const validateInputHandle = (e: any, setValue: any, seErr: any) => {
    const regCheck: any = new RegExp(/^\d*\.?\d*$/);
    if (!regCheck.test(e.target.value)) {
      return false;
    } else if (e.target.value.length > 18) {
      seErr('Do not enter more than 18 character value.');
      return false;
    } else {
      seErr('');
      setValue(e.target.value);
    }
  };

  const addLiquidityHandler = async (e: any) => {
    e.preventDefault();
    if (
      liquidityValue == null ||
      liquidityValue == 0 ||
      liquidityValue == undefined
    ) {
      addToast('Please enter the value of liquidity', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else if (liquidityValue > userBalance) {
      addToast('Value can not be more than available balance', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else {
      try {
        setCursor(true);
        setLiquidityLoading(true);
        const req = {
          poolId: 0,
          amount: liquidityValue,
        };
        const addRew: any = await AddLiquidityWithAllowanceCheck(req);
        if (addRew) {
          setCursor(false);
          setLiquidityLoading(false);
          getUserBalance();
          getPoolData();
          addToast('Liquidity added successfully.', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          setLiquidityLoading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (error: any) {
        setCursor(false);
        setLiquidityLoading(false);
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const addRewardLiquidityHandler = async (e: any) => {
    e.preventDefault();
    if (
      addRewardLiqValue == null ||
      addRewardLiqValue == 0 ||
      addRewardLiqValue == undefined
    ) {
      addToast('Please enter the value of liquidity', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else if (addRewardLiqValue > userBalance) {
      addToast('Value can not be more than available balance', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else {
      try {
        setCursor(true);
        setAddRewardLiqLoading(true);
        const req = {
          poolId: 0,
          amount: addRewardLiqValue,
        };
        const addRew: any = await AddRewardLiquidityWithAllowanceCheck(req);
        if (addRew) {
          setCursor(false);
          setAddRewardLiqLoading(false);
          getUserBalance();
          getPoolData();
          addToast('Reward Liquidity added successfully.', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          setAddRewardLiqLoading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (error: any) {
        setCursor(false);
        setAddRewardLiqLoading(false);
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const removeLiquidityHandler = async (e: any) => {
    e.preventDefault();
    if (
      removeLiquidityValue == null ||
      removeLiquidityValue == 0 ||
      removeLiquidityValue == undefined
    ) {
      addToast('Please enter the value of liquidity', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else if (removeLiquidityValue > totalAllotedLpReward) {
      addToast('Value can not be more than current available liquidity', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else {
      try {
        setCursor(true);
        setRemoveLiquidityLoading(true);
        const req = {
          poolId: 0,
          amount: removeLiquidityValue,
        };
        const addRew: any = await RemoveLiquidity(req);
        if (addRew) {
          setCursor(false);
          setRemoveLiquidityLoading(false);
          getUserBalance();
          getPoolData();
          addToast('Liquidity removed successfully.', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          setRemoveLiquidityLoading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (error: any) {
        setCursor(false);
        setRemoveLiquidityLoading(false);
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const removeRewardLiquidityHandler = async (e: any) => {
    e.preventDefault();
    if (
      removeRewardLiqValue == null ||
      removeRewardLiqValue == 0 ||
      removeRewardLiqValue == undefined
    ) {
      addToast('Please enter the value of liquidity', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else if (removeRewardLiqValue > totalAllotedMpwrReward) {
      addToast('Value can not be more than current available liquidity', {
        appearance: 'error',
        autoDismiss: true,
      });
      return false;
    } else {
      try {
        setCursor(true);
        setRemoveRewardLiqLoading(true);
        const req = {
          poolId: 0,
          amount: removeRewardLiqValue,
        };
        const addRew: any = await RemoveRewardLiquidity(req);
        if (addRew) {
          setCursor(false);
          setRemoveRewardLiqLoading(false);
          getUserBalance();
          getPoolData();
          addToast('Reward Liquidity removed successfully.', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          setRemoveRewardLiqLoading(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (error: any) {
        setCursor(false);
        setRemoveRewardLiqLoading(false);
        addToast(error.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  const liquidtyInPercent = (val1: any, val2: any) => {
    if (isNaN(val1) || isNaN(val2)) return 0;
    if (val2 > 0) {
      const cal = (val1 / val2) * 100;
      return Number(parseFloat(cal.toString()).toFixed(3));
    } else {
      return 0;
    }
  };

  const MpwrStakingActiveHandle = async () => {
    try {
      const rewardActive: any = await RewardActive();
      setActiveReward(rewardActive);
    } catch (err) {
      return false;
    }
  };

  const RewardLiveHandler = async () => {
    setCursor(true);
    if (activeReward) {
      try {
        const data: any = await RewardPause();
        if (data) {
          MpwrStakingActiveHandle();
          setCursor(false);
          addToast('Reward is not live', {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        setCursor(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } else {
      try {
        const data: any = await RewardLive();
        if (data) {
          MpwrStakingActiveHandle();
          setCursor(false);
          addToast('Reward is live', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        setCursor(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  // set data by pool  %%%
  const CurrAPRDataHandler = async () => {
    const sub_array: any = [];
    const super_array: any = [];

    const sub_array_pool_second: any = [];
    const super_array_pool_second: any = [];

    const sub_array_pool_third: any = [];
    const super_array_pool_third: any = [];

    const { web3 }: any = await getWeb3();
    setShowLoading(true);
    for (let index = 0; index < lockedPeriod.length; index++) {
      const element = lockedPeriod[index];
      if (index === 0) {
        for (const i of element) {
          try {
            const currAPR: string | boolean = await CurrentAPR(index, i);
            sub_array.push([i, Number(currAPR) / 1000]);
            super_array.push(sub_array.slice(0));
          } catch (err) {
            setShowLoading(false);
            return false;
          }
        }
      }
      if (index === 1) {
        for (const i of element) {
          try {
            // calculate current APR BY pool 1
            const currentEthValue: string = await getPerDayEth(index, i);
            const ethWeiValue: any = await customFromWei(
              currentEthValue?.toString(),
              web3,
              '',
            );
            sub_array_pool_second.push([i, Number(ethWeiValue)]);
            super_array_pool_second.push(sub_array_pool_second.slice(0));
          } catch (err) {
            setShowLoading(false);
            return false;
          }
        }
      }
      if (index === 2) {
        for (const i of element) {
          try {
            const currentEthValue: string = await getPerDayEth(index, i);
            const ethWeiValue: any = await customFromWei(
              currentEthValue?.toString(),
              web3,
              '',
            );
            sub_array_pool_third.push([i, ethWeiValue]);
            super_array_pool_third.push(sub_array_pool_third.slice(0));
          } catch (err: any) {
            setShowLoading(false);
            return false;
          }
        }
      }
    }
    const lastElement: any = super_array[super_array?.length - 1];

    const lastElementPoolSecond: any =
      super_array_pool_second[super_array_pool_second?.length - 1];

    const lastElementPoolThird: any =
      super_array_pool_third[super_array_pool_third?.length - 1];

    if (stakePoolId === 0) {
      for (let i = 0; i < lastElement.length; i++) {
        try {
          const currTvl: any = await CurrentTVL(lastElement[i][0]);
          const resTvl = await customFromWei(currTvl?.toString(), web3, '');
          lastElement[i].push(Number(parseFloat(resTvl).toFixed(6)));
        } catch (err) {
          setShowLoading(false);
          return false;
        }
      }
      setCurrentApr(lastElement);
    }

    if (stakePoolId === 1) {
      for (let i = 0; i < lastElementPoolSecond.length; i++) {
        try {
          const currTvl: any = await CurrentTVL(lastElementPoolSecond[i][0]);
          const resTvl = await customFromWei(currTvl?.toString(), web3, '');
          lastElementPoolSecond[i].push(Number(parseFloat(resTvl).toFixed(6)));
        } catch (err) {
          setShowLoading(false);
          return false;
        }
      }
      setCurrentApr(lastElementPoolSecond);
    }

    if (stakePoolId === 2) {
      for (let i = 0; i < lastElementPoolThird.length; i++) {
        try {
          const currTvl: any = await CurrentTVL(lastElementPoolThird[i][0]);
          const resTvl = await customFromWei(currTvl?.toString(), web3, '');
          lastElementPoolThird[i].push(Number(parseFloat(resTvl).toFixed(6)));
        } catch (err) {
          setShowLoading(false);
          return false;
        }
      }
      setCurrentApr(lastElementPoolThird);
    }
    setShowLoading(false);
  };

  const CurrMpwrStakingAPRDataHandler = async () => {
    const sub_array: any = [];
    const super_array: any = [];
    const { web3 }: any = await getWeb3();
    for (let index = 0; index < lockedPeriod.length; index++) {
      const element = lockedPeriod[index];
      if (index === 0) {
        for (const i of element) {
          try {
            const currAPR: any = await CurrentMpwrStakingAPR(index, i);
            sub_array.push([i, Number(currAPR) / 1000]);
            super_array.push(sub_array.slice(0));
          } catch (err: any) {
            return false;
          }
        }
      }
    }
    const lastElement: any = super_array[super_array.length - 1];
    for (let i = 0; i < lastElement.length; i++) {
      try {
        const currTvl: any = await CurrentMpwrStakingTVL(lastElement[i][0]);
        const resTvl = await customFromWei(currTvl?.toString(), web3, '');
        lastElement[i].push(Number(parseFloat(resTvl).toFixed(6)));
      } catch (err: any) {
        return false;
      }
    }
    setCurrentMpwrStakingApr(lastElement);
  };

  const currentAprData = async () => {
    const sub_array: any = [];
    const super_array: any = [];
    const sub_array_pool_second: any = [];
    const super_array_pool_second: any = [];
    const sub_array_pool_third: any = [];
    const super_array_pool_third: any = [];
    for (let k = 0; k < lockedPeriod.length; k++) {
      const element = lockedPeriod[k];
      if (k === 0) {
        for (const i of element) {
          try {
            const currAPR: string | boolean = await CurrentAPR(k, i);
            sub_array.push([i, Number(currAPR) / 1000]);
            super_array.push(sub_array.slice(0));
          } catch (err) {
            return false;
          }
        }
      }
      if (k === 1) {
        for (const i of element) {
          try {
            const currentEthValue: string = await getPerDayEth(k, i);
            sub_array_pool_second.push([i, Number(currentEthValue) / 1000]);
            super_array_pool_second.push(sub_array_pool_second.slice(0));
          } catch (err) {
            return false;
          }
        }
      }
      if (k === 2) {
        for (const i of element) {
          try {
            const currentEthValue: string = await getPerDayEth(k, i);
            sub_array_pool_third.push([i, Number(currentEthValue) / 1000]);
            super_array_pool_third.push(sub_array_pool_third.slice(0));
          } catch (err) {
            return false;
          }
        }
      }
    }
    const lastElement: any = super_array[super_array.length - 1];
    setinitialCurrentApr(lastElement);

    const lastElementPoolSecondApr: any =
      super_array_pool_second[super_array_pool_second?.length - 1];
    setinitialCurrentAprPoolSecond(lastElementPoolSecondApr);

    const lastElementPoolThirdApr: any =
      super_array_pool_third[super_array_pool_third?.length - 1];
    setinitialCurrentAprPoolThird(lastElementPoolThirdApr);
  };

  useEffect(() => {
    currentAprData();
  }, []);

  useEffect(() => {
    CurrAPRDataHandler();
    handleCalculateCurrentApr();
  }, [stakePoolId]);

  useEffect(() => {
    const Data = async () => {
      const sub_array: any = [];
      const super_array: any = [];
      for (let j = 0; j < lockedPeriod.length; j++) {
        const element = lockedPeriod[j];
        for (const i of element) {
          try {
            const currAPR: any = await CurrentMpwrStakingAPR(j, i);
            sub_array.push([i, Number(currAPR) / 1000]);
            super_array.push(sub_array.slice(0));
          } catch (err) {
            return false;
          }
        }
      }
      const lastElement: any = super_array[super_array.length - 1];
      setInitialCurrMpwrStakingApr(lastElement);
    };
    Data();
  }, []);

  const handleCalculateCurrentApr = async () => {
    try {
      const result: any = await dispatch(getTotalLpLockedAction(stakePoolId));
      const currentAprVal = await calulateDynamicApr(stakePoolId, 0, result);
      setAprValueLoading(false);
      setCurrentAprValue(+currentAprVal / 1000);
    } catch (error) {
      setAprValueLoading(false);
    }
  };

  const getDynamicAprPerDayEthChanges = async (value: string, result: any) => {
    try {
      const currentAprValNew = await calulateDynamicAprByEthChanges(
        value,
        result,
      );
      setCurrentAprValue(+currentAprValNew / 1000);
      setAprValueLoading(false);
    } catch (error) {
      setAprValueLoading(false);
    }
  };

  const onChangeAprValue = async (
    event: any,
    index: number,
    stakingName: string,
  ) => {
    const { value } = event.target;
    if (stakingName === 'LP Staking Pool') {
      if (stakePoolId === 0) {
        const updatedList = [...currentApr];
        if (value === '') {
          updatedList[index][1] = '';
        } else {
          updatedList[index][1] = +value;
        }
        setCurrentApr(updatedList);
      } else {
        setAprValueLoading(true);
        const updatedList = [...currentApr];
        if (value === '') {
          updatedList[index][1] = '';
        } else {
          updatedList[index][1] = value;
        }
        setCurrentApr(updatedList);
        const result: any = await dispatch(getTotalLpLockedAction(stakePoolId));
        await getDynamicAprPerDayEthChanges(value, result);
      }
    }
    if (stakingName === 'MPWR Staking') {
      const updatedList = [...currentMpwrStakingApr];
      if (value === '') {
        updatedList[index][1] = '';
      } else {
        updatedList[index][1] = +value;
      }
      setCurrentMpwrStakingApr(updatedList);
    }
  };

  const setAprHandler = async (e: any) => {
    e.preventDefault();
    let intialApr: any = '';
    const { web3 }: any = await getWeb3();
    if (stakePoolId === 0) {
      intialApr = initialCurrentApr;
      for (const intial of intialApr) {
        const index = currentApr.findIndex((apr: any) => apr[0] == intial[0]);
        if (index != -1) {
          if (currentApr[index][1] == '') {
            intial[1] = 0;
          } else {
            intial[1] = currentApr[index][1] * 1000;
            intial[2] = 0;
          }
        }
      }
    } else if (stakePoolId === 1) {
      intialApr = initialCurrentAprPoolSecond;
      for (const intial of intialApr) {
        const index = currentApr.findIndex((apr: any) => apr[0] == intial[0]);
        if (index != -1) {
          const ethWeiValue: any = await customToWei(
            currentApr[index][1]?.toString(),
            web3,
            '',
          );
          intial[1] = 0;
          intial[2] = ethWeiValue;
        }
      }
    } else if (stakePoolId === 2) {
      intialApr = initialCurrentAprPoolThird;
      for (const intial of intialApr) {
        const index = currentApr.findIndex((apr: any) => apr[0] == intial[0]);
        if (index != -1) {
          const ethWeiValue: any = await customToWei(
            currentApr[index][1]?.toString(),
            web3,
            '',
          );

          intial[1] = 0;
          intial[2] = ethWeiValue;
        }
      }
    }
    try {
      setCursor(true);
      setAprLoading(true);
      const req = {
        poolId: stakePoolId,
        periodRates: intialApr,
      };
      let addRew = false;
      if (stakePoolId === 0) {
        addRew = await SetAPR(req);
      } else {
        addRew = await setETHOnPeriod(req);
      }
      if (addRew) {
        setCursor(false);
        setAprLoading(false);
        CurrAPRDataHandler();
        addToast('LP Staking Pool APR set successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        setCursor(false);
        setAprLoading(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error: any) {
      setCursor(false);
      setAprLoading(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const setMpwrStakingAprHandler = async (e: any) => {
    e.preventDefault();
    const intialApr = initialCurrMpwrStakingApr;
    for (const intial of intialApr) {
      const index = currentMpwrStakingApr.findIndex(
        (apr: any) => apr[0] == intial[0],
      );
      if (index != -1) {
        if (currentMpwrStakingApr[index][1] == '') {
          intial[1] = 0;
        } else {
          intial[1] = currentMpwrStakingApr[index][1] * 1000;
        }
      }
    }
    try {
      setCursor(true);
      setMpwrStakingAprLoading(true);
      const req = {
        poolId: 0,
        periodRates: intialApr,
      };
      const addRew: any = await SetMpwrStakingAPR(req);
      if (addRew) {
        setCursor(false);
        setMpwrStakingAprLoading(false);
        CurrMpwrStakingAPRDataHandler();
        addToast('MPWR Staking APR set successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
      } else {
        setCursor(false);
        setMpwrStakingAprLoading(false);
        addToast('There is some issue, Please try again later', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } catch (error: any) {
      setCursor(false);
      setMpwrStakingAprLoading(false);
      addToast(error.message, {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const LpStakingRewardActiveHandle = async () => {
    try {
      const lpRewardActive: any = await LpStakingRewardActive();
      setLpStakingActiveReward(lpRewardActive);
    } catch (err) {
      return false;
    }
  };

  const LpStakingRewardLiveHandler = async () => {
    setCursor(true);
    if (lpStakingActiveReward) {
      try {
        const data: any = await LpStakingRewardResume();
        if (data) {
          LpStakingRewardActiveHandle();
          setCursor(false);
          addToast('LP Staking Reward is not live', {
            appearance: 'error',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        setCursor(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    } else {
      try {
        const data: any = await LpStakingRewardLive();
        if (data) {
          LpStakingRewardActiveHandle();
          setCursor(false);
          addToast('LP Staking Reward is live', {
            appearance: 'success',
            autoDismiss: true,
          });
        } else {
          setCursor(false);
          addToast('There is some issue, Please try again later', {
            appearance: 'error',
            autoDismiss: true,
          });
        }
      } catch (err: any) {
        setCursor(false);
        addToast(err.message, {
          appearance: 'error',
          autoDismiss: true,
        });
      }
    }
  };

  useEffect(() => {
    const Data = async () => {
      let sumOfTvlApy: any = 0;
      const { web3 }: any = await getWeb3();
      if (currentApr.length !== 0) {
        for (let i = 0; i < currentApr.length; i++) {
          const APR: any = currentApr[i][1] * 1000;
          if (currentApr[i][2] > 0) {
            const tvlWei: any = await customToWei(
              currentApr[i][2].toString(),
              web3,
              '',
            );
            sumOfTvlApy += Math.floor(
              (Number(tvlWei) * APR * (30 * 24 * 60 * 60)) /
                (365 * 24 * 60 * 60 * 100 * 1000),
            );
          }
        }
        try {
          const totalRew = await TotalReward();
          if (totalRew) {
            const total = Number(totalRew) + sumOfTvlApy;
            const finalRes = await customFromWei(total.toString(), web3, '');
            setReqLiqForNextMonth(Number(parseFloat(finalRes).toFixed(6)));
          }
        } catch (err) {
          return false;
        }
      }
    };
    Data();
  }, [currentApr]);

  useEffect(() => {
    const Data = async () => {
      let sumOfTvlApy: any = 0;
      const { web3 }: any = await getWeb3();
      if (currentMpwrStakingApr.length !== 0) {
        for (let i = 0; i < currentMpwrStakingApr.length; i++) {
          const APR: any = currentMpwrStakingApr[i][1] * 1000;
          if (currentMpwrStakingApr[i][2] > 0) {
            const tvlWei: any = await customToWei(
              currentMpwrStakingApr[i][2].toString(),
              web3,
              '',
            );
            sumOfTvlApy += Math.floor(
              (Number(tvlWei) * APR * (30 * 24 * 60 * 60)) /
                (365 * 24 * 60 * 60 * 100 * 1000),
            );
          }
        }
        try {
          const totalRew = await TotalMpwrReward();
          if (totalRew) {
            const total = Number(totalRew) + sumOfTvlApy;
            const finalRes = await customFromWei(total.toString(), web3, '');
            setReqRewardLiqForNextMonth(
              Number(parseFloat(finalRes).toFixed(6)),
            );
          }
        } catch (err) {
          return false;
        }
      }
    };
    Data();
  }, [currentMpwrStakingApr]);

  useEffect(() => {
    getUserBalance();
    getPoolData();
    MpwrStakingActiveHandle();
    // CurrAPRDataHandler();
    CurrMpwrStakingAPRDataHandler();
    LpStakingRewardActiveHandle();
    // handleCalculateCurrentApr()
  }, []);

  useEffect(() => {
    if (profileDetails && !profileDetails?.isStakeAdmin) {
      history.push('/home');
    }
  }, []);

  const handleSelectPool = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShowLoading(true);
    setStakePoolId(Number(e.target.value));
  };

  return (
    <div style={{ pointerEvents: cursor ? 'none' : 'auto' }}>
      <MainLayout
        mainClassName="reward_admin_page_wrp stake_admin_page_wrp"
        hideCursor={cursor}
      >
        <div className="container-fluid">
          <div className="stake_admin_wrp">
            <div className="reward_admin">
              <Accordion>
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <Accordion.Item
                      eventKey="0"
                      className="reward_admin_card_wrp lp_staking"
                    >
                      <Accordion.Header>
                        <h3>LP Staking Pool</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="reward_admin_sale">
                          <form onSubmit={setAprHandler}>
                            <div className="pool_select_style">
                              <span className="pool_text_style"> Pools: </span>
                              <select
                                className="pool_dropdown_style"
                                name="pageNo"
                                id="pageNo"
                                value={stakePoolId}
                                onChange={(event) => handleSelectPool(event)}
                              >
                                <option value={0}>0</option>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                              </select>
                            </div>
                            <table>
                              <thead>
                                <tr>
                                  <th className="locktime">
                                    Lock Period (Months)
                                  </th>

                                  <th className="aprvalue">
                                    {stakePoolId === 1 || stakePoolId
                                      ? 'Current ETH per day'
                                      : 'Current APR'}
                                  </th>
                                  <th className="tvlwrp">
                                    {stakePoolId === 1 || stakePoolId === 2
                                      ? 'Current APR'
                                      : ''}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {showLoading ? (
                                  <Spinner />
                                ) : currentApr.length !== 0 ? (
                                  currentApr.map((item: any, i: number) => (
                                    <tr
                                      key={i}
                                      // className={`${stakePoolId===0 ?'hide_pool_select' : ''}`}
                                    >
                                      <td
                                        className="locktime"
                                        style={{ fontWeight: 500 }}
                                      >
                                        {item[0] == 0 ? 'No Locking' : item[0]}
                                      </td>
                                      <td className="aprvalue">
                                        <input
                                          type="number"
                                          step="any"
                                          name={`lp${i}`}
                                          id={`lp${i}`}
                                          value={item[1]}
                                          onChange={(e: any) => {
                                            onChangeAprValue(
                                              e,
                                              i,
                                              'LP Staking Pool',
                                            );
                                          }}
                                        />
                                        {/* <span>{item[3]}</span> */}
                                      </td>
                                      <td className="tvlwrp">
                                        {stakePoolId === 1 ||
                                        stakePoolId === 2 ? (
                                          <span>
                                            {' '}
                                            {aprValueLoading ? (
                                              <Spinner />
                                            ) : (
                                              currentAprValue.toFixed(2)
                                            )}
                                          </span>
                                        ) : null}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  ''
                                )}
                              </tbody>
                            </table>
                            <button
                              type="submit"
                              className={`cmnsubbtn ${
                                aprLoading ? 'disablebtn' : ''
                              }`}
                              disabled={aprLoading}
                            >
                              {aprLoading ? 'Loading...' : 'Set APR'}
                            </button>
                          </form>
                          <div className="row start_sale_wrp">
                            <div className="col-7 start_sale_left_wrp text-left">
                              <p>Pause Reward</p>
                            </div>
                            <div className="col-5 start_sale_right_wrp text-right">
                              <label className="switchlabel roundswitchlabel">
                                <Switch
                                  checked={lpStakingActiveReward}
                                  onChange={LpStakingRewardLiveHandler}
                                  onColor="#202020"
                                  onHandleColor="#ECF962"
                                  handleDiameter={22}
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  boxShadow="unset"
                                  activeBoxShadow="unset"
                                  offColor="#EFF0ED"
                                  height={24}
                                  width={44}
                                  className={`react-switch ${
                                    lpStakingActiveReward ? 'activetoggle' : ''
                                  }`}
                                  id="material-switch"
                                />
                              </label>
                              <span className="radio_btn_status">
                                {lpStakingActiveReward ? 'On' : 'Off'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                      eventKey="2"
                      className="reward_admin_card_wrp liquidity_wrp"
                    >
                      <Accordion.Header>
                        <h3>Liquidity</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="reward_admin_sale">
                          <div className="limit_token_wrp">
                            <form onSubmit={addLiquidityHandler}>
                              <div className="row limit_token limit_to_purchase ">
                                <div className="col-lg-8 col-md-8 limit_token_left_wrp">
                                  <input
                                    type="number"
                                    step="any"
                                    name="liquidity"
                                    id="liquidity"
                                    placeholder="0"
                                    value={liquidityValue}
                                    onChange={(e: any) =>
                                      validateInputHandle(
                                        e,
                                        setLiquidityValue,
                                        setLiquidityErr,
                                      )
                                    }
                                  />
                                  {liquidityErr && (
                                    <h6 className="text-danger mt-1 errfnt">
                                      {liquidityErr}
                                    </h6>
                                  )}
                                </div>
                                <div className="col-lg-4 col-md-4 limit_token_right_wrp pl-0 text-right">
                                  <button
                                    type="submit"
                                    className={`${
                                      liquidityLoading ? 'disablebtn' : ''
                                    }`}
                                    disabled={liquidityLoading}
                                  >
                                    {liquidityLoading
                                      ? 'Loading...'
                                      : 'Add Liquidity'}
                                  </button>
                                </div>
                              </div>
                            </form>
                            <form
                              onSubmit={removeLiquidityHandler}
                              className="mt-3"
                            >
                              <div className="row limit_token limit_to_purchase ">
                                <div className="col-lg-8 col-md-8 limit_token_left_wrp">
                                  <input
                                    type="number"
                                    step="any"
                                    name="removeliquidity"
                                    id="removeliquidity"
                                    placeholder="0"
                                    value={removeLiquidityValue}
                                    onChange={(e: any) =>
                                      validateInputHandle(
                                        e,
                                        setRemoveLiquidityValue,
                                        setRemoveLiquidityErr,
                                      )
                                    }
                                  />
                                  {removeLiquidityErr && (
                                    <h6 className="text-danger mt-1 errfnt">
                                      {removeLiquidityErr}
                                    </h6>
                                  )}
                                </div>
                                <div className="col-lg-4 col-md-4 limit_token_right_wrp pl-0 text-right">
                                  <button
                                    type="submit"
                                    className={`${
                                      removeLiquidityLoading ? 'disablebtn' : ''
                                    }`}
                                    disabled={removeLiquidityLoading}
                                  >
                                    {removeLiquidityLoading
                                      ? 'Loading...'
                                      : 'Remove Liquidity'}
                                  </button>
                                </div>
                              </div>
                            </form>
                            <div className="liquidity_detail_wrp">
                              <span>
                                Your MPWR Balance:{' '}
                                <strong>{userBalance ? userBalance : 0}</strong>
                              </span>
                              <span>
                                Current Available Liquidity:{' '}
                                <strong>
                                  {totalAllotedLpReward
                                    ? totalAllotedLpReward
                                    : 0}
                                </strong>
                              </span>
                              <span>
                                Required liquidity for next month:{' '}
                                <strong>{reqLiqForNextMonth}</strong>
                              </span>
                              <span>
                                Current liquidity:{' '}
                                <strong>
                                  {liquidtyInPercent(
                                    totalAllotedLpReward,
                                    reqLiqForNextMonth,
                                  )}
                                  %
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <Accordion.Item
                      eventKey="1"
                      className="reward_admin_card_wrp mpwr_staking"
                    >
                      <Accordion.Header>
                        <h3>$MPWR Staking</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="reward_admin_sale">
                          <form onSubmit={setMpwrStakingAprHandler}>
                            <table>
                              <thead>
                                <tr>
                                  <th className="locktime">
                                    Lock Period (Months)
                                  </th>
                                  <th className="aprvalue">Current APR</th>
                                  <th className="tvlwrp">TVL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {currentMpwrStakingApr.length !== 0 ? (
                                  currentMpwrStakingApr.map(
                                    (item: any, i: number) => (
                                      <tr key={i} className="">
                                        <td
                                          className="locktime"
                                          style={{ fontWeight: 500 }}
                                        >
                                          {item[0] == 0
                                            ? 'No Locking'
                                            : item[0]}
                                        </td>
                                        <td className="aprvalue">
                                          <input
                                            type="number"
                                            step="any"
                                            name={`mpwr${i}`}
                                            id={`mpwr${i}`}
                                            value={item[1]}
                                            onChange={(e: any) => {
                                              onChangeAprValue(
                                                e,
                                                i,
                                                'MPWR Staking',
                                              );
                                            }}
                                          />
                                          <span>{item[3]}</span>
                                        </td>
                                        <td className="tvlwrp">{item[2]}</td>
                                      </tr>
                                    ),
                                  )
                                ) : (
                                  <Spinner />
                                )}
                              </tbody>
                            </table>
                            <button
                              type="submit"
                              className={`cmnsubbtn ${
                                mpwrStakingAprLoading ? 'disablebtn' : ''
                              }`}
                              disabled={mpwrStakingAprLoading}
                            >
                              {mpwrStakingAprLoading ? 'Loading...' : 'Set APR'}
                            </button>
                          </form>
                          <div className="row start_sale_wrp">
                            <div className="col-7 start_sale_left_wrp text-left">
                              <p>Pause Reward</p>
                            </div>
                            <div className="col-5 start_sale_right_wrp text-right">
                              <label className="switchlabel roundswitchlabel">
                                <Switch
                                  checked={activeReward}
                                  onChange={RewardLiveHandler}
                                  onColor="#202020"
                                  onHandleColor="#ECF962"
                                  handleDiameter={22}
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  boxShadow="unset"
                                  activeBoxShadow="unset"
                                  offColor="#EFF0ED"
                                  height={24}
                                  width={44}
                                  className={`react-switch ${
                                    activeReward ? 'activetoggle' : ''
                                  }`}
                                  id="material-switch"
                                />
                              </label>
                              <span className="radio_btn_status">
                                {activeReward ? 'On' : 'Off'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item
                      eventKey="3"
                      className="reward_admin_card_wrp reward_card"
                    >
                      <Accordion.Header>
                        <h3>Rewards</h3>
                      </Accordion.Header>
                      <Accordion.Body>
                        <div className="reward_admin_sale">
                          <div className="limit_token_wrp">
                            <form onSubmit={addRewardLiquidityHandler}>
                              <div className="row limit_token limit_to_purchase ">
                                <div className="col-lg-8 col-md-8 limit_token_left_wrp">
                                  <input
                                    type="number"
                                    step="any"
                                    name="addRewardliquidity"
                                    id="addRewardliquidity"
                                    placeholder="0"
                                    value={addRewardLiqValue}
                                    onChange={(e: any) =>
                                      validateInputHandle(
                                        e,
                                        setAddRewardLiqValue,
                                        setAddRewardLiqErr,
                                      )
                                    }
                                  />
                                  {addRewardLiqErr && (
                                    <h6 className="text-danger mt-1 errfnt">
                                      {addRewardLiqErr}
                                    </h6>
                                  )}
                                </div>
                                <div className="col-lg-4 col-md-4 limit_token_right_wrp pl-0 text-right">
                                  <button
                                    type="submit"
                                    className={`${
                                      addRewardLiqLoading ? 'disablebtn' : ''
                                    }`}
                                    disabled={addRewardLiqLoading}
                                  >
                                    {addRewardLiqLoading
                                      ? 'Loading...'
                                      : 'Add Liquidity'}
                                  </button>
                                </div>
                              </div>
                            </form>
                            <form
                              onSubmit={removeRewardLiquidityHandler}
                              className="mt-3"
                            >
                              <div className="row limit_token limit_to_purchase ">
                                <div className="col-lg-8 col-md-8 limit_token_left_wrp">
                                  <input
                                    type="number"
                                    step="any"
                                    name="removerewardliquidity"
                                    id="removerewardliquidity"
                                    placeholder="0"
                                    value={removeRewardLiqValue}
                                    onChange={(e: any) =>
                                      validateInputHandle(
                                        e,
                                        setRemoveRewardLiqValue,
                                        setRemoveRewardLiqErr,
                                      )
                                    }
                                  />
                                  {removeRewardLiqErr && (
                                    <h6 className="text-danger mt-1 errfnt">
                                      {removeRewardLiqErr}
                                    </h6>
                                  )}
                                </div>
                                <div className="col-lg-4 col-md-4 limit_token_right_wrp pl-0 text-right">
                                  <button
                                    type="submit"
                                    className={`${
                                      removeRewardLiqLoading ? 'disablebtn' : ''
                                    }`}
                                    disabled={removeRewardLiqLoading}
                                  >
                                    {removeRewardLiqLoading
                                      ? 'Loading...'
                                      : 'Remove Liquidity'}
                                  </button>
                                </div>
                              </div>
                            </form>
                            <div className="liquidity_detail_wrp">
                              <span>
                                Your MPWR Balance:{' '}
                                <strong>{userBalance ? userBalance : 0}</strong>
                              </span>
                              <span>
                                Current Available Liquidity:{' '}
                                <strong>
                                  {totalAllotedMpwrReward
                                    ? totalAllotedMpwrReward
                                    : 0}
                                </strong>
                              </span>
                              <span>
                                Required liquidity for next month:{' '}
                                <strong>{reqRewardLiqForNextMonth}</strong>
                              </span>
                              <span>
                                Current liquidity:{' '}
                                <strong>
                                  {liquidtyInPercent(
                                    totalAllotedMpwrReward,
                                    reqRewardLiqForNextMonth,
                                  )}
                                  %
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </div>
                </div>
              </Accordion>
            </div>
            <div className="stake-user-list-wrp">
              <StakeUserInformation />
            </div>
          </div>
        </div>
      </MainLayout>
      <Footer />
    </div>
  );
};

export default StakeAdmin;
