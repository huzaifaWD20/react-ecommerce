import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ cartItems, removeFromCart, addToCart, decreaseQuantity, user, setUser}) => {
  return (
    <>
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        addToCart={addToCart}
        decreaseQuantity={decreaseQuantity}
        user={user}
        setUser={setUser}
      />
        <Outlet />
        <ToastContainer/>
    </>
  );
}

export default MainLayout