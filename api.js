// api.js
// ─────────────────────────────────────────────────────────────
//  FlowerNote — Capa de integración Frontend ↔ Backend
//  Coloca este archivo en la misma carpeta que index.html
//  Luego agrega al final del <body>:
//    <script src="./api.js"></script>
//    <script src="./script.js"></script>   ← script.js ya existente (sin modificar)
// ─────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:3000/api';

// ══════════════════════════════════════════════════════════════
//  UTILIDADES HTTP
// ══════════════════════════════════════════════════════════════

function getToken() {
  return localStorage.getItem('fn_token');
}

function setToken(token) {
  localStorage.setItem('fn_token', token);
}

function removeToken() {
  localStorage.removeItem('fn_token');
  localStorage.removeItem('fn_user');
}

function setUser(user) {
  localStorage.setItem('fn_user', JSON.stringify(user));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem('fn_user'));
  } catch {
    return null;
  }
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const res  = await fetch(`${API_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`);
  }

  return data;
}

// ══════════════════════════════════════════════════════════════
//  AUTH API
// ══════════════════════════════════════════════════════════════

const AuthAPI = {

  async login(email, password) {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  },

  async register(nombre, email, password) {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: { nombre, email, password },
    });
    setToken(data.data.token);
    setUser(data.data.user);
    return data.data;
  },

  logout() {
    removeToken();
    window.location.href = './login.html';
  },

  estaAutenticado() {
    return !!getToken();
  },

  usuarioActual() {
    return getUser();
  },
};

// ══════════════════════════════════════════════════════════════
//  CLIENTES API
// ══════════════════════════════════════════════════════════════

