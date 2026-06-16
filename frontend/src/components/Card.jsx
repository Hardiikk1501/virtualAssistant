import React from 'react'
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';

function Card({ image }) {

     const  { serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage
  } =useContext(UserDataContext);

  return (
    <div className={`w-50 h-80 overflow-hidden rounded-lg border-2 border-blue-500 shadow-lg cursor-pointer transition-all duration-300
                   hover:scale-105 flex items-center justify-center bg-blue-300 mx-4 hover:border-white ${selectedImage === image ? 'border-white' : ''}`}
                     onClick={() =>{
                      setSelectedImage(image)
                      setBackendImage(null)
                      setFrontendImage(null)
                     }}>
      
      <img
        src={image}
        alt='Avatar'
        className='w-full h-full object-cover'
      />

    </div>
  )
}

export default Card