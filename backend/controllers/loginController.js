const pool   = require('../db');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 's3gr3d0_bem_forte';

exports.login = async (req, res) => {
  /* ------------------------------------------------------------------
     1) Entrada da requisição
  ------------------------------------------------------------------ */
  console.log('[LOGIN] Body recebido →', req.body);

  const { cpf, senha } = req.body;

  try {
    /* ------------------------------------------------------------------
       2) Consulta SQL
    ------------------------------------------------------------------ */
    const sql = `
      SELECT 
        PC.IDPACIENTE,
        PF.IDPESSOAFIS,
        PF.CPFPESSOA,
        PC.RGPACIENTE,
        PC.ESTDORGPAC,
        PF.NOMEPESSOA,
        PF.DATANASCPES,
        CASE PF.SEXOPESSOA
          WHEN 'F' THEN 'FEMININO'
          WHEN 'M' THEN 'MASCULINO'
          ELSE 'NAO LISTADO'
        END AS SEXO,
        E.EMAIL,
        U.SENHAUSUA                       -- hash da senha
      FROM PESSOAFIS PF
      INNER JOIN PESSOA   P ON P.IDPESSOA       = PF.ID_PESSOA
      LEFT  JOIN EMAIL    E ON P.IDPESSOA       = E.ID_PESSOA
      INNER JOIN PACIENTE PC ON PC.ID_PESSOAFIS = PF.IDPESSOAFIS
      INNER JOIN USUARIO  U ON U.ID_PESSOAFIS   = PF.IDPESSOAFIS
      WHERE PF.CPFPESSOA = ?;
    `;

    console.log('[LOGIN] Executando query …');

    const [pacienteRows] = await pool.query(sql, [cpf]);

    console.log(`[LOGIN] Resultado da query (${pacienteRows.length} linha[s]) →`, pacienteRows);

    /* ------------------------------------------------------------------
       3) Validação de existência
    ------------------------------------------------------------------ */
    if (pacienteRows.length === 0) {
      console.warn('[LOGIN] CPF não encontrado.');
      return res.status(404).json({ message: 'Paciente não encontrado.' });
    }

    const paciente = pacienteRows[0];

    /* ------------------------------------------------------------------
       4) LOG DA SENHA (hash) OBTIDA
    ------------------------------------------------------------------ */
    console.log('[LOGIN] Hash de senha obtido →', paciente.SENHAUSUA);

    /* ------------------------------------------------------------------
       5) Verificação da senha
    ------------------------------------------------------------------ */
    console.log('[LOGIN] Senha digitada:', senha);
    console.log('[LOGIN] Hash armazenado:', paciente.SENHAUSUA);

    const senhaCorreta = await bcrypt.compare(senha, paciente.SENHAUSUA);
    console.log('[LOGIN] Senha correta?', senhaCorreta);

  
    if (!senhaCorreta) {
      console.warn('[LOGIN] CPF ou senha inválidos.');
      return res.status(401).json({ message: 'CPF ou senha inválidos.' });
    }

    /* ------------------------------------------------------------------
       6) Geração do token (JWT)
    ------------------------------------------------------------------ */
    const token = jwt.sign(
      { idPaciente: paciente.IDPACIENTE, cpf: paciente.CPFPESSOA },
      secret,
      { expiresIn: '8h' }
    );

    /* ------------------------------------------------------------------
       7) Resposta bem-sucedida
    ------------------------------------------------------------------ */
    const resposta = {
      token,
      paciente: {
        id:             paciente.IDPACIENTE,
        nome:           paciente.NOMEPESSOA,
        cpf:            paciente.CPFPESSOA,
        dataNascimento: paciente.DATANASCPES,
        sexo:           paciente.SEXO,
        email:          paciente.EMAIL
      }
    };

    console.log('[LOGIN] Autenticação bem-sucedida →', resposta);
    res.json(resposta);

  } catch (error) {
    console.error('[LOGIN] Erro inesperado →', error);
    res.status(500).json({ message: 'Erro no login.' });
  }
};