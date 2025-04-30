import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import MyWorkout from './components/MyWorkout/MyWorkout.jsx'
import Home from './components/Home/Home.jsx'
import MyTracker from './components/MyTracker/MyTracker.jsx'
import MyPlans from './components/MyPlans/MyPlans.jsx'
import Register from './components/Register/Register.jsx'
import Login from './components/Login/Login.jsx'
import MyTrainer from './components/MyTrainer/MyTrainer.jsx'
import Profile from './components/Profile/Profile.jsx'
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";
import store from './redux/store.js'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import TrainerChat from './components/TrainerChat/TrainerChat.jsx'


const router = createBrowserRouter([
  {
    
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "MyWorkout",
        element: (
          <ProtectedRoute allowedRoles={["User"]}>
            <MyWorkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "MyTracker",
        element: (
          <ProtectedRoute allowedRoles={["User"]}>
            <MyTracker />
          </ProtectedRoute>
        ),
      },
      {
        path: "MyPlans",
        element: (
          <ProtectedRoute allowedRoles={["User"]}>
            <MyPlans />
          </ProtectedRoute>
        ),
      },
      {
        path: "MyTrainer",
        element: (
          <ProtectedRoute allowedRoles={["User"]}>
            <MyTrainer />
          </ProtectedRoute>
        ),
      },
      {
        path: "trainer-chat",
        element: (
          <ProtectedRoute allowedRoles={["Trainer"]}>
            <TrainerChat/>
          </ProtectedRoute>
        ),
      },
      {
        path: "Profile",
        element: (
          <ProtectedRoute allowedRoles={["User", "Trainer"]}>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "Register", element: <Register /> },
      { path: "Login", element: <Login /> },
    ],
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> 
    <RouterProvider router={router}/>
    <Toaster position="top-right" reverseOrder={false} />
   </Provider>
  </StrictMode>,
)
