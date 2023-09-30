import axios from "axios";

const APP_URL = process.env.REACT_APP_API_BASE_URL;

const getTransactionInfoApi = () => {
  const xhr = axios.request<null, any>({
    method: "get",
    url: `${APP_URL}/v1.1/llc-stacking/get-history`
  });
  return xhr;
};

const getLlcNftDataApi = (data:any) => {
  const xhr = axios.request<null, any>({
    method: "get",
    url: `${APP_URL}/v1.1/llc-stacking/get-all-llc-nft?cursor=${data.cursor}`,
  });
  return xhr;
}

export { getTransactionInfoApi, getLlcNftDataApi };
