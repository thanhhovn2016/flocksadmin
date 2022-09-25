import React from "react";
import {
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Input,
  Modal,
  Progress,
  Row,
  Table,
  Typography,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { translate } from "../components/translate/useTranslate";
import { SpinLoader } from "../components/space/spin";
import { api } from "../components/reactQuery/axios";
import {
  backup,
} from "../components/reactQuery/constants";
import { useDebouncedSearch } from "../components/debounce/debounce";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Moment from "react-moment";
import { manageErrors } from "../components/errors/manageErrors";
import { ActionTable } from "../components/actionTable/actionTable";
import {
  CREATE_BACKUP,
  DELETE_BACKUP,
  RESTORE_BACKUP,
} from "../components/reactQuery/mutations/backup";
import RestoreFromFile  from '../components/restore/restoreFromFile'

const { Title, Text } = Typography;
const Backup: React.FC = () => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();

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
  
  const [numberBackup , setNumberBackup] = useState(0)

  const addNumberToNumberBackupFunction = () => {
    for(let i= 0 ; i < 98 ; i++) {
      setNumberBackup(i)
    }
  }

  const [visibleModalAddPost, setModalAddPost] = useState(false);
  const [visibleModalRestore, setVisibleModalRestore] = useState(false);

  const getInvestmentData = async () => {
    const { data } = await api.get(
      backup +
        `?expand=created_by&fields=created_by.full_name,id,note,db_file_size_formatted,created_at,db_file_path,media_file_path&page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}`
    );
    setLoadingPage(false);
    return data;
  };
  const { isLoading, data, error } = useQuery("backup", getInvestmentData ,{
    refetchOnWindowFocus: false,
    enabled:loadingPage
  });
  

  const { mutate: deleteBackup } = useMutation(DELETE_BACKUP, {
    onSuccess: (values: any) => {
      setLoadingPage(true)
      queryClient.invalidateQueries("backup");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Delete Backup successfully.");
     
      setLoadingPage(false);
      
    },
    onError: (error) => {
  
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });

  const handleActionTable = async (row: any, actionType: string) => {
    
    if (actionType === "Delete") {
      setLoadingPage(true);
      deleteBackup(row?.id);
    }
    if (actionType === "Restore") {
        setValue("note","note")
        setValue("id", row?.id)
        setValue("userName","")
        setValue("password","")
      setVisibleModalRestore(!visibleModalRestore);
  
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
      title: translate?.note,
      dataIndex: "note",
      key: "note",
      render: (note: string) => {
        return (
          <span>
            {note?.slice(0, 30)} {note?.length > 30 ? "..." : ""}
          </span>
        );
      },
    },
    {
      title: translate?.createdBy,
      dataIndex: "createdBy",
      key: "createdBy",
      render: (createdBy: any) => {
        return <span>{createdBy?.fullName}</span>;
      },
    },
    {
      title: translate?.size,
      dataIndex: "dbFileSizeFormatted",
      key: "dbFileSizeFormatted",
    },

    {
      title: translate?.createdAt,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => {
        return (
          <span>
            <Moment format="YYYY/MM/DD HH:mm">{date}</Moment>
          </span>
        );
      },
    },
    {
      title: translate?.action,
      dataIndex: "Action",
      key: "Action",
      width: "10%",
      render: (data: any, row: any) => (
        <ActionTable
          actions={["Delete", "Restore", "Download", "Download Media"]}
          getActionFunction={handleActionTable}
          row={row}
        />
      ),
    },
  ];

  const handelOpenModalNewPost = () => {
    setModalAddPost(!visibleModalAddPost);
    setValue("note", "");
    setValue("userName","userName")
    setValue("password","password")
  };
  const handelOpenModalRestore = () => {
    setVisibleModalRestore(!visibleModalRestore);
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
    mutate: createBackup,
    isLoading: verifyLoading,
    reset: verifyReset,
  } = useMutation(CREATE_BACKUP, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("event");
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Create Backup successfully.");
      // setLoadingPage(true);
      setNumberBackup(100)
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
      note:data?.note,
      mediaBackup:
        data?.mediaBackup || data?.mediaBackup === undefined ? true : false,
    };
    
      console?.log("variables", variables);

      createBackup(variables);

      addNumberToNumberBackupFunction()
    
  };

 



  const { mutate: restoreBackup } = useMutation(RESTORE_BACKUP, {
    onSuccess: (values: any) => {
;
      const status = values?.data?.status;

      manageErrors({ code: "" }, "success", "Restore Backup successfully.");
      setLoadingPage(true);
   
    setVisibleModalRestore(!visibleModalRestore)
      setLoadingPage(false);
      
    },
    onError: (error) => {
        setVisibleModalRestore(!visibleModalRestore)
      setLoadingPage(false);
      manageErrors(error, "error");
    },
  });
  const onSubmitRestoreBackup = async (data:any) =>{
    //   
      setLoadingPage(true)
      const variables = {
          userName:data?.userName,
          password:data?.password,
          id:data?.id
      }
      restoreBackup(variables)
  }
  
  return (
    <div >
      {loadingPage   ? <SpinLoader /> : null}
      {
        //@ts-ignore
        <Modal
          width={"50vw"}
          visible={visibleModalRestore}
          title={translate?.restore}
          onCancel={handelOpenModalRestore}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmitRestoreBackup)}>
              {translate?.restore}
            </Button>,
          ]}
        >
         
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="userName">{translate?.email}</label>
                <Controller
                  control={control}
                  {...register("userName", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="userName"
                      size="large"
                      name="userName"
                      type="email"
                    />
                  )}
                  name="userName"
                />
                {errors?.userName?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: "1.5rem" }}>
                <label htmlFor="password">{translate?.password}</label>
                <Controller
                  control={control}
                  {...register("password", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      size="large"
                      name="password"
                      type="text"
                    />
                  )}
                  name="password"
                />
                {errors?.password?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
            </Row>
          </form>
        </Modal>
      }
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
           <Row style={{display:"flex" , justifyContent:"center"}}>
          <Progress type="circle" percent={numberBackup} width={80} strokeColor="primary" />
          </Row>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24}>
                <label htmlFor="note">{translate?.note}</label>
                <Controller
                  control={control}
                  {...register("note", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="note"
                      size="large"
                      name="note"
                      type="text"
                    />
                  )}
                  name="note"
                />
                {errors?.note?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: "2rem" }}>
                {/* <label htmlFor="mediaBackup"  style={{display:"grid" , marginTop:"1.5rem"}}>{translate?.mediaBackup}</label> */}
                <Controller
                  control={control}
                  {...register("mediaBackup", { required: false })}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      defaultChecked={true}
                      name="mediaBackup"

                      // checked={}
                      // disabled={this.state.disabled}
                      // onChange={onChange}
                    >
                      {translate?.mediaBackup}
                    </Checkbox>
                  )}
                  name="mediaBackup"
                />
                {errors?.mediaBackup?.type === "required" && (
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
            {translate?.backup}
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
        <Col span={4} style={{display:"flex", justifyContent:"center"}}>
        <RestoreFromFile />
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
           
            onClick={handelOpenModalNewPost}
            // disabled
          >
            {translate?.addBackup}
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
        {/* <Col span={14}></Col> */}
        <Col span={8}>
          <Input
            placeholder={translate?.search}
            prefix={<SearchOutlined />}
            onChange={handleChangeSearchFunction}
          />
        </Col>
        <Col span={"auto"}>
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

export default Backup;
