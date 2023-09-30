import { getWhitelistUserDataApi, postHarvestInfoApi } from '../../api/ilo';
import { FREQUENTLY_ASKED_QUSETION } from '../../types';
import qusAnsJson from '../../../components/frequently-asking/tamp-question.json';

export const FrequentlyAskQus = () => {
  return async (dispatch: any) => {
    try {
      const result = qusAnsJson;
      if (result) {
        dispatch({
          type: FREQUENTLY_ASKED_QUSETION,
          payload: result,
        });
      }
    } catch (err) {
      return err;
    }
  };
};

export const getWhitelistUserDataAction = () => {
  return async () => {
    try {
      const result = await getWhitelistUserDataApi();
      if (result) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export const postHarvestInfoAction = (data: any) => {
  return async () => {
    try {
      const result = await postHarvestInfoApi(data);
      if (result) {
        const { data } = result;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};
