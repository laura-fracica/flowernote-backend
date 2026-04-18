-- ══════════════════════════════════════════════════════════════
--  FlowerNote — Script SQL completo
--  Ejecutar en MySQL 8+ o MariaDB 10.5+
--  Comando: mysql -u root -p < database.sql
-- ══════════════════════════════════════════════════════════════

-- 1. Crear y usar la base de datos
CREATE DATABASE IF NOT EXISTS flowernote
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE flowernote;

-- ──────────────────────────────────────────────────────────────
--  TABLA: users
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100)    NOT NULL,
  email      VARCHAR(150)    NOT NULL,
  password   VARCHAR(255)    NOT NULL,        -- bcrypt hash
  rol        ENUM('admin','vendedor','viewer') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ──────────────────────────────────────────────────────────────
--  TABLA: clientes
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(100)    NOT NULL,
  email      VARCHAR(150)    NOT NULL,
  telefono   VARCHAR(30)         NULL,
  ciudad     VARCHAR(80)         NULL,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_clientes_email (email),
  INDEX idx_clientes_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ──────────────────────────────────────────────────────────────
--  TABLA: productos
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  nombre     VARCHAR(150)    NOT NULL,
  codigo     VARCHAR(20)     NOT NULL,
  precio     DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  stock      INT UNSIGNED    NOT NULL DEFAULT 0,
  categoria  VARCHAR(80)         NULL,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_productos_codigo (codigo),
  INDEX idx_productos_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ──────────────────────────────────────────────────────────────
--  TABLA: ordenes
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ordenes (
  id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  codigo      VARCHAR(20)     NOT NULL,
  cliente_id  INT UNSIGNED    NOT NULL,
  producto_id INT UNSIGNED    NOT NULL,
  cantidad    INT UNSIGNED    NOT NULL DEFAULT 1,
  estado      ENUM('Pendiente','Pagado','Declinado') NOT NULL DEFAULT 'Pendiente',
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_ordenes_codigo (codigo),
  INDEX idx_ordenes_estado    (estado),
  INDEX idx_ordenes_fecha     (created_at),

  CONSTRAINT fk_ordenes_cliente
    FOREIGN KEY (cliente_id)  REFERENCES clientes (id) ON DELETE RESTRICT,
  CONSTRAINT fk_ordenes_producto
    FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ──────────────────────────────────────────────────────────────
--  TABLA: mensajes
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mensajes (
  id         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  de         VARCHAR(100)    NOT NULL,
  texto      TEXT            NOT NULL,
  leido      TINYINT(1)      NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_mensajes_leido (leido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ══════════════════════════════════════════════════════════════
--  DATOS DE PRUEBA (seed)
-- ══════════════════════════════════════════════════════════════

-- ── Usuario administrador ─────────────────────────────────────
-- Contraseña: Admin1234
-- (bcrypt hash generado con 10 rounds)
INSERT INTO users (nombre, email, password, rol) VALUES
  ('Laura García', 'admin@flowernote.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
   'admin');

-- ── Clientes ──────────────────────────────────────────────────
INSERT INTO clientes (nombre, email, telefono, ciudad) VALUES
  ('Alexandra Leclerc', 'ale@email.com',   '310-111-2233', 'Medellín'),
  ('Emma Lopez',        'emma@email.com',  '320-222-3344', 'Bogotá'),
  ('Kelly Piquet',      'kelly@email.com', '300-333-4455', 'Cali'),
  ('Valentina Ríos',    'vale@email.com',  '315-444-5566', 'Medellín'),
  ('Sofia Martínez',    'sofi@email.com',  '318-555-6677', 'Pereira'),
  ('Isabella Torres',   'isa@email.com',   '312-666-7788', 'Bogotá');

-- ── Productos ─────────────────────────────────────────────────
INSERT INTO productos (nombre, codigo, precio, stock, categoria) VALUES
  ('Ramo rosas rojas x12',     'P001', 85000,  24, 'Ramos'),
  ('Ramo lirios blancos x6',   'P002', 65000,  18, 'Ramos'),
  ('Bouquet girasoles x8',     'P003', 70000,  12, 'Bouquets'),
  ('Arreglo tulipanes x5',     'P004', 55000,  30, 'Arreglos'),
  ('Corona fúnebre',           'P005', 150000,  6, 'Coronas'),
  ('Ramo margaritas x10',      'P006', 45000,  20, 'Ramos'),
  ('Ramo mixto primavera x10', 'P007', 90000,  15, 'Ramos');

-- ── Órdenes ───────────────────────────────────────────────────
INSERT INTO ordenes (codigo, cliente_id, producto_id, cantidad, estado) VALUES
  ('1515', 1, 1, 2, 'Pendiente'),
  ('1516', 2, 2, 1, 'Pagado'),
  ('1517', 3, 6, 3, 'Declinado'),
  ('1518', 4, 1, 2, 'Pendiente'),
  ('1519', 5, 3, 1, 'Pagado'),
  ('1520', 6, 4, 4, 'Pendiente'),
  ('1521', 1, 5, 1, 'Pagado'),
  ('1522', 2, 7, 2, 'Declinado');

-- ── Mensajes ──────────────────────────────────────────────────
INSERT INTO mensajes (de, texto, leido) VALUES
  ('Alexandra Leclerc', '¿Tienen disponibilidad para el sábado?',        0),
  ('Emma Lopez',        'Quiero cambiar mi pedido de rosas por lirios.', 0),
  ('Kelly Piquet',      '¿Hacen envíos a El Poblado?',                   1),
  ('Valentina Ríos',    'Perfecto, confirmo el pedido para mañana.',      1),
  ('Sofia Martínez',    '¿Cuánto cuesta la corona fúnebre grande?',       1);


-- ══════════════════════════════════════════════════════════════
--  VISTA útil: resumen de órdenes con nombres
-- ══════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW vista_ordenes AS
SELECT
  o.id,
  o.codigo,
  o.cantidad,
  o.estado,
  o.created_at,
  p.nombre   AS producto,
  p.precio   AS precio_unitario,
  (o.cantidad * p.precio) AS subtotal,
  c.nombre   AS cliente,
  c.ciudad   AS ciudad_cliente
FROM ordenes o
JOIN productos p ON o.producto_id = p.id
JOIN clientes  c ON o.cliente_id  = c.id;

-- Verificar todo OK
SELECT 'users'    AS tabla, COUNT(*) AS registros FROM users
UNION ALL
SELECT 'clientes',           COUNT(*) FROM clientes
UNION ALL
SELECT 'productos',          COUNT(*) FROM productos
UNION ALL
SELECT 'ordenes',            COUNT(*) FROM ordenes
UNION ALL
SELECT 'mensajes',           COUNT(*) FROM mensajes;
