
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const UserDataContext = createContext();

function UserContext({ children }) {

  const serverUrl = "https://virtualassistant-kdfm.onrender.com";

  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // Get Current User
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        {
          withCredentials: true,
        }
      );

      setUserData(result.data);

      console.log("Current User:", result.data);

    } catch (error) {
      console.log(
        "Error fetching current user:",
        error.response?.data || error.message
      );
    }
  };
   
const getGeminiResponse = async (command) => {
  try {
    console.count("Gemini API Call");
console.log("Command:", command);
    
    const result = await axios.post(
      `${serverUrl}/api/user/asktoassistant`,
      { command },
      { withCredentials: true }
    );
      console.log("Sending to Gemini:", command);

    return result?.data;
    
  } catch (error) {
    console.error(
      "Error getting Gemini response:",
      error.response?.data || error.message
    );

    return null;
  }
};

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;