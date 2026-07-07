import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import Verify from "./views/Verify";
import Dashboard from "./views/Dashboard";
import { cognitoService } from "./services/cognitoService";

// Wrapper para Rutas Protegidas
function ProtectedRoute({ children }) {
  const session = cognitoService.getCurrentSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />

        {/* Rutas Privadas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
