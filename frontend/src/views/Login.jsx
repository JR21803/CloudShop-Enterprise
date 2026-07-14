import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cognitoService } from "../services/cognitoService";
import { KeyRound, Mail, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener mensajes de redirección (ej: registro exitoso)
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("registered") === "true") {
      setInfoMessage("¡Registro completo! Por favor, inicia sesión.");
    }
    
    // Si ya está logueado, ir a Dashboard
    if (cognitoService.getCurrentSession()) {
      navigate("/");
    }
  }, [location, navigate]);

  const validateForm = () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await cognitoService.signIn(email, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      const errMsg = err.message || "Error al iniciar sesión";
      setError(errMsg);

      // Si el usuario no está verificado, redirigir a verificación
      if (errMsg.toLowerCase().includes("confirm") || errMsg.toLowerCase().includes("verified") || errMsg.toLowerCase().includes("verificado")) {
        setTimeout(() => {
          navigate(`/verify?email=${encodeURIComponent(email)}`);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logoTitle}>CloudShop</h1>
          <span className="badge-neon badge-cyan">Enterprise Edition</span>
          <p style={styles.subtitle}>Inicia sesión para acceder al panel de control</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <AlertTriangle size={20} style={{ minWidth: "20px" }} />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div style={styles.infoAlert}>
            <span>{infoMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                className="input-premium"
                placeholder="ejemplo@cloudshop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                className="input-premium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "42px", paddingRight: "42px" }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-neon" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loadingContainer}>
                <Loader2 className="animate-spin" size={18} />
                Ingresando...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿No tienes una cuenta?{" "}
            <span onClick={() => navigate("/signup")} style={styles.link}>
              Regístrate aquí
            </span>
          </p>
        </div>
      </div>
      
      {cognitoService.isMock() && (
        <div style={styles.badgeMock}>
          <span>Modo Desarrollador: Cognito MOCK activo</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "20px",
    position: "relative",
  },
  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "10px",
  },
  logoTitle: {
    fontSize: "2.5rem",
    color: "var(--text-primary)",
    fontWeight: "700",
    letterSpacing: "-0.03em",
    marginBottom: "4px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    marginTop: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    fontWeight: "500",
    textAlign: "left",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "var(--text-muted)",
    pointerEvents: "none",
  },
  eyeButton: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
  submitBtn: {
    marginTop: "10px",
    height: "48px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  errorAlert: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "rgba(244, 63, 94, 0.12)",
    border: "1px solid rgba(244, 63, 94, 0.3)",
    borderRadius: "10px",
    color: "#f43f5e",
    fontSize: "0.9rem",
    textAlign: "left",
  },
  infoAlert: {
    padding: "12px 16px",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.3)",
    borderRadius: "10px",
    color: "#10b981",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "20px",
  },
  footerText: {
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
  },
  link: {
    color: "var(--accent-cyan)",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
  },
  badgeMock: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "6px 14px",
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "20px",
    color: "#f59e0b",
    fontSize: "0.75rem",
    fontWeight: "600",
    letterSpacing: "0.05em",
  }
};
