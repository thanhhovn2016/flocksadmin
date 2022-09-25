import { message, Upload } from "antd";
import { RcFile } from "antd/lib/upload";
import { useEffect, useState } from "react";
import { manageErrors } from "../errors/manageErrors";
import { readUploadFileAsUrl } from "../fileReader/fileReader";
import { api } from "../reactQuery/axios";
import { translate } from "../translate/useTranslate";
import { PlusOutlined } from '@ant-design/icons'
import { mediaDownload } from "../reactQuery/constants";

interface IProps {
  getAvatarLinkFunction? : (data:any) => void
  handleLoadingPage? : (data:boolean) => void
  handleGetImageObject ? : (data:any) => void,
  defaultImage?:string | boolean
}
const UploadComponent = (props:IProps) => {


    const [imageUrl ,setImageUrl] = useState<any>(false)
    const [ imageLink,  setImageLink] = useState(null)

    useEffect (() => {
      // if ((imageUrl === null || typeof imageUrl === "string")   && props?.defaultImage ) {
      //   setImageUrl(props?.defaultImage)
      // }
      setImageUrl(props?.defaultImage)
    },[props?.defaultImage])
    const beforeUpload = (file: any) => {
        const isJpgOrPng =
          file.type === "image/jpeg" ||
          file.type === "image/png" ||
          file?.type === "image/jpg";
        if (!isJpgOrPng) {
          message.error("You can only upload JPG/PNG/jpeg file!");
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
          message.error("Image must smaller than 5MB!");
        }
        return isJpgOrPng && isLt2M;
      };
      const handleChangeFunction =  (event:any) => {
        

        if (props?.handleGetImageObject && event.file)
                  props.handleGetImageObject(event?.file?.originFileObj)
                  


      }
    return(
        <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChangeFunction}
                action={async (action: RcFile | string) => {
                //   setLoadingPage(true);
                  // setLoaderUploadImageHeaderPost(true);
                  // const file = event?.file?.originFileObj
                  if (props.handleLoadingPage)
                  props.handleLoadingPage(true)

                  // if (props?.handleGetImageObject)
                  // props.handleGetImageObject(action)

                  const base64 = await readUploadFileAsUrl(action);
              
                  setImageUrl(base64);

                  
                  // try {
                  //   const formData = new FormData();
                  //   formData.append("file", action);
                  //   const urlFile = await api.post(mediaDownload, formData, {
                  //     headers: {
                  //       "content-type": "multipart/form-data",
                  //     },
                  //   });
                  //   if (props.getAvatarLinkFunction)
                  //   props.getAvatarLinkFunction(urlFile?.data)
                  //   setImageLink(urlFile?.data);
                  //   // setLoadingPage(false);
                  //   // setLoaderUploadImageHeaderPost(false);
                  //   // contUploadFile = false;
                  //   // if (!contUploadFile)
                  //     manageErrors(
                  //       { code: "" },
                  //       "success",
                  //       "Upload successfully."
                  //     );
                  // } catch (error) {
                  //   manageErrors(error, "error");
                  //   // setLoadingPage(false);
                  //   // setLoaderUploadImageHeaderPost(false);
                  //   // contUploadFile = false;
                  // }
                  return "";
                }}
                accept={"image/png , image/jpg , image/jpeg"}
                style={{ width: "10rem", height: "10rem", borderRadius: "50%" }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "10rem",
                      height: "10rem",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  imageUrl === false && (
                    <div
                      style={{
                        width: "10rem",
                        height: "10rem",
                        borderRadius: "50%",
                        marginTop:"100%"
                      }}
                    >
                      <span
                        style={{ display: "grid", justifyContent: "center" }}
                      >
                        <PlusOutlined />
                      </span>
                      <span>{translate?.upload}</span>
                    </div>
                  )
                )}
              </Upload>
    )
}

export default UploadComponent