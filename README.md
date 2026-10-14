# DopexCreation — Premium Video Editor Portfolio

A production-ready, cinematic creative studio portfolio built for **DopexCreation** (**Aamir Saifi**), a professional video editor with 4+ years of experience.

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
- **Database:** Neon PostgreSQL (Vercel Integration)

---

## 🚀 Getting Started Locally

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env.local` file in the project root:
   ```env
   ADMIN_USERNAME=aamir@dopexcreation.com
   ADMIN_PASSWORD=dopexSecure99!
   ADMIN_SESSION_SECRET=your-secure-session-secret-here
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Studio Admin Portal

Manage your showreel videos, design showcases, and social channel accounts in real time:

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Username:** `aamir@dopexcreation.com`
- **Default Password:** `dopexSecure99!`

Features:
- Add, Edit, Hide, and Delete video showreels.
- Add, Edit, Hide, and Delete design showcase projects (with Behance links).
- Toggle social accounts and monitor database persistence status.

---

## 📦 Vercel Deployment Ready

1. Push your code to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Connect your free Neon PostgreSQL database or add the required Environment Variables in Vercel project settings:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Click **Deploy**.

---

## 🔍 Troubleshooting & Verification

- **Video Embed Unavailable:** Ensure YouTube video visibility is set to *Public* or *Unlisted*, and *Allow Embedding* is turned on.
- **Login Rate Limit:** If you attempt 5 failed logins within 15 minutes, IP rate-limiting engages automatically.

---

## 📄 License & Attribution

Designed and engineered for **DopexCreation** · **Aamir Saifi**.
All rights reserved.
