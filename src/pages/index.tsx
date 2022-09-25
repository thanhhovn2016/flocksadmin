import {
  Button,
  Card,
  Col,
  DatePicker,
  Image,
  Row,
  Tag,
  Select,
  Space,
  Spin,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import DashboardChart from "../components/charts/dashboardChart";
import { api } from "../components/reactQuery/axios";
import {
  analyticsCountData,
  analyticsGraph,
  analyticsLastUser,
  IMAGES_PATH,
} from "../components/reactQuery/constants";
import { translate } from "../components/translate/useTranslate";
import { useState } from "react";
import { SpinLoader } from "../components/space/spin";
import { Link } from "react-router-dom";
// import type { NextPage } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'
// import { useRouter } from 'next/router'
// import useTranslation from '../components/translate/useTranslate'
// import styles from '../styles/Home.module.css'

const { Option } = Select;

const Home = () => {
  const [statistics, setStatistics] = useState("Clients");
  const [selectTime, setSelectTime] = useState("year");
  const [isLoadStatisticsQuery, setIsLoadStatisticsQuery] = useState(true);
  const getAnalyticsCountDataFunction = async () => {
    return await api.get(analyticsCountData);
  };
  const analyticsCount = useQuery(
    "analyticsCountData",
    getAnalyticsCountDataFunction
  );
  // 
  const getAnalyticsLastUserFunction = async () => {
    return await api.get(analyticsLastUser + "?exan&page=1&page_size=9");
  };
  const analyticsLastUserData = useQuery(
    "analyticsLastUser",
    getAnalyticsLastUserFunction
  );
  // 

  const handleChangeSelectStatistics = (key: string) => {
    setIsLoadStatisticsQuery(true);
    setStatistics(key);
  };
  const handleChangeSelectTime = (key: string) => {
    setIsLoadStatisticsQuery(true);
    setSelectTime(key);
  };

  const getAnalyticsGraphFunction = async () => {
    setIsLoadStatisticsQuery(false);
    return await api.get(
      analyticsGraph + `?range=${selectTime}&date_type=${statistics}`
    );
  };
  const analyticsGraphData = useQuery(
    "analyticsGraph",
    getAnalyticsGraphFunction,
    { enabled: isLoadStatisticsQuery }
  );
  
 

  return (
    <div>
      {analyticsGraphData?.isLoading && <SpinLoader />}
      <Row>
        <Col
          span={24}
          style={{
            display: "flex",
            fontSize: "25px",
            fontWeight: "bold",
            paddingBottom: "15px",
            color: "#393E65",
          }}
        >
          Dashboard
        </Col>
      </Row>
      <Row>
        <Col span={17}>
          <Row>
            <Col span={6}>
              <Card
                size="small"
                // title="Small size card"
                // extra={<a href="#">More</a>}
                style={{ width: "90%", borderRadius: "7px" }}
              >
                <p style={{ color: "#9FA2B4" }}>{translate?.client}</p>
                <p
                  style={{
                    color: "var(--lightGreen)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  {analyticsCount?.isLoading ? (
                    <Space size="middle">
                      <Spin size="small" />
                    </Space>
                  ) : (
                    analyticsCount?.data?.data?.totalClients
                  )}
                </p>
                {/*<p>Card content</p> */}
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                // title="Small size card"
                // extra={<a href="#">More</a>}
                style={{ width: "90%", borderRadius: "7px" }}
              >
                <p style={{ color: "#9FA2B4" }}>{translate?.investors}</p>
                <p
                  style={{
                    color: "var(--lightGreen)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  {analyticsCount?.isLoading ? (
                    <Space size="middle">
                      <Spin size="small" />
                    </Space>
                  ) : (
                    analyticsCount?.data?.data?.totalInvestors
                  )}
                </p>
                {/* <p>Card content</p> */}
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                // title="Small size card"
                // extra={<a href="#">More</a>}
                style={{ width: "90%", borderRadius: "7px" }}
              >
                <p style={{ color: "#9FA2B4" }}>{translate?.companies}</p>
                <p
                  style={{
                    color: "var(--lightGreen)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  {analyticsCount?.isLoading ? (
                    <Space size="middle">
                      <Spin size="small" />
                    </Space>
                  ) : (
                    analyticsCount?.data?.data?.totalCompany
                  )}
                </p>
                {/*<p>Card content</p> */}
              </Card>
            </Col>
            <Col span={6}>
              <Card
                size="small"
                // title="Small size card"
                // extra={<a href="#">More</a>}
                style={{ width: "90%", borderRadius: "7px" }}
              >
                <p style={{ color: "#9FA2B4" }}>{translate?.activeInvestors}</p>
                <p
                  style={{
                    color: "var(--lightGreen)",
                    fontSize: "20px",
                    fontWeight: "bold",
                    margin: "0",
                  }}
                >
                  {analyticsCount?.isLoading ? (
                    <Space size="middle">
                      <Spin size="small" />
                    </Space>
                  ) : (
                    analyticsCount?.data?.data?.totalActiveInvestors
                  )}
                </p>
                {/*<p>Card content</p> */}
              </Card>
            </Col>
          </Row>
          <Card
            size="small"
            // title="Small size card"
            // extra={<a href="#">More</a>}
            style={{ width: "97.5%", marginTop: "15px", borderRadius: "7px" }}
          >
            <Row>
              <Col span={19}>
                {/* <Card
                size="small"
                // title="Small size card"
                // extra={<a href="#">More</a>}
                style={{ width: "100%"}}
              > */}
                <Row style={{ marginBottom: "1rem" }}>
                  <Col
                    span={14}
                    style={{ display: "grid", justifyContent: "start" }}
                  >
                    <p
                      style={{
                        fontSize: "20px",
                        color: "#393E65",
                        margin: "0",
                        display: "flex",
                      }}
                    >
                      {statistics} Statistics
                    </p>
                    {/* <p style={{ color: "#cececef7", fontSize: "12px" }}>
                      as of 1 March 2022, 09:41 PM
                    </p> */}
                  </Col>
                  <Col span={9} style={{ display: "block" }}>
                    <Select
                      size="middle"
                      defaultValue="Client"
                      onChange={handleChangeSelectStatistics}
                      style={{
                        width: "fit-content",
                        marginRight: "10px",
                      }}
                    >
                      <Option key="Clients">{translate?.client}</Option>
                      <Option key="Investors">{translate?.investors}</Option>
                      <Option key="Companies">{translate?.companies}</Option>
                    </Select>
                    <Select
                      size="middle"
                      defaultValue="Year"
                      onChange={handleChangeSelectTime}
                      style={{
                        width: "fit-content",
                      }}
                    >
                      <Option key="year">{translate?.year}</Option>
                      <Option key="month">{translate?.month}</Option>
                      <Option key="week">{translate?.week}</Option>
                      <Option key="day">{translate?.day}</Option>
                    </Select>
                  </Col>
                </Row>
                {analyticsGraphData?.isLoading ? (
                  <Space size="middle">
                    <Spin size="small" />
                  </Space>
                ) : (
                  <DashboardChart
                    data={analyticsGraphData?.data?.data?.graphData}
                  />
                )}
              </Col>
              <Col span={5} style={{ borderLeft: "1px solid #DFE0EB" }}>
                {analyticsGraphData?.isLoading ||
                analyticsGraphData?.data?.data?.summeryData ===
                  null ? (
                  <Space size="large">
                    <Spin size="small" />
                  </Space>
                ) : (
                  Object?.keys(
                    analyticsGraphData?.data?.data?.summeryData
                  )?.map(function (key, index) {
                    // myObject[key] *= 2;
                    return (
                      <div
                        style={{
                          borderBottom: "1px solid #DFE0EB",
                          paddingTop: "12px",
                        }}
                      >
                        <p style={{ color: "#9FA2B4" }}>
                          {key?.charAt(0)?.toUpperCase() + key?.slice(1)}{" "}
                          {statistics}
                        </p>
                        <p
                          style={{
                            color: "var(--lightGreen)",
                            fontSize: "20px",
                            fontWeight: "bold",
                            // margin: "0",
                          }}
                        >
                          {analyticsGraphData?.data?.data?.summeryData?.[key]}
                        </p>
                      </div>
                    );
                  })
                )}
                {/* <div
                  style={{
                    borderBottom: "1px solid #DFE0EB",
                    paddingTop: "12px",
                  }}
                >
                  <p style={{ color: "#9FA2B4" }}>{statistics}</p>
                  <p
                    style={{
                      color: "#393E65",
                      fontSize: "20px",
                      fontWeight: "bold",
                      // margin: "0",
                    }}
                  >
                    {analyticsGraphData?.data?.data?.summeryData?.total}
                  </p>
                </div> */}
                {/* <div
                  style={{
                    borderBottom: "1px solid #DFE0EB",
                    paddingTop: "12px",
                  }}
                >
                  <p style={{ color: "#9FA2B4" }}>Verified {statistics}</p>
                  <p
                    style={{
                      color: "#393E65",
                      fontSize: "20px",
                      fontWeight: "bold",
                      // margin: "0",
                    }}
                  >
                     {analyticsGraphData?.data?.data?.summeryData?.verified}
                  </p>
                </div> */}
                {/* <div
                  style={{
                    borderBottom: "1px solid #DFE0EB",
                    paddingTop: "12px",
                  }}
                >
                  <p style={{ color: "#9FA2B4" }}>Rejected {statistics}</p>
                  <p
                    style={{
                      color: "#393E65",
                      fontSize: "20px",
                      fontWeight: "bold",
                      // margin: "0",
                    }}
                  >
                    {analyticsGraphData?.data?.data?.summeryData?.reject}
                  </p>
                </div> */}
                {/* <div style={{ paddingTop: "12px" }}>
                  <p style={{ color: "#9FA2B4" }}>Pending {statistics}</p>
                  <p
                    style={{
                      color: "#393E65",
                      fontSize: "20px",
                      fontWeight: "bold",
                      // margin: "0",
                    }}
                  >
                     {analyticsGraphData?.data?.data?.summeryData?.pending}
                  </p>
                </div> */}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={7}>
          <Card
            size="small"
            title={translate.recentlyClient}
            // extra={<Link to="#">{translate?.viewMore}</Link>}
            style={{ width: "100%", borderRadius: "7px" }}
          >
            {analyticsLastUserData.isLoading ? (
              <Space size="middle">
                <Spin size="small" />
              </Space>
            ) : (
              analyticsLastUserData?.data?.data?.results?.map((item: any) => {
                return (
                  <Row>
                    <Col span={4}>
                      {item?.avatar?.url ? (
                        <div
                          style={{
                            backgroundImage: `url(${IMAGES_PATH}${item?.avatar?.url})`,
                          }}
                          className="homePage__lastUser--image"
                        ></div>
                      ) : (
                        <Avatar
                          size={40}
                          icon={<UserOutlined />}
                          className="homePage__lastUser--imageAvatar"
                        />
                      )}
                    </Col>
                    <Col span={14} className="homePage__lastUser--firstName">
                      {item?.firstName}
                    </Col>
                    <Col span={6} className="homePage__lastUser--status">
                      {item?.isVerified ? (
                        <Tag
                          color="#F6FFED"
                          className="homepage__lastUser--statusVerified"
                        >
                          {translate?.verified}
                        </Tag>
                      ) : (
                        <Tag
                          color="#E6E6E6"
                          className="homepage__lastUser--statusPending"
                        >
                          {translate?.pending}
                        </Tag>
                      )}
                    </Col>
                  </Row>
                );
              })
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
