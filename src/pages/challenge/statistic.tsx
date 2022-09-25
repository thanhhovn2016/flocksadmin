import React, { useEffect } from "react";
import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  AutoComplete,
  Breadcrumb,
  Button,
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
import { useNavigate  } from "react-router-dom";

import { readUploadFileAsUrl } from "../../components/fileReader/fileReader";
import TextEditor from "../../components/textEditor/textEditor";
import { SpinLoader } from "../../components/space/spin";
import { api } from "../../components/reactQuery/axios";
import { challengeStatistic, faq, faqCategory } from "../../components/reactQuery/constants";
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


const { Title, Text } = Typography;
const { Option } = Select;



const Statistics: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()

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
      challengeStatistic +
        `?page=${investmentState?.page}&page_size=${
          investmentState?.page_size
        }&search=${investmentState?.search}&${
          filterData !== null
            ? `is_active=${filterData === "Active" ? true : false}`
            : ""
        }`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("faq", getInvestmentData, {
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
    // if (actionType === "Update") {
    //   setValue("title", row?.title);
    //   setValue("id", row?.id);
    //   setValue("isActive", row?.isActive);
    //   setSelectCategory(row?.category?.name);
    //   setDefaultContentPost(row?.rawContent);
    //   setModalAddPost(!visibleModalAddPost);
    // }
    // if (actionType === "Delete") {
    //   deleteFAQ(row?.id);
    //   setLoadingPage(true);
    // }
    if (actionType === "details"){
      navigate(`/challenge/statisticsDetails/?id=${row?.id}&failed=${row?.failedChallenge}&passed=${row?.passedChallenge}`)
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
      title: translate?.photo,
      dataIndex: "avatar",
      key: "avatar",
      //   render: (category: any) => {
      //     return <span>{category?.name}</span>;
      //   },
    },
    {
      title: translate?.name,
      dataIndex: "firstName",
      key: "firstName",
      render: (firstName: string , row:any) => {
        return (
          <span>
            {firstName} ({row?.lastName})
          </span>
        );
      },
    },
    {
      title: translate?.pass,
      dataIndex: "passedChallenge",
      key: "passedChallenge",
      // render: (category: any) => {
      //   return <span>{category?.name}</span>;
      // },
    },
    {
      title: translate?.failed,
      dataIndex: "failedChallenge",
      key: "failedChallenge",
      // render: (isActive: boolean, row: any) => {
      //   return (
      //     <span>
      //       <Checkbox
      //         id={row?.id}
      //         onChange={onChangeActiveAndDeActiveFunction}
      //         checked={isActive}
      //       ></Checkbox>
      //     </span>
      //   );
      // },
    },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      width: "10%",
      render: (data: any, row: any) => (
        <ActionTable
          actions={[
            // "Delete", "Update"
            "Details"
          ]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
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
      <Menu.Item key="Active" onClick={handleFilterFunction}>
        {translate?.active}
      </Menu.Item>
      <Menu.Item key="DeActive" onClick={handleFilterFunction}>
        {translate?.deActive}
      </Menu.Item>
      {/* <Menu.Item key="rejected" onClick={handleFilterFunction}>
        {translate?.reject}
      </Menu.Item> */}
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
                <Breadcrumb.Item>{translate?.statistics}</Breadcrumb.Item>
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
              disabled
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
