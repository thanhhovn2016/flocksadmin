import {
  DeleteOutlined,
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Row,
  Space,
  Table,
  Tag,
} from "antd";

import { Typography } from "antd";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { ActionTable } from "../../components/actionTable/actionTable";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { api } from "../../components/reactQuery/axios";
import { companies } from "../../components/reactQuery/constants";
import { SpinLoader } from "../../components/space/spin";
import { translate } from "../../components/translate/useTranslate";
import { project } from "../../components/zustand/store";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CompaniesList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loadingPage, setLoadingPage] = useState(false);
  const setProjectDetails = project((state: any) => state.setProjectDetails);
  const [investmentState, setInvestmentState] = useState({
    next: 0,
    prev: 0,
    page: 1,
    page_size: 10,
    investment: [],
    search: "",
  });
  const [filterData, setFilterData] = useState(null);
  const handleActionTable = (row: any, actionType: string) => {
    if (actionType === "details") {
      setProjectDetails(row);
      navigate("/projects/projectsDetails");
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
      title: translate?.companyName,
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: translate?.email,
      dataIndex: "email",
      key: "email",
    },
    {
      title: translate?.phoneNumber,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: translate?.website,
      dataIndex: "website",
      key: "website",
    },
    {
      title: translate?.address,
      dataIndex: "address",
      key: "address",
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
      render: (action: any, row: any) => (
        <ActionTable
          actions={["Details"]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];

  const getInvestmentData = async () => {
    const { data } = await api.get(
      companies +
        `?page=${investmentState?.page}&page_size=${
          investmentState?.page_size
        }&search=${investmentState?.search}${
          filterData !== null ? `&status=${filterData}` : ""
        } `
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("investment", getInvestmentData ,{
    refetchOnWindowFocus: false,
    enabled:loadingPage
  });

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
      <Menu.Item key="approved" onClick={handleFilterFunction}>
        {translate?.approve}
      </Menu.Item>
      <Menu.Item key="pending" onClick={handleFilterFunction}>
        {translate?.pending}
      </Menu.Item>
      <Menu.Item key="rejected" onClick={handleFilterFunction}>
        {translate?.reject}
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ position: "relative" }}>
      {loadingPage  ? <SpinLoader /> : null}
      <Row>
        <Col span={"auto"}>
          {/* <Space prefixCls="2rem">Investors</Space> */}
          <Title level={4}>{translate?.projects}</Title>
        </Col>
        <Col span={"auto"} style={{ margin: "10px" }}>
          <Text>{data?.count} </Text>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {
            //@ts-ignore
            <Breadcrumb style={{ margin: "0 0", display: "flex" }}>
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.projects}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.companies_list}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      <Row style={{ margin: "0 0 1rem 0 " ,  display:"flex" , justifyContent:"flex-end" }}>
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

export default CompaniesList;
