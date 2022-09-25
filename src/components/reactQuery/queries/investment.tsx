import { api } from "../axios";
import { investment } from "../constants";

 const GET_INVESTMENT = async (value: any) => {
    return await api.post(investment, value);
  };

  export {
    GET_INVESTMENT
  }