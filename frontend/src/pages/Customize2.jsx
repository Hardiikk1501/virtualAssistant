
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';

function Customize2() {
  const {
    userData,
    backendImage,
    selectedImage,
    serverUrl,
    setUserData,
  } = useContext(UserDataContext);

  const navigate = useNavigate();

  const [assistantName, setAssistantName] = useState(
    userData?.assistantName || ''
  );
const[loading,setLoading]=useState(false)

  const handleUpdateAssistant = async (req, res) => {
    try {
      let formData = new FormData();

      formData.append('assistantName', assistantName);

      if (backendImage) {
        formData.append('assistantImage', backendImage);
      } else {
        formData.append('imageUrl', selectedImage);
      }
      console.time('Assistant Update API Call');
      
      const result = await axios.put(
        `${serverUrl}/api/user/assistant`,
        formData,
        { withCredentials: true },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }

      );

     console.timeEnd('Assistant Update API Call');
      console.log('assistant updated:', result.data);

      setUserData(result.data);

      navigate('/'); // optional navigation after success
    } catch (error) {
      console.error('Error updating assistant:', error);
    }finally {
      setLoading(false);
    }
  };

  const handleCreateAssistant = () => {
    if (assistantName.trim() !== '') {
      console.log('Assistant Name:', assistantName);
      setLoading(true);
      handleUpdateAssistant();
     
       console.log(selectedImage);
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black to-[#050160] flex flex-col items-center justify-center gap-6 px-4 py-8">
      
      {/* Heading */}
      <h1 className="text-3xl font-bold text-white text-center font-serif">
        Enter Your <span className="text-blue-500">Assistant Name</span>
      </h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Eg. Hardik"
        className="w-full max-w-md px-4 py-3 rounded-lg border-2 border-gray-300 bg-amber-200 text-black focus:outline-none focus:border-blue-500"
        value={assistantName}
        required
        onChange={(e) => setAssistantName(e.target.value)}
      />

      <button
        className={`font-bold py-2 px-6 rounded-2xl transition-all duration-200 text-white ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
        }`}
        disabled={loading || assistantName.trim() === ""}
        onClick={handleCreateAssistant}
      >
        {loading
          ? "Creating Assistant..."
          : "Finally, Create Your Assistant"}
      </button>

      {loading && (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-white text-sm">
            Please wait while your assistant is being created...
          </p>
        </div>
      )}
    </div>
  );
}

export default Customize2;