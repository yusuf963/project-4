import React, { useState, useEffect } from "react";
import axios from 'axios'

const useAxios = (url, method, body, headers) => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const responseData = await axios[method](url, body, headers)

        if (responseData) {
          setLoading(false)
          setResults(responseData.data);
        }
      } catch (err) {
        setLoading(false)
        setError(err.message)
      }

      setLoading(false)
    }

    makeRequest()
  }, [url])

  return {
    loading,
    results,
    error
  }
}

export default useAxios