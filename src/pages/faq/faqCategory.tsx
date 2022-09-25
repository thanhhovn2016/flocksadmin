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

import { readUploadFileAsUrl } from "../../components/fileReader/fileReader";
import TextEditor from "../../components/textEditor/textEditor";
import { SpinLoader } from "../../components/space/spin";
import { api } from "../../components/reactQuery/axios";
import {
  blog,
  dashboardBlogCategory,
  faqCategory,
  getBlogCategory,
  mediaDownload,
} from "../../components/reactQuery/constants";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { CREATE_USER_DASHBOARD } from "../../components/reactQuery/mutations/createUserDasboard";
import { manageErrors } from "../../components/errors/manageErrors";
import axios from "axios";
import {
  CREATE_BLOG_CATEGORY,
  DELETE_BLOG_CATEGORY,
  UPDATE_BLOG_CATEGORY,
} from "../../components/reactQuery/mutations/blog";
import { ActionTable } from "../../components/actionTable/actionTable";
import { CREATE_FAQ_CATEGORY, DELETE_FAQ_CATEGORY, UPDATE_ACTIVE_DE_ACTIVE_FAQ_CATEGORY, UPDATE_FAQ_CATEGORY } from "../../components/reactQuery/mutations/faq";
// import { Option } from "antd/lib/mentions";

const { Title, Text } = Typography;
const { Option } = Select;

const FAQCategories: React.FC = () => {
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
  const [filterData, setFilterData] = useState(null);

  const getFAQCategory = async () => {
    const { data } = await api.get(
      faqCategory +
        `?&page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}&${
          filterData !== null ? `is_active=${filterData === "Active" ? true : false}`:""
        }`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery(
    "faqCategory",
    getFAQCategory ,{
      refetchOnWindowFocus: false,
      enabled:loadingPage
    });
//   useEffect(() => {
//     if (categoryState?.category?.length === 0) {
//     //   getCategoryPosts();
//     }
//   }, []);
//   const getCategoryPosts = async () => {
//     const { data } = await api.get(
//       dashboardBlogCategory +
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

//   const category = useQuery("category", getCategoryPosts);

  const { mutate: deleteFAQCategory } = useMutation(DELETE_FAQ_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("faqCategory");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Delete Category successfully.");
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
      setValue("name", row?.name);
      setValue("id", row?.id);
      setValue("order", row?.order)
      setModalAddPost(!visibleModalAddPost);
    }
    if (actionType === "Delete") {
      deleteFAQCategory(row?.id);
      setLoadingPage(true);
    }
  };

  const {
    mutate: updateActiveAndDeActiveEvent,
  } = useMutation(UPDATE_ACTIVE_DE_ACTIVE_FAQ_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("faqCategory")
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
      title: translate?.name,
      dataIndex: "name",
      key: "name",
      //   render: (category: any) => {
      //     return <span>{category?.name}</span>;
      //   },
    },
    {
        title:translate?.order,
        dataIndex:"order",
        key:"order"
    },
    {
        title:translate?.isActive,
        dataIndex:"isActive",
        key:"isActive",
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
    setValue("name", "");
    setValue("id", null);
    setValue("order","")
  };

  //@ts-ignore

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
    mutate: createFAQCategory,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_FAQ_CATEGORY, {
    onSuccess: (values: any) => {
    //   queryClient.invalidateQueries("categoryBlog");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Create Category successfully.");
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
  const { mutate: updateFAQCategory } = useMutation(UPDATE_FAQ_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("faqCategory");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Update Category successfully.");
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

    const variables = {
      ...data
    };
    if (data?.id) {
    //   const UpVariables = {
    //     name: data?.name,
    //     id: data?.id,
    //   };
      updateFAQCategory(variables);
    } else {
      console?.log("variables", variables);
      delete variables?.id

      createFAQCategory(variables);
    }
  };

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);
    

    setFilterData(event?.key);
    queryClient.invalidateQueries("faqCategory");
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
    <div >
      {loadingPage  ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalAddPost}
          title={translate?.addNewFAQCategory}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="name">{translate?.name}</label>
                <Controller
                  control={control}
                  {...register("name", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      size="large"
                      name="name"
                      type="text"
                    />
                  )}
                  name="name"
                />
                {errors?.name?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24}>
                <label
                  htmlFor="order"
                  style={{ display: "grid", margin: "1rem 0 0 0" }}
                >
                  {translate?.order}
                </label>
                <Controller
                  control={control}
                  {...register("order", { required: true })}
                  render={({ field }) => (
                    <Input
                      id="order"
                      size="large"
                      {...field}
                      name="order"
                      type="number"
                    />
                  )}
                  name="order"
                />
                {errors?.order?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{marginTop:"1rem"}}>
                {/* <label
                  htmlFor="isActive"
                  style={{ display: "grid", margin: "1rem 0 0 0" }}
                >
                  {translate?.isActive}
                </label> */}
                <Controller
                  control={control}
                  {...register("isActive", { required: false })}
                  render={({ field }) => (
                    // <Input
                    //   id="isActive"
                    //   size="large"
                    //   {...field}
                    //   name="isActive"
                    //   type="number"
                    // />
                    <Checkbox
                      {...field}
                      defaultChecked={true}
                      name="isActive"
                      

                      // checked={}
                      // disabled={this.state.disabled}
                      // onChange={onChange}
                    >{translate?.isActive}</Checkbox>
                  )}
                  name="isActive"
                />
                {errors?.isActive?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }
      <Row>
        <Col span={1}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.faq}
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
            {translate?.addNewFAQCategory}
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
                <Breadcrumb.Item>{translate?.faq}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.faq_category}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      <Row style={{ margin: "0 0 1rem 0 ",  display:"flex" , justifyContent:"flex-end"  }}>
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
        <Col span={"auto"} style={{display:"flex" , justifyContent:"flex-end"}}>
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
        <Col span={"auto"} style={{display:"flex" , justifyContent:"flex-end"}}>
      {  filterData && <Button type="primary" icon={<DeleteOutlined />} size={"middle"} onClick={() => {
        setFilterData(null)
        setLoadingPage(true)
      }}/>}
        </Col>
      </Row>
      {/* <div style={{height:"50vh" , overflowY:"auto"}}> */}
      <Table
      //@ts-ignore
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
          //@ts-ignore
          total: data?.count,
        }}
      />
      {/* </div> */}
    </div>
  );
};

export default FAQCategories;