const ClientesAPI = {
  async getAll(q = '')    { return apiFetch(`/clientes${q ? `?q=${q}` : ''}`); },
  async getOne(id)        { return apiFetch(`/clientes/${id}`); },
  async create(datos)     { return apiFetch('/clientes',    { method: 'POST',   body: datos }); },
  async update(id, datos) { return apiFetch(`/clientes/${id}`, { method: 'PUT', body: datos }); },
  async delete(id)        { return apiFetch(`/clientes/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════════════════════
//  PRODUCTOS API
// ══════════════════════════════════════════════════════════════

const ProductosAPI = {
  async getAll(q = '')    { return apiFetch(`/productos${q ? `?q=${q}` : ''}`); },
  async getOne(id)        { return apiFetch(`/productos/${id}`); },
  async create(datos)     { return apiFetch('/productos',    { method: 'POST',   body: datos }); },
  async update(id, datos) { return apiFetch(`/productos/${id}`, { method: 'PUT', body: datos }); },
  async delete(id)        { return apiFetch(`/productos/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════════════════════
//  ÓRDENES API
// ══════════════════════════════════════════════════════════════

const OrdenesAPI = {
  async getAll(estado = '')    { return apiFetch(`/ordenes${estado ? `?estado=${estado}` : ''}`); },
  async getRecientes(limit = 4){ return apiFetch(`/ordenes?limit=${limit}`); },
  async getOne(id)             { return apiFetch(`/ordenes/${id}`); },
  async getDashboard()         { return apiFetch('/ordenes/dashboard/resumen'); },
  async create(datos)          { return apiFetch('/ordenes',    { method: 'POST',   body: datos }); },
  async updateEstado(id, estado){ return apiFetch(`/ordenes/${id}`, { method: 'PUT', body: { estado } }); },
  async delete(id)             { return apiFetch(`/ordenes/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════════════════════
//  MENSAJES API
// ══════════════════════════════════════════════════════════════

const MensajesAPI = {
  async getAll()    { return apiFetch('/mensajes'); },
  async getOne(id)  { return apiFetch(`/mensajes/${id}`); },
  async create(datos){ return apiFetch('/mensajes', { method: 'POST', body: datos }); },
  async marcarLeido(id){ return apiFetch(`/mensajes/${id}/leer`, { method: 'PATCH' }); },
  async delete(id)  { return apiFetch(`/mensajes/${id}`, { method: 'DELETE' }); },
};

// ══════════════════════════════════════════════════════════════
//  PROTECCIÓN DE RUTA
//  Redirige a login.html si no hay sesión activa
// ══════════════════════════════════════════════════════════════

(function protegerRuta() {
  // Si estamos en login.html, no redirigir
  if (window.location.pathname.includes('login')) return;

  if (!AuthAPI.estaAutenticado()) {
    window.location.href = './login.html';
    return;
  }

  // Mostrar nombre del usuario en el header (el span con "Laura" en el HTML)
  const user = AuthAPI.usuarioActual();
  if (user) {
    const saludo = document.querySelector('.profile .info p b');
    if (saludo) saludo.textContent = user.nombre.split(' ')[0];
  }

  // Conectar botón "Salir" del sidebar al logout
  const linkSalir = [...document.querySelectorAll('aside .sidebar a')]
    .find(a => a.querySelector('h3')?.textContent?.trim() === 'Salir');
  if (linkSalir) {
    linkSalir.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('¿Cerrar sesión?')) AuthAPI.logout();
    });
  }
})();

// ══════════════════════════════════════════════════════════════
//  HELPERS DE FORMATO
// ══════════════════════════════════════════════════════════════

const Formato = {
  // Convierte 85000 → '$85.000'
  moneda(valor) {
    return '$' + Number(valor).toLocaleString('es-CO');
  },
  // Convierte 'Pagado' → clase CSS 'paid', 'Declinado' → 'declined', etc.
  estadoClass(estado) {
    return estado === 'Pagado' ? 'paid' : estado === 'Declinado' ? 'declined' : '';
  },
};

// ══════════════════════════════════════════════════════════════
//  CARGAR DATOS REALES EN EL TABLERO
//  Reemplaza los arrays estáticos del script.js original
//  sin modificar ese archivo
// ══════════════════════════════════════════════════════════════

async function cargarDatosTablero() {
  try {
    const [dashRes, clientesRes, productosRes, mensajesRes] = await Promise.all([
      OrdenesAPI.getDashboard(),
      ClientesAPI.getAll(),
      ProductosAPI.getAll(),
      MensajesAPI.getAll(),
    ]);

    // Sobreescribir los arrays globales que usa script.js
    if (dashRes.success) {
      // ordenes → usada en renderTablero() y renderOrdenes()
      window.ordenes = dashRes.data.recientes.map(o => ({
        producto:    o.producto,
        codigo:      o.codigo,
        cantidad:    o.cantidad,
        estado:      o.estado,
        estadoClass: Formato.estadoClass(o.estado),
      }));
    }

    if (clientesRes.success) {
      window.clientes = clientesRes.data.map(c => ({
        nombre:   c.nombre,
        email:    c.email,
        telefono: c.telefono,
        ciudad:   c.ciudad,
        pedidos:  c.pedidos,
      }));
    }

    if (productosRes.success) {
      window.productos = productosRes.data.map(p => ({
        nombre:    p.nombre,
        codigo:    p.codigo,
        precio:    Formato.moneda(p.precio),
        stock:     p.stock,
        categoria: p.categoria,
      }));
    }

    if (mensajesRes.success) {
      window.mensajes = mensajesRes.data.map(m => ({
        de:    m.de,
        texto: m.texto,
        hora:  calcularHora(m.created_at),
        leido: !!m.leido,
      }));

      // Actualizar contador de mensajes no leídos en el sidebar
      const badge = document.querySelector('.message-count');
      if (badge) badge.textContent = mensajesRes.noLeidos;
    }

  } catch (err) {
    console.warn('⚠️  No se pudo conectar al backend. Usando datos de demostración.', err.message);
    // El frontend sigue funcionando con los arrays hardcodeados del script.js
  }
}

function calcularHora(fechaStr) {
  if (!fechaStr) return '';
  const diff = Math.floor((Date.now() - new Date(fechaStr).getTime()) / 60000);
  if (diff < 1)   return 'ahora mismo';
  if (diff < 60)  return `hace ${diff} min`;
  if (diff < 1440)return `hace ${Math.floor(diff / 60)} horas`;
  return `hace ${Math.floor(diff / 1440)} días`;
}

// Ejecutar al cargar la página (si hay sesión activa)
if (AuthAPI.estaAutenticado()) {
  cargarDatosTablero();
}
