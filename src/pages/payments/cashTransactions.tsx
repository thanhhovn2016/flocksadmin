import {
  DeleteOutlined,
  EditOutlined,
  EyeFilled,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Image,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tag,
} from "antd";

import { Typography } from "antd";
import { useState } from "react";
import Moment from "react-moment";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ActionTable } from "../../components/actionTable/actionTable";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { manageErrors } from "../../components/errors/manageErrors";
import { api } from "../../components/reactQuery/axios";
import { useForm, Controller } from "react-hook-form";
import {
  
  paymentTransactionHistory,
} from "../../components/reactQuery/constants";
import { VERIFICATION_USER } from "../../components/reactQuery/mutations/verification";
import { SpinLoader } from "../../components/space/spin";
import { translate } from "../../components/translate/useTranslate";

const { Title, Text } = Typography;

const ReceivedTransactions = () => {
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
  const [visibleModalRefactor , setVisibleModalRefactor] = useState(false) 

  const getInvestmentData = async () => {
    const { data } = await api.get(
      paymentTransactionHistory +
        `?expand=user,company,order_id&page=${investmentState?.page}&page_size=${
          investmentState?.page_size
        }&search=${investmentState?.search}${
          filterData !== null ? `&message=${filterData}` : ""
        } `
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery(
    "paymentReceived",
    getInvestmentData,
    {
      refetchOnWindowFocus: false,
      enabled: loadingPage,
    }
  );
  

  const { mutate: verificationUserFunction } = useMutation(VERIFICATION_USER, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("paymentReceived");
      const status = values?.data?.status;

      setLoadingPage(true);
      message.success("Change user Status successfully.");
      //  setModalAddUser(false)
      // router?.push('/')
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
  const handleActionTable = (row: any, actionType: string) => {
    console.log("row" , row)
    setLoadingPage(true);
    if (actionType === "Reject") {
      const variables = {
        id: row?.id,
        verificationStatus: "failed",
      };
      verificationUserFunction(variables);
    }
    if (actionType === "Verify") {
      const variables = {
        id: row?.id,
        verificationStatus: "done",
      };
      verificationUserFunction(variables);
    }
    if (actionType === "Refound"){
      setVisibleModalRefactor(!visibleModalRefactor)
      setValue("amount" , row?.amount)
      setValue("refoundAmount" , row?.amount)
    }
  };

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
      title:translate?.name,
      dataIndex:"user",
      key:"user",
      render : (user:any) => {
        return(
          <span>{user?.fullName}</span>
        )
      }
    },
    // {
    //   title: translate?.account,
    //   dataIndex: "customer",
    //   key: "customer",
      
    // },
    {
      title: translate?.amount,
      dataIndex: "amount",
      key: "amount",
      // render: (user: any) => {
      //   return (
      //     <span>
      //       {user?.firstName} ({user?.lastName}){" "}
      //     </span>
      //   );
      // },
    },

    
    {
      title: translate?.company,
      dataIndex: "company",
      key: "company",
      render: (company: any) => {
        return (
          <span>
            {company?.companyName}
          </span>
        );
      },
    },
    {
      title: translate?.date,
      dataIndex: "created",
      key: "created",
      render: (date: string) => {
        return <Moment format="YYYY/MM/DD">{date}</Moment>;
      },
    
    },
    {
      title: translate?.orderInfo,
      dataIndex: "orderInfo",
      key: "orderInfo",
     
    },
    {
      title: translate?.orderType,
      dataIndex: "orderType",
      key: "orderType",
     
    },
    {
      title: translate?.status,
      dataIndex: "message",
      key: "message",
      render: (message:string) => {
        return (
          <span>
          {message ==="Successful."&&<Tag icon={<CheckCircleOutlined />} color="success">
            SuccessFull
            </Tag>
}
          </span>
        );
      },
    },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: (action: any, row: any) => (
        <ActionTable
          actions={["Refound"]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];

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
  const getTotalReceivedTransaction = async () =>{
    const {data} = await api.get(paymentTransactionHistory+ "/total_received/")
return data
  }
  const transactionTotalReceived = useQuery("totalReceived" ,getTotalReceivedTransaction )

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);

    setFilterData(event?.key);
    queryClient.invalidateQueries("investment");
  };

  const menu = (
    <Menu>
      <Menu.Item key="pre_pending" onClick={handleFilterFunction}>
        Pre Pending
      </Menu.Item>
      {/* <Menu.Item key="pending" onClick={handleFilterFunction}>
          {translate?.pending}
        </Menu.Item> */}
      <Menu.Item key="done" onClick={handleFilterFunction}>
        Done
      </Menu.Item>
      <Menu.Item key="failed" onClick={handleFilterFunction}>
        Failed
      </Menu.Item>
    </Menu>
  );
const handleOpenModalRefactor = () => {
  setVisibleModalRefactor(!visibleModalRefactor)
}
const onSubmit = (data:any) => {

}
  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalRefactor}
          title={translate?.refound}
          onCancel={handleOpenModalRefactor}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)} disabled>
              {translate?.refound}
            </Button>,
          ]}
        >
           {/* <Row style={{display:"flex" , justifyContent:"center"}}>
          <Progress type="circle" percent={numberBackup} width={80} strokeColor="primary" />
          </Row> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="amount">{translate?.amount}</label>
                <Controller
                  control={control}
                  
                  {...register("amount", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="amount"
                      size="large"
                      name="amount"
                      type="number"
                      disabled
                    />
                  )}
                  name="amount"
                />
                {errors?.amount?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: "2rem" }}>
              <label htmlFor="refoundAmount">{translate?.refoundAmount}</label>
                <Controller
                  control={control}
                  {...register("refoundAmount", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="refoundAmount"
                      size="large"
                      name="refoundAmount"
                      type="number"
                    />
                  )}
                  name="refoundAmount"
                />
                {errors?.refoundAmount?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }
      <Row>
        <Col span={"auto"}>
          {/* <Space prefixCls="2rem">Investors</Space> */}
          <Title level={4} style={{ display: "flex" }}>
            {translate?.cashTransaction}
          </Title>
        </Col>
        <Col
          span={"auto"}
          style={{ display: "grid", alignItems: "center", paddingLeft: "1rem" }}
        >
          <Text>{data?.count}</Text>
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
      <Row style={{ margin: "0 0 1rem 0 "  ,  display:"flex" , justifyContent:"flex-end" }}>
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

export default ReceivedTransactions;
