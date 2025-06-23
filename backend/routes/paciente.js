const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');

router.post('/', pacienteController.registrar);
router.get('/listar', pacienteController.listar); // lista todos
router.get('/:cpf', pacienteController.buscarPorCpf); // lista um pelo CPF

module.exports = router;
