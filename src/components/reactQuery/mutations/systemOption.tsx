import { api } from "../axios"
import { systemOption } from "../constants"

const UPDATE_SYSTEM_OPTION = async (value:any) => {
    return await api.put(systemOption + "bulkupdate/" , value)
}

export {
    UPDATE_SYSTEM_OPTION
}