import axios from 'axios';

const API_URL = 'http://localhost:5175/api';

// Step 1: Send OTP
export const sendOtp = async (formData) => {
  const { name, email, password, phoneNumber } = formData;
  try {
    const response = await axios.post(`${API_URL}/auth/send-otp`, { name, email, password, phoneNumber }, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error sending OTP');
  }
};

// Step 2: Verify OTP
export const verifyOtp = async (otpData) => {
  const { otp } = otpData;
  try {
    const response = await axios.post(`${API_URL}/auth/verify-otp`, { otp }, { withCredentials: true });
    return response;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error verifying OTP');
  }
};

// Step 3: Complete Signup after OTP verification
export const signUpUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, {}, { withCredentials: true });
    return response.data.user;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error signing up');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password }, { withCredentials: true });
    return response.data.user;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error logging in');
  }
};

export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const saveCartToDatabase = async (cart) => {
  try {
    const transformedCart = cart.map(item => ({
      productID: item.productID,
      quantity: item.quantity
    }));
    await axios.post(`${API_URL}/cart/save-database`, { cart: transformedCart }, { withCredentials: true });
  } catch (error) {
    console.error('Error saving cart to database:', error);
  }
};

export const getCartFromDatabase = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart/get-database`, { withCredentials: true });
    const cartItems = response.data;
    window.localStorage.setItem('cart', JSON.stringify(cartItems));
    return cartItems;
  } catch (error) {
    console.error('Error getting cart from database:', error);
    return [];
  }
};

export const updateUserProfile = async (userId, updatedData) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${userId}`, updatedData, { withCredentials: true });
    return response.data.user;
  } catch (error) {
    throw new Error(error.response.data.message || 'Error updating user profile');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/current`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/check-auth`, { withCredentials: true });
    return response.data.isAuthenticated;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return false;
  }
};
