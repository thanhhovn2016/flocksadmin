import { IMAGES_PATH } from "../reactQuery/constants";

import Linkedin from "./icons/linkedin";
const OurTeam = (props: any) => {
  return (
    <div
      style={{
        display: "grid",
        justifyContent: "center",
        margin: "1rem",
        maxWidth: "20rem",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${IMAGES_PATH + props?.person?.image?.url})`,
        }}
        className="ourTeamMember__image"
      ></div>
      <div style={{ fontSize: "1.2rem", fontWeight: "500" }}>
        {props?.person?.name}
      </div>
      <div>{props?.person?.position}</div>
      <div style={{ margin: "1rem  ", textAlign: "center" }}>
        {props?.person?.about?.length > 100
          ? props?.person?.about.slice(0, 120) + "..."
          : props?.person?.about}
      </div>
      <div>
        <a href={props?.person?.linkedin}>
          <Linkedin />
        </a>
      </div>
    </div>
  );
};

export default OurTeam;
