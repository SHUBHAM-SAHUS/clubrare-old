const useCustomStableCoin = () => {
  const ethUSDTTokenAddress =
    process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();
  const klaytnUSDTTokenAddress =
    process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase();

  const customFromWei = async (
    amount: string | number,
    web3: any,
    ercAddress: any = '',
  ) => {
  

    let USDTAddress = [ethUSDTTokenAddress, klaytnUSDTTokenAddress];
    if (
      ercAddress &&
      ercAddress != '' &&
      USDTAddress.includes(ercAddress.toLowerCase())
    ) {
      return await web3.utils.fromWei(amount.toString(), 'picoether');
    } else {
      return await web3.utils.fromWei(amount.toString(), 'ether');
    }
  };

  const customToWei = async (
    amount: string | number,
    web3: any,
    ercAddress: any = '',
  ) => {
 

    let USDTAddress = [ethUSDTTokenAddress, klaytnUSDTTokenAddress];
    if (
      ercAddress &&
      ercAddress != '' &&
      USDTAddress.includes(ercAddress.toLowerCase())
    ) {
      return await web3.utils.toWei(amount.toString(), 'picoether');
    } else {
      return await web3.utils.toWei(amount.toString(), 'ether');
    }
  };
  return {
    customFromWei,
    customToWei,
  };
};

export default useCustomStableCoin;
