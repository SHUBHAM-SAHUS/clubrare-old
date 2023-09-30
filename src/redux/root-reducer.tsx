import { combineReducers } from 'redux';
import {
  headerReducer,
  myItemsReducer,
  itemDetailsReducer,
  notificationsReducer,
  redeemableReducer,
  loaderReducer,
  exploreReducer,
  modalReducer,
  categoryReducer,
  allnotificationReducer,
  iloReducer,
  tradingRewardsReducer,
  topCollectionReducer,
  socialLinkReducer
} from './reducers';

import { topMembersReducer } from '../redux/reducers/top-members-reducers';
import { profileReducers } from '../redux/reducers/profile-reducer';
import { metamaskReducer } from '../redux/reducers/metamask-reducer';
import { adminReducer } from '../redux/reducers/admin-reducer';
import { ratechangeReducer } from './reducers/rate-conversion-data';
import { getWhitelistDataReducer } from './reducers/reward-admin-reducer';

export const rootReducer = combineReducers({
  headerReducer,
  myItemsReducer,
  itemDetailsReducer,
  notificationsReducer,
  redeemableReducer,
  topMembersReducer,
  loaderReducer,
  exploreReducer,
  profileReducers,
  modalReducer,
  metamaskReducer,
  adminReducer,
  categoryReducer,
  allnotificationReducer,
  ratechangeReducer,
  getWhitelistDataReducer,
  iloReducer,
  tradingRewardsReducer,
  topCollectionReducer,
  socialLinkReducer
});
