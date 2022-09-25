const projectDetails = (set:any) =>({
    details:{},
    setProjectDetails:(question:any) => set((state:any) =>({
        details:question
    }))
})

export { projectDetails }