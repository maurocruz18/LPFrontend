import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/common/Header/Header';
import Navbar from '../../components/common/Navbar/Navbar';
import Footer from '../../components/common/Footer/Footer';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <Header />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;