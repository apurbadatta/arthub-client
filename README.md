# 🎨 ArtHub – Online Art Marketplace

[![Live Website](https://img.shields.io/badge/Live-Website-7c3aed?style=for-the-badge)](https://your-live-url.com)
[![Production Server](https://img.shields.io/badge/Production-Server-111827?style=for-the-badge)](https://your-server-url.com)
---
*   **Theme:** Premium Art Marketplace & Escrow Gateway

### 💡 Why ArtHub?
Traditional art buying is often limited to galleries or physical exhibitions. ArtHub democratizes access to art, enables emerging artists to reach global audiences, and provides a secure, streamlined purchase experience. The project demonstrates advanced MERN stack concepts including role-based access control, secure multi-tier payment integrations, and modular state management.

---

## 🔒 Strict Production & Deployment Compliance
*   **Anti-Fix Layout:** Zero "Gobindo Design". Built using professional structural spacing, high-contrast layouts, and sleek dark modes (`#0b121f` & `#111827`).
*   **No 404/504 Route Errors:** Implemented Next.js App Router fallback rewrites preventing route-reloading crashes on client side.
*   **Persistent Private Hydration:** Logged-in sessions persist flawlessly during hard reloads using client-side global authentication loaders. No forced login redirects.

---

## ✨ Key System Features

### 👤 Granular Role-Based Access Control (RBAC)
*   **User (Buyer):** Browse public collections, acquire original pieces, write authenticated reviews, track personal purchase history, and scale transaction limitations via Tiered Subscriptions.
*   **Artist:** Dedicated content suite featuring absolute CRUD capabilities on personal listings, structured sales ledger tracking, and instant automated storage uploads via ImgBB.
*   **Admin:** Complete structural dashboard governing universal user accounts, marketplace control, complete billing audits, and visual analytical distribution charts.

### 💳 Stripe Multi-Tier Subscriptions & Purchase Checks
Before opening a Stripe Gateway Session, the server validates identity tokens to ensure compliance:
*   **Artwork Acquisition Guardrails:** Artists are strictly forbidden from executing buying sessions on self-created art assets.

#### 📊 Membership Tier Matrix
| Tier Level | Total Allowed Purchases | Billing Price |
| :--- | :---: | :---: |
| **Free (Default)** | 3 Paintings Max | **$0** |
| **Pro** | 9 Paintings Max | **$9.99 / mo** |
| **Premium** | Unlimited | **$19.99 / mo** |

### 💬 Challenge Integrations

#### 1. Verified Buyer Escrow-Locked Comment System
Users can edit/delete their own thoughts. However, the system requires a concrete ledger receipt verification before unlocking commentary.
```json
// Database Token Definition Schema
{
  "_id": "65f3a1b2c4d5e6f7a8b9c0d1",
  "artworkId": "65f3a1b2c4d5e6f7a8b9c0d2",
  "userId": "65f3a1b2c4d5e6f7a8b9c0d3",
  "comment": "This painting is absolutely stunning! The colors blend beautifully."
}