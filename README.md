# 🧩 Code Collab

**Realtime Peer-to-Peer Collaborative Coding Platform**

---

## 🎯 Objective

A modern web application providing a **realtime collaborative coding environment**, enabling developers to write and edit code together with zero setup or server requirements using WebRTC peer-to-peer data channels.

---

## 🧠 Tech Stack

* **Framework:** Next.js 16 (App Router, Turbopack) & React 19
* **Styling:** Tailwind CSS v4
* **Editor:** Monaco Editor (`@monaco-editor/react`)
* **Realtime Networking:** PeerJS (WebRTC P2P Data Channels)
* **Animations:** Framer Motion
* **Icons:** FontAwesome

---

## 📁 Architecture & Project Structure

The project has been modularized with clear separation of concerns across hooks, UI components, and domain utilities:

```text
src/
├── app/                      # Next.js App Router
│   ├── editor/
│   │   ├── client/page.js    # Client editor route (Suspense-wrapped)
│   │   └── host/page.js      # Host editor route (Suspense-wrapped)
│   ├── globals.css           # Global theme variables & Tailwind imports
│   ├── layout.js             # Root layout with font and client loader
│   └── page.js               # Landing page with workspace actions
├── components/
│   ├── common/               # Shared general UI components
│   │   ├── AnimatedModal.jsx # Framer Motion modal dialog
│   │   ├── ClientLoader.jsx  # Client-side hydration/loader wrapper
│   │   ├── Loading.jsx       # Animated pulse loading indicator
│   │   └── Navbar.jsx        # Top brand navigation bar
│   ├── editor/               # Editor domain components
│   │   ├── CodeEditor.jsx    # Monaco Editor wrapper with dark theme
│   │   ├── EditorLayout.jsx  # Fullscreen editor layout
│   │   ├── EditorNavbar.jsx  # Editor header with peer indicators & share action
│   │   └── ShareModal.jsx    # Share modal with copy button & active peer list
│   └── home/                 # Landing page domain components
│       └── WorkspaceTabs.jsx # Accessible tabbed form for creating/joining workspaces
├── constants/
│   └── editor.js             # Editor defaults, themes, and message types
├── hooks/
│   ├── useClientPeer.js      # Client WebRTC connection lifecycle and state sync
│   └── useHostPeer.js        # Host WebRTC coordinator, broadcast & peer relay
└── utils/
    └── workspace.js          # Helpers for formatting and parsing share IDs
```

---

## 🚀 Key Features

* **Realtime Multi-User Sync:** Host acts as peer coordinator, syncing initial editor state upon join and relaying changes across all connected peers.
* **Instant Workspace Sharing:** Composite workspace IDs (`peerId@workspaceName`) allow one-click copy and join.
* **Live Connection Monitoring:** Host tracks active connected peers in real-time; guests view connection and host status.
* **Resilient Lifecycle Management:** Proper cleanup and teardown of WebRTC connections when tabs are closed or refreshed.
* **Monaco Editor Experience:** Full VS Code editing experience with syntax highlighting and dark mode.

---

## 📦 Setup & Development

1. Clone the repository:
   ```bash
   git clone <git-url>
   cd collab-code
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Run lint checks:
   ```bash
   npm run lint
   ```
