import { Button, Col, Image, Input, message, Modal, Row, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { Typography } from "antd";
import { Controller, useForm } from "react-hook-form";
import { translate } from "../components/translate/useTranslate";
import { useStore } from "../components/zustand/store";
import { useEffect, useState } from "react";
import { readUploadFileAsUrl } from "../components/fileReader/fileReader";
import { api } from "../components/reactQuery/axios";
import { IMAGES_PATH, mediaDownload } from "../components/reactQuery/constants";
import { manageErrors } from "../components/errors/manageErrors";
import { useMutation } from "react-query";
import { CHANGE_PASSWORD, UPDATE_USER_PROFILE } from "../components/reactQuery/mutations/userProfile";
import { SpinLoader } from "../components/space/spin";
import { RcFile } from "antd/lib/upload";

const { Title, Text } = Typography;
const Profile = () => {
  const userInfo = useStore((state: any) => state.user);
  const setUserInfo = useStore((state: any) => state?.setUser);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [imageLink, setImageLink] = useState<any>(null);
  const [visibleModalChangePassword , setVisibleModalChangePassword] = useState(false)

  useEffect(() => {
    if (imageUrl === null) {
      if (userInfo?.avatar?.url){

        setImageUrl(IMAGES_PATH + userInfo?.avatar?.url);
      }
      setValue("firstName", userInfo?.firstName);
      setValue("lastName", userInfo?.lastName);
      setValue("email", userInfo?.email);
      
    }
    setValue("oldPassword"," ")
      setValue("newPassword"," ")
      setValue("confirmPassword"," ")
  }, [imageUrl , visibleModalChangePassword]);
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

  let contUploadFile = false;
  const handleChangeImagePost = async (event: any) => {
    if (contUploadFile) {
      return;
    } else {
      contUploadFile = true;
    }
    setLoadingPage(true);
    // setLoaderUploadImageHeaderPost(true);
    const file = event?.file?.originFileObj || event?.file;

    const base64 = await readUploadFileAsUrl(file);
    setImageUrl(base64);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const urlFile = await api.post(mediaDownload, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      setImageLink(urlFile?.data?.id);
      setLoadingPage(false);
      // setLoaderUploadImageHeaderPost(false);
      contUploadFile = false;
      if (!contUploadFile)
        manageErrors({ code: "" }, "success", "Upload successfully.");
    } catch (error) {
      manageErrors(error, "error");
      setLoadingPage(false);
      // setLoaderUploadImageHeaderPost(false);
      contUploadFile = false;
    }
  };

  const { mutate: updateUserProfile } = useMutation(UPDATE_USER_PROFILE, {
    onSuccess: (values: any) => {
      const status = values?.data?.status;

      setLoadingPage(false);
      message.success("Update User profile successfully.");
      setUserInfo({ ...userInfo, avatar: imageLink });
      //  setModalAddUser(false)
      // router?.push('/')
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });

  const onSubmit = (data: any) => {
    console.log("data" , data)
    setLoadingPage(true);

    if (imageLink === null) {
      return message.error("Please select profile image");
    }
    const variables = {
      avatar: imageLink?.id,
      firstName:data?.firstName,
      lastName:data?.lastName,
      email:data?.email
    };
    updateUserProfile(variables);
  };
const handelOpenModalChangePassword = () => {
  setValue("oldPassword" , null)
  setValue("newPassword", null)
  setValue("confirmPassword" , null)
  setVisibleModalChangePassword( !visibleModalChangePassword)
}
const { mutate: changePasswordFunction } = useMutation(CHANGE_PASSWORD, {
  onSuccess: (values: any) => {
    const status = values?.data?.status;

    setLoadingPage(false);
    message.success("Update User profile successfully.");
    // setUserInfo({ ...userInfo, avatar: imageLink });
    setVisibleModalChangePassword( !visibleModalChangePassword)
    //  setModalAddUser(false)
    // router?.push('/')
    if (status === 200) {
      // message.success(values?.data?.message);
      // history.push("/");
    } else {
      // manageServeErrors(values);
    }
  },
  onError: (error) => {
    setLoadingPage(false);
    // setVisibleModalChangePassword( !visibleModalChangePassword)
    manageErrors(error, "error");
  },
});

const onSubmitRestoreChangePasswordFunction = (changePassword:any) => {
  

  const variables = {
    current_password:changePassword?.oldPassword,
    new_password:changePassword.newPassword
  }
  changePasswordFunction(variables)

}
  return (
    <div>
      {loadingPage && <SpinLoader />}
      {
        //@ts-ignore
        <Modal
          width={"40vw"}
          visible={visibleModalChangePassword}
          title={translate?.change_password}
          onCancel={handelOpenModalChangePassword}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmitRestoreChangePasswordFunction)}>
              {translate?.save}
            </Button>,
          ]}
        >
         
          <form onSubmit={handleSubmit(onSubmitRestoreChangePasswordFunction)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="oldPassword">{translate?.oldPassword}</label>
                <Controller
                  control={control}
                  {...register("oldPassword", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="oldPassword"
                      size="large"
                      name="oldPassword"
                      type="password"
                    />
                  )}
                  name="oldPassword"
                />
                {errors?.oldPassword?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: "1.5rem" }}>
                <label htmlFor="newPassword">{translate?.newPassword}</label>
                <Controller
                  control={control}
                  {...register("newPassword", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="newPassword"
                      size="large"
                      name="newPassword"
                      type="password"
                    />
                  )}
                  name="newPassword"
                />
                {errors?.newPassword?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: "1.5rem" }}>
                <label htmlFor="confirmPassword">{translate?.confirmPassword}</label>
                <Controller
                  control={control}
                  {...register("confirmPassword", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="confirmPassword"
                      size="large"
                      name="confirmPassword"
                      type="password"
                    />
                  )}
                  name="confirmPassword"
                />
                {errors?.confirmPassword?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }

      <Row>
        <Col>
          <Title level={4}>{translate?.profile}</Title>
        </Col>
      </Row>
      {/* <Row style={{display:"grid" , justifyContent:"center"}}>
          <Image style={{
              width:"5rem",
              height:"5rem",
              borderRadius:"50%"
          }}
          src={"https://static.remove.bg/remove-bg-web/5cc729f2c60683544f035949b665ce17223fd2ec/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"}/>
      </Row> */}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col span={5}></Col>
          <Col span={14}>
            <Row
              style={{
                display: "grid",
                justifyContent: "center",
                marginBottom: "2rem",
              }}
            >
              {/* <Image
                style={{
                  width: "5rem",
                  height: "5rem",
                  borderRadius: "50%",
                }}
                src={
                  "https://static.remove.bg/remove-bg-web/5cc729f2c60683544f035949b665ce17223fd2ec/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png"
                }
              /> */}
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                action={async (action: RcFile | string) => {
                  setLoadingPage(true);
                  // setLoaderUploadImageHeaderPost(true);
                  // const file = event?.file?.originFileObj

                  const base64 = await readUploadFileAsUrl(action);
                  setImageUrl(base64);
                  try {
                    const formData = new FormData();
                    formData.append("file", action);
                    const urlFile = await api.post(mediaDownload, formData, {
                      headers: {
                        "content-type": "multipart/form-data",
                      },
                    });

                    setImageLink(urlFile?.data);
                    setLoadingPage(false);
                    // setLoaderUploadImageHeaderPost(false);
                    contUploadFile = false;
                    if (!contUploadFile)
                      manageErrors(
                        { code: "" },
                        "success",
                        "Upload successfully."
                      );
                  } catch (error) {
                    manageErrors(error, "error");
                    setLoadingPage(false);
                    // setLoaderUploadImageHeaderPost(false);
                    contUploadFile = false;
                  }
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
                      // marginTop:"100%"
                    }}
                  />
                ) : (
                  imageUrl === null && (
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
            </Row>
            <Row style={{ marginBottom: "1.5rem" }}>
              <Col span={6} style={{ display: "flex" }}>
                <label htmlFor="firstName">
                  {translate?.firstName}
                  {/* <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  /> */}
                </label>
              </Col>
              <Col span={18}>
                <Controller
                  control={control}
                  {...register("firstName", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="firstName"
                      size="large"
                      name="firstName"
                      type="text"
                    />
                  )}
                  name="firstName"
                />
                {errors?.firstName?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row style={{ marginBottom: "1.5rem" }}>
              <Col span={6} style={{ display: "flex" }}>
                <label htmlFor="lastName">
                  {translate?.lastName}
                  {/* <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  /> */}
                </label>
              </Col>
              <Col span={18}>
                <Controller
                  control={control}
                  {...register("lastName", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="lastName"
                      size="large"
                      name="lastName"
                      type="text"
                    />
                  )}
                  name="lastName"
                />
                {errors?.lastName?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row style={{ marginBottom: "1.5rem" }}>
              <Col span={6} style={{ display: "flex" }}>
                <label htmlFor="email">
                  {translate?.email}
                  {/* <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  /> */}
                </label>
              </Col>
              <Col span={18}>
                <Controller
                  control={control}
                  {...register("email", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      size="large"
                      name="email"
                      type="text"
                    />
                  )}
                  name="email"
                />
                {errors?.email?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row style={{ marginBottom: "1.5rem" }}>
              <Col span={6} style={{ display: "flex" }}>
                <label htmlFor="password">
                  {translate?.password}
                  {/* <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  /> */}
                </label>
              </Col>
              <Col span={10}>
                {/* <Controller
                  control={control}
                  {...register("email", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      size="large"
                      name="email"
                      type="text"
                    />
                  )}
                  name="email"
                />
                {errors?.email?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )} */}
                <Input
                  // {...field}
                  id="password"
                  size="large"
                  name="password"
                  type="password"
                  placeholder="***********"
                  disabled={true}
                />
              </Col>
              <Col span={8}>
                <Button onClick={handelOpenModalChangePassword}>Change Password </Button>
              </Col>
            </Row>
            <Row style={{ marginBottom: "1.5rem" }}>
              <Col span={24} style={{display:"flex", justifyContent:"center" , alignItems:"center"}}> 
                <Button type="primary" onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </Col>
              {/* <Col span={14}>
              </Col> */}
            </Row>
          </Col>
          <Col span={5}></Col>
        </Row>
      </form>
    </div>
  );
};

export default Profile;
