//@ts-nocheck
import {
    DownloadOutlined,
    EyeFilled,
    FilterOutlined,
    MoreOutlined,
    SearchOutlined,
  } from "@ant-design/icons";
  import { Breadcrumb, Button, Col, Input, Row, Space, Table } from "antd";
  
  import { Typography } from "antd";
  import {translate } from "../../components/translate/useTranslate";
  
  const { Title , Text } = Typography;
  
  const FundedProjects = () => {
    // const { t } = useTranslation();
    const dataSource = [
      {
        key: "1",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
      {
        key: "2",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
      {
        key: "3",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
      {
        key: "4",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
      {
        key: "5",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
      {
        key: "6",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
      {
        key: "7",
        name: "John Brown",
        fundNeeded: "$85,000",
        category: "Health",
        website: "www.testwebsite.com",
        amountRaised:"$43,350",
        closingDate:"March 29,2022",
        numberOfInvestors:"750"


      },
     
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
          title: translate?.amountRaised,
          dataIndex: "amountRaised",
          key: "amountRaised",
        },
        {
            title: translate?.closingDate,
            dataIndex: "closingDate",
            key: "closingDate",
          },

      {
        title: translate?.category,
        dataIndex: "category",
        key: "category",
      },
      {
        title: translate?.numberOfInvestors,
        dataIndex: "numberOfInvestors",
        key: "numberOfInvestors",
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
                  type="primary"
                  style={{
                    background: "#FBB03B",
                    border: "1px solid #FBB03B",
                    color: "#FFF",
                    margin: "0 5px",
                    borderRadius: "5px",
                  }}
                >
                  {translate?.disable}
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
            {/* <Space prefixCls="2rem">Investors</Space> */}
            <Title level={4}>{translate?.projects}</Title>
          </Col>
          <Col span={"auto"} style={{margin:"10px"}}><Text >10 </Text></Col>
        </Row>
        <Row>
          <Col span={24}>
            <Breadcrumb style={{ margin: "0 0" , display:"flex"}}>
              <Breadcrumb.Item>{translate?.projects}</Breadcrumb.Item>
              <Breadcrumb.Item>{translate?.funded_projected}</Breadcrumb.Item>
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
  
  export default FundedProjects;
  