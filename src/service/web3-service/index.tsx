import Web3 from 'web3';
import Caver from 'caver-js';
import WalletConnectProvider from '@walletconnect/web3-provider';
import lazyLeoContract from '../../smart-contract/lazy-leo.json';
import eth_weth_contractabi from '../../smart-contract/eth_weth_contract_abi.json';
import eth_agov_contractabi from '../../smart-contract/eth_agov_contract_abi.json';
import eth_mpwr_contractabi from '../../smart-contract/eth_mpwr_contract_abi.json';
import rewardAdminContractAbi from '../../smart-contract/eth_weth_contract_abi.json';
import create_collection from '../../smart-contract/collection.json';
import tradingrewards from '../../smart-contract/trading-rewards.json';
import listingrewards from '../../smart-contract/listing-rewards.json';
import poll_lpstacking from '../../smart-contract/poll-lp-stacking.json';
import mpwr_token from '../../smart-contract/mpwr_token.json';
import token_stacking from '../../smart-contract/token-stacking.json';
import ILO_Token from '../../smart-contract/clubrare-ilo.json';
import marketrewards from '../../smart-contract/market-rewards.json';
import metaverseItem from '../../smart-contract/metaverse-item.json';
import airdrop from '../../smart-contract/airdrop.json';
import LPStaking from '../../smart-contract/lp-staking.json';
import Uniswapposition from '../../smart-contract/Uniswap-position.json';
import CbrNft from '../../smart-contract/CbrNft.json';
import EthAgovLpStaking from '../../smart-contract/agov-lp-staking/eth-agov-lp-staking.json';
import AGOVStaking from '../../smart-contract/agov-lp-staking/klaytn-agov-lp-staking.json';
import llc_eth_contractabi from '../../smart-contract/llc-eth-contract.json';
import quoter from '../../smart-contract/Quoter.json';
import EthMpwrLpStaking from '../../smart-contract/mpwr-lp-staking/eth-mpwr-lp-staking.json';
import MPWRStakingKlaytn from '../../smart-contract/mpwr-lp-staking/klaytn-mpwr-lp-staking.json';
import EthLlcLpStaking from '../../smart-contract/eth-llc-nft-lp-staking/eth-llc-nft-lp-staking.json';
import eth_usdt_contractabi from '../../smart-contract/eth_usdt_contract_abi.json';
import escrow_klay_contract_abi from '../../smart-contract/escrow_klay_contract_abi.json';
import escrow_eth_contract_abi from '../../smart-contract/escrow_eth_contract_abi.json';

const {
  abi: IUniswapV3PoolABI,
} = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json');
const QuoterABI: any = quoter.abi;
declare const window: any;

const broker_address = process.env.REACT_APP_BROKER_ADDRESS;
const eth_broker_validator = process.env.REACT_APP_ETH_BROKER_VALIDATOR;
const klytn_broker_address = process.env.REACT_APP_KLYTN_BROKER_ACCOUNT;
const klytn_broker_validator = process.env.REACT_APP_KLAYTN_BROKER_VALIDATOR;
const flashboat_rpc_url = process.env.REACT_APP_FLASHBOAT_RPC_URL || '';
const ethwethAbi: any = eth_weth_contractabi;
const ethAgovAbi: any = eth_agov_contractabi;
const ethUsdtAbi: any = eth_usdt_contractabi;
const ethMpwrAbi: any = eth_mpwr_contractabi;
const llcEthAbi: any = llc_eth_contractabi;
const uniswapAbi: any = Uniswapposition.abi;
const rewAdmAbi: any = rewardAdminContractAbi;
const tradingclaimAbi: any = tradingrewards.abi;
const marketrewardsAbi: any = marketrewards.abi;
const listingrewardsAbi: any = listingrewards.abi;
const LpstakeAbi: any = poll_lpstacking;
const CbrNftAbi: any = CbrNft.abi;
const mpwrtokenAbi: any = mpwr_token.abi;
const tokenStackingAbi: any = token_stacking.abi;
const lazyLeoAbi: any = lazyLeoContract.abi;
const iloTokenAbi: any = ILO_Token.abi;
const airdropAbi: any = airdrop.abi;
const LPStakingAbi: any = LPStaking.abi;
const escrowKlayhAbi: any = escrow_klay_contract_abi;
const escrowEthAbi: any = escrow_eth_contract_abi;

