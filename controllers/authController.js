const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function register(req, res) {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
    const [existe] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existe.length > 0) return res.status(409).json({ success: false, message: 'Ya existe una cuenta con ese email.' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)', [nombre, email, hash, 'admin']);
    const user = { id: result.insertId, nombre, email, rol: 'admin' };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, data: { token, user } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email y contraseña obligatorios.' });
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    const token = jwt.sign({ id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, data: { token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

async function me(req, res) {
  try {
    const [rows] = await db.query('SELECT id, nombre, email, rol FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
}

module.exports = { register, login, me };