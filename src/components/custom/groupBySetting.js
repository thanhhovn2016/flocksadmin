

 const groupBySetting = (arrayOfObject, property) => {
    return arrayOfObject?.reduce((acc, obj) => {
        const key = obj[property] || "first";
        if(!acc[key]){
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, 
    
    {})
    // 
    // return arrayOfObject?.reduce((acc , obj) => {
    //     const key = obj[property]
    //     let data = {
            
    //     }
    //     acc.push
    // })
}

export {groupBySetting}