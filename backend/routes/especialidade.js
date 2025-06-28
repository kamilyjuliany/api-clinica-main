const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ Listar todos as especialidades
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        IDESPEC, CODESPEC, DESCESPEC
      FROM 
        ESPECIALIDADE
    `);
    res.json(rows);
  } catch (error) {
    console.error('[GET /especialidades] Erro:', error.message);
    res.status(500).json({ message: 'Erro ao buscar especialidades.' });
  }
});

module.exports = router;
