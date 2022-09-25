import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Typography,
  Upload,
} from "antd";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { translate } from "../../components/translate/useTranslate";
import { Select } from "antd";
import { SpinLoader } from "../../components/space/spin";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { DELETE_SMTP_CONFIG } from "../../components/reactQuery/mutations/addSmtpConfig";
import { manageErrors } from "../../components/errors/manageErrors";
import { api } from "../../components/reactQuery/axios";
import {
  IMAGES_PATH,
  mediaDownload,
  systemOption,
} from "../../components/reactQuery/constants";
import { UPDATE_SYSTEM_OPTION } from "../../components/reactQuery/mutations/systemOption";
import { groupBySetting } from "../../components/custom/groupBySetting";
import { RcFile } from "antd/lib/upload";
import { readUploadFileAsUrl } from "../../components/fileReader/fileReader";

const { Option } = Select;
const { Title, Text } = Typography;

const GeneralSetting = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [groupByState, setGroupByState] = useState<any>("");
  const [imageUrl, setImageUpload] = useState<any>(null);
  const [urlImageHeaderPost, setUlrImageHeaderPost] = useState<any>("");

  const getSystemOption = async () => {
    try {
      const { data } = await api.get(
        systemOption +
          "?expand=attach&fields=attach.url,attach.id,id,option_label,hint,option_value,option_name,tag"
      );
      return data;
    } catch (error) {
      manageErrors(error, "error");
    }
  };
  const [loadingPage, setLoadingPage] = useState(false);
  const { isLoading, isError, data } = useQuery(
    "systemOption",
    getSystemOption
  );
  if (data) {
    if (imageUrl === null) {
      data?.filter((item: any) => {
        if (item?.optionName === "web_site_logo") {
          setImageUpload(IMAGES_PATH + item?.attach?.url);
        }
      });
    }
    const groupBySettingData = groupBySetting(data, "tag");
    // 

    if (groupByState === "") {
      setGroupByState(groupBySettingData);
    }
  }
  const { mutate: updateSystemOption } = useMutation(UPDATE_SYSTEM_OPTION, {
    onSuccess: (values: any) => {
      const status = values?.data?.status;
      queryClient.invalidateQueries("systemOption");
      setGroupByState("")
      // setModalAddUser(!visibleModalAddUser);
      // setLoadingPage(false);
      manageErrors(
        { code: "" },
        "success",
        "Update system setting is successfully."
      );

      setLoadingPage(false);
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
    
    const variables = [
      {
        optionName: "web_site_logo",
        attach: urlImageHeaderPost?.id,
        optionValue: "gfh ghg",
      },
    ];
    for (let item in data) {
      let newObject = {
        optionName: item,
        optionValue: data[item],
      };
      //@ts-ignore
      variables.push(newObject);
    }
    setLoadingPage(true);
    
    updateSystemOption(variables);
  };

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
  return (
    <div>
      {loadingPage ? <SpinLoader /> : null}

      <Row>
        <Col span={21}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.setting}
          </Title>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            //   icon={<PlusOutlined />}

            onClick={handleSubmit(onSubmit)}
            //   disabled
            style={{ padding: "0 2.5rem" }}
          >
            {translate?.save}
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: "2rem" }}>
        <Col span={24}>
          {
            //@ts-ignore
            <Breadcrumb style={{ margin: "0 0", display: "flex" }}>
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.setting}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.general}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      <div style={{ marginTop: "2rem" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isLoading === false &&
            Object?.keys(groupByState)?.map((items: string) => {
              return (
                <div key={items}>
                  {items === "social address" && (
                    <Row>
                      <Col span={24}>
                        <Title
                          level={4}
                          style={{ display: "flex", marginTop: "2rem" }}
                        >
                          Social Link
                        </Title>
                      </Col>
                    </Row>
                  )}
                  {groupByState?.[items]?.map((item: any) => {
                    setValue(item.optionName, item.optionValue);
                    let nameField = item?.optionName;
                    if (item?.attach) {
                      return (
                        <Row key={item?.id} style={{ marginTop: "1.3rem" }}>
                          <Col
                            span={6}
                            style={{
                              display: "flex",
                              fontSize: "16px",
                              fontWeight: "600",
                              alignItems: "center",
                              paddingBottom: "1rem",
                            }}
                          >
                            {item?.optionLabel}
                          </Col>
                          <Col span={10}>
                            <Upload
                              name="avatar"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              beforeUpload={beforeUpload}
                              multiple={false}
                              // action={(action?:string | RcFile) => {
                              //
                              //   return ""
                              // } }
                              action={async (files: RcFile | string) => {
                                setLoadingPage(true);
                                // setLoaderUploadImageHeaderPost(true);
                                // const file = files?.file?.originFileObj ;

                                const base64 = await readUploadFileAsUrl(files);
                                setImageUpload(base64);
                                try {
                                  const formData = new FormData();
                                  formData.append("file", files);
                                  const urlFile = await api.post(
                                    mediaDownload,
                                    formData,
                                    {
                                      headers: {
                                        "content-type": "multipart/form-data",
                                      },
                                    }
                                  );

                                  setUlrImageHeaderPost(urlFile?.data);
                                  setLoadingPage(false);
                                  // setLoaderUploadImageHeaderPost(false);
                                  // contUploadFile = false;

                                  // if (!contUploadFile)
                                  manageErrors(
                                    { code: "" },
                                    "success",
                                    "Upload successfully."
                                  );
                                  return "" + urlFile?.data?.url;
                                } catch (error) {
                                  manageErrors(error, "error");
                                  setLoadingPage(false);
                                  // setLoaderUploadImageHeaderPost(false);
                                  // contUploadFile = false;

                                  return "";
                                }
                              }}
                              accept={"image/png , image/jpg , image/jpeg"}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="avatar"
                                  style={{ width: "100%", maxHeight:"100%" }}
                                />
                              ) : (
                                imageUrl === null && (
                                  <div>
                                    <span
                                      style={{
                                        display: "grid",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <PlusOutlined />
                                    </span>
                                    <span>{translate?.upload}</span>
                                  </div>
                                )
                              )}
                            </Upload>
                            {
                              <Text
                                type="secondary"
                                style={{ display: "flex" }}
                              >
                                {item?.hint}
                              </Text>
                            }
                            {errors?.[nameField]?.type === "required" && (
                              <Text type="danger" style={{ display: "flex" }}>
                                {translate?.requiredInput}
                              </Text>
                            )}
                          </Col>
                        </Row>
                      );
                    } else
                      return (
                        <Row key={item?.id} style={{ marginTop: "1.3rem" }}>
                          <Col
                            span={6}
                            style={{
                              display: "flex",
                              fontSize: "16px",
                              fontWeight: "600",
                              alignItems: "center",
                              paddingBottom: "1rem",
                            }}
                          >
                            {item?.optionLabel}
                          </Col>
                          <Col span={10}>
                            <Controller
                              control={control}
                              {...register(item?.optionName, {
                                required: true,
                              })}
                              defaultValue={item?.optionValue}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id={item?.optionName}
                                  size="large"
                                  name={item?.optionName}
                                  type="text"
                                  defaultValue={item?.optionValue}
                                />
                              )}
                              name={item?.optionName}
                            />
                            {
                              <Text
                                type="secondary"
                                style={{ display: "flex" }}
                              >
                                {item?.hint}
                              </Text>
                            }
                            {errors?.[nameField]?.type === "required" && (
                              <Text type="danger" style={{ display: "flex" }}>
                                {translate?.requiredInput}
                              </Text>
                            )}
                          </Col>
                        </Row>
                      );
                  })}
                </div>
              );
            })}
          {/* <Row>
            <Col span={24}>
              <Title level={4} style={{ display: "flex", marginTop: "2rem" }}>
                Social Link
              </Title>
            </Col>
          </Row> */}
          {/* {isLoading === false &&
            data?.map((item: any) => {
                let nameField = item?.optionName
              setValue(item.optionName, item.optionValue);

              if (item?.tag === "social address")
                return (
                  <Row key={item?.id} style={{ marginTop: "1.3rem" }}>
                    <Col
                      span={6}
                      style={{
                        display: "flex",
                        fontSize: "16px",
                        fontWeight: "600",
                        alignItems: "center",
                        paddingBottom: "1rem",
                      }}
                    >
                      {item?.optionLabel}
                    </Col>
                    <Col span={10}>
                      <Controller
                        control={control}
                        defaultValue={item?.optionValue}
                        {...register(item?.optionName, { required: true })}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id={item?.optionName}
                            size="large"
                            name={item?.optionName}
                            type="text"
                            defaultValue={item?.optionValue}
                          />
                        )}
                        name={item?.optionName}
                      />
                      {
                        <Text type="secondary" style={{ display: "flex" }}>
                          {item?.hint}
                        </Text>
                      }
                      {errors?.[nameField]?.type === "required" && (
                        <Text type="danger" style={{ display: "flex" }}>
                          {translate?.requiredInput}
                        </Text>
                      )}
                    </Col>
                  </Row>
                );
            })} */}
        </form>
      </div>
    </div>
  );
};

export default GeneralSetting;
