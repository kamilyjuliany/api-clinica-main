// routes/consulta.js
const express = require('express');
const router = express.Router();
const consultaController = require('../controllers/consultaController');
const auth = require('../middlewares/auth');

router.get('/:idPaciente', auth, consultaController.listarConsultas);
router.post('/', auth, consultaController.criarConsulta);

module.exports = router;
