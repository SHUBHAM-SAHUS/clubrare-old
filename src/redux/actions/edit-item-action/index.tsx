import { editItemApi } from '../../api/edit-item-api';

export const editItemAction = (data: any) => {
  return async () => {
    try {
      const result = await editItemApi(data);
      if (result) {
        const { data } = result;
        return data;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
};
