import {
    DownloadOutlined,
    FilterOutlined,
    MoreOutlined,
    SearchOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    DeleteOutlined
  } from "@ant-design/icons";
  import {
    Breadcrumb,
    Button,
    Col,
    Dropdown,
    Image,
    Input,
    Menu,
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
  import { api } from "../../components/reactQuery/axios";
  import { companies, companyPresentation, IMAGES_PATH } from "../../components/reactQuery/constants";
  import { SpinLoader } from "../../components/space/spin";
  import { translate } from "../../components/translate/useTranslate";
  import { presentation } from "../../components/zustand/store";
  import { useNavigate } from "react-router-dom";
  import Hot from '../../components/project/icons/hot'
  import Trending from "../../components/project/icons/tridding"  
import { DELETE_PROJECT_QUESTION } from "../../components/reactQuery/mutations/porjects";
import { manageErrors } from "../../components/errors/manageErrors";
import { CHANGE_STATUS_PROJECT_PRESENTATION } from "../../components/reactQuery/mutations/presentation";
  const { Title, Text } = Typography;
  
  const Presentation = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loadingPage, setLoadingPage] = useState(false);
    const setPresentationDetails = presentation((state: any) => state.setPresentationDetails);
    const [investmentState, setInvestmentState] = useState({
      next: 0,
      prev: 0,
      page: 1,
      page_size: 10,
      investment: [],
      search: "",
    });
    const [filterData, setFilterData] = useState(null);




    
  const { mutate: changeStatusProjectPresentation } = useMutation(
    CHANGE_STATUS_PROJECT_PRESENTATION,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("presentation");
        const status = values?.data?.status;

        setLoadingPage(true);
        // setModalAddUser(!visibleModalAddUser);
        setLoadingPage(false);
        manageErrors({ code: "" }, "success", "Update is successfully.");
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
    }
  );


    const handleActionTable = (row: any, actionType: string) => {
      if (actionType === "details") {
        setPresentationDetails(row);
        navigate("/projects/presentationDetails");
      }
      if (actionType === "Un Mark Hot" ){
        const variable = {
          id:row?.id,
          isHot:!row?.isHot
        }
        setLoadingPage(true)
        changeStatusProjectPresentation(variable)
      }
      if (actionType === "Mark As Hot" ){
        const variable = {
          id:row?.id,
          isHot:!row?.isHot
        }
        setLoadingPage(true)
        changeStatusProjectPresentation(variable)
      }
      if (actionType === "Un Mark Trending" ){
        const variable = {
          id:row?.id,
          isTrending:!row?.isTrending
        }
        changeStatusProjectPresentation(variable)
      }
      if (actionType === "Mark As Trending"){
        const variable = {
          id:row?.id,
          isTrending:!row?.isTrending
        }
        changeStatusProjectPresentation(variable)
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
        title: translate?.coverImage,
        dataIndex: "coverImage",
        key: "coverImage",
        render: (coverImage:any) => {
            return (
                <Image src={IMAGES_PATH + coverImage?.url} width="80px" style={{maxHeight:"70px"}}/>
            )

        }
      },
      {
        title: translate?.abstract,
        dataIndex: "abstract",
        key: "abstract",
        render: (abstract:string) => (<span>
            {abstract?.length > 50 ? (
              <span>{abstract?.slice(0, 50)}...</span>
            ) : (
              <span>{abstract}</span>
            )}
        </span>)
      },
    //   {
    //     title: translate?.phoneNumber,
    //     dataIndex: "phoneNumber",
    //     key: "phoneNumber",
    //   },
      {
        title: translate?.companyName,
        dataIndex: "companyName",
        key: "companyName",
      },
      {
        title: translate?.isHot,
        dataIndex: "isHot",
        key: "isHot",
        render:(isHot:boolean) =>{
          return <span>
            {isHot ? <Hot /> : "___"}
          </span>
        }
      },
      {
        title: translate?.isTrending,
        dataIndex: "isTrending",
        key: "isTrending",
        render:(isTrending:boolean) =>{
          return <span>
            {isTrending ? <Trending /> : "___"}
          </span>
        }
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
            actions={["Details" , row?.isHot ? "Un Mark Hot" : "Mark As Hot" , row?.isTrending ? "Un Mark Trending" : "Mark As Trending"]}
            getActionFunction={handleActionTable}
            row={row}
          />
        ),
      },
    ];
  
    const getInvestmentData = async () => {
      const { data } = await api.get(
        companyPresentation +
          `?expand=cover_image&page=${investmentState?.page}&page_size=${
            investmentState?.page_size
          }&search=${investmentState?.search}${
            filterData !== null ? `&status=${filterData}` : ""
          } `
      );
      setLoadingPage(false);
      return data;
    };
    const { isLoading, data, error } = useQuery("presentation", getInvestmentData ,{
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
        <Row style={{ margin: "0 0 1rem 0 " ,  display:"flex" , justifyContent:"flex-end"  }}>
          {/* <Col span={13}></Col> */}
          <Col span={8}>
            <Input
              placeholder={translate?.search}
              prefix={<SearchOutlined />}
              onChange={handleChangeSearchFunction}
            />
          </Col>
          <Col span={"auto"}>
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
                // disabled
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
  
  export default Presentation;
  