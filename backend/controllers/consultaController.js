// controllers/consultaController.js
const pool = require('../db');

exports.listarConsultas = async (req, res) => {
  const { idPaciente } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT a.IDAGENDA, a.DATAABERT, pr.DESCRPROC, f.NOMEPESSOA AS profissional
         FROM AGENDA a
    INNER JOIN PROCEDIMENTO pr ON pr.IDPROCED = a.ID_PROCED
    INNER JOIN PROFISSIONAL p ON p.IDPROFISSIO = a.ID_PROFISSIO
    INNER JOIN PESSOAFIS f ON f.IDPESSOAFIS = p.ID_PESSOAFIS
        WHERE a.ID_PESSOAFIS = ?`,
      [idPaciente]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar consultas.' });
  }
};

exports.criarConsulta = async (req, res) => {
  const { idPaciente, idProfissional, idProcedimento, data } = req.body;

  try {
    await pool.query(
      `INSERT INTO AGENDA(ID_PESSOAFIS, ID_PROFISSIO, ID_PROCED, DATAABERT)
       VALUES (?, ?, ?, ?)`,
      [idPaciente, idProfissional, idProcedimento, data]
    );

    res.status(201).json({ message: 'Consulta agendada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao agendar consulta.' });
  }
};
// controllers/consultaController.js
exports.criarConsulta = async (req, res) => {
  const { idPessoaFis, idProfissional, idProcedimento, data } = req.body;

  try {
    await pool.query(
      `INSERT INTO AGENDA (ID_PESSOAFIS, ID_PROFISSIO, ID_PROCED, DATAABERT)
       VALUES (?, ?, ?, ?)`,
      [idPessoaFis, idProfissional, idProcedimento, data]
    );

    res.status(201).json({ message: 'Consulta agendada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao agendar consulta.' });
  }
};
