import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import chatReducer from "./chatSlice"
import mealPlanReducer from "./mealPlanSlice"
const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer, 
        mealPlan: mealPlanReducer,
    }
})
export default store;