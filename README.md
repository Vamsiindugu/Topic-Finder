# 🎡 Topic Finder

A simple, rotary wheel app for breaking the ice. It’s built to make finding conversation starters feel less like scrolling a list and more like playing a game. 

I built this because most "icebreaker" apps are just static text. I wanted something with actual weight, physics, and a "premium" feel that works perfectly on a phone.

---

## 🛠️ The Tech Behind It

*   **Animation:** [Framer Motion](https://www.framer.com/motion/). I used this for the inertia-driven wheel. It’s a bit heavier than basic CSS, but the "clacking" peg physics needed that level of control.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/). Used for the layout. It’s fully responsive—I tuned the margins specifically so it fits on one screen (no scrolling) on everything from an iPhone 17 to a 4K monitor.
*   **Logic:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/). Everything is modular. The data is separated so you can add new questions in seconds without touching the UI code.
*   **Icons:** [Lucide React](https://lucide.dev/). Clean, fast, and consistent.

---

## 📱 Designed for Mobile

Most web apps fail on mobile because they require scrolling to see the "action." This app is constrained to the viewport. 
*   **Samsung S25 Ultra / iPhone 17 Pro Max:** Fully verified.
*   **Zero Scroll:** The entire UI (Header, Wheel, Categories) stays in view.

---

## 🏗️ Design Trade-offs

1.  **No Database:** I kept the questions in a static TypeScript file (`src/data/questions.ts`). Why? Because it makes the app lightning fast and infinitely easier to deploy. You don't need a backend to run this.
2.  **GPU Acceleration:** I used `will-change-transform` and `z: 0` styles on the wheel. It forces the browser to use the GPU, which keeps the animation at 120Hz even on battery-saver mode.
3.  **A11Y:** Added an `Escape` key listener for the modals. It’s a small detail, but it’s what makes an app feel professional.

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
