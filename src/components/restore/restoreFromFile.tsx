import {
  Button,
  Col,
  Input,
  Modal,
  Row,
  Typography,
  Steps,
  Upload,
  message,
} from "antd";
import { translate } from "../translate/useTranslate";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import {
  RESTORE_BACKUP,
  RESTORE_FROM_FILE,
  VALIDATE_CREDENTIAL,
} from "../reactQuery/mutations/backup";
import { manageErrors } from "../errors/manageErrors";
import { SpinLoader } from "../space/spin";
import { RcFile } from "antd/lib/upload";

const { Text } = Typography;
const { Step } = Steps;
const RestoreFromFile = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [currentStep, steCurrentStep] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [visibleModalRestoreFile, setVisibleModalRestoreFile] = useState(false);
  const [dbFile, setDbFile] = useState<any>(null);
  const [mediaFile, setMediaFile] = useState(null);
  const handelOpenModalRestore = () => {
    setVisibleModalRestoreFile(!visibleModalRestoreFile);
  };

  const { mutate: validateCredential } = useMutation(VALIDATE_CREDENTIAL, {
    onSuccess: (values: any) => {
      const status = values?.data?.status;
      
      if (values?.data) {
        manageErrors(
          { code: "" },
          "success",
          "Validate credential successfully."
        );
        steCurrentStep(2);
      } else {
        message.error("Wrong credentials.");
      }
      // setLoadingPage(true);
      // setVisibleModalRestore(!visibleModalRestore)
      setLoadingPage(false);
    },
    onError: (error) => {
      //   setVisibleModalRestore(!visibleModalRestore)
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });

  const onSubmitValidateCredential = (data: any) => {
    
    // steCurrentStep(2)
    setLoadingPage(true);
    validateCredential(data);
  };

  const handleChangeUploadFunction = (file: any) => {
    
    setDbFile(file?.file?.originFileObj);
  };
  const handleChangeUploadMediaFileFunction = (file: any) => {
    setMediaFile(file?.file?.originFileObj);
  };

  const { mutate: restoreFromFile } = useMutation(RESTORE_FROM_FILE, {
    onSuccess: (values: any) => {
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Restore is successfully.");
      // setLoadingPage(true);
      // steCurrentStep(2)
      handelOpenModalRestore();
      // setVisibleModalRestore(!visibleModalRestore)
      setLoadingPage(false);
    },
    onError: (error) => {
      //   setVisibleModalRestore(!visibleModalRestore)
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });

  const onSubmitRestoreBackup = (data: any) => {
    setLoadingPage(true)
    const variables = {
      ...data,
      file: dbFile,
      mediaFile: mediaFile,
    };
    
    restoreFromFile(variables);
  };
  return (
    <div>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalRestoreFile}
          title={translate?.restore}
          onCancel={handelOpenModalRestore}
          footer={[
            <span>
              {currentStep === 1 ? (
                <Button
                  type="primary"
                  onClick={handleSubmit(onSubmitValidateCredential)}
                >
                  {translate?.verifications}
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit(onSubmitRestoreBackup)}
                >
                  {translate?.restore}
                </Button>
              )}
            </span>,
          ]}
        >
          {
            //@ts-ignore
            <Steps current={currentStep}>
              <Step
                status={currentStep === 1 ? "process" : "finish"}
                title="Verification"
              />
              <Step
                status={currentStep === 1 ? "wait" : "process"}
                title="Upload File"
                //   icon={<SolutionOutlined />}
              />
              {/* <Step status="process" title="Pay" icon={<LoadingOutlined />} /> */}
              {/* <Step status="wait" title="Done" icon={<SmileOutlined />} /> */}
            </Steps>
          }
          {currentStep === 1 && (
            <form onSubmit={handleSubmit(onSubmitRestoreBackup)}>
              <Row>
                <Col span={24} style={{ marginTop: "2rem" }}>
                  <label htmlFor="username">{translate?.email}</label>
                  <Controller
                    control={control}
                    {...register("username", { required: true })}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="username"
                        size="large"
                        name="username"
                        type="email"
                      />
                    )}
                    name="username"
                  />
                  {errors?.userName?.type === "required" && (
                    <Text type="danger">{translate?.requiredInput}</Text>
                  )}
                </Col>
                <Col span={24} style={{ marginTop: "1rem" }}>
                  <label htmlFor="password">{translate?.password}</label>
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
            </form>
          )}
          {currentStep === 2 && (
            <Row style={{ margin: "2rem 0 " }}>
              <Col span={12}>
                <Upload
                  // {...props}
                  name="file"
                  action={(files:RcFile | string) => {
                    
                    setDbFile(files);
                    return ""
                  }}
                  accept={".psql, .zip "}
                  // onChange={handleChangeUploadFunction}
                  // action= {'https://www.mocky.io/v2/5cc8019d300000980a055e76'}
                  // defaultFileList={
                  //  [ {
                  //     uid: 'xxxx.zip',
                  //     name: 'sdf.pso',
                  //     status: 'done',
                  //     response: 'Server Error 500', // custom error message to show
                  //     url: 'http://www.baidu.com/xxx.png',
                  //   },]
                  // }
                  // progress={
                  //   ""
                  // }
                >
                  <Button icon={<UploadOutlined />}>Db File</Button>
                </Upload>
              </Col>
              <Col span={12}>
                <Upload
                  // {...props}
                  name="file"
                  accept={".psql, .zip"}
                  onChange={handleChangeUploadMediaFileFunction}
                >
                  <Button icon={<UploadOutlined />}>Media File</Button>
                </Upload>
              </Col>
            </Row>
          )}
        </Modal>
      }
      <Button
        type="primary"
        // icon={<PlusOutlined />}

        onClick={handelOpenModalRestore}
        // disabled
      >
        {translate?.restoreFromFile}
      </Button>
    </div>
  );
};

export default RestoreFromFile;
