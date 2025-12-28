# Chonga Pessana - Portfolio Website

Website profissional de portfolio para Chonga Pessana - Cineasta, Fotógrafo e Skater.

## 🚀 Stack

- **Frontend:** Vue 3, Vite, Vue Router, Pinia
- **Backend:** Node.js, Express, MongoDB
- **Deploy:** Vercel (Frontend) + Render (Backend)

---

## 📦 Instalação Local

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 🌐 Deploy em Produção

### 1. Backend (Render)

1. Vai a [render.com](https://render.com) e cria uma conta
2. Clica em **"New +"** → **"Web Service"**
3. Conecta o repositório GitHub: `afonsoDomingos/chongapessana`
4. Configura:
   - **Name:** `chongapessana-api`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Adiciona as **Environment Variables:**
   - `MONGODB_URI` = (a tua string de conexão MongoDB Atlas)
   - `JWT_SECRET` = (uma chave secreta forte)
   - `PORT` = `10000`
6. Clica **"Create Web Service"**
7. Guarda a URL gerada (ex: `https://chongapessana-api.onrender.com`)

### 2. Frontend (Vercel)

1. Vai a [vercel.com](https://vercel.com) e cria uma conta
2. Clica em **"Add New..."** → **"Project"**
3. Importa o repositório GitHub: `afonsoDomingos/chongapessana`
4. Configura:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Adiciona as **Environment Variables:**
   - `VITE_API_URL` = `https://chongapessana-api.onrender.com` (URL do Render)
6. Clica **"Deploy"**

---

## ⚠️ Importante: Atualizar URLs da API

Depois do deploy, precisas substituir todas as URLs `http://localhost:5000` pelo URL de produção.

**Ficheiros a atualizar:**
- `client/src/store/auth.js`
- `client/src/views/Admin.vue`
- `client/src/views/Courses.vue`
- `client/src/views/Dashboard.vue`
- `client/src/views/Expo.vue`

**Ou** usa a variável de ambiente `VITE_API_URL` com o ficheiro `src/config/api.js`.

---

## 📁 Estrutura

```
chongapessana/
├── client/           # Frontend Vue.js
│   ├── public/       # Assets estáticos
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── store/
│   │   └── config/
│   └── vercel.json   # Config Vercel
│
├── server/           # Backend Node.js
│   ├── models/
│   ├── routes/
│   └── index.js
│
└── README.md
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=https://your-api.onrender.com
```

---

## 📞 Contacto

- **Chonga Pessana:** +258 86 849 7771
- **Agente (Vibe):** +258 84 787 7405
- **Email:** chongapessanask8@gmail.com

---

Desenvolvido por [Vibe (Afonso Domingos)](https://www.linkedin.com/in/afonso-domingos-6b59361a5/)
