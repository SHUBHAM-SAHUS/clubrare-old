import {
  SHOW_HIDE_MODAL,
  SHOW_HIDE_PUT_ON_SALE_MODAL,
  UPDATE_TRANSACTION_HASH,
} from '../../types';

const initialState = {
  transactionHash: '',
  isModalVisible: false,
  isPutOnSaleModalVisible: false,
  tokenId: null,
  isPutOnResaleModal: false,
};
const modalReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPDATE_TRANSACTION_HASH:
      return { ...state, transactionHash: action.payload };
    case SHOW_HIDE_MODAL:
      return { ...state, isModalVisible: action.payload };
    case SHOW_HIDE_PUT_ON_SALE_MODAL:
      return {
        ...state,
        isPutOnSaleModalVisible: action.payload.isModal,
        tokenId: action.payload.tokenId,
        isPutOnResaleModal: action.payload.isPutOnResale,
      };
    default:
      return state;
  }
};

export { modalReducer };
