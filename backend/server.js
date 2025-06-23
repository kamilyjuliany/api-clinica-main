// server.js
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const pacienteRoutes = require('./routes/paciente');
const loginRoutes = require('./routes/login');
const consultaRoutes = require('./routes/consulta');
const procedimentoRoutes = require('./routes/procedimento');
const profissionalRoutes = require('./routes/profissional');
const solicitacaoRoutes = require('./routes/solicitacao');



app.use(cors());
app.use(express.json());

app.use('/api/pacientes', pacienteRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/procedimentos', procedimentoRoutes);
app.use('/api/profissionais', profissionalRoutes);
app.use('/api/solicitacoes', solicitacaoRoutes);


const PORT = 3000;
app.listen(PORT, "192.168.0.113", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});



//160.20.22.99:3360
