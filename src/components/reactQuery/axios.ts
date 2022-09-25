
import axios from 'axios'
import { accessToken, BASE_URL, refreshToken, tokensRefresh } from './constants'
// import { useTokenFunction } from '../../components/handelToke/handleToken';

// const { getToken } = useTokenFunction()
// const token = localStorage.getItem(accessToken)
// const api = axios.create({
//     baseURL: `${BASE_URL}`,
//     timeout: 1000,
//     headers: {'Content-Type': 'application/json' ,
//      ...( token ? {"Authorization":"Bearer " +`${token}`}: {})
    
//     }
//   });

const axios_instance = axios.create({
    baseURL: `${BASE_URL}`,
    headers: {
        'Content-Type': 'application/json'
    }
});

let access_token = "";

axios_instance.interceptors.request.use((config) => {
    access_token = `${localStorage.getItem(accessToken)}`
    
    if (access_token !== "null"){
        
        //@ts-ignore
        config.headers['Authorization'] = "Bearer " + access_token;

    }
    return config;
});

async function refresh_token () {
    let refreshTokenData:any = ''
    try{

        refreshTokenData = await axios.post(`${BASE_URL}${tokensRefresh}`,{refresh:localStorage.getItem(refreshToken)})
        // 
    }catch(error:any){
        // 
        if (error?.response?.data?.code === "token_not_valid"){
            localStorage?.removeItem(accessToken)
            localStorage?.removeItem(refreshToken)
            window.location.href = "/"
        }
    }
    return refreshTokenData
}

axios_instance.interceptors.response.use((response) => {
    return response
}, async (error) => {
    // 
    const config = error.config;
    if(error?.response?.status === 403 || error.response.status === 401) {
        if (error?.response?.data?.code === "token_not_valid"){

            let res = await refresh_token();
            if(res?.data?.access) {
                access_token = res?.data?.access;
                localStorage.setItem(accessToken , `${access_token}`)
                if (res?.data?.refresh !== undefined){
    
                    localStorage.setItem(refreshToken , `${res?.data?.refresh}`)
                }
            }
        }
        return axios_instance(config);
    }
    return Promise.reject(error)
});
const api = axios_instance

  export { api }