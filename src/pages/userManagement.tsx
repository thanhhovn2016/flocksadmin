import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarFilled,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Image,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { translate } from "../components/translate/useTranslate";
import { api } from "../components/reactQuery/axios";
import {
  addUserDashboard,
  IMAGES_PATH,
  usersList,
} from "../components/reactQuery/constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { SpinLoader } from "../components/space/spin";
import { useDebouncedSearch } from "../components/debounce/debounce";
import Moment from "react-moment";
import { manageErrors } from "../components/errors/manageErrors";
import {
  CHANGE_PASSWORD,
  CREATE_USER_DASHBOARD,
  DELETE_USER_MANAGEMENT,
  UPDATE_ACTIVE_DE_ACTIVE_USER_MANAGEMENT,
  UPDATE_USER_MANAGEMENT_STATUS,
} from "../components/reactQuery/mutations/createUserDasboard";
import { ActionTable } from "../components/actionTable/actionTable";

const { Title, Text } = Typography;

const UserManagement = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [loadingPage, setLoadingPage] = useState(false);

  const [investmentState, setInvestmentState] = useState({
    next: 0,
    prev: 0,
    page: 1,
    page_size: 10,
    investment: [],
    search: "",
  });
  const [filterData, setFilterData] = useState<string | null>(null);

  const [visibleModalChangePassword, setVisibleModalChangePassword] =
    useState(false);

  const getInvestmentData = async () => {
    const { data } = await api.get(
      usersList +
        `?expand=avatar.url&fields=id,full_name,email,is_verified,last_login,date_joined,avatar,is_active&page=${
          investmentState?.page
        }&page_size=${investmentState?.page_size}&search=${
          investmentState?.search
        }${filterData !== null ? `&is_active=${filterData === "active"}` : ""} `
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery(
    "getUserManagement",
    getInvestmentData,
    {
      refetchOnWindowFocus: false,
      enabled: loadingPage,
    }
  );

  const { mutate: deleteUserManagement } = useMutation(DELETE_USER_MANAGEMENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("getUserManagement");
      const status = values?.data?.status;

      setLoadingPage(true);
      message.success("Delete User successfully.");
      setModalAddUser(false);
      // router?.push('/')
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
  const { mutate: updateUserManagement } = useMutation(
    UPDATE_USER_MANAGEMENT_STATUS,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("getUserManagement");
        const status = values?.data?.status;

        setLoadingPage(true);
        message.success("Update User successfully.");
        setModalAddUser(false);
        // router?.push('/')
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
    }
  );

  const handleActionTable = (row: any, actionType: string) => {
    
    //if actionType === 'Update' ==> true
    //TODO open modal to update row and add default value to form
    if (actionType === "Update") {
      // setValue("id",row?.id)
      // setValue("clientId",row?.clientId)
      // setValue("clientSecret", row?.clientSecret)
      // setSelectProviderState(row?.provider)
      setModalAddUser(!visibleModalAddUser);
    }

    //if actionType === 'Delete' ==> true
    //TODO delete row in server and query all new data ===> done
    if (actionType === "Delete") {
      setLoadingPage(true);
      deleteUserManagement(row?.id);
    }
    if (actionType === "Reject" || actionType === "Verify") {
      updateUserManagement({ isVerified: row?.isVerified, id: row?.id });
    }
    if (actionType === "Change Password") {
      setValue("userId", row?.id);
      setValue("firstName", "a");
      setValue("confirmPassword", "a");
      setValue("lastName", "a");
      setValue("password", "a");
      setValue("email", "a");
      setValue("new_password", "a");
      setVisibleModalChangePassword(!visibleModalChangePassword);
    }
  };


  const {
    mutate: updateActiveAndDeActiveEvent,
  } = useMutation(UPDATE_ACTIVE_DE_ACTIVE_USER_MANAGEMENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("getUserManagement")
      const status = values?.data?.status;
      
     
     setLoadingPage(true);
    //  setModalAddUser(!visibleModalAddUser);
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
  const onChangeActiveAndDeActiveFunction = (event:any) => {
    // 
    setLoadingPage(true)
    const variables = {
      isActive:event?.target?.checked,
      id:event?.target?.id
    }
    updateActiveAndDeActiveEvent(variables)
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
      title: translate?.name,
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, row: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <Image width={40} height={40} src={row?.identity} style={{borderRadius:"50%"}} /> */}
            {row?.avatar?.url ? (
              <div
                style={{
                  backgroundImage: `url(${IMAGES_PATH}${row?.avatar?.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  marginRight: "7px",
                }}
              ></div>
            ) : (
              <Avatar
                size="large"
                icon={<UserOutlined />}
                style={{ marginRight: "10px" }}
              />
            )}

            {text}
          </div>
        );
      },
    },
    {
      title: translate?.email,
      dataIndex: "email",
      key: "email",
    },
    {
      title: translate?.lastLogin,
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (date: string) => {
        return (
          <span>{date && <Moment format="YYYY/MM/DD">{date}</Moment>}</span>
        );
      },
    },
    {
      title: translate?.dateJoined,
      dataIndex: "dateJoined",
      key: "dateJoined",
      render: (date: string) => {
        return (
          <span>{date && <Moment format="YYYY/MM/DD">{date}</Moment>}</span>
        );
      },
    },
    {
      title: translate?.isActive,
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive:boolean , row:any ) => {
        return(
          <span>
            <Checkbox
            id={row?.id} 
            onChange={onChangeActiveAndDeActiveFunction}
             checked={isActive}></Checkbox>
          </span>
        )
      }
      // render: (verify: boolean) => {
      //   return (
      //     <Row>
      //       {verify && (
      //         <Tag icon={<CheckCircleOutlined />} color="success">
      //           Active
      //         </Tag>
      //       )}
      //       {!verify && (
      //         <Tag icon={<CloseCircleOutlined />} color="error">
      //           DeActive
      //         </Tag>
      //       )}
      //     </Row>
      //   );
      // },
    },

    // {
    //   title: translate?.isActive,
    //   dataIndex: "isActive",
    //   key: "isActive",
    // },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: (action: any, row: any) => (
        <ActionTable
          actions={[
            "Delete",
            // row?.isVerified ? "Reject" : "Verify"
            "Change Password",
          ]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];
  const [visibleModalAddUser, setModalAddUser] = useState(false);

  const onChangePagination = (event: any) => {
    setLoadingPage(true);

    setInvestmentState((prevState) => ({
      ...prevState,
      page: event?.current,
      page_size: event?.pageSize,
    }));
  };
  const getDataSearch = (textSearch: any) => {
    setLoadingPage(true);
    // setInvestmentState((prevState) => ({
    //   ...prevState,
    //   search:textSearch?.text
    // }))
  };
  const { queryState, setQueryState, searchResults } =
    useDebouncedSearch(getDataSearch);
  const handleChangeSearchFunction = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const searchData = event.currentTarget?.value;

    setQueryState({
      text: searchData,
    });
    setInvestmentState((prevState) => ({
      ...prevState,
      search: searchData,
      page: 1,
    }));
  };

  const handelOpenModalUserManagement = () => {
    setModalAddUser(!visibleModalAddUser);
    setValue("firstName", "");
    setValue("confirmPassword", "");
    setValue("lastName", "");
    setValue("password", "");
    setValue("email", "");
    setValue("new_password", "");
  };
  const handelOpenModalChangePassword = () => {
    setVisibleModalChangePassword(!visibleModalChangePassword);
    setValue("firstName", "");
    setValue("confirmPassword", "");
    setValue("lastName", "");
    setValue("password", "");
    setValue("email", "");
  };

  const {
    mutate: handleUserCreate,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_USER_DASHBOARD, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("getUserManagement");
      const status = values?.data?.status;

      setLoadingPage(true);
      message.success("Create User successfully.");
      setModalAddUser(false);
      // router?.push('/')
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
    if (data?.password !== data?.confirmPassword) {
      return message.error("Invalid confirm password!");
    }

    const variables = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      password: data?.password,
    };
    handleUserCreate(variables);
  };

  const { mutate: handleUserChangePassword } = useMutation(CHANGE_PASSWORD, {
    onSuccess: (values: any) => {
      // queryClient.invalidateQueries("getUserManagement");
      const status = values?.data?.status;

      setLoadingPage(true);
      message.success("Create User successfully.");
      setVisibleModalChangePassword(false);
      // router?.push('/')
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

  const onSubmitChangePassword = (data: any) => {
    const variables = {
      new_password: data?.new_password,
      userId: data?.userId,
    };
    handleUserChangePassword(variables);
  };

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);

    setFilterData(event?.key);
    queryClient.invalidateQueries("investment");
  };

  const menu = (
    <Menu>
      <Menu.Item key="active" onClick={handleFilterFunction}>
        Active
      </Menu.Item>
      <Menu.Item key="deActive" onClick={handleFilterFunction}>
        DeActive
      </Menu.Item>
      {/* <Menu.Item key="done" onClick={handleFilterFunction}>
        Done
      </Menu.Item>
      <Menu.Item key="failed" onClick={handleFilterFunction}>
      Failed
      </Menu.Item> */}
    </Menu>
  );

  return (
    <div>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          visible={visibleModalChangePassword}
          title={translate?.addAdmin}
          onCancel={handelOpenModalChangePassword}
          footer={[
            <Button
              type="primary"
              onClick={handleSubmit(onSubmitChangePassword)}
            >
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmitChangePassword)}>
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="new_password">
                  {translate?.newPassword}
                  <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  />
                </label>

                <Controller
                  control={control}
                  {...register("new_password", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="new_password"
                      size="large"
                      {...field}
                      name="new_password"
                      type="text"
                    />
                  )}
                  name="new_password"
                />
                {errors?.new_password?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }
      {
        //@ts-ignore
        <Modal
          visible={visibleModalAddUser}
          title={translate?.addAdmin}
          onCancel={handelOpenModalUserManagement}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={11}>
                <label htmlFor="firstName">
                  {translate?.firstName}
                  <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  />
                </label>
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
              <Col span={12}>
                <label htmlFor="lastName">
                  {translate?.lastName}
                  <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  />
                </label>
                <Controller
                  control={control}
                  {...register("lastName", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="lastName"
                      size="large"
                      {...field}
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
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="email">
                  {translate?.email}
                  <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  />
                </label>

                <Controller
                  control={control}
                  {...register("email", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="email"
                      size="large"
                      {...field}
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
            </Row>
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="password">
                  {translate?.password}
                  <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  />
                </label>

                <Controller
                  control={control}
                  {...register("password", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="password"
                      size="large"
                      {...field}
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
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="confirmPassword">
                  {translate?.confirmPassword}
                  <StarFilled
                    style={{
                      color: "red",
                      fontSize: "0.5rem",
                      marginLeft: "5px",
                    }}
                  />
                </label>
                <Controller
                  control={control}
                  {...register("confirmPassword", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="confirmPassword"
                      size="large"
                      {...field}
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
            {/* <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="phoneNumber">{translate?.phoneNumber}</label>

                <Controller
                  control={control}
                  {...register("phoneNumber", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phoneNumber"
                      size="large"
                      name="phoneNumber"
                      type="text"
                    />
                  )}
                  name="phoneNumber"
                />
                {errors?.phoneNumber?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row> */}
            {/* <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="role">{translate?.role}</label>
                <Controller
                  control={control}
                  {...register("role", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="role"
                      size="large"
                      name="role"
                      type="text"
                    />
                  )}
                  name="role"
                />
                {errors?.role?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row> */}
          </form>
        </Modal>
      }
      <Row style={{ marginBottom: "1rem" }}>
        <Col span={21}>
          {/* <Space prefixCls="2rem">Investors</Space> */}
          <Title level={4} style={{ display: "flex" }}>
            {translate?.user_management}
          </Title>
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
          >
            {translate?.addAdmin}
          </Button>
        </Col>
      </Row>
      {/* <Row>
            <Col span={24}>
              <Breadcrumb style={{ margin: "0 0" }}>
                <Breadcrumb.Item>{translate?.projects}</Breadcrumb.Item>
                <Breadcrumb.Item>{translate?.funded_projected}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row> */}
      <Row style={{ margin: "0 0 1rem 0 ",  display:"flex" , justifyContent:"flex-end"  }}>
        {/* <Col span={13}></Col> */}
        <Col span={8}>
          <Input
            placeholder={translate?.search}
            prefix={<SearchOutlined />}
            onChange={handleChangeSearchFunction}
          />
        </Col>
        <Col span={"auto"} style={{ display: "flex", justifyContent: "flex-end" }}>
          {
            //@ts-ignore
            <Dropdown
              overlay={menu}
              placement="bottomLeft"
              // icon={<DownOutlined />}
              // icon={<FilterOutlined />}
              style={{ border: "none" }}
              type="text"
              // onVisibleChange={handleFilterFunction}
              // onClick={handleFilterFunction}
            >
              {/* <Button>.fgdfg</Button> */}
              <Button
                type="default"
                shape="default"
                icon={<FilterOutlined />}
                size={"middle"}
                style={{ borderRadius: "7px", marginLeft: "0px" }}
              >
                {translate?.filter}
              </Button>
            </Dropdown>
          }
        </Col>
        <Col span={"auto"} style={{ display: "flex", justifyContent: "flex-end" }}>
          {filterData && (
            <Button
              type="primary"
              icon={<DeleteOutlined />}
              size={"middle"}
              onClick={() => {
                setFilterData(null);
                setLoadingPage(true);
              }}
            />
          )}
        </Col>
      </Row>
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

export default UserManagement;
