import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../../redux/userSlice"; 

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/v1/user/login`,formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      navigate("/");
      console.log(res);
      dispatch(setAuthUser(res.data));
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 max-w-md mx-auto bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

       
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}
