# Quantum Bloch Sphere Simulator

A production-quality, interactive 3D web application for visualizing single-qubit quantum states and operations. Built purely on the frontend, this educational tool allows users to build gate sequences, observe real-time state vector animations, and study the underlying mathematical foundations of quantum computing.

## Features

- **Interactive 3D Bloch Sphere:** Smooth 60 FPS rendering using Three.js and React Three Fiber.
- **Quantum Gates:** Support for standard single-qubit gates including Pauli-X, Y, Z, Hadamard (H), Phase (S), Pi/8 (T), and √X.
- **Real-Time Animation:** Watch the state vector smoothly rotate along the surface of the sphere as gates are applied, driven by spherical linear interpolation (slerp) over complex vectors.
- **Educational Display:** Real-time feedback showing:
  - Dirac Notation
  - State Coefficients (α, β)
  - Measurement Probabilities (|α|², |β|²)
  - Bloch Coordinates (x, y, z) and angles (θ, φ)
  - Unitary matrices and physical interpretations for selected gates
- **History & Playback:** Queue up a sequence of gates, play/pause/restart animations, and jump back in time using the History timeline and Undo functionality.
- **Premium UI/UX:** A gorgeous "floating panel" layout with a frosted glass aesthetic, custom gradient icons, and extensive spacing for a clutter-free learning environment.

## Tech Stack

This project is a 100% static frontend application. No backend or database is required.

- **Framework:** React 19 + Vite
- **Language:** TypeScript (Strict Mode)
- **3D Graphics:** Three.js + `@react-three/fiber`
- **Styling:** Tailwind CSS v4 + Vanilla CSS Variables

## Getting Started

### Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

### Production Build

To build the static files for production:

```bash
npm run build
```

This will output the highly optimized static HTML, CSS, and JS files into the `dist/` directory.

## Deployment

Because this is a static frontend application, it can be hosted on any static file server or Edge CDN.

**Vercel (Recommended):**
Vercel will automatically detect the Vite framework and deploy it with zero configuration. Simply import your GitHub repository into your Vercel dashboard and hit deploy.
