import {
  getAgovPoolContract,
  getAgovQuoterContract,
  getPoolImmutables,
  getTokenContract,
} from '../service/web3-service';
const { ethers } = require('ethers');

/** Get agov conversion amount from eth */
export const getAgovConversionRateV2 = async (eth_amount: string) => {
  try {
    const poolContract: any = await getAgovPoolContract();
    if (poolContract) {
      const tokenAddress0 = await poolContract.methods.token0().call();
      const tokenAddress1 = await poolContract.methods.token1().call();
      const token0Contract: any = await getTokenContract(tokenAddress0);
      const token1Contract: any = await getTokenContract(tokenAddress1);
      const tokenDecimals0 = await token0Contract.methods.decimals().call();
      const tokenDecimals1 = await token1Contract.methods.decimals().call();
      const quoterContract: any = await getAgovQuoterContract();
      const immutables = await getPoolImmutables(poolContract);
      const amountIn: any = ethers.utils.parseUnits(eth_amount, tokenDecimals0);
      const quotedAmountOut = await quoterContract.methods
        .quoteExactInputSingle(
          immutables.token0,
          immutables.token1,
          immutables.fee,
          amountIn,
          0,
        )
        .call();
      const amountOut = ethers.utils.formatUnits(
        quotedAmountOut,
        tokenDecimals1,
      );
      return amountOut;
    } else return null;
  } catch (error) {
    return null;
  }
};
