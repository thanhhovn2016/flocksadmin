import React, { useEffect } from "react";
import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  AutoComplete,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Typography,
  Upload,
} from "antd";

// import RichTextEditor from 'react-rte';

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { translate } from "../../components/translate/useTranslate";

import { readUploadFileAsUrl } from "../../components/fileReader/fileReader";
import TextEditor from "../../components/textEditor/textEditor";
import { SpinLoader } from "../../components/space/spin";
import { api } from "../../components/reactQuery/axios";
import { challengeStatistic, faq, faqCategory, IMAGES_PATH } from "../../components/reactQuery/constants";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { manageErrors } from "../../components/errors/manageErrors";
import { ActionTable } from "../../components/actionTable/actionTable";
import {
  CREATE_FAQ,
  DELETE_FAQ,
  UPDATE_ACTIVE_DE_ACTIVE_FAQ,
  UPDATE_FAQ,
} from "../../components/reactQuery/mutations/faq";
import AddQuestion from "../../components/challenge/addQuestion";
import UploadComponent from "../../components/upload/upload";
import {Link, useLocation } from 'react-router-dom'
const { Title, Text } = Typography;
const { Option } = Select;


const Statistics: React.FC = (props:any) => {
  const queryClient = useQueryClient();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('id');
  const failed = new URLSearchParams(search).get("failed")
  const passed = new URLSearchParams(search).get("passed")
  

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [imageUrl, setImageUpload] = useState(null);
  // const [textEditorValue , setTextEditorValue ] = useState<any>(tyVaRichTextEditor.createEmplue())

  const [loadingPage, setLoadingPage] = useState(false);
  const [categoryQueryState, setCategoryQueryState] = useState(false);

  const [investmentState, setInvestmentState] = useState({
    next: 0,
    prev: 0,
    page: 1,
    page_size: 10,
    investment: [],
    search: "",
  });
  const [categoryState, setCategoryState] = useState<{
    page: number;
    page_size: number;
    category: any[];
    search: string;
  }>({
    page: 1,
    page_size: 5,
    category: [],
    search: "",
  });
  const [defaultValueCategory, setDefaultValueCategory] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [contentWithHtmlState, setContentWithHtmlState] = useState("");
  const [contentWithOutHtmlState, setContentWithOutHtmlState] = useState("");
  const [defaultContentPost, setDefaultContentPost] = useState<
    undefined | string
  >(undefined);
  const [filterData, setFilterData] = useState(null);
  const [allQuestionState , setAllQuestionState ] = useState<any[]>([])

  const getInvestmentData = async () => {
    const { data } = await api.get(
      challengeStatistic + `${id}/challenge_history/?expand=challenge,user` +
        `&page=${investmentState?.page}&page_size=${
          investmentState?.page_size
        }&search=${investmentState?.search}&${
          filterData !== null
            ? `result=${filterData}`
            : ""
        }`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("statisticDetails", getInvestmentData, {
    refetchOnWindowFocus: false,
    enabled: loadingPage,
  });


  const { mutate: deleteFAQ } = useMutation(DELETE_FAQ, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("faq");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Delete FAQ successfully.");
      // setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      // setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });

  const handleActionTable = (row: any, actionType: string) => {
    if (actionType === "Update") {
      setValue("title", row?.title);
      setValue("id", row?.id);
      setValue("isActive", row?.isActive);
      setSelectCategory(row?.category?.name);
      setDefaultContentPost(row?.rawContent);
      setModalAddPost(!visibleModalAddPost);
    }
    if (actionType === "Delete") {
      deleteFAQ(row?.id);
      setLoadingPage(true);
    }
  };

  const { mutate: updateActiveAndDeActiveEvent } = useMutation(
    UPDATE_ACTIVE_DE_ACTIVE_FAQ,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("faq");
        const status = values?.data?.status;

        setLoadingPage(true);
        //  setModalAddUser(!visibleModalAddUser);
        setLoadingPage(false);
        manageErrors({ code: "" }, "success", "Your request is successfully.");
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
  const onChangeActiveAndDeActiveFunction = (event: any) => {
    // 
    setLoadingPage(true);
    const variables = {
      isActive: event?.target?.checked,
      id: event?.target?.id,
    };
    updateActiveAndDeActiveEvent(variables);
  };

  const columns = [
    {
      title: translate?.number,
      dataIndex: "number",
      key: "number",
      width: "10%",
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
      title: translate?.title,
      dataIndex: "challenge",
      key: "challengeTitle",
        render: (challenge: any) => {
          return <span>{challenge?.title}</span>;
        },
    },
    {
      title: translate?.challengeDay,
      dataIndex: "challenge",
      key: "challengeDay",
      render: (challenge: any) => {
        return (
          <span>
            {challenge?.challengeDay}
          </span>
        );
      },
    },
    {
      title: translate?.numberOfQuestion,
      dataIndex: "challenge",
      key: "challengeQuestion",
      render: (challenge: any) => {
        return <span>{challenge?.numberOfQuestion}</span>;
      },
    },
    {
      title: translate?.status,
      dataIndex: "result",
      key: "result",
      render: (result: string, row: any) => {
        return (
          <span>
            {result === "passed" && <Tag icon={<CheckCircleOutlined />} color="success">
        {result}
      </Tag>}
      {result === "pending" && <Tag icon={<SyncOutlined spin />} color="processing">
        {result}
      </Tag>}
      { result === "failed" && <Tag icon={<CloseCircleOutlined />} color="error">
        {result}
      </Tag>}
          </span>
        );
      },
    },
    // {
    //   title: translate?.action,
    //   dataIndex: "Action",
    //   key: "Action",
    //   width: "10%",
    //   render: (data: any, row: any) => (
    //     <ActionTable
    //       actions={["Delete", "Update"]}
    //       getActionFunction={handleActionTable}
    //       row={row}
    //     />
    //   ),
    // },
  ];
  const [visibleModalAddPost, setModalAddPost] = useState(false);
  const [visibleModalCreateQuestion , setVisibleModalCreateQuestion] = useState(false)

  const handelOpenModalNewPost = () => {
    setModalAddPost(!visibleModalAddPost);
    
    
  };

  const handelOpenModalCreateQuestion = () => {
    setVisibleModalCreateQuestion(!visibleModalCreateQuestion);
    
    
  };

  const onChangePagination = (event: any) => {
    setLoadingPage(true);

    setInvestmentState((prevState) => ({
      ...prevState,
      page: event?.current,
      page_size: event?.pageSize,
    }));
  };
  const getDataSearch = (textSearch: any) => {
    if (textSearch?.name !== "category") {
      setLoadingPage(true);
    } else {
      setCategoryQueryState(true);
    }
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

  const {
    mutate: createFAQ,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_FAQ, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("faq");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Create FAQ successfully.");
      setLoadingPage(true);
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });
  const { mutate: updateFAQ } = useMutation(UPDATE_FAQ, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("faq");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Update FAQ successfully.");
      setLoadingPage(true);
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });
  const onSubmit = (data: any) => {
    setLoadingPage(true);
    const findCategory = categoryState?.category?.filter((item: any) => {
      return item?.value === selectCategory;
    });
    if (findCategory?.length === 0) {
      return message.error("Select one Category");
    }
    const variables = {
      ...data,
      category: findCategory?.[0]?.id,
      isActive: data?.isActive || data?.isActive === undefined ? true : false,
      content: contentWithOutHtmlState,
      rawContent: contentWithHtmlState,
    };
    if (data?.id) {
      // const UpVariables = {
      //   ...data,
      //   id:data?.id
      // }
      //
      updateFAQ(variables);
    } else {
      delete variables.id;
      console?.log("variables", variables);

      createFAQ(variables);
    }
  };

  

  // const onSearch = (searchText: string) => {

  //   setQueryState({
  //     text: searchText,
  //     name: "category",
  //   });
  //   // setOptions(
  //   //   !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
  //   // );
  // };

  

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);

    setFilterData(event?.key);
    queryClient.invalidateQueries("investment");
  };

  const menu = (
    <Menu>
      <Menu.Item key="passed" onClick={handleFilterFunction}>
        {translate?.pass}
      </Menu.Item>
      <Menu.Item key="failed" onClick={handleFilterFunction}>
        {translate?.failed}
      </Menu.Item>
      <Menu.Item key="pending" onClick={handleFilterFunction}>
        {translate?.pending}
      </Menu.Item>
    </Menu>
  );

 

  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalAddPost}
          title={translate?.challenges}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>

            
               <Col
                span={24} 
                style={{marginTop:"1rem"}}
              >
                <label htmlFor="title" >{translate?.day}</label>
                <Controller
                  control={control}
                  {...register("title", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="title"
                      size="large"
                      name="title"
                      type="text"
                    />
                  )}
                  name="title"
                />
                {errors?.title?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
                
              <Col
                span={24} 
                style={{marginTop:"1rem" }}
                
              >
                <label htmlFor="days" >{translate?.description}</label>
                <Controller
                  control={control}
                  {...register("days", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="days"
                      size="large"
                      name="days"
                      type="text"
                    />
                  )}
                  name="days"
                />
                {errors?.days?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>

              
            
            </Row>
            <Row>
            <Col
                span={24} 
                style={{marginTop:"3rem" , display:"grid" , justifyContent:"center"}}
              >
               <UploadComponent />
              </Col>

            </Row>
          </form>
          <Row>
            {allQuestionState?.map((item) => {
              return (
                <Col span={24}>
                sdf
                </Col>
              )
            })}
          </Row>
        </Modal>
      }
      <Row>
        <Col span={4}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.statistics}
          </Title>
        </Col>
        <Col
          span={16}
          style={{
            display: "grid",
            justifyContent: "start",
            alignItems: "center",
            padding: "5px 10px 0",
          }}
        >
          {/* <Text>{data?.count} post</Text> */}
        </Col>
        <Col
          span={4}
          style={{
            display: "grid",
            justifyContent: "end",
            paddingRight: "5px",
          }}
        >
          {/* <Button
            type="primary"
            icon={<PlusOutlined />}
            // style={{
            //   background: "#393E65",
            //   borderColor: "#393E65",
            // }}
            onClick={handelOpenModalNewPost}
            // disabled
          >
            {translate?.addDay}
          </Button> */}
           <Avatar size={32} icon={<UserOutlined />} src={IMAGES_PATH + data?.results?.[0]?.user?.avatar?.url} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {
            //@ts-ignore
            <Breadcrumb style={{ margin: "0 0", display: "flex" }}>
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.challenges}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item><Link to="/challenge/statistics">{translate?.statistics}</Link></Breadcrumb.Item>

              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.statisticsDetails}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      {/* <Row>
        <Col></Col>
        <Col>{data?.results?.[0]?.user?.fullName}</Col>
      </Row> */}
      <Row style={{ margin: "1rem 0 1rem 0 " ,  display:"flex" , justifyContent:"flex-end" }}>
        <Col span={15} style={{display:"flex" , gap:"1rem"}}>
            <Card style={{width:"30%" , borderRadius:"10px" , border:"1px solid #FF4040"}}>
                <Text>Failed</Text>
                <Title level={5} style={{marginTop:"5px" , color:"#FF4040"}}>{failed}</Title>
            </Card>
            <Card style={{width:"30%" , borderRadius:"10px" , border:"1px solid #A8C301"}}>
            <Text>Pass</Text>
                <Title level={5} style={{marginTop:"5px" , color:"#A8C301"}}>{passed}</Title>
            </Card>
            {/* <Card style={{width:"30%" , borderRadius:"10px" , border:"1px solid #D7D7D7"}}>
            <Text>Score</Text>
                <Title level={5} style={{marginTop:"5px" , color:"#393E65"}}>65</Title>
            </Card> */}
        </Col>
        <Col span={6}>
          <Input
            placeholder={translate?.search}
            prefix={<SearchOutlined />}
            onChange={handleChangeSearchFunction}
          />
        </Col>
        {/* <Col span={2}>
          <Button
            type="default"
            shape="default"
            icon={<FilterOutlined />}
            size={"middle"}
            style={{ borderRadius: "7px", marginLeft: "5px" }}
            disabled
          >
            {translate?.filter}
          </Button>
        </Col> */}
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
      {/* <div style={{height:"50vh" , overflowY:"auto"}}> */}
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
      {/* </div> */}
    </div>
  );
};

export default Statistics;
