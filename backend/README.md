# Backend API — monApp

Ce dossier contient le backend Node.js/Express pour l'application mobile.

## Structure du projet

```
/backend
  /src
    /controllers
    /models
    /routes
    /middlewares
    /utils
    app.js
  .env
  package.json
  README.md
```

## Installation

1. Initialiser le projet Node.js :
   ```bash
   npm init -y
   ```
2. Installer les dépendances principales :
   ```bash
   npm install express pg dotenv jsonwebtoken bcrypt cors multer
   ```
3. Pour le développement :
   ```bash
   npm install --save-dev nodemon
   ```

## Lancement

```bash
npm run dev
```

## À venir
- Connexion à PostgreSQL (Supabase ou autre)
- Authentification JWT
- Endpoints REST pour cours, audios, livres, utilisateurs, favoris, téléchargements
- Upload fichiers audio (optionnel) 