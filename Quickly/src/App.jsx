import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './Pages/Login.jsx'
import HomePage from './Pages/Home.jsx'
import SignUpPage from './Pages/SignUp.jsx'
import ForgetPasswordPage from './Pages/ForgetPassword.jsx'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App