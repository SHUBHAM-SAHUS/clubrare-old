import axios from 'axios';
import { ReportRequestProps } from '../../../types/user-report-types';

const APP_URL = process.env.REACT_APP_API_BASE_URL;
const networdId: any = localStorage.getItem('networkId');
const klatynNetworkId = process.env.REACT_APP_KLATYN_NETWORK_ID;
const query: any = {
  network_id: networdId === klatynNetworkId ? 2 : 1,
};
const getReportApi = (requestParams:ReportRequestProps) => {
  const xhr = axios.request<null, any>({
    method: 'get',
    url: `${APP_URL}/v1.6/report/get`,
    params: requestParams,
  });
  return xhr;
};

const submitReport = (data: any) => {
  const xhr = axios.request<null, any>({
    method: 'post',
    url: `${APP_URL}/v1.5/report/create`,
    data,
  });
  return xhr;
};

export { getReportApi, submitReport };
