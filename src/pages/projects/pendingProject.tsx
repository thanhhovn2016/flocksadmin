//@ts-nocheck
import React from 'react'
import {
  EyeFilled,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Col, Input, Row, Table } from "antd";

import { Typography } from "antd";
// import { NextPage } from "next";
import {translate } from "../../components/translate/useTranslate";

const { Title , Text} = Typography;

const PendingProject = () => {

  // const { t } = useTranslation();

  const dataSource = [
    {
      key: "13",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    },
    {
      key: "23",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    },
    {
      key: "33",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    },
    {
      key: "43",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    },
    {
      key: "53",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    },
    {
      key: "63",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    },
    {
      key: "73",
      name: "John Brown",
      fundNeeded: "$85,000",
      category: "Health",
      website: "www.testwebsite.com",
    }
  ];

  const columns = [
    {
      title: translate?.companyName,
      dataIndex: "name",
      key: "name",
    },
    {
      title: translate?.fundNeeded,
      dataIndex: "fundNeeded",
      key: "fundNeeded",
    },
    {
      title: translate?.category,
      dataIndex: "category",
      key: "category",
    },
    {
      title: translate?.dateSubmitted,
      dataIndex: "website",
      key: "website",
    },
    
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: () => {
        return (
          <Row>
            <Col>
              <Button
                type="primary"
                icon={<EyeFilled />}
                size={"middle"}
                style={{
                  background: "#D7D7D7",
                  color: "#606060",
                  border: "1px solid #FFF",
                  borderRadius: "5px",
                }}
              />
            </Col>
            <Col>
              <Button
                type="default"
                style={{
                  background: "#FFF",
                  border: "1px solid #12B347",
                  color: "#12B347",
                  margin: "0 5px",
                  borderRadius: "5px",
                }}
              >
                {translate?.approve}
              </Button>
              <Button
                type="default"
                style={{
                  background: "#FFF",
                  border: "1px solid #FF4646",
                  color: "#FF4646",
                  borderRadius: "5px",
                }}
              >
                {translate?.reject}
              </Button>
            </Col>
           
          </Row>
        );
      },
    },
  ];

  return (
    <div>
      <Row>
        <Col span={"auto"}>
          <Title level={4}>{translate?.projects}</Title>
        </Col>
        <Col span={"auto"} style={{margin:"10px"}}><Text >10 </Text></Col>
      </Row>
      <Row>
        <Col span={24}>
          <Breadcrumb style={{ margin: "0 0" , display:"flex" }}>
            <Breadcrumb.Item>{translate?.projects}</Breadcrumb.Item>
            <Breadcrumb.Item>{translate?.pending_projects}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row style={{ margin: "0 0 1rem 0 " }}>
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
      </Row>
      <Table dataSource={dataSource} columns={columns} />;
    </div>
  );
};

export default PendingProject;
