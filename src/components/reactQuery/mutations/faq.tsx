import { api } from "../axios";
import { faq, faqCategory } from "../constants";

const CREATE_FAQ_CATEGORY = async (value: any) => {
    return await api.post(faqCategory, value);
  };

  const DELETE_FAQ_CATEGORY = async (value: any) => {
    return await api.delete(faqCategory+`${value}/`);
  };
  const UPDATE_FAQ_CATEGORY = async (value: any) => {
    return await api.put(faqCategory+`${value?.id}/`,value);
  };

  const CREATE_FAQ = async (value: any) => {
    return await api.post(faq, value);
  };

  const UPDATE_FAQ = async (value: any) => {
    return await api.put(faq+`${value?.id}/`,value);
  };
  const DELETE_FAQ = async (value: any) => {
    return await api.delete(faq+`${value}/`);
  };

  const UPDATE_ACTIVE_DE_ACTIVE_FAQ = async (variable:any) => {
    return await api.patch(faq + `${variable?.id}/`, variable )
  }
  const UPDATE_ACTIVE_DE_ACTIVE_FAQ_CATEGORY = async (variable:any) =>{
    return await api.patch(faqCategory + `${variable?.id}/` , variable)
  }

  export {
      CREATE_FAQ_CATEGORY,
      DELETE_FAQ_CATEGORY,
      UPDATE_FAQ_CATEGORY,
      CREATE_FAQ,
      UPDATE_FAQ,
      DELETE_FAQ,
      UPDATE_ACTIVE_DE_ACTIVE_FAQ,
      UPDATE_ACTIVE_DE_ACTIVE_FAQ_CATEGORY
      
  }