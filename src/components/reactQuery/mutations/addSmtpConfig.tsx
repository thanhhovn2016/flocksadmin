
import { api } from "../axios";
import {  addSocialApp, emailServer} from "../constants";

 const ADD_SMTP_CONFIG = async (value: any) => {
    return await api.post(emailServer, value);
  };
  const DELETE_SMTP_CONFIG = async (id:string) => {
    return await api.delete(emailServer+id)
  }
const ADD_SOCIAL_APPS = async (value:any) => {
    return await api.post(addSocialApp , value)
}
const DELETE_SOCIAL_APPS= async (id:string)=>{
  return api.delete(`${addSocialApp}${id}`)
}
const UPDATE_SOCIAL_APPS = async (value:any) => {
  return await api.put(addSocialApp+`${value?.id}` , value)
}
const UPDATE_SMTP_CONFIG = async (value:any) => {
  return api.patch(emailServer + `${value?.id}`, value)
}
  export {
      ADD_SMTP_CONFIG,
      ADD_SOCIAL_APPS,
      DELETE_SOCIAL_APPS,
      UPDATE_SOCIAL_APPS,
      DELETE_SMTP_CONFIG,
      UPDATE_SMTP_CONFIG
  }