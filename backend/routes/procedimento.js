const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ 1. Listar todos os procedimentos com suas especialidades
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        EP.IDESPECPROCED, EP.ID_PROCED, P.DESCRPROC, EP.ID_ESPEC, E.DESCESPEC
      FROM 
        ESPECPROCED EP
        JOIN PROCEDIMENTO P ON EP.ID_PROCED = P.IDPROCED
        JOIN ESPECIALIDADE E ON EP.ID_ESPEC = E.IDESPEC`
    );
    res.json(rows);
  } catch (error) {
    console.error('[GET /procedimentos] Erro:', error.message);
    res.status(500).json({ message: 'Erro ao buscar procedimentos.' });
  }
});

// ✅ 2. Buscar procedimentos por especialidade (ID_ESPEC)
router.get('/:idEspec', async (req, res) => {
  const idEspec = req.params.idEspec;

  try {
    const [rows] = await pool.query(
      `SELECT 
        EP.IDESPECPROCED, EP.ID_PROCED, P.DESCRPROC, EP.ID_ESPEC, E.DESCESPEC
      FROM 
        ESPECPROCED EP
        JOIN PROCEDIMENTO P ON EP.ID_PROCED = P.IDPROCED
        JOIN ESPECIALIDADE E ON EP.ID_ESPEC = E.IDESPEC
      WHERE 
        E.IDESPEC = ?`,
      [idEspec]
    );

    res.status(200).json(rows);

  } catch (error) {
    console.error(`[GET /procedimentos/${idEspec}] Erro:`, error.message);
    res.status(500).json({ message: 'Erro ao buscar procedimentos por especialidade.' });
  }
});

module.exports = router;
