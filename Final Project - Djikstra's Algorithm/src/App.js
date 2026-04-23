import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// ── Graph data ──────────────────────────────────────────────────────────────
const INITIAL_NODES = [
  { id: "A", x: 120, y: 200 },
  { id: "B", x: 300, y: 80 },
  { id: "C", x: 300, y: 320 },
  { id: "D", x: 480, y: 80 },
  { id: "E", x: 480, y: 320 },
  { id: "F", x: 660, y: 200 },
];

const INITIAL_EDGES = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "B", to: "C", weight: 5 },
  { from: "B", to: "D", weight: 10 },
  { from: "C", to: "E", weight: 3 },
  { from: "D", to: "F", weight: 11 },
  { from: "E", to: "D", weight: 4 },
  { from: "E", to: "F", weight: 6 },
];

// ── Dijkstra's Algorithm ─────────────────────────────────────────────────────
function dijkstra(nodes, edges, source) {
  const dist = {};
  const prev = {};
  const visited = new Set();
  const steps = [];

  nodes.forEach((n) => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[source] = 0;

  const unvisited = new Set(nodes.map((n) => n.id));

  while (unvisited.size > 0) {
    // pick min-dist unvisited
    let u = null;
    unvisited.forEach((id) => {
      if (u === null || dist[id] < dist[u]) u = id;
    });

    if (dist[u] === Infinity) break;
    unvisited.delete(u);
    visited.add(u);

    // record step
    steps.push({
      current: u,
      distances: { ...dist },
      visited: new Set(visited),
      relaxed: [],
    });

    // relax neighbours
    const neighbours = edges.filter((e) => e.from === u || e.to === u);
    const relaxed = [];
    neighbours.forEach((e) => {
      const v = e.from === u ? e.to : e.from;
      if (!visited.has(v)) {
        const alt = dist[u] + e.weight;
        if (alt < dist[v]) {
          dist[v] = alt;
          prev[v] = u;
          relaxed.push(v);
        }
      }
    });

    if (relaxed.length) {
      steps[steps.length - 1].relaxed = relaxed;
      steps[steps.length - 1].distances = { ...dist };
    }
  }

  return { dist, prev, steps };
}

function getShortestPath(prev, target) {
  const path = [];
  let cur = target;
  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }
  return path;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function midpoint(n1, n2) {
  return { x: (n1.x + n2.x) / 2, y: (n1.y + n2.y) / 2 };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function App() {
  const [source, setSource] = useState("A");
  const [target, setTarget] = useState("F");
  const [result, setResult] = useState(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const nodeIds = INITIAL_NODES.map((n) => n.id);

  function runAlgorithm() {
    const res = dijkstra(INITIAL_NODES, INITIAL_EDGES, source);
    setResult(res);
    setStepIndex(0);
    setRunning(true);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setResult(null);
    setStepIndex(-1);
    setRunning(false);
  }

  useEffect(() => {
    if (!running || !result) return;
    intervalRef.current = setInterval(() => {
      setStepIndex((i) => {
        if (i >= result.steps.length - 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          return i;
        }
        return i + 1;
      });
    }, 900);
    return () => clearInterval(intervalRef.current);
  }, [running, result]);

  // Derive display state
  const currentStep = result && stepIndex >= 0 ? result.steps[stepIndex] : null;
  const isDone = result && !running && stepIndex === (result.steps.length - 1);
  const shortestPath = isDone ? getShortestPath(result.prev, target) : [];
  const shortestPathEdges = new Set();
  for (let i = 0; i < shortestPath.length - 1; i++) {
    shortestPathEdges.add(`${shortestPath[i]}-${shortestPath[i + 1]}`);
    shortestPathEdges.add(`${shortestPath[i + 1]}-${shortestPath[i]}`);
  }

  function getNodeState(id) {
    if (!currentStep) return "idle";
    if (currentStep.current === id) return "current";
    if (currentStep.relaxed.includes(id)) return "relaxed";
    if (currentStep.visited.has(id)) return "visited";
    return "idle";
  }

  function getEdgeState(e) {
    if (isDone && (shortestPathEdges.has(`${e.from}-${e.to}`) || shortestPathEdges.has(`${e.to}-${e.from}`))) return "path";
    if (!currentStep) return "idle";
    if (currentStep.current === e.from || currentStep.current === e.to) return "active";
    return "idle";
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="badge">DAA PROJECT</div>
          <h1 className="title">Dijkstra's<br />Shortest Path</h1>
          <p className="subtitle">
            Graph algorithm using a <strong>Priority Queue</strong> (Min-Heap) data structure.<br />
            Time Complexity: <code>O((V + E) log V)</code>
          </p>
        </div>
      </header>

      {/* Controls */}
      <section className="controls">
        <div className="control-group">
          <label>Source Node</label>
          <div className="select-wrap">
            <select value={source} onChange={(e) => { reset(); setSource(e.target.value); }}>
              {nodeIds.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
        </div>
        <div className="control-group">
          <label>Target Node</label>
          <div className="select-wrap">
            <select value={target} onChange={(e) => { reset(); setTarget(e.target.value); }}>
              {nodeIds.map((id) => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
        </div>
        <button className="btn-run" onClick={running ? reset : (result ? reset : runAlgorithm)}
          disabled={source === target}>
          {running ? "⏹ Stop" : result ? "↺ Reset" : "▶ Run Algorithm"}
        </button>
      </section>

      {/* Graph + Info */}
      <div className="main-layout">
        {/* SVG Graph */}
        <div className="graph-card">
          <svg viewBox="0 0 780 400" className="graph-svg">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--clr-edge)" />
              </marker>
              <marker id="arrow-path" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="var(--clr-path)" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {INITIAL_EDGES.map((e, i) => {
              const n1 = INITIAL_NODES.find((n) => n.id === e.from);
              const n2 = INITIAL_NODES.find((n) => n.id === e.to);
              const state = getEdgeState(e);
              const mid = midpoint(n1, n2);
              return (
                <g key={i}>
                  <line
                    x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                    className={`edge edge--${state}`}
                    markerEnd={state === "path" ? "url(#arrow-path)" : "url(#arrow)"}
                  />
                  <rect x={mid.x - 14} y={mid.y - 11} width={28} height={22} rx={4}
                    className="weight-bg" />
                  <text x={mid.x} y={mid.y + 5} className="weight-label">{e.weight}</text>
                </g>
              );
            })}

            {/* Nodes */}
            {INITIAL_NODES.map((node) => {
              const state = getNodeState(node.id);
              const dist = currentStep ? currentStep.distances[node.id] : null;
              const isPath = shortestPath.includes(node.id);
              return (
                <g key={node.id} className="node-group">
                  {(state === "current" || isPath) && (
                    <circle cx={node.x} cy={node.y} r={32} className="node-glow" filter="url(#glow)" />
                  )}
                  <circle cx={node.x} cy={node.y} r={26} className={`node node--${state} ${isPath && isDone ? "node--path" : ""}`} />
                  <text x={node.x} y={node.y + 6} className="node-label">{node.id}</text>
                  {dist !== null && (
                    <text x={node.x} y={node.y - 36} className="node-dist">
                      {dist === Infinity ? "∞" : dist}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="legend">
            <span className="legend-item"><span className="dot dot--idle" />Unvisited</span>
            <span className="legend-item"><span className="dot dot--current" />Processing</span>
            <span className="legend-item"><span className="dot dot--visited" />Visited</span>
            <span className="legend-item"><span className="dot dot--relaxed" />Relaxed</span>
            <span className="legend-item"><span className="dot dot--path" />Shortest Path</span>
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          {/* Distance Table */}
          <div className="panel-section">
            <h3>Distance Table</h3>
            <table className="dist-table">
              <thead>
                <tr><th>Node</th><th>Distance</th><th>Prev</th></tr>
              </thead>
              <tbody>
                {INITIAL_NODES.map((n) => {
                  const d = currentStep ? currentStep.distances[n.id] : "–";
                  const p = result ? result.prev[n.id] ?? "–" : "–";
                  return (
                    <tr key={n.id}
                      className={currentStep?.current === n.id ? "row--active" : shortestPath.includes(n.id) && isDone ? "row--path" : ""}>
                      <td className="td-node">{n.id}</td>
                      <td>{d === Infinity ? "∞" : d === "–" ? "–" : d}</td>
                      <td>{isDone ? p : "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Step Log */}
          <div className="panel-section">
            <h3>Step Log</h3>
            <div className="step-log">
              {result ? result.steps.slice(0, stepIndex + 1).map((s, i) => (
                <div key={i} className={`log-entry ${i === stepIndex ? "log-entry--active" : ""}`}>
                  <span className="log-step">Step {i + 1}</span>
                  <span>Process <strong>{s.current}</strong>{s.relaxed.length > 0 ? `, relax → ${s.relaxed.join(", ")}` : ""}</span>
                </div>
              )) : <div className="log-empty">Run the algorithm to see steps.</div>}
            </div>
          </div>

          {/* Result */}
          {isDone && (
            <div className="result-box">
              <div className="result-title">✓ Shortest Path: {source} → {target}</div>
              <div className="result-path">{shortestPath.length > 1 ? shortestPath.join(" → ") : "No path found"}</div>
              <div className="result-cost">
                Total Cost: <strong>{result.dist[target] === Infinity ? "∞" : result.dist[target]}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Info */}
      <section className="algo-info">
        <h2>How It Works</h2>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-num">01</div>
            <h4>Initialize</h4>
            <p>Set source distance to 0 and all others to ∞. Push source into a min-priority queue.</p>
          </div>
          <div className="info-card">
            <div className="info-num">02</div>
            <h4>Extract Min</h4>
            <p>Pop the node with the smallest tentative distance from the priority queue.</p>
          </div>
          <div className="info-card">
            <div className="info-num">03</div>
            <h4>Relax Edges</h4>
            <p>For each neighbour, if current distance + edge weight is shorter, update and push to queue.</p>
          </div>
          <div className="info-card">
            <div className="info-num">04</div>
            <h4>Repeat</h4>
            <p>Continue until all nodes are visited. Backtrack via previous-node map to trace the path.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        Dijkstra's Algorithm · Design & Analysis of Algorithms · React Visualization
      </footer>
    </div>
  );
}
