/**
 * Servicio para interactuar con AWS Cognito User Pool
 * Cuenta con soporte para modo Real (API Cognito) y modo Mock (almacenamiento local)
 */

const REGION = import.meta.env.VITE_AWS_REGION || "us-east-1";
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || "";
const COGNITO_URL = `https://cognito-idp.${REGION}.amazonaws.com/`;

// Activa el modo mock si no hay ClientId configurado
const isMockMode = !CLIENT_ID;

if (isMockMode) {
  console.log("Cognito Service: Iniciando en MODO MOCK (no se detectó VITE_COGNITO_CLIENT_ID)");
} else {
  console.log(`Cognito Service: Iniciando en MODO REAL (Region: ${REGION}, Client ID: ${CLIENT_ID})`);
}

/**
 * Llamada genérica a la API de Cognito
 */
async function cognitoRequest(target, body) {
  try {
    const response = await fetch(COGNITO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.1",
        "X-Amz-Target": `AWSCognitoIdentityProviderService.${target}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || data.__type || "Error de autenticación en Cognito");
    }
    return data;
  } catch (error) {
    console.error(`Cognito Request Error (${target}):`, error);
    throw error;
  }
}

/**
 * MOCK DB Helpers
 */
const getMockUsers = () => JSON.parse(localStorage.getItem("cloudshop_mock_users") || "[]");
const saveMockUsers = (users) => localStorage.setItem("cloudshop_mock_users", JSON.stringify(users));

export const cognitoService = {
  isMock: () => isMockMode,

  /**
   * Registro de usuario
   */
  signUp: async (email, password, name, role = "Cliente") => {
    if (isMockMode) {
      // Simular retraso de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      const users = getMockUsers();
      if (users.find((u) => u.email === email)) {
        throw new Error("El usuario ya existe");
      }

      users.push({
        email,
        password, // En una app real esto nunca se guardaría en texto plano
        name,
        role,
        verified: false,
        createdAt: new Date().toISOString()
      });
      saveMockUsers(users);

      return {
        UserConfirmed: false,
        UserSub: Math.random().toString(36).substring(2, 15)
      };
    }

    // Modo Real
    return await cognitoRequest("SignUp", {
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "name", Value: name },
        { Name: "custom:role", Value: role } // asumiendo atributo custom
      ]
    });
  },

  /**
   * Confirmar registro con código de verificación
   */
  confirmSignUp: async (email, code) => {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const users = getMockUsers();
      const user = users.find((u) => u.email === email);
      
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      // En el modo mock aceptamos cualquier código de 6 dígitos o '123456'
      if (code !== "123456" && (!/^\d{6}$/.test(code))) {
        throw new Error("Código de verificación incorrecto. Intenta con '123456' o cualquier código de 6 dígitos.");
      }

      user.verified = true;
      saveMockUsers(users);
      return { success: true };
    }

    // Modo Real
    return await cognitoRequest("ConfirmSignUp", {
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code
    });
  },

  /**
   * Iniciar sesión
   */
  signIn: async (email, password) => {
    if (isMockMode) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = getMockUsers();
      const user = users.find((u) => u.email === email);

      if (!user) {
        throw new Error("El usuario no existe");
      }

      if (user.password !== password) {
        throw new Error("Contraseña incorrecta");
      }

      if (!user.verified) {
        throw new Error("El usuario no ha sido verificado. Por favor confirma tu cuenta.");
      }

      const session = {
        tokens: {
          IdToken: `mock-id-token-${Math.random().toString(36).substring(2)}`,
          AccessToken: `mock-access-token-${Math.random().toString(36).substring(2)}`,
          RefreshToken: `mock-refresh-token-${Math.random().toString(36).substring(2)}`
        },
        user: {
          email: user.email,
          name: user.name,
          role: user.role
        }
      };

      localStorage.setItem("cloudshop_session", JSON.stringify(session));
      return session;
    }

    // Modo Real
    const authData = await cognitoRequest("InitiateAuth", {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    // Decodificar el token ID (JWT) de manera simple para extraer los claims del usuario
    const idToken = authData.AuthenticationResult.IdToken;
    const payloadBase64 = idToken.split(".")[1];
    const payloadDecoded = JSON.parse(atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")));

    const ROLE_BY_GROUP = {
      CloudShopAdministradores: "Administrador",
      CloudShopOperadores: "Operador",
      CloudShopClientes: "Cliente",
    };

    let userRole = payloadDecoded["custom:role"] || payloadDecoded.role;
    if (!userRole) {
      const groups = payloadDecoded["cognito:groups"] || payloadDecoded.groups || [];
      if (Array.isArray(groups)) {
        for (const groupName of groups) {
          if (ROLE_BY_GROUP[groupName]) {
            userRole = ROLE_BY_GROUP[groupName];
            break;
          }
        }
      } else if (typeof groups === "string") {
        userRole = ROLE_BY_GROUP[groups];
      }
    }

    const session = {
      tokens: {
        IdToken: authData.AuthenticationResult.IdToken,
        AccessToken: authData.AuthenticationResult.AccessToken,
        RefreshToken: authData.AuthenticationResult.RefreshToken
      },
      user: {
        email: payloadDecoded.email,
        name: payloadDecoded.name || payloadDecoded["custom:name"] || email.split("@")[0],
        role: userRole || "Cliente"
      }
    };

    localStorage.setItem("cloudshop_session", JSON.stringify(session));
    return session;
  },

  /**
   * Cerrar sesión
   */
  signOut: () => {
    localStorage.removeItem("cloudshop_session");
  },

  /**
   * Obtener sesión actual
   */
  getCurrentSession: () => {
    const sessionStr = localStorage.getItem("cloudshop_session");
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  }
};
