import {
  getWeb3,
  LPStakingContract,
  mpwrtokencontract,
  tokenstackingContract,
} from '../../service/web3-service';
import { walletAddress } from '../../utils/get-wallet-address';
import { useCustomStableCoin } from '../../hooks';
const lpStakeContAdd = process.env.REACT_APP_LPSTAKING_CONTRACT_ADDRESS;
const stakingTokenAdd = process.env.REACT_APP_TOKEN_STAKING_CONTRACT_ADDRESS;
const tokenMpwr = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;

export const RewardActive = async () => {
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const rewardCheck = await StackingContract.methods.isPaused().call();
      return rewardCheck;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const RewardLive = async () => {
  const address = walletAddress();
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const rewardLive = await StackingContract.methods
        .PauseStaking()
        .send({ from: address });
      return rewardLive;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const RewardPause = async () => {
  const address = walletAddress();
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const rewardPause = await StackingContract.methods
        .ResumeStaking()
        .send({ from: address });
      return rewardPause;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const CurrentTVL = async (period: any) => {
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const currTVL = await lpStakeContr.methods.periodPoolMap(period).call();
      return currTVL.tvl;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const CurrentAPR = async (poolId: any, period: any) => {
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const currApr = await lpStakeContr.methods.getAPR(poolId, period).call();
      return currApr;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const getPerDayEth = async (poolId: any, period: any) => {
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const poolPeriodEth = await lpStakeContr.methods
        .poolPeriodEth(poolId, period)
        .call();
      return poolPeriodEth;
    } catch (err) {
      return '';
    }
  } catch (err) {
    return '';
  }
};

export const calulateDynamicApr = async (
  poolId: any,
  period: any,
  result: any,
) => {
  const { customToWei } = useCustomStableCoin();
  try {
    const { web3 }: any = await getWeb3();
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const poolPeriodEth = await lpStakeContr.methods
        .poolPeriodEth(poolId, period)
        .call();
      const ethWeiValue: any = await customToWei(
        result?.data.ethRate.toString(),
        web3,
        '',
      );
      const totalLockedValue: any = await customToWei(
        result?.data.lpLockedInPool.toString(),
        web3, ''
      );
      const currApr = await lpStakeContr.methods
        .calculateDyanmicAPR(poolPeriodEth, ethWeiValue, totalLockedValue)
        .call();
      return currApr;
    } catch (err: any) {
      return '';
    }
  } catch (err: any) {
    return '';
  }
};

export const calulateDynamicAprByEthChanges = async (
  value: string,
  result: any,
) => {
  try {
    const { web3 }: any = await getWeb3();
    const { customToWei } = useCustomStableCoin();
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const poolPeriodEth = await customToWei(value?.toString(), web3, '');
      const ethWeiValue: string = await customToWei(
        result?.data.ethRate.toString(), web3,
        '',
      );
      const totalLockedValue: string = await customToWei(
        result?.data.lpLockedInPool.toString(),
        web3, ''
      );
      const currApr = await lpStakeContr.methods
        .calculateDyanmicAPR(poolPeriodEth, ethWeiValue, totalLockedValue)
        .call();
      return currApr;
    } catch (err: any) {
      return '';
    }
  } catch (err: any) {
    return '';
  }
};

export const CurrentMpwrStakingTVL = async (period: any) => {
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const currTVL = await StackingContract.methods
        .periodPoolMap(period)
        .call();
      return currTVL.tvl;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const CurrentMpwrStakingAPR = async (poolId: any, period: any) => {
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const currApr = await StackingContract.methods
        .getAPR(poolId, period)
        .call();
      return currApr;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const SetAPR = async (AprData: any) => {
  const address = walletAddress();
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const setApr = await lpStakeContr.methods
        .updateAPR(AprData.poolId, AprData.periodRates)
        .send({ from: address });
      return setApr;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const setETHOnPeriod = async (AprData: any) => {
  const address = walletAddress();
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const setApr = await lpStakeContr.methods
        .updateETHOnPeriod(AprData.poolId, AprData.periodRates)
        .send({ from: address });
      return setApr;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const SetMpwrStakingAPR = async (AprData: any) => {
  const address = walletAddress();
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const setApr = await StackingContract.methods
        .updateAPR(AprData.poolId, AprData.periodRates)
        .send({ from: address });
      return setApr;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const LpStakingRewardActive = async () => {
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const lpRewardCheck = await lpStakeContr.methods.isPaused().call();
      return lpRewardCheck;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const LpStakingRewardLive = async () => {
  const address = walletAddress();
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const lpRewardLive = await lpStakeContr.methods
        .PauseStaking()
        .send({ from: address });
      return lpRewardLive;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const LpStakingRewardResume = async () => {
  const address = walletAddress();
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const lpRewardLive = await lpStakeContr.methods
        .ResumeStaking()
        .send({ from: address });
      return lpRewardLive;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const AddLiquidityWithAllowanceCheck = async (data: any) => {
  const { customToWei } = useCustomStableCoin();
  const { web3 }: any = await getWeb3();
  const address = walletAddress();
  const amntWei = await customToWei(data.amount, web3, '');
  try {
    const { mpwrContract }: any = await mpwrtokencontract(tokenMpwr);
    try {
      const checkAllowance = await mpwrContract.methods
        .allowance(address, lpStakeContAdd)
        .call();
      if (Number(checkAllowance) < Number(amntWei)) {
        try {
          const approvetakelResult = await mpwrContract.methods
            .approve(lpStakeContAdd, amntWei)
            .send({ from: address });
          if (approvetakelResult) {
            const addLiqResult = await AddLiquidity(data);
            return addLiqResult;
          }
        } catch (err: any) {
          return false;
        }
      } else {
        const addLiqResult = await AddLiquidity(data);
        return addLiqResult;
      }
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const AddLiquidity = async (liqData: any) => {
  const { customToWei } = useCustomStableCoin();
  const address = walletAddress();
  const { web3 }: any = await getWeb3();
  const amntWei = await customToWei(liqData.amount, web3, '');
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const addLiquid = await lpStakeContr.methods
        .addRewardToPool(liqData.poolId, amntWei)
        .send({ from: address });
      return addLiquid;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const AddRewardLiquidityWithAllowanceCheck = async (data: any) => {
  const { customToWei } = useCustomStableCoin();

  const { web3 }: any = await getWeb3();
  const address = walletAddress();
  const amntWei = await customToWei(data.amount, web3, '');
  try {
    const { mpwrContract }: any = await mpwrtokencontract(tokenMpwr);
    try {
      const checkAllowance = await mpwrContract.methods
        .allowance(address, stakingTokenAdd)
        .call();
      if (Number(checkAllowance) < Number(amntWei)) {
        try {
          const approvetakelResult = await mpwrContract.methods
            .approve(stakingTokenAdd, amntWei)
            .send({ from: address });
          if (approvetakelResult) {
            const addLiqResult = await AddRewardLiquidity(data);
            return addLiqResult;
          }
        } catch (err: any) {
          return false;
        }
      } else {
        const addLiqResult = await AddRewardLiquidity(data);
        return addLiqResult;
      }
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const AddRewardLiquidity = async (liqData: any) => {
  const { customToWei } = useCustomStableCoin();
  const address = walletAddress();
  const { web3 }: any = await getWeb3();
  const amntWei = await customToWei(liqData.amount, web3, '');
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const addLiquid = await StackingContract.methods
        .addRewardToPool(liqData.poolId, amntWei)
        .send({ from: address });
      return addLiquid;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const RemoveLiquidity = async (liqData: any) => {
  const { customToWei } = useCustomStableCoin();

  const address = walletAddress();
  const { web3 }: any = await getWeb3();
  const amntWei = await customToWei(liqData.amount, web3, '');
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const removeLiquid = await lpStakeContr.methods
        .withdrawRewardfromPool(liqData.poolId, amntWei)
        .send({ from: address });
      return removeLiquid;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const RemoveRewardLiquidity = async (liqData: any) => {
  const { customToWei } = useCustomStableCoin();

  const address = walletAddress();
  const { web3 }: any = await getWeb3();
  const amntWei = await customToWei(liqData.amount, web3, '');
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const removeLiquid = await StackingContract.methods
        .withdrawRewardfromPool(liqData.poolId, amntWei)
        .send({ from: address });
      return removeLiquid;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const TotalReward = async () => {
  try {
    const { lpStakeContr }: any = await LPStakingContract(lpStakeContAdd);
    try {
      const totalRew = await lpStakeContr.methods.totalReward().call();
      return totalRew;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};

export const TotalMpwrReward = async () => {
  try {
    const { StackingContract }: any = await tokenstackingContract(
      stakingTokenAdd,
    );
    try {
      const totalRew = await StackingContract.methods.totalReward().call();
      return totalRew;
    } catch (err: any) {
      return false;
    }
  } catch (err: any) {
    return false;
  }
};
