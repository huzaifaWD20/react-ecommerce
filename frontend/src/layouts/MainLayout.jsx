import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MainLayout = ({ cartItems, removeFromCart, addToCart, increaseQuantity, decreaseQuantity, user, setUser, handleLogout, userLoading}) => {
  return (
    <>
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        addToCart={addToCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        user={user}
        setUser={setUser}
        handleLogout={handleLogout}
      />
        <Outlet />
        <ToastContainer/>
    </>
  );
}

export default MainLayout