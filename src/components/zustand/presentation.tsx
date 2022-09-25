const presentationFunction = (set:any) =>({
    details:{},
    setPresentationDetails:(question:any) => set((state:any) =>({
        details:question
    }))
})

export { presentationFunction }