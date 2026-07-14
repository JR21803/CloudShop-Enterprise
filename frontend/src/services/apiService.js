import { cognitoService } from "./cognitoService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY || "";

// Guardar preferencia de forzar mock en localStorage
const getForceMockPreference = () => {
  const pref = localStorage.getItem("cloudshop_force_mock");
  return pref === null ? !API_BASE_URL : pref === "true";
};

let forceMock = getForceMockPreference();

// DB LOCAL MOCK SEEDS
const defaultProducts = [
  { productId: "p1", name: 'Smart TV 55" 4K UHD', description: 'Televisor inteligente de 55 pulgadas con resolución 4K y sonido envolvente.', category: "Electrónica", price: 599, stock: 0, code: "TV-55-4K", shop: "s3" },
  { productId: "p2", name: "Auriculares Bluetooth Pro", description: 'Auriculares inalámbricos con cancelación activa de ruido.', category: "Audio", price: 129, stock: 0, code: "AUD-NOISE-X", shop: "s3" },
  { productId: "p3", name: "Cafetera Express Automática", description: 'Cafetera espresso automática con espumador de leche.', category: "Hogar", price: 299, stock: 0, code: "CAF-EXP-A", shop: "s3" },
  { productId: "p4", name: "Teclado Mecánico RGB", description: 'Teclado mecánico para gaming con retroiluminación RGB.', category: "Accesorios", price: 79, stock: 0, code: "KEY-MECH-RGB", shop: "s3" },
  { productId: "p5", name: 'Laptop Pro 16"', description: 'Laptop de alto rendimiento para desarrolladores y creadores.', category: "Electrónica", price: 1499, stock: 15, code: "LAP-16-PRO", shop: "s3" },
  { productId: "p6", name: "Smartphone X1 Pro", description: 'Teléfono de última generación con cámara de 108MP.', category: "Electrónica", price: 899, stock: 8, code: "PH-X1-PRO", shop: "s1" },
  { productId: "p7", name: "Consola NextGen 1TB", description: 'Consola de videojuegos con almacenamiento de 1TB SSD.', category: "Electrónica", price: 499, stock: 20, code: "CONS-NG-1T", shop: "s2" },
  { productId: "p8", name: "Reloj Inteligente Fit", description: 'Smartwatch deportivo con sensor de ritmo cardíaco.', category: "Accesorios", price: 149, stock: 45, code: "SW-FIT", shop: "s4" },
  { productId: "p9", name: "Silla Gamer Ergonómica", description: 'Silla ergonómica de cuero con reposabrazos ajustables.', category: "Accesorios", price: 249, stock: 12, code: "CH-GAMER", shop: "s5" }
];

const defaultStores = [
  { storeId: "s1", name: "Sucursal Nebula", address: "Av. Cosmos 101, Sector Alpha", phone: "555-0192-348", status: "ACTIVE" },
  { storeId: "s2", name: "Sucursal Nova", address: "Calle de las Estrellas 456, Sector Beta", phone: "333-8271-923", status: "ACTIVE" },
  { storeId: "s3", name: "Tienda Online (E-Commerce)", address: "Virtual / CloudShop Cloud", phone: "800-CLOUD-SH", status: "ACTIVE" },
  { storeId: "s4", name: "Sucursal Apex", address: "Av. Andrómeda 789, Sector Gamma", phone: "818-3721-987", status: "ACTIVE" },
  { storeId: "s5", name: "Sucursal Horizon", address: "Ruta Galáctica km 12, Sector Delta", phone: "442-9182-736", status: "ACTIVE" }
];

