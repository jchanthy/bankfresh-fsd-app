import React, {useState, useEffect, useContext} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/header/header';
import SideNavbar from './components/sideNavbar/sideNavbar';
import Dashboard from './components/dashboard/dashboard';
import PrivacyPolicy from './components/privacyPolicy/privacyPolicy';
import PayBills from './components/payBills/payBills';
import Loans from './components/loans/loans';
import LoginPage from './components/login/login';
import SignupPage from './components/openAccount/openAccount';
import ContactUs from './components/contactUs/contactUs';
import TransactionStatement from './components/transactionStatement';
import TransferMoney from './components/transferMoney/transferMoney';
import Homepage from './components/homepage/homepage';
import UpdateUser from './components/updateProfile/updateProfile';
import LoanApplied from './components/loanApplied/loanApplied';
import CreditCard from './components/credit-card/creditcard';
import { UserContext } from './ctx/UserContextProvider'

const App = () => {
  const {isAuthenticated} = useContext(UserContext);
 
  
  return (
    <Router>
      <div className="App">
        <div className="headSection">
          <Header />
        </div>
        {isAuthenticated && <SideNavbar />}
        <div className={isAuthenticated ? 'container' : 'contain'}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />} />
            <Route path="/openAccount" element={<SignupPage />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
            <Route path="/transferMoney" element={isAuthenticated ? <TransferMoney /> : <Navigate to="/login" />} />
            <Route path="/payBills" element={isAuthenticated ? <PayBills /> : <Navigate to="/login" />} />
            <Route path="/loan" element={isAuthenticated ? <Loans /> : <Navigate to="/login" />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/update-profile" element={isAuthenticated ? <UpdateUser /> : <Navigate to="/login" />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/loan-applied" element={isAuthenticated ? <LoanApplied /> : <Navigate to="/login" />} />
            <Route path="/transactionStatement" element={isAuthenticated ? <TransactionStatement /> : <Navigate to="/login" />} />
            <Route path="/card-services" element={isAuthenticated ? <CreditCard /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
