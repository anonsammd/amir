# DopexCreation — Premium Video Editor Portfolio

A production-ready, cinematic creative studio portfolio built for **DopexCreation** (**Amir Saifi**), a professional video editor with 4+ years of experience.

Designed with a bold Gen-Z aesthetic using Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and GitHub-backed JSON persistence.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Theme palette: Deep Black `#050505`, Surface `#101010`, Brand Red `#FF3030`)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Validation:** React Hook Form & Zod
- **Persistence:** GitHub REST API with local JSON fallback (`data/projects.json` & `data/accounts.json`)
- **Security:** HTTP-only JWT sessions (`jose`) + `bcryptjs` password hashing
- **Hosting:** Vercel

---

## 📋 Prerequisites

- **Node.js:** v18.17.0 or later (v20+ or v24+ recommended)
- **Package Manager:** `npm` (v9+)

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies

```powershell
npm install
```

### 2. Configure Local Environment Variables

Create `.env.local` in the project root:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$xmCR1qJ2z1ktYSjZsxM2xu0AoqH70gQI1D3N5YqZkLXpbJiYUSI0O
ADMIN_SESSION_SECRET=dopexcreation-super-secret-session-key-32chars!
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_CONTACT_EMAIL=contact@dopexcreation.com
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/dopexcreation
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@dopexcreation
```

*Default admin login:*
- **Username:** `admin`
- **Password:** `dopexadmin2025`

### 3. Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Admin Portal (`/admin`)

Access the admin dashboard at: [http://localhost:3000/admin](http://localhost:3000/admin)

### How to Generate a Custom Password Hash
Run this command in PowerShell/Terminal:

```powershell
node -e "console.log(require('bcryptjs').hashSync('YourNewSecretPassword', 10));"
```

Copy the generated `$2b$10$...` hash into `ADMIN_PASSWORD_HASH`.

---

## 📦 Setting Up GitHub Persistence

To persist project and social channel updates across Vercel deployments:

1. **Create/Use a GitHub Repository:**
   Push this codebase to a GitHub repository (e.g. `your-username/dopexcreation-portfolio`).

2. **Generate a Fine-Grained Personal Access Token:**
   - Go to GitHub -> **Settings** -> **Developer Settings** -> **Personal Access Tokens** -> **Fine-grained tokens**.
   - Select your portfolio repository.
   - Set **Repository permissions** -> **Contents**: `Read and write`.
   - Copy the token (`ghp_...`).

3. **Set GitHub Environment Variables:**
   In `.env.local` or Vercel Environment Variables:

   ```env
   GITHUB_TOKEN=ghp_your_token_here
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=dopexcreation-portfolio
   GITHUB_BRANCH=main
   GITHUB_PROJECTS_PATH=data/projects.json
   GITHUB_ACCOUNTS_PATH=data/accounts.json
   ```

When configured, every add/edit action in `/admin` commits directly to `data/projects.json` or `data/accounts.json` via GitHub REST API with optimistic concurrency control.

---

## 📺 Uploading YouTube Videos & Managing Showreels

All portfolio videos are hosted on YouTube in **9:16 vertical format** (YouTube Shorts or standard videos).

### How to Add a Showreel in `/admin`:
1. Upload your video edit to YouTube.
2. In YouTube settings, ensure **Allow embedding** is enabled under *Advanced Settings*.
3. Copy the video link or Shorts URL (e.g., `https://www.youtube.com/shorts/5E4q3_Lq328`).
4. Log into `/admin` -> Click **Add Showreel**.
5. Paste the link. The admin panel automatically normalizes the 11-character YouTube ID and renders a **live 9:16 card preview**.
6. Set Title, Category (e.g. `EVENT`, `CINEMATIC`, `CAMPUS`), and click **Save Project**.

> **Note on Deletion Policy:**
> Deleting portfolio items permanently is strictly prohibited. To hide an item from public view, toggle the **Hidden** setting in `/admin`.

---

## 🚀 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the required Environment Variables in Vercel project settings:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `ADMIN_SESSION_SECRET`
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `GITHUB_BRANCH`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://dopexcreation.com`)
   - `NEXT_PUBLIC_CONTACT_EMAIL`
4. Click **Deploy**.

---

## 🔍 Troubleshooting & Verification

- **Video Embed Unavailable:** Ensure YouTube video visibility is set to *Public* or *Unlisted*, and *Allow Embedding* is turned on.
- **Login Rate Limit:** If you attempt 5 failed logins within 15 minutes, IP rate-limiting engages automatically.
- **GitHub Sync Error:** Verify your `GITHUB_TOKEN` has `Contents: Read & write` permission on the targeted repository.

---

## 📄 License & Attribution

Designed and engineered for **DopexCreation** · **Amir Saifi**.
All rights reserved.
