import axios from 'axios';

const pinata_api_key: any = '71b5f0f13430f6d7fe6a';
const pinata_secret_api_key: any =
  'b13c8fbafe04423a38340276c97ec36b331cf9239088d099d9e16e44015810c3';

const postPinataApiForIpfs = (data: any) => {
  const instance = axios.create();
  delete instance.defaults.headers.common['Authorization'];

  const xhr = instance.request<null, any>({
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      pinata_api_key: pinata_api_key,
      pinata_secret_api_key: pinata_secret_api_key,
    },
    url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
    data,
  });
  return xhr;
};

const postPinataApiForData = (data: any) => {
  const instance = axios.create();
  delete instance.defaults.headers.common['Authorization'];
  const xhr = instance.request<null, any>({
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      pinata_api_key: pinata_api_key,
      pinata_secret_api_key: pinata_secret_api_key,
    },
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    data,
  });
  return xhr;
};

export { postPinataApiForIpfs, postPinataApiForData };
