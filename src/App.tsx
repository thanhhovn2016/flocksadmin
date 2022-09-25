import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/index";
import Blog from "./pages/blog/blog";
import SideBarLayout from "./components/layout/layout";
import Investors from "./pages/investors/investors";
import InvestorsQuestion from "./pages/investors/investorsQuestion";
import CompaniesList from "./pages/projects/companiesList";
import PendingProject from "./pages/projects/pendingProject";
import FundedProjects from "./pages/projects/fundedProjects";
import Verification from "./pages/verifications";
import UserManagement from "./pages/userManagement";
import SmtpConfig from "./pages/setting/smtpConfig";
import SocialApps from "./pages/setting/socialApps";
import BlogCategories from "./pages/blog/blogCategories";
import Questions from "./pages/investors/questions";
import CompanyQuestion from "./pages/projects/questionsClass";
import ProjectQuestions from "./pages/projects/questions";
import ProjectDetails from "./pages/projects/projectDetails";
import InvestmentDetails from "./pages/investors/investmentDetails";
import Profile from "./pages/profile";
import ResetPassword from "./pages/resetPassword";
import FAQ from './pages/faq/index'
import FAQCategories from "./pages/faq/faqCategory";
import Events from './pages/events'
import Backup from './pages/backup'
import Setting from './pages/setting/setting'
import Presentation from './pages/projects/presentation'
import PresentationDetails from './pages/projects/presentationDetails'
import {manageErrors } from './components/errors/manageErrors'
import ChallengeList from "./pages/challenge/challengeList";
import "./App.less";

import { useState } from "react";
import LingPage from "./pages/login";
import ReceivedTransactions from './pages/payments/cashTransactions'
import CryptoTransactions from './pages/payments/CryptoTransactions'
import AccountBalance from "./pages/payments/accountBalance";
import AccountBalanceDetails from './pages/payments/accountBalanceDetails' 
import ChallengeDay from "./pages/challenge/challengeDay";
import ChallengeReview from './pages/challenge/challengeReview'
import ChallengeStatistics from './pages/challenge/statistic'
import ChallengeStatisticsDetails from './pages/challenge/statisticsDetails'
import ManageChallengeQuestion from './pages/challenge/questionManage'

import {
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQuery,
} from "react-query";
// import { queryClient } from "./components/reactQuery/queryClient";
import { userLoginStore, useStore } from "./components/zustand/store";
import { useEffect } from "react";
import { accessToken, userMe } from "./components/reactQuery/constants";
import {
  USER_ME_QUERY,
  GetUserData,
} from "./components/reactQuery/queries/userQuery";

import { api } from "./components/reactQuery/axios";
// import { userStore } from "./components/zustand/userStore";
function App() {
  const navigate = useNavigate();
  const [getUserDataState, setGetUserDataState] = useState(false);
  const isLogin = userLoginStore((state: any) => state?.isLogin);
  const setIsLogin = userLoginStore((state: any) => state?.setIsLogin);
  const setUserInfo = useStore((state: any) => state?.setUser);
  const userInfo = useStore((state: any) => state?.user);
  const localStorageAccessToken = localStorage.getItem(accessToken);

  const getUserData = async () => {
    const { data } = await api.get(userMe);
    setUserInfo(data);
    
    return data;
  };
  const { isLoading, data, isError, error } = useQuery("userMe", getUserData, {
    enabled: getUserDataState,
  });
  useEffect(() => {
    if (localStorageAccessToken) {
      setIsLogin(true);
      // setGetUserDataState(true)
      // navigate('/')
      if (!userInfo?.id) {
        setGetUserDataState(true);
      } else {
        setGetUserDataState(false);
      }

      if (data) {
        setUserInfo(data);
        setGetUserDataState(false);
      }
    
      if (error) {
        setGetUserDataState(false);
      }
    } else {
      setGetUserDataState(false);
    }
    // else if (!isLogin){
    //   setIsLogin(false)
    //   // navigate('/login')
    // }
    
  }, [isLogin, localStorageAccessToken , getUserDataState]);


  return (
    <div className="App">
      {isLogin ? (
        <SideBarLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/blogList" element={<Blog />} />
            <Route path="/investors/investorsList" element={<Investors />} />
            <Route
              path="/investors/investorsQuestion"
              element={<InvestorsQuestion />}
            />
            <Route path="/investors/question" element={<Questions />} />
            <Route path="/projects/companiesList" element={<CompaniesList />} />
     
            <Route path="/projects/questions" element={<CompanyQuestion />} />
            <Route
              path={"/projects/questionDetails"}
              element={<ProjectQuestions />}
            />
            <Route
              path="/projects/projectsDetails"
              element={<ProjectDetails />}
            />
            <Route
              path="/projects/presentation"
              element={<Presentation />}
            />
            <Route
              path="/projects/presentationDetails"
              element={<PresentationDetails />}
            />
            <Route path="/verifications" element={<Verification />} />
            <Route path="/userManagement" element={<UserManagement />} />
            <Route path="/setting/smtpConfig" element={<SmtpConfig />} />
            <Route path="/setting/socialApps" element={<SocialApps />} />
            <Route path="/blog/blogCategories" element={<BlogCategories />} />
            <Route
              path="/investment/investmentDetails"
              element={<InvestmentDetails />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/faq" element={<FAQ />}/>
            <Route path="/faq/categories" element={<FAQCategories />}/>
            <Route path="/events" element={<Events />} />
            <Route path="/backup" element={<Backup />} />
            <Route path="/setting/setting" element={<Setting />} />

            <Route path="/payments/cashTransaction" element={<ReceivedTransactions />} />
            <Route path="/payments/cryptoTransactions" element={<CryptoTransactions />} />
            <Route path="/payments/accountBalance" element={<AccountBalance />} />
            <Route path="/payments/accountBalanceDetails" element={<AccountBalanceDetails />} />

            <Route path="/challenge/challengeList" element={<ChallengeList/>} />
            <Route path="/challenge/challengeDay" element={<ChallengeDay /> } />
            <Route path="/challenge/challengeReview" element={<ChallengeReview />} />
            <Route path="/challenge/statistics" element={<ChallengeStatistics />}/>
            <Route path="/challenge/statisticsDetails" element={<ChallengeStatisticsDetails />}/>
            <Route path="/challenge/questionManage/" element={<ManageChallengeQuestion />}/>

          

            
          </Routes>
         </SideBarLayout>
      ) : (
       
          <Routes>
            <Route path="/" element={<LingPage />} />
            <Route path="/confirm_reset_password/" element={<ResetPassword />} />
          </Routes>
       
      )}
    </div>
  );
}

export default App;
