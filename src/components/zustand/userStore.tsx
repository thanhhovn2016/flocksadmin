

const userStore = (set:any) =>({
    user:{},
    setUser:(userDetails:any) => set((state:any) =>({
        user:{...userDetails}
    }))
})


export {userStore }