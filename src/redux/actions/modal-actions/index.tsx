import {
  SHOW_HIDE_MODAL,
  SHOW_HIDE_PUT_ON_SALE_MODAL,
  UPDATE_TRANSACTION_HASH,
} from '../../types';

const showHideModalAction = (data: any) => {
  return async (dispatch: any) => {
    dispatch({ type: SHOW_HIDE_MODAL, payload: data });
  };
};

const showHidePutOnSaleModalAction = (
  isModal: boolean,
  tokenId: any,
  isPutOnResale: boolean,
) => {
  return async (dispatch: any) => {
    dispatch({
      type: SHOW_HIDE_PUT_ON_SALE_MODAL,
      payload: { isModal, tokenId, isPutOnResale },
    });
  };
};

const updateTransactionHashAction = (data: any) => {
  return async (dispatch: any) => {
    dispatch({ type: UPDATE_TRANSACTION_HASH, payload: data });
  };
};

export {
  showHideModalAction,
  updateTransactionHashAction,
  showHidePutOnSaleModalAction,
};
