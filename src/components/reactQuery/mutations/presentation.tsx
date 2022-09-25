import { api } from "../axios";
import { companyPresentation } from "../constants";


const CHANGE_STATUS_PROJECT_PRESENTATION = async (value: any) => {
    return await api.patch(companyPresentation+`${value?.id}/`, value);
  };

  export {CHANGE_STATUS_PROJECT_PRESENTATION}