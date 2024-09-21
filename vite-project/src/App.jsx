import React, { useState, useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage'; 
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SingleProductPage from './pages/SingleProductPage';
import AllProductsPage from './pages/AllProductsPage';
import NotFoundPage from './pages/NotFoundPage';
import Cart from './pages/Cart';
import CreateOrder from './pages/CreateOrder';
import UserOrders from './pages/UserOrders';
import OrderDetails from './pages/OrderDetails';
import Navbar from './components/Navbar';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const storedCart = JSON.parse(sessionStorage.getItem('cartItems'));

    if (storedUser) {
      setUser(storedUser);
    }
    if (storedCart) {
      setCartItems(storedCart);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleUserLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const increaseQuantity = (product) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (product) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <MainLayout
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            addToCart={addToCart}
            decreaseQuantity={decreaseQuantity}
            user={user}
            setUser={setUser}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              cartItems={cartItems}
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleUserLogin} />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/profile/:userId/edit" element={<ProfilePage />} />
        <Route
          path="/products/:productId"
          element={
            <SingleProductPage
              cartItems={cartItems}
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />
        <Route
          path="/products"
          element={
            <AllProductsPage
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              cartItems={cartItems}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route path="/create-order/:productId" element={<CreateOrder />} />
        <Route path="/orders/user-orders" element={<UserOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
    <RouterProvider router={router}>
      <Navbar
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        addToCart={addToCart}
        decreaseQuantity={decreaseQuantity}
        setUser={setUser}
        user={user} // Pass the user prop here
      />
    </RouterProvider>
  );
};

export default App;
