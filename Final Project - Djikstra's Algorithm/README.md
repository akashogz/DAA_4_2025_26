# Dijkstra's Shortest Path Algorithm — DAA Project

A React-based interactive visualization of **Dijkstra's Algorithm** for finding the shortest path in a weighted graph.

## 📌 Data Structure Used
**Priority Queue (Min-Heap)** — used to efficiently extract the minimum-distance unvisited node at each step.

## ⏱ Complexity
| | Complexity |
|---|---|
| Time | O((V + E) log V) |
| Space | O(V) |

## 🚀 How to Run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## ✨ Features
- Step-by-step animated visualization of the algorithm
- Live distance table updated at each step
- Step log showing which node is being processed
- Highlighted shortest path once algorithm completes
- Selectable source and target nodes

## 🧠 Algorithm Steps
1. Initialize source distance = 0, all others = ∞
2. Extract minimum-distance node from priority queue
3. Relax all unvisited neighbours
4. Repeat until all nodes are visited
5. Backtrack via previous-node map to reconstruct path

## 🛠 Tech Stack
- React 18
- Pure CSS (no UI libraries)
- SVG for graph rendering
