import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './Components/UserPanel/SignIn';
import SignUp from './Components/UserPanel/SignUp';
import ForgotPassword from './Components/UserPanel/ForgotPassword';
import ResetPassword from './Components/UserPanel/ResetPassword';
import Main from './Components/UserPanel/UserHome';
import AboutUs from './Components/UserPanel/AboutUs';
import ContactUs from './Components/UserPanel/ContactUs';
import MyCart from './Components/UserPanel/MyCart';
import Customer from './Components/AdminPanel/ManageCustomer';
import PolicyTablePage from './Components/AdminPanel/PurchasedPolicies';
import ReviewClaims from './Components/AdminPanel/ReviewClaims';
import PolicyManagementModule from './Components/UserPanel/PolicyManagementModule';
import Agent from './Components/AdminPanel/ManageAgent';
import AssignPolicies from './Components/AdminPanel/AssignPolicies';
import { AuthProvider, useAuth } from './Components/AuthContext';
import ClaimSubmissionForm from './Components/UserPanel/ClaimSubmissionForm';
import ClaimStatus from './Components/UserPanel/ClaimStatus';
import AgentHome from './Components/AgentPanel/AgentHome';
import Profile from './Components/AgentPanel/AgentProfile';
import Policies from './Components/AgentPanel/AssignedPolicies';
import AdminHome from './Components/AdminPanel/AdminHome';
import UserHome from './Components/UserPanel/UserHome';
import Dashboard from './Components/AdminPanel/Dashboard';
import { App } from 'react-bootstrap-icons';
import AgentDashboard from './Components/AgentPanel/AgentDashboard';

function AppRoutes() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const isUser = user?.role === 'user';

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset" element={<ResetPassword />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/" element={<UserHome />} />
      {isAdmin && (
        <Route path="/admin" element={<AdminHome />}>
          <Route path="" element={<Dashboard/>} />
          <Route path="assignpolicy" element={<AssignPolicies />} />
          <Route path="policytable" element={<PolicyTablePage />} />
          <Route path="policy" element={<PolicyManagementModule isAdmin={true} />} />
          <Route path="agentform" element={<Agent />} />
          <Route path="review" element={<ReviewClaims />} />
          <Route path="customer" element={<Customer />} />
        </Route>
       )}
      {isAgent && (
        <Route path="/agent" element={<AgentHome />}>
          <Route index element={<AgentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="assignedpolicy" element={<Policies />} />
          <Route path="customermanage" element={<Customer />} />
          <Route path="agentdashboard" element={<AgentDashboard />} />
        </Route>
      )}
      {isUser && (
        <>
          <Route path="/" element={<Main />} />
          <Route path="/policyform" element={<PolicyManagementModule isAdmin={false} />} />
          <Route path="/reviewclaim" element={<ClaimSubmissionForm />} />
          <Route path="/claimstatus" element={<ClaimStatus />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/mycart" element={<MyCart />} />
        </>
       )}
      <Route path="*" element={<Navigate to={isAdmin ? "/admin" : isAgent ? "/agent" : "/"} replace />} />
    </Routes>
  );
}



export default AppRoutes;

