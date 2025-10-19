
---

````markdown
<div align="center">

# 🤠 **Bounty Hunter's Call**  
### 🎰 *Provably Fair Slot Game*

![Bounty Hunter's Call Gameplay](client/src/assets/screenshot.png)

> 🪙 *A Wild West–themed, entertainment-only slot game built with modern web technologies and a provably fair system ensuring transparent outcomes for every spin.*

---

### 👨‍💻 Author  
**Ranjit Nath**  
📧 [imranjitnath@gmail.com](mailto:imranjitnath@gmail.com)

---

</div>

## 🌵 Overview
**Bounty Hunter's Call** is a feature-rich, **provably fair slot game** set in a gritty Wild West universe.  
It delivers a thrilling and immersive gaming experience — complete with rich animations, responsive design, sound effects, and a transparent outcome verification system.  
This is a **non-gambling entertainment project**, built purely for fun and educational purposes.

---

## ✨ Features
- ✅ **Provably Fair System** — Built with a secure SHA-256 HMAC commit-reveal system to guarantee unbiased outcomes.  
- ✅ **Fully Responsive Layout** — Works flawlessly across mobile, tablet, and desktop screens.  
- ✅ **Immersive Audio Design** — Background music and sound effects with full volume control.  
- ✅ **Smooth Animations** — Framer Motion–powered spin reels and win highlights.  
- ✅ **Clean Modular Codebase** — Organized using React Hooks (`useSlotMachine`, `useAudio`) and reusable UI components.  
- ✅ **Modern Stack** — Powered by React, Vite, TypeScript, and Node.js for high performance and scalability.

---

## 🛠️ Tech Stack

| Frontend | Backend |
|-----------|----------|
| ⚛️ [React](https://reactjs.org/) | 🟩 [Node.js](https://nodejs.org/) |
| ⚡ [Vite](https://vitejs.dev/) | 🚀 [Express.js](https://expressjs.com/) |
| 🧩 [TypeScript](https://www.typescriptlang.org/) | |
| 🎨 [Tailwind CSS](https://tailwindcss.com/) | |
| 🔄 [TanStack Query](https://tanstack.com/query/latest) | |
| 🌀 [Framer Motion](https://www.framer.com/motion/) | |

---

## 🚀 Getting Started

### 🧰 Prerequisites
You need **[Node.js](https://nodejs.org/)** (v18 or newer) and **npm** installed.

### ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bounty-hunters-call.git
cd bounty-hunters-call
````

#### ▶️ Setup Backend

```bash
cd server
npm install
npm start
# Server runs on http://localhost:4000
```

#### 💻 Setup Frontend

```bash
cd client
npm install
npm run dev
# App opens on http://localhost:5173
```

---

## 🎰 Provably Fair System Explained

Bounty Hunter’s Call uses a **commit–reveal fairness mechanism**, guaranteeing that outcomes can be verified mathematically.

1. **Commit Phase:**
   The server generates a secret `serverSeed`, hashes it using SHA-256, and sends you the `serverHash`. This locks the outcome before your spin.

2. **Spin Phase:**
   You provide your own `clientSeed` and press **Spin**. The client sends it to the server.

3. **Reveal & Verify:**
   The server combines `serverSeed` + `clientSeed` to produce results, then **reveals** its original `serverSeed`.
   You can verify the hash using any SHA-256 tool.
   ✅ If the hashes match — the spin was provably fair.

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

🎵 Sound effects & music from [Pixabay](https://pixabay.com/sound-effects/)
💡 Built with passion using the **modern open-source ecosystem**.
🤠 *Ride fair, spin fair — and may fortune smile upon your bounty hunt.*

⚠️ **Disclaimer:**
This project is created **only for fun-play and educational demonstration**.
It is **not intended for any form of real-money gambling or wagering**.
Any person or group found using this system for real-money betting, gambling, or similar illegal activities will be **solely responsible for their actions** and may be **punishable under the IT Act and relevant national laws**.
The **author (Ranjit Nath)** bears **no responsibility** for any misuse of this software.

---

<div align="center">

⭐ **If you like this project, give it a star on GitHub!** ⭐
🧭 *Built with ❤️ by Ranjit Nath*

</div>
```

---
