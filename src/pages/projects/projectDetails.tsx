import { Breadcrumb, Button, Col, Modal, Row, Steps ,Typography} from "antd";
import {PlusOutlined} from '@ant-design/icons'
import { useState } from "react";
import { useMutation, useQuery , useQueryClient} from "react-query";
import { groupBy } from "../../components/custom/groupBy";
import { api } from "../../components/reactQuery/axios";
import { companies } from "../../components/reactQuery/constants";
import Stepper from '../../components/stepper/stepper'
import { translate } from "../../components/translate/useTranslate";
import {project} from '../../components/zustand/store'
import { Link } from "react-router-dom";
import { manageErrors } from "../../components/errors/manageErrors";
import { CHANGE_STATUS_PROJECT } from "../../components/reactQuery/mutations/porjects";
import { SpinLoader } from "../../components/space/spin";

const { Step } = Steps;
const {Title , Text } = Typography
const ProjectDetails = () => {
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(0);
  const details = project((state:any) => state?.details)
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionType,setActionType] = useState("")
  const [loadingPage ,setLoadingPage] = useState(false)


  const onChangeStepsFunction = (current: number) => {
    setCurrentStep(current);
  };
  const getCompanyDetailsQuestion = async () => {
    const {data} = await api.get(companies+`${details?.id}/details/?expand=question,question.question_class&fields=question.text,answer_text,question.text_vi,question.order,question.question_class.name,question.question_class.name_vi`)
    return data
  }
  const {isLoading, isError , data} = useQuery("companyDetailsQuestion" , getCompanyDetailsQuestion )
  
  const groupByData =  groupBy(data, "name")
  
  const newGroupByData = {
    "Company Information" :[
      {answerText:[details?.companyName],
      question:{text:"Company Name"}
    },
    {
      answerText:details?.entrepreneurName,
      question:{text:"Entrepreneur Name"}
    },
    {answerText:[details?.email],
      question:{text:"Email"}
    }
    ,
    {answerText:[details?.phoneNumber],
      question:{text:"Phone Number"}
    }
    ,
    {answerText:[details?.address],
      question:{text:"Address"}
    }
    ,
    {answerText:[details?.github],
      question:{text:"Github"}
    }
    ,
    {answerText:[details?.website],
      question:{text:"Website"}
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
      mutate: changeStatusProject,
    } = useMutation(CHANGE_STATUS_PROJECT, {
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
        changeStatusProject(variables)
      }
     
      if (actionType === "Rejected"){
        const variables = {
          id:details?.id,
          status:"rejected"
        }
        changeStatusProject(variables)
      }
    }

  return (
    <div>
          { loadingPage || isLoading ?  <SpinLoader/> : null }
      {//@ts-ignore
        <Modal
        visible={confirmModal}
        title={actionType}
        
        onCancel={handelOpenConfirmModal}
        footer={[
          <Button
            type="primary"
            
            onClick={handelChangeStatusFunction}
          >
            {translate?.okay}
            
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
              <Breadcrumb.Item><Link to={'/projects/companiesList'}>{translate?.companies_list}</Link></Breadcrumb.Item>}
               {
              //@ts-ignore
              <Breadcrumb.Item>{translate?.projectDetails}</Breadcrumb.Item>}
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
