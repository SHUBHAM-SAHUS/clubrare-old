import axios from 'axios';
const APP_URL = process.env.REACT_APP_API_BASE_URL;

export const liquidityUsdApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/lp-staking/total-amount-staked`,
  });
  return xhr;
};

export const lpstakingSignatureApi = (
  nftId: number,
  poolPeriodValue: number,
) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/lp-staking/generate-signature`,
    data: { nft_id: nftId.toString(), pool_id: poolPeriodValue.toString() },
  });
  return xhr;
};

export const lpstakingWithDrawSignatureApi = (
  nftId: number,
  poolPeriodValue: number,
  did: number,
) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.1/lp-staking/generate-withdraw-signature`,
    data: {
      nft_id: nftId.toString(),
      pool_id: poolPeriodValue.toString(),
      deposit_id: did.toString(),
    },
  });
  return xhr;
};

export const getAllDepositsApi = () => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.1/lp-staking/get-all-deposits`,
  });
  return xhr;
};
