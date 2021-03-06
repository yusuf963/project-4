import React, { useContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'

const FileUploadContext = React.createContext()

export const useFileUploads = () => {
  return useContext(FileUploadContext)
}

export const FileUploadProvider = ({ token, children }) => {

  const [selectedFile, updateSelectedFile] = useState({})
  const [fileIsUploading, updateFileIsUploading] = useState(false)
  const [fileBase64, updateFileBase64] = useState('')

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onerror = reject
      fr.onload = function () {
        resolve(fr.result)
        updateFileBase64(fr.result)
      }
      fr.readAsDataURL(file)
    })
  }

  const uploadImageHandler = async () => {

    if (fileBase64.length <= 0) return

    updateFileIsUploading(true)

    const axiosConfig = {
      url: '/api/files',
      method: 'post',
      data: {
        content: fileBase64
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    const imageResponse = await axios.request(axiosConfig).then(({ data })=> {
 
      return data
    })

    updateFileIsUploading(false)

    return imageResponse

  }

  const value = {
    selectedFile,
    updateSelectedFile,
    fileIsUploading,
    getBase64,
    uploadImageHandler
  }
  
  return (
    <FileUploadContext.Provider value={value}>
      { children }
    </FileUploadContext.Provider>
  )

}

