import React from 'react'
import Header from './components/header/Header'
import Footer from './components/Footer/Footer'
import { Outlet } from 'react-router-dom'
import Register from './components/Register/Register'

import { useLocation } from 'react-router-dom';

export default function Layout() {
    const location = useLocation();
    const isRegisterPage = location.pathname === '/register';
    const isLoginPage = location.pathname === '/login';
  return (
   <>
    {!isLoginPage && !isRegisterPage &&  <Header />}
      <Outlet />
      
   </>
  )
}
