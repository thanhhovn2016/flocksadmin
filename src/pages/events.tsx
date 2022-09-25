import React, { useEffect } from "react";
import {
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  MoreOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import {
  AutoComplete,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
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
import { RcFile } from "antd/lib/upload";

// import RichTextEditor from 'react-rte';

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { translate } from "../components/translate/useTranslate";

import { readUploadFileAsUrl } from "../components/fileReader/fileReader";
import TextEditor from "../components/textEditor/textEditor";
import { SpinLoader } from "../components/space/spin";
import { api } from "../components/reactQuery/axios";
import {
  blog,
  dashboardBlogCategory,
  event,
  getBlogCategory,
  IMAGES_PATH,
  mediaDownload,
} from "../components/reactQuery/constants";
import { useDebouncedSearch } from "../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { CREATE_USER_DASHBOARD } from "../components/reactQuery/mutations/createUserDasboard";
import { manageErrors } from "../components/errors/manageErrors";
import axios from "axios";
import {
  CREATE_BLOG_CATEGORY,
  DELETE_BLOG_CATEGORY,
  UPDATE_BLOG_CATEGORY,
} from "../components/reactQuery/mutations/blog";
import { ActionTable } from "../components/actionTable/actionTable";
import {
  CREATE_FAQ,
  DELETE_FAQ,
  UPDATE_FAQ,
} from "../components/reactQuery/mutations/faq";
import moment from "moment";
import {
  CREATE_EVENT,
  DELETE_EVENT,
  UPDATE_ACTIVE_DE_ACTIVE_EVENT,
  UPDATE_EVENT,
} from "../components/reactQuery/mutations/events";
// import { Option } from "antd/lib/mentions";

const { Title, Text } = Typography;
const { Option } = Select;

const Events: React.FC = () => {
  // const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [imageUrl, setImageUpload] = useState<null | string>(null);
  // const [textEditorValue , setTextEditorValue ] = useState<any>(tyVaRichTextEditor.createEmplue())

  const [loadingPage, setLoadingPage] = useState(false);
  const [categoryQueryState, setCategoryQueryState] = useState(false);
  const [filterData, setFilterData] = useState<string | null>(null);

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
  const [loaderUploadImageHeaderPost, setLoaderUploadImageHeaderPost] =
    useState(false);
    const [defaultValueEditor , setDefaultValueEditor] = useState(undefined)
  const [startDate, setStartDate] = useState("2022/05/01");
  const [EndDate, setEndDate] = useState("2022/05/01");
  const [urlImageHeaderPost, setUlrImageHeaderPost] = useState<any>("");
  const [dataTextEditor, setDataTextEditor] = useState({
    content:"",
    rawContent:""
  })
  const getInvestmentData = async () => {
    const { data } = await api.get(
      event +
        `?expand=header_image&fields=title,location,id,execution_date_start,execution_date_end,content,header_image.url,header_image.id,excerpt,raw_content,is_active&page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}${
          investmentState?.search
        }${filterData !== null ? `&is_active=${filterData === "active" ? true : false}` : ""} `
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("event", getInvestmentData, {
    refetchOnWindowFocus: false,
    enabled: loadingPage,
  });
  //   useEffect(() => {
  //     if (categoryState?.category?.length === 0) {
  //       getCategoryPosts();
  //     }
  //   }, []);
  //   const getCategoryPosts = async () => {
  //     const { data } = await api.get(
  //       faqCategory +
  //         `?page=${categoryState?.page}&page_size=${categoryState?.page_size}&search=${categoryState?.search}`
  //     );
  //     // setLoadingPage(false);
  //     const categoryData = data?.results?.map((item: any) => {
  //       return { id: item?.id, value: item?.name };
  //     });
  //     let next: string | null = "";
  //     if (data?.next) {
  //       const params = new URL(data?.next).searchParams;
  //       next = params.get("page");
  //     }
  //     setCategoryState((prevState) => ({
  //       ...prevState,
  //       page: parseInt(next ? next : "1"),
  //       category: [...categoryData, ...prevState?.category],
  //     }));
  //     return data;
  //   };

  //   const FAQCategory = useQuery("FAQCategory", getCategoryPosts);

  const { mutate: deleteEvent } = useMutation(DELETE_EVENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("event");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Delete Event successfully.");
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
      setStartDate(row?.executionDateStart);
      setEndDate(row?.executionDateEnd);
      // setValue("content", row?.content);
      setValue("location", row?.location);
      setValue("excerpt" , row?.excerpt)
      setDefaultValueEditor(row?.content)
      setImageUpload(IMAGES_PATH + `${row?.headerImage?.url}`);
      setUlrImageHeaderPost({
        ...row?.headerImage,
      });
      setModalAddPost(!visibleModalAddPost);
    }
    if (actionType === "Delete") {
      deleteEvent(row?.id);
      setLoadingPage(true);
    }
  };

  const {
    mutate: updateActiveAndDeActiveEvent,
  } = useMutation(UPDATE_ACTIVE_DE_ACTIVE_EVENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("event")
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
    updateActiveAndDeActiveEvent(variables)
  }
  const columns = [
    {
      title: translate?.number,
      dataIndex: "number",
      key: "number",
      width:"5%",
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
      title: translate?.header,
      dataIndex: "headerImage",
      key: "headerImage",
      render: (header: any) => {
        return (
          <span>
            <Image src={IMAGES_PATH + header?.url} width={60} />
          </span>
        );
      },
    },
    {
      title: translate?.title,
      dataIndex: "title",
      key: "title",
      //   render: (category: any) => {
      //     return <span>{category?.name}</span>;
      //   },
    },
    {
      title: translate?.content,
      dataIndex: "content",
      key: "content",
      render: (content: string) => {
        return (
          <span>
            {content?.slice(0, 30)} {content?.length > 30 ? "..." : ""}
          </span>
        );
      },
    },
    {
      title: translate?.location,
      dataIndex: "location",
      key: "location",
    },
    {
      title: translate?.startDate,
      dataIndex: "executionDateStart",
      key: "executionDateStart",
      render: (date: string) => {
        return (
          <span>
            <Moment format="YYYY/MM/DD">{date}</Moment>
          </span>
        );
      },
    },
    {
      title: translate?.endDate,
      dataIndex: "executionDateEnd",
      key: "executionDateEnd",
      render: (date: string) => {
        return (
          <span>
            <Moment format="YYYY/MM/DD">{date}</Moment>
          </span>
        );
      },
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
      width: "5%",
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
    setValue("title", "");
    setValue("id", null);
  
    // setStartDate("")
    // setEndDate(row?.executionDateEnd)
    setValue("location", "");
    setImageUpload(null)
    setValue("excerpt" , "")
    setDefaultValueEditor(undefined)
    setModalAddPost(!visibleModalAddPost);
    setUlrImageHeaderPost(null)
  
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
    mutate: createEvent,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_EVENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("event");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Create Event successfully.");
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
  const { mutate: updateEvent } = useMutation(UPDATE_EVENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("event");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Update Event successfully.");
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
    
    if (!urlImageHeaderPost?.id){
      return message.error("Select image Header")
    }
    const variables = {
      ...data,
      ...(dataTextEditor?.content !== "" ? dataTextEditor : {}),
      executionDateStart: startDate,
      executionDateEnd: EndDate,
      headerImage: urlImageHeaderPost?.id,
    };
    if (data?.content === ""){
      delete variables.content
    }
    if (data?.id) {
      // const UpVariables = {
      //   ...data,
      //   id:data?.id
      // }
      // 
      updateEvent(variables);
    } else {
      if (dataTextEditor?.content === ""){
        return message.error("excerpt is required field")
      }
      delete variables?.id;
      console?.log("variables", variables);

      createEvent(variables);
    }
  };

  //   const onSelect = (data: string) => {
  //     //
  //     
  //     setSelectCategory(data);
  //   };

  // const onSearch = (searchText: string) => {

  //   setQueryState({
  //     text: searchText,
  //     name: "category",
  //   });
  //   // setOptions(
  //   //   !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
  //   // );
  // };

  //   const handleGetContentHtmlFunction = (
  //     content: string,
  //     contentText: string
  //   ) => {
  //     //
  //     setContentWithHtmlState(content);
  //     setContentWithOutHtmlState(contentText);
  //   };

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file?.type === "image/jpg";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG/jpeg file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error("Image must smaller than 5MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChangeStart = (event: any, dateString: string) => {
    const data = event._d;
    

    setStartDate(data);
  };
  const handleChangeEnd = (event: any, dateString: string) => {
    setEndDate(event?._d);
  };

  const handleGetContentFunction = (data:string , text:string) => {
    setDataTextEditor({
      content:data,
      rawContent:text
    })

  }

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


  let contUploadFile = true;
  return (
    <div style={{ position: "relative" }}>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalAddPost}
          title={translate?.addFaq}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col
                style={{
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                span={24}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  multiple={false}
                  action={async (files: RcFile | string) => {
                    setLoadingPage(true);
                    // setLoaderUploadImageHeaderPost(true);
                    // const file = files?.file?.originFileObj ;

                    const base64 = await readUploadFileAsUrl(files);
                    setImageUpload(base64);
                    try {
                      const formData = new FormData();
                      formData.append("file", files);
                      const urlFile = await api.post(mediaDownload, formData, {
                        headers: {
                          "content-type": "multipart/form-data",
                        },
                      });

                      setUlrImageHeaderPost({
                        url: urlFile?.data?.url,
                        id: urlFile?.data?.id,
                      });
                      setLoadingPage(false);
                      setLoaderUploadImageHeaderPost(false);
                      contUploadFile = false;

                      if (!contUploadFile)
                        manageErrors(
                          { code: "" },
                          "success",
                          "Upload successfully."
                        );
                      return "" + urlFile?.data?.url;
                    } catch (error) {
                      manageErrors(error, "error");
                      setLoadingPage(false);
                      // setLoaderUploadImageHeaderPost(false);
                      contUploadFile = false;

                      return "";
                    }
                  }}
                  accept={"image/png , image/jpg , image/jpeg"}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    imageUrl === null && (
                      <div>
                        <span
                          style={{ display: "grid", justifyContent: "center" }}
                        >
                          <PlusOutlined />
                        </span>
                        <span>{translate?.upload}</span>
                      </div>
                    )
                  )}
                </Upload>
              </Col>
            </Row>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
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

                {/* <label htmlFor="subtitle" style={{display:"grid" , margin:"1rem 0 0 0"}} >{ translate?.subtitle}</label>
                <Controller
                  control={control}
                  {...register("subtitle", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="subtitle"
                      size="large"
                      {...field}
                      name="subtitle"
                      type="text"
                    />
                  )}
                  name="subtitle"
                />
                {errors?.subtitle?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )} */}
              </Col>
              <Col span={24}>
                <label
                  htmlFor="excerpt"
                  style={{ display: "grid", marginTop: "1.5rem" }}
                >
                  {translate.abstract}
                </label>
               
                <Controller
                  control={control}
                  {...register("excerpt", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="excerpt"
                      size="large"
                      {...field}
                      name="excerpt"
                      type="text"
                    />
                  )}
                  
                  name="excerpt"
                />
                {errors?.excerpt?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24}>
                <label
                  htmlFor="content"
                  style={{ display: "grid", marginTop: "1.5rem" }}
                >
                  {translate?.content}
                </label>
                <TextEditor
                  contentWithHtmlFunction={handleGetContentFunction}
                  defaultValue={defaultValueEditor}
                />
                {/* <Controller
                  control={control}
                  {...register("content", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="content"
                      size="large"
                      {...field}
                      name="content"
                      type="text"
                    />
                  )}
                  
                  name="content"
                />
                {errors?.content?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )} */}
              </Col>
              <Col span={24} style={{ marginTop: "1rem" }}>
                <label
                  htmlFor="location"
                  style={{ display: "grid", margin: "1rem 0 0 0" }}
                >
                  {translate?.location}
                </label>
                <Controller
                  control={control}
                  {...register("location", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="location"
                      size="large"
                      {...field}
                      name="location"
                      type="text"
                    />
                  )}
                  name="location"
                />
                {errors?.location?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>

              <Col span={11} style={{ marginTop: "1rem" }}>
                <label
                  htmlFor="executionDateStart"
                  style={{ display: "grid", margin: "1rem 0 0 0" }}
                >
                  {translate?.executionDateStart}
                </label>
                <Controller
                  control={control}
                  {...register("executionDateStart", { required: false })}
                  render={({ field }) => (
                    // <Input
                    //   id="executionDateStart"
                    //   size="large"
                    //   {...field}
                    //   name="executionDateStart"
                    //   type="text"
                    // />
                    <DatePicker
                      defaultValue={moment(startDate, "YYYY/MM/DD")}
                      id="executionDateStart"
                      size="large"
                      {...field}
                      name="executionDateStart"
                      style={{ width: "100%" }}
                      onChange={handleChangeStart}
                    />
                  )}
                  name="executionDateStart"
                />
                {errors?.executionDateStart?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={11} style={{ marginTop: "1rem" }}>
                <label
                  htmlFor="executionDateEnd"
                  style={{ display: "grid", margin: "1rem 0 0 0" }}
                >
                  {translate?.executionDateEnd}
                </label>
                <Controller
                  control={control}
                  {...register("executionDateEnd", { required: false })}
                  render={({ field }) => (
                    // <Input
                    //   id="executionDateStart"
                    //   size="large"
                    //   {...field}
                    //   name="executionDateStart"
                    //   type="text"
                    // />
                    <DatePicker
                      id="executionDateEnd"
                      defaultValue={moment(EndDate, "YYYY/MM/DD")}
                      size="large"
                      {...field}
                      name="executionDateEnd"
                      style={{ width: "100%" }}
                      onChange={handleChangeEnd}
                    />
                  )}
                  name="executionDateEnd"
                />
                {errors?.executionDateEnd?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              {/* <Col span={24} >
              <label htmlFor="category"  style={{display:"grid" , marginTop:"1.5rem"}}>{translate?.answer}</label>
                <TextEditor
                  contentWithHtmlFunction={handleGetContentHtmlFunction}
                  defaultValue={defaultContentPost}
                />

                {errors?.password?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col> */}
            </Row>
          </form>
        </Modal>
      }
      <Row>
        <Col span={1}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.event}
          </Title>
        </Col>
        <Col
          span={19}
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
            {translate?.addEvent}
          </Button>
        </Col>
      </Row>
      {/* <Row>
        <Col span={24}>
          {
            //@ts-ignore
            <Breadcrumb style={{ margin: "0 0", display: "flex" }}>
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.faq}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.faqList}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row> */}
      <Row style={{ margin: "1rem 0 1rem 0 ",  display:"flex" , justifyContent:"flex-end"  }}>
        {/* <Col span={13}></Col> */}
        <Col span={8}>
          <Input
            placeholder={translate?.search}
            prefix={<SearchOutlined />}
            onChange={handleChangeSearchFunction}
          />
        </Col>
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

export default Events;
