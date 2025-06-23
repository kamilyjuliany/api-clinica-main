const pool = require('../db');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  const { cpf, senha } = req.body;

  try {
    // Buscar paciente pelo CPF
    const [pacienteRows] = await pool.query(
      `SELECT 
          PC.IDPACIENTE,
          PF.IDPESSOAFIS,
          PF.CPFPESSOA,
          PC.RGPACIENTE,
          PC.ESTDORGPAC,
          PF.NOMEPESSOA,
          PF.DATANASCPES,
          PF.SEXOPESSOA,
          E.EMAIL,
          U.SENHAUSU
      FROM PESSOAFIS PF
      INNER JOIN PESSOA P
          ON P.IDPESSOA = PF.ID_PESSOA
      LEFT JOIN EMAIL E
          ON P.IDPESSOA = E.ID_PESSOA
      INNER JOIN PACIENTE PC
          ON PC.ID_PESSOAFIS = PF.IDPESSOAFIS
      INNER JOIN USUARIO U
          ON U.ID_PESSOA = P.IDPESSOA
      WHERE PF.CPFPESSOA = ?`,
      [cpf]
    );

    if (pacienteRows.length === 0) {
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    const paciente = pacienteRows[0];

    // Validar senha (com campo correto da tabela USUARIO)
    const senhaCorreta = await bcrypt.compare(senha, paciente.SENHAUSU);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'CPF ou senha inválidos.' });
    }

    // Retornar dados do paciente (sem senha)
    res.json({
      paciente: {
        id: paciente.IDPACIENTE,
        nome: paciente.NOMEPESSOA,
        cpf: paciente.CPFPESSOA,
        dataNascimento: paciente.DATANASCPES,
        sexo: paciente.SEXOPESSOA === 'F' ? 'FEMININO' : (paciente.SEXOPESSOA === 'M' ? 'MASCULINO' : 'NAO LISTADO'),
        email: paciente.EMAIL
      }
    });

  } catch (error) {
    console.error('Erro no login:', error.message);
    res.status(500).json({ message: 'Erro no login.' });
  }
};
