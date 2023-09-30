import {
    addColorApi,
    deleteColorApi,
    getColorApi,
    updateColorApi,
  } from '../../../api/background/color'
  
  export const getColorAction = (data: any) => {
    return async () => {
      try {
        const result = await getColorApi(data);
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
  
  export const addColorAction = (data: any) => {
    return async () => {
      try {
        const result = await addColorApi(data);
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
  
  export const updateColorAction = (data: any) => {
    return async () => {
      try {
        const result = await updateColorApi(data);
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
  
  export const deleteColorAction = (data: any) => {
    return async () => {
      try {
        const result = await deleteColorApi(data);
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
  
  