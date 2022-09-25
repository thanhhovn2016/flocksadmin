import { api } from "../axios";
import {  addCompanyQuestion, addCompanyQuestionClass, companies, getProjectQuestion } from "../constants";


const ADD_PROJECT_QUESTION_CLASS = async (value: any) => {
    return await api.post(addCompanyQuestionClass, value);
  };

  const ADD_COMPANY_QUESTION = async (value: any) => {
    return await api.post(getProjectQuestion, value);
  };
  const UPDATE_PROJECT_QUESTION_CLASS = async (value: any) => {
    return await api.put(addCompanyQuestionClass + `${value?.id}/`, value);
  };
  const DELETE_PROJECT_QUESTION_CLASS = async (value: any) => {
    return await api.delete(addCompanyQuestionClass + `${value}/`);
  };

  const DELETE_PROJECT_QUESTION = async (value: any) => {
    return await api.delete( getProjectQuestion+ `${value}/`);
  };
  const UPDATE_COMPANY_QUESTION = async (value: any) => {
    return await api.put(getProjectQuestion + `${value?.id}/`, value);
  };

  const CHANGE_STATUS_PROJECT = async (value: any) => {
    return await api.patch(companies+`${value?.id}/set_status/`, {status:value?.status});
  };
  const UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS_PROJECT = async (variable:any) => {
    return await api.patch(addCompanyQuestionClass+`${variable?.id}/`, variable);
  }

  const UPDATE_ACTIVE_DE_ACTIVE_QUESTION_PROJECT = async (variable:any) => {
    return await api.patch(addCompanyQuestion+`${variable?.id}/update_status/`, variable);
  }
  export {
    ADD_PROJECT_QUESTION_CLASS,
    ADD_COMPANY_QUESTION,
    UPDATE_PROJECT_QUESTION_CLASS,
    DELETE_PROJECT_QUESTION_CLASS,
    DELETE_PROJECT_QUESTION,
    UPDATE_COMPANY_QUESTION,
    CHANGE_STATUS_PROJECT,
    UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS_PROJECT,
    UPDATE_ACTIVE_DE_ACTIVE_QUESTION_PROJECT
  }