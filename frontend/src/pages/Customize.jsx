import React, { useRef, useContext } from 'react';
import Card from '../components/Card';

import image1 from '../assets/A2H.png';
import image2 from '../assets/A1.jpg';
import image3 from '../assets/A3.png';
import image4 from '../assets/AI_man.jpeg';
import image5 from '../assets/female.png';
import image6 from '../assets/AIf.png';

import { UserDataContext } from '../context/UserContext';
import { RiUploadCloud2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

function Customize() {
  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(UserDataContext);

  const inputImage = useRef(null);
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setBackendImage(file);
      setFrontendImage(URL.createObjectURL(file));
      setSelectedImage('input');
    }
  };
console.log("selectedImage:", selectedImage);
console.log("backendImage:", backendImage);

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black to-[#050160] flex flex-wrap items-center justify-center gap-6 px-4 py-8">
      
      {/* Heading */}
      <h1 className="text-4xl font-bold text-white w-full text-center font-serif">
        Select Your Avatar
      </h1>
      {/* Avatar Cards */}
      <Card image={image1} />
      <Card image={image2} />
      <Card image={image3} />
      <Card image={image4} />
      <Card image={image5} />
      <Card image={image6} />



      {/* Upload Card */}
      <div
        className={`w-52 h-80 overflow-hidden rounded-lg border-2 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105
        flex items-center justify-center bg-blue-300 mx-4
        ${
          selectedImage === 'input'
            ? 'border-white'
            : 'border-blue-500 hover:border-white'
        }`}
        onClick={() => {
          inputImage.current.click();
        
        }}
      >
        {!frontendImage ? (
          <RiUploadCloud2Fill className="text-5xl text-red-500" />
        ) : (
          <img
            src={frontendImage}
            alt="Uploaded Avatar"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputImage}
        className="hidden"
        onChange={handleImage}
      />

      {/* Button */}
      <div className="w-full flex justify-center mt-6">
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-2xl transition-all duration-200
          ${
            !selectedImage
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          disabled={!selectedImage}
          onClick={() => navigate('/customize2')}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Customize;