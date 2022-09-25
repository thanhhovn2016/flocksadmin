const userLogin = (set:any) =>({
    isLogin:false,
    setIsLogin:(login:boolean) => set((state:any) =>({
        isLogin:login
    }))
})

export {userLogin}