const pool = require('../db');
const bcrypt = require('bcryptjs');

exports.registrar = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    const { nome, cpf, rg, uf, dataNascimento, sexo = 'F', email, senha } = req.body;

    if (!nome || !cpf || !rg || !uf || !dataNascimento || !senha || !email) {
      return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    await conn.beginTransaction();

    // Verificar se já existe paciente com o mesmo CPF
    const [pacienteExistente] = await conn.query(
      `SELECT 1
      FROM PESSOAFIS PF
      INNER JOIN PESSOA P ON PF.ID_PESSOA = P.IDPESSOA
      WHERE PF.CPFPESSOA = ?`,
      [cpf]
    );

if (pacienteExistente.length > 0) {
  return res.status(409).json({ message: 'Paciente com este CPF já está cadastrado.' });
}


    await conn.query(
      `CALL SP_INSERT_PACIENTE_C_EMAIL(?, ?, ?, ?, ?, ?, ?)`,
      [nome, cpf, dataNascimento, sexo, rg, uf, email]
    );

    await conn.commit();
    res.status(201).json({ message: 'Paciente cadastrado com sucesso!' });

  } catch (error) {
    await conn.rollback();
    console.error('Erro ao registrar paciente:', error.message);
    res.status(500).json({ message: 'Erro ao registrar paciente.' });
  } finally {
    conn.release();
  }
};

exports.buscarPorCpf = async (req, res) => {
  const { cpf } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
          PF.IDPESSOAFIS,
          PF.CPFPESSOA,
          PF.NOMEPESSOA,
          PF.DATANASCPES,
          PF.SEXOPESSOA,
          E.EMAIL
       FROM PESSOAFIS PF
       INNER JOIN PESSOA P ON PF.ID_PESSOA = P.IDPESSOA
       LEFT JOIN EMAIL E ON E.ID_PESSOA = P.IDPESSOA
       WHERE PF.CPFPESSOA = ?`,
      [cpf]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    const paciente = rows[0];

    res.status(200).json({
      id: paciente.IDPESSOAFIS,
      nome: paciente.NOMEPESSOA,
      cpf: paciente.CPFPESSOA,
      dataNascimento: paciente.DATANASCPES,
      sexo: paciente.SEXOPESSOA,
      email: paciente.EMAIL
    });

  } catch (error) {
    console.error('Erro ao buscar paciente por CPF:', error.message);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
};


exports.listar = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          PC.IDPACIENTE,
          PF.IDPESSOAFIS,
          PF.CPFPESSOA AS cpf,
          PC.RGPACIENTE AS rg,
          PC.ESTDORGPAC AS uf,
          PF.NOMEPESSOA AS nome,
          PF.DATANASCPES AS dataNascimento,
          CASE PF.SEXOPESSOA
              WHEN 'F' THEN 'FEMININO'
              WHEN 'M' THEN 'MASCULINO'
              ELSE 'NAO LISTADO'
          END AS sexo,
          E.EMAIL AS email
      FROM PESSOAFIS PF
      INNER JOIN PESSOA P ON P.IDPESSOA = PF.ID_PESSOA
      LEFT JOIN EMAIL E ON P.IDPESSOA = E.ID_PESSOA
      INNER JOIN PACIENTE PC ON PC.ID_PESSOAFIS = PF.IDPESSOAFIS`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error.message);
    res.status(500).json({ message: 'Erro ao listar pacientes.' });
  }
};

