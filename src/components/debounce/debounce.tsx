import AwesomeDebouncePromise from "awesome-debounce-promise"
import useConstant from "use-constant"
import { useAsync } from "react-async-hook"
import React from "react"

interface QueryStateType  {
 text:string
//  from:string,
//  to:string,
 name?:string
}
export const useDebouncedSearch = (searchFunction: any) => {
  // Handle the input text state
  const [queryState, setQueryState] = React.useState<QueryStateType>({
   text:"",
//    from:"tr",
//    to:"en",
   name:""
  })

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 1000)
  )

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    return debouncedSearchFunction(queryState)
  }, [debouncedSearchFunction, queryState])

  // Return everything needed for the hook consumer
  return {
    queryState,
    setQueryState,
    searchResults,
  }
}