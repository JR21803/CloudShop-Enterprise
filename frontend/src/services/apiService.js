import { cognitoService } from "./cognitoService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";
const API_KEY = import.meta.env.VITE_API_KEY || "";

// Guardar preferencia de forzar mock en localStorage
const getForceMockPreference = () => {
  const pref = localStorage.getItem("cloudshop_force_mock");
  return pref === null ? !API_BASE_URL : pref === "true";
};

let forceMock = getForceMockPreference();

// Generador de datos Mock dinámicos y realistas
const generateMockData = () => {
  // Generamos algunas variaciones leves basadas en el tiempo para que no sea totalmente estático
  const hourFactor = new Date().getHours() / 24;
  
  return {
    totalSales: {
      totalOrders: Math.round(1543 + hourFactor * 32),
      totalSales: Number((84320.50 + hourFactor * 2450.80).toFixed(2))
    },
    orderByStatus: [
      { status: "Entregado", count: Math.round(1120 + hourFactor * 20), color: "#10B981" },
      { status: "Enviado", count: Math.round(215 + hourFactor * 8), color: "#3B82F6" },
      { status: "Pendiente", count: Math.round(148 - hourFactor * 5), color: "#F59E0B" },
      { status: "Cancelado", count: Math.round(60 + hourFactor * 2), color: "#EF4444" }
    ],
    outOfStock: [
      { productId: "p1", name: 'Smart TV 55" 4K UHD', category: "Electrónica", sku: "TV-55-4K", stock: 0 },
      { productId: "p2", name: "Auriculares Bluetooth Pro", category: "Audio", sku: "AUD-NOISE-X", stock: 0 },
      { productId: "p3", name: "Cafetera Express Automática", category: "Hogar", sku: "CAF-EXP-A", stock: 0 },
      { productId: "p4", name: "Teclado Mecánico RGB", category: "Accesorios", sku: "KEY-MECH-RGB", stock: 0 }
    ],
    topProducts: [
      { productId: "p5", name: 'Laptop Pro 16"', salesCount: Math.round(350 + hourFactor * 10), revenue: 525000 },
      { productId: "p6", name: "Smartphone X1 Pro", salesCount: Math.round(420 + hourFactor * 12), revenue: 420000 },
      { productId: "p7", name: "Consola NextGen 1TB", salesCount: Math.round(310 + hourFactor * 5), revenue: 155000 },
      { productId: "p8", name: "Reloj Inteligente Fit", salesCount: Math.round(580 + hourFactor * 20), revenue: 116000 },
      { productId: "p9", name: "Silla Gamer Ergonómica", salesCount: Math.round(240 + hourFactor * 3), revenue: 72000 }
    ],
    topCustomers: [
      { customerId: "c1", name: "Sophia Rodriguez", email: "sophia.rod@gmail.com", totalSpent: 15420.50, ordersCount: 12, tier: "VIP" },
      { customerId: "c2", name: "Liam Bennett", email: "liam.b@gmail.com", totalSpent: 12850.00, ordersCount: 9, tier: "VIP" },
      { customerId: "c3", name: "Isabella Smith", email: "isabella.s@yahoo.com", totalSpent: 9300.00, ordersCount: 7, tier: "Oro" },
      { customerId: "c4", name: "Noah Davis", email: "noah.davis@outlook.com", totalSpent: 7890.20, ordersCount: 6, tier: "Oro" },
      { customerId: "c5", name: "Olivia Martinez", email: "olivia.mart@gmail.com", totalSpent: 5400.00, ordersCount: 4, tier: "Plata" }
    ],
    salesByStore: [
      { storeId: "s1", name: "Sucursal Norte CDMX", sales: 42500.00, orders: 450 },
      { storeId: "s2", name: "Sucursal Sur Guadalajara", sales: 31200.00, orders: 310 },
      { storeId: "s3", name: "Tienda Online (E-Commerce)", sales: 89430.20, orders: 980 },
      { storeId: "s4", name: "Sucursal Monterrey Centro", sales: 25100.00, orders: 245 },
      { storeId: "s5", name: "Sucursal Querétaro", sales: 18200.00, orders: 190 }
    ]
  };
};

/**
 * Cliente HTTP genérico para API Gateway con Token de Cognito
 */
async function apiRequest(endpoint) {
  if (forceMock) {
    // Simular latencia de red
    await new Promise((resolve) => setTimeout(resolve, 600));
    const mock = generateMockData();
    if (mock[endpoint]) {
      return mock[endpoint];
    }
    throw new Error(`Endpoint mock ${endpoint} no implementado`);
  }

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
    const response = await fetch(`${API_BASE_URL}/dashboard/${endpoint}`, {
      method: "GET",
      headers: headers
    });

    if (!response.ok) {
      // Si la API falla por credenciales u otro, tiramos error
      if (response.status === 403) {
        throw new Error("Acceso denegado (403). Verifica la API Key o los permisos de Cognito.");
      }
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Error del servidor (${response.status})`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en API Request (/dashboard/${endpoint}):`, error);
    // Si la llamada real falla por red o CORS, activamos fallback si el desarrollador lo desea
    throw error;
  }
}

export const apiService = {
  // Comprobar estado de modo de datos
  isMockMode: () => forceMock,
  
  // Alternar modo de datos
  toggleMockMode: () => {
    forceMock = !forceMock;
    localStorage.setItem("cloudshop_force_mock", String(forceMock));
    console.log(`API Service: Modo cambiado a ${forceMock ? "MOCK" : "REAL"}`);
    return forceMock;
  },

  // Métodos del Dashboard
  getTotalSales: () => apiRequest("totalSales"),
  getOrderByStatus: () => apiRequest("orderByStatus"),
  getOutOfStock: () => apiRequest("outOfStock"),
  getTopProducts: () => apiRequest("topProducts"),
  getTopCustomers: () => apiRequest("topCustomers"),
  getSalesByStore: () => apiRequest("salesByStore")
};
