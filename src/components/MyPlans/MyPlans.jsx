import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const MyPlans = () => {
  const calories = useSelector((state) => state.user.calories);
  const caloriesForGoal = useSelector((state) => state.user.caloriesForGoal);
  const weightGoal = useSelector((state) => state.user.weightGoal);

  const [calorieGoal, setCalorieGoal] = useState(weightGoal ? caloriesForGoal : calories);
  const [mealPlan, setMealPlan] = useState(null);
  const [error, setError] = useState(null);

  const ONE_DAY = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        const lastFetched = localStorage.getItem("mealPlanFetchedAt");
        const storedMealPlan = localStorage.getItem("mealPlan");

        const now = new Date().getTime();

        
        if (lastFetched && storedMealPlan && now - parseInt(lastFetched) < ONE_DAY) {
          setMealPlan(JSON.parse(storedMealPlan));
          return;
        }

        const res = await fetch("http://localhost:8080/api/v1/mealplans/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ calorieGoal, weightGoal }),
          credentials: "include"
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setMealPlan(data.meals);

        
        localStorage.setItem("mealPlan", JSON.stringify(data.meals));
        localStorage.setItem("mealPlanFetchedAt", now.toString());

      } catch (err) {
        console.error("Failed to fetch meal plan", err);
        setError("Something went wrong while loading your meal plan.");
      }
    };

    fetchMealPlan();
  }, [calorieGoal, weightGoal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCalorieGoal(weightGoal ? caloriesForGoal : calories);
    }, 1000);
    return () => clearInterval(interval);
  }, [weightGoal, calories, caloriesForGoal]);

  const breakfastCalories = Math.round(calorieGoal * 0.25);
  const lunchCalories = Math.round(calorieGoal * 0.35);
  const snackCalories = Math.round(calorieGoal * 0.15);
  const dinnerCalories = Math.round(calorieGoal * 0.25);

  const calculateMacros = (calories) => {
    if (!calories || isNaN(calories)) return { proteins: 0, carbs: 0, fats: 0 };

    const macros = {
      Gain: { protein: 0.25, carb: 0.50, fat: 0.25 },
      Lose: { protein: 0.35, carb: 0.40, fat: 0.25 },
      Maintain: { protein: 0.30, carb: 0.45, fat: 0.25 }
    };

    const { protein, carb, fat } = macros[weightGoal] || macros["Maintain"];
    return {
      proteins: Math.round((calories * protein) / 4),
      carbs: Math.round((calories * carb) / 4),
      fats: Math.round((calories * fat) / 9)
    };
  };

  if (error) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-red-600">
        {error}
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="text-center mt-20 text-xl font-semibold text-gray-600">
        Loading your personalized meal plan...
      </div>
    );
  }

  const mealCards = [
    { title: "Breakfast", calories: breakfastCalories, color: "bg-yellow-50", mealData: mealPlan?.Breakfast },
    { title: "Lunch", calories: lunchCalories, color: "bg-green-50", mealData: mealPlan?.Lunch },
    { title: "Snacks", calories: snackCalories, color: "bg-orange-50", mealData: mealPlan?.Snacks },
    { title: "Dinner", calories: dinnerCalories, color: "bg-blue-50", mealData: mealPlan?.Dinner }
  ].map((meal) => ({
    ...meal,
    macros: calculateMacros(meal.calories),
    suggestions: meal.mealData?.suggestions || []
  }));

  const totalMacros = mealCards.reduce(
    (acc, meal) => ({
      proteins: acc.proteins + meal.macros.proteins,
      carbs: acc.carbs + meal.macros.carbs,
      fats: acc.fats + meal.macros.fats
    }),
    { proteins: 0, carbs: 0, fats: 0 }
  );

  return (
    <div className="container mx-auto px-14 py-12 ">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Daily Meal Plan ({calorieGoal} calories)
        </h2>
        <div className="bg-white rounded-lg border-b-gray-700 shadow-md p-4 flex flex-wrap gap-4 justify-around">
          {["Proteins", "Carbs", "Fats"].map((macro, index) => (
            <div key={index} className="text-center">
              <p className="text-3xl text-blue-800 font-bold">Total {macro}</p>
              <p className="font-bold text-lg">{totalMacros[macro.toLowerCase()]}g</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mealCards.map((meal, index) => (
          <div
            key={index}
            className={`${meal.color} rounded-lg shadow-md p-6 min-h-[380px] transition-transform hover:scale-105`}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{meal.title}</h3>
            <p className="text-lg font-medium text-gray-700 mb-4">{meal.calories} Calories</p>

            <div className="mt-4 grid grid-cols-1 gap-2 text-xl mb-4">
              <div className="text-gray-600">
                <span className="font-medium">Protein: </span>{meal.macros.proteins}g
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Carb: </span>{meal.macros.carbs}g
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Fats: </span>{meal.macros.fats}g
              </div>
            </div>

            <div className="space-y-2 mt-8 flex-grow">
              <p className="text-2xl font-large text-gray-700">Suggested Meals:</p>
              <ul className="list-disc list-inside text-gray-700 text-lg">
                {meal.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPlans;
