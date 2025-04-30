import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import Footer from '../Footer/Footer';

export default function Home() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.user.authUser);
  const handleGetStarted = ()=>{
     navigate("/register");
  }
  return (
    <>
     <div className="bg-[url('/src/assets/images/pexels-victorfreitas-949126.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
  <div className="text-white py-16 px-6">
    <div className="ml-10">
      <p className="text-lg font-extrabold uppercase mb-4">Flex fusion</p>
      <p className="text-sm font-semibold uppercase mb-4">nutrition fitness app</p>
      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
        Nutrition tracking <br />
        <span className="text-gray-900 bg-white px-2 inline-block">for real life</span>
      </h1>
      <p className="text-lg font-light mb-8">
        Make progress with the all-in-one food, exercise, and calorie tracker.
      </p>
      {!authUser && (
              <button
                className="bg-white text-gray-900 font-medium px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition cursor-pointer" 
                onClick={handleGetStarted}
              >
                START TODAY →
              </button>
            )}
    </div>
  </div>
  
</div>
      
      <Footer />
    </>
    
  )
}
