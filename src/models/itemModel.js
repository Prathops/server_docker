const pool = require('../config/db');

const getAllItems = async () => {
  const [rows] = await pool.query('SELECT id, name, description, image_filename, image_url, created_at FROM items ORDER BY id DESC');
  return rows;
};

const createItem = async ({ name, description }) => {
  const [result] = await pool.query(
    'INSERT INTO items (name, description) VALUES (?, ?)',
    [name, description]
  );

  const [rows] = await pool.query(
    'SELECT id, name, description, image_filename, image_url, created_at FROM items WHERE id = ?',
    [result.insertId]
  );

  return rows[0];
};

const updateItemById = async (id, { name, description }) => {
  const [result] = await pool.query(
    'UPDATE items SET name = ?, description = ? WHERE id = ?',
    [name, description, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    'SELECT id, name, description, image_filename, image_url, created_at FROM items WHERE id = ?',
    [id]
  );

  return rows[0];
};

const deleteItemById = async (id) => {
  const [result] = await pool.query('DELETE FROM items WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const updateItemImageById = async (id, filename, imageUrl) => {
  const [result] = await pool.query(
    'UPDATE items SET image_filename = ?, image_url = ? WHERE id = ?',
    [filename, imageUrl, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    'SELECT id, name, description, image_filename, image_url, created_at FROM items WHERE id = ?',
    [id]
  );

  return rows[0];
};

const getItemById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, name, description, image_filename, image_url, created_at FROM items WHERE id = ?',
    [id]
  );

  return rows[0] || null;
};

const deleteItemImageById = async (id) => {
  const [result] = await pool.query(
    'UPDATE items SET image_filename = NULL, image_url = NULL WHERE id = ?',
    [id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query(
    'SELECT id, name, description, image_filename, image_url, created_at FROM items WHERE id = ?',
    [id]
  );

  return rows[0];
};

module.exports = {
  getAllItems,
  createItem,
  updateItemById,
  deleteItemById,
  updateItemImageById,
  getItemById,
  deleteItemImageById
};
