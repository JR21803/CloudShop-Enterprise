import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cognitoService } from "../services/cognitoService";
import { apiService } from "../services/apiService";
import {
  TrendingUp,
  AlertOctagon,
  Users,
  ShoppingBag,
  Store,
  LogOut,
  RefreshCw,
  Database,
  ArrowUpRight,
  ShieldCheck,
  User
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  
  // Estados de datos de la API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMock, setIsMock] = useState(apiService.isMockMode());
  
  // Métricas del Dashboard
  const [totalSales, setTotalSales] = useState({ totalOrders: 0, totalSales: 0 });
  const [orderByStatus, setOrderByStatus] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [salesByStore, setSalesByStore] = useState([]);

  // Cargar sesión del usuario
  useEffect(() => {
    const currentSession = cognitoService.getCurrentSession();
    if (!currentSession) {
      navigate("/login");
    } else {
      setSession(currentSession);
    }
  }, [navigate]);

  // Cargar datos del dashboard
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [salesData, statusData, stockData, productsData, customersData, storeData] = await Promise.all([
        apiService.getTotalSales(),
        apiService.getOrderByStatus(),
        apiService.getOutOfStock(),
        apiService.getTopProducts(),
        apiService.getTopCustomers(),
        apiService.getSalesByStore()
      ]);

      setTotalSales(salesData);
      setOrderByStatus(statusData);
      setOutOfStock(stockData);
      setTopProducts(productsData);
      setTopCustomers(customersData);
      setSalesByStore(storeData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al conectar con la API de AWS. El backend podría no estar totalmente desplegado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session, isMock]);

  const handleLogout = () => {
    cognitoService.signOut();
    navigate("/login");
  };

  const handleToggleMock = () => {
    const newVal = apiService.toggleMockMode();
    setIsMock(newVal);
  };

  if (!session) return null;

  // Helpers de color de roles
  const getRoleBadgeClass = (role) => {
    if (role === "Administrador") return "badge-rose";
    if (role === "Gerente de Tienda") return "badge-purple";
    return "badge-cyan";
  };

  return (
    <div className="app-container">
      {/* Luces decorativas flotantes */}
      <div className="glow-container">
        <div className="glow-sphere glow-sphere-1"></div>
        <div className="glow-sphere glow-sphere-2"></div>
        <div className="glow-sphere glow-sphere-3"></div>
      </div>

      {/* Sidebar de navegación */}
      <aside className="sidebar">
        <div style={styles.sidebarTop}>
          <div style={styles.logoContainer}>
            <ShoppingBag size={28} style={{ color: "var(--accent-cyan)" }} />
            <h2 className="logo-text" style={styles.logoText}>CloudShop</h2>
          </div>

          <nav style={styles.navMenu}>
            <div style={{ ...styles.navItem, ...styles.navItemActive }}>
              <TrendingUp size={20} />
              <span className="nav-label">Dashboard</span>
            </div>
            <div style={styles.navItemDisabled}>
              <ShoppingBag size={20} />
              <span className="nav-label">Productos</span>
            </div>
            <div style={styles.navItemDisabled}>
              <Store size={20} />
              <span className="nav-label">Tiendas</span>
            </div>
            <div style={styles.navItemDisabled}>
              <Users size={20} />
              <span className="nav-label">Usuarios</span>
            </div>
          </nav>
        </div>

        {/* Perfil y Cerrar Sesión */}
        <div style={styles.sidebarBottom}>
          <div style={styles.userInfoCard}>
            <div style={styles.avatar}>
              <User size={18} />
            </div>
            <div className="user-info-text" style={styles.userInfoText}>
              <div style={styles.userName}>{session.user.name}</div>
              <div style={styles.userEmail}>{session.user.email}</div>
              <span className={`badge-neon ${getRoleBadgeClass(session.user.role)}`} style={{ marginTop: "4px" }}>
                {session.user.role}
              </span>
            </div>
          </div>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={18} />
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Cabecera del Dashboard */}
        <header style={styles.headerBar}>
          <div>
            <h1>Dashboard</h1>
            <p style={styles.headerSubtitle}>Supervisión de operaciones de CloudShop Enterprise</p>
          </div>

          <div style={styles.headerActions}>
            {/* Indicador y switch de Mock/Real API */}
            <div className="glass-card" style={styles.dbToggleCard}>
              <div style={styles.dbToggleLabel}>
                <Database size={16} style={{ color: isMock ? "#f59e0b" : "#10b981" }} />
                <span>Datos: <strong>{isMock ? "Simulados (Mock)" : "AWS API Real"}</strong></span>
              </div>
              <button onClick={handleToggleMock} className="btn-secondary" style={styles.toggleBtn}>
                <RefreshCw size={14} />
                <span>Cambiar</span>
              </button>
            </div>

            <button onClick={fetchDashboardData} className="btn-secondary" style={styles.reloadBtn} disabled={loading}>
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
            </button>
          </div>
        </header>

        {error && (
          <div className="glass-card" style={styles.errorBanner}>
            <AlertOctagon size={24} style={{ color: "#f43f5e" }} />
            <div style={styles.errorTextContainer}>
              <h3>Error de Conexión AWS API</h3>
              <p>{error}</p>
            </div>
            <button onClick={handleToggleMock} className="btn-neon" style={styles.errorBtn}>
              Usar Datos Simulados
            </button>
          </div>
        )}

        {loading ? (
          <div style={styles.loaderContainer}>
            <LoaderComponent />
          </div>
        ) : (
          <>
            {/* Fila de KPI Cards */}
            <section style={styles.kpiGrid}>
              {/* Tarjeta de Ventas Totales */}
              <div className="glass-card" style={styles.kpiCard}>
                <div style={styles.kpiHeader}>
                  <div>
                    <div style={styles.kpiLabel}>Ventas Totales</div>
                    <div style={styles.kpiValue}>${totalSales.totalSales.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div style={{ ...styles.kpiIconWrapper, backgroundColor: "var(--accent-cyan-glow)", color: "var(--accent-cyan)" }}>
                    <TrendingUp size={24} />
                  </div>
                </div>
                <div style={styles.kpiFooter}>
                  <ArrowUpRight size={16} style={{ color: "#10b981" }} />
                  <span style={{ color: "#10b981", fontWeight: "600" }}>+12.4%</span>
                  <span style={styles.kpiFooterText}>este mes</span>
                </div>
              </div>

              {/* Tarjeta de Pedidos */}
              <div className="glass-card" style={styles.kpiCard}>
                <div style={styles.kpiHeader}>
                  <div>
                    <div style={styles.kpiLabel}>Total de Pedidos</div>
                    <div style={styles.kpiValue}>{totalSales.totalOrders.toLocaleString()}</div>
                  </div>
                  <div style={{ ...styles.kpiIconWrapper, backgroundColor: "var(--accent-purple-glow)", color: "var(--accent-purple)" }}>
                    <ShoppingBag size={24} />
                  </div>
                </div>
                <div style={styles.kpiFooter}>
                  <ArrowUpRight size={16} style={{ color: "#10b981" }} />
                  <span style={{ color: "#10b981", fontWeight: "600" }}>+8.2%</span>
                  <span style={styles.kpiFooterText}>vs periodo anterior</span>
                </div>
              </div>

              {/* Tarjeta de Stock Crítico */}
              <div className="glass-card" style={styles.kpiCard}>
                <div style={styles.kpiHeader}>
                  <div>
                    <div style={styles.kpiLabel}>Productos Agotados</div>
                    <div style={{ ...styles.kpiValue, color: outOfStock.length > 0 ? "var(--accent-rose)" : "var(--text-primary)" }}>
                      {outOfStock.length}
                    </div>
                  </div>
                  <div style={{ ...styles.kpiIconWrapper, backgroundColor: "var(--accent-rose-glow)", color: "var(--accent-rose)" }}>
                    <AlertOctagon size={24} />
                  </div>
                </div>
                <div style={styles.kpiFooter}>
                  <span style={styles.kpiFooterText}>Requiere reabastecimiento urgente</span>
                </div>
              </div>
            </section>

            {/* Fila de Gráficos SVG */}
            <section className="chart-grid">
              {/* Gráfico de Ventas por Tienda */}
              <div className="glass-card chart-card">
                <div className="chart-title">
                  <span>Rendimiento por Sucursal</span>
                  <span className="badge-neon badge-cyan">Ventas</span>
                </div>
                <div className="svg-container">
                  <BarChartSales data={salesByStore} />
                </div>
              </div>

              {/* Gráfico de Pedidos por Estado */}
              <div className="glass-card chart-card">
                <div className="chart-title">
                  <span>Estado de Pedidos</span>
                  <span className="badge-neon badge-purple">Distribución</span>
                </div>
                <div className="svg-container" style={{ display: "flex", alignItems: "center" }}>
                  <StatusChart data={orderByStatus} />
                </div>
              </div>
            </section>

            {/* Listas y Tablas Detalladas */}
            <section style={styles.detailsGrid}>
              {/* Tabla de Productos sin Stock */}
              <div className="glass-card" style={styles.detailsCard}>
                <div style={styles.cardHeader}>
                  <h3>Alertas de Stock Crítico</h3>
                  <span className="badge-neon badge-rose">Agotado</span>
                </div>
                <div className="table-container">
                  {outOfStock.length === 0 ? (
                    <div style={styles.emptyTable}>No hay productos sin stock. ¡Inventario al día!</div>
                  ) : (
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>SKU</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {outOfStock.map((prod) => (
                          <tr key={prod.productId}>
                            <td style={{ fontWeight: "500" }}>{prod.name}</td>
                            <td>{prod.category}</td>
                            <td><code>{prod.sku}</code></td>
                            <td>
                              <span className="badge-neon badge-rose">Sin Stock</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Tabla de Clientes VIP */}
              <div className="glass-card" style={styles.detailsCard}>
                <div style={styles.cardHeader}>
                  <h3>Clientes más Valiosos</h3>
                  <span className="badge-neon badge-green">Top Spenders</span>
                </div>
                <div className="table-container">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Compras</th>
                        <th>Total Gastado</th>
                        <th>Nivel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map((cust) => (
                        <tr key={cust.customerId}>
                          <td>
                            <div style={styles.custName}>{cust.name}</div>
                            <div style={styles.custEmail}>{cust.email}</div>
                          </td>
                          <td>{cust.ordersCount} pedidos</td>
                          <td style={{ fontWeight: "600", color: "#10b981" }}>
                            ${cust.totalSpent.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                          </td>
                          <td>
                            <span
                              className={`badge-neon ${
                                cust.tier === "VIP" ? "badge-rose" : cust.tier === "Oro" ? "badge-amber" : "badge-cyan"
                              }`}
                            >
                              {cust.tier}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// Componente para Dibujar Gráfico de Barras con SVG Puro
function BarChartSales({ data }) {
  if (!data || data.length === 0) return null;
  const maxSales = Math.max(...data.map((d) => d.sales));
  
  // Configuración de dimensiones
  const width = 500;
  const height = 240;
  const paddingLeft = 140;
  const paddingRight = 30;
  const paddingTop = 10;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const barHeight = 24;
  const gap = 14;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
      {/* Grilla Vertical */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
        const x = paddingLeft + ratio * chartWidth;
        const valueLabel = Math.round(ratio * maxSales);
        return (
          <g key={idx}>
            <line
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={height - paddingBottom}
              stroke="var(--border-color)"
              strokeDasharray="4 4"
            />
            <text
              x={x}
              y={height - 10}
              fill="var(--text-muted)"
              fontSize="10"
              textAnchor="middle"
            >
              ${(valueLabel / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}

      {/* Dibujar Barras Horizontales */}
      {data.map((item, idx) => {
        const y = paddingTop + idx * (barHeight + gap);
        const barWidth = (item.sales / maxSales) * chartWidth;
        
        return (
          <g key={item.storeId} className="bar-group">
            {/* Nombre de la Tienda */}
            <text
              x={paddingLeft - 15}
              y={y + barHeight / 2 + 4}
              fill="var(--text-secondary)"
              fontSize="11"
              fontWeight="500"
              textAnchor="end"
            >
              {item.name.length > 20 ? `${item.name.substring(0, 18)}...` : item.name}
            </text>

            {/* Barra de Fondo */}
            <rect
              x={paddingLeft}
              y={y}
              width={chartWidth}
              height={barHeight}
              rx="4"
              fill="rgba(255, 255, 255, 0.02)"
            />

            {/* Barra de Valor Animada */}
            <rect
              x={paddingLeft}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="4"
              fill="url(#barGradient)"
              className="bar-rect"
            />

            {/* Valor numérico flotante */}
            <text
              x={paddingLeft + barWidth + 8}
              y={y + barHeight / 2 + 4}
              fill="var(--text-primary)"
              fontSize="10"
              fontWeight="600"
            >
              ${Math.round(item.sales).toLocaleString()}
            </text>
          </g>
        );
      })}

      {/* Definición de Degradado Neon */}
      <defs>
        <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent-cyan)" />
          <stop offset="100%" stopColor="var(--accent-purple)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Componente para Pedidos por Estado en SVG Puro
function StatusChart({ data }) {
  if (!data || data.length === 0) return null;
  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  
  // Renderizar barras de progreso apiladas o anillos concéntricos
  // Múltiples anillos concéntricos de progreso se ven increíblemente futuristas
  return (
    <div style={styles.statusChartContainer}>
      <div style={styles.donutContainer}>
        <svg viewBox="0 0 120 120" style={{ width: "130px", height: "130px" }}>
          {/* Anillos concéntricos */}
          {data.map((item, idx) => {
            const radius = 45 - idx * 9;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset = circumference - (item.count / total) * circumference;
            
            return (
              <g key={item.status}>
                {/* Fondo del anillo */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.03)"
                  strokeWidth="6"
                />
                {/* Anillo de valor animado */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="transparent"
                  stroke={item.color || "#06b6d4"}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  className="ring-segment"
                  style={{ "--ring-offset": strokeDashoffset }}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>
        <div style={styles.donutCenter}>
          <span style={styles.donutCenterNum}>{total.toLocaleString()}</span>
          <span style={styles.donutCenterLabel}>Pedidos</span>
        </div>
      </div>

      <div style={styles.legendContainer}>
        {data.map((item) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <div key={item.status} style={styles.legendItem}>
              <div style={styles.legendDotContainer}>
                <div style={{ ...styles.legendDot, backgroundColor: item.color }} />
                <span style={styles.legendLabel}>{item.status}</span>
              </div>
              <div style={styles.legendValues}>
                <span style={styles.legendCount}>{item.count}</span>
                <span style={styles.legendPerc}>{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoaderComponent() {
  return (
    <div style={styles.loader}>
      <Loader2 className="animate-spin" size={40} style={{ color: "var(--accent-cyan)" }} />
      <span style={{ color: "var(--text-secondary)", fontWeight: "500" }}>Cargando métricas de AWS...</span>
    </div>
  );
}

const styles = {
  sidebarTop: {
    display: "flex",
    flexDirection: "column",
    gap: "35px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoText: {
    fontSize: "1.4rem",
    background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
  },
  navItemActive: {
    background: "rgba(6, 182, 212, 0.1)",
    border: "1px solid rgba(6, 182, 212, 0.25)",
    color: "var(--accent-cyan)",
  },
  navItemDisabled: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 16px",
    borderRadius: "10px",
    color: "var(--text-muted)",
    fontSize: "0.95rem",
    opacity: 0.5,
    cursor: "not-allowed",
  },
  sidebarBottom: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  userInfoCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    backgroundColor: "rgba(6, 182, 212, 0.12)",
    color: "var(--accent-cyan)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(6, 182, 212, 0.2)",
  },
  userInfoText: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    overflow: "hidden",
  },
  userName: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  userEmail: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 16px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    width: "100%",
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "24px",
    marginBottom: "32px",
    textAlign: "left",
  },
  headerSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "0.95rem",
    marginTop: "4px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dbToggleCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "6px 14px",
  },
  dbToggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
  },
  toggleBtn: {
    padding: "6px 12px",
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  reloadBtn: {
    padding: "10px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    border: "1px solid rgba(244, 63, 94, 0.25)",
    backgroundColor: "rgba(244, 63, 94, 0.08)",
    marginBottom: "24px",
    flexWrap: "wrap",
    textAlign: "left",
  },
  errorTextContainer: {
    flex: 1,
  },
  errorBtn: {
    padding: "8px 16px",
    fontSize: "0.85rem",
  },
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "350px",
  },
  loader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  kpiCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "130px",
    textAlign: "left",
  },
  kpiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  kpiLabel: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  kpiValue: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginTop: "6px",
    fontFamily: "var(--font-heading)",
  },
  kpiIconWrapper: {
    width: "44px",
    height: "44px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  },
  kpiFooter: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    marginTop: "16px",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "12px",
  },
  kpiFooterText: {
    color: "var(--text-muted)",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    marginTop: "24px",
  },
  detailsCard: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  emptyTable: {
    color: "var(--text-muted)",
    padding: "30px",
    textAlign: "center",
    fontSize: "0.95rem",
  },
  custName: {
    fontWeight: "500",
    color: "var(--text-primary)",
  },
  custEmail: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
  },
  // Sub-estilos de Gráfico de Pedidos
  statusChartContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    gap: "20px",
    flexWrap: "wrap",
  },
  donutContainer: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenter: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenterNum: {
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "var(--text-primary)",
    fontFamily: "var(--font-heading)",
  },
  donutCenterLabel: {
    fontSize: "0.7rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  legendContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
    minWidth: "180px",
  },
  legendItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
    paddingBottom: "6px",
  },
  legendDotContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  legendDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  legendLabel: {
    color: "var(--text-secondary)",
  },
  legendValues: {
    display: "flex",
    gap: "8px",
  },
  legendCount: {
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  legendPerc: {
    color: "var(--text-muted)",
    width: "45px",
    textAlign: "right",
  }
};
