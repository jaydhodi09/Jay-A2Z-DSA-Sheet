# 🚀 Jay A2Z DSA Sheet

An **interactive, open-source DSA practice sheet** inspired by Striver’s A2Z Sheet — built to help learners **track, manage, and master Data Structures & Algorithms** in a structured and intuitive way.

🔗 **Live Demo**:
👉 [https://jay-a2z-dsa-sheet-hq2a8xn2a-jay-dhodis-projects-adff9c82.vercel.app/](https://jay-a2z-dsa-sheet-hq2a8xn2a-jay-dhodis-projects-adff9c82.vercel.app/)

---

## 📌 About the Project

**Jay A2Z DSA Sheet** is a single-page web application that allows users to practice **449 curated DSA problems** organized by topics and sub-topics.

The platform focuses on:

* Clean UI & smooth UX
* Interactive progress tracking
* Fully customizable question sheets
* Drag-and-drop reordering
* Zero backend dependency (can work without DB)

This project is ideal for:

* Students preparing for coding interviews
* Developers following structured DSA roadmaps
* Anyone who wants a **Codolio-style question tracker**, but open-source

---
## 👁️ Preview
<img width="1918" height="1060" alt="image" src="https://github.com/user-attachments/assets/e62c94b3-2683-40f9-92b5-14d04b0f0e4f" />
<img width="1919" height="1057" alt="image" src="https://github.com/user-attachments/assets/3e894dad-934e-4589-a91a-020f88fa5665" />

---

## ✨ Features

### ✅ Core Features

* 📚 **449 DSA Questions** across **18 topics**
* 🧩 Topic → Sub-Topic → Question hierarchy
* ➕ Add / ✏️ Edit / 🗑️ Delete:

  * Topics
  * Sub-topics
  * Questions
* 🔀 **Drag & Drop Reordering** (topics, sub-topics, questions)
* 🔍 Search questions instantly
* 📊 Real-time progress tracking
* 🌙 Clean, modern dark UI

### 🎯 Bonus Improvements

* Local state persistence (no DB required)
* Fast UI rendering using optimized state management
* Inspired UI/UX similar to Codolio & Striver Sheet
* Fully responsive design

---

## 🛠 Tech Stack

| Category         | Technology       |
| ---------------- | ---------------- |
| Frontend         | **React**        |
| Styling          | **Tailwind CSS** |
| State Management | **Zustand**      |
| Drag & Drop      | **@dnd-kit**     |
| Deployment       | **Vercel**       |

---

## 🧠 Architecture Overview

* **Single Page Application (SPA)**
* State-driven UI using Zustand
* Sample dataset used as initial state
* CRUD operations handled locally (no backend dependency)
* Easily extendable to backend APIs later

---

## 🔌 API Reference (Optional)

This project is inspired by Codolio’s public API format:

```bash
curl --location 'https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet'
```

> ⚠️ Currently, the project works without a database.
> APIs can be integrated later without changing UI logic.

---

## 📂 Project Structure (Simplified)

```
src/
│
├── components/        # UI components
├── store/             # Zustand state management
├── data/              # Sample dataset
├── pages/             # Page-level components
├── styles/            # Global styles
└── utils/             # Helper utilities
```

---

## 🚀 Getting Started Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/jay-a2z-dsa-sheet.git
cd jay-a2z-dsa-sheet
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the App

```bash
npm run dev
```

App will run on:

```
http://localhost:5173
```

---

## 📸 Screenshots

> UI inspired by Codolio & Striver A2Z Sheet
> (Screenshots included in repository)

---

## 🎯 Future Enhancements

* 🔐 User authentication
* ☁️ Backend + database support
* 📈 Analytics dashboard
* ☑️ Mark solved / unsolved with sync
* 📱 PWA support
* 🌍 Shareable custom sheets

---

## ⚠️ Disclaimer

This project is **for educational purposes only**.
It is **inspired by** platforms like Striver A2Z & Codolio but **does not copy proprietary content**.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 👨‍💻 Author

**Jay Dhodi**
Aspiring Software Engineer | DSA & System Design Enthusiast

🔗 GitHub: [https://github.com/jaydhodi09](https://github.com/jaydhodi09)
🔗 Project: Jay A2Z DSA Sheet

---

## ⭐ Support

If you find this project useful:

* ⭐ Star the repository
* 🔄 Share it with your friends
* 🐛 Report issues or suggest improvements

---

