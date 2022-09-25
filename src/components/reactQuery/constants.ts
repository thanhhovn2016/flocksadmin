
// const BASE_URL  = "https://api.flocks.vn/api/v1"
const BASE_URL = "http://192.168.123.130:8000/api/v1"
//image path
//const IMAGES_PATH = "https://uploads.flocks.vn"
const IMAGES_PATH = "http://192.168.123.130:8000"


// token variable 
const accessToken = "accessTokenDashboard"
const refreshToken = "refreshTokenDashboard"
const authBase = "/auth/"
const tokensRefresh = `${authBase}token/refresh/`


//loginDashboard 
const loginDashboard = "/dashboard/users/sign_in/" 
const userMe = "/dashboard/users/me/"
const investment= "/dashboard/investment/"
const  companies = "/dashboard/company/"
const verification = "/dashboard/verification/"
const usersList = "/dashboard/users/"
const blog= "/dashboard/blog/"
const socialApp = "/dashboard/social_app/"
const emailServer = "/dashboard/email_server/"
const addUserDashboard = "/dashboard/users/"
const dashboardBlogCategory= "/dashboard/blog/category/"
const createBlog = "/dashboard/blog/"
const  addSocialApp = "/dashboard/social_app/"
const createBlogCategory = "/dashboard/blog/category/"
const getBlogCategory = "/dashboard/blog/category/"
const investmentQuestionClass= "/dashboard/investment/question/class/"
const addInvestmentQuestionClass = "/dashboard/investment/question/class/"
const lastOrderInvestment = "/dashboard/investment/question/class/last_order"
const lastOrderProject = "/dashboard/company/question/class/last_order/"
const lastOrderInvestmentQuestion = "/dashboard/investment/question/class/"
const lastOrderProjectQuestion = "/dashboard/company/question/class/"
const addInvestmentQuestion = "/dashboard/investment/question/"
const addCompanyQuestion = "/dashboard/company/question/"
const getCompanyQuestionClass = "/dashboard/company/question/class/"
const addCompanyQuestionClass = "/dashboard/company/question/class/"
const faqCategory = "/dashboard/faq/category/"
const faq = "/dashboard/faq/"
const event = "/dashboard/event/"
const backup = '/dashboard/backup/'
const systemOption = "/dashboard/system_option/"
const companyPresentation = "/dashboard/company/presentation/"
const paymentReceived = "/dashboard/payment/received/"
const paymentTransactionHistory = "/dashboard/payment/transaction_history"

//challenges
const  challengeDay= "/dashboard/challenge/day/"


const createChallenge = '/dashboard/challenge/item/'
const challengeItem = '/dashboard/challenge/item/'
const challengeReview = "/dashboard/challenge/review/"
const  challengeStatistic= "/dashboard/challenge/statistic/users_list/"
const challengeQuestion = "/dashboard/challenge/question/"


const getInvestmentQuestion = "/dashboard/investment/question/"

const getProjectQuestion = "/dashboard/company/question/"
//home page 
const analyticsCountData = "/dashboard/analytics/count_data/"
const analyticsLastUser = "/dashboard/analytics/last_user/"
const analyticsGraph = "/dashboard/analytics/graph/"
//media upload file
const mediaDownload = "/media/upload_media_file/"
//reset password
const resetPassword = "/auth/password/reset/email/send_code/"
const tokenCustomVerify = "/auth/token/custom/verify/"
const resetEmailConfirmCode = "/auth/password/reset/email/confirm_code/"
const ProfileMeChangePassword= "/dashboard/users/me/change_password/"

//payments 
const paymentCryptoTransactionHistory = "/dashboard/payment/crypto/transaction_history/"

export {
    BASE_URL,
    IMAGES_PATH,
    accessToken,
    refreshToken,
    tokensRefresh,
    loginDashboard,
    investment,
    userMe,
    companies,
    verification,
    usersList,
    blog,
    mediaDownload,
    socialApp,
    emailServer,
    addUserDashboard,
    dashboardBlogCategory,
    createBlog,
    addSocialApp,
    analyticsCountData,
    analyticsLastUser,
    analyticsGraph,
    createBlogCategory,
    getBlogCategory,
    investmentQuestionClass,
    addInvestmentQuestionClass,
    lastOrderInvestment,
    lastOrderInvestmentQuestion,
    addInvestmentQuestion,
    getCompanyQuestionClass,
    addCompanyQuestionClass,
    lastOrderProjectQuestion,
    addCompanyQuestion,
    getInvestmentQuestion,
    getProjectQuestion,
    resetPassword,
    tokenCustomVerify,
    resetEmailConfirmCode,
    lastOrderProject,
    faqCategory,
    faq,
    event,
    backup,
    systemOption,
    companyPresentation,
    ProfileMeChangePassword,
    paymentReceived,
    challengeDay,
    createChallenge,
    challengeItem,
    challengeReview,
    challengeStatistic,
    paymentTransactionHistory,
    challengeQuestion,
    paymentCryptoTransactionHistory
    
}