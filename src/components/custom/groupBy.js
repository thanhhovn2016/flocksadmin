// export const groupBy = (arrayOfObject, property) => {
//     return arrayOfObject?.reduce((acc, obj) => {
//         const key = obj[property];
//         if(!acc[key]){
//             acc[key] = [];
//         }
//         acc[key].push(obj);
//         return acc;
//     }, 
    
//     {})
//     // 
//     // return arrayOfObject?.reduce((acc , obj) => {
//     //     const key = obj[property]
//     //     let data = {
            
//     //     }
//     //     acc.push
//     // })
// }
const groupBy = (arrayOfObject, property) => {
    // 
    if (!arrayOfObject?.length){
return {}
    }
    const thisData = {}
    arrayOfObject?.reduce((acc , obj)=> {
    const key = obj?.question?.questionClass?.[property]
            if(!thisData[key]){
                thisData[key] = [];
        }
        thisData[key].push(obj);
        return thisData;
   })
   return thisData
}

export { groupBy }