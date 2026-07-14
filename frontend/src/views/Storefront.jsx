import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  LogOut, 
  User, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  Minus, 
  ClipboardList, 
  Store, 
  AlertCircle, 
  Check, 
  Database,
  RefreshCw,
  ShoppingBag as CartIcon
} from "lucide-react";
import { apiService } from "../services/apiService";
import { cognitoService } from "../services/cognitoService";

export default function Storefront() {
  const navigate = useNavigate();
  const session = cognitoService.getCurrentSession();
  
  // States
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("catalog"); // "catalog" or "orders"
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedStore, setSelectedStore] = useState("Todos");
  const [isMock, setIsMock] = useState(apiService.isMockMode());

  // Load Initial Data
  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [prodData, storeData, orderData] = await Promise.all([
        apiService.getProducts(),
        apiService.getStores(),
        apiService.getOrders()
      ]);
      setProducts(prodData);
      setStores(storeData);
      // Filter orders to show only current user's orders
      const userOrders = orderData.filter(o => o.customerEmail === session.user.email || o.userEmail === session.user.email);
      setOrders(userOrders);

      // Cargar carrito persistente
      let cartData = { products: [] };
      try {
        cartData = await apiService.getCart();
      } catch (cartErr) {
        console.error("Error al cargar el carrito del backend:", cartErr);
      }
      
      const backendProducts = cartData?.products || [];
      const enrichedCart = backendProducts.map(item => {
        const matchingProd = prodData.find(p => p.productId === item.productId);
        return {
          ...item,
          name: matchingProd ? matchingProd.name : "Producto desconocido",
          shop: matchingProd ? matchingProd.shop : "s3",
          description: matchingProd ? matchingProd.description : "",
          category: matchingProd ? matchingProd.category : "",
          stock: matchingProd ? matchingProd.stock : 999
        };
      });
      setCart(enrichedCart);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al cargar datos de CloudShop.");
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
    loadData();
  };

  // Cart operations
  const addToCart = async (product) => {
    const existing = cart.find(item => item.productId === product.productId);
    if (existing) {
      if (existing.quantity >= product.stock) {
        alert("No hay más stock disponible para este producto.");
        return;
      }
      const newQty = existing.quantity + 1;
      setLoading(true);
      try {
        await apiService.updateCartQuantity(product.productId, newQty);
        setCart(cart.map(item => 
          item.productId === product.productId 
            ? { ...item, quantity: newQty }
            : item
        ));
      } catch (err) {
        alert("Error al actualizar cantidad en el carrito: " + err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await apiService.addToCart(product.productId, 1, product.price);
        setCart([...cart, { ...product, quantity: 1 }]);
      } catch (err) {
        alert("Error al agregar producto al carrito: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const updateQuantity = async (productId, change) => {
    const item = cart.find(i => i.productId === productId);
    const prod = products.find(p => p.productId === productId);
    if (!item) return;
    
    const newQty = item.quantity + change;
    if (newQty <= 0) {
      await removeFromCart(productId);
    } else {
      if (change > 0 && prod && newQty > prod.stock) {
        alert("Stock límite alcanzado.");
        return;
      }
      setLoading(true);
      try {
        await apiService.updateCartQuantity(productId, newQty);
        setCart(cart.map(i => 
          i.productId === productId ? { ...i, quantity: newQty } : i
        ));
      } catch (err) {
        alert("Error al actualizar cantidad: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      await apiService.removeFromCart(productId);
      setCart(cart.filter(item => item.productId !== productId));
    } catch (err) {
      alert("Error al eliminar del carrito: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiService.clearCart();
      setCart([]);
    } catch (err) {
      alert("Error al limpiar el carrito: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    // Check if store ID is selected. Default to s3 (Online) or the first item's store
    const storeId = cart[0].shop || "s3";

    const orderData = {
      customerEmail: session.user.email,
      storeId: storeId,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    setLoading(true);
    try {
      await apiService.createOrder(orderData);
      try {
        await apiService.clearCart();
      } catch (clearErr) {
        console.error("Error al limpiar el carrito en el backend tras checkout:", clearErr);
      }
      setCart([]);
      setActiveTab("orders");
      await loadData(); // Reload products (for stock updates) and orders list
      alert("¡Pedido realizado con éxito!");
    } catch (err) {
      alert("Error al realizar el pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("¿Seguro que deseas cancelar este pedido?")) return;
    
    setLoading(true);
    try {
      await apiService.cancelOrder(orderId);
      await loadData();
      alert("Pedido cancelado.");
    } catch (err) {
      alert("Error al cancelar pedido: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter lists
  const categories = ["Todos", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.code?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesStore = selectedStore === "Todos" || p.shop === selectedStore;
    return matchesSearch && matchesCategory && matchesStore;
  });

  const getStoreName = (storeId) => {
    const store = stores.find(s => s.storeId === storeId);
    return store ? store.name : "Tienda CloudShop";
  };

  if (!session) return null;

  return (
    <div className="app-container">
      {/* Glow decorative backgrounds */}
      <div className="glow-container">
        <div className="glow-sphere glow-sphere-1"></div>
        <div className="glow-sphere glow-sphere-2"></div>
        <div className="glow-sphere glow-sphere-3"></div>
      </div>

      {/* Main Grid: Navigation + Content */}
      <div style={styles.gridContainer}>
        {/* main side */}
        <div style={styles.mainPanel}>
          {/* Header */}
          <header style={styles.headerBar}>
            <div style={styles.logoGroup}>
              <ShoppingBag size={32} style={{ color: "var(--accent-cyan)" }} />
              <div>
                <h1 style={styles.logoText}>CloudShop Enterprise</h1>
                <p style={styles.logoSub}>Portal de Compras Virtuales para Clientes</p>
              </div>
            </div>

            {/* Profile & Modes */}
            <div style={styles.headerActions}>
              {/* Mock/Real API switch */}
              <div className="glass-card" style={styles.dbToggleCard}>
                <Database size={16} style={{ color: isMock ? "#f59e0b" : "#10b981" }} />
                <span>Datos: <strong>{isMock ? "Mock" : "AWS Real"}</strong></span>
                <button onClick={handleToggleMock} className="btn-secondary" style={styles.smallToggleBtn}>
                  <RefreshCw size={12} />
                </button>
              </div>

              {/* Profile Card */}
              <div className="glass-card" style={styles.profileCard}>
                <div style={styles.avatar}>
                  <User size={16} />
                </div>
                <div style={styles.profileInfo}>
                  <div style={styles.profileName}>{session.user.name}</div>
                  <span className="badge-neon badge-cyan" style={{ fontSize: "0.75rem", padding: "1px 6px" }}>
                    {session.user.role}
                  </span>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn} title="Cerrar Sesión">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <div style={styles.tabsContainer}>
            <button 
              onClick={() => setActiveTab("catalog")} 
              style={{
                ...styles.tabBtn,
                ...(activeTab === "catalog" ? styles.tabBtnActive : {})
              }}
            >
              <Store size={18} />
              <span>Catálogo de Productos</span>
            </button>
            <button 
              onClick={() => setActiveTab("orders")} 
              style={{
                ...styles.tabBtn,
                ...(activeTab === "orders" ? styles.tabBtnActive : {})
              }}
            >
              <ClipboardList size={18} />
              <span>Mis Pedidos ({orders.length})</span>
            </button>
          </div>

          {error && (
            <div className="glass-card" style={styles.errorBanner}>
              <AlertCircle size={20} style={{ color: "#f43f5e" }} />
              <p style={{ margin: "0 10px" }}>{error}</p>
              <button onClick={loadData} className="btn-secondary" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>Reintentar</button>
            </div>
          )}

          {loading ? (
            <div style={styles.loaderContainer}>
              <RefreshCw className="animate-spin" size={32} style={{ color: "var(--accent-cyan)" }} />
              <p style={{ marginTop: "10px", color: "var(--text-secondary)" }}>Cargando información...</p>
            </div>
          ) : activeTab === "catalog" ? (
            /* CATALOG VIEW */
            <div>
              {/* Filters Toolbar */}
              <div className="glass-card" style={styles.filterToolbar}>
                {/* Search */}
                <div style={styles.searchWrapper}>
                  <Search size={18} style={styles.searchIcon} />
                  <input
                    type="text"
                    placeholder="Buscar por código, nombre o categoría..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>

                {/* Dropdowns */}
                <div style={styles.dropdownsWrapper}>
                  <div style={styles.filterSelectWrapper}>
                    <Filter size={14} style={styles.selectIcon} />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={styles.selectInput}
                    >
                      <option value="Todos">Todas las Categorías</option>
                      {categories.filter(c => c !== "Todos").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.filterSelectWrapper}>
                    <Store size={14} style={styles.selectIcon} />
                    <select
                      value={selectedStore}
                      onChange={(e) => setSelectedStore(e.target.value)}
                      style={styles.selectInput}
                    >
                      <option value="Todos">Todas las Tiendas</option>
                      {stores.map(store => (
                        <option key={store.storeId} value={store.storeId}>{store.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="glass-card" style={styles.emptyContainer}>
                  <ShoppingBag size={48} style={{ color: "var(--text-muted)", marginBottom: "15px" }} />
                  <h3>No se encontraron productos</h3>
                  <p>Intenta cambiando tus filtros de búsqueda o categoría.</p>
                </div>
              ) : (
                <div style={styles.productsGrid}>
                  {filteredProducts.map(product => {
                    const isOutOfStock = product.stock <= 0;
                    return (
                      <div className="glass-card" key={product.productId} style={styles.productCard}>
                        <div style={styles.productHeader}>
                          <span style={styles.productCategory}>{product.category}</span>
                          <span style={{
                            ...styles.stockBadge,
                            backgroundColor: isOutOfStock ? "rgba(244, 63, 94, 0.15)" : "rgba(16, 185, 129, 0.15)",
                            color: isOutOfStock ? "var(--accent-rose)" : "#10b981"
                          }}>
                            {isOutOfStock ? "Agotado" : `${product.stock} disp.`}
                          </span>
                        </div>

                        <h3 style={styles.productName}>{product.name}</h3>
                        <p style={styles.productCode}>Código: {product.code || product.productId.substring(0, 8).toUpperCase()}</p>
                        <p style={styles.productDescription}>{product.description || "Sin descripción disponible."}</p>
                        
                        <div style={styles.storeNameLabel}>
                          <Store size={14} style={{ marginRight: "4px" }} />
                          <span>{getStoreName(product.shop)}</span>
                        </div>

                        <div style={styles.productFooter}>
                          <div style={styles.productPrice}>
                            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className="btn-neon"
                            style={{ ...styles.addBtn, opacity: isOutOfStock ? 0.5 : 1 }}
                            disabled={isOutOfStock}
                          >
                            <Plus size={16} style={{ marginRight: "4px" }} />
                            <span>Añadir</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ORDERS VIEW */
            <div style={{ marginTop: "10px" }}>
              {orders.length === 0 ? (
                <div className="glass-card" style={styles.emptyContainer}>
                  <ClipboardList size={48} style={{ color: "var(--text-muted)", marginBottom: "15px" }} />
                  <h3>No has realizado pedidos aún</h3>
                  <p>Visita el catálogo de productos y haz tu primera compra.</p>
                </div>
              ) : (
                <div style={styles.ordersList}>
                  {orders.map(order => (
                    <div className="glass-card" key={order.orderId} style={styles.orderCard}>
                      <div style={styles.orderHeader}>
                        <div>
                          <h4 style={styles.orderIdText}>Pedido #{order.orderId.substring(0, 10).toUpperCase()}</h4>
                          <span style={styles.orderDate}>
                            {new Date(order.createdAt).toLocaleDateString("es", {
                              year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                        <span className={`badge-neon ${
                          order.status === "Entregado" ? "badge-green" :
                          order.status === "Cancelado" ? "badge-rose" :
                          order.status === "Enviado" ? "badge-cyan" : "badge-orange"
                        }`} style={{ padding: "6px 12px" }}>
                          {order.status}
                        </span>
                      </div>

                      {/* Store */}
                      <div style={styles.orderStore}>
                        <Store size={14} style={{ marginRight: "6px", color: "var(--accent-cyan)" }} />
                        <span>Tienda: <strong>{getStoreName(order.storeId)}</strong></span>
                      </div>

                      {/* Items */}
                      <div style={styles.orderItemsList}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={styles.orderItemRow}>
                            <span>{item.name} <span style={{ color: "var(--text-muted)" }}>x{item.quantity}</span></span>
                            <span>${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={styles.orderFooter}>
                        <div style={styles.orderTotal}>
                          Total: <strong style={{ color: "var(--accent-cyan)" }}>${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong>
                        </div>
                        {order.status === "Pendiente" && (
                          <button 
                            onClick={() => handleCancelOrder(order.orderId)} 
                            className="btn-secondary" 
                            style={styles.cancelOrderBtn}
                          >
                            Cancelar Pedido
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Floating Cart sidebar */}
        <aside className="glass-card" style={styles.cartSidebar}>
          <div style={styles.cartHeader}>
            <CartIcon size={22} style={{ color: "var(--accent-cyan)", marginRight: "8px" }} />
            <h2>Mi Carrito</h2>
            {cart.length > 0 && (
              <span className="badge-neon badge-cyan" style={{ marginLeft: "10px" }}>{cart.length}</span>
            )}
          </div>

          <div style={styles.cartBody}>
            {cart.length === 0 ? (
              <div style={styles.emptyCart}>
                <CartIcon size={36} style={{ color: "var(--text-muted)", marginBottom: "10px" }} />
                <p>El carrito está vacío</p>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center" }}>
                  Haz clic en "Añadir" en las tarjetas de productos para comprar.
                </span>
              </div>
            ) : (
              <div style={styles.cartItemsList}>
                {cart.map(item => (
                  <div key={item.productId} style={styles.cartItemCard}>
                    <div style={styles.cartItemHeader}>
                      <span style={styles.cartItemName}>{item.name}</span>
                      <button onClick={() => removeFromCart(item.productId)} style={styles.trashBtn}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={styles.cartItemFooter}>
                      <span style={styles.cartItemPrice}>
                        ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <div style={styles.quantityControls}>
                        <button onClick={() => updateQuantity(item.productId, -1)} style={styles.qtyBtn}>
                          <Minus size={12} />
                        </button>
                        <span style={styles.qtyText}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} style={styles.qtyBtn}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div style={styles.cartFooter}>
              <div style={styles.cartTotalRow}>
                <span>Subtotal:</span>
                <span style={styles.cartTotalAmount}>
                  ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div style={styles.cartActionButtons}>
                <button onClick={clearCart} className="btn-secondary" style={{ flex: 1, padding: "10px" }}>
                  Vaciar
                </button>
                <button onClick={handleCheckout} className="btn-neon" style={{ flex: 2, padding: "10px" }}>
                  Comprar ahora
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 340px",
    gap: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "24px",
    minHeight: "100vh",
    alignItems: "start"
  },
  mainPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    minWidth: 0
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid var(--border-color)"
  },
  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  logoText: {
    fontSize: "1.5rem",
    color: "var(--text-primary)",
    fontWeight: "700",
    letterSpacing: "-0.03em"
  },
  logoSub: {
    fontSize: "0.8rem",
    color: "var(--text-secondary)",
    marginTop: "2px"
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap"
  },
  dbToggleCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 14px",
    fontSize: "0.85rem",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "6px",
    border: "1px solid var(--border-color)"
  },
  smallToggleBtn: {
    padding: "4px 8px",
    borderRadius: "6px",
    background: "rgba(255, 255, 255, 0.05)"
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 14px",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "6px",
    border: "1px solid var(--border-color)"
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "var(--bg-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)"
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column"
  },
  profileName: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-primary)"
  },
  logoutBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s ease",
    marginLeft: "5px"
  },
  tabsContainer: {
    display: "flex",
    gap: "12px"
  },
  tabBtn: {
    background: "transparent",
    border: "1px solid var(--border-color)",
    color: "var(--text-secondary)",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease"
  },
  tabBtnActive: {
    background: "var(--bg-secondary)",
    borderColor: "var(--text-secondary)",
    color: "var(--text-primary)"
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    padding: "12px 18px",
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.15)",
    borderRadius: "6px",
    color: "var(--text-primary)"
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0"
  },
  filterToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
    flexWrap: "wrap",
    gap: "15px",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "6px",
    border: "1px solid var(--border-color)"
  },
  searchWrapper: {
    position: "relative",
    flex: "1",
    minWidth: "260px"
  },
  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "var(--text-muted)"
  },
  searchInput: {
    width: "100%",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    padding: "8px 16px 8px 42px",
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    outline: "none"
  },
  dropdownsWrapper: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap"
  },
  filterSelectWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  selectIcon: {
    position: "absolute",
    left: "12px",
    color: "var(--text-muted)",
    pointerEvents: "none"
  },
  selectInput: {
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    padding: "8px 12px 8px 32px",
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    minWidth: "160px"
  },
  emptyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
    textAlign: "center",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "6px"
  },
  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  },
  productCard: {
    display: "flex",
    flexDirection: "column",
    padding: "18px",
    gap: "12px",
    backgroundColor: "var(--bg-card)",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    position: "relative"
  },
  productHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  productCategory: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "var(--text-secondary)",
    backgroundColor: "var(--bg-secondary)",
    padding: "2px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border-color)"
  },
  stockBadge: {
    fontSize: "0.75rem",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "4px"
  },
  productName: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    marginTop: "4px"
  },
  productCode: {
    fontSize: "0.75rem",
    color: "var(--text-muted)",
    fontFamily: "monospace"
  },
  productDescription: {
    fontSize: "0.85rem",
    color: "var(--text-secondary)",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: "3",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "54px"
  },
  storeNameLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.75rem",
    color: "var(--text-secondary)",
    backgroundColor: "var(--bg-secondary)",
    alignSelf: "flex-start",
    padding: "3px 8px",
    borderRadius: "4px",
    border: "1px solid var(--border-color)",
    fontWeight: "500"
  },
  productFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px"
  },
  productPrice: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "var(--text-primary)"
  },
  addBtn: {
    padding: "8px 16px",
    fontSize: "0.85rem",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center"
  },
  cartSidebar: {
    width: "100%",
    height: "calc(100vh - 48px)",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    position: "sticky",
    top: "24px"
  },
  cartHeader: {
    display: "flex",
    alignItems: "center",
    padding: "18px",
    borderBottom: "1px solid var(--border-color)"
  },
  cartBody: {
    flex: "1",
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column"
  },
  emptyCart: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: "1",
    color: "var(--text-secondary)"
  },
  cartItemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  cartItemCard: {
    padding: "12px",
    borderRadius: "6px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  cartItemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start"
  },
  cartItemName: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "var(--text-primary)",
    paddingRight: "8px"
  },
  trashBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "2px",
    transition: "color 0.2s ease"
  },
  cartItemFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cartItemPrice: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--text-primary)"
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    padding: "2px"
  },
  qtyBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px"
  },
  qtyText: {
    fontSize: "0.85rem",
    fontWeight: "600",
    padding: "0 8px",
    minWidth: "20px",
    textAlign: "center"
  },
  cartFooter: {
    padding: "18px",
    borderTop: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  cartTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "var(--text-secondary)"
  },
  cartTotalAmount: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "var(--text-primary)"
  },
  cartActionButtons: {
    display: "flex",
    gap: "10px"
  },
  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  orderCard: {
    padding: "20px",
    backgroundColor: "var(--bg-card)",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start"
  },
  orderIdText: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--text-primary)"
  },
  orderDate: {
    fontSize: "0.75rem",
    color: "var(--text-muted)"
  },
  orderStore: {
    display: "flex",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "var(--text-secondary)"
  },
  orderItemsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "10px 0",
    borderTop: "1px solid var(--border-color)",
    borderBottom: "1px solid var(--border-color)"
  },
  orderItemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    color: "var(--text-secondary)"
  },
  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  orderTotal: {
    fontSize: "0.95rem",
    color: "var(--text-secondary)"
  },
  cancelOrderBtn: {
    padding: "6px 14px",
    fontSize: "0.8rem",
    borderColor: "rgba(239, 68, 68, 0.2)",
    color: "var(--accent-rose)",
    backgroundColor: "var(--accent-rose-glow)",
    borderRadius: "6px"
  }
};
