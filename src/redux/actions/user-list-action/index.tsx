import { AuthenticationListsRequest } from '../../../types/authentication-lists-type';
import {
  getUserListApi,
  changeRoleApi,
  authenticationPurchaseListApi,
} from '../../api';

const getUserListAction = (data: string) => {
  return async () => {
    try {
      const result = await getUserListApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};
const changeRoleAction = (data: any) => {
  return async () => {
    try {
      const result = await changeRoleApi(data);
      if (result) {
        return result;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};
const authenticationPurchaseListsAction = (
  data: AuthenticationListsRequest,
) => {
  return async () => {
    try {
      const result = await authenticationPurchaseListApi(data);
      if (result) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};
export {
  getUserListAction,
  changeRoleAction,
  authenticationPurchaseListsAction,
};
