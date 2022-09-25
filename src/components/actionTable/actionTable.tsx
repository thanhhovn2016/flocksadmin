import { Button, Menu, Modal, Typography } from "antd";
import DropdownButton from "antd/lib/dropdown/dropdown-button";
import { MoreOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { translate } from "../translate/useTranslate";
import { BASE_URL, IMAGES_PATH } from "../reactQuery/constants";

const { Text } = Typography;

interface IPropsAction {
  id?: string;
  getActionFunction: (
    row: any,
    actionType: "update" | "delete" | "questions" | "details" | "Reject" | "Verify"  | "Delete" | "Update" | "Approve" | "Restore"|"Restore Media"
  ) => void;
  actions: string[];
  row?: any;
}
const ActionTable = (props: IPropsAction) => {
  const [showModalDeleteConfirm, setModalDeleteConfirm] = useState(false);
  const [actionType , setActionType ] = useState<"Delete" | "Update" | "questions" | "details" | "Reject" | "Verify" | "delete" | "update" |"Approve" | "Restore" |"Restore Media">("Delete")

  const handleClickAction = (event: any) => {
    
    if (event?.key === "Delete") {
      setActionType("Delete")
      return setModalDeleteConfirm(!showModalDeleteConfirm);
    }
    if (event.key === "Approve"){
      setActionType("Approve")
      return setModalDeleteConfirm(!showModalDeleteConfirm)
    }
    if (event?.key === "Update") {
      return props?.getActionFunction(props?.row, event.key);
    }
  
    if (event?.key === "Questions") {
      return props?.getActionFunction(props?.row, "questions");
    }
    if (event?.key === "Details") {
      return props?.getActionFunction(props?.row, "details");
    }
    if (event?.key === "Reject"){
      setActionType("Reject")
     return handelOpenModalDelete()
      // props?.getActionFunction(props?.row , "Reject");
    }
    if (event?.key === "Verify"){
      setActionType("Verify")
      return handelOpenModalDelete()
      // props?.getActionFunction(props?.row , "Verify");
    }
    if (event?.key === "Restore"){
      return props?.getActionFunction(props?.row, "Restore");
    }
    if (event.key === "Restore Media"){
     return props?.getActionFunction(props?.row, "Restore Media");
    }
    return props?.getActionFunction(props?.row , event?.key)
  };
  const handelOpenModalDelete = () => {
    return setModalDeleteConfirm(!showModalDeleteConfirm);
  };
  const handelDeleteFunction = () => {
    props?.getActionFunction(props?.row, actionType );
    handelOpenModalDelete();
  };
  return (
    <>
      {
        //@ts-ignore
        <Modal
          visible={showModalDeleteConfirm}
          title={translate?.delete}
          //   onOk={this.handleOk}
          onCancel={handelOpenModalDelete}
          footer={[
            <Button
              type="primary"
              // onClick={}
              onClick={handelDeleteFunction}
            >
              {/* {translate?.delete} */}{actionType}
            </Button>,
            <Button
              type="primary"
              //  onClick={}
              onClick={handelOpenModalDelete}
            >
              {translate?.cancel}
            </Button>,
          ]}
        >
          <Text>
            {/* {translate?.deleteContent} */}
            Do you want to {actionType} this Row?.
          </Text>
        </Modal>
      }
      <DropdownButton
        overlay={
          <>
            <Menu style={{boxShadow:"0px 0px 6px 4px rgba(0,0,0,0.14)"}}>
              {/* <Menu.Item>Update</Menu.Item>
            <Menu.Item>Delete</Menu.Item> */}
              {props?.actions?.map((item) => {
                if (item === "Download"){
                  return (
                    <Menu.Item id={item}  key={item}>
                    <a href={IMAGES_PATH + props?.row?.dbFilePath} download  target="_blank">{item}</a>
                  </Menu.Item>
                  )
                }
                if (item === "Download Media"){
                  return (
                    <Menu.Item id={item} key={item}>
                      <a href={IMAGES_PATH + props?.row?.mediaFilePath} download  target="_blank">{item}</a>
                    </Menu.Item>
                  )
                }
                return (
                  <Menu.Item id={item} onClick={handleClickAction} key={item}>
                    {item}
                  </Menu.Item>
                );
              })}
            </Menu>
          </>
        }
        placement="bottomRight"
        // icon={<DownOutlined />}
        icon={<MoreOutlined />}
        style={{ border: "none" }}
        type="text"
      >
        {/* <Button>.fgdfg</Button> */}
      </DropdownButton>
    </>
  );
};

export { ActionTable };
