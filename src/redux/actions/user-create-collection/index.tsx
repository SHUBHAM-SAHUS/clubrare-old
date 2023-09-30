import { categoryAllApi } from '../../api/category-collections';
import { ALLCATEGORY_COLLECTIONS_ITEM } from '../../types';

const AllcollectionCategory = () => {
  return async (dispatch: any) => {
    try {
      const result = await categoryAllApi();

      if (result.data) {
        dispatch({
          type: ALLCATEGORY_COLLECTIONS_ITEM,
          payload: result.data.data,
        });
        return result.data.data;
      }
    } catch (err) {
      return err;
    }
  };
};

export { AllcollectionCategory };
