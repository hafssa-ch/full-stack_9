# TP9 – Authentification et autorisation avec Node.js, Express, MongoDB et Redis

## 📌 Description

Ce projet implémente deux systèmes d’authentification complets :

- **Authentification par sessions** (stockées en mémoire ou Redis)
- **Authentification sans état avec JWT** (access token + refresh token HTTP‑only)

Il inclut la gestion des rôles (`user` / `admin`), le hachage sécurisé des mots de passe (`bcrypt`), la protection contre les attaques courantes (rate limiting, injection NoSQL, XSS basique) et une API REST documentée.

## 🛠️ Technologies utilisées

- Node.js + Express 4
- MongoDB (avec Mongoose)
- Redis (optionnel pour les sessions)
- bcrypt, jsonwebtoken, express-session
- helmet, express-rate-limit, cookie-parser
- dotenv pour les variables d’environnement

## 📁 Structure du projet
```
uth-express-demo/
├── config/
│ └── db.js # Connexion MongoDB
├── controllers/
│ └── authController.js # Logique métier
├── middlewares/
│ ├── auth.js # isAuthenticated, authorize
│ └── errorHandler.js # Gestion centralisée des erreurs
├── models/
│ └── User.js # Modèle utilisateur (hachage bcrypt)
├── routes/
│ └── authRoutes.js # Définition des endpoints
├── utils/
│ └── tokenUtils.js # Génération et vérification JWT
├── .env # Variables sensibles (ignoré)
├── .env.example
├── server.js
└── package.json
```

## 🔐 Endpoints de l’API

### Authentification par session

Méthode	Endpoint	Description	Authentification
POST	/api/auth/register-session	Inscription d’un utilisateur	Non
POST	/api/auth/login-session	Connexion (crée un cookie de session)	Non
GET	/api/auth/logout-session	Déconnexion (détruit la session)	Oui (session)
GET	/api/auth/profile-session	Récupère le profil	Oui (session)
GET	/api/auth/admin-only-session	Accès réservé aux administrateurs	Oui (session + rôle admin)
Authentification JWT
Méthode	Endpoint	Description	Authentification
POST	/api/auth/register-jwt	Inscription + génération tokens	Non
POST	/api/auth/login-jwt	Connexion (access token + refresh token HTTP‑only)	Non
GET	/api/auth/logout-jwt	Déconnexion (invalide refresh token)	Oui (cookie)
GET	/api/auth/refresh-token	Obtient un nouvel access token	Oui (cookie)
GET	/api/auth/profile-jwt	Récupère le profil	Oui (Bearer token)
GET	/api/auth/admin-only-jwt	Accès administrateur	Oui (Bearer token + rôle admin)

🧪 Tests complets avec curl
Prérequis : un terminal cmd ou bash
Remarque : les cookies sont automatiquement gérés avec -c (save) et -b (load).

1. Sessions
Inscription
bash
curl -X POST http://localhost:3000/api/auth/register-session -H "Content-Type: application/json" -d "{\"username\":\"alice\",\"email\":\"alice@example.com\",\"password\":\"alice123\"}" -c cookies.txt
Connexion
bash
curl -X POST http://localhost:3000/api/auth/login-session -H "Content-Type: application/json" -d "{\"email\":\"alice@example.com\",\"password\":\"alice123\"}" -b cookies.txt -c cookies.txt
Profil
bash
curl -X GET http://localhost:3000/api/auth/profile-session -b cookies.txt
Accès admin (avant changement de rôle → 403)
bash
curl -X GET http://localhost:3000/api/auth/admin-only-session -b cookies.txt
Déconnexion
bash
curl -X GET http://localhost:3000/api/auth/logout-session -b cookies.txt
2. Changer le rôle d’un utilisateur (MongoDB)
Depuis un shell MongoDB (ou Compass) :

bash
docker exec -it mongodb-container mongosh
use auth_demo
db.users.updateOne({ username: "alice" }, { $set: { role: "admin" } })
Reconnectez-vous puis testez à nouveau /admin-only-session → succès.

3. JWT
Inscription JWT
bash
curl -X POST http://localhost:3000/api/auth/register-jwt -H "Content-Type: application/json" -d "{\"username\":\"bob\",\"email\":\"bob@example.com\",\"password\":\"bob123\"}" -c jwtCookies.txt
→ La réponse contient accessToken. Conservez‑le.

Connexion JWT
bash
curl -X POST http://localhost:3000/api/auth/login-jwt -H "Content-Type: application/json" -d "{\"email\":\"bob@example.com\",\"password\":\"bob123\"}" -c jwtCookies.txt
Profil (remplacer TOKEN_RECU)
bash
curl -X GET http://localhost:3000/api/auth/profile-jwt -H "Authorization: Bearer TOKEN_RECU"
Rafraîchir le token
bash
curl -X GET http://localhost:3000/api/auth/refresh-token -b jwtCookies.txt
Déconnexion JWT
bash
curl -X GET http://localhost:3000/api/auth/logout-jwt -b jwtCookies.txt
4. Sécurité : rate limiting
Envoyez 6 mauvaises tentatives de connexion (session ou JWT) :

bash
for /l %i in (1,1,6) do curl -X POST http://localhost:3000/api/auth/login-session -H "Content-Type: application/json" -d "{\"email\":\"alice@example.com\",\"password\":\"wrong\"}"
À la 6e tentative, vous recevez :

json
{"success":false,"message":"Trop de tentatives, réessayez dans 15 minutes"}
5. Protection contre l’injection NoSQL
Inscription avec un nom d’utilisateur contenant $ :

bash
curl -X POST http://localhost:3000/api/auth/register-session -H "Content-Type: application/json" -d "{\"username\":\"$admin\",\"email\":\"admin@test.com\",\"password\":\"pass\"}"
Le middleware maison supprime les caractères $ et ., l’inscription réussit avec le nom admin.

✅ Checklist des fonctionnalités validées
Fonctionnalité	Statut
Inscription session	✔️
Connexion session	✔️
Profil session	✔️
Déconnexion session	✔️
Route protégée admin (session)	✔️
Inscription JWT	✔️
Connexion JWT (access + refresh token)	✔️
Profil JWT (Bearer token)	✔️
Refresh token	✔️
Déconnexion JWT (invalidation)	✔️
Changement de rôle (MongoDB)	✔️
Rate limiting (5 tentatives)	✔️
Anti‑injection NoSQL	✔️
Hachage bcrypt (mots de passe)	✔️

