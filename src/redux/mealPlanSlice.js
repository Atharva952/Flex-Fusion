 import { createSlice } from "@reduxjs/toolkit";

 const initialState = {
    calorieGoal: 0,
    weightGoal: "Maintain",
  };
  
  const mealPlanSlice = createSlice({
    name: "mealPlan",
    initialState,
    reducers: {
      setCalorieGoal: (state, action) => {
        state.calorieGoal = action.payload;
      },
      setWeightGoal: (state, action) => {
        state.weightGoal = action.payload;
      },
    },
  });
  
  export const { setCalorieGoal, setWeightGoal } = mealPlanSlice.actions;
  export default mealPlanSlice.reducer;