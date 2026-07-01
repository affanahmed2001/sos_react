import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
// import './CreateLead.css'
import { baseUrl } from './api';

const Creat_lead = () => {
 
  const [load, setLoad] = useState(true);
  const [formData, setFormData] = useState({
    names: "",
    email: "",
    phone: "",
    designation: "",
    file:null,
    city:"",
    FBID:"",
    createdDate:"",
  });

  // const [message,setMessage]=useState("");

  const handleChane = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange=(e)=>{
    setFormData((prevData)=>({
        ...prevData,
        file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    
    // const api = `http://localhost:3011/data/create`;
    const api = `${baseUrl}/data/create`;
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("names", formData.names);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("designation", formData.designation);
      data.append("cv", formData.file);
      data.append("city", formData.city);
      data.append("FBID", formData.FBID);
      data.append("createdDate", formData.createdDate);

      const response  =await fetch(api,
        {
          method:'POST',
          headers: {
           token,
          },          
          body:data,
        });
        if(!response.ok){
          throw new error("Failed to fetch api");
        }
        const result = await response.json();
        // setMessage(result.message);
        setFormData({names:"",email:"",phone:"",designation:"",cv:"",city:"",FBID:"",createdDate:"",});
        alert("data Created Successfully!");

        document.querySelector('input[type="file"]').value = "";

      
    } catch (error) {
      console.log("Error",error);
      // setMessage("Error in saving data")
    }

  };

  useEffect(()=>{
    const timer = setTimeout(() => {
      setLoad(false);
    }, 1000);
    return ()=> clearTimeout(timer);
  },[]);


  return (
    <>
      <Navbar />
      <div className='createLeadHome'>
        <div className="form-container">
          <h2>Create Lead</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="names" value={formData.names} onChange={handleChane} placeholder="Full Name" />
            <input type="email" name="email" value={formData.email} onChange={handleChane} placeholder="Email Address" />
            <input type="number" name="phone" value={formData.phone} onChange={handleChane} placeholder="Phone Number" />
            <input type="text" name="designation" value={formData.designation} onChange={handleChane} placeholder="Designation" />
            <input type="text" name="city" value={formData.city} onChange={handleChane} placeholder="City" />
            <input type="text" name="FBID" value={formData.FBID} onChange={handleChane} placeholder="FBID" />
            {/* <input type="date" name="createdDate" value={formData.createdDate} onChange={handleChane} placeholder="CreatedDate" /> */}
            <input type="file" name="file" onChange={handleFileChange} accept="application/pdf" required />
    
            <button type="submit">Create</button>
          </form>
          {/* <p>{message}</p> */}
        </div>
      </div>
    </>
  )
}

export default Creat_lead


