import React from "react"
import { createContext, useEffect } from "react"

const FeedbackContext = createContext()

export const FeedbackProvider = ({children}) => {
    const [isLoading, setIsLoading] = React.useState(true)
    const [feedback, setFeedback] = React.useState([])
    const [feedbackEdit, setFeedbackEdit] = React.useState({
        item: {},
        edit: false
    })

    useEffect(() => {
        fetchFeedback()
    }, [])

    //fetch feedback
    const fetchFeedback = async () => {
        const response = await fetch(`/feedback?_sort=id&_order=desc`)
        const data = await response.json()
        setFeedback(data)
        setIsLoading(false)
    }

    //add feedback
    const addFeedback = async (newFeedback) => {
        const response = await fetch('/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFeedback),
    })

    const data = await response.json()
    setFeedback([data, ...feedback])
}

    //delete feedback
    const deleteFeedback = async (id) => {
        if(window.confirm("Are you sure you want to delete?")) {
            await fetch(`/feedback/${id}`, { method: "DELETE" })

            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    //update feedbackitem
    const updateFeedback = async (id, updItem) => {
        const response = await fetch(`/feedback/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updItem)
        })

        const data = await response.JSON()

        setFeedback(feedback.map((item) => item.id === id ? { ...item, ...data } : item))
    }

    //set item to be updated
    const editFeedback = (item) => {
        setFeedbackEdit({
            item,
            edit: true
        })
    }
    
    return <FeedbackContext.Provider value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback, 
        addFeedback,
        editFeedback,
        updateFeedback,
    }}>
        {children}
    </FeedbackContext.Provider>
}

export default FeedbackContext