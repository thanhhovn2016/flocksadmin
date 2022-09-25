import { api } from "../axios";
import { verification } from "../constants";


const VERIFICATION_USER = async (value: any) => {
    return await api.patch(verification+`${value?.id}/set_status/`, {verificationStatus:value?.verificationStatus});
  };

  export { VERIFICATION_USER}