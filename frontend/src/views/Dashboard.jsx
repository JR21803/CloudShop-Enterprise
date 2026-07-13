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
  User,
  Plus,
  Trash2,
  ClipboardList,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlusCircle
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const session = cognitoService.getCurrentSession();
  
  // Tab/Navigation state
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, products, stores, users, orders
  
  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMock, setIsMock] = useState(apiService.isMockMode());

  // Dashboard Stats States
  const [totalSales, setTotalSales] = useState({ totalOrders: 0, totalSales: 0 });
  const [orderByStatus, setOrderByStatus] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [salesByStore, setSalesByStore] = useState([]);

  // Data management states for CRUD tabs
  const [productsList, setProductsList] = useState([]);
  const [storesList, setStoresList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);

  // CRUD Forms States
  const [productForm, setProductForm] = useState({ code: "", name: "", description: "", category: "", price: "", stock: "", shop: "" });
  const [editingProductId, setEditingProductId] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);

  const [storeForm, setStoreForm] = useState({ name: "", address: "", phone: "" });
  const [editingStoreId, setEditingStoreId] = useState(null);
  const [showStoreForm, setShowStoreForm] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    // Operador cannot access Dashboard/Users/Stores
    if (session.user.role === "Cliente") {
      navigate("/storefront");
      return;
    }
    loadAllData();
  }, [activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "dashboard") {
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
      } else if (activeTab === "products") {
        const [pData, sData] = await Promise.all([
          apiService.getProducts(),
          apiService.getStores()
        ]);
        setProductsList(pData);
        setStoresList(sData);
      } else if (activeTab === "stores") {
        const sData = await apiService.getStores();
        setStoresList(sData);
      } else if (activeTab === "users") {
        const uData = await apiService.getUsers();
        setUsersList(uData);
      } else if (activeTab === "orders") {
        const oData = await apiService.getOrders();
        setOrdersList(oData);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar información de AWS API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    cognitoService.signOut();
    navigate("/login");
  };

  const handleToggleMock = () => {
    const newVal = apiService.toggleMockMode();
    setIsMock(newVal);
    loadAllData();
  };

  // ==========================================
  // PRODUCTS CRUD HANDLERS
  // ==========================================
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.code || !productForm.name || !productForm.category || !productForm.price || !productForm.shop) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      if (editingProductId) {
        await apiService.updateProduct(editingProductId, productForm);
        alert("Producto actualizado.");
      } else {
        await apiService.createProduct(productForm);
        alert("Producto creado con éxito.");
      }
      setProductForm({ code: "", name: "", description: "", category: "", price: "", stock: "", shop: "" });
      setEditingProductId(null);
      setShowProductForm(false);
      loadAllData();
    } catch (err) {
      alert("Error al guardar producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (prod) => {
    setProductForm({
      code: prod.code || "",
      name: prod.name,
      description: prod.description || "",
      category: prod.category,
      price: prod.price,
      stock: prod.stock,
      shop: prod.shop || ""
    });
    setEditingProductId(prod.productId);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Seguro que deseas desactivar este producto?")) return;
    try {
      setLoading(true);
      await apiService.deleteProduct(id);
      loadAllData();
      alert("Producto desactivado (Stock fijado en 0).");
    } catch (err) {
      alert("Error al desactivar producto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STORES CRUD HANDLERS
  // ==========================================
  const handleSaveStore = async (e) => {
    e.preventDefault();
    if (!storeForm.name || !storeForm.address) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      if (editingStoreId) {
        await apiService.updateStore(editingStoreId, storeForm);
        alert("Tienda actualizada.");
      } else {
        await apiService.createStore(storeForm);
        alert("Tienda creada con éxito.");
      }
      setStoreForm({ name: "", address: "", phone: "" });
      setEditingStoreId(null);
      setShowStoreForm(false);
      loadAllData();
    } catch (err) {
      alert("Error al guardar tienda: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditStore = (store) => {
    setStoreForm({
      name: store.name,
      address: store.address,
      phone: store.phone || ""
    });
    setEditingStoreId(store.storeId);
    setShowStoreForm(true);
  };

  const handleDeactivateStore = async (id) => {
    if (!window.confirm("¿Seguro que deseas desactivar esta tienda?")) return;
    try {
      setLoading(true);
      await apiService.deactivateStore(id);
      loadAllData();
      alert("Tienda desactivada.");
    } catch (err) {
      alert("Error al desactivar tienda: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // USERS ADMIN HANDLERS
  // ==========================================
  const handleChangeUserRole = async (email, newRole) => {
    try {
      setLoading(true);
      await apiService.updateUser(email, { role: newRole });
      loadAllData();
      alert("Rol de usuario actualizado.");
    } catch (err) {
      alert("Error al actualizar rol: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (email) => {
    if (!window.confirm("¿Seguro que deseas desactivar este usuario?")) return;
    try {
      setLoading(true);
      await apiService.deactivateUser(email);
      loadAllData();
      alert("Usuario desactivado.");
    } catch (err) {
      alert("Error al desactivar usuario: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ORDERS MANAGEMENT HANDLERS
  // ==========================================
  const handleChangeOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await apiService.updateOrderStatus(orderId, newStatus);
      loadAllData();
      alert("Estado de pedido actualizado.");
    } catch (err) {
      alert("Error al cambiar estado: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helpers
  const getRoleBadgeClass = (role) => {
    if (role === "Administrador") return "badge-rose";
    if (role === "Operador") return "badge-purple";
    return "badge-cyan";
  };

  if (!session) return null;

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
            <div 
              onClick={() => setActiveTab("dashboard")} 
              style={{ ...styles.navItem, ...(activeTab === "dashboard" ? styles.navItemActive : {}) }}
            >
              <TrendingUp size={20} />
              <span className="nav-label">Dashboard</span>
            </div>

            <div 
              onClick={() => setActiveTab("products")} 
              style={{ ...styles.navItem, ...(activeTab === "products" ? styles.navItemActive : {}) }}
            >
              <ShoppingBag size={20} />
              <span className="nav-label">Productos</span>
            </div>

            {session.user.role === "Administrador" && (
              <>
                <div 
                  onClick={() => setActiveTab("stores")} 
                  style={{ ...styles.navItem, ...(activeTab === "stores" ? styles.navItemActive : {}) }}
                >
                  <Store size={20} />
                  <span className="nav-label">Tiendas</span>
                </div>
                <div 
                  onClick={() => setActiveTab("users")} 
                  style={{ ...styles.navItem, ...(activeTab === "users" ? styles.navItemActive : {}) }}
                >
                  <Users size={20} />
                  <span className="nav-label">Usuarios</span>
                </div>
              </>
            )}

            <div 
              onClick={() => setActiveTab("orders")} 
              style={{ ...styles.navItem, ...(activeTab === "orders" ? styles.navItemActive : {}) }}
            >
              <ClipboardList size={20} />
              <span className="nav-label">Pedidos</span>
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
            <h1 style={{ textTransform: "capitalize" }}>{activeTab === "dashboard" ? "Dashboard" : activeTab}</h1>
            <p style={styles.headerSubtitle}>Portal Administrativo de CloudShop Enterprise</p>
          </div>

          <div style={styles.headerActions}>
            {/* Switch de Mock/Real API */}
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

            <button onClick={loadAllData} className="btn-secondary" style={styles.reloadBtn} disabled={loading}>
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
            <RefreshCw className="animate-spin" size={36} style={{ color: "var(--accent-cyan)" }} />
            <p style={{ marginTop: "12px", color: "var(--text-secondary)" }}>Procesando solicitud de CloudShop...</p>
          </div>
        ) : (
          <>
            {/* ==========================================
                TAB 1: EXECUTIVE DASHBOARD
                ========================================== */}
            {activeTab === "dashboard" && (
              <>
                <section style={styles.kpiGrid}>
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
                  </div>

                  <div className="glass-card" style={styles.kpiCard}>
                    <div style={styles.kpiHeader}>
                      <div>
                        <div style={styles.kpiLabel}>Pedidos Totales</div>
                        <div style={styles.kpiValue}>{totalSales.totalOrders}</div>
                      </div>
                      <div style={{ ...styles.kpiIconWrapper, backgroundColor: "var(--accent-purple-glow)", color: "var(--accent-purple)" }}>
                        <ShoppingBag size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="glass-card" style={styles.kpiCard}>
                    <div style={styles.kpiHeader}>
                      <div>
                        <div style={styles.kpiLabel}>Productos Agotados</div>
                        <div style={styles.kpiValue}>{outOfStock.length}</div>
                      </div>
                      <div style={{ ...styles.kpiIconWrapper, backgroundColor: "var(--accent-rose-glow)", color: "var(--accent-rose)" }}>
                        <AlertOctagon size={24} />
                      </div>
                    </div>
                  </div>
                </section>

                <div style={styles.chartsGrid}>
                  {/* Pedidos por Estado */}
                  <div className="glass-card" style={styles.cardPanel}>
                    <h3 style={styles.panelTitle}>Estados de Pedido</h3>
                    <div style={styles.chartContainer}>
                      {orderByStatus.map((item, idx) => (
                        <div key={idx} style={styles.statusRow}>
                          <span style={styles.statusLabel}>
                            <span style={{ ...styles.statusDot, backgroundColor: item.color }}></span>
                            {item.status}
                          </span>
                          <span style={styles.statusCount}>{item.count} pedidos</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ventas por Tienda */}
                  <div className="glass-card" style={styles.cardPanel}>
                    <h3 style={styles.panelTitle}>Ventas por Tienda</h3>
                    <div style={styles.tableResponsive}>
                      <table className="table-premium" style={styles.table}>
                        <thead>
                          <tr>
                            <th>Tienda</th>
                            <th style={{ textAlign: "right" }}>Pedidos</th>
                            <th style={{ textAlign: "right" }}>Ventas</th>
                          </tr>
                        </thead>
                        <tbody>
                          {salesByStore.map(store => (
                            <tr key={store.storeId}>
                              <td>{store.name}</td>
                              <td style={{ textAlign: "right" }}>{store.orders}</td>
                              <td style={{ textAlign: "right" }}>${store.sales.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div style={styles.chartsGrid}>
                  {/* Top Products */}
                  <div className="glass-card" style={styles.cardPanel}>
                    <h3 style={styles.panelTitle}>Productos Más Vendidos</h3>
                    <table className="table-premium" style={styles.table}>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th style={{ textAlign: "right" }}>Cantidad</th>
                          <th style={{ textAlign: "right" }}>Ingresos</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map(prod => (
                          <tr key={prod.productId}>
                            <td>{prod.name}</td>
                            <td style={{ textAlign: "right" }}>{prod.salesCount} units</td>
                            <td style={{ textAlign: "right" }}>${prod.revenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Out of Stock */}
                  <div className="glass-card" style={styles.cardPanel}>
                    <h3 style={styles.panelTitle}>Productos Agotados</h3>
                    {outOfStock.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", padding: "20px 0" }}>¡Inventario al día! No hay productos agotados.</p>
                    ) : (
                      <table className="table-premium" style={styles.table}>
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                          </tr>
                        </thead>
                        <tbody>
                          {outOfStock.map(prod => (
                            <tr key={prod.productId}>
                              <td>{prod.code || prod.productId.substring(0, 8).toUpperCase()}</td>
                              <td>{prod.name}</td>
                              <td><span className="badge-neon badge-cyan">{prod.category}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ==========================================
                TAB 2: PRODUCTS CRUD
                ========================================== */}
            {activeTab === "products" && (
              <div style={styles.crudContainer}>
                <div style={styles.crudHeader}>
                  <h2>Listado de Productos</h2>
                  <button onClick={() => { setShowProductForm(!showProductForm); setEditingProductId(null); setProductForm({ code: "", name: "", description: "", category: "", price: "", stock: "", shop: "" }); }} className="btn-neon">
                    <Plus size={16} style={{ marginRight: "6px" }} />
                    {showProductForm ? "Ocultar Formulario" : "Agregar Producto"}
                  </button>
                </div>

                {showProductForm && (
                  <form onSubmit={handleSaveProduct} className="glass-card" style={styles.formCard}>
                    <h3>{editingProductId ? "Editar Producto" : "Nuevo Producto"}</h3>
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label>Código de Barra *</label>
                        <input type="text" placeholder="Ej. TV-4K-55" value={productForm.code} onChange={e => setProductForm({ ...productForm, code: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label>Nombre del Producto *</label>
                        <input type="text" placeholder="Ej. Smart TV" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label>Categoría *</label>
                        <input type="text" placeholder="Ej. Electrónica" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label>Precio ($MXN) *</label>
                        <input type="number" min="0" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label>Stock Disponible</label>
                        <input type="number" min="0" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label>Tienda Propietaria *</label>
                        <select value={productForm.shop} onChange={e => setProductForm({ ...productForm, shop: e.target.value })} style={styles.formInput}>
                          <option value="">Selecciona una tienda</option>
                          {storesList.map(s => (
                            <option key={s.storeId} value={s.storeId}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                        <label>Descripción</label>
                        <textarea placeholder="Detalle técnico u otras características del producto..." value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} style={{ ...styles.formInput, height: "80px", resize: "none" }}></textarea>
                      </div>
                    </div>
                    <div style={styles.formActions}>
                      <button type="button" onClick={() => { setShowProductForm(false); setEditingProductId(null); }} className="btn-secondary">Cancelar</button>
                      <button type="submit" className="btn-neon">Guardar Producto</button>
                    </div>
                  </form>
                )}

                <div className="glass-card" style={{ padding: "12px" }}>
                  <table className="table-premium" style={styles.table}>
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th style={{ textAlign: "right" }}>Precio</th>
                        <th style={{ textAlign: "right" }}>Stock</th>
                        <th>Tienda</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsList.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)" }}>No hay productos registrados.</td></tr>
                      ) : (
                        productsList.map(prod => (
                          <tr key={prod.productId}>
                            <td>{prod.code || prod.productId.substring(0, 8).toUpperCase()}</td>
                            <td><strong>{prod.name}</strong></td>
                            <td><span className="badge-neon badge-cyan">{prod.category}</span></td>
                            <td style={{ textAlign: "right" }}>${prod.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</td>
                            <td style={{ textAlign: "right" }}>{prod.stock}</td>
                            <td>{storesList.find(s => s.storeId === prod.shop)?.name || "Tienda Online"}</td>
                            <td style={styles.actionButtonsCol}>
                              <button onClick={() => handleEditProduct(prod)} className="btn-secondary" style={styles.tableBtn}>Editar</button>
                              <button onClick={() => handleDeleteProduct(prod.productId)} className="btn-secondary" style={{ ...styles.tableBtn, color: "var(--accent-rose)", borderColor: "rgba(244, 63, 94, 0.2)" }}>Desactivar</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 3: STORES CRUD
                ========================================== */}
            {activeTab === "stores" && (
              <div style={styles.crudContainer}>
                <div style={styles.crudHeader}>
                  <h2>Gestión de Tiendas</h2>
                  <button onClick={() => { setShowStoreForm(!showStoreForm); setEditingStoreId(null); setStoreForm({ name: "", address: "", phone: "" }); }} className="btn-neon">
                    <Plus size={16} style={{ marginRight: "6px" }} />
                    {showStoreForm ? "Ocultar Formulario" : "Agregar Tienda"}
                  </button>
                </div>

                {showStoreForm && (
                  <form onSubmit={handleSaveStore} className="glass-card" style={styles.formCard}>
                    <h3>{editingStoreId ? "Editar Tienda" : "Nueva Tienda"}</h3>
                    <div style={styles.formGrid}>
                      <div style={styles.formGroup}>
                        <label>Nombre de la Sucursal *</label>
                        <input type="text" placeholder="Ej. Sucursal Sur" value={storeForm.name} onChange={e => setStoreForm({ ...storeForm, name: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={styles.formGroup}>
                        <label>Teléfono de Contacto</label>
                        <input type="text" placeholder="Ej. 555-1234" value={storeForm.phone} onChange={e => setStoreForm({ ...storeForm, phone: e.target.value })} style={styles.formInput} />
                      </div>
                      <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                        <label>Dirección Física *</label>
                        <input type="text" placeholder="Ej. Av. Insurgentes Sur 456" value={storeForm.address} onChange={e => setStoreForm({ ...storeForm, address: e.target.value })} style={styles.formInput} />
                      </div>
                    </div>
                    <div style={styles.formActions}>
                      <button type="button" onClick={() => { setShowStoreForm(false); setEditingStoreId(null); }} className="btn-secondary">Cancelar</button>
                      <button type="submit" className="btn-neon">Guardar Tienda</button>
                    </div>
                  </form>
                )}

                <div className="glass-card" style={{ padding: "12px" }}>
                  <table className="table-premium" style={styles.table}>
                    <thead>
                      <tr>
                        <th>ID de Tienda</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storesList.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)" }}>No hay tiendas registradas.</td></tr>
                      ) : (
                        storesList.map(store => (
                          <tr key={store.storeId}>
                            <td>{store.storeId.substring(0, 10).toUpperCase()}</td>
                            <td><strong>{store.name}</strong></td>
                            <td>{store.address}</td>
                            <td>{store.phone || "Sin teléfono"}</td>
                            <td>
                              <span className={`badge-neon ${store.status === "ACTIVE" ? "badge-green" : "badge-rose"}`}>
                                {store.status || "ACTIVE"}
                              </span>
                            </td>
                            <td style={styles.actionButtonsCol}>
                              <button onClick={() => handleEditStore(store)} className="btn-secondary" style={styles.tableBtn}>Editar</button>
                              <button onClick={() => handleDeactivateStore(store.storeId)} className="btn-secondary" style={{ ...styles.tableBtn, color: "var(--accent-rose)", borderColor: "rgba(244, 63, 94, 0.2)" }}>Desactivar</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 4: USERS MANAGEMENT
                ========================================== */}
            {activeTab === "users" && (
              <div style={styles.crudContainer}>
                <h2>Gestión Administrativa de Usuarios</h2>
                
                <div className="glass-card" style={{ padding: "12px", marginTop: "15px" }}>
                  <table className="table-premium" style={styles.table}>
                    <thead>
                      <tr>
                        <th>Nombre Completo</th>
                        <th>Correo Electrónico</th>
                        <th>Rol</th>
                        <th>Estado de Cuenta</th>
                        <th style={{ textAlign: "center" }}>Cambiar Rol</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: "center", color: "var(--text-muted)" }}>No hay usuarios registrados.</td></tr>
                      ) : (
                        usersList.map(usr => (
                          <tr key={usr.email}>
                            <td><strong>{usr.name}</strong></td>
                            <td>{usr.email}</td>
                            <td>
                              <span className={`badge-neon ${getRoleBadgeClass(usr.role)}`}>
                                {usr.role}
                              </span>
                            </td>
                            <td>
                              <span className={`badge-neon ${usr.verified ? "badge-green" : "badge-rose"}`}>
                                {usr.verified ? "Verificado (Activo)" : "Desactivado"}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <select 
                                value={usr.role} 
                                onChange={e => handleChangeUserRole(usr.email, e.target.value)} 
                                style={styles.roleSelect}
                              >
                                <option value="Cliente">Cliente</option>
                                <option value="Operador">Operador</option>
                                <option value="Administrador">Administrador</option>
                              </select>
                            </td>
                            <td style={styles.actionButtonsCol}>
                              <button 
                                onClick={() => handleDeactivateUser(usr.email)} 
                                className="btn-secondary" 
                                style={{ ...styles.tableBtn, color: "var(--accent-rose)", borderColor: "rgba(244, 63, 94, 0.2)" }}
                                disabled={usr.email === session.user.email}
                              >
                                Desactivar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==========================================
                TAB 5: ORDERS MANAGEMENT
                ========================================== */}
            {activeTab === "orders" && (
              <div style={styles.crudContainer}>
                <h2>Supervisión y Control de Pedidos</h2>

                <div className="glass-card" style={{ padding: "12px", marginTop: "15px" }}>
                  <table className="table-premium" style={styles.table}>
                    <thead>
                      <tr>
                        <th>ID de Pedido</th>
                        <th>Cliente Email</th>
                        <th>Fecha</th>
                        <th>Productos / Unidades</th>
                        <th style={{ textAlign: "right" }}>Total ($MXN)</th>
                        <th>Estado Actual</th>
                        <th style={{ textAlign: "center" }}>Cambiar Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersList.length === 0 ? (
                        <tr><td colSpan="7" style={{ textAlign: "center", color: "var(--text-muted)" }}>No hay pedidos registrados en el sistema.</td></tr>
                      ) : (
                        ordersList.map(order => (
                          <tr key={order.orderId}>
                            <td>{order.orderId.substring(0, 10).toUpperCase()}</td>
                            <td>{order.customerEmail}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>
                              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                {order.items.map((it, idx) => (
                                  <div key={idx}>- {it.name} (x{it.quantity})</div>
                                ))}
                              </div>
                            </td>
                            <td style={{ textAlign: "right" }}><strong>${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</strong></td>
                            <td>
                              <span className={`badge-neon ${
                                order.status === "Entregado" ? "badge-green" :
                                order.status === "Cancelado" ? "badge-rose" :
                                order.status === "Enviado" ? "badge-cyan" : "badge-orange"
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <select 
                                value={order.status} 
                                onChange={e => handleChangeOrderStatus(order.orderId, e.target.value)}
                                style={styles.statusSelect}
                                disabled={order.status === "Cancelado" || order.status === "Entregado"}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="En preparación">En preparación</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Entregado">Entregado</option>
                                <option value="Cancelado">Cancelado</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Estilos del Layout Dashboard
const styles = {
  logoText: {
    fontSize: "1.5rem",
    background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "800"
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 0"
  },
  sidebarTop: {
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  },
  navMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "10px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    fontSize: "0.95rem"
  },
  navItemActive: {
    background: "linear-gradient(135deg, var(--accent-cyan-glow) 0%, var(--accent-purple-glow) 100%)",
    borderColor: "var(--accent-cyan)",
    color: "var(--text-primary)",
    boxShadow: "0 4px 15px rgba(6, 182, 212, 0.15)"
  },
  sidebarBottom: {
    borderTop: "1px solid var(--border-color)",
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  userInfoCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)"
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--accent-cyan-glow) 0%, var(--accent-purple-glow) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border-color)",
    color: "var(--accent-cyan)"
  },
  userInfoText: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0
  },
  userName: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  userEmail: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  logoutBtn: {
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    border: "1px solid rgba(244, 63, 94, 0.2)",
    color: "#f43f5e",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.2s ease"
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "280px",
    borderRight: "1px solid var(--border-color)",
    padding: "24px",
    backgroundColor: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(var(--glass-blur))",
    height: "100vh",
    position: "sticky",
    top: 0
  },
  headerSubtitle: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    marginTop: "4px"
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "20px",
    borderBottom: "1px solid var(--border-color)",
    marginBottom: "24px"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  dbToggleCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 14px",
    backgroundColor: "rgba(15, 23, 42, 0.45)"
  },
  dbToggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem"
  },
  toggleBtn: {
    padding: "6px 12px",
    fontSize: "0.8rem",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  reloadBtn: {
    padding: "10px",
    borderRadius: "8px"
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    backgroundColor: "rgba(244, 63, 94, 0.08)",
    borderColor: "rgba(244, 63, 94, 0.25)",
    marginBottom: "20px"
  },
  errorTextContainer: {
    flex: 1
  },
  errorBtn: {
    padding: "8px 16px",
    fontSize: "0.85rem",
    borderRadius: "8px"
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "100px 0"
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "24px"
  },
  kpiCard: {
    padding: "24px",
    backgroundColor: "rgba(15, 23, 42, 0.45)"
  },
  kpiHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start"
  },
  kpiLabel: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    fontWeight: "500"
  },
  kpiValue: {
    fontSize: "1.8rem",
    fontWeight: "800",
    color: "var(--text-primary)",
    marginTop: "8px"
  },
  kpiIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
    marginBottom: "24px"
  },
  cardPanel: {
    padding: "24px",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  panelTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "var(--text-primary)"
  },
  chartContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px"
  },
  statusLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-secondary)"
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%"
  },
  statusCount: {
    fontSize: "0.85rem",
    color: "var(--text-primary)",
    fontWeight: "700"
  },
  tableResponsive: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  crudContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  crudHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  formCard: {
    padding: "24px",
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  formInput: {
    backgroundColor: "rgba(8, 12, 20, 0.6)",
    border: "1px solid var(--border-color)",
    padding: "10px 14px",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    outline: "none"
  },
  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px"
  },
  actionButtonsCol: {
    display: "flex",
    gap: "8px",
    justifyContent: "center"
  },
  tableBtn: {
    padding: "6px 12px",
    fontSize: "0.8rem",
    borderRadius: "6px"
  },
  roleSelect: {
    backgroundColor: "rgba(8, 12, 20, 0.6)",
    border: "1px solid var(--border-color)",
    padding: "4px 8px",
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "0.8rem"
  },
  statusSelect: {
    backgroundColor: "rgba(8, 12, 20, 0.6)",
    border: "1px solid var(--border-color)",
    padding: "4px 8px",
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "0.8rem"
  }
};
