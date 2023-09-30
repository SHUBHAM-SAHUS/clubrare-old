import {
  getMpwrPoolContract,
  getMpwrQuoterContract,
  getPoolImmutables,
  getMpwrTokenContract,
} from '../service/web3-service';
const { ethers } = require('ethers');

/** Get mpwr conversion amount from eth */
export const getMpwrConversionRateV2 = async (input_amount:string) => {
    try {
        let poolContract = await getMpwrPoolContract();
        if (poolContract) {
            const tokenAddress0 = await poolContract.methods.token0().call();
            const tokenAddress1 = await poolContract.methods.token1().call();
            let token0Contract: any = await getMpwrTokenContract(tokenAddress0);
            let token1Contract: any = await getMpwrTokenContract(tokenAddress1);
            const tokenDecimals0 = await token0Contract.methods.decimals().call();
            const tokenDecimals1 = await token1Contract.methods.decimals().call();
            let quoterContract :any = await getMpwrQuoterContract();
            const immutables = await getPoolImmutables(poolContract);
            const amountIn = ethers.utils.parseUnits(input_amount.toString(), tokenDecimals0)
            const quotedAmountOut = await quoterContract.methods.quoteExactInputSingle(
                immutables.token1,
                immutables.token0,
                immutables.fee,
                amountIn,
                0
            ).call();
            const amountOut = ethers.utils.formatUnits(quotedAmountOut, tokenDecimals1);
            return amountOut;

        } else return null
    } catch (error) {
        return null
    }
}
