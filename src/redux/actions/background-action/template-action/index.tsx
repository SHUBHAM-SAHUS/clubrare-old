import {
  addTemplateApi,
  deleteTemplateApi,
  getTemplateApi
  } from '../../../api/background/template'
  
  export const getTemplateAction = (data: any) => {
    return async () => {
      try {
        const result = await getTemplateApi(data);
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
  
  export const addTemplateAction = (data: any) => {
    return async () => {
      try {
        const result = await addTemplateApi(data);
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
  
  export const deleteTemplateAction = (data: any) => {
    return async () => {
      try {
        const result = await deleteTemplateApi(data);
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
  