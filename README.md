# KNOX CLIENT - Webmode Dashboard

A complete frontend replica of the KNOX gaming client, featuring a license verification screen, a user dashboard, and a local admin panel.

## Features
- **License Verification:** Glassmorphism UI with video background.
- **Client Dashboard:** Home (Countdown timer, Device info), Features (Interactive UI toggles), Manage (Update logs, Community links).
- **Admin Panel (`admin.html`):** Frontend-only LocalStorage CRUD operations to generate and manage demo license keys.
- **Responsive:** Fully optimized for Android/mobile browsers and desktop.

## 🚀 How to Deploy on GitHub Pages

1. **Create a GitHub Repository:** 
   - Go to GitHub and create a new public repository (e.g., `knox-client`).
   
2. **Upload Files:**
   - Clone the repo to your local machine.
   - Upload the `index.html`, `admin.html`, the `css` folder, and the `js` folder. Ensure the file structure matches exactly.

3. **Enable GitHub Pages:**
   - Go to your repository **Settings**.
   - Scroll down to the **Pages** section (on the left menu).
   - Under **Build and deployment**, select `Deploy from a branch`.
   - Select the `main` (or `master`) branch and the `/ (root)` folder.
   - Click **Save**.

4. **Access Your Site:**
   - Wait 1-2 minutes. Refresh the Pages settings tab. You will see a link like: `https://yourusername.github.io/knox-client/`

## 🛠 How to use the Admin Panel

Because this is a purely static frontend website (no backend/Node.js), license keys are stored in your browser's `localStorage`. 
1. Open your deployed website.
2. Go to `https://yourusername.github.io/knox-client/admin.html`
3. Use the UI to generate new keys (e.g., `KNOX-ABCD-1234`).
4. Go back to the main page (`index.html`), and log in using the key you just generated.

## ⚠️ IMPORTANT: Frontend Security Note
This project uses `LocalStorage` for demonstration purposes. **Do not use this for a commercial production release.** 
In a real environment, any user can open Developer Tools (F12) and see/modify the local database. To make this production-ready, you must replace the LocalStorage logic in `js/app.js` and `admin.html` with API calls to a real backend (e.g., Node.js/Express, PHP, or Firebase/Supabase).

## 🎨 Design Credits
- **Fonts:** Oxanium, Rajdhani, Space Mono (Google Fonts).
- **Background Video:** Provided via GitHub raw links.
- **UI:** Recreated based on high-fidelity industrial dark theme gaming concepts.
