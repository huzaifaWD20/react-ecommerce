import React, { useState, useEffect } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SingleProductPage, { productLoader } from './pages/SingleProductPage';
import AllProductsPage from './pages/AllProductsPage.jsx';
import NotFoundPage from './pages/NotFoundPage';
import { hotProducts, latestProducts, featuredProducts } from '../src/assets/utils/sampleData.js';
import { getCurrentUser } from '../src/assets/utils/authentication.js';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleUserLogin = (user) => {
    setUser(user);
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
          ? { ...item, quantity: item.quantity - 1 } : item
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
              hotProducts={hotProducts}
              latestProducts={latestProducts}
              featuredProducts={featuredProducts}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage onLogin={handleUserLogin} />} />
        <Route 
          path="/products/:productId" 
          element={
            <SingleProductPage 
              cartItems={cartItems}
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />} 
          loader={productLoader}
        />
        <Route 
          path='/products' 
          element=
          {
            <AllProductsPage 
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              cartItems={cartItems}
            />} 
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
