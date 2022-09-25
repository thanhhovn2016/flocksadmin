import { Breadcrumb, Button, Col, Modal, Row, Steps ,Typography} from "antd";
import {PlusOutlined} from '@ant-design/icons'
import { useState } from "react";
import { useMutation, useQuery , useQueryClient } from "react-query";
import { groupBy } from "../../components/custom/groupBy";
import { api } from "../../components/reactQuery/axios";
import { companies, investment } from "../../components/reactQuery/constants";
import Stepper from '../../components/stepper/stepper'
import { translate } from "../../components/translate/useTranslate";
import {investmentData, } from '../../components/zustand/store'
import { Link } from "react-router-dom";
import { manageErrors } from "../../components/errors/manageErrors";
import { CHANGE_STATUS_INVESTMENT } from "../../components/reactQuery/mutations/investment";
import { SpinLoader } from "../../components/space/spin";


const { Step } = Steps;
const {Title , Text } = Typography
const ProjectDetails = () => {
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(0);
  const details = investmentData((state:any) => state?.details)
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionType,setActionType] = useState("")
  const [loadingPage ,setLoadingPage] = useState(true)


  const onChangeStepsFunction = (current: number) => {
    setCurrentStep(current);
  };
  const getCompanyDetailsQuestion = async () => {
    const {data} = await api.get(investment+`${details?.id}/details/?expand=question,question.question_class&fields=question.text,answer_text,question.text_vi,question.order,question.question_class.name,question.question_class.name_vi`)
    setLoadingPage(false)
    return data
  }
  const {isLoading, isError , data} = useQuery("companyDetailsQuestion" , getCompanyDetailsQuestion ,{
    refetchOnWindowFocus: false,
    enabled:loadingPage
  } )
  
  if (isError){
    manageErrors(isError,"error")
  }
  const groupByData =  groupBy(data, "name")
  

  const newGroupByData = {
    "Investor Information" :[
      {answerText:[details?.investorName],
      question:{text:"Investor Name"}
    },
    {
      answerText:[details?.investorPhone],
    question:{text:"Investor Phone"}
    },
    {answerText:[details?.investorEmail],
     question:{ text:"Investor Email"}
    }
    ,
    {answerText:[details?.investorPhone],
     question:{ text:"Investor Phone"}
    }
    ,
    {answerText:[details?.investorAddress],
     question:{ text:"Investor Address"}
    }
   
    ],
    ...groupByData
  }
  const handelOpenConfirmModal = () => {
  setConfirmModal(!confirmModal)
  }

  const handleClickApprove = () => {
    setActionType("Approved")
    setConfirmModal(!confirmModal)
  }
  const handleClickRejected = () => {
    setActionType("Rejected")
    setConfirmModal(!confirmModal)
  }

  const {
    mutate: changeStatusInvestment,
  } = useMutation(CHANGE_STATUS_INVESTMENT, {
    onSuccess: (values: any) => {
      queryClient.invalidateQueries("companyDetailsQuestion")
      const status = values?.data?.status;
      
     
     setLoadingPage(false);
     setConfirmModal(!confirmModal)
    //  setLoadingPage(false)
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
      setConfirmModal(!confirmModal)
      manageErrors(error, "error");
  
    },
  })

  const handelChangeStatusFunction = () => {

    setLoadingPage(true)
    if (actionType === "Approved"){
      const variables = {
        id:details?.id,
        status:"approved"
      }
      changeStatusInvestment(variables)
    }
   
    if (actionType === "Rejected"){
      const variables = {
        id:details?.id,
        status:"rejected"
      }
      changeStatusInvestment(variables)
    }
  }
  return (
    <div>
        { loadingPage  ?  <SpinLoader/> : null}
      {//@ts-ignore
        <Modal
          visible={confirmModal}
          title={actionType}
          //   onOk={this.handleOk}
          onCancel={handelOpenConfirmModal}
          footer={[
            <Button
              type="primary"
              // onClick={}
              onClick={handelChangeStatusFunction}
            >
              {translate?.okay}
              {/* {actionType} */}
            </Button>,
            <Button
              type="primary"
              //  onClick={}
              onClick={handelOpenConfirmModal}
            >
              {translate?.cancel}
            </Button>,
          ]}
        >
          <Text>
            {/* {translate?.deleteContent} */}
            Do you want to {actionType } this?.
          </Text>
        </Modal>}
      <Row>
          <Col span={17}  style={{display:"flex"}}>
            
            <Title level={4}>{translate?.projectQuestion}</Title>
          </Col>
         
          <Col span={4} style={{display:"grid" , justifyContent:"end"}}>
          <Button
            type="ghost"
          disabled={details?.status === "approved" }
            
            onClick={handleClickApprove}
           
          >
            {translate?.approve}
          </Button>
          </Col>
          <Col span={3}>
          <Button
         
            danger={true}
            disabled={details?.status === "rejected" }
           
            onClick={handleClickRejected}
            
          >
            {translate?.reject}
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
              <Breadcrumb.Item>{translate?.projects}</Breadcrumb.Item>}
            {
              //@ts-ignore
              <Breadcrumb.Item><Link to={'/investors/investorsList'}>{translate?.investors}</Link></Breadcrumb.Item>}
               {
              //@ts-ignore
              <Breadcrumb.Item>{translate?.investmentDetails}</Breadcrumb.Item>}
          </Breadcrumb>}
          
         
        </Col>
        
      </Row>
      <Row style={{marginTop:"2rem"}}>
        
        <Stepper data={newGroupByData} />
      </Row>
    </div>
  );
};

export default ProjectDetails;
