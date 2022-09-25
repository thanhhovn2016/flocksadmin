import create from 'zustand'
import  {devtools} from 'zustand/middleware'
import { userStore } from './userStore'
import {userLogin} from './userLogin'
import { questionClassInvestor  , questionClassProject}from "./questionClassInvestor"
import { projectDetails } from './projectDetails'
import { investmentDetails } from './investmentDetails'
import { presentationFunction } from './presentation'


const useStore = create(devtools(userStore  ))
const userLoginStore = create(devtools(userLogin))
const questionClassInvestors = create(devtools(questionClassInvestor))
const questionProjectClass = create(devtools(questionClassProject))
const project = create(devtools(projectDetails))
const investmentData = create(devtools(investmentDetails))
const presentation = create(devtools(presentationFunction))

export {useStore , userLoginStore , questionClassInvestors , questionProjectClass , project , investmentData , presentation}