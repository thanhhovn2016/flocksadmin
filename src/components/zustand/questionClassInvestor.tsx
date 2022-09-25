const questionClassInvestor = (set:any) =>({
    question:0,
    setQuestionClassId:(question:any) => set((state:any) =>({
        question:question
    }))
})

const questionClassProject = (set:any) =>({
    question:0,
    setQuestionProjectId:(question:any) => set((state:any) =>({
        question:question
    }))
})

export {questionClassInvestor , questionClassProject }