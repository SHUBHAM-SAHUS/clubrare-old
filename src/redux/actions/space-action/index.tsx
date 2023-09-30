
import { spaceListsRequest, spaceHomePageRequest } from '../../../types/space-types';
import {  
  addHomeSpaceApi,
  deleteSpaceApi,
  getSpaceListApi, removeHomeSpaceApi
} from '../../api';

const getSpaceListAction = (data: spaceListsRequest) => {
  return async () => {
    try {
      const result = await getSpaceListApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};

const addHomeSpaceAction = (data: spaceHomePageRequest) => {
  return async () => {
    try {
      const result = await addHomeSpaceApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};

const deleteSpaceAction = (data: spaceHomePageRequest) => {
  return async () => {
    try {
      const result = await deleteSpaceApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};


const removeHomeSpaceAction = (data: spaceHomePageRequest) => {
  return async () => {
    try {
      const result = await removeHomeSpaceApi(data);
      if (result.data) {
        return result.data;
      } else {
      }
    } catch (error) {
      return error;
    }
  };
};


export {
  getSpaceListAction,  
  addHomeSpaceAction,
  removeHomeSpaceAction,
  deleteSpaceAction
};
