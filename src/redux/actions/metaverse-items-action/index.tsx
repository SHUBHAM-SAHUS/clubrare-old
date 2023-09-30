import { getMerkleProofMpwrApi } from "../../api";

export const getWhiteListedStatusforMpwrAction = () => {
  return async () => {
    try {
      const result = await getMerkleProofMpwrApi();
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