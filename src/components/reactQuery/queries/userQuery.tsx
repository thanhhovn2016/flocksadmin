import React from "react"
import { useQuery } from "react-query"
import { api } from "../axios"
import {userMe} from '../constants'

const USER_ME_QUERY = async () => {
    return await api.get(userMe)
}


const handleGetUserDataFunction = async() => {
    const data  =  await api.get(userMe)
    return data
}

function  GetUserData   ()  {

    const {isLoading , error , data} =  useQuery("getUserData" , handleGetUserDataFunction)
    
    
    
    if (isLoading)return isLoading
    if (error) return error 
    if (data) return data
}

export { USER_ME_QUERY , GetUserData }