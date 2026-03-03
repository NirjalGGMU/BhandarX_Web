# Task: Premium Redesign of Inventory Page

## Goal
Transform the current Inventory Page into a state-of-the-art "Pro Max" dashboard with refined aesthetics, smooth micro-animations, and improved information hierarchy.

## 🎨 Design Vision
- **Theme**: Premium Glassmorphism / Refined Light Mode.
- **Color Palette**: Deep Slate for typography, Electric Blue for primary actions, Emerald/Amber/Rose for status with soft backgrounds.
- **Typography**: Inter (UI) + JetBrains Mono (Data/SKUs).
- **Interactions**: Staggered entry animations, hover scale effects, integrated tooltips, and contextual actions.

## 🛠 Features to Implement
1.  **Immersive Header**:
    - Multi-layered header with integrated search.
    - Glassmorphic action bar.
2.  **Dynamic Stat Dashboard**:
    - Floating cards with gradient icons.
    - Micro-charts or progress circles for stock health.
3.  **Advanced Inventory Table**:
    - Modern row hover states (shadow depth instead of just background change).
    - Refined product thumbnails with blur-up/fade effect.
    - Integrated stock level "Heatmap" bars.
    - Contextual action menu (Slide-out or dropdown instead of row inline icons).
4.  **Side Panel / Drawer for Quick Adjustments** (Optional/Phase 2).
5.  **Interactive Empty States**: Beautiful illustrations/animations when no results.

## 📂 Files to Modify
- `f:\ims\frontend\src\app.css`: Add premium design tokens and utility classes.
- `f:\ims\frontend\src\features\inventory\pages\InventoryPage.jsx`: Complete structural and style overhaul.

## 🚀 Step-by-Step Plan

### Phase 1: Style Foundation (`app.css`)
- [ ] Add Premium Shadows (Depth 1-4).
- [ ] Define Glassmorphic utilities (`bg-glass`, `glass-border`).
- [ ] Update table header styles for higher contrast.
- [ ] Add custom transition durations for smoother feels.

### Phase 2: Structural Overhaul (`InventoryPage.jsx`)
- [ ] Rewrite `InventoryStat` component for better visual density.
- [ ] Refactor the Header into a more cohesive component.
- [ ] Wrap filters in a more integrated "Omni-bar".
- [ ] Reconfigure `columns` to use more refined sub-components.

### Phase 3: Polish & Animation
- [ ] Implement `framer-motion` staggered transitions.
- [ ] Add sound effects for actions (if requested).
- [ ] Audit for mobile responsiveness.

## ✅ Verification
- [ ] Visual check: Does it look "Pro Max"?
- [ ] Interactive check: Are hover states smooth?
- [ ] Data check: Does searching and filtering still work perfectly?
