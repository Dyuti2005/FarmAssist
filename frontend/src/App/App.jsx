import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from '../pages/Welcome/Welcome';
import Auth from '../pages/Auth/Auth';
import Dashboard from '../pages/Dashboard/Dashboard';
import Onboarding from '../pages/Onboarding/Onboarding';
import DigitalTwin from '../pages/DigitalTwin/DigitalTwin';
import Marketplace from '../pages/Marketplace/Marketplace';
import Buy from '../pages/Buy/Buy';
import Sell from '../pages/Sell/Sell';
import CropPassport from '../pages/CropPassport/CropPassport';
import FarmerProfile from '../pages/FarmerProfile/FarmerProfile';
import Settings from '../pages/Settings/Settings';
import Assistant from '../pages/Assistant/Assistant';
import MainLayout from '../layouts/MainLayout';
import RoleSelection from '../pages/RoleSelection/RoleSelection';
import BuyerDashboard from '../pages/BuyerDashboard/BuyerDashboard';
import BuyerProfile from '../pages/BuyerProfile/BuyerProfile';
import ProtectedRoute from '../components/common/ProtectedRoute';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/welcome" replace />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/role-selection" element={<RoleSelection />} />
                <Route path="/login" element={<Auth defaultView="login" />} />
                <Route path="/register" element={<Auth defaultView="register" />} />
                <Route path="/onboarding" element={<Onboarding />} />

                <Route path="/buyer-dashboard" element={<ProtectedRoute role="buyer"><BuyerDashboard /></ProtectedRoute>} />
                <Route path="/buyer-profile" element={<ProtectedRoute role="buyer"><BuyerProfile /></ProtectedRoute>} />
                <Route path="/digital-twin" element={<ProtectedRoute role="farmer"><DigitalTwin /></ProtectedRoute>} />

                <Route element={<ProtectedRoute role="farmer"><MainLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/buy" element={<Buy />} />
                    <Route path="/sell" element={<Sell />} />
                    <Route path="/crop-passport" element={<CropPassport />} />
                    <Route path="/profile" element={<FarmerProfile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/assistant" element={<Assistant />} />
                </Route>
            </Routes>
        </Router>
    );
}
