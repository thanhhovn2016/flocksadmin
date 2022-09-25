import {
  DeleteOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Pagination,
  Row,
  Space,
  Table,
  Tag,
} from "antd";

import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../components/reactQuery/axios";
import { investment } from "../../components/reactQuery/constants";
import { GET_INVESTMENT } from "../../components/reactQuery/queries/investment";
import { translate } from "../../components/translate/useTranslate";
import { SpinLoader } from "../../components/space/spin";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { ActionTable } from "../../components/actionTable/actionTable";
import { investmentData } from "../../components/zustand/store";
import { useNavigate } from "react-router-dom";
import DropdownButton from "antd/lib/dropdown/dropdown-button";
import { queryClient } from "../../components/reactQuery/queryClient";

const { Title, Text } = Typography;
let filterDataLet:string | null = null
const Investors = () => {
  const navigate = useNavigate();
  const [loadingPage, setLoadingPage] = useState(false);
  const setInvestmentDetails = investmentData(
    (state: any) => state.setInvestmentDetails
  );

  const [filterData, setFilterData] = useState(null);
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
      investment +
        `?page=${investmentState?.page}&page_size=${
          investmentState?.page_size
        }&search=${investmentState?.search}${
          filterData !== null ? `&status=${filterData}` : ""
        }`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("investment", getInvestmentData,{
    refetchOnWindowFocus: false,
    enabled:loadingPage
  });

  const handleActionTable = (row: any, actionType: string) => {
    if (actionType === "details") {
      setInvestmentDetails(row);
      navigate("/investment/investmentDetails");
    }
    if (actionType === "Approve" || actionType === "Reject") {
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
      dataIndex: "investorName",
      key: "investorName",
    },
    {
      title: translate?.email,
      dataIndex: "investorEmail",
      key: "investorEmail",
    },
    {
      title: translate?.phoneNumber,
      dataIndex: "investorPhone",
      key: "investorPhone",
    },
    {
      title: translate?.idNumber,
      dataIndex: "investorIdNumber",
      key: "investorIdNumber",
    },
    {
      title: translate?.address,
      dataIndex: "investorAddress",
      key: "investorAddress",
    },
    {
      title: translate?.status,
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        return (
          <>
            {status === "approved" && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                {status}
              </Tag>
            )}
            {status === "pending" && (
              <Tag icon={<SyncOutlined spin />} color="processing">
                {status}
              </Tag>
            )}
            {status === "rejected" && (
              <Tag icon={<CloseCircleOutlined />} color="error">
                {status}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: (data: any, row: any) => (
        <ActionTable
          actions={[
            "Details",
            //  row?.status === "approved" ? "Reject" : "Approve"
          ]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];
  useEffect(() => {
    queryClient.invalidateQueries("investment");
  },[filterData])
  const onChangePagination = (event: any) => {
    setLoadingPage(true);

    setInvestmentState((prevState) => ({
      ...prevState,
      page: event?.current,
      page_size: event?.pageSize,
    }));
  };
  const getDataSearch = async (textSearch: any) => {
    setLoadingPage(true);
  
    // if (textSearch?.text !== "" || loadingPage === false){
      
    // }else{
    //   setLoadingPage(true)
    // }
    // queryClient.invalidateQueries("investment")
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
  
    // 
    setQueryState({
      text: searchData,
      name:"search"
    });
    setInvestmentState((prevState) => ({
      ...prevState,
      search: searchData,
      page: 1,
    }));
  };

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);
    
    filterDataLet = event.key
    setFilterData(event?.key);
    queryClient.invalidateQueries("investment");
  };

  const menu = (
    <Menu>
      <Menu.Item key="approved"
       onClick={handleFilterFunction}
       >
        {translate?.approve}
      </Menu.Item>
      <Menu.Item key="pending" 
      onClick={handleFilterFunction}
      >
        {translate?.pending}
      </Menu.Item>
      <Menu.Item key="rejected" 
      onClick={handleFilterFunction}
      >
        {translate?.reject}
      </Menu.Item>
    </Menu>
  );
  // if (isLoading && loadingPage === false){
  //   setLoadingPage(loadingPage)
  // }
  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}
      <Row>
        <Col span={"auto"}>
          {/* <Space prefixCls="2rem">Investors</Space> */}
          <Title level={4}>{translate?.investors}</Title>
        </Col>
        <Col span={"auto"} style={{ margin: "10px" }}>
          <Text>
            {data?.count} {translate?.people}
          </Text>
        </Col>
      </Row>
      <Row style={{ margin: "0 0 1rem 0 " , display:"flex" , justifyContent:"flex-end" }}>
        {/* <Col span={13}></Col> */}
        <Col span={8}>
          <Input
            placeholder={translate?.search}
            prefix={<SearchOutlined />}
            onChange={handleChangeSearchFunction}
          />
        </Col>
        <Col span={"auto"} style={{display:"flex" , justifyContent:"flex-end"}}>
          {/* <Button
            type="default"
            shape="default"
            icon={<FilterOutlined />}
            size={"middle"}
            style={{ borderRadius: "7px", marginLeft: "5px" }}
            disabled
          >
            {translate?.filter}
          </Button> */}
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

export default Investors;
