import React from 'react';
import './App.css';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/Home/Home';

function App() {
  return (
    <div className="App">
      <Navbar />
      <AppRoutes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/game/:id" element={<GameDetailsPage />}/>
      </AppRoutes>
      
      <HomePage />
    </div>
  );
}

export default App;