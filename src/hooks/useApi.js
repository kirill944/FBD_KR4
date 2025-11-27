import React, { useState, useEffect, useCallback } from 'react'

function useApi(url, options = {}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchData = useCallback(async (abortController) => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(url, {
                ...options,
                signal: abortController?.signal
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)

        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message)
            }
        } finally {
            setLoading(false)
        }
    }, [url, JSON.stringify(options)])

    useEffect(() => {
        const abortController = new AbortController()

        if (url) {
            fetchData(abortController)
        }

        return () => {
            abortController.abort()
        }
    }, [url, fetchData])

    const refetch = useCallback(() => {
        const abortController = new AbortController()
        fetchData(abortController)
        return () => abortController.abort()
    }, [fetchData])

    return { data, loading, error, refetch }
}

export default useApi