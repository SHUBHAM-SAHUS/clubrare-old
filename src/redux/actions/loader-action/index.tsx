import { SET_LOADER_STATE } from '../../types/loader-types';

const setLoaderAction = (loadState: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: SET_LOADER_STATE, payload: loadState });
  };
};

export { setLoaderAction };
