import { Button, Col, Input, Row, Space, Spin, Typography } from "antd";
import { Link, useNavigate   } from "react-router-dom";


// import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { accessToken, refreshToken, resetPassword } from "../components/reactQuery/constants";
import { LOGIN_DASHBOARD } from "../components/reactQuery/mutations/loginDashboard";
import { translate } from "../components/translate/useTranslate";
import { useStore, userLoginStore } from "../components/zustand/store";
import { manageErrors } from "../components/errors/manageErrors";
import { SpinLoader } from "../components/space/spin";
import { useState } from "react";
import { api } from "../components/reactQuery/axios";

const { Title, Text } = Typography;

const Login = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();

  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();
  const [showLoader, setShowLoader] = useState(false);
  const addUser = useStore((state) => state?.setUser);
  const setIsLogin = userLoginStore((state) => state?.setIsLogin);
  const [resetPasswordState , setResetPasswordState] = useState(false)
  const [showMessageWeSendALinkToEmail , setShowMessageSendALinkToEmail] = useState(false)

  const {
    mutate: handleLoginUser,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(LOGIN_DASHBOARD, {
    onSuccess: (values: any) => {
      navigate('/')
      const status = values?.data?.status;
      
      addUser(values?.data?.userDetails);
      setIsLogin(true);
      localStorage?.setItem(accessToken, values?.data?.accessToken);
      localStorage?.setItem(refreshToken, values?.data?.refreshToken);
      setShowLoader(false);
      // router?.push('/')
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      // 
      setShowLoader(false);
      manageErrors(error, "error");
      // manageNetworkError(error);
    },
  });

  const onSubmit = async (data: any) => {
    setShowLoader(true);
    if (resetPasswordState){
      const variables = {
        email:data?.email
      }
      const dataResetPassword = await api.post(resetPassword,variables)
      
      if (dataResetPassword?.status === 200){
        setShowLoader(false)
        setShowMessageSendALinkToEmail(true)

      }
    }else{
      const variables = {
        ...data,
      };
      // 
      handleLoginUser(variables);

    }
  };
  const handleChangePasswordFunction = () => {
    setResetPasswordState(!resetPasswordState)
  }
  return (
    <div
      style={{ width: "100vw", height: "100vh", background: "linear-gradient(180deg, #090F71 -172.21%, #0B091F 100%)"}}
    >
      {showLoader && <SpinLoader />}
      <Row style={{ paddingTop: "10vh" }}>
        <Col span={7}></Col>
        <Col span={10}>
          <div
            style={{
              backgroundColor: "#151542",
              padding: "3rem 6rem",
              borderRadius: "1rem",
              color:"#FFF"
            }}
          >
            <Row>
              <div
                style={{
                  display: "grid",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <img src="/assets/images/logo.png" alt="logo" style={{height:"10rem"}} />
              </div>
            </Row>
            {showMessageWeSendALinkToEmail && <Row style={{marginTop:"3rem"}}>
              <Col span={24}>
              <Title level={4} style={{color:"#FFF"}}>We sended a link for Reset Password. Please confirm your Email!</Title>
              </Col>
            </Row>}
            {showMessageWeSendALinkToEmail === false && <Row style={{ margin: "1rem 0" }}>
              <Col span={11}></Col>
              <Col span={"auto"}>
                { resetPasswordState ? <Title level={4} style={{color:"#FFF"}}>Enter your Email to reset password!</Title> :<Title level={4} style={{color:"#FFF"}}>{translate?.login}</Title>}
              </Col>
            </Row>}
            <form onSubmit={handleSubmit(onSubmit)}>
              {showMessageWeSendALinkToEmail === false && <Row style={{ marginBottom: "1rem" }}>
                <Col span={24}>
                  <label
                    htmlFor="email"
                    style={{ display: "grid", justifyContent: "start" }}
                  >
                    {translate?.email}
                  </label>
                  <Controller
                    control={control}
                    {...register("email", { required: true })}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="email"
                        size="large"
                        name="email"
                        type="email"
                      />
                    )}
                    name="email"
                  />
                  {errors?.email?.type === "required" && (
                    <Text type="danger">{translate?.requiredInput}</Text>
                  )}
                </Col>
              </Row>}
              {resetPasswordState === false && <Row style={{ marginBottom: "1rem" }}>
                <Col span={24}>
                  <label
                    htmlFor="password"
                    style={{ display: "grid", justifyContent: "start" }}
                  >
                    {translate?.password}
                  </label>
                  <Controller
                    control={control}
                    {...register("password", { required: true })}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="password"
                        size="large"
                        name="password"
                        type="password"
                      />
                    )}
                    name="password"
                  />
                  {errors?.password?.type === "required" && (
                    <Text type="danger">{translate?.requiredInput}</Text>
                  )}
                </Col>
              </Row>}

              {showMessageWeSendALinkToEmail === false && <div style={{ display: "grid", width: "100%", margin: "2rem 0" }}>
                <Button
                  type="primary"
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    // background: "#25AAE1",
                    height: "2.5rem",
                    borderRadius: "3px",
                  }}
                >
                  {" "}
                  {translate?.login}
                </Button>
              </div>}

              { showMessageWeSendALinkToEmail === false && <div
                style={{
                  display: "grid",
                  justifyContent: "center",
                  margin: "1.5rem",
                }}
              >
               { resetPasswordState  ? <Link to="#" onClick={handleChangePasswordFunction}>Sign in</Link> : <Link to="#" onClick={handleChangePasswordFunction}>{translate?.forgotPassword}</Link>}
              </div>}
            </form>
          </div>
        </Col>
        <Col span={7}></Col>
      </Row>
    </div>
  );
};

export default Login;