const defaultOrders = [
  { orderId: "o1", customerEmail: "sophia.rod@gmail.com", storeId: "s3", items: [{ productId: "p5", name: 'Laptop Pro 16"', price: 1499, quantity: 1 }], total: 1499, status: "Entregado", createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { orderId: "o2", customerEmail: "liam.b@gmail.com", storeId: "s3", items: [{ productId: "p6", name: "Smartphone X1 Pro", price: 899, quantity: 1 }], total: 899, status: "Enviado", createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { orderId: "o3", customerEmail: "isabella.s@yahoo.com", storeId: "s1", items: [{ productId: "p8", name: "Reloj Inteligente Fit", price: 149, quantity: 2 }], total: 298, status: "Pendiente", createdAt: new Date().toISOString() }
];

// Initialize Mock databases in localStorage if empty or outdated
const MOCK_VERSION = "v2_usd_stores";
if (localStorage.getItem("cloudshop_mock_version") !== MOCK_VERSION) {
  localStorage.setItem("cloudshop_mock_version", MOCK_VERSION);
  localStorage.setItem("cloudshop_mock_products", JSON.stringify(defaultProducts));
  localStorage.setItem("cloudshop_mock_stores", JSON.stringify(defaultStores));
  localStorage.setItem("cloudshop_mock_orders", JSON.stringify(defaultOrders));
} else {
  if (!localStorage.getItem("cloudshop_mock_products")) {
    localStorage.setItem("cloudshop_mock_products", JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem("cloudshop_mock_stores")) {
    localStorage.setItem("cloudshop_mock_stores", JSON.stringify(defaultStores));
  }
  if (!localStorage.getItem("cloudshop_mock_orders")) {
    localStorage.setItem("cloudshop_mock_orders", JSON.stringify(defaultOrders));
  }
}

// Helpers Local Storage
const getMockProducts = () => JSON.parse(localStorage.getItem("cloudshop_mock_products"));
const saveMockProducts = (data) => localStorage.setItem("cloudshop_mock_products", JSON.stringify(data));
const getMockStores = () => JSON.parse(localStorage.getItem("cloudshop_mock_stores"));
const saveMockStores = (data) => localStorage.setItem("cloudshop_mock_stores", JSON.stringify(data));
const getMockOrders = () => JSON.parse(localStorage.getItem("cloudshop_mock_orders"));
const saveMockOrders = (data) => localStorage.setItem("cloudshop_mock_orders", JSON.stringify(data));

// Generador de datos Mock dinámicos para dashboard
const generateMockDashboardData = () => {
  const products = getMockProducts();
  const stores = getMockStores();
  const orders = getMockOrders();

  // Calcular métricas reales a partir de los Mocks
  const totalSalesVal = orders
    .filter(o => o.status !== "Cancelado")
    .reduce((acc, curr) => acc + curr.total, 0);

  const outOfStockList = products.filter(p => p.stock === 0);

  return {
    totalSales: {
      totalOrders: orders.length,
      totalSales: totalSalesVal
    },
    orderByStatus: [
      { status: "Entregado", count: orders.filter(o => o.status === "Entregado").length, color: "#10B981" },
      { status: "Enviado", count: orders.filter(o => o.status === "Enviado").length, color: "#3B82F6" },
      { status: "Pendiente", count: orders.filter(o => o.status === "Pendiente" || o.status === "Confirmado" || o.status === "En preparación").length, color: "#F59E0B" },
      { status: "Cancelado", count: orders.filter(o => o.status === "Cancelado").length, color: "#EF4444" }
    ],
    outOfStock: outOfStockList.slice(0, 5),
    topProducts: products.slice(0, 5).map((p, idx) => ({
      productId: p.productId,
      name: p.name,
      salesCount: 15 - idx * 2,
      revenue: (15 - idx * 2) * p.price
    })),
    topCustomers: [
      { customerId: "c1", name: "Sophia Rodriguez", email: "sophia.rod@gmail.com", totalSpent: 1542.50, ordersCount: 12, tier: "VIP" },
      { customerId: "c2", name: "Liam Bennett", email: "liam.b@gmail.com", totalSpent: 1285.00, ordersCount: 9, tier: "VIP" }
    ],
    salesByStore: stores.map((s, idx) => ({
      storeId: s.storeId,
      name: s.name,
      sales: totalSalesVal * (0.4 - idx * 0.08),
      orders: Math.round(orders.length * (0.4 - idx * 0.08))
    }))
  };
};

/**
 * Cliente HTTP genérico para API Gateway con Token de Cognito
 */
async function apiRequest(path, method = "GET", body = null) {
  const session = cognitoService.getCurrentSession();
  if (!session || !session.tokens) {
    throw new Error("No hay una sesión activa de usuario.");
  }

  const idToken = session.tokens.IdToken;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": idToken
  };

  if (API_KEY) {
    headers["x-api-key"] = API_KEY;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Acceso denegado (403). Verifica la API Key o los permisos.");
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Error del servidor (${response.status})`);
    }

    // Algunos deletes o updates pueden responder vacío
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  } catch (error) {
    console.error(`Error en API Request (${method} ${path}):`, error);
    throw error;
  }
}

export const apiService = {
  isMockMode: () => forceMock,
  
  toggleMockMode: () => {
    forceMock = !forceMock;
    localStorage.setItem("cloudshop_force_mock", String(forceMock));
    console.log(`API Service: Modo cambiado a ${forceMock ? "MOCK" : "REAL"}`);
    return forceMock;
  },

  // ==========================================
  // METODOS DEL DASHBOARD EJECUTIVO
  // ==========================================
  getTotalSales: async () => {
    if (forceMock) return generateMockDashboardData().totalSales;
    return apiRequest("/dashboard/totalSales");
  },
  getOrderByStatus: async () => {
    if (forceMock) return generateMockDashboardData().orderByStatus;
    return apiRequest("/dashboard/orderByStatus");
  },
  getOutOfStock: async () => {
    if (forceMock) return generateMockDashboardData().outOfStock;
    return apiRequest("/dashboard/outOfStock");
  },
  getTopProducts: async () => {
    if (forceMock) return generateMockDashboardData().topProducts;
    return apiRequest("/dashboard/topProducts");
  },
  getTopCustomers: async () => {
    if (forceMock) return generateMockDashboardData().topCustomers;
    return apiRequest("/dashboard/topCustomers");
  },
  getSalesByStore: async () => {
    if (forceMock) return generateMockDashboardData().salesByStore;
    return apiRequest("/dashboard/salesByStore");
  },

  // ==========================================
  // METODOS DEL CRUD DE PRODUCTOS
  // ==========================================
  getProducts: async () => {
    if (forceMock) return getMockProducts();
    return apiRequest("/products");
  },
  getProductById: async (id) => {
    if (forceMock) {
      const prod = getMockProducts().find(p => p.productId === id);
      if (!prod) throw new Error("Producto no encontrado");
      return prod;
    }
    return apiRequest(`/products/${id}`);
  },
  createProduct: async (productData) => {
    if (forceMock) {
      const products = getMockProducts();
      const newProduct = {
        productId: `p-${Math.random().toString(36).substring(2, 9)}`,
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock)
      };
      products.push(newProduct);
      saveMockProducts(products);
      return newProduct;
    }
    return apiRequest("/products", "POST", productData);
  },
  updateProduct: async (id, productData) => {
    if (forceMock) {
      const products = getMockProducts();
      const idx = products.findIndex(p => p.productId === id);
      if (idx === -1) throw new Error("Producto no encontrado");
      products[idx] = {
        ...products[idx],
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock)
      };
      saveMockProducts(products);
      return products[idx];
    }
    return apiRequest(`/products/${id}`, "PUT", productData);
  },
  deleteProduct: async (id) => {
    if (forceMock) {
      const products = getMockProducts();
      const idx = products.findIndex(p => p.productId === id);
      if (idx === -1) throw new Error("Producto no encontrado");
      products[idx].stock = 0; // Agotado
      saveMockProducts(products);
      return { success: true };
    }
    return apiRequest(`/products/${id}`, "DELETE");
  },

  // ==========================================
  // METODOS DEL CRUD DE TIENDAS
  // ==========================================
  getStores: async () => {
    if (forceMock) return getMockStores();
    return apiRequest("/stores");
  },
  getStoreById: async (id) => {
    if (forceMock) {
      const store = getMockStores().find(s => s.storeId === id);
      if (!store) throw new Error("Tienda no encontrada");
      return store;
    }
    return apiRequest(`/stores/${id}`);
  },
  createStore: async (storeData) => {
    if (forceMock) {
      const stores = getMockStores();
      const newStore = {
        storeId: `s-${Math.random().toString(36).substring(2, 9)}`,
        status: "ACTIVE",
        ...storeData
      };
      stores.push(newStore);
      saveMockStores(stores);
      return newStore;
    }
    return apiRequest("/stores", "POST", storeData);
  },
  updateStore: async (id, storeData) => {
    if (forceMock) {
      const stores = getMockStores();
      const idx = stores.findIndex(s => s.storeId === id);
      if (idx === -1) throw new Error("Tienda no encontrada");
      stores[idx] = { ...stores[idx], ...storeData };
      saveMockStores(stores);
      return stores[idx];
    }
    return apiRequest(`/stores/${id}`, "PUT", storeData);
  },
  deactivateStore: async (id) => {
    if (forceMock) {
      const stores = getMockStores();
      const idx = stores.findIndex(s => s.storeId === id);
      if (idx === -1) throw new Error("Tienda no encontrada");
      stores[idx].status = "INACTIVE";
      saveMockStores(stores);
      return { success: true };
    }
    return apiRequest(`/stores/${id}`, "DELETE");
  },

  // ==========================================
  // METODOS DEL CRUD DE USUARIOS (MOCK E INTEGRACIONES)
  // ==========================================
  getUsers: async () => {
    if (forceMock) {
      return JSON.parse(localStorage.getItem("cloudshop_mock_users") || "[]");
    }
    return apiRequest("/users");
  },
  updateUser: async (id, userData) => {
    if (forceMock) {
      const users = JSON.parse(localStorage.getItem("cloudshop_mock_users") || "[]");
      const idx = users.findIndex(u => u.email === id);
      if (idx === -1) throw new Error("Usuario no encontrado");
      users[idx] = { ...users[idx], ...userData };
      localStorage.setItem("cloudshop_mock_users", JSON.stringify(users));
      return users[idx];
    }
    return apiRequest(`/users/${id}`, "PUT", userData);
  },
  deactivateUser: async (id) => {
    if (forceMock) {
      const users = JSON.parse(localStorage.getItem("cloudshop_mock_users") || "[]");
      const idx = users.findIndex(u => u.email === id);
      if (idx === -1) throw new Error("Usuario no encontrado");
      users[idx].verified = false;
      localStorage.setItem("cloudshop_mock_users", JSON.stringify(users));
      return { success: true };
    }
    return apiRequest(`/users/${id}`, "DELETE");
  },

  // ==========================================
  // METODOS DE PEDIDOS (ORDERS)
  // ==========================================
  getOrders: async () => {
    if (forceMock) return getMockOrders();
    return apiRequest("/orders").catch(() => getMockOrders());
  },
  createOrder: async (orderData) => {
    if (forceMock) {
      const orders = getMockOrders();
      const newOrder = {
        orderId: `o-${Math.random().toString(36).substring(2, 9)}`,
        status: "Pendiente",
        createdAt: new Date().toISOString(),
        ...orderData
      };
      orders.push(newOrder);
      saveMockOrders(orders);

      const products = getMockProducts();
      orderData.items.forEach(item => {
        const prod = products.find(p => p.productId === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      saveMockProducts(products);

      return newOrder;
    }
    return apiRequest("/orders", "POST", orderData).catch(() => {
      // Fallback a mock
      const orders = getMockOrders();
      const newOrder = {
        orderId: `o-${Math.random().toString(36).substring(2, 9)}`,
        status: "Pendiente",
        createdAt: new Date().toISOString(),
        ...orderData
      };
      orders.push(newOrder);
      saveMockOrders(orders);

      const products = getMockProducts();
      orderData.items.forEach(item => {
        const prod = products.find(p => p.productId === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      });
      saveMockProducts(products);
      return newOrder;
    });
  },
  updateOrderStatus: async (id, status) => {
    if (forceMock) {
      const orders = getMockOrders();
      const idx = orders.findIndex(o => o.orderId === id);
      if (idx === -1) throw new Error("Pedido no encontrado");
      orders[idx].status = status;
      saveMockOrders(orders);
      return orders[idx];
    }
    return apiRequest(`/orders/${id}`, "PUT", { status }).catch(() => {
      const orders = getMockOrders();
      const idx = orders.findIndex(o => o.orderId === id);
      if (idx !== -1) {
        orders[idx].status = status;
        saveMockOrders(orders);
      }
      return { success: true };
    });
  },
  cancelOrder: async (id) => {
    const orders = getMockOrders();
    const idx = orders.findIndex(o => o.orderId === id);
    if (idx !== -1) {
      orders[idx].status = "Cancelado";
      saveMockOrders(orders);
    }
    return apiService.updateOrderStatus(id, "Cancelado");
  }
};
