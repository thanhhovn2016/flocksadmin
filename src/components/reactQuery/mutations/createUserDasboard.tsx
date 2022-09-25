
import { api } from "../axios";
import { addUserDashboard, usersList } from "../constants";

 const CREATE_USER_DASHBOARD = async (value: any) => {
    return await api.post(addUserDashboard, value);
  };

  const DELETE_USER_MANAGEMENT = async (value: any) => {
    return await api.delete(addUserDashboard+`${value}/`);
  };
  const UPDATE_USER_MANAGEMENT_STATUS = async (value: any) => {
    return await api.patch(addUserDashboard+`${value?.id}/`,{isVerified:!value?.isVerified});
  };
  
  const CHANGE_PASSWORD = async (variables:any) => {
    return await api.post(usersList + `${variables?.userId}/change_password/`, variables)
  }

  const UPDATE_ACTIVE_DE_ACTIVE_USER_MANAGEMENT = async (variable:any) => {
    return await api.patch(addUserDashboard+ `${variable?.id}/`,variable)

  }
  
 

  export {
    CREATE_USER_DASHBOARD,
    DELETE_USER_MANAGEMENT,
    UPDATE_USER_MANAGEMENT_STATUS,
    CHANGE_PASSWORD,
    UPDATE_ACTIVE_DE_ACTIVE_USER_MANAGEMENT

  }