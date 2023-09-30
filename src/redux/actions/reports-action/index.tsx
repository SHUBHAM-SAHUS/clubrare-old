import { ReportRequestProps } from '../../../types/user-report-types';
import { getReportApi, submitReport } from '../../api';

const getReportsAction = (requestParams:ReportRequestProps) => {
  return async () => {
    try {
      const result = await getReportApi(requestParams);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

const submitReportAPiAction = (data: any) => {
  return async () => {
    try {
      const result = await submitReport(data);
      if (result.data) {
        return result.data;
      } else {
        return false;
      }
    } catch (error) {
      return error;
    }
  };
};

export { getReportsAction, submitReportAPiAction };
