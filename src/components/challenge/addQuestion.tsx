import {
  Button,
  Checkbox,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm, Controller, SubmitErrorHandler } from "react-hook-form";
import TextEditor from "../textEditor/textEditor";
import { translate } from "../translate/useTranslate";
import UploadComponent from "../upload/upload";
import Delete from "./icons/delete";

const { Title, Text } = Typography;
const { Option } = Select;
const AddQuestion = (props: any) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
  } = useForm();

  const [visibleModalAddPost, setModalAddPost] = useState(false);
  const [multipleChoiceValues, setMultipleChoiceValue] = useState<any[]>([]);
  const [handleTextMultipleChoice, setHandleTextMultipleChoice] = useState("");
  const [challengeTypeState, setChallengeState] = useState("question_answer");
  const [questionTypeState, setQuestionTypeState] = useState("input_text");
  const [handleQuestionTextEn , setHandleQuestionTextEn] = useState<any>(null)
  const [textInEditor , setTextEditor] = useState<any>(null)

  const [handleQuestionTextVi , setHandleQuestionTextVi] = useState<any>(null)
useEffect(() =>{
  if (props?.defaultValue){
    setValue("hint", props?.defaultValue?.hint)
    setValue("hintVi" , props?.defaultValue?.hintVi)
    setValue("id" , props?.defaultValue?.id)
    setMultipleChoiceValue(props?.defaultValue?.answerText)
    setHandleQuestionTextEn(props?.defaultValue?.title)
    setHandleQuestionTextVi(props?.defaultValue?.titleVi)
    setChallengeState(props?.defaultValue?.challengeType)
    setQuestionTypeState(props?.defaultValue?.questionType)
  }
},[])
  const onSubmit = (data: any) => {
    if (!handleQuestionTextEn ){
     return  message.info("English Question is required . ")
    }
    if (!handleQuestionTextVi ){
      return  message.info(" VI Question is required . ")
     }
    props.getData({
      data,
      title:handleQuestionTextEn,
      titleVi:handleQuestionTextVi,
      modalStatus: false,
      challengeType: challengeTypeState,
      questionType: questionTypeState,
      multipleChoiceValues,
      textInEditor,
    });
  };

  const handelOpenModalNewPost = () => {
    // setModalAddPost(!visibleModalAddPost);
    props.getData({
      modalStatus: false,
    });
  };

  const handleChangeChallengeType = (option: any) => {
    setChallengeState(option);
  };
  const handleChangeQuestionType = (option: any) => {
    setQuestionTypeState(option);
  };

  const handleChangeMultipleChoice = (event: any) => {
    const value = event?.currentTarget?.value;
    // 
    // setHandleTextMultipleChoice(event?.key)
    if (event?.key === "Enter") {
      // 
      setMultipleChoiceValue((prevState) => [
        ...prevState,
        { value, answer: false },
      ]);
      setHandleTextMultipleChoice("");
    }
  };
  const handleChangeAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(event?.currentTarget?.id);
    const value = event.currentTarget?.value;

    const mapData = multipleChoiceValues?.map((item, index) => {
      if (id === index) {
        return {
          ...item,
          value,
        };
      } else return item;
    });
    setMultipleChoiceValue([...mapData]);
  };

  const handleDeleteFunction = (event: React.MouseEvent<HTMLElement>) => {
    const id = parseInt(event.currentTarget?.id);
    let filterData = multipleChoiceValues?.filter(
      (item, index) => index !== id
    );

    setMultipleChoiceValue([...filterData]);
  };
  // const SubmitErrorHandler = (errorData: any) => {
  //   
  // };
  const handleGetTextQuestion = (data:string , text:string ) => {
  
    console.log("data" , data)
    // console.log("text" , text)
    setHandleQuestionTextEn(data)
    setTextEditor(text)

  }
  const handleGetTextQuestionVi = (data:string , text:string) =>{
    setHandleQuestionTextVi(data)
  }
  return (
    <div>
      {
        //@ts-ignore
        <Modal
          width={"80vw"}
          visible={props?.visibleModalCreateQuestion}
          title={translate?.addNewQuestion}
          onCancel={handelOpenModalNewPost}
          footer={[
            <Button type="primary" onClick={handleSubmit(onSubmit)}>
              {
              //@ts-ignore
              props?.buttonText ? translate?.[props?.buttonText] : translate?.addQuestion}
            </Button>,
          ]}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row justify="space-between" style={{ margin: "0.5rem 0" }}>
              <Col span={24} style={{ marginTop: "1rem" }}>
                <label htmlFor="challengeType">
                  {translate?.challengeType}
                </label>
                {/* <Controller
                  control={control}
                  {...register("optionType", { required: true })}
                  defaultValue={"link"}
                  render={({ field }) => ( */}
                <Select
                  // {...field}
                  // defaultValue="Question & answer"
                  style={{ width: "100%" }}
                  onChange={handleChangeChallengeType}
                  // name={"optionType"}
                  value={challengeTypeState}
                  id="challengeType"
                >
                  <Option value="question_answer">Question & answer</Option>
                  <Option value="attachment">Attachment</Option>

                  <Option value="link">Link</Option>
                </Select>
                {/* )}
                  name="optionType"
                /> */}
                {/* {errors?.optionType?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )} */}
              </Col>
              {/* {challengeTypeState !== "attachment" ? <> */}

              {challengeTypeState !== "link" &&
              challengeTypeState !== "attachment" ? (
                <>
                  <Col span={24} style={{ marginTop: "1rem" }}>
                    <label htmlFor="type">{translate?.questionType}</label>
                    {/* <Controller
                  control={control}
                  {...register("type", { required: true })}
                  render={({ field }) => ( */}
                    <Select
                      // {...field}
                      // defaultValue="Input Text"
                      style={{ width: "100%" }}
                      value={questionTypeState}
                      onChange={handleChangeQuestionType}
                      // name="optionType"
                      id={"questionType"}
                    >
                      <Option value="input_text">Input Text</Option>
                      <Option value="boolean">True & false </Option>

                      <Option value="single_choice">Single Choice</Option>
                    </Select>
                    {/* )}
                  name="type"
                /> */}
                    {errors?.type?.type === "required" && (
                      <Text type="danger">{translate?.requiredInput}</Text>
                    )}
                  </Col>
                  <Col
                    span={24}
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  >
                    <label htmlFor="title">{translate?.question}</label>
                    <TextEditor contentWithHtmlFunction={handleGetTextQuestion}defaultValue={props?.defaultValue?.title}/>
                    {/* <Controller
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
                    )} */}
                  </Col>
                  <Col
                    span={24}
                    style={{
                      marginTop: "1rem",
                      marginBottom: "1rem",
                      // marginLeft: "2rem",
                    }}
                  >
                    <label htmlFor="titleVi">{translate?.question} VI</label>

                    <TextEditor contentWithHtmlFunction={handleGetTextQuestionVi} defaultValue={props?.defaultValue?.titleVi}/>
                    {/* <Controller
                      control={control}
                      {...register("titleVi", { required: true })}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="titleVi"
                          size="large"
                          name="titleVi"
                          type="text"
                        />
                      )}
                      name="titleVi"
                    />
                    {errors?.titleVi?.type === "required" && (
                      <Text type="danger">{translate?.requiredInput}</Text>
                    )} */}

                  </Col>
                  {(questionTypeState !== "input_text" && questionTypeState !== "boolean") && (
                    <Col span={24} style={{ marginTop: "1rem" }}>
                      <label htmlFor="date">{translate?.answer}</label>

                      <Input
                        id="date"
                        size="large"
                        name="date"
                        type="text"
                        value={handleTextMultipleChoice}
                        onKeyDown={handleChangeMultipleChoice}
                        onChange={(event) =>
                          setHandleTextMultipleChoice(event.currentTarget.value)
                        }
                      />
                      {/* <Controller
                  control={control}
                  {...register("date", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="date"
                      size="large"
                      name="date"
                      type="text"
                    />
                  )}
                  name="date"
                />
                {errors?.date?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )} */}
                    </Col>
                  )}
                </>
              ) : (
                <>
                  <Col
                    span={11}
                    style={{ marginTop: "1rem", marginBottom: "1rem" }}
                  >
                    <label htmlFor="title">{translate?.question}</label>
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
                  </Col>
                  <Col
                    span={11}
                    style={{
                      marginTop: "1rem",
                      marginBottom: "1rem",
                      marginLeft: "2rem",
                    }}
                  >
                    <label htmlFor="titleVi">{translate?.question} VI</label>
                    <Controller
                      control={control}
                      {...register("titleVi", { required: true })}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="titleVi"
                          size="large"
                          name="titleVi"
                          type="text"
                        />
                      )}
                      name="titleVi"
                    />
                    {errors?.titleVi?.type === "required" && (
                      <Text type="danger">{translate?.requiredInput}</Text>
                    )}
                  </Col>
                </>
              )}

              {multipleChoiceValues?.map((item, index) => {
                return (
                  <>
                    <Col
                      span={1}
                      style={{
                        display: "grid",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <Checkbox />
                    </Col>
                    <Col span={21} style={{ marginTop: "1rem" }}>
                      <Input
                        id={`${index}`}
                        size="large"
                        name="date"
                        type="text"
                        value={item?.value}
                        onChange={handleChangeAnswer}
                      />
                    </Col>
                    <Col
                      span={2}
                      style={{
                        display: "grid",
                        justifyContent: "end",
                        marginTop: "1rem",
                      }}
                    >
                      <span
                        style={{
                          border: " 1px solid #FF4646",
                          display: "grid",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "6px",
                          maxWidth: "40px",
                          maxHeight: "40px",
                          width: "40px",
                          height: "40px",
                          justifySelf: "end",
                          cursor: "pointer",
                        }}
                        id={`${index}`}
                        onClick={handleDeleteFunction}
                      >
                        <Delete />
                      </span>
                    </Col>
                  </>
                );
              })}

              {/* </> : <>
              <UploadComponent />
              </>} */}

              <Col span={24} style={{ marginTop: "1rem" }}>
                <label htmlFor="hint">{translate?.hint}</label>
                <Controller
                  control={control}
                  {...register("hint", { required: false })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="hint"
                      size="large"
                      name="hint"
                      type="text"
                    />
                  )}
                  name="hint"
                />
                {errors?.hint?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: "1rem" }}>
                <label htmlFor="hintVi">{translate?.hint} Vi</label>
                <Controller
                  control={control}
                  {...register("hintVi", { required: false })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="hintVi"
                      size="large"
                      name="hintVi"
                      type="text"
                    />
                  )}
                  name="hintVi"
                />
                {errors?.hintVi?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col>
              {/* <Col span={24} style={{ marginTop: "1rem" }}>
                <label htmlFor="description">{translate?.description}</label>
                <Controller
                  control={control}
                  {...register("description", { required: true })}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="description"
                      size="large"
                      name="description"
                      type="text"
                    />
                  )}
                  name="description"
                />
                {errors?.description?.type === "required" && (
                  <Text type="danger">{translate?.requiredInput}</Text>
                )}
              </Col> */}
            </Row>
          </form>
        </Modal>
      }
    </div>
  );
};

export default AddQuestion;
