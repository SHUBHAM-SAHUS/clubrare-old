import {
  SET_TOP_COLLECTION_ITEMS,
  SET_TOP_COLLECTION_IS_NULL,
  UPDATE_TOP_COLLECTION_ITEMS,
  TOP_COLLECTION_LIST_LOADING,
  UPDATE_TOP_COLLECTION_PAGE,
  COLLECTION_SEARCH_KEYWORD,
} from '../../types';

const initialState = {
  collectionItems: [],
  collectionPageNo: 1,
  collectionIsNull: true,
  search_start: false,
  collectionLoading: false,
  collectionSearchKeyword: '',
};

const topCollectionReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_TOP_COLLECTION_ITEMS:
      return { ...state, collectionItems: action.payload };

    case UPDATE_TOP_COLLECTION_ITEMS:
      return {
        ...state,
        collectionItems: [...state.collectionItems, ...action.payload],
      };
    case SET_TOP_COLLECTION_IS_NULL:
      return { ...state, collectionIsNull: action.payload };
    case UPDATE_TOP_COLLECTION_PAGE:
      return { ...state, collectionPageNo: action.payload };
    case TOP_COLLECTION_LIST_LOADING:
      return { ...state, collectionLoading: action.payload };
    case COLLECTION_SEARCH_KEYWORD:
      return { ...state, collectionSearchKeyword: action.payload };
    default:
      return state;
  }
};

export { topCollectionReducer };
