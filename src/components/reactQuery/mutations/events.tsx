import { api } from "../axios";
import { event } from "../constants";

const CREATE_EVENT = async (value: any) => {
    return await api.post(event, value);
  };
  const UPDATE_EVENT = async (value: any) => {
    return await api.patch(event+`${value?.id}/`,value);
  };
  const DELETE_EVENT = async (value: any) => {
    return await api.delete(event+`${value}/`);
  };
  const UPDATE_ACTIVE_DE_ACTIVE_EVENT = async (variable:any) => {
    return await api.patch(event + `${variable?.id}/`, variable)
  }

  export {
    CREATE_EVENT,
    UPDATE_EVENT,
    DELETE_EVENT,
    UPDATE_ACTIVE_DE_ACTIVE_EVENT
  }