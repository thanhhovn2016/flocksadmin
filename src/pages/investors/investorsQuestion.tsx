import {
    FilterOutlined,
    MoreOutlined,
    SearchOutlined,
    PlusOutlined,
    DeleteOutlined
  } from "@ant-design/icons";
  import { Breadcrumb, Button, Checkbox, Col, Input, Menu, Modal, Pagination, Row, Select, Space, Switch, Table, Tag } from "antd";
  
  import { Typography } from "antd";
  import React, { useEffect, useState } from "react";
  import { useMutation, useQuery  , useQueryClient} from "react-query";
  import { api } from "../../components/reactQuery/axios";
  import { investment, investmentQuestionClass, lastOrderInvestment } from "../../components/reactQuery/constants";
  import { GET_INVESTMENT } from "../../components/reactQuery/queries/investment";
  import { translate } from "../../components/translate/useTranslate";
  import {SpinLoader} from "../../components/space/spin"
  import { useDebouncedSearch } from '../../components/debounce/debounce'
import { Controller, useForm } from "react-hook-form";
import { manageErrors } from "../../components/errors/manageErrors";
import { ADD_INVESTMENT_QUESTION_CLASS, DELETE_INVESTMENT_QUESTION_CLASS, UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS, UPDATE_INVESTMENT_QUESTION_CLASS } from "../../components/reactQuery/mutations/investment";
import { ActionTable } from "../../components/actionTable/actionTable";
import { questionClassInvestors } from "../../components/zustand/store";
import {useNavigate} from 'react-router-dom'
import DropDownComponent from "../../components/custom/dropdown";
  
  const { Title, Text } = Typography;


  
  const Investors = () => {
    const queryClient = useQueryClient()
    const setQuestionClassId = questionClassInvestors((state:any) => state?.setQuestionClassId)
    const navigation = useNavigate()
    const [loadingPage , setLoadingPage ] =useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue
      } = useForm();
      const [filterData, setFilterData] = useState<string | null>(null);
    
    const [investmentState, setInvestmentState] = useState({
      next: 0,
      prev: 0,
      page: 1,
      page_size: 10,
      investment: [],
      search:""
    });
    const [visibleModalAddUser, setModalAddUser] = useState(false);
  
    const getInvestmentData = async () => {
      const { data } = await api.get(
        investmentQuestionClass +
          `?page=${investmentState?.page}&page_size=${investmentState?.page_size}&search=${investmentState?.search}${
            filterData !== null ? `&is_active=${filterData === "active" ? true : false}` : ""
          }`
      );
      setLoadingPage(false)
      return data;
    };

    const { isLoading, data, error } = useQuery("investorQuestionsClass", getInvestmentData, {
      refetchOnWindowFocus: false,
      enabled:loadingPage
    });

    const handleGetLastOrderInvestment = async () => {
        const {data} = await api.get(lastOrderInvestment)
        return data
    }
    const lastOrder = useQuery("lastOrderInvestment",handleGetLastOrderInvestment)


    const {
      mutate: deleteInvestmentQuestionClass,
    } = useMutation(DELETE_INVESTMENT_QUESTION_CLASS, {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("investorQuestionsClass")
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

    const handleActionTable = (row:any , actionType:string) => {
        if (actionType === "questions"){

            setQuestionClassId(row)
            navigation('/investors/question')
        }
        if (actionType === "Update"){
          
          setValue("questionClassName" , row?.name)
          setValue("Vietnamese" , row?.nameVi)
          setValue("order" , row?.order)
          setValue("active" , row?.isActive)
          setValue('id' , row?.id)
          setModalAddUser(!visibleModalAddUser)
        }
        if (actionType === "Delete"){
          deleteInvestmentQuestionClass(row?.id)
          setLoadingPage(true);

        }
    }
    const {
      mutate: updateActiveAndDeActiveQuestionClass,
    } = useMutation(UPDATE_ACTIVE_DE_ACTIVE_QUESTION_CLASS, {
      onSuccess: (values: any) => {
        queryClient.invalidateQueries("investorQuestionsClass")
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
        render:(indexOf:number , row:any , index:number) => {
          return(
            <span>{ ((investmentState?.page - 1) * investmentState?.page_size) + (index + 1) }</span>
          )
        }
      },
      {
          title:translate?.order,
          dataIndex:'order',
          key:"order"
      },
      {
        title: translate?.questionClassName,
        dataIndex: "name",
        key: "name",
      },
      {
        title: translate?.Vietnamese,
        dataIndex: "nameVi",
        key: "nameVi",
      },
      {
        title: translate?.numberOfQuestion,
        dataIndex: "questionCount",
        key: "questionCount",
      },
   {
     title:translate.isActive,
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
        render: (data:any , row:any) => (
            <ActionTable actions={["Questions" , "Delete", "Update"]} getActionFunction={handleActionTable} row={row}/>
        ),
      },
    ];
  
    const onChangePagination = (event: any) => {
      setLoadingPage(true)
      
  
      setInvestmentState((prevState) => ({
  
        ...prevState,
        page:event?.current,
        page_size:event?.pageSize
      }))
    };
    const getDataSearch = (textSearch:any) => {
    
      setLoadingPage(true)
      // if (textSearch?.text !== "")
      // setInvestmentState((prevState) => ({
      //   ...prevState,
      //   search:textSearch?.text
      // }))
    }
    const { queryState, setQueryState, searchResults } = useDebouncedSearch(getDataSearch)
    const handleChangeSearchFunction = (event:React.ChangeEvent<HTMLInputElement>) => {
      const searchData = event.currentTarget?.value
      
      setQueryState({
        text:searchData
      })
      setInvestmentState((prevState) => ({
        ...prevState,
        search:searchData,
        page:1
      }))
    }

    const handelOpenModalUserManagement = () => {
        setModalAddUser(!visibleModalAddUser);
        setValue("id" , "")
        setValue("questionClassName" , '')
        setValue("Vietnamese" , '')
        setValue("order" , lastOrder?.data)
        setValue("active" , '')
      };


      const {
        mutate: addInvestmentQuestionClassFunction,
      } = useMutation(ADD_INVESTMENT_QUESTION_CLASS, {
        onSuccess: (values: any) => {
          queryClient.invalidateQueries("investorQuestionsClass")
          const status = values?.data?.status;
          
         
         setLoadingPage(true);
         setModalAddUser(!visibleModalAddUser);
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

      const {
        mutate: updateInvestmentQuestionClass,
      } = useMutation(UPDATE_INVESTMENT_QUESTION_CLASS, {
        onSuccess: (values: any) => {
          queryClient.invalidateQueries("investorQuestionsClass")
          const status = values?.data?.status;
          
         
         setLoadingPage(true);
         setModalAddUser(!visibleModalAddUser);
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

      const onSubmit = (data: any) => {
        setLoadingPage(true)
        
        const variables = {
            name:data?.questionClassName,
            nameVi:data?.Vietnamese,
            active:data.active,
            order:data?.order
        }

        if (data?.id !== ""){
          
        const   newVariables = {
            ...variables,
            id:data?.id
          }
          updateInvestmentQuestionClass(newVariables)
        }else{

          addInvestmentQuestionClassFunction(variables)
        }
        
    
        
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
    
    return (
      <div style={{position:"relative"}}>
        { loadingPage  ?  <SpinLoader/> : null }
        {
         //@ts-ignore
         <Modal
        visible={visibleModalAddUser}
        title={translate?.addNewClassNameTitle}
        //   onOk={this.handleOk}
        onCancel={handelOpenModalUserManagement}
        footer={[
          <Button type="primary" 
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
              <label htmlFor="questionClassName">
                {translate?.questionClassName}{" "}
                
              </label>
              <Controller
                control={control}
                {...register("questionClassName", { required: true })}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="questionClassName"
                    size="large"
                    name="questionClassName"
                    type="text"
                  />
                )}
                name="questionClassName"
              />
              {errors?.questionClassName?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <label htmlFor="Vietnamese">
                {translate?.Vietnamese}
                
              </label>
              <Controller
                control={control}
                {...register("Vietnamese", { required: true })}
                render={({ field }) => (
                  <Input
                    id="Vietnamese"
                    size="large"
                    {...field}
                    name="Vietnamese"
                    type="text"
                  />
                )}
                name="Vietnamese"
              />
              {errors?.Vietnamese?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
          <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
            <Col span={24}>
              <label htmlFor="order">
                {translate?.order}{" "}
                
              </label>
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
          <Row style={{marginTop:"1rem"}}>
            <Col span={3}>
              <label htmlFor="active">
                {translate?.active}
                
              </label>
             
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
                <Switch  
                {...field}
                defaultChecked={true}
                />
                )}
                name="active"
              />
              {errors?.active?.type === "required" && (
                <Text type="danger">{translate?.requiredInput}</Text>
              )}
            </Col>
          </Row>
        </form>
      </Modal> }
        <Row style={{display:'flex' , justifyContent:"space-between"}}>
          <Col span={21}  style={{display:"flex" , justifyContent:"space-between"}}>
            {/* <Space prefixCls="2rem">Investors</Space> */}
            <Title level={4}>{translate?.investorQuestion}</Title>
          </Col>
          {/* <Col span={"auto"} style={{ margin: "10px" }}>
            <Text>{data?.count} {translate?.people}</Text>
          </Col> */}
          <Col span={"auto"}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            // style={{
            //   background: "#393E65",
            //   borderColor: "#393E65",
            // }}
            onClick={handelOpenModalUserManagement}
            
          >
            {translate?.AddNew}
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
              <Breadcrumb.Item>{translate?.investors}</Breadcrumb.Item>}
            {
              //@ts-ignore
              <Breadcrumb.Item>{translate?.investorQuestion}</Breadcrumb.Item>}
          </Breadcrumb>}
         
        </Col>
        
      </Row>
        <Row style={{ margin: "0 0 1rem 0 " ,  display:"flex" , justifyContent:"flex-end"  }}>
          {/* <Col span={13}></Col> */}
          <Col span={8}>
            <Input placeholder={translate?.search} prefix={<SearchOutlined />}  onChange={handleChangeSearchFunction}/>
          </Col>
          <Col span={"auto"}>
            <DropDownComponent menu={menu}/>
            {/* <Button
              type="default"
              shape="default"
              icon={<FilterOutlined />}
              size={"middle"}
              style={{ borderRadius: "7px", marginLeft: "5px" }}
              // disabled
            >
              {translate?.filter}
            </Button> */}
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
            current:investmentState?.page,
            locale:{
              page:"1", 
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
  