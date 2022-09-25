import {
  DownloadOutlined,
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  GoogleOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Image,
  Input,
  Menu,
  Modal,
  Row,
  Space,
  Table,
  Typography,
} from "antd";

import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { translate } from "../../components/translate/useTranslate";
import { Select } from "antd";
import Google from "../../components/socialIcon/google";
import Facebook from "../../components/socialIcon/facebook";
import Twitter from "../../components/socialIcon/twitter";
import { api } from "../../components/reactQuery/axios";
import { socialApp } from "../../components/reactQuery/constants";
import { useMutation, useQuery , useQueryClient} from "react-query";
import { SpinLoader } from "../../components/space/spin";
import { manageErrors } from "../../components/errors/manageErrors";
import { ADD_SOCIAL_APPS, DELETE_SOCIAL_APPS, UPDATE_SOCIAL_APPS } from "../../components/reactQuery/mutations/addSmtpConfig";
import DropdownButton from "antd/lib/dropdown/dropdown-button";
import { ActionTable } from "../../components/actionTable/actionTable";

const { Option } = Select;
const { Title, Text } = Typography;

const SocialApps = () => {
  const queryClient = useQueryClient()
  // const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue 
  } = useForm();
  const [selectProviderState, setSelectProviderState] = useState("google");

  const [loadingPage, setLoadingPage] = useState(true);

  const [investmentState, setInvestmentState] = useState({
    next: 0,
    prev: 0,
    page: 1,
    page_size: 10,
    investment: [],
    search: "",
  });

  const [update , setUpdate] = useState(false)

  const getInvestmentData = async () => {
    const { data } = await api.get(
      socialApp +
        `?page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("socialApp", getInvestmentData,{
    refetchOnWindowFocus:false,
    enabled:loadingPage
  });

  const {
    mutate: deleteSmtpConfigFunction,
  } = useMutation(DELETE_SOCIAL_APPS, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("socialApp")
      const status = values?.data?.status;

      // setModalAddUser(!visibleModalAddUser);
      // setLoadingPage(false);
      manageErrors({ code: "" }, "success", "Your request is successfully.");
      
      setLoadingPage(true);
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      manageErrors(error, "error");
    },
  });
  
  const {
    mutate: handleUpdateSmtpConfig,
  } = useMutation(UPDATE_SOCIAL_APPS, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("socialApp")
      const status = values?.data?.status;

      // setModalAddUser(!visibleModalAddUser);
      // setLoadingPage(false);
      manageErrors({ code: "" }, "success", "Your request is successfully.");
      
      setLoadingPage(true);
      setModalAddUser(!visibleModalAddUser);
      setUpdate(false)
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      setModalAddUser(!visibleModalAddUser);
      manageErrors(error, "error");
    },
  });

  const handleActionTable = (row:any, actionType:string) => {
    
  
    //if actionType === 'Update' ==> true 
    //TODO open modal to update row and add default value to form
    if (actionType === "Update"){
      setUpdate(true)
      setValue("id",row?.id)
      setValue("clientId",row?.clientId)
      setValue("clientSecret", row?.clientSecret)
      setSelectProviderState(row?.provider)
      setModalAddUser(!visibleModalAddUser)
    }

    //if actionType === 'Delete' ==> true
    //TODO delete row in server and query all new data ===> done
    if (actionType === "Delete"){
      deleteSmtpConfigFunction(row?.id)
    }

  }
  const columns = [
    {
      title: translate?.number,
      dataIndex: "number",
      key: "number",
      render: (indexOf: number, row: any, index: number) => {
        return (
          <span>
            {(investmentState?.page - 1) * investmentState?.page_size +
              (index + 1)}
          </span>
        );
      },
    },
    {
      title: translate?.provider,
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: translate?.clientId,
      dataIndex: "clientId",
      key: "clientId",
    },
    {
      title: translate?.clientSecret,
      dataIndex: "clientSecret",
      key: "clientSecret",
      render: () => <span>********</span>,
    },

    // {
    //   title: translate?.scope,
    //   dataIndex: "scope",
    //   key: "scope",
    // },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: (data: any, row: any) => {
        return (
          <Row>
            {/* <MoreOutlined /> */}
            <ActionTable actions={[ "Update"]} getActionFunction={handleActionTable} row={row}/>
          </Row>
        );
      },
    },
  ];
  const [visibleModalAddUser, setModalAddUser] = useState(false);

  const handelOpenModalUserManagement = () => {
    setModalAddUser(!visibleModalAddUser);
    setUpdate(false)
    setValue("clientId","")
    setValue("clientSecret" , "")
    setValue("id", null)
  };

  function onChange(value: any) {}

  const handleSelectProvider = (event: React.MouseEvent<HTMLButtonElement>) => {
    //
    setSelectProviderState(event?.currentTarget?.id);
  };

  //   function onSearch(val) {
  //
  //   }

  const onChangePagination = (event: any) => {
    setLoadingPage(true);

    setInvestmentState((prevState) => ({
      ...prevState,
      page: event?.current,
      page_size: event?.pageSize,
    }));
  };

  const {
    mutate: createSMTPConfigFunction,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(ADD_SOCIAL_APPS, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("socialApp")
      const status = values?.data?.status;

      setModalAddUser(!visibleModalAddUser);
      setLoadingPage(false);
      manageErrors({ code: "" }, "success", "Your request is successfully.");
      
      setLoadingPage(true);
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      manageErrors(error, "error");
    },
  });
  const onSubmit = (data: any) => {
    
    setLoadingPage(true);
    // 
    //if data?.id === true i should update the row
    //else i should create new row

    if (update){
      
      const variables = {
        ...data,
        provider: selectProviderState,
      };
     
      handleUpdateSmtpConfig(variables);
    }else{
      // "client_id": "aliquip",
      // "client_secret": "magna amet",
      // "provider": "facebook"
  
      const variables = {
        ...data,
        provider: selectProviderState,
      };
     
      createSMTPConfigFunction(variables);
    }
    
  };
  

  return (
    <div>
      {loadingPage ? <SpinLoader /> : null }
      {
        //@ts-ignore
        <Modal
          visible={visibleModalAddUser}
          title={translate?.addSocialApps}
          onCancel={handelOpenModalUserManagement}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
         { update === false && <Row>
            <Col span={24}>
              <label htmlFor="">{translate?.provider}</label>
            </Col>
            <Col>
              <Button
                type={selectProviderState === "google" ? "primary" : "default"}
                style={{
                  width: "71px",
                  height: "71px",
                  borderRadius: "8px",
                  marginLeft: "5px",
                }}
                onClick={handleSelectProvider}
                id="google"
              >
                <Google />
              </Button>
              <Button
                type={
                  selectProviderState === "facebook" ? "primary" : "default"
                }
                style={{
                  width: "71px",
                  height: "71px",
                  borderRadius: "8px",
                  marginLeft: "5px",
                }}
                onClick={handleSelectProvider}
                id="facebook"
              >
                <Facebook />
              </Button>
              <Button
                type={selectProviderState === "twitter" ? "primary" : "default"}
                style={{
                  width: "71px",
                  height: "71px",
                  borderRadius: "8px",
                  marginLeft: "5px",
                }}
                onClick={handleSelectProvider}
                id="twitter"
              >
                <TwitterOutlined
                  style={{
                    fontSize: "2.5rem",
                    color:
                      selectProviderState === "twitter" ? "#FFF" : "#03A9F4",
                  }}
                />
              </Button>
            </Col>
          </Row>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={16}>
                <label htmlFor="clientId">{translate?.clientId} </label>
                <Controller
                  control={control}
                  {...register("clientId", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="clientId"
                      size="large"
                      name="clientId"
                      type="text"
                    />
                  )}
                  name="clientId"
                />
                {errors?.clientId?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <label htmlFor="clientSecret">{translate?.clientSecret}</label>
                <Controller
                  control={control}
                  {...register("clientSecret", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="clientSecret"
                      size="large"
                      {...field}
                      name="clientSecret"
                      type="text"
                    />
                  )}
                  name="clientSecret"
                />
                {errors?.clientSecret?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }
      <Row>
        <Col span={20}>
          {/* <Space prefixCls="2rem">Investors</Space> */}
          <Title level={4} style={{ display: "flex" }}>
            {translate?.setting}
          </Title>
        </Col>
        <Col span={4}>
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            // style={{
            //   background: "#393E65",
            //   borderColor: "#393E65",
            // }}
            onClick={handelOpenModalUserManagement}
            // disabled
          >
            {translate?.addSocialApps}
          </Button> */}
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
                <Breadcrumb.Item>{translate?.social_apps}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      {/* <Row style={{ margin: "0 0 1rem 0 " }}>
            <Col span={14}></Col>
            <Col span={8}>
              <Input placeholder={translate?.search} prefix={<SearchOutlined />} />
            </Col>
            <Col span={2}>
              <Button
                type="default"
                shape="default"
                icon={<FilterOutlined />}
                size={"middle"}
                style={{ borderRadius: "7px", marginLeft: "5px" }}
              >
                {translate?.filter}
              </Button>
            </Col>
          </Row> */}
      <Table
        dataSource={data?.results}
        columns={columns}
        onChange={onChangePagination}
        pagination={{
          current: investmentState?.page,
          locale: {
            page: "1",
          },
          // pageSizeOptions:['1', '2'],
          pageSize: investmentState?.page_size,
          // showQuickJumper: true,
          totalBoundaryShowSizeChanger: 1,
          responsive: true,
          total: data?.count,
        }}
      />
    </div>
  );
};

export default SocialApps;
