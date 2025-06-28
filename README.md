# 🗓️ Fasiclin - Sistema de Agendamento de Pacientes

Sistema completo de agendamento de pacientes para consulta, desenvolvido como projeto acadêmico com Node.js, React Native e MySQL.

## 🚀 Tecnologias

- **Backend**: Node.js, Express, MySQL
- **Frontend**: React Native (Expo), Axios
- **Banco de Dados**: MySQL

## 🧱 Estrutura de Diretórios

```
api-clinica-main-main/
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── assets/
│   ├── components/
│   ├── screens/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── index.js
│   ├── app.json
│   ├── package.json
│   └── package-lock.json
│
├── .env
├── .gitattributes
├── .gitignore
├── README.md
```

## ⚙️ Instalação

### 🔧 Backend

1. Acesse a pasta:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente no arquivo `.env` (já incluído).

4. Inicie o servidor:

```bash
node server.js
```

### 📱 Frontend (Expo)

1. Acesse a pasta:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o app com o Expo:

```bash
npx expo start
```

> ⚠️ Altere o IP da API dentro dos arquivos de serviço (como em `axios.create(...)`) caso necessário.

## 🔐 Autenticação

- Utiliza tokens e middlewares (`middlewares/auth.js`) para proteger rotas.
- Login validado via backend com sessão mantida no app.

## ✨ Funcionalidades

✅ Login e autenticação com token  
✅ Cadastro e listagem de pacientes, profissionais, consultas e especialidades  
✅ Agendamento com seleção de profissional, especialidade, procedimentos, hora e data   
✅ Interface mobile com React Native  
✅ Separação clara entre backend e frontend  

## 📦 Geração de APK (Expo)

Para gerar um APK de produção:

```bash
eas build --platform android
```

> ⚠️ Se estiver usando HTTP (sem HTTPS), adicione no `app.json`:

```json
"plugins": [
  [
    "expo-build-properties",
    {
      "android": {
        "usesCleartextTraffic": true
      }
    }
  ]
]
```

## 👨‍💻 Autor

Juliany Kamily  
Projeto desenvolvido para fins acadêmicos  
Faculdade FASIPE Cuiabá - FASICLIN
