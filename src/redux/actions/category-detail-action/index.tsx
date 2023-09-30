import {
  addCategoryApi,
  addImageRuleApi,
  deleteCategoryApi,
  deleteImageRuleApi,
  getCategoryApi,
  getImageRulesApi,
  updateCategoryApi,
} from '../../api/category-detail-api';

export const getCategoryAction = (data: any) => {
  return async () => {
    try {
      const result = await getCategoryApi(data);
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

export const addCategoryAction = (data: any) => {
  return async () => {
    try {
      const result = await addCategoryApi(data);
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

export const updateCategoryAction = (data: any) => {
  return async () => {
    try {
      const result = await updateCategoryApi(data);
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

export const deleteCategoryAction = (data: any) => {
  return async () => {
    try {
      const result = await deleteCategoryApi(data);
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

export const getImageRulesAction = (data: any) => {
  return async () => {
    try {
      const result = await getImageRulesApi(data);
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

export const deleteImageRuleAction = (data: any) => {
  return async () => {
    try {
      const result = await deleteImageRuleApi(data);
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

export const addImageRuleAction = (data: any) => {
  return async () => {
    try {
      const result = await addImageRuleApi(data);
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
