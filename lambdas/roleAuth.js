const ROLE_BY_GROUP = {
  CloudShopAdministradores: 'Administrador',
  CloudShopOperadores: 'Operador',
  CloudShopClientes: 'Cliente',
};

function getRole(claims = {}) {
  if (!claims || typeof claims !== 'object') {
    return null;
  }

  const directRole = claims['custom:role'] || claims.role;
  if (directRole) {
    return directRole;
  }

  const groups = claims['cognito:groups'] || claims.groups || [];
  if (Array.isArray(groups)) {
    for (const groupName of groups) {
      if (ROLE_BY_GROUP[groupName]) {
        return ROLE_BY_GROUP[groupName];
      }
    }
  }

  if (typeof groups === 'string') {
    return ROLE_BY_GROUP[groups] || null;
  }

  return null;
}

function hasRole(claims = {}, allowedRoles = []) {
  const role = getRole(claims);
  return Boolean(role && allowedRoles.includes(role));
}

module.exports = {
  ROLE_BY_GROUP,
  getRole,
  hasRole,
};
