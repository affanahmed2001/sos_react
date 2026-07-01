import React, { useState } from 'react'
// import "./Login.css"
import { useNavigate, Navigate } from 'react-router-dom';
import { baseUrl } from './api';


const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  
  const token = localStorage.getItem('token');
  // if (token) {return <Navigate to="/dashboard" replace />;}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  
  const handleSubmit = async (e) => {
    // const API = `http://localhost:3011/data/login`;
    const API = `${baseUrl}/data/login`;
    e.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", 
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      // console.log(data.user.token);
      

      if (data.success) {
        const token = data.user.token; 
        // console.log('token : ',token);
        
        localStorage.setItem("token", token); 
      
        alert("Login success");
        navigate("/dashboard");
      } else {
        alert(data.message || "Login Failed");
      }
      

    } catch (error) {
      console.log("Error", error);
      alert("Login error");
    }
  };

  return (
    <>
      <div className='loginHome'>
        <form onSubmit={handleSubmit}>
          <img src="/image/Logo.png" alt="" className='logo' />
          <input
            type="text"
            name="username"
            placeholder="Your Email"
            value={loginData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={handleChange}
          />
          <button type="submit">Submit</button>
        </form>

      </div>
    </>
  )
}


export default Login 