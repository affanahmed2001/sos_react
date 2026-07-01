import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
// import './CreateLead.css'
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from './api';


const update_lead = () => {

  const { lead_id } = useParams();
  console.log('LeadID =>', lead_id);
  const navigate = useNavigate();

  const [load, setLoad] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    file: null,
    city: "",
    fbid: "",
    created_date: "",
    existingFilePath: "",
    file_path: "",  
  });

  useEffect(() => {
    if (!lead_id) return;

    const fetchLeadData = async () => {
      try {
        const token=localStorage.getItem('token')
        // const response = await fetch(`http://localhost:3011/data/data/${lead_id}`,{
        const response = await fetch(`${baseUrl}/data/data/${lead_id}`,{
          method:"GET",
  // credentials: "include",  
          headers:{
            token,
          },
        });
        const data = await response.json();

        console.log('Fetching data =>', data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          designation: data.designation || "",
          city: data.city || "",
          fbid: data.fbid || "",
          created_date: data.created_date ? data.created_date.split("T")[0] : "",
          file: null,
          existingFilePath: data.file_path,
          file_path: data.file_path || "",
        });
        setLoad(false);
      } catch (error) {
        console.error("Error fetching lead data:", error);
      }
    };

    if (lead_id) {
      fetchLeadData();
    }
  }, [lead_id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const api = `http://localhost:3011/data/update/${lead_id}`;
    const api = `${baseUrl}/data/update/${lead_id}`;
    const token = localStorage.getItem('token');

    try {
      const data = new FormData();
      data.append("lead_id", lead_id);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("designation", formData.designation);
      if (formData.file) {
        data.append("cv", formData.file);
      }else if (formData.file_path) {
        // const fileResponse = await fetch(`http://localhost:3011/${formData.file_path}`);
        const fileResponse = await fetch(`${baseUrl}/${formData.file_path}`);
        const fileBlob = await fileResponse.blob();
        const fileName = formData.file_path.split('/').pop(); // Get the filename
        data.append("cv", fileBlob, fileName);
      }
      data.append("city", formData.city);
      data.append("fbid", formData.fbid);
      data.append("created_date", formData.created_date);

      const response = await fetch(api,
        {
          method: "PUT",
          body: data,
          headers: {
           token 
          },
        });
      if (!response.ok) {
        throw new Error("Failed to update Lead");
      }
      const result = await response.json();
      alert("Lead updated successfully!");
      // setMessage(result.message);
      setFormData({ lead_id: "", name: "", email: "", phone: "", designation: "", file: null, city: "", fbid: "", created_date: "", });

      document.querySelector('input[type="file"]').value = "";
    } catch (error) {
      console.log("Error", error);
      alert("Error in saving data");
    }

  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoad(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <Navbar />
      <div className='createLeadHome'>
        <div className="form-container">
          <h2>Update Lead</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
            <input type="number" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Designation" />
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            <input type="text" name="fbid" value={formData.fbid} onChange={handleChange} placeholder="fbid" />
            <input type="date" name="created_date" value={formData.created_date} onChange={handleChange} placeholder="Created Date" />
            <span className='file'><input type="file" className='chooseFile' name="file" onChange={handleFileChange} accept="application/pdf" />
            {formData.existingFilePath ?
              (<a
                // href={`http://localhost:3011/data/update/${formData.existingFilePath}`}
                href={`${baseUrl}/${formData.existingFilePath}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View CV
              </a>) : (<span>Upload CV</span>)
            }</span>
            <button type="submit">Update</button>
          </form> 
        </div>
      </div>
    </>
  )
}

export default update_lead


