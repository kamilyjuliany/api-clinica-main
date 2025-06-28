// routes/consulta.js
const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const auth = require('../middlewares/auth');

router.get('/:idPaciente', consultaController.listarConsultas);
router.post('/', consultaController.criarConsulta);

module.exports = router;
