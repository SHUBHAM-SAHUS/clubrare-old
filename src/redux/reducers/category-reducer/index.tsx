import { ALLCATEGORY_COLLECTIONS_ITEM } from '../../types';

const intialstate = {
  allcategoryitem: [],
};

const categoryReducer = (state = intialstate, action: any) => {
  switch (action.type) {
    case ALLCATEGORY_COLLECTIONS_ITEM:
      return {
        ...state,
        allcategoryitem: action.payload,
      };
    default:
      return state;
  }
};

export { categoryReducer };
