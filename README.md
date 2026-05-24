# 🎡 Topic Finder

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.x-ff69b4?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A simple, rotary wheel app for breaking the ice. I built this because most icebreaker apps are just boring lists. I wanted something with actual weight, physics, and a "premium" feel that works perfectly on a phone.

---

## ✨ How to Interact

| Action | Result |
| :--- | :--- |
| **Tap Center Button** | 🌀 Triggers a high-velocity spin with realistic deceleration. |
| **Select Category** | 🎯 Filters the question pool (Deep, Funny, etc.). |
| **Press `ESC` Key** | 🚪 Instantly dismisses a revealed question (A11Y feature). |
| **Mouse Hover** | 💡 Dynamically shifts the indigo ambient spotlight. |

---

## 🛠️ The Tech Behind It

*   **Animation:** [Framer Motion](https://www.framer.com/motion/). I used this for the inertia-driven wheel. It’s a bit heavier than basic CSS, but the "clacking" peg physics needed that level of control.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/). Used for the layout. It’s fully responsive—I tuned the margins specifically so it fits on one screen (no scrolling) on everything from an iPhone 17 to a 4K monitor.
*   **Logic:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/). Everything is modular. The data is separated so you can add new questions in seconds without touching the UI code.

---

## 🏗️ Design Trade-offs

1.  **No Database:** I kept the questions in a static TypeScript file (`src/data/questions.ts`). It makes the app lightning fast and infinitely easier to deploy. No backend required.
2.  **GPU Acceleration:** I used `will-change-transform` and `z: 0` styles on the wheel. It forces the browser to use the GPU, keeping the animation at 120Hz even on battery-saver mode.
3.  **Smart Pool Logic:** The app automatically manages your history and resets categories once all questions have been asked—no "dead" buttons.

---

## 🚀 Get it Running

```bash
# Install
npm install

# Dev mode
npm run dev

# Build for production
npm run build
```

---

## ✍️ Adding Your Own Questions

Don't touch `App.tsx`. Just go to `src/data/questions.ts` and add a new object to the array:

```typescript
{ id: '301', text: "What's your new question?", category: 'Deep', intensity: 2 }
```

The app handles the rest. It’ll update the count and add it to the random pool automatically.

---

Built by **[Vamsi Indugu](https://github.com/Vamsiindugu)**.
