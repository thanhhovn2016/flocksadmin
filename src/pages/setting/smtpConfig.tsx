
import {
  MoreOutlined,
  PlusOutlined,
  
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Table,
  Typography,
} from "antd";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import {translate} from "../../components/translate/useTranslate";
import { Select } from 'antd';
import { SpinLoader } from "../../components/space/spin";
import { api } from "../../components/reactQuery/axios";
import { emailServer } from "../../components/reactQuery/constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ADD_SMTP_CONFIG, DELETE_SMTP_CONFIG, UPDATE_SMTP_CONFIG } from "../../components/reactQuery/mutations/addSmtpConfig";
import { manageErrors } from "../../components/errors/manageErrors";
import { ActionTable } from "../../components/actionTable/actionTable";

const { Option } = Select;
const { Title, Text } = Typography;

const SmtpConfig = () => {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm();
const [update , setUpdate] = useState(false)
  const {
    mutate: deleteSmtpConfigFunction,
  } = useMutation(DELETE_SMTP_CONFIG, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("smtpConfig")
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
  
  const handleActionTable = (row:any, actionType:string) => {
    
    
    //if actionType === 'Update' ==> true 
    //TODO open modal to update row and add default value to form
    if (actionType === "Update"){
      // host:data?.host,
      // port:parseInt(data?.port),
      // hostUser:data?.hostUser,
      // hostPassword:data?.hostPassword,
      // usedFor:data?.usedFor,
      // default:true
     setValue("host" , row?.host)
     setValue("port", row?.port)
     setValue("hostUser",row?.hostUser)
     setValue("hostPassword", row?.hostPassword)
     setValue("id" , row?.id)
     setUpdate(true)
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
      render:(indexOf:number , row:any , index:number) => {
        return(
          <span>{ ((investmentState?.page - 1) * investmentState?.page_size) + (index + 1) }</span>
        )
      }
    },
    {
      title: translate?.provider,
      dataIndex: "host",
      key: "host",
    },
    {
      title: translate?.email,
      dataIndex: "hostUser",
      key: "hostUser",
    },
    {
      title: translate?.password,
      dataIndex: "password",
      key: "password",
      render : () => ( <span>*********</span>)
    },

    {
      title: translate?.context,
      dataIndex: "usedFor",
      key: "usedFor",
    },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: (data: any, row: any) => {
        return (
          <Row>
            {/* <MoreOutlined /> */}
            <ActionTable actions={["Delete" , "Update"]} getActionFunction={handleActionTable} row={row}/>
          </Row>
        );
      },
    },
  ];
  const [visibleModalAddUser, setModalAddUser] = useState(false);

  const [loadingPage, setLoadingPage] = useState(false);

  const [investmentState, setInvestmentState] = useState({
    next: 0,
    prev: 0,
    page: 1,
    page_size: 10,
    investment: [],
    search: "",
  });

  const getInvestmentData = async () => {
    const { data } = await api.get(
      emailServer +
        `?page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("smtpConfig", getInvestmentData);
  

  const handelOpenModalUserManagement = () => {
    setModalAddUser(!visibleModalAddUser);
    setValue("id" , null)
    setValue("host" , "")
     setValue("port", "")
     setValue("hostUser","")
     setValue("hostPassword", "")
  
    
    setUpdate(false)
  };


  

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
} = useMutation(ADD_SMTP_CONFIG, {
  onSuccess: (values: any) => {
    queryClient.invalidateQueries("smtpConfig")
    const status = values?.data?.status;
    
   
   setLoadingPage(true);
   setModalAddUser(!visibleModalAddUser);
   setLoadingPage(false)
   manageErrors({code:""} , "success" , "Your request is successfully." )
    if (status === 200) {
      // message.success(values?.data?.message);
      // history.push("/");
    } else {
      // manageServeErrors(values);
    }
  },
  onError: (error) => {
    setLoadingPage(false)
    manageErrors(error, "error");

  },
})

const {
  mutate: updateSMTPConfigFunction,
  
} = useMutation(UPDATE_SMTP_CONFIG, {
  onSuccess: (values: any) => {
    queryClient.invalidateQueries("smtpConfig")
    const status = values?.data?.status;
    
   
   setLoadingPage(true);
   setModalAddUser(!visibleModalAddUser);
   setLoadingPage(false)
   manageErrors({code:""} , "success" , "Your request is successfully." )
    if (status === 200) {
      // message.success(values?.data?.message);
      // history.push("/");
    } else {
      // manageServeErrors(values);
    }
  },
  onError: (error) => {
    setLoadingPage(false)
    manageErrors(error, "error");

  },
})
  const onSubmit = (data: any) => {
    setLoadingPage(true)
    
    
if (data?.id){
  const variables = {
    useTls : data?.security === "1" ? true : false,
    useSsl:data?.security === "2" ? true : false,
    host:data?.host,
    port:parseInt(data?.port),
    hostUser:data?.hostUser,
    hostPassword:data?.hostPassword,
    default:true, //TODO this is should fixed 
    id:data?.id
  }
  updateSMTPConfigFunction(variables)
}else{
  const variables = {
    useTls : data?.security === "1" ? true : false,
    useSsl:data?.security === "2" ? true : false,
    host:data?.host,
    port:parseInt(data?.port),
    hostUser:data?.hostUser,
    hostPassword:data?.hostPassword,
    usedFor:data?.usedFor,
    default:true //TODO this is should fixed 
  }
  
 
  createSMTPConfigFunction(variables)

}
  }

  return (
    <div>
       {loadingPage || isLoading ? <SpinLoader /> : null }
       {
         //@ts-ignore
         <Modal
        visible={visibleModalAddUser}
        title={translate?.addAdmin}
        //   onOk={this.handleOk}
        onCancel={handelOpenModalUserManagement}
        footer={[
          <Button type="primary" 
          onClick={handleSubmit(onSubmit)}
          // onClick={handleClickFunction}
          
          >
            {translate?.save}
          </Button>,
        ]}
        
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
            <Col span={16}>
              <label htmlFor="host">
                {translate?.host}{" "}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9e9e9e",
                    marginLeft: "5px",
                  }}
                >
                  {translate?.hostExample}
                </span>
              </label>
              <Controller
                control={control}
                {...register("host", { required: true })}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="host"
                    size="large"
                    name="host"
                    type="text"
                  />
                )}
                name="host"
              />
              {errors?.host?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <label htmlFor="port">
                {translate?.port}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9e9e9e",
                    marginLeft: "5px",
                  }}
                >
                  {translate?.portExample}
                </span>
              </label>
              <Controller
                control={control}
                {...register("port", { required: true })}
                render={({ field }) => (
                  <Input
                    id="port"
                    size="large"
                    {...field}
                    name="port"
                    type="number"
                  />
                )}
                name="port"
              />
              {errors?.port?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
          <Row style={{ margin: "0.5rem 0" }}>
            <Col span={16}>
              <label htmlFor="hostUser">
                {translate?.email}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9e9e9e",
                    marginLeft: "5px",
                  }}
                >
                  {translate?.hostUserExample}
                </span>
              </label>

              <Controller
                control={control}
                {...register("hostUser", { required: true })}
                render={({ field }) => (
                  <Input
                    id="hostUser"
                    size="large"
                    {...field}
                    name="hostUser"
                    type="email"
                  />
                )}
                name="hostUser"
              />
              {errors?.hostUser?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
          <Row style={{ margin: "0.5rem 0" }}>
            <Col span={16}>
              <label htmlFor="hostPassword">
                {translate?.email} {translate?.password}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9e9e9e",
                    marginLeft: "5px",
                  }}
                >
                  {translate?.hostPasswordExample}
                </span>
              </label>

              <Controller
                control={control}
                {...register("hostPassword", { required: true })}
                render={({ field }) => (
                  <Input
                    id="hostPassword"
                    size="large"
                    {...field}
                    name="hostPassword"
                    type="password"
                  />
                )}
                name="hostPassword"
              />
              {errors?.hostPassword?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
          {/* <Row style={{ margin: "0.5rem 0" }}>
            <Col span={16}>
              <label htmlFor="usedFor">
                {translate?.usedFor}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9e9e9e",
                    marginLeft: "5px",
                  }}
                >
                  {translate?.usedForExample}
                </span>
              </label>
              <Controller
                control={control}
                {...register("usedFor", { required: true })}
                render={({ field }) => (
                  <Input
                    id="usedFor"
                    size="large"
                    {...field}
                    name="usedFor"
                    type="text"
                  />
                )}
                name="usedFor"
              />
              {errors?.usedFor?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row> */}
          <Row style={{ margin: "0.5rem 0" }}>
            <Col span={16}>
              <label htmlFor="security" style={{display:"grid"}}>{translate?.security}</label>
               <Controller
                control={control}
                {...register("security", { required: true })}
                render={({ field }) => (
                  <Select
                  size="large"
                  defaultValue="Use Tls"
                  // onChange={handleChange}
                  style={{ width: "100%" , border:"none", backgroundColor:"#cececef7"}}
                  {...field}
                  
                >
                  <Option key="1">Use Tls</Option>
                  <Option key="2">Use Ssl</Option>
                </Select>
                  
                )}
                name="security"
              /> 
              {errors?.security?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
         { update === false && <Row style={{ margin: "0.5rem 0" }}>
            <Col span={16}>
              <label htmlFor="UsedFor" style={{display:"grid"}}>{translate?.usedFor}</label>
               <Controller
                control={control}
                {...register("usedFor", { required: true })}
                render={({ field }) => (
                  <Select
                  size="large"
                  defaultValue="confirm_mail"
                  // onChange={handleChange}
                  style={{ width: "100%" , border:"none", backgroundColor:"#cececef7"}}
                  {...field}
                  
                >
                  <Option key="confirm_mail">Confirm Email</Option>
                  <Option key="reset_password">Reset Password</Option>
                  <Option key="alternate_email">Alternate Email</Option>
                </Select>
                  
                )}
                name="usedFor"
              /> 
              {errors?.usedFor?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>}
          
          
        </form>
      </Modal> }
      <Row>
        <Col span={21}>
          
          <Title level={4} style={{display:"flex"}}>{translate?.setting}</Title>
        </Col>
        <Col span={3}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // style={{
            //   background: "#393E65",
            //   borderColor: "#393E65",
            // }}
            onClick={handelOpenModalUserManagement}
            // disabled
            
          >
            {translate?.addSmtp}
          </Button>
        </Col>
      </Row>
      <Row style={{ marginBottom: "2rem" }}>
        <Col span={24}>
          {
            //@ts-ignore
            <Breadcrumb style={{ margin: "0 0" , display:"flex"}}>
            {
            //@ts-ignore
            <Breadcrumb.Item>{translate?.setting}</Breadcrumb.Item>}
            { 
            //@ts-ignore
            <Breadcrumb.Item>{translate?.smtp_config}</Breadcrumb.Item>}
          </Breadcrumb>}
        </Col>
      </Row>
      <Table dataSource={data?.results} columns={columns}
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

export default SmtpConfig;
