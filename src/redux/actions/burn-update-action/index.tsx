import { postBurnUpdateApi } from '../../api';

const BurnUpdateAction = (data: any) => {
  return async () => {
    try {
      const result = await postBurnUpdateApi(data);
      if (result.data) {
        const { data } = result.data;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export { BurnUpdateAction };
