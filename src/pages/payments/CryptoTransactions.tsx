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
    Row,
    Space,
    Table,
    Tag,
  } from "antd";
  
  import { Typography } from "antd";
  import { useState } from "react";
  import { useMutation, useQuery, useQueryClient } from "react-query";
  import { ActionTable } from "../../components/actionTable/actionTable";
  import { useDebouncedSearch } from "../../components/debounce/debounce";
  import { manageErrors } from "../../components/errors/manageErrors";
  import { api } from "../../components/reactQuery/axios";
  import {
    IMAGES_PATH,
    verification,
    BASE_URL,
    mediaDownload,
    accessToken,
    paymentCryptoTransactionHistory,
  } from "../../components/reactQuery/constants";
  import { VERIFICATION_USER } from "../../components/reactQuery/mutations/verification";
  import { SpinLoader } from "../../components/space/spin";
  import { translate } from "../../components/translate/useTranslate";
  
  const { Title , Text } = Typography;
  
  const CryptoTransactions = () => {
    const queryClient = useQueryClient();
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
  
    const getInvestmentData = async () => {
      const { data } = await api.get(
        paymentCryptoTransactionHistory +
          `?expand=user,company&page=${investmentState?.page}&page_size=${
            investmentState?.page_size
          }&search=${investmentState?.search}${
            filterData !== null ? `&status=${filterData}` : ""
          } `
      );
      setLoadingPage(false);
      return data;
    };
    const { isLoading, data, error } = useQuery(
      "paymentCryptoTransaction",
      getInvestmentData ,{
        refetchOnWindowFocus: false,
        enabled:loadingPage
      }
    );
  
    const { mutate: verificationUserFunction } = useMutation(VERIFICATION_USER, {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("paymentCryptoTransaction");
        const status = values?.data?.status;
  
         setLoadingPage(true)
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
        title: translate?.name,
        dataIndex: "user",
        key: "user",
        render:(user:any)=>{
          return <span>{user?.fullName}</span>
        }
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
        title: translate?.currency,
        dataIndex: "currency",
        key: "currency",
        // render: (image: string) => {
        //   return (
        //     <span>
        //       {image && (
        //         <Image
        //           width={50}
        //           src={`${BASE_URL}${mediaDownload}${image}/?permission_token=${localStorage?.getItem(
        //             accessToken
        //           )}`}
        //         />
        //       )}
        //     </span>
        //   );
        // },
      },
      {
          title:translate?.status,
          dataIndex:"status",
          key:"status",
          render: (status: string) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              {status == "PAY_SUCCESS" && (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  {status}
                </Tag>
              )}
              {/* {data === "pre_pending" && (
                <Tag icon={<SyncOutlined spin />} color="processing">
                  {data}
                </Tag>
              )}
              {data === "failed" && (
                <Tag icon={<CloseCircleOutlined />} color="error">
                  {data}
                </Tag>
              )} */}
              {/* {data === "pending" && (
                <Tag icon={<ClockCircleOutlined />} color="default">
                  {data}
                </Tag>
              )} */}
            </div>
          );
        },
      },
      {
        title: translate?.action,
        dataIndex: "Action",
        key: "Action",
        render: (action: any, row: any) => (
          <ActionTable
            // actions={[row?.verificationStatus === "done" ? "Reject" : "Verify"]}
            actions={[]}
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
  
    const handleFilterFunction = (event: any) => {
      setLoadingPage(true);
      
  
      setFilterData(event?.key);
      queryClient.invalidateQueries("investment");
    };
  
    const menu = (
      <Menu>
        <Menu.Item key="PAY_SUCCESS" onClick={handleFilterFunction}>
        pay Success
        </Menu.Item>
        {/* <Menu.Item key="pending" onClick={handleFilterFunction}>
          {translate?.pending}
        </Menu.Item> */}
        {/* <Menu.Item key="done" onClick={handleFilterFunction}>
          Done
        </Menu.Item>
        <Menu.Item key="failed" onClick={handleFilterFunction}>
        Failed
        </Menu.Item> */}
      </Menu>
    );
  
    return (
      <div style={{ position: "relative" }}>
        {loadingPage  ? <SpinLoader /> : null}
        <Row>
          <Col span={"auto"}>
            {/* <Space prefixCls="2rem">Investors</Space> */}
            <Title level={4} style={{ display: "flex" }}>
              {translate?.cryptoTransaction}
            </Title>
          </Col>
          <Col span={"auto"} style={{display:"grid" ,alignItems:"center" , paddingLeft:"1rem" }}><Text >{data?.count}</Text></Col>
        </Row>
        {/* <Row>
            <Col span={24}>
              <Breadcrumb style={{ margin: "0 0" }}>
                <Breadcrumb.Item>{translate?.projects}</Breadcrumb.Item>
                <Breadcrumb.Item>{translate?.funded_projected}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row> */}
        <Row style={{ margin: "0 0 1rem 0 " ,  display:"flex" , justifyContent:"flex-end"  }}>
          {/* <Col span={13}></Col> */}
          <Col span={8}>
            <Input
              placeholder={translate?.search}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearchFunction}
            />
          </Col>
          <Col span={"auto"} style={{display:"flex" , justifyContent:"flex-end"}}>
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
          <Col span={"auto"} style={{display:"flex" , justifyContent:"flex-end"}}>
        {  filterData && <Button type="primary" icon={<DeleteOutlined />} size={"middle"} onClick={() => {
          setFilterData(null)
          setLoadingPage(true)
        }}/>}
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
  
  export default CryptoTransactions;
  