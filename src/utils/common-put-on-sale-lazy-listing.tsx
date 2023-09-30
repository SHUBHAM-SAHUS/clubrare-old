import { getWeb3 } from '../service/web3-service';
import { useCommonWalletConnection, useCustomStableCoin } from '../hooks';

const weth_token_address = process.env.REACT_APP_WETH_TOKEN_ADD;
const mpwr_token_address = process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS;
const agov_eth_token_address = process.env.REACT_APP_AGOV_ETH_TOKEN_ADD;
const usdt_eth_token_address = process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase();

const commonPutOnSaleLazyListingHandler = async (
  noncedata: any,
  collectibleDetails: any,
  startDateHandle: any,
  expiryDateHandle: any,
  selectedCurrency: string,
  price: string,
  priceType: any,
) => {
  const { customToWei } = useCustomStableCoin();

  const startTime = Number(
    Math.round(new Date(startDateHandle).getTime() / 1000),
  );
  const endTime =
    priceType === 'fixedPrice'
      ? 0
      : Number(Math.round(new Date(expiryDateHandle).getTime() / 1000));
  const auctionTypeval = priceType === 'fixedPrice' ? '1' : '2';
  const ordertype = collectibleDetails?.redeemable ? 1 : 0;
  const paymenttype =
    selectedCurrency === 'WETH'
      ? weth_token_address
      : selectedCurrency === 'MPWR'
      ? mpwr_token_address
      : selectedCurrency === 'AGOV'
      ? agov_eth_token_address
      : selectedCurrency === 'USDT'
      ? usdt_eth_token_address
      : '0x0000000000000000000000000000000000000000';
  const { web3 }: any = await getWeb3();
  const amount1 = await customToWei(price.toString(), web3, paymenttype);
  const msgParams = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      Order: [
        { name: 'seller', type: 'address' },
        { name: 'contractAddress', type: 'address' },
        { name: 'royaltyFee', type: 'uint256' },
        { name: 'royaltyReceiver', type: 'address' },
        { name: 'paymentToken', type: 'address' },
        { name: 'basePrice', type: 'uint256' },
        { name: 'listingTime', type: 'uint256' },
        { name: 'expirationTime', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'tokenId', type: 'uint256' },
        { name: 'orderType', type: 'uint8' },
        { name: 'uri', type: 'string' },
        { name: 'objId', type: 'string' },
        { name: 'isTokenGated', type: 'bool' },
        { name: 'tokenGateAddress', type: 'address' },
      ],
    },
    //make sure to replace verifyingContract with address of deployed contract
    primaryType: 'Order',
    domain: {
      name: 'Clubrare Marketplace',
      version: '1.0.1',
      chainId: process.env.REACT_APP_NFT_NETWORK_ID,
      verifyingContract: process.env.REACT_APP_ETH_BROKER_VALIDATOR,
    },
    message: {
      seller: collectibleDetails?.collectible_owner.toString(),
      contractAddress: collectibleDetails?.collection_address.toString(),
      royaltyFee: collectibleDetails?.royalties
        ? collectibleDetails?.royalties * 100
        : 0,
      royaltyReceiver: collectibleDetails?.userObj?.wallet_address.toString(),
      paymentToken: paymenttype,
      basePrice: amount1.toString(),
      listingTime: startTime,
      expirationTime: endTime,
      nonce: noncedata,
      tokenId: collectibleDetails?.token_id ? collectibleDetails?.token_id : 0,
      orderType: ordertype,
      uri: collectibleDetails?.file,
      objId: collectibleDetails?._id,
      isTokenGated: false,
      tokenGateAddress: '0x0000000000000000000000000000000000000000',
    },
  });
  const fromAddress = (await web3.eth.getAccounts())[0];
  const params = [fromAddress, msgParams];
  const method = 'eth_signTypedData_v4';
  return new Promise(async (resolve, reject) => {
    await web3.currentProvider.sendAsync(
      {
        method,
        params,
        fromAddress,
      },

      (err: any, result: any) => {
        if (err) {
          reject(err);
        }
        const val: string = result.result;
        const apiquery = {
          _id: collectibleDetails?._id,
          auctionType: auctionTypeval,
          amount: amount1,
          erc20_address: paymenttype,
          nonce: noncedata,
          signature: val,
          startingTime: startTime,
          closingTime: endTime,
          isTokenGated: false,
          tokenGateAddress: '0x0000000000000000000000000000000000000000',
        };
        if (val) {
          resolve(apiquery);
        } else {
          reject(err);
        }
      },
    );
  });
};

export { commonPutOnSaleLazyListingHandler };
