// export const SignUpUser = (userData) => {
//   const users = JSON.parse(localStorage.getItem('users')) || [];
//   const userExists = users.find(user => user.email === userData.email);
  
//   if (userExists) {
//     throw new Error('User already exists.');
//   }
  
//   users.push(userData);
//   localStorage.setItem('users', JSON.stringify(users));
// };

//   export const LoginUser = (email, password) => {
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     const user = users.find(user => user.email === email && user.password === password);
    
//     if (!user) {
//       throw new Error('Invalid credentials.');
//     }
//     localStorage.setItem('currentUser', JSON.stringify(user));
//     return user;
//   };

// export const LogoutUser = () => {
//   localStorage.removeItem('currentUser');
// };

// export const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem('currentUser'));
// };
