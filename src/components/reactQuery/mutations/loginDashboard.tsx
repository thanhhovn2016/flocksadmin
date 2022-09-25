import axios from "axios";
import { api } from "../axios";
import { BASE_URL, loginDashboard } from "../constants";

 const LOGIN_DASHBOARD = async (value: any) => {
    return await axios.post(BASE_URL+loginDashboard, value);
  };

  export {
    LOGIN_DASHBOARD
  }