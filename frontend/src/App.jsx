import React, { useState, useEffect, useCallback } from 'react';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout.jsx';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SingleProductPage from './pages/SingleProductPage';
import AllProductsPage from './pages/AllProductsPage.jsx';
import ViewCartPage from './pages/ViewCartPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import OrdersPage from './pages/OrdersPage';
import NotFoundPage from './pages/NotFoundPage';
import { getCurrentUser, logoutUser, saveCartToDatabase, getCartFromDatabase } from '../src/assets/utils/authentication.js';

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = window.localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const syncCart = async (currentUser) => {
    if (currentUser) {
      try {
        const dbCart = await getCartFromDatabase();
        setCartItems(dbCart);
        window.localStorage.setItem('cart', JSON.stringify(dbCart));
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    } else {
      const localCart = JSON.parse(window.localStorage.getItem('cart') || '[]');
      setCartItems(localCart);
    }
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        await syncCart(currentUser);
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setUserLoading(false);
      }
    };
  
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:5175/api/products'),
          fetch('http://localhost:5175/api/categories')
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    window.localStorage.setItem('cart', JSON.stringify(cartItems));
  
    if (user) {
      const debouncedSave = debounce(() => {
        saveCartToDatabase(cartItems);
      }, 2000);
  
      debouncedSave();
  
      return () => clearTimeout(debouncedSave);
    }
  }, [cartItems, user, debounce]);

  const handleUserLogin = async (user) => {
    setUser(user);
    await syncCart(user);
  };

  const handleLogout = async () => {
    try {
      await saveCartToDatabase(cartItems);
      await logoutUser();
      setUser(null);
      setCartItems([]);
      window.localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.productID === product.productID);
      if (existingItem) {
        return prevItems.map((item) =>
          item.productID === product.productID ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (productID) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productID !== productID)
    );
  };
  
  const increaseQuantity = (product) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productID === product.productID ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  
  const decreaseQuantity = (product) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productID === product.productID && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter((item) => item.quantity > 0)
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
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            user={user}
            setUser={setUser}
            handleLogout={handleLogout}
            userLoading={userLoading}
          />
        }
      >
        <Route
          index
          element={
            <HomePage
              products={products}
              categories={categories}
              loading={loading}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />
        <Route path="/signup" element={<SignUpPage handleUserLogin={handleUserLogin} />} />
        <Route path="/login" element={<LoginPage handleUserLogin={handleUserLogin} />} />
        <Route 
          path='/products' 
          element={
            <AllProductsPage 
              products={products}
              categories={categories}
              loading={loading}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              cartItems={cartItems}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          } 
        />
        <Route 
          path="/products/:productId" 
          element={
            <SingleProductPage 
              cartItems={cartItems}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
            />
          }
        />
        <Route 
          path='/cart' 
          element={
            <ViewCartPage
              cartItems={cartItems}
              categories={categories}
              removeFromCart={removeFromCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              setCartItems={setCartItems}
            />
          }
        />
        <Route 
          path='/profile' 
          element={
            <ProfilePage
              user={user}
              setUser={setUser}
            />
          }
        />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/about' element={<AboutUsPage />} />
        <Route 
          path='/orders' 
          element={
            <OrdersPage
              user={user}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;