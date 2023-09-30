import {
  SET_CREATED_ITEMS,
  UPDATE_CREATED_ITEMS,
  UPDATE_ON_SALE,
  UPDATE_COLLECTIBLE_ITEMS,
  SET_COLLECTIBLE_ITEMS,
  GET_ON_SALE,
  SET_CREATED_ITEM_IS_NULL,
  UPDATE_CREATED_PAGE,
  UPDATE_COLLECTED_PAGE,
  SET_COLLECTED_ITEM_IS_NULL,
  SET_ON_SALE_ITEM_IS_NULL,
  UPDATE_ON_SALE_PAGE,
  GET_ON_FAVIOURATE,
  FAVIOURATE_ITEM_IS_NULL,
  UPDATE_ON_FAVIOURATE,
  UPDATE_ON_FAVIOURATE_PAGE,
  SET_COLLECTION_ITEMS,
  UPDATE_COLLECTION_ITEMS,
  SET_COLLECTION_ITEM_IS_NULL,
  UPDATE_COLLECTIBLE_PAGE,
  UPDATE_PENDING_COLLECTIBLES_ITEMS,
  SET_PENDING_COLLECTED_ITEM_IS_NULL,
  UPDATE_PENDING_COLLECTIBLE_PAGE,
  SET_PENDING_COLLECTIBLES_ITEMS,
  SET_HIDDEN_ITEMS,
  UPDATE_HIDDEN_ITEMS,
  SET_HIDDEN_ITEM_IS_NULL,
  UPDATE_HIDDEN_PAGE,
} from '../../types';

const initialState = {
  createdItems: [],
  hiddenItems: [],
  collectibleItems: [],
  onSaleItems: [],
  createdItemIsNull: false,
  hiddenItemIsNull: false,
  createdItemPage: 1,
  hiddenItemPage: 1,
  collectedItemIsNull: false,
  collectedItemPage: 1,
  onSaleItemIsNull: false,
  onSaleItemPage: 1,
  favourateItem: [],
  onFaviourateItemIsNull: false,
  onFaviourateItemPage: 1,
  collectionItem: [],
  collectionItemIsNull: false,
  collectibleItemPage: 1,
  pendingCollectibleItems: [],
  pendingCollectedItemIsNull: false,
  pendingCollectedItemPage: 1,
};
const myItemsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_CREATED_ITEMS:
      return { ...state, createdItems: action.payload };
    case UPDATE_CREATED_ITEMS:
      return {
        ...state,
        createdItems: [...state.createdItems, ...action.payload],
      };
    case SET_CREATED_ITEM_IS_NULL:
      return { ...state, createdItemIsNull: action.payload };
    case UPDATE_CREATED_PAGE:
      return { ...state, createdItemPage: action.payload };

    case SET_HIDDEN_ITEMS:
      return { ...state, hiddenItems: action.payload };
    case UPDATE_HIDDEN_ITEMS:
      return {
        ...state,
        hiddenItems: [...state.hiddenItems, ...action.payload],
      };
    case SET_HIDDEN_ITEM_IS_NULL:
      return { ...state, hiddenItemIsNull: action.payload };
    case UPDATE_HIDDEN_PAGE:
      return { ...state, hiddenItemPage: action.payload };

    case SET_COLLECTIBLE_ITEMS:
      return { ...state, collectibleItems: action.payload };
    case SET_PENDING_COLLECTIBLES_ITEMS:
      return { ...state, pendingCollectibleItems: action.payload };
    case UPDATE_COLLECTIBLE_ITEMS:
      return {
        ...state,
        collectibleItems: [...state.collectibleItems, ...action.payload],
      };
    case UPDATE_PENDING_COLLECTIBLES_ITEMS:
      return {
        ...state,
        pendingCollectibleItems: [
          ...state.pendingCollectibleItems,
          ...action.payload,
        ],
      };
    case SET_COLLECTED_ITEM_IS_NULL:
      return { ...state, collectedItemIsNull: action.payload };
    case SET_PENDING_COLLECTED_ITEM_IS_NULL:
      return { ...state, pendingCollectedItemIsNull: action.payload };
    case UPDATE_COLLECTED_PAGE:
      return { ...state, collectedItemPage: action.payload };
    case UPDATE_PENDING_COLLECTIBLE_PAGE:
      return { ...state, pendingCollectedItemPage: action.payload };
    case GET_ON_SALE:
      return { ...state, onSaleItems: action.payload };
    case UPDATE_ON_SALE:
      return {
        ...state,
        onSaleItems: [...state.onSaleItems, ...action.payload],
      };
    case SET_ON_SALE_ITEM_IS_NULL:
      return { ...state, onSaleItemIsNull: action.payload };
    case UPDATE_ON_SALE_PAGE:
      return { ...state, onSaleItemPage: action.payload };
    case GET_ON_FAVIOURATE:
      return { ...state, favourateItem: action.payload };
    case FAVIOURATE_ITEM_IS_NULL:
      return { ...state, onFaviourateItemIsNull: action.payload };
    case UPDATE_ON_FAVIOURATE:
      return {
        ...state,
        favourateItem: [...state.favourateItem, ...action.payload],
      };
    case UPDATE_ON_FAVIOURATE_PAGE:
      return { ...state, onFaviourateItemPage: action.payload };
    case SET_COLLECTION_ITEMS:
      return { ...state, collectionItem: action.payload };
    case UPDATE_COLLECTION_ITEMS:
      return {
        ...state,
        collectionItem: [...state.collectionItem, ...action.payload],
      };
    case SET_COLLECTION_ITEM_IS_NULL:
      return { ...state, collectionItemIsNull: action.payload };
    case UPDATE_COLLECTIBLE_PAGE:
      return { ...state, collectibleItemPage: action.payload };

    default:
      return state;
  }
};

export { myItemsReducer };
