import { getAdminWareHouseListApi } from '../../api/admin-ware-house-api';

export const getAdminWareHouseListAction = (data: any) => {
  return async () => {
    try {
      const result = await getAdminWareHouseListApi(data);
      if (result.data) {
        return result.data.data;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };
};
