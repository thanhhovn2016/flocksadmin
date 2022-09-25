import React, { useEffect } from "react";
import {
  DeleteOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  MoreOutlined,
  SyncOutlined,
  CloseCircleOutlined
} from "@ant-design/icons";
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Dropdown,
  Image,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Steps,
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
import { challengeReview, faq, faqCategory } from "../../components/reactQuery/constants";
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
import { UPDATE_CHALLENGE_STATUS } from "../../components/reactQuery/mutations/challenge";
const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;
const ChallengeDay: React.FC = () => {
  const queryClient = useQueryClient();

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
  const [allQuestionState, setAllQuestionState] = useState<any[]>([]);
  const [challengeDetails , setChallengeDetails] = useState<any>(null)

  const getInvestmentData = async () => {
    const { data } = await api.get(
      challengeReview +
        `?expand=user,avatar,challenge_user_answer,challenge_user_answer.question,challenge&page=${investmentState?.page}&page_size=${
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
  const { isLoading, data, error } = useQuery("challengeReview", getInvestmentData, {
    refetchOnWindowFocus: false,
    enabled: loadingPage,
  });

  // const { mutate: deleteFAQ } = useMutation(DELETE_FAQ, {
  //   onSuccess: (values: any) => {
  //     queryClient.invalidateQueries("challengeReview");
  //     const status = values?.data?.status;

  //     manageErrors({ code: "" }, "success", "Delete FAQ successfully.");
  //     // setModalAddPost(!visibleModalAddPost);
  //     setLoadingPage(false);
  //     if (status === 200) {
  //       // message.success(values?.data?.message);
  //       // history.push("/");
  //     } else {
  //       // manageServeErrors(values);
  //     }
  //   },
  //   onError: (error) => {
  //     // setModalAddPost(!visibleModalAddPost);
  //     setLoadingPage(false);
  //     manageErrors(error, "error");
  //   },
  // });
// const getChallengeDetails = async (id:number) => {
//   const {data} = await api.get(challengeReview + `${id}/?expand=challenge_user_answer`)
//   return data
// }
  const handleActionTable = async (row: any, actionType: string) => {
    
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
    if (actionType === "View" ){
      // const challengeData = await getChallengeDetails(row?.id)
      // 
      setChallengeDetails(row)
      setModalAddPost(!visibleModalAddPost)
    }
  };

  const { mutate: updateActiveAndDeActiveEvent } = useMutation(
    UPDATE_ACTIVE_DE_ACTIVE_FAQ,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("challengeReview");
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
      dataIndex: "user",
      key: "user",
      render: (user: any) => {
        return (
          <span>
            {user?.fullName}
          </span>
        );
      },
    },
    {
      title:translate?.title,
      dataIndex:"challenge",
      key:"challengeTitle",
      render : (challenge:any) => {
        return <span>{challenge?.title}</span>
      }
    },
    {
      title: translate?.challenges,
      dataIndex: "challenge",
      key: "challengeNumber",
      render: (challengeNumber: any) => {
        return <span>{challengeNumber?.id}</span>;
      },
    },
    {
      title:translate?.status,
      dataIndex:"result",
      key:"result",
      render : (result:string)=>{
        return(
          <span>
             {result === "passed" && <Tag icon={<CheckCircleOutlined />} color="success">
        {result}
      </Tag>}
      { result === "pending" && <Tag icon={<SyncOutlined spin />} color="processing">
        {result}
      </Tag>}
     { result === "rejected" && <Tag icon={<CloseCircleOutlined />} color="error">
        result
      </Tag>}
          </span>
        )
      }
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
          // "Update"
          "View"
        ]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];
  const [visibleModalAddPost, setModalAddPost] = useState(false);
  

  const handelOpenModalNewPost = () => {
    setChallengeDetails(null)
    setModalAddPost(!visibleModalAddPost);
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

  // const {
  //   mutate: createFAQ,
  //   isLoading: verifyLoading,
  //   reset: verifyReset,
  // } = useMutation(CREATE_FAQ, {
  //   onSuccess: (values: any) => {
  //     queryClient.invalidateQueries("challengeReview");
  //     const status = values?.data?.status;

  //     manageErrors({ code: "" }, "success", "Create FAQ successfully.");
  //     setLoadingPage(true);
  //     setModalAddPost(!visibleModalAddPost);
  //     setLoadingPage(false);
  //     if (status === 200) {
  //       // message.success(values?.data?.message);
  //       // history.push("/");
  //     } else {
  //       // manageServeErrors(values);
  //     }
  //   },
  //   onError: (error) => {
  //     setModalAddPost(!visibleModalAddPost);
  //     setLoadingPage(false);
  //     manageErrors(error, "error");
  //   },
  // });
  const { mutate: updateChallengeStatus } = useMutation(UPDATE_CHALLENGE_STATUS, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("challengeReview");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Update challenge status successfully.");
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
  // const onSubmit = (data: any) => {
  //   setLoadingPage(true);
  //   const findCategory = categoryState?.category?.filter((item: any) => {
  //     return item?.value === selectCategory;
  //   });
  //   if (findCategory?.length === 0) {
  //     return message.error("Select one Category");
  //   }
  //   const variables = {
  //     ...data,
  //     category: findCategory?.[0]?.id,
  //     isActive: data?.isActive || data?.isActive === undefined ? true : false,
  //     content: contentWithOutHtmlState,
  //     rawContent: contentWithHtmlState,
  //   };
  //   if (data?.id) {
  //     // const UpVariables = {
  //     //   ...data,
  //     //   id:data?.id
  //     // }
  //     //
  //     updateFAQ(variables);
  //   } else {
  //     delete variables.id;
  //     console?.log("variables", variables);

  //     createFAQ(variables);
  //   }
  // };

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
      <Menu.Item key="pending" onClick={handleFilterFunction}>
        {translate?.pending}
      </Menu.Item>
      <Menu.Item key="failed" onClick={handleFilterFunction}>
        {translate?.failed}
      </Menu.Item>
      <Menu.Item key="passed" onClick={handleFilterFunction}>
        {translate?.pass}
      </Menu.Item>
      {/* <Menu.Item key="rejected" onClick={handleFilterFunction}>
        {translate?.reject}
      </Menu.Item> */}
    </Menu>
  );

  const [current, setCurrent] = useState(0);

  const onChange = (value: number) => {
    
    setCurrent(value);
  };
const handleChangeStatusChallenge = (event:React.MouseEvent) =>{
  const result = event.currentTarget?.id
  const variables = {
    id:challengeDetails?.challenge?.id,
    result:result
  }
  updateChallengeStatus(variables)
  
}
  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalAddPost}
          // visible={true}
          title={translate?.review}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleChangeStatusChallenge} id="passed" >
              {translate?.pass}
            </Button>,
             <Button type="primary" onClick={handleChangeStatusChallenge} id="failed">
             {translate?.failed}
           </Button>,
          ]}
        >
          <Row>
            <Col
              span={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "1rem",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <Image src={"/assets/images/user.png"} />
              </span>
              <span style={{ display: "grid", marginLeft: "0.5rem" }}>
                <Title level={5}>{challengeDetails?.user?.fullName}</Title>
                <Text>Days {challengeDetails?.challenge?.challengeDay}</Text>
              </span>
            </Col>
            <Col
              span={11}
              style={{
                marginRight: "1rem",
                borderLeft: "1px solid rgba(57, 62, 101, 0.5)",
                paddingLeft: "1rem",
                alignItems: "center",
                display: "grid",
              }}
            >
              <Title level={5}>{challengeDetails?.challenge?.title}</Title>
              <Text> Status : {challengeDetails?.result}</Text>
            </Col>
          </Row>
          <Row style={{
            margin:"2rem 5rem",
            justifyContent:"center"
          }}>
            {
              //@ts-ignore
              <Steps current={current} onChange={onChange} >
                {challengeDetails?.challengeUserAnswer?.map((item:any , index:number) => {
                  return <Step title="" description=""  />
                })}
               {/* <Step title="" description="" />
              <Step title="" description="" />
              <Step title="" description=""/> */}
            </Steps>}
          </Row>
          <Row>
            <Col span={24}>
              {translate.question}
            </Col>
            <Col span={24}>
              <span style={{
                display: "grid",
                border: "1px solid #C8C8C8",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "0.5rem",
              }}><div dangerouslySetInnerHTML={{__html:challengeDetails?.challengeUserAnswer?.[current]?.question?.title}}/></span>
            </Col>
          </Row>
          <Row style={{marginTop:"1rem"}}>
          <Col span={20}>
              {translate.answer}
            </Col>
            <Col span={4}>{challengeDetails?.challengeUserAnswer?.[current]?.question?.questionType}</Col>
            { (challengeDetails?.challengeUserAnswer?.[current]?.question?.questionType === "input_text"||
            challengeDetails?.challengeUserAnswer?.[current]?.question?.questionType === "question_answer")
            &&<Col span={24}>
              <span style={{
                display: "grid",
                border: "1px solid #C8C8C8",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "0.5rem",
              }}>{challengeDetails?.challengeUserAnswer?.[current]?.answer}</span>
            </Col>}
            {(challengeDetails?.challengeUserAnswer?.[current]?.question?.questionType === "single_choice" ||
            challengeDetails?.challengeUserAnswer?.[current]?.question?.questionType === "boolean") &&
            challengeDetails?.challengeUserAnswer?.[current]?.question?.answerText?.map((item :any , index:number) => {
              
              return (
                <Col span={24} id={`${index}`}>
              <span style={{
                display: "grid",
                border: "1px solid #C8C8C8",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "0.5rem",
              }}>{item?.value}</span>
            </Col>
              )
            })
            }
            {/* <Col span={24}>
              <span style={{
                display: "grid",
                border: "1px solid #C8C8C8",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "0.5rem",
              }}>B. Option 2</span>
            </Col>
            <Col span={24}>
              <span style={{
                display: "grid",
                border: "1px solid #C8C8C8",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "0.5rem",
              }}>C. Option 3</span>
            </Col>
            <Col span={24}>
              <span style={{
                display: "grid",
                border: "1px solid #C8C8C8",
                padding: "0.5rem 1rem",
                borderRadius: "5px",
                marginTop: "0.5rem",
              }}>D. Option 4</span>
            </Col> */}
          </Row>
          <Row>
            <Col span={24} style={{
              justifyContent:"space-between",
              display:"flex",
              marginTop:"2rem"
            }}>
              <Button onClick={() => {
                setCurrent(current -1)
              }} type="text" disabled={current=== 0}>{translate?.previous}</Button>
               <Button onClick={()=> {
                setCurrent(current + 1)
              }} type="text" disabled={challengeDetails?.challengeUserAnswer?.length - 1 === current}>{translate?.next}</Button>
            </Col>
            
          </Row>
        </Modal>
      }
      <Row>
        <Col span={4}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.review}
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
                <Breadcrumb.Item>{translate?.review}</Breadcrumb.Item>
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

export default ChallengeDay;
