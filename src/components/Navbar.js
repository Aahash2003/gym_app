import React from 'react';
import { Link } from 'react-router-dom';
import { Stack } from '@mui/material';

import Logo from '../Assets/Logo/Logo3.png';

const Navbar = ({ isAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isVerified");
    localStorage.removeItem("isAdmin");
    window.location.reload();
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-around"
      sx={{ gap: { sm: '122px', xs: '40px' }, mt: { sm: '32px', xs: '20px' }, justifyContent: 'none' }}
      px="20px"
    >
      <Link to="/">
        <img src={Logo} alt="logo" style={{ width: '48px', height: '48px', margin: '10px' }} />
      </Link>
      <Stack alignItems="center" direction="row" gap="40px" fontSize="24px">
        <Link to="/" style={{ textDecoration: 'none', color: '#3A1212', borderBottom: '3px solid #3A1212' }}>Home</Link>
        <a href="#exercises" style={{ textDecoration: 'none', color: '#3A1212' }}>Exercises</a>
        <Link to="/ViewCalories" style={{ textDecoration: 'none', color: '#3A1212', margin: '0px' }}>Caloric Counter</Link>
        <Link to="/workout" style={{ textDecoration: 'none', color: '#3A1212', margin: '0px' }}>Workout Log</Link>
        {isAuthenticated ? (
          <button 
            style={{
              border: 'none', 
              outline: 'none', 
              padding: '12px', 
              backgroundColor: 'white', 
              borderRadius: '20px', 
              width: '120px',
              fontWeight: 'bold',
              fontSize: '14px', 
              cursor: 'pointer', 
              marginRight: '20px'
            }} 
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login"
            style={{
              textDecoration: 'none', 
              color: '#3A1212', 
              border: 'none', 
              outline: 'none', 
              padding: '12px', 
              backgroundColor: 'white', 
              borderRadius: '20px', 
              width: '120px',
              fontWeight: 'bold',
              fontSize: '14px', 
              cursor: 'pointer', 
              marginRight: '20px',
              textAlign: 'center'
            }}
          >
            Login
          </Link>
        )}
      </Stack>
    </Stack>
  );
};

export default Navbar;
