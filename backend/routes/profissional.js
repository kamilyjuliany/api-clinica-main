const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ GET /profissionais → retorna todos os profissionais
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        P.IDPROFISSIO, 
        P.ID_PESSOAFIS, 
        PF.NOMEPESSOA, 
        PE.ID_ESPEC, 
        E.DESCESPEC
      FROM 
        PROFISSIONAL P 
        LEFT JOIN PESSOAFIS PF ON P.ID_PESSOAFIS = PF.IDPESSOAFIS 
        LEFT JOIN PROFI_ESPEC PE ON P.IDPROFISSIO = PE.ID_PROFISSIO
        LEFT JOIN ESPECIALIDADE E ON PE.ID_ESPEC = E.IDESPEC
    `);

    res.json(rows);
  } catch (error) {
    console.error('[ERRO] Falha ao buscar todos os profissionais:', error.message);
    res.status(500).json({ message: 'Erro ao buscar profissionais.' });
  }
});

// ✅ GET /profissionais/:idEspec → retorna profissionais por especialidade
router.get('/:idEspec', async (req, res) => {
  const idEspec = req.params.idEspec;

  try {
    const [rows] = await pool.query(`
      SELECT 
        P.IDPROFISSIO, 
        P.ID_PESSOAFIS, 
        PF.NOMEPESSOA, 
        PE.ID_ESPEC, 
        E.DESCESPEC
      FROM 
        PROFISSIONAL P 
        LEFT JOIN PESSOAFIS PF ON P.ID_PESSOAFIS = PF.IDPESSOAFIS 
        LEFT JOIN PROFI_ESPEC PE ON P.IDPROFISSIO = PE.ID_PROFISSIO
        LEFT JOIN ESPECIALIDADE E ON PE.ID_ESPEC = E.IDESPEC 
      WHERE 
        PE.ID_ESPEC = ?
    `, [idEspec]);

    res.status(200).json(rows);

    res.json(rows);
  } catch (error) {
    console.error('[ERRO] Falha ao buscar profissionais por especialidade:', error.message);
    res.status(500).json({ message: 'Erro ao buscar profissionais.' });
  }
});

module.exports = router;
