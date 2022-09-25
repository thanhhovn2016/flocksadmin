import React, { useEffect } from "react";
import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import Delete from '../../components/icons/delete'
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

import { readUploadFileAsUrl } from "../../components/fileReader/fileReader";
import TextEditor from "../../components/textEditor/textEditor";
import { SpinLoader } from "../../components/space/spin";
import { api } from "../../components/reactQuery/axios";
import {
  challengeDay,
  challengeItem,
  faq,
  faqCategory,
} from "../../components/reactQuery/constants";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { manageErrors } from "../../components/errors/manageErrors";
import { ActionTable } from "../../components/actionTable/actionTable";

import AddQuestion from "../../components/challenge/addQuestion";
import { CREATE_CHALLENGE, DELETE_CHALLENGE, UPDATE_CHALLENGE } from "../../components/reactQuery/mutations/challenge";
import TextArea from "antd/lib/input/TextArea";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;
const { Option } = Select;
const ChallengeList: React.FC = () => {
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
  const [addQuestionState, setAddQuestionState] = useState(true);
  const [selectCategory, setSelectCategory] = useState("");
  const [contentWithHtmlState, setContentWithHtmlState] = useState("");
  const [contentWithOutHtmlState, setContentWithOutHtmlState] = useState("");
  const [defaultContentPost, setDefaultContentPost] = useState<
    undefined | string
  >(undefined);
  const [filterData, setFilterData] = useState(null);
  const [allQuestionState, setAllQuestionState] = useState<any[]>([]);
  const [challengeDayState , setChallengeDayState] = useState({
    id:0,
    value:"Day 1"
  })

  const getInvestmentData = async () => {
    const { data } = await api.get(
      challengeItem
       +
        `?expand=challenge_day&page=${investmentState?.page}&page_size=${
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
  const { isLoading, data, error } = useQuery(
    "challengeList",
    getInvestmentData,
    {
      refetchOnWindowFocus: false,
      enabled: loadingPage,
    }
  );
  
  // useEffect(() => {
  //   if (categoryState?.category?.length === 0) {
  //     getCategoryPosts();
  //   }
  // }, []);
  // const getCategoryPosts = async () => {
  //   const { data } = await api.get(
  //     faqCategory +
  //       `?page=${categoryState?.page}&page_size=${categoryState?.page_size}&search=${categoryState?.search}`
  //   );
  //   // setLoadingPage(false);
  //   const categoryData = data?.results?.map((item: any) => {
  //     return { id: item?.id, value: item?.name };
  //   });
  //   let next: string | null = "";
  //   if (data?.next) {
  //     const params = new URL(data?.next).searchParams;
  //     next = params.get("page");
  //   }
  //   const allCategory = [...categoryData, ...categoryState?.category];
  //   var fileList = allCategory.filter(function (elem, i, rep) {
  //     return i == rep.indexOf(elem);
  //   });
  //   setCategoryState((prevState) => ({
  //     ...prevState,
  //     page: parseInt(next ? next : "1"),
  //     category: [...fileList],
  //   }));
  //   return data;
  // };

  // const FAQCategory = useQuery("FAQCategory", getCategoryPosts);

  const { mutate: deleteChallenge } = useMutation(DELETE_CHALLENGE, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("challengeList");
      const status = values?.data?.status;
      setLoadingPage(true)
      manageErrors({ code: "" }, "success", "Delete Challenge successfully.");
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
      console.log("row" , row)
      setValue("title", row?.title);
      setValue("titleVi" , row?.titleVi)
      setValue("id", row?.id);
      // setValue("challengeDay", row?.challengeDay);
      setChallengeDayState({
        id:row?.challengeDay,
        value:""
      })
      setValue("numberOfQuestion" , row?.numberOfQuestion)
      setValue("description", row?.description)
      setValue("descriptionVi" , row?.descriptionVi)
      // setSelectCategory(row?.category?.name);
      // setDefaultContentPost(row?.rawContent);
      setModalAddPost(!visibleModalAddPost);
      setAddQuestionState(false)
    }
    if (actionType === "Delete") {
      deleteChallenge(row?.id);
      setLoadingPage(true);
    }
    if (actionType === "Question Manage"){
      navigate(`/challenge/questionManage/?id=${row?.id}`)
    }
  };

  // const { mutate: updateActiveAndDeActiveEvent } = useMutation(
  //   UPDATE_ACTIVE_DE_ACTIVE_FAQ,
  //   {
  //     onSuccess: (values: any) => {
  //       queryClient.invalidateQueries("challengeList");
  //       const status = values?.data?.status;

  //       setLoadingPage(true);
  //       //  setModalAddUser(!visibleModalAddUser);
  //       setLoadingPage(false);
  //       manageErrors({ code: "" }, "success", "Your request is successfully.");
  //       if (status === 200) {
  //         // message.success(values?.data?.message);
  //         // history.push("/");
  //       } else {
  //         // manageServeErrors(values);
  //       }
  //     },
  //     onError: (error) => {
  //       setLoadingPage(false);
  //       manageErrors(error, "error");
  //     },
  //   }
  // );
  // const onChangeActiveAndDeActiveFunction = (event: any) => {
  //   // 
  //   setLoadingPage(true);
  //   const variables = {
  //     isActive: event?.target?.checked,
  //     id: event?.target?.id,
  //   };
  //   updateActiveAndDeActiveEvent(variables);
  // };

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
      title: translate?.question,
      dataIndex: "title",
      key: "title",
      //   render: (category: any) => {
      //     return <span>{category?.name}</span>;
      //   },
    },
    {
      title: translate?.description,
      dataIndex: "description",
      key: "description",
      render: (description: string) => {
        return (
          <span>
            {description?.slice(0, 80)} {description?.length > 80 ? "..." : ""}
          </span>
        );
      },
    },
    {
      title: translate?.numberOfQuestion,
      dataIndex: "numberOfQuestion",
      key: "numberOfQuestion",
      // render: (category: any) => {
      //   return <span>{category?.name}</span>;
      // },
    },
    // {
    //   title: translate?.isActive,
    //   dataIndex: "isActive",
    //   key: "isActive",
    //   render: (isActive: boolean, row: any) => {
    //     return (
    //       <span>
    //         <Checkbox
    //           id={row?.id}
    //           onChange={onChangeActiveAndDeActiveFunction}
    //           checked={isActive}
    //         ></Checkbox>
    //       </span>
    //     );
    //   },
    // },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      width: "10%",
      render: (data: any, row: any) => (
        <ActionTable
          actions={["Delete",
           "Update",
           "Question Manage"
          ]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];
  const [visibleModalAddPost, setModalAddPost] = useState(false);
  const [visibleModalCreateQuestion, setVisibleModalCreateQuestion] =
    useState(false);

  const handelOpenModalNewPost = () => {
    setValue("title" , "")
    setValue("titleVi" , "")
    setValue("description" , "")
    setValue("descriptionVi" , "")
   setAllQuestionState([])
   setValue("id", null)
   setAddQuestionState(true)
    
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
    mutate: createChallenge,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_CHALLENGE, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("challengeList");
      const status = values?.data?.status;
      setAllQuestionState([])

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
  const { mutate: updateChallenge } = useMutation(UPDATE_CHALLENGE, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("challengeList");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Update challenge successfully.");
      setLoadingPage(true);
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      setAddQuestionState(false)
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
  const getChallengeDay = async() => {
    const {data} = await api.get(challengeDay + "?page=1&page_size=50")
    return data
  }
  const challengeDayData = useQuery("getChallengeDay" , getChallengeDay)

  if (challengeDayData?.data?.results && challengeDayState?.value === ""){
    setChallengeDayState({
      value:challengeDayData?.data?.results?.[0]?.name,
      id:challengeDayData?.data?.results?.[0]?.id
    })
  }
  const onSubmit = (data: any) => {
    setLoadingPage(true)
    
    
    if (data?.id){
      const variables = {
        ...data,
        challengeDay: challengeDayState?.id,
      };
    updateChallenge(variables)
      setAddQuestionState(false)
    }else{

      const questions = allQuestionState?.map((item) => {
        const answer = item?.multipleChoiceValues?.map((items: any) => {
          return {
            value: items?.value,
            isCorrect: items?.answer,
          };
        });
  
        return {
          ...(answer?.length > 0 ? {answerText:answer} : {}),
          challengeType: item?.challengeType,
          questionType: item.questionType,
          title: item?.title,
          titleVi: item?.titleVi,
          hint: item?.data?.hint,
          hintVi: item.data.hintVi,
        };
      });
  
      const variables = {
        ...data,
        questions,
        challengeDay: challengeDayState?.id,
      };
  
      createChallenge(variables)
    }
    
  
  };

  const onSelect = (data: string) => {
    //

    setSelectCategory(data);
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

  const handleGetContentHtmlFunction = (
    content: string,
    contentText: string
  ) => {
    //
    setContentWithHtmlState(content);
    setContentWithOutHtmlState(contentText);
  };

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

  const handleGetQuestionChallenge = (dataQuestion: any) => {
    setVisibleModalCreateQuestion(dataQuestion?.modalStatus);

    console.log("data question" , dataQuestion)
    if (dataQuestion.data)
      setAllQuestionState((prevState) => [...prevState, { ...dataQuestion }]);
  };

  const handleDeleteQuestion = (event:React.MouseEvent) => {
    const id = parseInt(event.currentTarget?.id)
    const  filterItem = allQuestionState?.filter((item , index) => {
      return id !== index
    })
    setAllQuestionState([...filterItem])
  }

  const handleChangeSelectChallengeDay = (event:any , dataSelect:any) =>{
    console.log("event"  , event , " ===> " , dataSelect)
    
    
    setChallengeDayState({
      id:event,
      value:dataSelect?.children
    })
    

  }

  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}

      {visibleModalCreateQuestion && (
        <div>
          <AddQuestion
            visibleModalCreateQuestion={visibleModalCreateQuestion}
            getData={handleGetQuestionChallenge}
          />
        </div>
      )}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalAddPost}
          title={translate?.addNewChallenge}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24} style={{ marginTop: "1rem" }}>
                <label htmlFor="challengeDay">{translate?.day}</label>
                <Controller
                  control={control}
                  {...register("challengeDay", { required: false })}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      value={challengeDayState?.value}
                      // defaultValue="input_text"
                      onChange={handleChangeSelectChallengeDay}
                      style={{ width: "100%", border: "none" }}
                    >
                      {challengeDayData?.data?.results?.map((item:any) => <Option key={item?.id} id={`${item?.id}`}>{translate?.day + " " + item?.dayNumber}</Option>)}
                      {/* <Option key="input_text">{translate?.inputText}</Option>
                      <Option key="single_choice">
                        {translate?.singleChoice}
                      </Option>
                      <Option key="multiple_choice">
                        {translate?.multipleChoice}
                      </Option>
                      <Option key="slider">{translate?.slider}</Option> */}
                    </Select>
                    // <Input
                    //   {...field}
                    //   id="challengeDay"
                    //   size="large"
                    //   name="challengeDay"
                    //   type="text"
                    // />
                  )}
                  name="challengeDay"
                />
                {errors?.challengeDay?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={11} style={{ marginTop: "1rem" }}>
                <label htmlFor="title">{translate?.title}</label>
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
              <Col span={11} style={{ marginTop: "1rem" }}>
                <label htmlFor="titleVi">{translate?.title} VI</label>
                <Controller
                  control={control}
                  {...register("titleVi", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="titleVi"
                      size="large"
                      name="titleVi"
                      type="text"
                    />
                  )}
                  name="titleVi"
                />
                {errors?.titleVi?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>

              <Col span={11} style={{ marginTop: "1rem" }}>
                <label htmlFor="description">{translate?.description}</label>
                <Controller
                  control={control}
                  {...register("description", { required: true })}
                  render={({ field }) => (
                    <TextArea
                      {...field}
                      id="description"
                      size="large"
                      name="description"
                      // type="text"
                      rows={3}
                    />
                  )}
                  name="description"
                />
                {errors?.description?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput} VI</Text>
                )}
              </Col>
              <Col span={11} style={{ marginTop: "1rem" }}>
                <label htmlFor="descriptionVi">
                  {translate?.description} VI
                </label>
                <Controller
                  control={control}
                  {...register("descriptionVi", { required: true })}
                  render={({ field }) => (
                    <TextArea 
                      {...field}
                      id="descriptionVi"
                      size="large"
                      name="descriptionVi"
                      // type="text"
                      rows={3}
                    />
                  )}
                  name="descriptionVi"
                />
                {errors?.descriptionVi?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              {/* <Col
                span={24} 
                style={{marginTop:"1rem" }}
                
              >
                <label htmlFor="day" >{translate?.day}</label>
                <Controller
                  control={control}
                  {...register("day", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="day"
                      size="large"
                      name="days"
                      type="number"
                    />
                  )}
                  name="day"
                />
                {errors?.day?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col> */}

             { addQuestionState &&<Col
                span={24}
                style={{
                  background: "#F5F5F5",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginTop: "2rem",
                }}
                onClick={handelOpenModalCreateQuestion}
              >
                <PlusOutlined style={{ marginRight: "1rem" }} />
                <Text>Add Question</Text>
              </Col>}
            </Row>
          </form>
          <Row>
            {allQuestionState?.map((item, index) => {
              // 
              return (
                <Col
                  span={24}
                  style={{
                    display: "grid",
                    justifyContent: "space-between",
                    gridTemplateColumns: " auto auto",
                    background: "#F5F5F5",
                    padding: "0.5rem 1rem",
                    borderRadius: "5px",
                    marginTop: "1rem",
                    gap:"1rem"
                  }}
                >
                  {item?.textInEditor?.length > 100 ? `${item?.textInEditor.slice(0 ,80)} ...` : item?.textInEditor}
                  {/* <div dangerouslySetInnerHTML={{ __html: item?.title }} /> */}
                  <span style={{ paddingRight: "1.5rem", color: "#cacaca" }}>
                    {item?.questionType}
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "0.5rem",
                      cursor: "pointer",
                    }}
                    id={`${index}`}
                    onClick={handleDeleteQuestion}
                  >
                    <Delete />
                  </span>
                </Col>
              );
            })}
          </Row>
        </Modal>
      }
      <Row>
        <Col span={4}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.challengeList}
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
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // style={{
            //   background: "#393E65",
            //   borderColor: "#393E65",
            // }}
            onClick={handelOpenModalNewPost}
            // disabled
          >
            {translate?.addChallenge}
          </Button>
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
                <Breadcrumb.Item>{translate?.challengeList}</Breadcrumb.Item>
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

export default ChallengeList;
