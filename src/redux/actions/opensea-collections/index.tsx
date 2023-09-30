import {
  getOpenseaCollectionApi,
  getAirdropStatshApi,
} from '../../api/opensea-collections';

const getOpenseaCollectionAction = () => {
  return async () => {
    try {
      const result = await getOpenseaCollectionApi();
      if (result) {
        return result;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const getAirdropStatshAction = () => {
  return async () => {
    try {
      const result = await getAirdropStatshApi();
      if (result) {
        return result;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export { getOpenseaCollectionAction, getAirdropStatshAction };
