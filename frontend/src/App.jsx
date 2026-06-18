import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'
import Home from './pages/Home'
import { Navigate } from 'react-router-dom'
import { UserDataContext } from './context/UserContext'

function App() {

    const { userData, setUserData } = useContext(UserDataContext)
  return (
    <Routes>
       <Route path="/" element={( userData ?.assistantImage && 
                            userData.assistantName )?<Home /> : <Navigate to={"/customize"} />} />
  
      <Route path="/customize" element={userData ?<Customize />:<Navigate to={"/signin"} />} />
      <Route path="/customize2" element={userData ?<Customize2 />:<Navigate to={"/signin"} />} />

      <Route path="/signup" element={"<SignUp />" }/>
      
      {/* <Route path="/signup" element={ !userData ? <SignUp /> : <Navigate to={"/customize"} />} /> */}
      <Route path="/signin" element={ !userData ? <SignIn /> : <Navigate to={"/customize"} />} />
    </Routes>
  )
}

export default App  