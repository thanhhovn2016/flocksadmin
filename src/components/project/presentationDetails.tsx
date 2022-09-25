import { Col, Row, Typography } from "antd";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { IMAGES_PATH } from "../reactQuery/constants";
import Web from "./icons/web";
import Email from "./icons/email";
import Call from "./icons/call";
import Facebook from "./icons/facebook";
import Linkedin from "./icons/linkedin";
import Location from "./icons/location";
import Twitter from "./icons/twitter";
import { renderRawHTML } from "./renderDetails";
import { useState } from "react";
import OurTeam from "./ourTeam";

const { Text } = Typography;

const HeaderFirst = (props: any) => {
  return (
    <div className="presentationHeaderFirst__logoGrid">
      <div className="presentationHeaderFirst__logoGrid--logoContent">
        <div
          style={{
            backgroundImage: `url(${
              IMAGES_PATH + props?.details?.logoImage?.url
            })`,
            width: "4rem",
            height: "4rem",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            borderRadius: "50%",
            marginRight: "1rem",
          }}
        ></div>
        <div>
          <div className="presentationHeaderFirst__logoGrid--name">
            {props?.details?.companyName}
          </div>
          <div>{props?.details?.companySubTitle}</div>
        </div>
      </div>
      <div className="presentationHeaderFirst__logoGrid--date">
        Started :{" "}
        <Moment format="DD/MMM/YYYY">{props?.details?.createAt}</Moment>
      </div>
    </div>
  );
};

const HeaderSecond = (props: any) => {
  
  return (
    <Row className="presentationDetails__headerSecond">
      <Col span={3} style={{ display: "flex", gap: "0.5rem" }}>
        <Web />
        <Link to={props?.details?.website}>
          {props?.details?.website?.split("/")?.[2]}
        </Link>
      </Col>
      <Col span={6} style={{ display: "flex", gap: "0.5rem" }}>
        <Email />
        {props?.details?.email}
      </Col>
      <Col span={5} style={{ display: "flex", gap: "0.5rem" }}>
        <Call />
        {props?.details?.phoneNumber}
      </Col>
      <Col span={3} style={{ display: "flex", gap: "0.5rem" }}>
        <Link to={props?.details?.facebook}>
          <Facebook />
        </Link>
        <Link to={props?.details?.linkedin}>
          <Linkedin />
        </Link>
        <Link to={props?.details?.twitter}>
          <Twitter />
        </Link>
      </Col>
      <Col span={7} style={{ display: "flex", gap: "0.5rem" }}>
        <Location />
        {props?.details?.location}
      </Col>
    </Row>
  );
};
const PresentationDetails = (props: any) => {
  const [linkDocument, setLinkDocument] = useState(null);

  const handleClickLinkFunction = (event: any) => {
    const id = event.target.id;
    setLinkDocument(id);
  };
  return (
    <div style={{ display: "grid", width: "100%" }}>
      <Row>
        <Col span={16}>
          <HeaderFirst details={props?.projectDetails} />
          <div
            className="presentationDetails__coverImage"
            style={{
              backgroundImage: `url(${
                IMAGES_PATH + props?.projectDetails?.coverImage?.url
              })`,
            }}
          ></div>
        </Col>
        <Col span={8}></Col>
      </Row>
      <Row>
        <Col span={24}>
          <HeaderSecond details={props?.projectDetails} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Text>{props?.ProjectDetails?.abstract}</Text>
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "#FFF",
          margin: "1rem 0",
          padding: "0.5rem 1rem",
          borderRadius: "1rem",
        }}
      >
        {props?.projectDetails?.presentDetails?.map((item: any) => {
          return (
            <div
              onClick={handleClickLinkFunction}
              id={item?.title}
              key={item?.id}
              style={{
                background: linkDocument === item?.title ? "#D9FD00" : "",
                cursor: "pointer",
                padding: "0.7rem 1.5rem",
                borderRadius: "1.2rem",
              }}
            >
              <a href={`#${item?.title}`} id={item?.title}>
                {item?.title}
              </a>
            </div>
          );
        })}
      </div>
      {props?.projectDetails?.presentDetails?.map((item:any) => {
        return (
          <div id={item?.title} style={{display:"grid" , justifyContent:"start"}}> 
            <div style={{display:"flex"}}>
              <Link to={`#${item?.title}`}>{item?.title}</Link>
            </div>
            <div style={{display:"flex", justifyContent:"start"}}>{renderRawHTML(item?.details)}</div>
          </div>
        );
      })}
      <div style={{display:"flex" ,flexWrap:"wrap"}}>
      {props?.projectDetails?.companyPresentTeamMember?.map((item:any) => {
          return(
              <OurTeam id={item?.id} person={item}/>
          )
      })}
      </div>
    </div>
  );
};
export default PresentationDetails;
