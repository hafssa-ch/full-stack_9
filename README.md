# 🔐 TP9 – Authentification et autorisation avec Node.js, Express, MongoDB et Redis

## 📌 Description

Ce projet implémente deux systèmes complets d’authentification et d’autorisation :

- ✅ Authentification par **sessions**
- ✅ Authentification **JWT** (JSON Web Token)
- ✅ Gestion des rôles (`user` / `admin`)
- ✅ Hachage sécurisé des mots de passe avec `bcrypt`
- ✅ Protection contre plusieurs attaques courantes :
  - Rate limiting
  - Injection NoSQL
  - XSS basique
- ✅ API REST sécurisée et organisée

Le projet utilise **Node.js**, **Express**, **MongoDB** .

---

# 🛠️ Technologies utilisées

- Node.js
- Express.js
- MongoDB + Mongoose
- bcrypt
- jsonwebtoken
- express-session
- helmet
- express-rate-limit
- cookie-parser
- dotenv

---

# 📁 Structure du projet

```
auth-express-demo9/
├── config/
│   └── db.js
│
├── controllers/
│   └── authController.js
│
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── authRoutes.js
│
├── utils/
│   └── tokenUtils.js
│
├── .env
├── .env.example
├── package.json
└── server.js
```

---

# ⚙️ Installation du projet

## 1️⃣ Cloner le projet

```bash
git clone <URL_DU_REPO>
cd auth-express-demo
```

---

## 2️⃣ Installer les dépendances

```bash
npm install
```

---

## 3️⃣ Configurer les variables d’environnement

Créer un fichier `.env` :

```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/auth_demo

SESSION_SECRET=mySessionSecret

JWT_ACCESS_SECRET=myAccessSecret
JWT_REFRESH_SECRET=myRefreshSecret

NODE_ENV=development
```

---

## 4️⃣ Lancer MongoDB

### Avec Docker

```bash
docker run -d \
  --name mongodb-container \
  -p 27017:27017 \
  mongo
```

---

## 5️⃣ Lancer le serveur

```bash
npm start
```

Le serveur démarre sur :

```bash
http://localhost:3000
```

<img width="527" height="138" alt="image" src="https://github.com/user-attachments/assets/30566c38-5b35-4675-a0d3-cdeb57d82edd" />

---

# 🔐 Authentification par Sessions

## 📌 Endpoints

| Méthode | Endpoint | Description | Protection |
|---|---|---|---|
| POST | `/api/auth/register-session` | Inscription utilisateur | pas mal |
| POST | `/api/auth/login-session` | Connexion | pas mal |
| GET | `/api/auth/logout-session` | Déconnexion |  Session |
| GET | `/api/auth/profile-session` | Profil utilisateur |  Session |
| GET | `/api/auth/admin-only-session` | Accès administrateur |  Admin |

---

# 🔑 Authentification JWT

## 📌 Endpoints

| Méthode | Endpoint | Description | Protection |
|---|---|---|---|
| POST | `/api/auth/register-jwt` | Inscription + tokens | pas mal |
| POST | `/api/auth/login-jwt` | Connexion JWT | pas mal |
| GET | `/api/auth/logout-jwt` | Déconnexion JWT | bon |
| GET | `/api/auth/refresh-token` | Nouveau access token |  Cookie |
| GET | `/api/auth/profile-jwt` | Profil utilisateur |  Bearer Token |
| GET | `/api/auth/admin-only-jwt` | Accès administrateur |  Admin |

---

# 🧪 Tests avec CURL

---

# 1️⃣ Sessions

## 🔹 Inscription

```bash
curl -X POST http://localhost:3000/api/auth/register-session \-H "Content-Type: application/json" \-d "{\"username\":\"hafssachk\",\"email\":\"hafssachk@gmail.com\",\"password\":\"hafssa123\"" \-c cookies.txt
```

---

## 🔹 Connexion

```bash
curl -X POST http://localhost:3000/api/auth/login-session \
-H "Content-Type: application/json" \-d "{\"email\":\"hafssachk@gmail.com\",\"password\":\"hafssa123\"}" \-b cookies.txt -c cookies.txt
```

---

## 🔹 Profil utilisateur

```bash
curl -X GET http://localhost:3000/api/auth/profile-session \
-b cookies.txt
```

---

## 🔹 Accès administrateur

