import { submitTrackingApi } from '../../api';

const submitTrackingAPiAction = (data: any) => {
  return async () => {
    try {
      const result = await submitTrackingApi(data);
      if (result.data) {
        return result.data;
      } else {
        return;
      }
    } catch (error) {
      return error;
    }
  };
};

export { submitTrackingAPiAction };
