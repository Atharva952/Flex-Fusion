import React from "react";
import { useRef, useState,useEffect } from "react"; 
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";


export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const authUser = useSelector((state) => state.user.authUser);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!authUser) {
      navigate("/");
    }

   
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setPreviewImage(savedImage);
    }
  }, [authUser, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        localStorage.setItem("profileImage", reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  if (!authUser) return null;

  return (
    <div className="h-[91vh] flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-200">
      <div className="bg-white p-7 rounded-2xl shadow-xl w-full max-w-xl text-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={previewImage || authUser.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-3 border-gray-700 cursor-pointer hover:opacity-90 transition-all"
              onClick={handleImageClick}
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <h2 className="text-3xl font-bold mt-4">{authUser.firstName}</h2>
          <p className="text-gray-600 text-sm mb-2">@{authUser.username}</p>
          <p className="text-sm font-medium text-blue-500 mb-6 ">{authUser.role}</p>
        </div>

        {authUser.role === "User" && (
          <div className="text-left space-y-2 text-gray-700">
          <p><strong>Gender:</strong> {authUser.gender}</p>
          <p><strong>Date of Birth:</strong> {new Date(authUser.dateOfBirth).toLocaleDateString()}</p>
          <p><strong>Height:</strong> {authUser.heightFeet}' {authUser.heightInches}"</p>
          <p><strong>Weight:</strong> {authUser.currentWeight} kg</p>
          <p><strong>Activity Level:</strong> {authUser.activityLevel}</p>
          <p><strong>Goal:</strong> {authUser.goal}</p>
          <p><strong>Training Experience:</strong> {authUser.TraningEXP}</p>
        </div>
      )}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}