# AIrtistic – Spațiu Web Interactiv pentru Expoziții Artistice

**Autor:** Miruna-Ioana Călugăr  
**Coordonator științific:** Conf. dr.ing. Adriana Albu  
**Lucrare de diplomă – UPT, Facultatea de Automatică și Calculatoare**  
**Sesiunea:** Iulie 2025

---

## Descriere

**AIrtistic** este o aplicație web interactivă care folosește inteligența artificială (AI) pentru a genera artă digitală pornind de la descrieri textuale introduse de utilizatori. Platforma permite exprimarea creativă, partajarea lucrărilor în galerie și explorarea contribuțiilor altor utilizatori, având ca scop democratizarea procesului artistic și stimularea creativității digitale în rândul tinerilor.

---

## Repository proiect

**GitHub:** [https://github.com/mirunaCalugar/AIrtistic](https://github.com/mirunaCalugar/AIrtistic)

---

## Structura livrabilă

Repository-ul conține:

- Codul sursă complet (frontend + backend)
- Fişiere de configurare (ex: `.env.example`, `package.json`, `vite.config.js`)
- Fișiere SQL pentru structura bazei de date
- Documentație tehnică și ghid de utilizare
- Nu conține fișiere binare compilate

---

## Tehnologii utilizate

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Bază de date:** PostgreSQL
- **Serviciu AI extern:** OpenAI DALL·E API
- **Autentificare:** JWT (JSON Web Tokens)

---

## Pași de compilare și rulare

### 1. Clonare repository

```bash
git clone https://github.com/mirunaCalugar/AIrtistic.git
cd airtistic
```

### 2. Configurare mediu

#### a. Backend (`/backend`)

```bash
cd backend
npm install
cp .env.example .env

```

#### b. Frontend (`/airtistic`)

```bash
cd ../airtistic
npm install
```

### 3. Bază de date

- Creează o bază de date PostgreSQL
- Rulează scripturile SQL din `server/db/init.sql` (sau fișierul furnizat)

---

## Lansare aplicație

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd cd airtistic
npm run dev
```

Aplicația va fi disponibilă implicit la:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Resurse suplimentare

- [Documentația DALL·E API](https://platform.openai.com/docs/guides/images)
- [React (Vite) Docs](https://vitejs.dev/guide/)
- [Node.js + Express Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## Notă

Acest proiect este realizat în scop educațional și academic, în cadrul Facultății de Automatică și Calculatoare, Universitatea Politehnica Timișoara.

---
