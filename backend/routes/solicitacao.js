const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/solicitacoes
router.post('/', async (req, res) => {
  const { idAgenda, tipo } = req.body;

  try {
    await pool.query(
      'INSERT INTO SOLICITACAO (IDAGENDA, TIPO) VALUES (?, ?)',
      [idAgenda, tipo]
    );
    res.status(201).json({ message: 'Solicitação registrada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar solicitação.' });
  }
});


module.exports = router;
