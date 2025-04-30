import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState, } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../../redux/userSlice';

export default function () {
  
   const Navigate = useNavigate();
   const dispatch = useDispatch();
  const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      firstName: "",
      gender: "",
      dateOfBirth: "",
      country: "India",
      heightFeet: "",
      heightInches: "",
      currentWeight:"",
      activityLevel: "",
      goal : "",
      TraningEXP:"",
      username: "",
      password:"",
      confirmPassword:"",
      profilePicture: "",
      role:""
      
    });

    const [showThankYou, setShowThankYou] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleNext = async () => {
      const validationError = validateFields();
      if (validationError) {
        toast.error(validationError);
        return;
      }
  
      
      if (formData.role === "Trainer" && step === 1) {
        setStep(7);
        return;
      }
  
      
      if (step === 7) {
        await handleSubmit();
      } else {
        setStep((prev) => prev + 1);
      }
    };
  
    const validateFields = () => {
      if (step === 1 && !formData.firstName) return "First name is required";
      if (step === 2 && (!formData.gender || !formData.dateOfBirth)) return "Gender and Date of Birth are required";
      if (step === 3 && (!formData.heightFeet || !formData.heightInches || !formData.currentWeight)) return "Height and Weight are required";
      if (step === 4 && !formData.activityLevel) return "Please select an activity level";
      if (step === 5 && !formData.TraningEXP) return "Training experience is required";
      if (step === 6 && !formData.goal) return "Please select a goal";
      if (step === 7) {
        if (!formData.username || !formData.password || !formData.confirmPassword) {
          return "Username, Password, and Confirm Password are required";
        }
        if (formData.password.length < 6) {
          return "Password must be at least 6 characters";
        }
        if (formData.password !== formData.confirmPassword) {
          return "Passwords do not match!";
        }
      }
      return null;
    };
  
    const handleBack = () => {
      if (step === 1) {
        window.location.href = "/";
      } else {
        setStep((prev) => prev - 1);
      }
    };
  
    const letsStart = () => {
      Navigate("/login");
    };
  
    const handleSubmit = async () => {
      setLoading(true);
  
      try {
        
        const payload = formData.role === "Trainer"
          ? {
              firstName: formData.firstName,
              username: formData.username,
              password: formData.password,
              confirmPassword: formData.confirmPassword,
              gender: "Male", 
              dateOfBirth: new Date(),
              heightFeet: 5,
              heightInches: 5,
              currentWeight: 60,
              activityLevel: "Not Very Active",
              goal: "Gain",
              TraningEXP: "Beginner",
              role: formData.role,
            }
          : formData;
  
        const res = await axios.post("http://localhost:8080/api/v1/user/register", payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
  
        if (res.data.message === "User created successfully") {
          toast.success("Registration Successful!");
          dispatch(setAuthUser(res.data)); 
          setShowThankYou(true);
        } else {
          toast.error("Registration failed");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Registration failed");
      }
  
      setLoading(false);
    };
  
    
  
    if (showThankYou) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Thank you! <br />{formData.firstName}</h2>
            <p className="text-gray-600">Your information has been submitted successfully.</p>
            <button onClick={letsStart} className='flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors'>Let's Start</button>
          </div>
    
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg">
          
          
  
          <div className="p-8">
            {step === 1 && (
               <div className="space-y-6">
               <div className="text-center">
                 <h2 className="text-2xl font-bold mb-2">What's your first name?</h2>
               </div>
               <input
                 type="text"
                 name="firstName"
                 value={formData.firstName}
                 onChange={handleInputChange}
                 placeholder="First Name"
                 required
                 className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
         
              
               <div>
                 <h2 className="text-2xl font-bold mb-2">Select your role</h2>
                 <div className="space-y-4">
                   <label className="flex items-center gap-3">
                     <input
                       type="radio"
                       name="role"
                       value="User"
                       checked={formData.role === "User"}
                       onChange={handleInputChange}
                       required
                       className="w-4 h-4"
                     />
                     User
                   </label>
                   <label className="flex items-center gap-3">
                     <input
                       type="radio"
                       name="role"
                       value="Trainer"
                       checked={formData.role === "Trainer"}
                       onChange={handleInputChange}
                       required
                       className="w-4 h-4"
                     />
                     Trainer
                   </label>
                 </div>
                 <div className="w-full mt-8 mx-auto flex items-center">
                  <p>Already have an account?  <Link 
                  to="/login"
                  >Login</Link></p>
                 </div>
               </div>
             </div>
              
            )}
  
            {step === 2 && (
              <div className="space-y-6">
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">Select your gender</h2>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 cursor-pointer"
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 cursor-pointer"
                      />
                      Female
                    </label>
                  </div>
                </div>
  
              
                <div>
                  <h2 className="text-2xl font-bold mb-2">Date of Birth</h2>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    placeholder="MM/DD/YYYY"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
  
            {step === 3 && (
              <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold mb-2">How tall are you?</h2>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="heightFeet"
                    value={formData.heightFeet}
                    onChange={handleInputChange}
                    placeholder="Feet"
                    required
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="heightInches"
                    value={formData.heightInches}
                    onChange={handleInputChange}
                    placeholder="Inches"
                    required
                    className="w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
          
              
              <div>
                <h2 className="text-2xl font-bold mb-2">What is your current weight?</h2>
                <input
                  type="text"
                  name="currentWeight"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  placeholder="Weight in kg"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
  
            )}
            {step=== 4 &&(
              <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">activity level?</h2>
  
                {["Not Very Active", "Lightly Active", "Active", "Very Active"].map((level) => (
                  <div
                    key={level}
                    onClick={() => setFormData((prev) => ({ ...prev, activityLevel: level }))}
                    className={`p-4 border rounded-lg mb-3 cursor-pointer transition-colors  required ${
                      formData.activityLevel === level
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">{level}</div>
                    <div className="text-gray-600 text-sm  required">
                      {level === "Not Very Active" && "Spend most of the day sitting"}
                      {level === "Lightly Active" &&
                        "Spend a good part of the day on your feet"}
                      {level === "Active" &&
                        "Spend a good part of the day doing some physical activity "}
                      {level === "Very Active" &&
                        "Spend a good part of the day doing heavy physical activity "}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
            {step === 5 && (
              <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Training experience</h2>
  
                {["Beginner", "Intermediate","Expert" ].map((level) => (
                  <div
                    key={level}
                    onClick={() => setFormData((prev) => ({ ...prev, TraningEXP:level }))}
                    className={`p-4 border rounded-lg mb-3 cursor-pointer transition-colors  required${
                      formData.TraningEXP === level 
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="font-medium">{level}</div>
                    <div className="text-gray-600 text-sm">
                      {level === "Beginner " }
                      {level === "Intermediate "}
                      {level === "Expert "}
                    </div>
                  </div>
                ))}
              </div>
            </div>
              
            )}
            {step === 6 && (
              <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Goal</h2>
  
                {["Gain", "Lose", ].map((level) => (
                  <div
                    key={level}
                    onClick={() => setFormData((prev) => ({ ...prev, goal:level }))}
                    className={`p-4 border rounded-lg mb-3 cursor-pointer transition-colors  required ${
                      formData.goal === level 
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }` }
                  >
                    <div className="font-medium">{level}</div>
                    <div className="text-gray-600 text-sm">
                      {level === "Gain " }
                      {level === "Lose "}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
            {step === 7 &&(
              <div className="space-y-6">
              
              <div>
                <h2 className="text-2xl font-bold mb-2 ">Sign up</h2>
                
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className=" w-full mb-5 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

            
        
                 <input
                    type='password'
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className=" w-full mb-5 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                   <input
                    type='password'
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm Password"
                    className=" w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>

            </div>

            )}
      
  
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleBack}
                className="flex-1 py-3 px-4 border-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold hover:bg-blue-50 transition-colors"
              >
                BACK
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
              >
                {step === 7 ? `SUBMIT` : "NEXT"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}
