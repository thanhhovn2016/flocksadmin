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
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Typography,
  Upload,
  Breadcrumb,
  Dropdown,
  Menu,
  Checkbox,
} from "antd";
import TagsInput from "react-tagsinput";

import "react-tagsinput/react-tagsinput.css";

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
  IMAGES_PATH,
  mediaDownload,
} from "../../components/reactQuery/constants";
import { useDebouncedSearch } from "../../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { CREATE_USER_DASHBOARD } from "../../components/reactQuery/mutations/createUserDasboard";
import { manageErrors } from "../../components/errors/manageErrors";
import axios from "axios";
import { ActionTable } from "../../components/actionTable/actionTable";
import {
  CREATE_POST,
  DELETE_POST,
  UPDATE_BLOG_POST,
} from "../../components/reactQuery/mutations/blog";
import { RcFile } from "antd/lib/upload";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
// import { Option } from "antd/lib/mentions";

const { Title, Text } = Typography;
const { Option } = Select;

const Blog: React.FC = () => {
  // const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  const [imageUrl, setImageUpload] = useState<string | null>(null);
  // const [textEditorValue , setTextEditorValue ] = useState<any>(tyVaRichTextEditor.createEmplue())

  const queryClient = useQueryClient();
  const [loadingPage, setLoadingPage] = useState(false);
  const [categoryQueryState, setCategoryQueryState] = useState(false);
  const [urlImageHeaderPost, setUlrImageHeaderPost] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [contentWithHtmlState, setContentWithHtmlState] = useState("");
  const [contentWithOutHtmlState, setContentWithOutHtmlState] = useState("");
  const [valueTagsInput, setValueTagsInput] = React.useState<string[]>([]);
  const [loaderUploadImageHeaderPost, setLoaderUploadImageHeaderPost] =
    useState(false);
  const [filterData, setFilterData] = useState(null);

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
    page_size: 15,
    category: [],
    search: "",
  });
  const [defaultValueCategory, setDefaultValueCategory] = useState("");
  const [autoSubtitle, setAutoSubtitle] = useState(false);
  const [subtitleTextState, setSubtitleTextState] = useState("");
  const [defaultContentPost, setDefaultContentPost] = useState<
    undefined | string
  >(undefined);

  const getInvestmentData = async () => {
    const { data } = await api.get(
      blog +
        `?expand=author,category&fields=id,title,author.full_name,created_at,post_status,category,tags,slug,excerpt&page=${
          investmentState?.page
        }&page_size=${investmentState?.page_size}&search=${
          investmentState?.search
        }&${filterData !== null ? `post_status=${filterData}` : ""}`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("getBlog", getInvestmentData, {
    refetchOnWindowFocus: false,
    enabled: loadingPage,
  });
  useEffect(() => {
    if (categoryState?.category?.length === 0) {
      getCategoryPosts();
    }
  }, []);
  const getCategoryPosts = async () => {
    const { data } = await api.get(
      dashboardBlogCategory +
        `?page=${categoryState?.page}&page_size=${categoryState?.page_size}&search=${categoryState?.search}`
    );
    // setLoadingPage(false);
    const categoryData = data?.results?.map((item: any) => {
      return { id: item?.id, value: item?.name };
    });
    let next: string | null = "";
    if (data?.next) {
      const params = new URL(data?.next).searchParams;
      next = params.get("page");
    }
    const allCategory = [...categoryData, ...categoryState?.category];
    var fileList = allCategory.filter(function (elem, i, rep) {
      return i == rep.indexOf(elem);
    });

    setCategoryState((prevState) => ({
      ...prevState,
      page: parseInt(next ? next : "1"),
      category: [...fileList],
    }));
    return data;
  };

  const category = useQuery("category", getCategoryPosts);

  const { mutate: deleteBlog } = useMutation(DELETE_POST, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("getBlog");
      const status = values?.data?.status;
      setLoadingPage(true);
      manageErrors({ code: "" }, "success", "Delete post successfully.");

      setLoadingPage(false);

      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      manageErrors(error, "error");
    },
  });

  const getAllDataPostInServer = async (slug: string) => {
    try {
      const { data } = await api.get(blog + `${slug}/?expand=header_image`);

      return data;
    } catch (error) {
      manageErrors(error, "error");
    }
  };
  // const getAllDataOfPost = useQuery("getAllDataPostInServer", getAllDataPostInServer, {enabled:false})
  const handleActionTable = async (row: any, actionType: string) => {
    setLoadingPage(true);
    if (actionType === "Update") {
      //get all data of post in server
      const allPostData = await getAllDataPostInServer(row?.slug);

      setValue("title", allPostData?.title);
      setValue("slug", allPostData?.slug);
      setValue("subtitle", allPostData?.excerpt);
      setValue("postStatus", allPostData?.postStatus);
      setValue("commentStatus", allPostData?.commentStatus);
      setDefaultContentPost(allPostData?.content);
      setUlrImageHeaderPost(allPostData?.headerImage?.id);
      setImageUpload(IMAGES_PATH + allPostData?.headerImage?.url);
      setContentWithHtmlState(allPostData?.content);
      setValueTagsInput(allPostData?.tags?.length > 0 ? allPostData?.tags : []);
      const categorySelect = categoryState?.category?.filter((item) => {
        console?.log("item", item);
        return item?.id === allPostData?.category;
      });

      setDefaultValueCategory(categorySelect?.[0].value);

      setValue("category", categorySelect?.[0].value);

      setModalAddPost(!visibleModalAddPost);
      setLoadingPage(false);
    }
    if (actionType === "Delete") {
      setLoadingPage(true);
      deleteBlog(row?.slug);
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
      title: translate?.title,
      dataIndex: "title",
      key: "title",
      render: (title: string) => {
        return (
          <span>
            {title?.length > 50 ? (
              <span>{title?.slice(0, 50)}...</span>
            ) : (
              <span>{title}</span>
            )}
          </span>
        );
      },
    },
    {
      title: translate?.Author,
      dataIndex: "author",
      key: "author",
      render: (author: any) => {
        return <span>{author?.fullName}</span>;
      },
    },
    {
      title: translate?.category,
      dataIndex: "category",
      key: "category",
      render: (category: any) => {
        return <span>{category?.name}</span>;
      },
    },
    {
      title: translate?.createdAt,
      dataIndex: "createAt",
      key: "createAt",
      render: (createAt: string) => {
        return (
          <span>
            <Moment format="YYYY/MM/DD">{createAt}</Moment>
          </span>
        );
      },
    },
    {
      title: translate?.postStatus,
      dataIndex: "postStatus",
      key: "postStatus",
      render: (status: string) => {
        return (
          <span>
            {status === "publish" && <Tag color="success">{status}</Tag>}
            {status === "draft" && <Tag color="processing">{status}</Tag>}
          </span>
        );
      },
    },

    {
      title: translate?.Tags,
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => {
        return (
          <span>
            {tags?.map((item) => {
              return <Tag color="default">{item}</Tag>;
            })}
          </span>
        );
      },
    },

    // {
    //   title: translate?.role,
    //   dataIndex: "role",
    //   key: "role",
    // },
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
  const [visibleModalAddPost, setModalAddPost] = useState(false);

  const handelOpenModalNewPost = () => {
    setValue("title", "");
    setValue("slug", null);
    setValue("subtitle", "");
    setValue("postStatus", "");
    setValue("commentStatus", "");
    setDefaultContentPost(undefined);
    setValueTagsInput([]);
    setValue("category", "");
    setModalAddPost(!visibleModalAddPost);
    setImageUpload(null);
  };

  let contUploadFile = false;
  const handleChangeImagePost = async (event: any) => {
    if (contUploadFile) return;

    contUploadFile = true;

    setLoadingPage(true);
    // setLoaderUploadImageHeaderPost(true);
    const file = event?.file?.originFileObj || event?.file;

    const base64 = await readUploadFileAsUrl(file);
    setImageUpload(base64);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const urlFile = await api.post(mediaDownload, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      setUlrImageHeaderPost(urlFile?.data?.id);
      setLoadingPage(false);
      setLoaderUploadImageHeaderPost(false);
      contUploadFile = false;

      if (!contUploadFile)
        manageErrors({ code: "" }, "success", "Upload successfully.");
      return "" + urlFile?.data?.url;
    } catch (error) {
      manageErrors(error, "error");
      setLoadingPage(false);
      // setLoaderUploadImageHeaderPost(false);
      contUploadFile = false;

      return "";
    }
  };
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
  // const handleChangeCategory = (event:any) => {
  //
  // };

  const onChangePagination = (event: any) => {
    setLoadingPage(true);

    setInvestmentState((prevState) => ({
      ...prevState,
      page: event?.current,
      page_size: event?.pageSize,
    }));

    queryClient.invalidateQueries("getBlog");
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

  // const [options, setOptions] = useState<{ value: string }[]>([]);
  const onSearch = (searchText: string) => {
    setQueryState({
      text: searchText,
      name: "category",
    });
    // setOptions(
    //   !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)],
    // );
  };
  const onSelect = (data: string) => {
    //
    setSelectCategory(data);
  };

  const {
    mutate: createPostFunction,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_POST, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("getBlog");
      const status = values?.data?.status;
      setLoadingPage(false);
      setModalAddPost(false);

      manageErrors({ code: "" }, "success", "Create post successfully.");

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
  });

  const { mutate: updateBlogPost } = useMutation(UPDATE_BLOG_POST, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("getBlog");
      const status = values?.data?.status;
      setLoadingPage(false);
      manageErrors({ code: "" }, "success", "Update post successfully.");

      setModalAddPost(!visibleModalAddPost);
      if (status === 200) {
        // message.success(values?.data?.message);
        // history.push("/");
      } else {
        // manageServeErrors(values);
      }
    },
    onError: (error) => {
      manageErrors(error, "error");
    },
  });
  const onSubmit = (data: any) => {
    // setLoadingPage(true)
    if (data?.category === "") {
      return message.error("Select one category");
    }
    if (contentWithHtmlState === "") {
      return message.error("content post is empty");
    }
    if (urlImageHeaderPost === "") {
      return message.error("please select one image for header post.");
    }

    setLoadingPage(true);
    const variables = {
      // "category": "4d64f46c-cc2d-e53c-d5e3-75f518f30988",
      // "content": "esse dolor in",
      // "post_status": "publish",
      // "title": "quis minim",
      // "header_image": "47aca486-1d51-d41e-f9c7-dff7a7d7b1e6",
      // "raw_content": "do sit qui non ex",
      // "comment_status": "close",
      // "excerpt": "consectetur nulla quis"
      category: data?.category,
      title: data?.title,
      excerpt: data?.subtitle,
      headerImage: urlImageHeaderPost,
      content: contentWithHtmlState,
      postStatus: data?.postStatus,
      rawContent: contentWithOutHtmlState,
      commentStatus: data?.commentStatus,
      ...(valueTagsInput?.length > 0 ? { tags: valueTagsInput } : {}),
    };
    const fineCategory: any = categoryState?.category?.filter((item) => {
      return item?.value === data?.category;
    });
    variables.category = fineCategory?.[0].id;

    console?.log("variables", variables);
    if (data?.slug) {
      const newVariables = {
        ...variables,
        slug: data?.slug,
      };
      updateBlogPost(newVariables);
    } else {
      createPostFunction(variables);
    }
  };
  const handleGetContentHtmlFunction = (
    content: string,
    contentText: string
  ) => {
    setContentWithHtmlState(content);
    setContentWithOutHtmlState(contentText);

    if (autoSubtitle) {
      if (contentText?.length < 100) {
        // console.log("contentText" , contentText)
        setValue("subtitle" , contentText)
        setSubtitleTextState(contentText);
      }
    }
  };
  const handleChange = (tags: string[]) => {
    setValueTagsInput([...tags]);
  };

  const handleFilterFunction = (event: any) => {
    setLoadingPage(true);

    setFilterData(event?.key);
    queryClient.invalidateQueries("investment");
  };

  const menu = (
    <Menu>
      <Menu.Item key="publish" onClick={handleFilterFunction}>
        {translate?.publish}
      </Menu.Item>
      <Menu.Item key="draft" onClick={handleFilterFunction}>
        {translate?.draft}
      </Menu.Item>
      {/* <Menu.Item key="rejected" onClick={handleFilterFunction}>
        {translate?.reject}
      </Menu.Item> */}
    </Menu>
  );
  return (
    <div>
      {loadingPage ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"70vw"}
          visible={visibleModalAddPost}
          title={translate?.addNewPost}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {translate?.save}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={18}>
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

                <div
                  style={{ display: "grid", gridTemplateColumns: "auto 5rem" }}
                >
                  <div>
                    <label
                      htmlFor="subtitle"
                      style={{ display: "grid", margin: "1rem 0 0 0" }}
                    >
                      {translate?.subtitle}
                    </label>
                    <Controller
                      control={control}
                      // defaultValue={subtitleTextState}
                      {...register("subtitle", { required: true })}
                      render={({ field }) => (
                        <Input
                          id="subtitle"
                          size="large"
                          {...field}
                          name="subtitle"
                          type="text"
                          value={subtitleTextState}
                          onChange={(event) => {
                            setValue("subtitle" , event?.target?.value)

                            setSubtitleTextState(event?.target.value);
                          }}
                        />
                      )}
                      name="subtitle"
                    />
                    {errors?.subtitle?.type === "required" && (
                      <Text type="danger">{translate?.requiredInput}</Text>
                    )}
                  </div>
                  <div
                    style={{
                      justifyContent: "center",
                      display: "grid",
                      alignItems: "end",
                      height: "fit-content",
                      alignSelf: "end",
                    }}
                  >
                    <Checkbox
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignSelf: "flex-end",
                      }}
                      onChange={(checked: CheckboxChangeEvent) => {
                        setAutoSubtitle(checked?.target?.checked);
                      }}
                      checked={autoSubtitle}
                    />
                    <div>auto</div>
                  </div>
                </div>
              </Col>
              <Col
                span={6}
                style={{
                  display: "grid",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "22px",
                  paddingLeft: "15px",
                }}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  beforeUpload={beforeUpload}
                  multiple={false}
                  // action={(action?:string | RcFile) => {
                  //
                  //   return ""
                  // } }
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

                      setUlrImageHeaderPost(urlFile?.data?.id);
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
            <Row>
              <Col span={22}>
                <label
                  htmlFor="tags"
                  style={{ display: "grid", margin: "0 0 0 0" }}
                >
                  {translate?.tags}
                </label>
                <TagsInput
                  value={valueTagsInput}
                  //   onChangeInput={handleChangeTagsInput}
                  className="react-tagsinput-tag-change-style"
                  // placeholder= 'Add a tag'
                  // {...register("entrepreneurName", { required: true })}
                  onChange={handleChange}
                  //@ts-ignore
                  // name="entrepreneurName"
                />
              </Col>
            </Row>
            <Row style={{ margin: "1rem 0" }}>
              <Col span={8}>
                <label
                  htmlFor="category"
                  style={{ display: "grid", margin: "0 0 0 0" }}
                >
                  {translate?.category}
                </label>

                <Controller
                  control={control}
                  {...register("category", { required: true })}
                  render={({ field }) => (
                    <AutoComplete
                      {...field}
                      defaultValue={defaultValueCategory}
                      // defaultValue="already"
                      options={categoryState?.category}
                      style={{ width: 200 }}
                      onSelect={onSelect}
                      onSearch={onSearch}
                      // onChange={handleChangeCategory}
                    />
                  )}
                  defaultValue={defaultValueCategory}
                  name="category"
                />
                {errors?.category?.type === "required" && (
                  <Text
                    type="danger"
                    style={{ display: "grid", margin: "0 0 1rem 0" }}
                  >
                    {translate?.requiredInput}
                  </Text>
                )}
              </Col>
              <Col span={8}>
                <label
                  htmlFor="postStatus"
                  style={{ display: "grid", margin: "0 0 0 0" }}
                >
                  {translate?.postStatus}
                </label>
                <Controller
                  control={control}
                  {...register("postStatus", { required: true })}
                  render={({ field }) => (
                    // <Input
                    //   id="category"
                    //   size="large"
                    //   {...field}
                    //   name="category"
                    //   type="text"
                    // />
                    <Select
                      {...field}
                      size="middle"
                      defaultValue="Publish"
                      // onChange={handleChangeSelectPostStatus}
                      style={{
                        width: "80%",
                        // marginRight: "10px",
                      }}
                      //@ts-ignore
                      name="postStatus"
                    >
                      <Option key="publish">{translate?.publish}</Option>
                      <Option key="draft">{translate?.draft}</Option>
                    </Select>
                  )}
                  name="postStatus"
                />
                {errors?.postStatus?.type === "required" && (
                  <Text
                    type="danger"
                    style={{ display: "grid", margin: "0 0 1rem 0" }}
                  >
                    {translate?.requiredInput}
                  </Text>
                )}
              </Col>
              <Col span={8}>
                <label
                  htmlFor="commentStatus"
                  style={{ display: "grid", margin: "0 0 0 0" }}
                >
                  {translate?.commentStatus}
                </label>
                <Controller
                  control={control}
                  {...register("commentStatus", { required: true })}
                  render={({ field }) => (
                    // <Input
                    //   id="category"
                    //   size="large"
                    //   {...field}
                    //   name="category"
                    //   type="text"
                    // />
                    <Select
                      {...field}
                      size="middle"
                      defaultValue="Open"
                      // onChange={handleChangeSelectPostStatus}
                      style={{
                        width: "80%",
                        // marginRight: "10px",
                      }}
                      //@ts-ignore
                      name="commentStatus"
                    >
                      <Option key="open">{translate?.open}</Option>
                      <Option key="close">{translate?.close}</Option>
                    </Select>
                  )}
                  name="commentStatus"
                />
                {errors?.postStatus?.type === "required" && (
                  <Text
                    type="danger"
                    style={{ display: "grid", margin: "0 0 1rem 0" }}
                  >
                    {translate?.requiredInput}
                  </Text>
                )}
              </Col>
            </Row>
            <Row style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <TextEditor
                  contentWithHtmlFunction={handleGetContentHtmlFunction}
                  defaultValue={defaultContentPost}
                />

                {/* {errors?.password?.type === "required" && (
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
          <Text>{data?.count} post</Text>
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
            {translate?.addNewPost}
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
                <Breadcrumb.Item>{translate?.blogList}</Breadcrumb.Item>
              }
            </Breadcrumb>
          }
        </Col>
      </Row>
      <Row style={{ margin: "0 0 1rem 0 ", display:"flex" , justifyContent:"flex-end"  }}>
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
            // disabled
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

export default Blog;
