import { api } from "../axios";
import { backup, usersList } from "../constants";

const CREATE_BACKUP = async (value: any) => {
    return await api.post(backup, value);
  };
  const DELETE_BACKUP = async (value: any) => {
    return await api.delete(backup+`${value}/`);
  };
  const RESTORE_BACKUP = async (value:any) => {
      return await api.post(backup  + `${value?.id}/restore/`,value)
  }
  const VALIDATE_CREDENTIAL = async (value:any) => {
    return await api.post(usersList  + `validate_credential/`,value)
}
const RESTORE_FROM_FILE = async (value:any) => {
  return await api.post(backup  + `restore_from_file/`,value)
}

  export {
    CREATE_BACKUP,
    DELETE_BACKUP,
    RESTORE_BACKUP,
    VALIDATE_CREDENTIAL,
    RESTORE_FROM_FILE
  }