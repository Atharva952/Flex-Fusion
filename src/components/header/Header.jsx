import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa"



export default function Header() {
  const authUser = useSelector((state) => state.user.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let navItems = [];

  if (authUser) {
    if (authUser.role === "Trainer") {
      navItems = [{ to: "trainer-chat", label: "Chat-With-User" }];
    } else {
      navItems = [
        { to: "", label: "Home" },
        { to: "MyWorkout", label: "MyWorkout" },
        { to: "MyTracker", label: "MyTracker" },
        { to: "MyPlans", label: "MyPlans" },
        { to: "MyTrainer", label: "MyTrainer" },
      ];
    }
  } else {
    navItems = [
      { to: "Register", label: <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-1">Sign Up</div> },
    ];
  }

  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate("/Login"); 
  };

  const profilePic = localStorage.getItem("profileImage");

  return (
    <header className="bg-white flex items-center justify-between px-6 py-3 shadow-md">
      <nav className="flex items-center">
        <ul className="flex space-x-8 font-semibold">
          {navItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.to}
                end
                className={({ isActive }) =>
                  `hover:text-blue-500 ${isActive ? "text-blue-800 font-bold" : ""}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {authUser && (
        <div className="flex items-center space-x-4">
          <NavLink to="/Profile">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-10.5 h-10.5 rounded-full object-cover cursor-pointer hover:opacity-90 transition-all"
              />
            ) : (
              <FaUserCircle className="text-4xl text-gray-600" />
            )}
          </NavLink>
        </div>
      )}
    </header>



   
  )
}
