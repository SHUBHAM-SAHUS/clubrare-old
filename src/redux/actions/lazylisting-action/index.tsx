import { lazylistingputonsaleApi, lazylistigMakeOfferApi } from '../../api';

const LazylistingPutOnSaleAPiAction = (data: any) => {
  return async () => {
    try {
      const result = await lazylistingputonsaleApi(data);

      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return false;
    }
  };
};

const LazylistingMakeOfferAPiAction = (data: any) => {
  return async () => {
    try {
      const result = await lazylistigMakeOfferApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return false;
    }
  };
};

export { LazylistingPutOnSaleAPiAction, LazylistingMakeOfferAPiAction };
