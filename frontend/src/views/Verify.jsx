import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cognitoService } from "../services/cognitoService";
import { Mail, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !code) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!/^\d{6}$/.test(code) && code !== "123456") {
      setError("El código debe tener exactamente 6 dígitos.");
      return;
    }

    setLoading(true);
    try {
      await cognitoService.confirmSignUp(email, code);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login?registered=true");
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al verificar el código");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-card" style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.logoTitle}>CloudShop</h1>
          <span className="badge-neon badge-cyan">Verificación de Correo</span>
          <p style={styles.subtitle}>Hemos enviado un código temporal a tu cuenta</p>
        </div>

        {success ? (
          <div style={styles.successContainer}>
            <CheckCircle size={56} style={styles.successIcon} />
            <h3 style={styles.successTitle}>¡Cuenta Verificada!</h3>
            <p style={styles.successText}>Redirigiéndote al inicio de sesión...</p>
          </div>
        ) : (
          <>
            {error && (
              <div style={styles.errorAlert}>
                <AlertTriangle size={20} style={{ minWidth: "20px" }} />
                <span>{error}</span>
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
                    placeholder="juan@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ paddingLeft: "42px" }}
                    disabled={loading || !!new URLSearchParams(location.search).get("email")}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <div style={styles.labelRow}>
                  <label style={styles.label}>Código de Verificación</label>
                  {cognitoService.isMock() && (
                    <span style={styles.hint}>Código de prueba: 123456</span>
                  )}
                </div>
                <input
                  type="text"
                  maxLength="6"
                  className="input-premium"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  style={styles.codeSelector}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn-neon" style={styles.submitBtn} disabled={loading}>
                {loading ? (
                  <span style={styles.loadingContainer}>
                    <Loader2 className="animate-spin" size={18} />
                    Verificando...
                  </span>
                ) : (
                  "Confirmar Código"
                )}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                ¿Ingresaste un correo erróneo?{" "}
                <span onClick={() => navigate("/signup")} style={styles.link}>
                  Volver al registro
                </span>
              </p>
            </div>
          </>
        )}
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
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  labelRow: {
    display: "flex",
    justifyContent: "between",
    alignItems: "center",
    width: "100%",
  },
  label: {
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    fontWeight: "500",
    textAlign: "left",
    flex: 1,
  },
  hint: {
    color: "#f59e0b",
    fontSize: "0.75rem",
    fontWeight: "500",
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
  codeSelector: {
    textAlign: "center",
    fontSize: "1.5rem",
    letterSpacing: "0.2em",
    fontWeight: "700",
    padding: "10px 0",
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
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0",
    textAlign: "center",
    gap: "16px",
  },
  successIcon: {
    color: "#10b981",
  },
  successTitle: {
    fontSize: "1.5rem",
    color: "var(--text-primary)",
  },
  successText: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
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
  }
};