const ethAgovStakingAbi: any = EthAgovLpStaking.abi;
const ethMpwrStakingAbi: any = EthMpwrLpStaking.abi;
const klaytnAgovStakingAbi: any = AGOVStaking.abi;
const klaytnMpwrStakingAbi: any = MPWRStakingKlaytn.abi;
const ethLlcLpStakingAbi: any = EthLlcLpStaking.abi;
const w3URL = process.env.WEB3_URL ? process.env.WEB3_URL : '';
const klaytnURL = process.env.REACT_APP_KLYTN_PROVIDER
  ? process.env.REACT_APP_KLYTN_PROVIDER
  : '';
const createCollectionAbi: any = create_collection.abi;
const ethAgovPoolAddress: any = process.env.REACT_APP_ETH_AGOV_POOL_ADDRESS;
const ethUniswapQuoterAddress: any =
  process.env.REACT_APP_ETH_UNISWAP_QUOTER_ADDRESS;
const metaverseItemAbi: any = metaverseItem;

export const EnableEthereum = (notOpen?: boolean) => {
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const brokerContract: any = new web3.eth.Contract(
        require(`../../smart-contract/broker/${broker_address?.toLowerCase()}.json`).abi,
        broker_address,
      );
      const brokerValidatorContract: any = new web3.eth.Contract(
        require(`../../smart-contract/broker/${eth_broker_validator?.toLowerCase()}.json`).abi,
        eth_broker_validator,
      );
      const lazyLeoContract: any = new web3.eth.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_METAMASK_LAZY_LEO,
      );
      try {
        if (!notOpen) {
          await window.ethereum.enable();
        }
        resolve({
          web3,
          brokerContract,
          lazyLeoContract,
          brokerValidatorContract,
        });
      } catch (error) {
        reject(error);
      }
    } else if (window.web3) {
      const web3 = window.web3;

      const brokerContract: any = new web3.eth.Contract(
        require(`../../smart-contract/broker/${broker_address?.toLowerCase()}.json`).abi, //ABI
        broker_address, //Address
      );
      const brokerValidatorContract: any = new web3.eth.Contract(
        require(`../../smart-contract/broker/${eth_broker_validator?.toLowerCase()}.json`).abi, //ABI
        eth_broker_validator, //Address
      );
      const lazyLeoContract: any = new web3.eth.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_METAMASK_LAZY_LEO,
      );
      resolve({
        web3,
        brokerContract,
        lazyLeoContract,
        brokerValidatorContract,
      });
    } else {
      const provider = new Web3.providers.HttpProvider(w3URL);
      const web3 = new Web3(provider);

      const brokerContract: any = new web3.eth.Contract(
        require(`../../smart-contract/broker/${broker_address?.toLowerCase()}.json`).abi, //ABI
        broker_address, //Address
      );
      const brokerValidatorContract: any = new web3.eth.Contract(
        require(`../../smart-contract/broker/${eth_broker_validator?.toLowerCase()}.json`).abi, //ABI
        eth_broker_validator, //Address
      );
      const lazyLeoContract: any = new web3.eth.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_METAMASK_LAZY_LEO,
      );
      resolve({
        web3,
        brokerContract,
        lazyLeoContract,
        brokerValidatorContract,
      });
    }
  });
};

