import { createSlice } from "@reduxjs/toolkit";
const storedUser = JSON.parse(localStorage.getItem("authUser")) || null;
const userSlice = createSlice({
    name: "user",
    initialState: {
      authUser: JSON.parse(localStorage.getItem("authUser")) || null,
       bmr: 0,
       calories: 0,
       goalWeight: 0,
       caloriesForGoal: null,
       workouts: [],
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
            localStorage.setItem("authUser", JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.authUser = null;
            localStorage.removeItem("authUser"); 
          },
          setBMR: (state, action) => {
            state.bmr = action.payload;
          },
          setCalories: (state, action) => {
            state.calories = action.payload;
          },
          setGoalWeight: (state, action) => {
            state.goalWeight = action.payload;
          },
          setCaloriesForGoal: (state, action) => {
            state.caloriesForGoal = action.payload;
          },
          setWorkouts: (state, action) => {
            state.workouts = action.payload;
          },
    },
})

export const { setAuthUser,logoutUser, setBMR, setCalories, setGoalWeight, setCaloriesForGoal,setWorkouts} = userSlice.actions;
export default userSlice.reducer;