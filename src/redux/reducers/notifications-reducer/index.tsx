import {
  SET_GET_ALL_NOTIFICATION,
  SET_UNREAD_NOTIFICATION,
  SET_UNREAD_NOTIFICATION_COUNT,
} from '../../types';

const initialState = {
  unreadNotifications: [],
  unreadCount: 0,
  allnotification: null,
};
const notificationsReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_UNREAD_NOTIFICATION:
      return {
        ...state,
        unreadNotifications: action.data,
        unreadCount: action.data ? action.data.length : state.unreadCount,
      };
    case SET_UNREAD_NOTIFICATION_COUNT:
      return { ...state, unreadCount: +state.unreadCount + action.payload };
    default:
      return state;
  }
};

const allnotificationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_GET_ALL_NOTIFICATION:
      return {
        ...state,
        allnotification: action.payload,
      };
    default:
      return state;
  }
};

export { notificationsReducer, allnotificationReducer };