```bash
curl -X GET http://localhost:3000/api/auth/admin-only-session \
-b cookies.txt
```

---

## 🔹 Déconnexion

```bash
curl -X GET http://localhost:3000/api/auth/logout-session \
-b cookies.txt
```
<img width="952" height="398" alt="image" src="https://github.com/user-attachments/assets/a92d68e4-513e-4426-9ce0-0752e0afaf18" />

---

# 2️⃣ Changer le rôle utilisateur

Ouvrir MongoDB :

```bash
docker exec -it mongodb-container mongosh
```

Puis :

```javascript
use auth_demo

db.users.updateOne(
  { username: "hafssachk" },
  { $set: { role: "admin" } }
)
```

Reconnectez-vous puis testez à nouveau :

```bash
/admin-only-session
```
<img width="953" height="437" alt="image" src="https://github.com/user-attachments/assets/ed8ec973-ccc7-446a-b9a7-f011ae61368f" />

---

# 3️⃣ JWT

## 🔹 Inscription JWT

```bash
curl -X POST http://localhost:3000/api/auth/register-jwt \
-H "Content-Type: application/json" \
-d "{\"username\":\"bob\",\"email\":\"bob@example.com\",\"password\":\"bob123\"}" \
-c jwtCookies.txt
```

---

## 🔹 Connexion JWT

```bash
curl -X POST http://localhost:3000/api/auth/login-jwt \
-H "Content-Type: application/json" \
-d "{\"email\":\"bob@example.com\",\"password\":\"bob123\"}" \
-c jwtCookies.txt
```

---

## 🔹 Profil JWT

```bash
curl -X GET http://localhost:3000/api/auth/profile-jwt \
-H "Authorization: Bearer TOKEN_RECU"
```

---

## 🔹 Rafraîchir le token

```bash
curl -X GET http://localhost:3000/api/auth/refresh-token \
-b jwtCookies.txt
```

---

## 🔹 Déconnexion JWT

```bash
curl -X GET http://localhost:3000/api/auth/logout-jwt \
-b jwtCookies.txt
```

<img width="953" height="323" alt="image" src="https://github.com/user-attachments/assets/cce83541-49a7-4755-bf3e-7093a9b9db92" />

---

# 🛡️ Sécurité

## ✅ Rate Limiting

Après plusieurs mauvaises tentatives :

```bash
for /l %i in (1,1,6) do curl -X POST http://localhost:3000/api/auth/login-session \-H "Content-Type: application/json" \-d "{\"email\":\"alice@example.com\",\"password\":\"wrong\"}"
```

Réponse :

```json
{
  "success": false,
  "message": "Trop de tentatives, réessayez dans 15 minutes"
}
```
<img width="955" height="271" alt="image" src="https://github.com/user-attachments/assets/db27f94f-fffa-4a0c-b757-59fba0132f55" />

---

## ✅ Protection contre l’injection NoSQL

Test :

```bash
curl -X POST http://localhost:3000/api/auth/register-session \-H "Content-Type: application/json" \-d "{\"username\":\"$admin\",\"email\":\"admin@test.com\",\"password\":\"pass\"}"
```

Le middleware supprime automatiquement :

- `$`
- `.`

Résultat :

```bash
admin
```

---

# 🔒 Sécurité implémentée

| Fonctionnalité | Statut |
|---|---|
| Hachage bcrypt | ✅ |
| Sessions sécurisées | ✅ |
| JWT Access Token | ✅ |
| JWT Refresh Token | ✅ |
| Cookies HTTP-only | ✅ |
| Protection NoSQL Injection | ✅ |
| Rate Limiting | ✅ |
| Helmet Security Headers | ✅ |
| Gestion des rôles | ✅ |
| Middleware d’authentification | ✅ |

---

# 📌 Exemple de workflow

## 🔹 Session

```text
Register → Login → Session Cookie → Protected Route → Logout
```

## 🔹 JWT

```text
Register/Login → Access Token + Refresh Token
→ Protected Route
→ Refresh Token
→ Logout
```

---

# 🚀 Améliorations possibles

- Utilisation de Redis pour stocker les sessions
- Blacklist des JWT
- Vérification email
- Réinitialisation mot de passe
- OAuth2 / Google Login
- Double authentification (2FA)

---

# 👨‍💻 Auteur

TP9 réalisé par :
HAFSSA CHKOUKED

Encadré par :
Pr.Lachgar

---
