import { Button, Dropdown } from "antd"
import {FilterOutlined} from '@ant-design/icons'
import { translate } from "../translate/useTranslate"

const  DropDownComponent = (props:any) => {
    return (
        <>
            {
                //@ts-ignore
                <Dropdown
                  overlay={props?.menu}
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

        </>
    )
}
export default DropDownComponent