export const EnableKlyten = (notOpen?: boolean) => {
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      const brokerContract: any = new caver.klay.Contract(
        require(`../../smart-contract/broker/${klytn_broker_address?.toLowerCase()}.json`).abi,
        klytn_broker_address,
      );
      const brokerValidatorContract: any = new caver.klay.Contract(
        require(`../../smart-contract/broker/${klytn_broker_validator?.toLowerCase()}.json`).abi,
        klytn_broker_validator,
      );

      const lazyLeoContract: any = new caver.klay.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_KLYTN_LAZY_LEO_MINTABLE_ADD,
      );
      const ClubrareDropsContract: any = new caver.klay.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_KLAYTN_ADMIN_MINTABLE_ADD,
      );
      try {
        if (!notOpen) {
          await window.klaytn.enable();
        }
        resolve({
          caver,
          brokerContract,
          lazyLeoContract,
          ClubrareDropsContract,
          brokerValidatorContract,
        });
      } catch (error) {
        reject(error);
      }
    } else if (window.caver) {
      const caver = new Caver(window.caver);
      const brokerContract: any = new caver.klay.Contract(
        require(`../../smart-contract/broker/${klytn_broker_address?.toLowerCase()}.json`).abi,
        klytn_broker_address,
      );
      const brokerValidatorContract: any = new caver.klay.Contract(
        require(`../../smart-contract/broker/${klytn_broker_validator?.toLowerCase()}.json`).abi,
        klytn_broker_validator,
      );
      const lazyLeoContract: any = new caver.klay.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_KLYTN_LAZY_LEO_MINTABLE_ADD,
      );
      const ClubrareDropsContract: any = new caver.klay.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_KLAYTN_ADMIN_MINTABLE_ADD,
      );
      try {
        if (!notOpen) {
          await window.klaytn.enable();
        }
        resolve({
          caver,
          brokerContract,
          lazyLeoContract,
          ClubrareDropsContract,
          brokerValidatorContract,
        });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);
      const brokerContract: any = new caver.klay.Contract(
        require(`../../smart-contract/broker/${klytn_broker_address?.toLowerCase()}.json`).abi,
        klytn_broker_address,
      );
      const brokerValidatorContract: any = new caver.klay.Contract(
        require(`../../smart-contract/broker/${klytn_broker_validator?.toLowerCase()}.json`).abi,
        klytn_broker_validator,
      );
      const lazyLeoContract: any = new caver.klay.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_KLYTN_LAZY_LEO_MINTABLE_ADD,
      );
      const ClubrareDropsContract: any = new caver.klay.Contract(
        lazyLeoAbi,
        process.env.REACT_APP_KLAYTN_ADMIN_MINTABLE_ADD,
      );

      try {
        if (!notOpen) {
          await window.klaytn.enable();
        }
        resolve({
          caver,
          brokerContract,
          lazyLeoContract,
          ClubrareDropsContract,
          brokerValidatorContract,
        });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const GetCaver = () => {
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      try {
        resolve({ caver });
      } catch (error) {
        reject(error);
      }
    }
    if (window.caver) {
      const caver = new Caver(window.caver);
      try {
        resolve({ caver });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);

      try {
        resolve({ caver });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const getWeb3 = () => {
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        resolve({ web3 });
      } catch (error) {
        reject(error);
      }
    } else if (window.web3) {
      try {
        await window.web3.request({ method: 'eth_requestAccounts' });
        const web3 = window.web3;
        resolve({ web3 });
      } catch (error) {
        reject(error);
      }
    } else {
      try {
        const provider = new Web3.providers.HttpProvider(w3URL);
        const web3 = new Web3(provider);
        resolve({ web3 });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const CheckCurrency = async (token: any) => {
  if (
    token?.toLowerCase() === process.env.REACT_APP_AGOV_TOKEN_ADD?.toLowerCase()
  ) {
    return { name: 'AGOV' };
  } else if (
    token?.toLowerCase() ===
    process.env.REACT_APP_KLAYTN_USDT_TOKEN_ADDRESS?.toLowerCase()
  ) {
    return { name: 'USDT' };
  } else {
    return { name: 'KLAY' };
  }
};
export const CheckCurrencyMetaMask = async (token: any) => {
  if (
    token?.toLowerCase() === process.env.REACT_APP_WETH_TOKEN_ADD?.toLowerCase()
  ) {
    return { name: 'WETH' };
  } else if (
    token?.toLowerCase() ===
    process.env.REACT_APP_TOKEN_MPWR_CONTRACT_ADDRESS?.toLowerCase()
  ) {
    return { name: 'MPWR' };
  } else if (
    token?.toLowerCase() ===
    process.env.REACT_APP_AGOV_ETH_TOKEN_ADD?.toLowerCase()
  ) {
    return { name: 'AGOV' };
  } else if (
    token?.toLowerCase() ===
    process.env.REACT_APP_ETH_USDT_TOKEN_ADDRESS?.toLowerCase()
  ) {
    return { name: 'USDT' };
  } else {
    return { name: 'ETH' };
  }
};

export const DisableEthereum = () => {
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      try {
        delete window.web3;
        resolve(true);
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const EnableWalletConnect = () => {
  return new Promise(async (reject, resolve) => {
    try {
      const provider: any = new WalletConnectProvider({
        infuraId: '27e484dcd9e3efcfd25a83a78777cdf1',
      });
      await provider.enable();
      const web3 = new Web3(provider);
      resolve(web3);
    } catch (error) {
      reject(error);
    }
  });
};

export const makeWethContractforEth = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const wethContract: any = new web3.eth.Contract(ethwethAbi, address);

        try {
          resolve({ wethContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const wethContract: any = new web3.eth.Contract(ethwethAbi, address);

        try {
          resolve({ wethContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const wethContract: any = new web3.eth.Contract(ethwethAbi, address);

        try {
          resolve({ wethContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const makeMpwrContractforEth = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const mpwrContract: any = new web3.eth.Contract(ethMpwrAbi, address);

        try {
          resolve({ mpwrContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const mpwrContract: any = new web3.eth.Contract(ethMpwrAbi, address);

        try {
          resolve({ mpwrContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const mpwrContract: any = new web3.eth.Contract(ethMpwrAbi, address);

        try {
          resolve({ mpwrContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const makeAgovContractforEth = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const agovEthContract: any = new web3.eth.Contract(ethAgovAbi, address);

        try {
          resolve({ agovEthContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const agovEthContract: any = new web3.eth.Contract(ethAgovAbi, address);

        try {
          resolve({ agovEthContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const agovEthContract: any = new web3.eth.Contract(ethAgovAbi, address);

        try {
          resolve({ agovEthContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const makeUsdtContractforEth = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const usdtEthContract: any = new web3.eth.Contract(ethUsdtAbi, address);

        try {
          resolve({ usdtEthContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const usdtEthContract: any = new web3.eth.Contract(ethUsdtAbi, address);

        try {
          resolve({ usdtEthContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const usdtEthContract: any = new web3.eth.Contract(ethUsdtAbi, address);

        try {
          resolve({ usdtEthContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const rewardAdminContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const wethContract: any = new web3.eth.Contract(rewAdmAbi, address);

        try {
          resolve({ wethContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const wethContract: any = new web3.eth.Contract(rewAdmAbi, address);

        try {
          resolve({ wethContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const wethContract: any = new web3.eth.Contract(rewAdmAbi, address);

        try {
          resolve({ wethContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const TradingclaimRewards = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const tradingRewardsContract: any = new web3.eth.Contract(
          tradingclaimAbi,
          address,
        );

        try {
          resolve({ tradingRewardsContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const tradingRewardsContract: any = new web3.eth.Contract(
          tradingclaimAbi,
          address,
        );

        try {
          resolve({ tradingRewardsContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const tradingRewardsContract: any = new web3.eth.Contract(
          tradingclaimAbi,
          address,
        );

        try {
          resolve({ tradingRewardsContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const ListingclaimRewards = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const listingRewardsContract: any = new web3.eth.Contract(
          listingrewardsAbi,
          address,
        );

        try {
          resolve({ listingRewardsContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const listingRewardsContract: any = new web3.eth.Contract(
          listingrewardsAbi,
          address,
        );

        try {
          resolve({ listingRewardsContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const listingRewardsContract: any = new web3.eth.Contract(
          listingrewardsAbi,
          address,
        );

        try {
          resolve({ listingRewardsContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const MarketclaimRewards = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const marketRewardsContract: any = new web3.eth.Contract(
          marketrewardsAbi,
          address,
        );

        try {
          resolve({ marketRewardsContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const marketRewardsContract: any = new web3.eth.Contract(
          marketrewardsAbi,
          address,
        );

        try {
          resolve({ marketRewardsContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const marketRewardsContract: any = new web3.eth.Contract(
          marketrewardsAbi,
          address,
        );

        try {
          resolve({ marketRewardsContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const poolLpstakingcontract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const LpstackingContract: any = new web3.eth.Contract(
          LpstakeAbi,
          address,
        );

        try {
          resolve({ LpstackingContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const LpstackingContract: any = new web3.eth.Contract(
          LpstakeAbi,
          address,
        );

        try {
          resolve({ LpstackingContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const LpstackingContract: any = new web3.eth.Contract(
          LpstakeAbi,
          address,
        );

        try {
          resolve({ LpstackingContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const mpwrtokencontract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const mpwrContract: any = new web3.eth.Contract(mpwrtokenAbi, address);

        try {
          resolve({ mpwrContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const mpwrContract: any = new web3.eth.Contract(mpwrtokenAbi, address);

        try {
          resolve({ mpwrContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const mpwrContract: any = new web3.eth.Contract(mpwrtokenAbi, address);

        try {
          resolve({ mpwrContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const tokenstackingContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const StackingContract: any = new web3.eth.Contract(
          tokenStackingAbi,
          address,
        );

        try {
          resolve({ StackingContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const StackingContract: any = new web3.eth.Contract(
          tokenStackingAbi,
          address,
        );

        try {
          resolve({ StackingContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const StackingContract: any = new web3.eth.Contract(
          tokenStackingAbi,
          address,
        );

        try {
          resolve({ StackingContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const iloTokenContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const iloContract: any = new web3.eth.Contract(iloTokenAbi, address);

        try {
          resolve({ iloContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const iloContract: any = new web3.eth.Contract(iloTokenAbi, address);

        try {
          resolve({ iloContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const iloContract: any = new web3.eth.Contract(iloTokenAbi, address);

        try {
          resolve({ iloContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const createCollectionContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const collectionsContract: any = new web3.eth.Contract(
          createCollectionAbi,
          address,
        );

        try {
          resolve({ collectionsContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const collectionsContract: any = new web3.eth.Contract(
          createCollectionAbi,
          address,
        );

        try {
          resolve({ collectionsContract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const collectionsContract: any = new web3.eth.Contract(
          createCollectionAbi,
          address,
        );

        try {
          resolve({ collectionsContract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const airdropContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const airdropContr: any = new web3.eth.Contract(airdropAbi, address);

        try {
          resolve({ airdropContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const airdropContr: any = new web3.eth.Contract(airdropAbi, address);

        try {
          resolve({ airdropContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const airdropContr: any = new web3.eth.Contract(airdropAbi, address);

        try {
          resolve({ airdropContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const LPStakingContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const lpStakeContr: any = new web3.eth.Contract(LPStakingAbi, address);

        try {
          resolve({ lpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const lpStakeContr: any = new web3.eth.Contract(LPStakingAbi, address);

        try {
          resolve({ lpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const lpStakeContr: any = new web3.eth.Contract(LPStakingAbi, address);

        try {
          resolve({ lpStakeContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const UNiswapContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const UniSwapContr: any = new web3.eth.Contract(uniswapAbi, address);

        try {
          resolve({ UniSwapContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const UniSwapContr: any = new web3.eth.Contract(uniswapAbi, address);

        try {
          resolve({ UniSwapContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const UniSwapContr: any = new web3.eth.Contract(uniswapAbi, address);

        try {
          resolve({ UniSwapContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const CbrNftforEthContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const CbrforEthContr: any = new web3.eth.Contract(CbrNftAbi, address);
        try {
          resolve({ CbrforEthContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const CbrforEthContr: any = new web3.eth.Contract(CbrNftAbi, address);

        try {
          resolve({ CbrforEthContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const CbrforEthContr: any = new web3.eth.Contract(CbrNftAbi, address);

        try {
          resolve({ CbrforEthContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const CbrNftforKlyContract = (address: any, open: any) => {
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      const CbrforKlyContr: any = new caver.klay.Contract(CbrNftAbi, address);
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ CbrforKlyContr });
      } catch (error) {
        reject(error);
      }
    }
    if (window.caver) {
      const caver = new Caver(window.caver);
      const CbrforKlyContr: any = new caver.klay.Contract(CbrNftAbi, address);
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ CbrforKlyContr });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);
      const CbrforKlyContr: any = new caver.klay.Contract(CbrNftAbi, address);

      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ CbrforKlyContr });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const makeBrokerContractForEth = (address: any, open: any) => {
  const brokerAbi =
    require(`../../smart-contract/broker/${address?.toLowerCase()}.json`).abi;

  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);

        const brokerContract: any = new web3.eth.Contract(brokerAbi, address);

        try {
          if (!open) {
            await window.ethereum.enable();
          }
          resolve({ brokerContract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const brokerContract: any = new web3.eth.Contract(
          brokerAbi, //ABI
          address,
        );
        resolve({ brokerContract });
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const brokerContract: any = new web3.eth.Contract(
          brokerAbi, //ABI
          address,
        );
        resolve({ brokerContract });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const llcBrokerContractWithEth = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const LLCcontract: any = new web3.eth.Contract(llcEthAbi, address);

        try {
          resolve({ LLCcontract });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const LLCcontract: any = new web3.eth.Contract(llcEthAbi, address);

        try {
          resolve({ LLCcontract });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const LLCcontract: any = new web3.eth.Contract(llcEthAbi, address);

        try {
          resolve({ LLCcontract });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const makeBrokerContractForKlytn = (address: any, open: any) => {
  const brokerAbi =
    require(`../../smart-contract/broker/${address?.toLowerCase()}.json`).abi;
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      const brokerContract: any = new caver.klay.Contract(brokerAbi, address);
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ brokerContract });
      } catch (error) {
        reject(error);
      }
    }
    if (window.caver) {
      const caver = new Caver(window.caver);
      const brokerContract: any = new caver.klay.Contract(brokerAbi, address);
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ brokerContract });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);
      const brokerContract: any = new caver.klay.Contract(brokerAbi, address);

      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ brokerContract });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const EthAgovLpStakingContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (flashboat_rpc_url) {
        const provider = new Web3.providers.HttpProvider(flashboat_rpc_url);
        const web3 = new Web3(provider);
        const EthAgovLpStakeContr: any = new web3.eth.Contract(
          ethAgovStakingAbi,
          address,
        );
        try {
          resolve({ EthAgovLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const EthAgovLpStakeContr: any = new web3.eth.Contract(
          ethAgovStakingAbi,
          address,
        );
        try {
          resolve({ EthAgovLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3);
        const EthAgovLpStakeContr: any = new web3.eth.Contract(
          ethAgovStakingAbi,
          address,
        );
        try {
          resolve({ EthAgovLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        const web3 = new Web3(provider);
        const EthAgovLpStakeContr: any = new web3.eth.Contract(
          ethAgovStakingAbi,
          address,
        );
        try {
          resolve({ EthAgovLpStakeContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const KlaytnAgovLpStakingContract = (address: any, open: any) => {
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      const KlaytnAgovLpStakeContr: any = new caver.klay.Contract(
        klaytnAgovStakingAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnAgovLpStakeContr });
      } catch (error) {
        reject(error);
      }
    }
    if (window.caver) {
      const caver = new Caver(window.caver);
      const KlaytnAgovLpStakeContr: any = new caver.klay.Contract(
        klaytnAgovStakingAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnAgovLpStakeContr });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);
      const KlaytnAgovLpStakeContr: any = new caver.klay.Contract(
        klaytnAgovStakingAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnAgovLpStakeContr });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const getAgovPoolContract = async () => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const poolContract = new web3.eth.Contract(
        IUniswapV3PoolABI,
        ethAgovPoolAddress,
      );
      return poolContract;
    }
  } catch (error) {
    return null;
  }
};

export const getTokenContract = async (tokenAddress: any) => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const tokenContract = new web3.eth.Contract(ethwethAbi, tokenAddress);
      return tokenContract;
    }
  } catch (error) {
    return null;
  }
};

/** Get quoter contract for agov conversion */
export const getAgovQuoterContract = async () => {
  const quoterAddress = ethUniswapQuoterAddress;
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const quoterContract = new web3.eth.Contract(QuoterABI, quoterAddress);
      return quoterContract;
    }
  } catch (error) {
    return null;
  }
};

export const getPoolImmutables = async (poolContract: any) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.methods.token0().call(),
    poolContract.methods.token1().call(),
    poolContract.methods.fee().call(),
  ]);
  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee,
  };
  return immutables;
};

export const EthMpwrLpStakingContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (flashboat_rpc_url) {
        const provider = new Web3.providers.HttpProvider(flashboat_rpc_url);
        const web3 = new Web3(provider);
        const EthMpwrLpStakeContr: any = new web3.eth.Contract(
          ethMpwrStakingAbi,
          address,
        );
        try {
          resolve({ EthMpwrLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const EthMpwrLpStakeContr: any = new web3.eth.Contract(
          ethMpwrStakingAbi,
          address,
        );
        try {
          resolve({ EthMpwrLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3);
        const EthMpwrLpStakeContr: any = new web3.eth.Contract(
          ethMpwrStakingAbi,
          address,
        );
        try {
          resolve({ EthMpwrLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        const web3 = new Web3(provider);
        const EthMpwrLpStakeContr: any = new web3.eth.Contract(
          ethMpwrStakingAbi,
          address,
        );
        try {
          resolve({ EthMpwrLpStakeContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const KlaytnMpwrLpStakingContract = (address: any, open: any) => {
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      const KlaytnMpwrLpStakeContr: any = new caver.klay.Contract(
        klaytnMpwrStakingAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnMpwrLpStakeContr });
      } catch (error) {
        reject(error);
      }
    }
    if (window.caver) {
      const caver = new Caver(window.caver);
      const KlaytnMpwrLpStakeContr: any = new caver.klay.Contract(
        klaytnMpwrStakingAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnMpwrLpStakeContr });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);
      const KlaytnMpwrLpStakeContr: any = new caver.klay.Contract(
        klaytnMpwrStakingAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnMpwrLpStakeContr });
      } catch (error) {
        reject(error);
      }
    }
  });
};

export const getMpwrPoolContract = async () => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const poolContract = new web3.eth.Contract(
        IUniswapV3PoolABI,
        process.env.REACT_APP_ETH_MPWR_POOL_ADDRESS,
      );
      return poolContract;
    }
  } catch (error) {
    return null;
  }
};

/**Get Token Contract  */
export const getMpwrTokenContract = async (tokenAddress: string) => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const tokenContract = new web3.eth.Contract(ethwethAbi, tokenAddress);
      return tokenContract;
    }
  } catch (error) {
    return null;
  }
};

/** Get quoter contract for agov conversion */
export const getMpwrQuoterContract = async () => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const quoterContract = new web3.eth.Contract(
        QuoterABI,
        process.env.REACT_APP_ETH_UNISWAP_QUOTER_MPWR_ADDRESS,
      );
      return quoterContract;
    }
  } catch (error) {
    return null;
  }
};

export const EthLlcLpStakingContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (flashboat_rpc_url) {
        const provider = new Web3.providers.HttpProvider(flashboat_rpc_url);
        const web3 = new Web3(provider);
        const EthLlcLpStakeContr: any = new web3.eth.Contract(
          ethLlcLpStakingAbi,
          address,
        );
        try {
          resolve({ EthLlcLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        const EthLlcLpStakeContr: any = new web3.eth.Contract(
          ethLlcLpStakingAbi,
          address,
        );
        try {
          resolve({ EthLlcLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        const web3 = new Web3(window.web3);
        const EthLlcLpStakeContr: any = new web3.eth.Contract(
          ethLlcLpStakingAbi,
          address,
        );
        try {
          resolve({ EthLlcLpStakeContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        const web3 = new Web3(provider);
        const EthLlcLpStakeContr: any = new web3.eth.Contract(
          ethLlcLpStakingAbi,
          address,
        );
        try {
          resolve({ EthLlcLpStakeContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const metaverseItemEthContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const metaverseItemEthContr: any = new web3.eth.Contract(
          metaverseItemAbi,
          address,
        );

        try {
          resolve({ metaverseItemEthContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const metaverseItemEthContr: any = new web3.eth.Contract(
          metaverseItemAbi,
          address,
        );

        try {
          resolve({ metaverseItemEthContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const metaverseItemEthContr: any = new web3.eth.Contract(
          metaverseItemAbi,
          address,
        );

        try {
          resolve({ metaverseItemEthContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};



export const escrowEthContract = (address: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (window.ethereum) {
        var web3 = new Web3(window.ethereum);
        const escrowEthContr: any = new web3.eth.Contract(
          escrowEthAbi,
          address,
        );

        try {
          resolve({ escrowEthContr });
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        var web3 = new Web3(window.web3);
        const escrowEthContr: any = new web3.eth.Contract(
          escrowEthAbi,
          address,
        );

        try {
          resolve({ escrowEthContr });
        } catch (error) {
          reject(error);
        }
      } else {
        const provider = new Web3.providers.HttpProvider(w3URL);
        var web3 = new Web3(provider);
        const escrowEthContr: any = new web3.eth.Contract(
          escrowEthAbi,
          address,
        );

        try {
          resolve({ escrowEthContr });
        } catch (error) {
          reject(error);
        }
      }
    } catch (err) {
      reject(err);
    }
  });
};



export const escrowKlayContract = (address: any, open: any) => {
  return new Promise(async (resolve, reject) => {
    if (window.klaytn) {
      const caver = new Caver(window.klaytn);
      const KlaytnEscrowContr: any = new caver.klay.Contract(
        escrowKlayhAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnEscrowContr });
      } catch (error) {
        reject(error);
      }
    }
    if (window.caver) {
      const caver = new Caver(window.caver);
      const KlaytnEscrowContr: any = new caver.klay.Contract(
        escrowKlayhAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnEscrowContr });
      } catch (error) {
        reject(error);
      }
    } else {
      const provider = new Caver.providers.HttpProvider(klaytnURL);
      const caver = new Caver(provider);
      const KlaytnEscrowContr: any = new caver.klay.Contract(
        escrowKlayhAbi,
        address,
      );
      try {
        if (!open) {
          await window.klaytn.enable();
        }
        resolve({ KlaytnEscrowContr });
      } catch (error) {
        reject(error);
      }
    }
  });
};