import { Space, Spin } from "antd";

const SpinLoader = (props:any) => {
  return (
    <div style={{
        position:"fixed",
        top:0,
        bottom:0,
        display:"grid",
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:"#cdcdcd80",
        width:'100%',
        height:"100%",
        zIndex:10000000000000,
        right: 0,
        left: 0,
    }}>
      <Space size="middle">
        <Spin size="large" />
      </Space>
    </div>
  );
};
export  {SpinLoader};
