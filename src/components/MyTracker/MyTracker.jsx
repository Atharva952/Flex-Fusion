 import React,{useEffect,useState} from 'react'
 import MyPlans from '../MyPlans/MyPlans';
 import {useSelector } from 'react-redux';
 import { useDispatch } from 'react-redux';
 import { setAuthUser,setBMR,setCalories,setCaloriesForGoal,setGoalWeight, } from '../../redux/userSlice';
 
 export default function MyTracker() {
  const userState = useSelector((state) => state.user)
  console.log("Redux State:", userState);
  const dispatch = useDispatch();
  const {
    authUser,
    bmr,
    calories,
    goalWeight,
    caloriesForGoal,
  } = useSelector((state) => state.user);

  useEffect(() => {
    
    const storedCalories = parseFloat(localStorage.getItem("calories")) || 0;
    const storedGoalCalories = parseFloat(localStorage.getItem("caloriesForGoal")) || 0;
    
    dispatch(setCalories(storedCalories));          
    dispatch(setCaloriesForGoal(storedGoalCalories)); 
  }, [dispatch]);

  useEffect(() => {
    const storedGoalWeight = localStorage.getItem("goalWeight");
    const storedGoalCalories = localStorage.getItem("caloriesForGoal");
  
    if (storedGoalWeight) dispatch(setGoalWeight(storedGoalWeight));
    if (storedGoalCalories) dispatch(setCaloriesForGoal(storedGoalCalories));
  }, [dispatch]);
  
  

  useEffect(() => {
    if (authUser) {
      calculateBMR(authUser);
    }
  }, [authUser]);

  const calculateBMR = (data) => {
    if (!data) return;
    const { gender, dateOfBirth, heightFeet, heightInches, currentWeight } = data;
    if (!gender || !dateOfBirth || !heightFeet || !heightInches || !currentWeight) return;

    const heightCm = Number(heightFeet) * 30.48 + Number(heightInches) * 2.54;
    const weightKg = Number(currentWeight);
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

    let calculatedBMR =
      gender === "Male"
        ? 88.36 + 13.4 * weightKg + 4.8 * heightCm - 5.7 * age
        : 447.6 + 9.2 * weightKg + 3.1 * heightCm - 4.3 * age;

    dispatch(setBMR(calculatedBMR.toFixed(2)));
    calculateCalories(calculatedBMR, data);
  };

  const calculateCalories = (bmrValue, data) => {
    if (!data) return;
    const { activityLevel, goal } = data;
    const activityMultipliers = {
      "Not Very Active": 1.2,
      "Lightly Active": 1.375,
      Active: 1.55,
      "Very Active": 1.725,
    };

    const tdee = bmrValue * (activityMultipliers[activityLevel] || 1.2);
    const adjustedCalories = goal === "Gain" ? tdee + 500 : goal === "Lose" ? tdee - 500 : tdee;

    dispatch(setCalories(adjustedCalories.toFixed(2)));
  };

  const handleSetGoal = () => {
    if (!goalWeight || !authUser?.currentWeight) return;
    const currentWeight = Number(authUser.currentWeight);
    const weightDifference = goalWeight - currentWeight;
    const newCaloriesForGoal = parseFloat(calories) + (weightDifference * 500) / 7;

    dispatch(setCaloriesForGoal(newCaloriesForGoal.toFixed(2)));
    localStorage.setItem("goalWeight", goalWeight);
    localStorage.setItem("caloriesForGoal", newCaloriesForGoal.toFixed(2));
  };


  return (
    <>
   <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-10 px-6">
  <div className="max-w-6xl mx-auto space-y-10">

   
    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-6">Your BMR & Caloric Needs</h2>
      
      <div className="relative w-56 h-56">
        <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
          
          <path
            strokeDasharray="80, 100"
            className="text-blue-500"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          
          <path
            strokeDasharray="60, 100"
            className="text-green-500"
            d="M18 2.0845
               a 15.9155 15.9155 0 0 1 0 31.831
               a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-lg font-medium text-gray-700">BMR</p>
          <p className="text-2xl font-bold text-blue-600">{bmr} kcal</p>
          <p className="text-sm mt-2 font-medium text-gray-700">Calories to {authUser?.goal === "Gain" ? "Gain" : "Lose"} Weight</p>
          <p className="text-xl font-semibold text-green-600">{calories} kcal/day</p>
        </div>
      </div>
    </div>

    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold  text-gray-800  mb-4 text-center">Set Your Goal Weight</h2>
        <input
          type="number"
          value={goalWeight || ''}
          onChange={(e) => dispatch(setGoalWeight(e.target.value))}
          placeholder="Enter goal weight (kg)"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSetGoal}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            Set Goal
          </button>
          <button
          onClick={() => {
            dispatch(setGoalWeight(""));
            dispatch(setCaloriesForGoal(0));
            localStorage.removeItem("goalWeight");
            localStorage.removeItem("caloriesForGoal");
          }}
          
            className="px-5 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600"
          >
            Edit Goal
          </button>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Goal-Based Calories</h2>
        {caloriesForGoal ? (
          <div className="relative w-40 h-40 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="absolute top-0 left-0 w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <path
                className="text-purple-500"
                strokeDasharray="80, 100"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="text-xl font-bold text-purple-700">{caloriesForGoal} kcal</span>
          </div>
        ) : (
          <p className="text-gray-500">Set a goal weight to view this.</p>
        )}
      </div>
    </div>
  </div>
</div>
    </>
  );
 }
 