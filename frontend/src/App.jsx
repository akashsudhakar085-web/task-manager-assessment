import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in via localStorage
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName');
    if (email && name) {
      setUser({ email, name });
      setPage('dashboard');
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
    setUser(userData);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setUser(null);
    setPage('login');
  };

  const goToRegister = () => setPage('register');
  const goToLogin = () => setPage('login');

  return (
    <div className="app">
      {page === 'login' && (
        <Login onLogin={handleLogin} goToRegister={goToRegister} />
      )}
      {page === 'register' && (
        <Register goToLogin={goToLogin} />
      )}
      {page === 'dashboard' && (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
