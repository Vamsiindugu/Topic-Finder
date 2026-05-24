# 🎡 Topic Finder: Kinetic Question Discovery

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-ff69b4?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A cinematic, highly-interactive React application designed for discovering deep conversation starters, funny icebreakers, and "What If" scenarios. Built with a focus on **fluid physics**, **premium aesthetics**, and **zero-scroll responsive design**.

## ✨ Key Features

*   **🎡 Kinetic Wheel Interface:** A physics-based rotary wheel with realistic peg-clacking animations and inertia-driven easing.
*   **🎭 Cinematic Reveal:** Smooth, spring-animated cards that present questions with category-specific iconography.
*   **🖱️ Ambient Cursor Tracking:** A GPU-accelerated spotlight background that follows your mouse movements without triggering React re-renders.
*   **📱 Native Mobile Feel:** Fully optimized for high-end devices like **iPhone 17 Pro Max** and **Samsung S25 Ultra**—designed for a perfect "one-screen" experience.
*   **🧠 Smart Pool Logic:** Automatically manages your history and resets categories once all questions have been asked—no more "dead" buttons.

## 🚀 Interactive UI Guide

| Interaction | Result |
| :--- | :--- |
| **Tap Center Button** | 🌀 Triggers a high-velocity spin with realistic deceleration. |
| **Select Category** | 🎯 Filters the question pool to match your mood (Deep, Funny, etc.). |
| **Press `ESC` Key** | 🚪 Instantly dismisses a revealed question (A11Y feature). |
| **Mouse Hover** | 💡 Dynamically shifts the indigo ambient spotlight. |

## 🛠️ Built With

*   **Framework:** [React 18](https://reactjs.org/) (Strict Functional Components)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/) (Hardware-accelerated)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Responsive Utility-First Design)
*   **Icons:** [Lucide React](https://lucide.dev/) (Sleek, minimalist glyphs)
*   **Typing:** [TypeScript](https://www.typescriptlang.org/) (Strict interface contracts)
*   **Bundler:** [Vite](https://vitejs.dev/) (Lightning-fast dev server)

## 📂 Project Structure (Senior Layout)

```text
src/
├── components/       # Reusable, atomic UI pieces
├── data/             # Centralized question engine & types
├── styles/           # Global design tokens & tailwind base
├── App.tsx           # Main application shell & state orchestration
└── main.tsx          # App entry point & strict-mode setup
```

## ⚙️ Local Development

1.  **Clone the Repo:**
    ```bash
    git clone https://github.com/Vamsiindugu/Topic-Finder.git
    cd Topic-Finder
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Dev Server:**
    ```bash
    npm run dev
    ```

4.  **Build for Production:**
    ```bash
    npm run build
    ```

## 🤝 Contribution

Adding new questions is easy! Simply edit `src/data/questions.ts` and add your question to the `QUESTIONS` array. The UI will automatically calculate the new count and update the pool logic—no code changes required.

Built with ❤️ by **[Vamsi Indugu](https://github.com/Vamsiindugu)**.
