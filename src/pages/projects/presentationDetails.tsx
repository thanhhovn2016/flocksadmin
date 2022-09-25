import { Breadcrumb, Button, Col, Modal, Row, Steps ,Typography} from "antd";
import {PlusOutlined} from '@ant-design/icons'
import { useState } from "react";
import { useMutation, useQuery , useQueryClient} from "react-query";
import { groupBy } from "../../components/custom/groupBy";
import { api } from "../../components/reactQuery/axios";
import { companies, companyPresentation } from "../../components/reactQuery/constants";
import Stepper from '../../components/stepper/stepper'
import { translate } from "../../components/translate/useTranslate";
import {presentation} from '../../components/zustand/store'
import { Link } from "react-router-dom";
import { manageErrors } from "../../components/errors/manageErrors";
import { CHANGE_STATUS_PROJECT } from "../../components/reactQuery/mutations/porjects";
import PresentationDetailsComponent from '../../components/project/presentationDetails'
import { SpinLoader } from "../../components/space/spin";
import { CHANGE_STATUS_PROJECT_PRESENTATION } from "../../components/reactQuery/mutations/presentation";

const { Step } = Steps;
const {Title , Text } = Typography
const PresentationDetails = () => {
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(0);
  const details = presentation((state:any) => state?.details)
  const [confirmModal, setConfirmModal] = useState(false)
  const [actionType,setActionType] = useState("")
  const [loadingPage ,setLoadingPage] = useState(false)


  const onChangeStepsFunction = (current: number) => {
    setCurrentStep(current);
  };
  const getCompanyDetailsQuestion = async () => {
    const {data} = await api.get(companyPresentation+`${details?.id}/?expand=cover_image,logo_image,company_present_team_member,present_details,company_present_team_member.image`)
    return data
  }
  const {isLoading, isError , data} = useQuery("presentationDetails" , getCompanyDetailsQuestion )
  
  
//   const groupByData =  groupBy(data, "name")
  
//   const newGroupByData = {
//     "Company Information" :[
//       {answerText:[details?.companyName],
//       question:{text:"Company Name"}
//     },
//     {
//       answerText:details?.entrepreneurName,
//       question:{text:"Entrepreneur Name"}
//     },
//     {answerText:[details?.email],
//       question:{text:"Email"}
//     }
//     ,
//     {answerText:[details?.phoneNumber],
//       question:{text:"Phone Number"}
//     }
//     ,
//     {answerText:[details?.address],
//       question:{text:"Address"}
//     }
//     ,
//     {answerText:[details?.github],
//       question:{text:"Github"}
//     }
//     ,
//     {answerText:[details?.website],
//       question:{text:"Website"}
//     }
    
//     ],
//     ...groupByData
//   }
  


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
  
    // const {
    //   mutate: changeStatusProject,
    // } = useMutation(CHANGE_STATUS_PROJECT, {
    //   onSuccess: (values: any) => {
    //     queryClient.invalidateQueries("companyDetailsQuestion")
    //     const status = values?.data?.status;
        
       
    //    setLoadingPage(false);
    //    setConfirmModal(!confirmModal)
    //   //  setLoadingPage(false)
    //    manageErrors({code:""} , "success" , "Your request is successfully." )
    //     if (status === 200) {
    //       // message.success(values?.data?.message);
    //       // history.push("/");
    //     } else {
    //       // manageServeErrors(values);
    //     }
    //   },
    //   onError: (error) => {
    //     setLoadingPage(false)
    //     setConfirmModal(!confirmModal)
    //     manageErrors(error, "error");
    
    //   },
    // })
    const { mutate: changeStatusProjectPresentation } = useMutation(
      CHANGE_STATUS_PROJECT_PRESENTATION,
      {
        onSuccess: (values: any) => {
          queryClient.invalidateQueries("presentationDetails");
          const status = values?.data?.status;
  
          setLoadingPage(true);
          // setModalAddUser(!visibleModalAddUser);
          setLoadingPage(false);
          manageErrors({ code: "" }, "success", "Update is successfully.");
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
  
    const handelChangeStatusFunction = () => {
  
      setLoadingPage(true)
      if (actionType === "Approved"){
        const variables = {
          id:details?.id,
          status:"approved"
        }
        changeStatusProjectPresentation(variables)
      }
     
      if (actionType === "Rejected"){
        const variables = {
          id:details?.id,
          status:"rejected"
        }
        changeStatusProjectPresentation(variables)
      }
    }

  return (
    <div style={{padding:"0 2rem"}}>
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
            
            <Title level={4}>{translate?.projects}</Title>
          </Col>
          
          <Col span={4} style={{display:"grid" , justifyContent:"end"}}>
          <Button
            type="ghost"
          disabled={data && data?.status === "approved"  }
            
            onClick={handleClickApprove}
           
          >
            {translate?.approve}
          </Button>
          </Col>
          <Col span={3}>
          <Button
         
            danger={true}
            disabled={data && data?.status === "rejected" }
           
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
              <Breadcrumb.Item><Link to={'/projects/presentation'}>{translate?.projectPresentation}</Link></Breadcrumb.Item>}
               {
              //@ts-ignore
              <Breadcrumb.Item>{translate?.presentationDetails}</Breadcrumb.Item>}
          </Breadcrumb>}
          
         
        </Col>
        
      </Row>
      <Row style={{marginTop:"2rem"}}>
        
        {/* <Stepper data={newGroupByData} /> */}
        {isLoading === false &&  data && <PresentationDetailsComponent projectDetails={data}/>}
      </Row>
    </div>
  );
};

export default PresentationDetails;
