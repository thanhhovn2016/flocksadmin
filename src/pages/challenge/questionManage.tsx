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
  Image,
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
  IMAGES_PATH,
} from "../../components/reactQuery/constants";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { manageErrors } from "../../components/errors/manageErrors";
import { ActionTable } from "../../components/actionTable/actionTable";

import UploadComponent from "../../components/upload/upload";
import {
  CREATE_CHALLENGE_DAY,
  DELETE_CHALLENGE,
  UPDATE_CHALLENGE_DAY,
} from "../../components/reactQuery/mutations/challenge";
import { Link, useLocation } from "react-router-dom";
import AddQuestion from "../../components/challenge/addQuestion";
import {
  CREATE_QUESTION_CHALLENGE,
  DELETE_CHALLENGE_QUESTION,
  UPDATE_QUESTION_CHALLENGE,
} from "../../components/reactQuery/mutations/questionChallenge";
const { Title, Text } = Typography;
const { Option } = Select;
const ChallengeDay: React.FC = () => {
  const queryClient = useQueryClient();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  //   const failed = new URLSearchParams(search).get("failed")
  //   const passed = new URLSearchParams(search).get("passed")

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

  const [defaultContentPost, setDefaultContentPost] = useState<
    undefined | string
  >(undefined);
  const [filterData, setFilterData] = useState(null);
  const [allQuestionState, setAllQuestionState] = useState<any[]>([]);
  const [avatarChallengeState, setAvatarChallengeState] = useState<any>([]);
  const [defaultImageState, setDefaultImageState] = useState<any>(null);

  const getInvestmentData = async () => {
    const { data } = await api.get(
      challengeItem +
        `${id}/questions/` +
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
  const { isLoading, data, error } = useQuery(
    "challengeQuestion",
    getInvestmentData,
    {
      refetchOnWindowFocus: false,
      enabled: loadingPage,
    }
  );

  const { mutate: deleteChallenge } = useMutation(DELETE_CHALLENGE_QUESTION, {
    onSuccess: (values: any) => {
      const status = values?.data?.status;
      queryClient.invalidateQueries("challengeQuestion");
      setLoadingPage(true)
      manageErrors({ code: "" }, "success", "Delete Challenge successfully.");
      // setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
      if (status === 200) {
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });

  const handleActionTable = (row: any, actionType: string) => {
    if (actionType === "Delete") {
      deleteChallenge(row?.id);
      setLoadingPage(true);
    }
    if (actionType === "Update") {
      //   setValue("dayNumber", row?.dayNumber);
      setValue("id", row?.id);
      setDefaultContentPost(row);
      setModalAddPost(!visibleModalAddPost);
      //   setDefaultImageState(IMAGES_PATH + row?.challengeIcon);
    }
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
      dataIndex: "title",
      key: "title",
      render: (data: string) => {
        return <span dangerouslySetInnerHTML={{ __html: data }} />;
      },
    },
    {
      title: translate?.title + "Vi",
      dataIndex: "titleVi",
      key: "titleVi",
      render: (data: string) => {
        return <span dangerouslySetInnerHTML={{ __html: data }} />;
      },
    },
    {
      title: translate?.hint,
      dataIndex: "hint",
      key: "hint",
    },
    {
      title: translate?.hintVi,
      dataIndex: "hintVi",
      key: "hintVi",
    },
    {
      title: translate?.questionType,
      dataIndex: "questionType",
      key: "questionType",
    },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      width: "10%",
      render: (data: any, row: any) => (
        <ActionTable
          actions={["Delete", "Update"]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];
  const [visibleModalAddPost, setModalAddPost] = useState(false);

  const handelOpenModalNewPost = () => {
    setModalAddPost(!visibleModalAddPost);
    setDefaultContentPost(undefined)
    // setValue("dayNumber", null);
    // setValue("id", null);
    // setAvatarChallengeState([]);
    // setDefaultImageState(null);
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
    mutate: createQuestionChallenge,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_QUESTION_CHALLENGE, {
    onSuccess: (values: any) => {
      setLoadingPage(true);
      queryClient.invalidateQueries("challengeQuestion");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Create question successfully.");
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
  const { mutate: updateQuestionChallenge } = useMutation(
    UPDATE_QUESTION_CHALLENGE,
    {
      onSuccess: (values: any) => {
        setLoadingPage(true);
        queryClient.invalidateQueries("challengeQuestion");
        const status = values?.data?.status;

        manageErrors({ code: "" }, "success", "Update question successfully.");
        setModalAddPost(false);
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
    }
  );

  //   const onSubmit = (dataForm: any) => {
  //     setLoadingPage(true);
  //     if (dataForm?.id) {
  //       const variable = {
  //         // ...dataForm,
  //         dayNumber: parseInt(dataForm?.dayNumber),
  //         ...(avatarChallengeState ? { icon: avatarChallengeState } : {}),
  //         id: dataForm?.id,
  //       };
  //       updateChallengeDay(variable);
  //     } else {
  //       if (!avatarChallengeState) {
  //         message.info("Please select Icon for Challenge");
  //       }
  //       const variables = {
  //         // ...dataForm,
  //         dayNumber: parseInt(dataForm?.dayNumber),
  //         icon: avatarChallengeState,
  //       };
  //       createChallengeDay(variables);
  //     }
  //   };

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

  //   const handleGetAvatarObject = (avatarData: any) => {
  //     setAvatarChallengeState(avatarData);
  //     setLoadingPage(true);
  //   };

  const handleGetDataQuestion = (data: any) => {
    console.log("data", data);
    setModalAddPost(false);
    if (!data?.title) {
      return;
    }
    setLoadingPage(true);

    if (data?.data?.id) {
      const answer = data?.multipleChoiceValues?.map((items: any) => {
        return {
          value: items?.value,
          isCorrect: items?.answer,
        };
      });
      const variables = {
        ...(answer?.length > 0 ? { answerText: answer } : {}),
        challengeType: data?.challengeType,
        questionType: data?.questionType,
        title: data?.title,
        titleVi: data?.titleVi,
        hint: data?.data?.hint,
        hintVi: data?.data?.hintVi,
        id: data?.data?.id,
      };
      updateQuestionChallenge(variables);
    } else {
      const answer = data?.multipleChoiceValues?.map((items: any) => {
        return {
          value: items?.value,
          isCorrect: items?.answer,
        };
      });
      const variables = {
        ...(answer?.length > 0 ? { answerText: answer } : {}),
        challengeType: data?.challengeType,
        questionType: data?.questionType,
        title: data?.title,
        titleVi: data?.titleVi,
        hint: data?.data?.hint,
        hintVi: data?.data?.hintVi,
        challenge: parseInt(`${id}`),
      };

      createQuestionChallenge(variables);
    }
  };
  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}

      {visibleModalAddPost ? (
        <AddQuestion
          getData={handleGetDataQuestion}
          visibleModalCreateQuestion={visibleModalAddPost}
          defaultValue={defaultContentPost}
          buttonText="save"
        />
      ) : null}

      <Row>
        <Col span={5}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.manageQuestion}
          </Title>
        </Col>
        <Col
          span={15}
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
            {translate?.addQuestion}
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
                <Breadcrumb.Item>
                  <Link to="/challenge/challengeList">
                    {translate?.challengeList}
                  </Link>
                </Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.manageQuestion}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      <Row
        style={{
          margin: "0 0 1rem 0 ",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
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
        <Col
          span={"auto"}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
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
        <Col
          span={"auto"}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
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
