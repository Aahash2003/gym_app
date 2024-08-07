import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

import './App.css';
import ExerciseDetail from './pages/ExerciseDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import EmailVerify from './components/EmailVerify';
import WorkoutLog from './components/WorkoutPage/workout';
import WorkoutLogger from './components/WorkoutPage/workout';

import ViewCalories from './components/CalorieLog/ViewCalories';
import FoodSearch from './components/CalorieLog/FoodSearch';
import LogCalories from './components/CalorieLog/LogCalories';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Box className="app-container">
      <Navbar isAuthenticated={isAuthenticated} />
      <Box className="content-container">
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate replace to="/login" />} />
          <Route path="/exercise/:id" element={isAuthenticated ? <ExerciseDetail /> : <Navigate replace to="/login" />} />
          <Route path="/LogCalories" element={isAuthenticated ? <LogCalories /> : <Navigate replace to="/login" />} />
          <Route path="/ViewCalories" element={isAuthenticated ? <ViewCalories /> : <Navigate replace to="/login" />} />
          <Route path="/FoodSearch" element={isAuthenticated ? <FoodSearch /> : <Navigate replace to="/login" />} />
          <Route path="/workout" element={isAuthenticated ? <WorkoutLog /> : <Navigate replace to="/login" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={isAuthenticated ? <Navigate replace to="/home" /> : <Login />} />
          <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
          <Route path="/api/workout/user/:email/workouts" element={isAuthenticated ? <Navigate replace to="/home" /> : <WorkoutLogger />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};

export default App;
