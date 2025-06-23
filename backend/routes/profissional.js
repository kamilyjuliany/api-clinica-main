const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT pf.IDPROFISSIO, pf.ID_PESSOAFIS, f.NOMEPESSOA
        FROM PROFISSIONAL pf
   LEFT JOIN PESSOAFIS f ON f.IDPESSOAFIS = pf.ID_PESSOAFIS
      WHERE pf.STATUSPROFI = '1'
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar profissionais.' });
  }
});

module.exports = router;
