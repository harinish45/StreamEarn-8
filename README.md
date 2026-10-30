<div align="center">

# 🎮 StreamEarn

**Next-Gen Interactive Live Streaming & Monetization Platform**

[![CI](https://github.com/harinish45/StreamEarn-8/actions/workflows/ci.yml/badge.svg)](https://github.com/harinish45/StreamEarn-8/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)

> *Unified personal command centre for AI tools, live streaming, earning opportunities, and skill building*

[📋 TODO](TODO.md) · [📄 PRD](PRD.md) · [🔗 MERGE_SCOPE](MERGE_SCOPE.md)

</div>

---

## 🏗️ Platform Architecture

```mermaid
graph TB
    subgraph Client["🌐 Client Layer"]
        Web["Next.js Web App\n(App Router)"]
        Extension["🔌 Browser Extension"]
    end

    subgraph AppLayer["⚡ Application Layer"]
        Auth["🔐 Auth\n(Firebase)"]
        StreamEngine["📡 Stream Engine\n(WebRTC)"]
        MonetizationEngine["💰 Monetization\n(Stripe)"]
        AIEngine["🤖 AI Features\n(Recommendations)"]
    end

    subgraph DataLayer["🗄️ Data Layer"]
        Firestore["🔥 Firestore\n(Real-time)"]
        Supabase["🐘 Supabase\n(PostgreSQL)"]
        MongoDB["🍃 MongoDB\n(Analytics)"]
    end

    Web --> Auth
    Web --> StreamEngine
    Web --> MonetizationEngine
    Web --> AIEngine
    Extension --> AIEngine
    Auth --> Firestore
    StreamEngine --> Firestore
    MonetizationEngine --> Supabase
    AIEngine --> MongoDB
```

---

## 💰 Monetization Flow

```mermaid
sequenceDiagram
    participant V as Viewer
    participant P as Platform
    participant C as Creator
    participant S as Stripe

    V->>P: Send tip ($5)
    P->>S: Create payment intent
    S-->>P: Payment confirmed
    P->>P: Split (80% creator / 20% platform)
    P->>C: Credit $4.00
    P->>V: 🎉 Tip animation shown
    P->>C: 🔔 Notification
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/harinish45/StreamEarn-8.git
cd StreamEarn-8
npm install
npm run dev    # → http://localhost:3000
```

---

## 📁 Structure

```
StreamEarn-8/
├── 🌐  src/
│   ├── app/           # Next.js App Router
│   ├── components/    # UI components
│   └── lib/           # Business logic
├── 🔌  extension/     # Browser extension
├── 🐘  supabase/      # DB migrations
└── 📊  docs/          # Documentation
```

---

<div align="center">
<a href="LICENSE">MIT License</a> · Built by harinish45
</div>