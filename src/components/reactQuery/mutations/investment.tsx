import { api } from "../axios";
import { addInvestmentQuestion, addInvestmentQuestionClass, getInvestmentQuestion, investment, investmentQuestionClass } from "../constants";

const ADD_INVESTMENT_QUESTION_CLASS = async (value: any) => {
    return await api.post(addInvestmentQuestionClass, value);
  };
  const ADD_INVESTMENT_QUESTION = async (value: any) => {
    return await api.post(addInvestmentQuestion, value);
  };
  const UPDATE_INVESTMENT_QUESTION_CLASS = async (value: any) => {
    return await api.put(addInvestmentQuestionClass + `${value?.id}/`, value);
  };
  const DELETE_INVESTMENT_QUESTION_CLASS = async (value: any) => {
    return await api.delete(addInvestmentQuestionClass + `${value}/`);
  };
  const UPDATE_INVESTMENT_QUESTION = async (value: any) => {
    return await api.put(getInvestmentQuestion + `${value?.id}/`, value);
  };

  const DELETE_INVESTMENT_QUESTION = async (value: any) => {
    return await api.delete(getInvestmentQuestion + `${value}/`);
  };

  // const UPDATE_INVESTMENT_STATUS = async () => {
  //   return await api.patch()
  // }
  const CHANGE_STATUS_INVESTMENT = async (value: any) => {
    return await api.patch(investment+`${value?.id}/set_status/`, {status:value?.status});
  };
  const UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS = async (value: any) => {
    return await api.patch(investmentQuestionClass+`${value?.id}/`, value);
  };
  const UPDATE_ACTIVE_DE_ACTIVE_QUESTION_INVESTOR = async (variables:any) => {
    return await api.patch(getInvestmentQuestion + `${variables?.id}/update_status/`,variables)
  }
export {
    ADD_INVESTMENT_QUESTION_CLASS,
    ADD_INVESTMENT_QUESTION,
    UPDATE_INVESTMENT_QUESTION_CLASS,
    DELETE_INVESTMENT_QUESTION_CLASS,
    UPDATE_INVESTMENT_QUESTION,
    DELETE_INVESTMENT_QUESTION,
    CHANGE_STATUS_INVESTMENT,
    UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS,
    UPDATE_ACTIVE_DE_ACTIVE_QUESTION_INVESTOR

    
}