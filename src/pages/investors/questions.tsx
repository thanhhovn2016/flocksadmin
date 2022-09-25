import {
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Input,
  Menu,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
} from "antd";

import { Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../../components/reactQuery/axios";
import {
  addInvestmentQuestion,
  getInvestmentQuestion,
  investment,
  investmentQuestionClass,
  lastOrderInvestment,
  lastOrderInvestmentQuestion,
  lastOrderProjectQuestion,
} from "../../components/reactQuery/constants";
import { GET_INVESTMENT } from "../../components/reactQuery/queries/investment";
import { translate } from "../../components/translate/useTranslate";
import { SpinLoader } from "../../components/space/spin";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { Controller, useForm } from "react-hook-form";
import { manageErrors } from "../../components/errors/manageErrors";
import {
  ADD_INVESTMENT_QUESTION,
  ADD_INVESTMENT_QUESTION_CLASS,
  DELETE_INVESTMENT_QUESTION,
  UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS,
  UPDATE_ACTIVE_DE_ACTIVE_QUESTION_INVESTOR,
  UPDATE_INVESTMENT_QUESTION,
} from "../../components/reactQuery/mutations/investment";
import { ActionTable } from "../../components/actionTable/actionTable";
import { questionClassInvestors } from "../../components/zustand/store";
import { Link } from "react-router-dom";
import DropDownComponent from "../../components/custom/dropdown";

const { Title, Text } = Typography;
const { Option } = Select;

const Investors = () => {
  const queryClient = useQueryClient();
  const questionClass = questionClassInvestors((state: any) => state?.question);
  // const setQuestionClassId = questionClassInvestors((state:any) => state?.setQuestionClassId)
  const [loadingPage, setLoadingPage] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [widgetTypeInput, setWidgetTypeInput] = useState("input_text");
  const [defaultAnswerState, setDefaultAnswerState] = useState<
    { answerText: string; answerTextVi: string; id?: number }[]
  >([]);
  const [deletedAnswer , setDeletedAnswer] = useState<number[] | null>(null)
  const [filterData, setFilterData] = useState<string | null>(null);

  const [investmentState, setInvestmentState] = useState({
    next: 0,
    prev: 0,
    page: 1,
    page_size: 10,
    investment: [],
    search: "",
  });
  const [visibleModalAddUser, setModalAddUser] = useState(false);

  const getInvestmentData = async () => {
    try {
      const { data } = await api.get(
        getInvestmentQuestion +
          `?question_class=${questionClass?.id}&page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}&${
            filterData !== null ? `&is_active=${filterData === "active" ? true : false}` : ""
          }`
      );
      setLoadingPage(false);
      return data;
    } catch (error) {
      setLoadingPage(false);
      manageErrors(error, "error");
    }
  };

  const { isLoading, data, error } = useQuery(
    "investorQuestionInvestor",
    getInvestmentData,{
      refetchOnWindowFocus: false,
      enabled:loadingPage
    }
  );
  

  const handleGetLastOrderInvestment = async () => {
    const { data } = await api.get(
      lastOrderInvestmentQuestion + `${questionClass?.id}/question_last_order/`
    );
    return data;
  };
  const lastOrder = useQuery(
    "lastOrderInvestmentQuestions",
    handleGetLastOrderInvestment
  );

  const { mutate: deleteInvestmentQuestion } = useMutation(
    DELETE_INVESTMENT_QUESTION,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("investorQuestionInvestor");
        const status = values?.data?.status;

        setLoadingPage(true);
        // setModalAddUser(!visibleModalAddUser);
        setLoadingPage(false);
        manageErrors({ code: "" }, "success", "Delete Question is successfully.");
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

  const getInvestmentQuestionFunction = async (id: number) => {
    const { data } = await api.get(addInvestmentQuestion + `${id}/?expand=default_answer_set`);
    return data;
  };

  const handleActionTable = async (row: any, actionType: string) => {
    
    if (actionType === "Update") {
      setLoadingPage(true);
      const questionData = await getInvestmentQuestionFunction(row?.id);
      
      setValue("text", questionData?.text);
      setValue("textVi", questionData?.textVi);
      setValue("order", questionData?.order);
      setValue("active", questionData?.isActive);
      setValue("id", questionData?.id);
      setValue("hint", questionData?.hint);
      setValue("hintVi", questionData?.hintVi);
      setValue("widgetType", questionData?.widgetType);
      setWidgetTypeInput(questionData?.widgetType);
      setDefaultAnswerState(questionData?.defaultAnswerSet);
      setModalAddUser(!visibleModalAddUser);
      setLoadingPage(false);
    }
    if (actionType === "Delete") {
      deleteInvestmentQuestion(row?.id);
      setLoadingPage(true);
    }
  };
  const {
    mutate: updateActiveAndDeActiveQuestionClass,
  } = useMutation(UPDATE_ACTIVE_DE_ACTIVE_QUESTION_INVESTOR, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("investorQuestionInvestor")
      const status = values?.data?.status;
      
     
     setLoadingPage(true);
    //  setModalAddUser(!visibleModalAddUser);
     setLoadingPage(false)
     manageErrors({code:""} , "success" , "Your request is successfully." )
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      setLoadingPage(false)
      manageErrors(error, "error");
  
    },
  })
  const onChangeActiveAndDeActiveFunction = (event:any) => {
    // 
    setLoadingPage(true)
    const variables = {
      isActive:event?.target?.checked,
      id:event?.target?.id
    }
    updateActiveAndDeActiveQuestionClass(variables)
  }
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
      title: translate?.order,
      dataIndex: "order",
      key: "order",
    },
    {
      title: translate?.questionText,
      dataIndex: "text",
      key: "text",
    },
    {
      title: translate?.Vietnamese,
      dataIndex: "textVi",
      key: "textVi",
    },
    {
      title: translate?.isActive,
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive:boolean , row:any ) => {
        return(
          <span>
            <Checkbox
            id={row?.id} 
            onChange={onChangeActiveAndDeActiveFunction}
             checked={isActive}></Checkbox>
          </span>
        )
      }
    },

    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      render: (data: any, row: any) => (
        <ActionTable
          actions={["Delete", "Update"]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];

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

  const handelOpenModalUserManagement = () => {
    setModalAddUser(!visibleModalAddUser);
    setValue("order", lastOrder?.data + 1);
    setValue("widgetType", "input_text");
    setValue("active", true);
    setValue("text", "");
    setValue("textVi", "");
    setValue("id", null);
    setValue("hint", "");
    setValue("hintVi", "");
    setDefaultAnswerState([])
    setDeletedAnswer(null)
  };

  const { mutate: addInvestmentQuestionFunction } = useMutation(
    ADD_INVESTMENT_QUESTION,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("investorQuestionInvestor");
        const status = values?.data?.status;

        setLoadingPage(true);
        setModalAddUser(!visibleModalAddUser);
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
  const { mutate: UpdateInvestmentQuestionFunction } = useMutation(
    UPDATE_INVESTMENT_QUESTION,
    {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("investorQuestionInvestor");
        const status = values?.data?.status;

        setLoadingPage(true);
        setModalAddUser(!visibleModalAddUser);
        setLoadingPage(false);
        manageErrors({ code: "" }, "success", "Update Question is successfully.");
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
  const onSubmit = (data: any) => {
    setLoadingPage(true);

    
    if (data?.id) {
      const deleteDefaultNoAnswer = defaultAnswerState?.filter((item: any) => {
        return item?.answerText !== "" && item?.answerTextVi !== "";
      });
      const findUpdateAnswer = defaultAnswerState?.filter((item:any) =>{
        return item?.id 
      })
      const createAnswer = defaultAnswerState?.filter((item:any) => {
        return item?.id === undefined
      })
      const variables = {
        // name:data?.questionClassName,
        // nameVi:data?.Vietnamese,
        // active:data.active,
        // order:data?.order
        ...data,
        questionClass: questionClass?.id,
        ...(deleteDefaultNoAnswer?.length > 0 ? { defaultAnswers: {
          ...(findUpdateAnswer?.length > 0 ? {updatedItems:findUpdateAnswer} : {}),
          ...(createAnswer?.length > 0 ? {createdItems:createAnswer} : {}),
          ...(deletedAnswer !== null ? {deletedItems:deletedAnswer}: {})
        } } : {}),
        widgetType:widgetTypeInput
      };

      

      UpdateInvestmentQuestionFunction(variables);
    } else {
      const deleteDefault = defaultAnswerState?.filter((item: any) => {
        return item?.answerText !== "";
      });
      const variables = {
        // name:data?.questionClassName,
        // nameVi:data?.Vietnamese,
        // active:data.active,
        // order:data?.order
        ...data,
        questionClass: questionClass?.id,
        ...(deleteDefault?.length > 0 ? { defaultAnswers: deleteDefault } : {}),
        widgetType:widgetTypeInput
      };
      
      addInvestmentQuestionFunction(variables);
    }
  };
  const handleChangeWidgetTypeSelectFunction = (event: any) => {
    setWidgetTypeInput(event);
    if (event === "input_text") setDefaultAnswerState([]);
    if (event === "slider") setDefaultAnswerState([]);
  };
  const handleChangeInputAnswer = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event?.currentTarget?.value;
    const newAnswer = defaultAnswerState?.map((item: any, ind) => {
      if (item?.id){
        if (item?.id === index) {
          return {
            ...item,
            answerText: value,
          };
        } else {
          return item
        }
      }else{
        if (ind === index) {
          return {
            ...item,
            answerText: value,
          };
        } else {
          return item
        };
      }
   
    });
    setDefaultAnswerState([...newAnswer]);
  };
  const handleChangeInputAnswerVi = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event?.currentTarget?.value;
    const newAnswer = defaultAnswerState?.map((item: any, ind) => {
      if (item?.id){
        if (item?.id === index) {
          return {
            ...item,
            answerTextVi: value,
          };
        } else {
          return item
        }
      }else{
        if (ind === index) {
          return {
            ...item,
            answerTextVi: value,
          };
        } else {
          return item
        };
      }
    });
    setDefaultAnswerState([...newAnswer]);
  };
  const handleDeleteAnswer = (event: React.MouseEvent<HTMLElement>) => {
    const index = parseInt(event?.currentTarget?.id);
    const newAnswer = defaultAnswerState?.filter((item, ind) => {
      if (item?.id) {
        if (item?.id === index){
          if (deletedAnswer === null)
          setDeletedAnswer([ index])
          if (deletedAnswer)
          setDeletedAnswer([...deletedAnswer, index])
        }
        return item?.id !== index;
      } else {
        return index !== ind;
      }
    });
    setDefaultAnswerState([...newAnswer]);
  };

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);

    setFilterData(event?.key);
    // queryClient.invalidateQueries("investment");
  };
  const menu = (
    <Menu>
      <Menu.Item key="active" onClick={handleFilterFunction}>
        Active
      </Menu.Item>
      <Menu.Item key="deActive" onClick={handleFilterFunction}>
        DeActive
      </Menu.Item>
      {/* <Menu.Item key="done" onClick={handleFilterFunction}>
        Done
      </Menu.Item>
      <Menu.Item key="failed" onClick={handleFilterFunction}>
      Failed
      </Menu.Item> */}
    </Menu>
  );

  return (
    <div style={{ position: "relative" }}>
      {loadingPage  ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          visible={visibleModalAddUser}
          title={translate?.addNewQuestionInvestor}
          //   onOk={this.handleOk}
          onCancel={handelOpenModalUserManagement}
          footer={[
            <Button
              type="primary"
              onClick={handleSubmit(onSubmit)}
              // onClick={handleClickFunction}
            >
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="text">{translate?.questionText} </label>
                <Controller
                  control={control}
                  {...register("text", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="text"
                      size="large"
                      name="text"
                      type="text"
                    />
                  )}
                  name="text"
                />
                {errors?.text?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="textVi">{translate?.Vietnamese}</label>
                <Controller
                  control={control}
                  {...register("textVi", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="textVi"
                      size="large"
                      {...field}
                      name="textVi"
                      type="text"
                    />
                  )}
                  name="textVi"
                />
                {errors?.textVi?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="hint">{translate?.hint}</label>
                <Controller
                  control={control}
                  {...register("hint", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="hint"
                      size="large"
                      {...field}
                      name="hint"
                      type="text"
                    />
                  )}
                  name="hint"
                />
                {errors?.hint?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="hintVi">{translate?.hintVi}</label>
                <Controller
                  control={control}
                  {...register("hintVi", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="hintVi"
                      size="large"
                      {...field}
                      name="hintVi"
                      type="text"
                    />
                  )}
                  name="hintVi"
                />
                {errors?.hintVi?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="order">{translate?.order} </label>
                <Controller
                  control={control}
                  {...register("order", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="order"
                      size="large"
                      name="order"
                      type="number"
                      defaultValue={lastOrder?.data + 1}
                    />
                  )}
                  name="order"
                />
                {errors?.order?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              {/* <Col span={6} style={{display:"grid", alignItems:"center" , marginTop:"1rem" , paddingLeft:"1rem"}}>
                <span>{translate?.prevOrder}</span>
            </Col> */}
            </Row>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="widgetType">{translate?.widgetType} </label>
                <Controller
                  control={control}
                  {...register("widgetType", { required: false })}
                  render={({ field }) => (
                    <Select
                      {...field}
                      size="large"
                      value={widgetTypeInput}
                      // defaultValue="input_text"
                      onChange={handleChangeWidgetTypeSelectFunction}
                      style={{ width: "100%", border: "none" }}
                    >
                      <Option key="input_text">{translate?.inputText}</Option>
                      <Option key="single_choice">
                        {translate?.singleChoice}
                      </Option>
                      <Option key="multiple_choice">
                        {translate?.multipleChoice}
                      </Option>
                      <Option key="slider">{translate?.slider}</Option>
                    </Select>
                  )}
                  name="widgetType"
                />
                {errors?.widgetType?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              {/* <Col span={6} style={{display:"grid", alignItems:"center" , marginTop:"1rem" , paddingLeft:"1rem"}}>
                <span>{translate?.prevOrder}</span>
            </Col> */}
            </Row>
            {widgetTypeInput === "multiple_choice" ||
            widgetTypeInput === "single_choice" ? (
              <Row
                style={{
                  padding: "2rem",
                  border: "1px solid gray",
                  borderRadius: "5px",
                }}
              >
                <Col span={13}>
                  <label htmlFor="widgetType">
                    {translate?.defaultAnswer}{" "}
                  </label>
                </Col>
                <Col span={11}>
                  <label htmlFor="widgetType">{translate?.Vietnamese} </label>
                </Col>
                <Col span={24}>
                  {defaultAnswerState?.map((item, index) => {
                    return (
                      <Row
                        style={{
                          position: "relative",
                          display: "flex",
                          justifyContent: "space-between",
                          margin: "1.5rem 0",
                          border: "1px solid #8080807d",
                          padding: "2rem 1rem 1rem",
                          borderRadius: "5px",
                        }}
                      >
                        <Col span={11}>
                          <Input
                            id="order"
                            size="large"
                            name="order"
                            type="text"
                            value={item?.answerText}
                            onChange={(event) =>
                              handleChangeInputAnswer(event, item?.id || index )
                            }
                            style={{ marginTop: "0.5rem" }}
                          />
                        </Col>
                        <Col span={11}>
                          <Input
                            id="order"
                            size="large"
                            name="order"
                            type="text"
                            value={item?.answerTextVi}
                            onChange={(event) =>
                              handleChangeInputAnswerVi(event, item?.id || index)
                            }
                            style={{ marginTop: "0.5rem" }}
                          />
                        </Col>
                        <DeleteOutlined
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "10px",
                            color: "red",
                          }}
                          id={`${item?.id || index}`}
                          onClick={handleDeleteAnswer}
                        />
                      </Row>
                    );
                  })}
                </Col>
                <Col span={24} style={{ margin: "2rem" }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="middle"
                    onClick={() =>
                      setDefaultAnswerState([
                        ...defaultAnswerState,
                        { answerText: "", answerTextVi: "" },
                      ])
                    }
                  >
                    Add Answer{" "}
                  </Button>
                </Col>
              </Row>
            ) : null}
            <Row style={{ marginTop: "1rem" }}>
              <Col span={3}>
                <label htmlFor="active">{translate?.active}</label>
              </Col>
              <Col span={21}>
                <Controller
                  control={control}
                  {...register("active", { required: false })}
                  render={({ field }) => (
                    //   <Input
                    //     id="Vietnamese"
                    //     size="large"
                    //     {...field}
                    //     name="Vietnamese"
                    //     type="text"
                    //   />
                    <Switch {...field} defaultChecked={true} />
                  )}
                  name="active"
                />
                {errors?.active?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }
      <Row>
        <Col span={19} style={{ display: "flex" }}>
          {/* <Space prefixCls="2rem">Investors</Space> */}
          <Title level={4}>{translate?.investorQuestion}</Title>
        </Col>
        {/* <Col span={"auto"} style={{ margin: "10px" }}>
            <Text>{data?.count} {translate?.people}</Text>
          </Col> */}
        <Col span={5}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // style={{
            //   background: "#393E65",
            //   borderColor: "#393E65",
            // }}
            onClick={handelOpenModalUserManagement}
          >
            {translate?.addNewQuestion}
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
                <Breadcrumb.Item>{translate?.investors}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>
                  <Link to="/investors/investorsQuestion">
                    {translate?.investorQuestion}
                  </Link>
                </Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{questionClass?.name}</Breadcrumb.Item>
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
          <DropDownComponent menu={menu} />
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

      {/* <Pagination showQuickJumper defaultCurrent={1} total={4} onChange={onChangePagination} /> */}
    </div>
  );
};

export default Investors;
