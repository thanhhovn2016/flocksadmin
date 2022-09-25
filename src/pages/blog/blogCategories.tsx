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
  getBlogCategory,
  mediaDownload,
} from "../../components/reactQuery/constants";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import {
  CREATE_USER_DASHBOARD,
} from "../../components/reactQuery/mutations/createUserDasboard";
import { manageErrors } from "../../components/errors/manageErrors";
import axios from "axios";
import { CREATE_BLOG_CATEGORY, DELETE_BLOG_CATEGORY, UPDATE_ACTIVE_DE_ACTIVE_CATEGORY, UPDATE_BLOG_CATEGORY } from "../../components/reactQuery/mutations/blog";
import { ActionTable } from "../../components/actionTable/actionTable";
import DropDownComponent from "../../components/custom/dropdown";
// import { Option } from "antd/lib/mentions";

const { Title, Text } = Typography;
const { Option } = Select;

const BlogCategories: React.FC = () => {
  // const { t } = useTranslation();
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue
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
  const [filterData, setFilterData] = useState<string | null>(null);

  const getInvestmentData = async () => {
    const { data } = await api.get(
      getBlogCategory +
        `?fields=id,name,is_active&page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}${
          filterData !== null ? `&is_active=${filterData === "active" ? true : false}` : ""
        }`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("categoryBlog", getInvestmentData,{
    refetchOnWindowFocus: false,
    enabled:loadingPage
  });

  // 
  // useEffect(() => {
  //   if (categoryState?.category?.length === 0) {
  //     getCategoryPosts();
  //   }
  // }, []);
  // const getCategoryPosts = async () => {
  //   const { data } = await api.get(
  //     dashboardBlogCategory +
  //       `?page=${categoryState?.page}&page_size=${categoryState?.page_size}&search=${categoryState?.search}`
  //   );
  //   
  //   // setLoadingPage(false);
  //   const categoryData = data?.results?.map((item: any) => {
  //     return { id: item?.id, value: item?.name , isActive:item?.isActive };
  //   });
  //   let next: string | null = "";
  //   if (data?.next) {
  //     const params = new URL(data?.next).searchParams;
  //     next = params.get("page");
  //   }
  //   setCategoryState((prevState) => ({
  //     ...prevState,
  //     page: parseInt(next ? next : "1"),
  //     category: [...categoryData, ...prevState?.category],
  //   }));
  //   return data;
  // };

  // const category = useQuery("category", getCategoryPosts);

  const {
    mutate: deleteCategoryBlog,
  } = useMutation(DELETE_BLOG_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("categoryBlog")
      const status = values?.data?.status;

      setLoadingPage(true)
      manageErrors({code:''}, "success" , "Delete Category successfully.");
      // setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false)
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
        // setModalAddPost(!visibleModalAddPost);
        setLoadingPage(false)
      manageErrors(error, "error");
    },
  });

  const handleActionTable = (row:any, actionType:string) => {
    if (actionType === "Update"){
      setValue("name",row?.name)
      setValue("id" , row?.id)
      setModalAddPost(!visibleModalAddPost)
    }
    if (actionType === "Delete"){
      deleteCategoryBlog (row?.id)
      setLoadingPage(true)
    }

  }

  const {
    mutate: updateActiveAndDeActiveQuestionClass,
  } = useMutation(UPDATE_ACTIVE_DE_ACTIVE_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("categoryBlog")
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
      width:"10%",
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
      title: translate?.category,
      dataIndex: "name",
      key: "name",
    //   render: (category: any) => {
    //     return <span>{category?.name}</span>;
    //   },
    },
    {
      title:translate.isActive,
      dataIndex:"isActive",
      key:"isActive",
      render: (isActive:boolean , row:any ) => {
        // 
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
      width:"10%",
      render: (data:any , row:any) => (
        <ActionTable actions={["Delete" , "Update"]} getActionFunction={handleActionTable} row={row}/>
      
    ),
    },
  ];
  const [visibleModalAddPost, setModalAddPost] = useState(false);

  const handelOpenModalNewPost = () => {
    setModalAddPost(!visibleModalAddPost);
    setValue("name","")
    setValue("id","")
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
    mutate: createCategoryPost,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_BLOG_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("categoryBlog")
      const status = values?.data?.status;

      
      manageErrors({code:''}, "success" , "Create Category successfully.");
      setLoadingPage(true)
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false)
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
        setModalAddPost(!visibleModalAddPost);
        setLoadingPage(false)
      manageErrors(error, "error");
    },
  });
  const {
    mutate: updateBlogCategory,
  } = useMutation(UPDATE_BLOG_CATEGORY, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("categoryBlog")
      const status = values?.data?.status;

      
      manageErrors({code:''}, "success" , "Update Category successfully.");
      setLoadingPage(true)
      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false)
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
        setModalAddPost(!visibleModalAddPost);
        setLoadingPage(false)
      manageErrors(error, "error");
    },
  });
  const onSubmit = (data: any) => {
    
    setLoadingPage(true)

    const variables = {
      name:data?.name
    };
    if (data?.id !== "" ){
      const UpVariables = {
        name:data?.name,
        id:data?.id
      }
      updateBlogCategory(UpVariables)
    }else{

      console?.log("variables", variables);
  
      createCategoryPost(variables)
    }
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
          width={"50vw"}
          visible={visibleModalAddPost}
          title={translate?.addNewCategory}
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
                <label htmlFor="name">{translate?.categoryName}</label>
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
            </Row>
          </form>
        </Modal>
      }
      <Row>
        <Col span={1}>
          <Title level={4} style={{ display: "flex" }}>
            {translate?.blog}
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
            {translate?.addNewCategory}
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
                <Breadcrumb.Item>{translate?.blog}</Breadcrumb.Item>
              }
              {
                //@ts-ignore
                <Breadcrumb.Item>{translate?.blogCategories}</Breadcrumb.Item>
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

export default BlogCategories;
