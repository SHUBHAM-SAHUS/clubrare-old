import {
  allReadnotification,
  getAllNotification,
  getAllUnreadNotificationsApi,
  notificationsingalread,
} from '../../api';
import {
  SET_UNREAD_NOTIFICATION,
  SET_UNREAD_NOTIFICATION_COUNT,
} from '../../types';

const getAllUnreadNotificationsAction = (address: string) => {
  return async (dispatch: any) => {
    try {
      const result = await getAllUnreadNotificationsApi(address);
      if (result.data) {
        dispatch({
          type: SET_UNREAD_NOTIFICATION,
          payload: result.data.notifications,
        });
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const setUnreadNotificationCount = () => {
  return async (dispatch: any) => {
    try {
      dispatch({ type: SET_UNREAD_NOTIFICATION_COUNT, payload: 1 });
    } catch (error) {
      return error;
    }
  };
};

const getAllNotificatiionAction = (data: any) => {
  return async () => {
    try {
      const result = await getAllNotification(data);
      if (result.data) {
        return result.data.data;
      } else {
        return false;
      }
    } catch (err) {
      return err;
    }
  };
};

const NotificationSingalReadAction = (data: any) => {
  return async () => {
    try {
      const result: any = await notificationsingalread(data);
      if (result) {
        return result.data.data;
      } else {
        return result.data;
      }
    } catch (err) {
      return err;
    }
  };
};

const AllReadNotificationAction = () => {
  return async () => {
    try {
      const result: any = await allReadnotification();
      if (result && result.data) {
        return result.data;
      } else {
        return result;
      }
    } catch (err) {
      return err;
    }
  };
};

export {
  getAllUnreadNotificationsAction,
  setUnreadNotificationCount,
  getAllNotificatiionAction,
  NotificationSingalReadAction,
  AllReadNotificationAction,
};
