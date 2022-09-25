import { api } from "../axios";
import { ProfileMeChangePassword, userMe } from "../constants";


 const UPDATE_USER_PROFILE = async (value: any) => {
    return await api.patch(userMe,value);
  };
  
const CHANGE_PASSWORD = async  (variables:any) => {
  return await api.post(ProfileMeChangePassword , variables)
}
  export {
    UPDATE_USER_PROFILE,
    CHANGE_PASSWORD
  }