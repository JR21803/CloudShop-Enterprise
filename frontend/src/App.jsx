import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./views/Login";
import SignUp from "./views/SignUp";
import Verify from "./views/Verify";
import Dashboard from "./views/Dashboard";
import Storefront from "./views/Storefront";
import { cognitoService } from "./services/cognitoService";

// Wrapper para Rutas Protegidas según Rol
function ProtectedRoute({ children, allowedRoles }) {
  const session = cognitoService.getCurrentSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const userRole = session.user.role; // "Cliente", "Administrador", "Operador"
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === "Cliente") {
      return <Navigate to="/storefront" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
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
            <ProtectedRoute allowedRoles={["Administrador", "Operador"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/storefront"
          element={
            <ProtectedRoute allowedRoles={["Cliente"]}>
              <Storefront />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
