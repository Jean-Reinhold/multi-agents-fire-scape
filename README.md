# Cocoanut Grove Fire Evacuation Simulation

A sophisticated Multi-Agent System (MAS) simulation that recreates the tragic Cocoanut Grove nightclub fire of November 28, 1942, using Complexity Theory and Complex Adaptive Systems principles. This interactive web application allows users to explore different evacuation scenarios and understand how simple interactions between individuals can lead to system-wide failures.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Historical Context](#historical-context)
- [Installation](#installation)
- [Usage](#usage)
- [Scenarios](#scenarios)
- [Configuration Parameters](#configuration-parameters)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Development](#development)
- [License](#license)

## Overview

This simulation models the Cocoanut Grove fire evacuation using a Multi-Agent System where each agent represents a person trying to escape. The system demonstrates emergent behaviors arising from local interactions, including:

- **Herd Behavior**: Agents observe and imitate the actions of others
- **Panic Contagion**: Emotional states spread through proximity
- **Revolving Door Mechanics**: Physical constraints that can jam under conflicting forces
- **Fire Propagation**: Dynamic fire spread affecting agent behavior
- **Pathfinding**: Intelligent routing to nearest exits

## Features

- **Three Distinct Scenarios**: Compare real-world conditions with improved alternatives
- **Real-Time Visualization**: Canvas-based rendering with color-coded agent states
- **Interactive Controls**: Adjust simulation parameters on the fly
- **Live Statistics Dashboard**: Track evacuation progress, casualties, and door jams
- **Time-Series Graph**: Visualize agent state changes over time
- **Responsive Design**: Professional dashboard layout optimized for analysis
- **Configurable Parameters**: Fine-tune agent behavior, panic levels, and fire spread

## Historical Context

The Cocoanut Grove fire was one of the deadliest nightclub fires in U.S. history, resulting in 492 deaths. Key factors that contributed to the tragedy:

- **Severe Overcrowding**: Over 1,000 people in a venue with a 460-person capacity
- **Locked Exits**: Doors were locked to prevent patrons from leaving without paying
- **Revolving Door Jam**: The main entrance's revolving door jammed due to panic and conflicting forces
- **Rapid Fire Spread**: Highly flammable palm tree decorations accelerated the fire

This simulation allows researchers and educators to explore "what if" scenarios and understand the importance of proper exit design and crowd management.

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd multi-agents-fire-scape
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

The application is configured for static export, making it easy to deploy to any static hosting service.

## Usage

### Basic Workflow

1. **Select a Scenario**: Choose from Real, Intermediate, or Ideal scenarios
2. **Configure Parameters**: Adjust agent count, panic threshold, door sensitivity, etc.
3. **Start Simulation**: Click the "Start" button to begin
4. **Observe**: Watch agents navigate, panic spread, and evacuation progress
5. **Analyze**: Review statistics and graphs to understand outcomes

### Interface Overview

- **Left Sidebar**: Configuration controls, scenarios, and parameters
- **Top Stats Bar**: Real-time metrics (Evacuated, Casualties, Active, Jams, Time)
- **Center Canvas**: Main simulation visualization
- **Bottom Panel**: Time-series graph and color legend

### Agent Color Coding

- **Green → Yellow → Red**: Panic level (Calm → Anxious → Panicked)
- **Purple**: Jammed/Stuck agents at blocked doors
- **Orange**: Fire cells
- **Yellow Circle**: Revolving door (red when jammed)

## Scenarios

### Real Scenario
Recreates the actual conditions of the Cocoanut Grove fire:
- **Main Entrance**: Revolving door (can jam)
- **Side Exits**: Blocked/locked
- **Result**: High casualty rate due to single point of failure

### Intermediate Scenario
Improves upon reality while keeping the revolving door:
- **Main Entrance**: Revolving door (can jam)
- **Side Exits**: Open and accessible
- **Result**: Better evacuation, but door jamming still poses risk

### Ideal Scenario
Optimal evacuation conditions:
- **Main Entrance**: Wide double-door exit (no revolving door)
- **Side Exits**: All open and accessible
- **Result**: Maximum evacuation efficiency

## Configuration Parameters

### Total Agents
- **Range**: 10 - 1000
- **Default**: 200
- **Effect**: Number of people in the simulation

### Time Scale
- **Range**: 0.1x - 5x
- **Default**: 1.0x
- **Effect**: Simulation speed multiplier

### Panic Threshold
- **Range**: 0.0 - 1.0
- **Default**: 0.3
- **Effect**: Level at which agents exhibit panicked behavior

### Door Jam Sensitivity
- **Range**: 0.1 - 2.0
- **Default**: 0.5
- **Effect**: Force threshold required to jam the revolving door (lower = easier to jam)

### Fire Spread Interval
- **Range**: 0.1s - 2.0s
- **Default**: 1.0s
- **Effect**: Time between fire spreading to adjacent cells (lower = faster spread)

## Technical Architecture

### Multi-Agent System Design

The simulation implements a **Social Force Model** with the following components:

#### Agent Behaviors

1. **Goal Force**: Agents follow a flow field toward the nearest accessible exit
2. **Separation**: Collision avoidance with nearby agents
3. **Alignment (Herd Behavior)**: Agents align velocity with neighbors when panicked
4. **Panic Contagion**: Panic level increases based on neighbor panic and fire proximity

#### Revolving Door Mechanics

The revolving door jams when:
- Multiple agents apply forces in opposing directions
- The conflict (sum of magnitudes - net force) exceeds the jam sensitivity threshold
- Once jammed, the door becomes a fixed obstacle

#### Fire System

- Fire ignites at t=2 seconds
- Spreads to adjacent cells based on configurable interval
- Agents touching fire cells become casualties
- Fire increases global panic levels

### Pathfinding

Uses a **Flow Field** algorithm:
- BFS from all exits to calculate distance map
- Gradient descent to generate direction vectors
- Updates dynamically when doors jam

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application component
│   ├── layout.tsx            # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── SimulationCanvas.tsx # Canvas renderer
│   ├── Sidebar.tsx          # Configuration sidebar
│   ├── StatsDisplay.tsx     # Metrics cards
│   ├── StatsGraph.tsx       # Time-series chart
│   ├── AgentLegend.tsx      # Color legend
│   └── MapEditor.tsx        # Map editing tool (optional)
├── simulation/
│   ├── Engine.ts            # Main simulation engine
│   ├── AgentLogic.ts        # Agent behavior logic
│   └── Pathfinding.ts      # Flow field pathfinding
├── types/
│   └── simulation.ts       # TypeScript interfaces
└── utils/
    ├── grid.ts             # Grid utilities
    ├── vector.ts           # Vector math utilities
    └── scenarios.ts        # Scenario generation
```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **HTML5 Canvas**: High-performance rendering
- **Lucide React**: Icon library

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint configured with Next.js rules
- Tailwind CSS for styling
- Functional React components with hooks

### Performance Considerations

- Canvas rendering optimized for 60fps
- Agent neighbor checks use distance filtering
- Stats history limited to 200 data points
- Flow field pre-computed and cached

## 📊 Simulation Metrics

The simulation tracks:
- **Evacuated Count**: Agents who reached an exit
- **Casualty Count**: Agents who died from fire
- **Active Count**: Agents still in the building
- **Jammed Agent Count**: Agents stuck at jammed doors
- **Jam Count**: Number of times the door jammed (usually 0 or 1)
- **Time Elapsed**: Simulation time in seconds

## Educational Use

This simulation is ideal for:
- **Complexity Science**: Demonstrating emergent behaviors
- **Safety Engineering**: Exit design and crowd management
- **Psychology**: Panic contagion and herd behavior
- **Computer Science**: Multi-agent systems and pathfinding algorithms

## icense

See LICENSE file for details.

## Acknowledgments

This project is based on research into the Cocoanut Grove fire and Multi-Agent Systems. The simulation aims to honor the memory of those who perished by helping prevent similar tragedies through education and understanding.

---

**Note**: This is an educational simulation. Results may not perfectly match historical events due to simplifications in the model. The goal is to understand system dynamics, not to recreate exact historical outcomes.
