This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

![Screenshot](images/mainpage.png)

# TinyLink – URL Shortener

TinyLink is a minimal and functional URL shortening service similar to bit.ly.  
It allows users to create short links, view statistics, delete links, and perform redirects.

This project is built using **Next.js (App Router)**, **Prisma**, **PostgreSQL**, and **Tailwind CSS**.

---

## 📌 Assignment Requirements (Completed)

- ✔ Build a working URL shortener  
- ✔ Use Next.js (as suggested)  
- ✔ Clean UI with proper states  
- ✔ Publish a **live deployed URL**  
- ✔ Public GitHub repository  
- ✔ Provide a demo walkthrough video  
- ✔ Provide ChatGPT transcript  
- ✔ Follow exact API contract and route conventions  
- ✔ Implement Dashboard, Stats page, Redirect route, Health check  

---

# 🚀 Features

### 🔗 URL Shortening  
- Add a long URL  
- Optionally provide a custom short code  
- Validate URL format  
- Code uniqueness enforced (409 on duplicate)

### ↪ Redirect  
- Visiting `/code` → performs **302 redirect**  
- Increments click count  
- Updates last clicked timestamp

### ❌ Delete  
- Delete short links  
- After deletion, `/code` must return **404**

### 📊 Dashboard  
Shows all links with:  
- Code  
- Long URL  
- Total clicks  
- Last clicked  
- Delete action  

### 📈 Stats Page  
`/code/:code` → View:  
- Code  
- Full URL  
- Total clicks  
- Last clicked  

### ❤️ Health Check  
`/healthz` → returns:  
```json
{ "ok": true, "version": "1.0" }


🛠️ Tech Stack

Next.js 14 (App Router)

React

TypeScript

Prisma ORM

PostgreSQL (Neon / Supabase / Railway)

Tailwind CSS v4

Vercel Hosting

📂 Project Structure
/app
 │── page.tsx               → Dashboard
 │
 ├── /api
 │     ├── /links
 │     │      └── route.ts  → POST (create), GET (list)
 │     │
 │     └── /links/[code]
 │             └── route.ts → GET (stats), DELETE (remove)
 │
 ├── /code/[code]
 │       └── page.tsx       → Stats page UI
 │
 ├── /healthz
 │       └── route.ts       → Health check
 │
/prisma
 └── schema.prisma          → Database Schema

🧪 API Documentation
✔ POST /api/links — Create Short Link
Request Body
{
  "url": "https://example.com",
  "code": "custom12"
}

Responses

201 Created

{
  "message": "Short link created",
  "shortCode": "custom12"
}


409 Conflict

{ "error": "Code already exists" }

✔ GET /api/links — List All Links

Returns array of all links.

✔ GET /api/links/:code — Get Stats

Success:

{
  "code": "abc123",
  "url": "https://example.com",
  "clicks": 5,
  "lastClicked": "2025-02-18T10:00:23.000Z"
}


404:

{ "error": "Code not found" }

✔ DELETE /api/links/:code — Delete a Link

Success:

{ "message": "Deleted successfully" }


404:

{ "error": "Not found" }

🔄 Redirect Route

Path:

/:code


Behavior:

If code exists → 302 redirect

If not → 404 Not Found

❤️ Health Check Endpoint

GET /healthz
Returns:

{ "ok": true, "version": "1.0" }

🛠️ Environment Variables

Create .env file:

DATABASE_URL="Your_Postgres_Connection_String"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"


Also include .env.example in repo:

DATABASE_URL=
NEXT_PUBLIC_BASE_URL=

