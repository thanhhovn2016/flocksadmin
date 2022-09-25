import { Collapse, Row, Steps } from "antd";
import { useState } from "react";

const { Step } = Steps;
const { Panel } = Collapse;
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const ProjectDetails = (props) => {
  const [currentStep, setCurrentStep] = useState(0);
  // const onChangeStepsFunction = (current: number) => {
  //   setCurrentStep(current);
  // };
  const onChangeSteppes = (current) => {
    setCurrentStep(current);
  };
  // 
  // const data = {
  //   test_key:[

  //   ]
  // }
  return (
    <div>
      <Row></Row>
      <Row>
        {/* <Steps current={currentStep} onChange={onChangeSteppes} direction="vertical">
      {Object?.keys(data)?.map((item) => {
            return (
              <>
              <Step title={item} key={item} style={{width:"75vw"}} />
                
              
              </>
            );
          })}
          
        </Steps> */}
        <Collapse defaultActiveKey={["1"]} style={{background:"#eeeeee7d"}} bordered="none"  background="red">
          {Object?.keys(props?.data)?.map((item) => {
            return (
              <Panel header={item} key={item} style={{ width: "80vw" , background:"#8080801a" }} showArrow={true}>
                {props?.data[item]?.map((items) => {
                  return (
                    <div
                      style={{
                        display: "grid",
                        // justifyContent: "start",
                        fontSize: "1.1rem",
                        color: "gray",
                        width: "100%",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          justifyContent: "start",
                          display: "grid",
                          fontSize: "14px",
                        }}
                      >
                        {items?.question?.text}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          justifyContent: "start",
                          fontSize: "16px",
                          fontWeight: "600",
                          // background:"#ECECEC",
                          width: "100%",
                          // padding:"0.3rem 1rem "
                        }}
                      >
                        {items?.answerText?.map((answer) => {
                          return (
                            <span
                              key={answer}
                              style={{
                                background: "#ECECEC",
                                margin: "0.5rem 0",
                                display: "grid",
                                width: "77vw",
                                justifyContent: "start",
                                padding: "0.5rem 1rem",
                                borderRadius: "6px",
                              }}
                            >
                              {answer}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
      </Row>
    </div>
  );
};

export default ProjectDetails;
