import { iloTokenContract } from '../../service/web3-service';
import { walletAddress } from '../../utils/get-wallet-address';
const rewardContAdd = process.env.REACT_APP_ILO_CONTRACT_ADDRESS?.toLowerCase();

export const PreSaleActive = async () => {
  try {
    const { iloContract }: any = await iloTokenContract(rewardContAdd);
    const presale = await iloContract.methods.saleActive().call();
    return presale;
  } catch (error) {
    return false;
  }
};

export const PreSaleLive = async () => {
  try {
    const address = walletAddress();
    const { iloContract }: any = await iloTokenContract(rewardContAdd);
    const livePreSale = await iloContract.methods
      .toggleSale()
      .send({ from: address });
    return livePreSale;
  } catch (error) {
    return false;
  }
};

export const SetMerkleRoot = async (rootHash: any) => {
  try {
    const address = walletAddress();
    const { iloContract }: any = await iloTokenContract(rewardContAdd);
    const merkleRoot = await iloContract.methods
      .setMerkleRoot(rootHash)
      .send({ from: address });
    return merkleRoot;
  } catch (error) {
    return false;
  }
};

export const GetPresalePrice = async () => {
  try {
    const { iloContract }: any = await iloTokenContract(rewardContAdd);
    const getPresalePrice = await iloContract.methods.tokenPrice().call();
    return getPresalePrice;
  } catch (error) {
    return false;
  }
};

export const SetPresalePrice = async (presalePrice: any) => {
  try {
    const address = walletAddress();
    const { iloContract }: any = await iloTokenContract(rewardContAdd);
    const setPresalePrice = await iloContract.methods
      .updateTokenPrice(presalePrice)
      .send({ from: address });
    return setPresalePrice;
  } catch (error) {
    return false;
  }
};
