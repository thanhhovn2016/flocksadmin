const investmentDetails = (set:any) =>({
    details:{},
    setInvestmentDetails:(question:any) => set((state:any) =>({
        details:question
    }))
})

export { investmentDetails }