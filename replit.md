# Fractional Fill Theory Visualization

## Overview

This is an interactive 3D visualization application for exploring the Fractional Fill Theory - a mathematical concept dealing with angular systems and the critical 359.999...° to 0° transition in circular geometry. The application provides a real-time 3D environment where users can manipulate angular values and observe the theoretical "rhythmic precision" effects through various visual components including spheres, helical patterns, particle systems, and lattice structures.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main application framework
- **React Three Fiber** (@react-three/fiber) for 3D rendering and WebGL integration
- **Three.js** ecosystem with additional utilities from @react-three/drei for 3D scene management
- **Tailwind CSS** for styling with custom design system using CSS variables
- **Radix UI** components for consistent UI elements (buttons, sliders, cards, etc.)
- **Vite** as the build tool and development server

### Component Structure
- Main visualization components handle different aspects of the theory:
  - `AngularSphere` - Primary spherical visualization with wraparound effects
  - `HerculesPoint` - Central anchor point with constellation patterns
  - `MicroShiftParticles` - Particle system showing micro-scale effects
  - `HelicalOverlay` - Helical pattern visualizations
  - `LivingLattice` - Dynamic lattice structure representation
- Control panels provide real-time parameter adjustment
- Precision readouts display mathematical calculations

### Backend Architecture
- **Express.js** server with TypeScript
- **PostgreSQL** database configured with Drizzle ORM
- **Neon Database** (@neondatabase/serverless) as the database provider
- Modular route registration system in `server/routes.ts`
- In-memory storage fallback (`MemStorage`) for development
- User management schema with basic CRUD operations

### 3D Rendering Pipeline
- Canvas-based rendering with shadow support and anti-aliasing
- Multiple lighting setups (ambient, directional, point lights)
- Real-time animation loops using `useFrame` hooks
- High-detail geometry for smooth mathematical visualizations
- Particle systems for micro-scale effect representation

### State Management
- React hooks for local component state
- Custom hooks for fractional fill calculations (`useFractionalFill`)
- Zustand stores for global state management (audio, game phases)
- Real-time parameter synchronization between controls and visualizations

### Mathematical Engine
- Real-time angular calculations and normalization
- Wraparound intensity calculations for the 359.999...° transition
- Micro-shift magnitude processing and visualization
- Lattice propagation algorithms
- Precision readout calculations with multiple decimal places

## External Dependencies

### Database & ORM
- **PostgreSQL** - Primary database (configured via DATABASE_URL)
- **Drizzle Kit** - Database migrations and schema management
- **Neon Database Serverless** - Cloud PostgreSQL provider with edge support

### 3D Graphics & Visualization
- **Three.js** - Core 3D graphics library
- **React Three Fiber** - React integration for Three.js
- **React Three Drei** - Additional Three.js utilities and helpers
- **React Three Postprocessing** - Post-processing effects pipeline
- **vite-plugin-glsl** - GLSL shader support for custom visual effects

### UI Framework
- **Radix UI** - Comprehensive primitive components library (30+ components)
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe component variants
- **Lucide React** - Icon library

### Development & Build Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and enhanced development experience
- **ESBuild** - Fast JavaScript bundler for production builds
- **PostCSS** - CSS processing with Tailwind integration

### Additional Libraries
- **TanStack React Query** - Server state management
- **date-fns** - Date manipulation utilities
- **clsx** - Conditional className utility
- **cmdk** - Command palette component
- **nanoid** - Unique ID generation

### Audio Integration
- Native Web Audio API integration through Zustand stores
- Support for background music, hit sounds, and success sounds
- Mute/unmute functionality with state persistence

### Asset Support
- GLTF/GLB 3D model loading capability
- Audio file support (MP3, OGG, WAV)
- Font loading with Inter typeface integration