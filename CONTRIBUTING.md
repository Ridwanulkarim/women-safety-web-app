# Contributing to SafeHaven 🛡️

Thank you for your interest in contributing to **SafeHaven**! Our mission is to build reliable, real-time safety, emergency response, and community distress alert tools for women and vulnerable individuals.

Every contribution—whether reporting a bug, improving documentation, or submitting a feature pull request—helps make communities safer.

---

## 📋 Code of Conduct

We are dedicated to providing a welcoming, safe, and harassment-free environment for all contributors. Please treat everyone with kindness, empathy, and professional respect.

---

## 🛠️ Development Setup

To run SafeHaven locally on your computer:

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/Ridwanulkarim/women-safety-web-app.git
cd women-safety-web-app
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and provide the necessary Firebase, Leaflet/Map, and backend connection keys:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

---

## 🔄 Pull Request (PR) Workflow

We follow standard GitHub Flow for managing changes:

1. **Fork or Branch**:
   Create a descriptive branch for your work:
   ```bash
   git checkout -b feature/amazing-feature
   # or for bug fixes:
   git checkout -b fix/issue-description
   ```

2. **Commit Conventions**:
   Write clear, concise commit messages following standard conventional commits:
   - `feat:` for new capabilities or UI components
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `style:` for formatting, missing semicolons, etc.
   - `refactor:` for code restructuring without feature changes
   - `test:` for adding or updating test cases

3. **Verify Locally**:
   Ensure the application builds and runs without errors:
   ```bash
   npm run build
   ```

4. **Submit Pull Request**:
   - Push your branch to GitHub.
   - Open a PR against the `main` branch.
   - Fill out the PR description with the motivation, changes made, and any testing performed.

---

## 🔒 Security Vulnerabilities

Please **do not** open public GitHub issues for security vulnerabilities. Instead, refer to our [SECURITY.md](SECURITY.md) policy and email the maintainer directly at `ridwanulk08@gmail.com`.

---

## 📄 License & Maintainer

Maintained with ❤️ by **[Ridwanul Karim](https://github.com/Ridwanulkarim)**.
All contributions become part of the open SafeHaven community effort.
