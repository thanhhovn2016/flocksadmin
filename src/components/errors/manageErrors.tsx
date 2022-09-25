import { message } from "antd";
type typeError =  'success' | 'error' | 'warning'

message.config({
  top: 50,
  duration: 5,
});
const manageErrors = (error: any = {code:""}  , errorType:typeError , textMessage:string = "") => {
  const data = error?.response?.data;
  const messageText = "Oops! something was wrong with server!."
  const statusData:any = {
    500:"(500 Internal Server Error)",
    501:"(501 Not Implemented)",
    502:"(502 Bad Gateway)",
    503:"(503 Service Unavailable)",
    504:"(504 Gateway Timeout)"
  }

const status = statusData?.[`${error?.response?.status}`]
if (error?.response?.status >= 500){
  return message.error(messageText + status)

}else{

  if (errorType === "error"){
     
    for(let item  in data ){
        if (typeof data === "object"){
            if (item !== "code")
            return message.error(data[item])
        }
        if (data?.length > 0 ){
           return message.error(data?.[0])
        }
    }
    if (error?.response === undefined){
        message.warning("Something was wrong with your internet connection!.")
    }
    
    //   if (Object.keys(data?.error || {}).length) {
    //     let errorMessage = data?.error[Object.keys(data?.error)[0]].message;
    //     message.error(errorMessage);
    //   } else {
    //     message.error(data.message);
    //   }
  }
  if (errorType === 'success'){
    message.success(textMessage)
  }
}
//   if (errorType === "warning"){
//     if (Object.keys(data?.error || {}).length) {
//         let errorMessage = data?.error[Object.keys(data?.error)[0]].message;
//         message.error(errorMessage);
//       } else {
//         message.error(data.message);
//       }
//   }
}

export {manageErrors}