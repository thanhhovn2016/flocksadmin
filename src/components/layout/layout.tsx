import React, { useState } from "react";

import { Button, Dropdown, Layout, Menu, Modal } from "antd";
import DashboardIcon from "./icons/dashboard";
import Investors from "./icons/investors";
import Projects from "./icons/projects";
import Verification from "./icons/verification";
import UserManagement from "./icons/userManagement";
import Blog from "./icons/blog";
import Setting from "./icons/setting";
import FAQ from "./icons/faq";
import Event from "./icons/event";
import Backup from "./icons/backup";
import Payments from "./icons/payments";
import Challenge from "./icons/challenge";
import { DownOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { translate } from "../translate/useTranslate";
import { Link } from "react-router-dom";
import DropdownButton from "antd/lib/dropdown/dropdown-button";
import Avatar from "antd/lib/avatar/avatar";
import { useStore, userLoginStore } from "../../components/zustand/store";
import {
  IMAGES_PATH,
  accessToken,
  refreshToken,
} from "../reactQuery/constants";
import { useNavigate } from "react-router-dom";

// import { useStore } from "../zustand/store";

// import Link from "next/link";
const { SubMenu } = Menu;
const { Header, Sider, Content } = Layout;

const rootSubmenuKeys = ['sub1', 'sub11', 'sub14' , "sub15" , "sub16" , "sub17" , "sub18"];


const LayoutSidebar = (props: any) => {
  const setUserInfo = useStore((state: any) => state?.setUser);
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = React.useState(['']);
  const userInfo = useStore((state: any) => state.user);
  const setIsLogin = userLoginStore((state: any) => state.setIsLogin);

  // const  = useStore((state) => state.email)
  const [logoutModal, setLogoutModal] = useState(false);
  const toggleFunction = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e: any) => {
    // message.info('Click on menu item.');
  };
  // const menu = (
  //   <Menu onClick={handleMenuClick}>
  //     <Menu.Item key="1" icon={<UserOutlined />}>
  //       1st menu item
  //     </Menu.Item>
  //     <Menu.Item key="2" icon={<UserOutlined />}>
  //       2nd menu item
  //     </Menu.Item>
  //     <Menu.Item key="3" icon={<UserOutlined />}>
  //       3rd menu item
  //     </Menu.Item>
  //   </Menu>
  // );

  // const onOpenChange = (keys: any) => {
  //   if (openKeys?.[0] === "headerSub1") {
  //     setOpenKeys(["sub1"]);
  //   } else {
  //     setOpenKeys(["headerSub1"]);
  //   }
  //   // if (openKeys === []){
  //   //   setOpenKeys(['sub1'])
  //   // }
  //   // const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
  //   // if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
  //   //   setOpenKeys(keys);
  //   // } else {
  //   //   setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  //   // }
  // };
  const handleOpenLogoutModal = () => {
    setLogoutModal(!logoutModal);
  };

  const handleOkayLogoutFunction = () => {
    localStorage.removeItem(accessToken);
    localStorage.removeItem(refreshToken);
    setLogoutModal(!logoutModal);
    setIsLogin(false);
    setUserInfo({});
    navigate("/");
  };

  // const [openKeys, setOpenKeys] = useState(['sub1']);

  const onOpenChange = (keys:any) => {
    const latestOpenKey = keys.find((key:any) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const menu = (
    <Menu>
      <>
        <div
          style={{
            justifyContent: "center",
            display: "grid",
            padding: "1rem 0 0 0",
            width: "100%",
          }}
        >
          <Avatar
            size={64}
            icon={<UserOutlined />}
            src={IMAGES_PATH + userInfo?.avatar?.url}
          />
        </div>
        <div
          style={{
            display: "grid",
            alignItems: "center",
            height: "100%",
          }}
        >
          <span
            style={{
              height: "1.3rem",
              display: "grid",
              alignContent: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {userInfo?.firstName}
          </span>
          <span
            style={{
              height: "1.3rem",
              display: "grid",
              alignContent: "center",
              justifyContent: "start",
              padding: "0 2rem",
            }}
          >
            {userInfo?.email}
          </span>
          <hr />
        </div>
      </>
      <Menu.Item>
        <Link to="/profile">{translate?.profile}</Link>
      </Menu.Item>
      <Menu.Item onClick={handleOpenLogoutModal}>
        {/* <a href="" onClick={handleOpenLogoutModal}> */}
        {translate?.logout}
        {/* </a> */}
      </Menu.Item>
    </Menu>
  );
  //TODO change arrow icons

  return (
    <Layout style={{ height: "100vh" }}>
      {
        //@ts-ignore
        <Modal
          title="Log out system "
          visible={logoutModal}
          onCancel={handleOpenLogoutModal}
          onOk={handleOkayLogoutFunction}
        >
          <p>Do you want to log out?.</p>
        </Modal>
      }

      <Sider trigger={null} collapsible collapsed={collapsed} width="240px">
        <div
          style={{
            display: "grid",
            justifyContent: "center",
            height: "15vh",
            alignItems: "center",
          }}
        >
          <img src={"./assets/images/logo.png"} style={{ width: "6rem" }} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ backgroundColor: "#0E0E36", fontFamily: "gilory-semibold" }}
          className="siteBar__scrollView"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          <Menu.Item key={translate.dashboard} icon={<DashboardIcon />}>
            <Link to="/">{translate.dashboard}</Link>
          </Menu.Item>

          <SubMenu key="sub11" icon={<Investors />} title={translate.investors}>
            <Menu.Item key={translate.investorsList}>
              <Link to="/investors/investorsList">
                {translate?.investorsList}
              </Link>
            </Menu.Item>
            <Menu.Item key={translate.investorQuestion}>
              <Link to="/investors/investorsQuestion">
                {translate.investorQuestion}
              </Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub1" icon={<Projects />} title={translate.projects}>
            <Menu.Item key={translate.companies_list}>
              <Link to="/projects/companiesList">
                {translate.companies_list}
              </Link>
            </Menu.Item>
            <Menu.Item key={translate.projectPresentation}>
              <Link to="/projects/presentation">
                {translate.projectPresentation}
              </Link>
            </Menu.Item>
            <Menu.Item key={translate.projectQuestion}>
              <Link to="/projects/questions">{translate.projectQuestion}</Link>
            </Menu.Item>
            {/* <Menu.Item key={translate.funded_projected}>
              <Link to="/projects/fundedProjects">{translate.funded_projected}</Link>
            </Menu.Item> */}
          </SubMenu>

          <Menu.Item key={translate.verifications} icon={<Verification />}>
            <Link to="/verifications">{translate.verifications}</Link>
          </Menu.Item>
          <SubMenu
            key="sub15"
            icon={<Challenge />}
            title={translate.challenges}
          >
            <Menu.Item key={translate.challengeDay}>
              <Link to="/challenge/challengeDay">{translate.challengeDay}</Link>
            </Menu.Item>
            <Menu.Item key={translate.challengeList}>
              <Link to="/challenge/challengeList">
                {translate.challengeList}
              </Link>
            </Menu.Item>
            {/* <Menu.Item key={translate.assign}>
              <Link to="#">
                {translate.assign}
              </Link>
            </Menu.Item> */}
            <Menu.Item key={translate.review}>
              <Link to="/challenge/challengeReview">{translate.review}</Link>
            </Menu.Item>
            <Menu.Item key={translate.statistics}>
              <Link to="/challenge/statistics">{translate.statistics}</Link>
            </Menu.Item>
            
          </SubMenu>

          <SubMenu key="sub14" icon={<Payments />} title={translate.payments}>
            <Menu.Item key={translate.cashTransaction}>
              <Link to="/payments/cashTransaction">
                {translate.cashTransaction}
              </Link>
            </Menu.Item>
            <Menu.Item key={translate?.cryptoTransaction}>
              <Link to="/payments/cryptoTransactions">
                {translate?.cryptoTransaction}
              </Link>
            </Menu.Item>
            {/* <Menu.Item key={translate.accountBalance}>
              <Link to="/payments/accountBalance">
                {translate.accountBalance}
              </Link>
            </Menu.Item> */}
            {/* <Menu.Item key={translate.funded_projected}>
              <Link to="/projects/fundedProjects">{translate.funded_projected}</Link>
            </Menu.Item> */}
          </SubMenu>

          <Menu.Item key={translate.user_management} icon={<UserManagement />}>
            <Link to="/userManagement">{translate.user_management}</Link>
          </Menu.Item>
          {/* <Menu.Item key={translate.blog} icon={<Blog />}>
            <Link to="/blog">{translate.blog}</Link>
          </Menu.Item> */}
          <SubMenu key={"sub16"} icon={<Blog />} title={translate.blog}>
            <Menu.Item key={translate.blog}>
              <Link to="/blog/blogList">{translate.blogList}</Link>
            </Menu.Item>
            <Menu.Item key={translate.blogCategories}>
              <Link to="/blog/blogCategories">{translate?.blogCategories}</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key={translate.event} icon={<Event />}>
            <Link to="/events">{translate.event}</Link>
          </Menu.Item>
          <SubMenu key={"sub17"} icon={<FAQ />} title={translate.faq}>
            <Menu.Item key={translate.faq}>
              <Link to="/faq">{translate.faq}</Link>
            </Menu.Item>
            <Menu.Item key={translate.faq_category}>
              <Link to="/faq/categories">{translate?.faq_category}</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key={translate.backup} icon={<Backup />}>
            <Link to="/backup">{translate.backup}</Link>
          </Menu.Item>
          <SubMenu
            key={"sub18"}
            icon={<Setting />}
            title={translate.setting}
          >
            <Menu.Item key={translate.general}>
              <Link to="/setting/setting">{translate.general}</Link>
            </Menu.Item>
            <Menu.Item key={translate.smtp_config}>
              <Link to="/setting/smtpConfig">{translate.smtp_config}</Link>
            </Menu.Item>
            <Menu.Item key={translate.social_apps}>
              <Link to="/setting/socialApps">{translate?.social_apps}</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            background: "#FFF",
            boxShadow: "rgb(0 0 0 / 12%) 4px -7px 30px 0px",
            zIndex: 10,
          }}
        >
          {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggleFunction,
            })} */}
          <div style={{ display: "grid", justifyContent: "end" }}>
            <div
              style={{
                width: "fit-content",
                // height: "fit-content",
                // background: "red",
                marginRight: "3.5rem",
                display: "grid",
                alignItems: "center",
                paddingTop: "0.5rem",
              }}
            >
              {/* <div style={{ marginRight: "1rem" }}>
                <Avatar size={44} icon={<UserOutlined />} src={IMAGES_PATH +userInfo?.avatar?.url} />
              </div> */}
              {/* <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <span
                  style={{
                    height: "1.3rem",
                    display: "grid",
                    alignContent: "center",
                    justifyContent: "start",
                  }}
                >
                  {userInfo?.firstName}
                </span>
                <span
                  style={{
                    height: "1.3rem",
                    display: "grid",
                    alignContent: "center",
                    justifyContent: "start",
                  }}
                >
                  {userInfo?.email}
                </span>
              </div> */}
              {/* <Dropdown overlay={()=>(
                 <Menu onClick={handleMenuClick}>
                 <Menu.Item key="1" icon={<UserOutlined />}>
                   1st menu item
                 </Menu.Item>
                 <Menu.Item key="2" icon={<UserOutlined />}>
                   2nd menu item
                 </Menu.Item>
                 <Menu.Item key="3" icon={<UserOutlined />}>
                   3rd menu item
                 </Menu.Item>
               </Menu>
            )}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                 <DownOutlined />
              </a>
            </Dropdown> */}
              {/* <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                style={{ width: 50 }}
              >
                <SubMenu
                  key="headerSub1"
                  // icon={<MailOutlined />}
                  // title="Navigation One"
                  style={{width:"250px" , position: "absolute",right: "10px" }}
                  // popupOffset={[12,12]}
                >
                  <Menu.Item key="headerSub1">Option 1</Menu.Item>
                  <Menu.Item key="headerSub2">Option 2</Menu.Item>
                  
                </SubMenu>
              </Menu> */}
              <DropdownButton
                overlay={menu}
                placement="bottomLeft"
                // icon={<DownOutlined />}
                icon={
                  <Avatar
                    size={44}
                    icon={<UserOutlined />}
                    src={IMAGES_PATH + userInfo?.avatar?.url}
                  />
                }
                style={{ border: "none" }}
                type="text"
              >
                {/* <Button>.fgdfg</Button> */}
              </DropdownButton>
            </div>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "0px",
            padding: "24px 30px",
            minHeight: 280,
            height: "calc(100vh - 200px)",
            overflowY: "auto",
            // backgroundColor:"#FFF"
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutSidebar;

// ReactDOM.render(<SiderDemo />, document.getElementById('container'));
