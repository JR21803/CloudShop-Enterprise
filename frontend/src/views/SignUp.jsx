import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cognitoService } from "../services/cognitoService";
import { KeyRound, Mail, User, Shield, AlertTriangle, Check, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Cliente");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validaciones en tiempo real para contraseña
  const [checks, setChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    symbol: false
  });

  useEffect(() => {
    setChecks({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    const allPassed = Object.values(checks).every(Boolean);
    if (!allPassed) {
      setError("La contraseña no cumple con todos los requisitos de seguridad.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      await cognitoService.signUp(email, password, name, role);
      // Redirigir a verificar con el email
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logoTitle}>CloudShop</h1>
          <span className="badge-neon badge-purple">Crear Cuenta</span>
          <p style={styles.subtitle}>Regístrate en la plataforma empresarial</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <AlertTriangle size={20} style={{ minWidth: "20px" }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nombre Completo</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                className="input-premium"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Correo Electrónico</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                className="input-premium"
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Rol de Usuario</label>
            <div style={styles.inputWrapper}>
              <Shield size={18} style={styles.inputIcon} />
              <select
                className="input-premium"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ paddingLeft: "42px", appearance: "none" }}
                disabled={loading}
              >
                <option value="Cliente">Cliente</option>
                <option value="Administrador">Administrador</option>
                <option value="Gerente de Tienda">Gerente de Tienda</option>
              </select>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? "text" : "password"}
                className="input-premium"
                placeholder="Mínimo 8 caracteres"
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

            {/* Checklist de requisitos de contraseña */}
            <div style={styles.checklist}>
              <div style={styles.checkItem(checks.length)}>
                <Check size={12} />
                <span>Mínimo 8 caracteres</span>
              </div>
              <div style={styles.checkItem(checks.lowercase)}>
                <Check size={12} />
                <span>Una letra minúscula</span>
              </div>
              <div style={styles.checkItem(checks.uppercase)}>
                <Check size={12} />
                <span>Una letra mayúscula</span>
              </div>
              <div style={styles.checkItem(checks.number)}>
                <Check size={12} />
                <span>Un número</span>
              </div>
              <div style={styles.checkItem(checks.symbol)}>
                <Check size={12} />
                <span>Un carácter especial (@, $, !, %, etc.)</span>
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Contraseña</label>
            <div style={styles.inputWrapper}>
              <KeyRound size={18} style={styles.inputIcon} />
              <input
                type="password"
                className="input-premium"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: "42px" }}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-neon" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span style={styles.loadingContainer}>
                <Loader2 className="animate-spin" size={18} />
                Registrando...
              </span>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            ¿Ya tienes una cuenta?{" "}
            <span onClick={() => navigate("/login")} style={styles.link}>
              Inicia sesión aquí
            </span>
          </p>
        </div>
      </div>
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
  },
  card: {
    width: "100%",
    maxWidth: "500px",
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
    background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "4px",
  },
  subtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    marginTop: "4px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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
  checklist: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "10px 14px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    marginTop: "6px",
  },
  checkItem: (isValid) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.75rem",
    color: isValid ? "#10b981" : "var(--text-muted)",
    transition: "color 0.2s ease",
    textAlign: "left",
  }),
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
  }
};
