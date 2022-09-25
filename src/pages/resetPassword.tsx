import { Button, Col, Input, message, Row , Typography} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { manageErrors } from "../components/errors/manageErrors";
import { api } from "../components/reactQuery/axios";
import { resetEmailConfirmCode, tokenCustomVerify } from "../components/reactQuery/constants";
import { SpinLoader } from "../components/space/spin";
import { translate } from "../components/translate/useTranslate";

const {Title , Text} = Typography
const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm();
  const [tokenValidateState, setTokenValidateState] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const token = location?.search?.slice(7);

  useEffect(() => {
    if (token) {
      tokenIsValidate();
    }
    //   return () => {
    //   }
  }, [token]);

  const tokenIsValidate = async () => {
    try {
      const variables = {
        token: token,
      };

      const isValidate: any = await api.post(tokenCustomVerify, variables);

      if (isValidate?.data?.tokenType === "email_reset_password") {
        setTokenValidateState(true);
      } else {
        message.error("Oops!: your Token is invalid!.");
      }
      setLoadingPage(false);
    } catch (error: any) {
      setLoadingPage(false);
      manageErrors(error, "error");
    }
  };

  const onSubmit = async (data: any) => {
    setLoadingPage(true);
    
    const variables = {
      ...data,
      token:token
    };
    try{

        const newPassword = await api.post(resetEmailConfirmCode , variables)
            
        if (newPassword?.status === 200){
            // setNotification({
            //     show:true,
            //     type:'success',
            //     message:t?.yourPasswordHasBeen
            // })
            message.success("Change password is successfully!.")
            navigate("/")
        }
    }catch(error){
        manageErrors(error , "error")
    }

    // setFullLoader(false)

    // 
    // handleLoginUser(variables);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(180deg, #090F71 -172.21%, #0B091F 100%)",
      }}
    >
      {false && <SpinLoader />}
      <Row style={{ paddingTop: "10vh" }}>
        <Col span={7}></Col>
        <Col span={10}>
          <div
            style={{
              backgroundColor: "#151542",
              padding: "3rem 6rem",
              borderRadius: "1rem",
              color: "#FFF",
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
                <img
                  src="/assets/images/logo.png"
                  alt="logo"
                  style={{ height: "10rem" }}
                />
              </div>
            </Row>
            <Row style={{ margin: "1rem 0" }}>
             
              <Col span={24} style={{display:"grid", justifyContent:"center"}}>
                <Title level={4} style={{ color: "#FFF" }}>
                  {/* {translate?.login} */}
                  Reset Password
                </Title>
              </Col>
            </Row>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <Row style={{ marginBottom: "1rem" }}>
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
              </Row> */}
              <Row style={{ marginBottom: "1rem" }}>
                <Col span={24}>
                  <label
                    htmlFor="password"
                    style={{ display: "grid", justifyContent: "start" }}
                  >
                    {/* {translate?.password} */}
                    New Password
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
              </Row>

              <div style={{ display: "grid", width: "100%", margin: "2rem 0" }}>
                <Button
                  type="primary"
                  onClick={handleSubmit(onSubmit)}
                  style={{
                    // background: "#25AAE1",
                    height: "2.5rem",
                    borderRadius: "10px",
                  }}
                >
                  {" "}
                  {translate?.login}
                </Button>
              </div>

              <div
                style={{
                  display: "grid",
                  justifyContent: "center",
                  margin: "1.5rem",
                }}
              >
                {/* <Link to="/">{translate?.forgotPassword}</Link> */}
              </div>
            </form>
          </div>
        </Col>
        <Col span={7}></Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
