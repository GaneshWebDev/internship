import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute'; // Assuming it's in the same directory
import HomePage from './components/HomePage'; // Your HomePage component
import LoginPage from './components/LoginPage'; // Your LoginPage component
import SignupPage from './components/SignupPage'; // Your SignupPage component
import AddCarForm from './components/addCarPage';
import CarPage from './components/carPage';
import { useEffect } from 'react';
const App = () => {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected routes */}
      <Route path='/' element={<ProtectedRoute />}>
            <Route index element={<HomePage/>} />
            <Route element={<AddCarForm/>} path='/addCar'/>
            <Route element={<CarPage/>} path='/car/:id'/>
      </Route>
      
      {/* Add other protected routes similarly */}
    </Routes>
  );
};

export default App;
