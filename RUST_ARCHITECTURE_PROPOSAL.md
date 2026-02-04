# Rust Integration Architecture Proposal

## Quick Reference Guide

This document provides visual diagrams and quick decision points for the Rust integration research.

---

## Current vs Proposed Architecture

### CURRENT ARCHITECTURE (Limited by Python)

```
┌─────────────────────────────────────────────────┐
│              React Frontend                      │
│              (Port 5173)                         │
└────────────────────┬────────────────────────────┘
                     │
                     │ Upload CSV
                     ↓
┌─────────────────────────────────────────────────┐
│         Django Server (Port 8000)                │
│  ┌────────────────────────────────────────┐    │
│  │  views.py                               │    │
│  │  ┌──────────────────────────────────┐  │    │
│  │  │ pd.read_csv(file)                │  │    │ ← Loads entire file into memory
│  │  │   ↓                               │  │    │ ← Python/pandas limited by GIL
│  │  │ df (entire DataFrame in memory)  │  │    │ ← Memory bottleneck
│  │  │   ↓                               │  │    │
│  │  │ pyg.to_html(df)                  │  │    │ ← Generates huge HTML
│  │  └──────────────────────────────────┘  │    │
│  └────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘

❌ Problems:
- Cannot handle files > 500MB
- High memory usage
- Slow parsing
- No pagination
- Single-threaded
```

### PROPOSED ARCHITECTURE (Rust Microservice)

```
┌──────────────────────────────────────────────────────────────┐
│                   React Frontend                              │
│                   (Port 5173)                                 │
└───────────┬────────────────────────────┬─────────────────────┘
            │                            │
            │ Auth/Session               │ Large Data Processing
            ↓                            ↓
┌─────────────────────────┐   ┌───────────────────────────────┐
│   Django Server         │   │   Rust Data Service           │
│   (Port 8000)           │   │   (Port 8002)                 │
│                         │   │                               │
│  • Authentication       │   │  ┌─────────────────────────┐ │
│  • User Management      │   │  │ Streaming CSV Parser    │ │
│  • Small file handling  │   │  │  - Chunk processing     │ │
│  • Route/Proxy to Rust  │◄──┼──┤  - Parallel threads     │ │
│                         │   │  │  - Memory efficient     │ │
│                         │   │  └─────────────────────────┘ │
│                         │   │                               │
│                         │   │  ┌─────────────────────────┐ │
│                         │   │  │ Arrow/Polars Engine     │ │
│                         │   │  │  - Fast aggregations    │ │
│                         │   │  │  - Column operations    │ │
│                         │   │  └─────────────────────────┘ │
│                         │   │                               │
│                         │   │  ┌─────────────────────────┐ │
│                         │   │  │ Pagination & Caching    │ │
│                         │   │  │  - LRU cache            │ │
│                         │   │  │  - Lazy evaluation      │ │
│                         │   │  └─────────────────────────┘ │
└─────────────────────────┘   └───────────────────────────────┘

✅ Benefits:
- Handle files > 5GB
- 10x faster parsing
- 3x less memory
- Pagination support
- Parallel processing
```

---

## Data Flow Comparison

### Current Flow (Synchronous, Memory-Heavy)

```
User uploads CSV (500MB)
        ↓
Django receives file
        ↓
pandas.read_csv() - Loads ALL 500MB into RAM
        ↓
[WAIT 30-60 seconds] ← User sees spinner
        ↓
PyGWalker generates 50MB HTML
        ↓
Returns giant HTML to frontend
        ↓
Frontend renders iframe
        ↓
Done (but used 1.5GB RAM)
```

### Proposed Flow (Streaming, Memory-Efficient)

```
User uploads CSV (5GB)
        ↓
Django receives file
        ↓
Proxies to Rust service
        ↓
Rust: Stream parse (10K rows at a time)
  ├─> Parse chunk 1 (50MB RAM)
  ├─> Process & store in Arrow format
  ├─> Parse chunk 2 (50MB RAM) ← Reuses memory
  └─> Continue...
        ↓
[WAIT 10-15 seconds] ← Much faster
        ↓
Returns metadata + first page (1000 rows)
        ↓
Frontend renders table with pagination
        ↓
User requests next page → Rust returns instantly from cache
        ↓
Done (peak 300MB RAM)
```

---

## Integration Options Comparison

### Option 1: Microservice (RECOMMENDED) ⭐

```
Pros:
✅ Clean separation
✅ Independent scaling
✅ Easy to test/debug
✅ Can add features without touching Django
✅ Fault isolation

Cons:
⚠️ Network latency (negligible on localhost)
⚠️ Extra service to manage

Best for: Production use, team development
```

### Option 2: Python Extension

```
Pros:
✅ No network overhead
✅ Simpler deployment than separate service (ship wheels per platform/Python)
✅ Tight integration

Cons:
⚠️ Harder to debug
⚠️ Complex memory management
⚠️ Platform-specific builds

Best for: Embedded use, single-user apps
```

### Option 3: Hybrid

```
Use Extension for < 100MB files
Use Microservice for > 100MB files

Best for: Gradual migration
```

---

## Performance Expectations

### File Size Benchmarks (Estimated)

| File Size | Current (Python) | Proposed (Rust) | Improvement |
|-----------|------------------|-----------------|-------------|
| 10 MB     | 2 sec / 50 MB    | 0.3 sec / 30 MB | 6x faster   |
| 100 MB    | 20 sec / 400 MB  | 2 sec / 150 MB  | 10x faster  |
| 500 MB    | ❌ Fails / OOM   | 8 sec / 300 MB  | ✅ Works    |
| 1 GB      | ❌ Fails / OOM   | 15 sec / 500 MB | ✅ Works    |
| 5 GB      | ❌ Fails / OOM   | 60 sec / 800 MB | ✅ Works    |

*Parse time / Peak memory usage*

### Concurrent Users

| Metric           | Current | With Rust | Improvement |
|------------------|---------|-----------|-------------|
| Max users (50MB) | 2-3     | 20+       | 7-10x       |
| Response time    | 5-10s   | 0.5-1s    | 10x faster  |
| Memory per user  | 500MB   | 100MB     | 5x better   |

---

## Implementation Roadmap

### Phase 1: MVP (2-3 weeks)

```
Week 1: Setup & POC
├── Day 1-2: Rust project setup (Axum + Polars)
├── Day 3-4: CSV parsing endpoint
├── Day 5: Integration with Django
└── Deliverable: Can parse 1GB file

Week 2: Core Features
├── Day 1-2: Pagination API
├── Day 3: Caching layer
├── Day 4-5: Django proxy
└── Deliverable: End-to-end working

Week 3: Frontend + Polish
├── Day 1-3: React pagination UI
├── Day 4: Error handling
├── Day 5: Documentation
└── Deliverable: Production-ready MVP
```

### Phase 2: Optimization (1-2 weeks)

- Parallel processing
- Advanced caching
- Query optimization
- Monitoring/metrics

### Phase 3: Production (1 week)

- Load testing
- Security hardening
- Deployment automation
- Documentation

---

## Technology Stack

### Core Rust Dependencies

```toml
# Minimum viable stack
[dependencies]
axum = "0.7"                                      # Web framework
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }  # Async runtime
polars = "0.36"                                   # DataFrame processing
serde_json = "1.0"                                # JSON serialization
tower-http = "0.5"                                # CORS, logging middleware
```

### Why These?

- **Axum**: Fast, type-safe, easy to learn
- **Polars**: Fastest DataFrame library (faster than pandas)
- **Tokio**: Industry standard async runtime
- **Serde**: Best serialization library

---

## Risk Assessment

### Technical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Learning curve | Medium | Start with tutorials, pair programming |
| Integration bugs | Low | Good testing, feature flags |
| Deployment issues | Low | Docker, clear docs |
| Performance issues | Very Low | Rust is predictably fast |

### Business Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Development time | Medium | MVP approach, incremental |
| Maintenance burden | Low | Rust prevents many bugs |
| Team adoption | Medium | Training, documentation |

---

## Decision Matrix

### Should You Use Rust?

Answer these questions:

1. **Do you have files > 500MB?**
   - YES → Rust is worth it ✅
   - NO → Consider simpler optimizations first

2. **Do you need to scale?**
   - YES → Rust enables horizontal scaling ✅
   - NO → Still worth it for future-proofing

3. **Can you invest 2-3 weeks?**
   - YES → Go for it ✅
   - NO → Wait for better timing

4. **Do you have Rust experience?**
   - YES → Definitely do it ✅
   - NO → Worth learning, but adds time

5. **Is this a one-time need?**
   - NO → Excellent investment ✅
   - YES → Maybe overkill

**If you answered YES to 3+ questions: Proceed with Rust integration**

---

## Quick Start Commands

### Setup Rust Project

```bash
# Install Rust following official instructions:
# https://www.rust-lang.org/tools/install
#
# On Unix-like systems (recommended secure approach):
# 1. Download the installer
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o rustup-init.sh
# 2. Review the script (optional but recommended)
# less rustup-init.sh
# 3. Run the installer
sh rustup-init.sh
# 4. Clean up
rm rustup-init.sh
#
# Alternative: Use your package manager (e.g., apt, brew, pacman)

# Create project
cargo new data_processor --bin
cd data_processor

# Add dependencies
cargo add axum tokio --features tokio/macros,tokio/rt-multi-thread
cargo add polars serde serde_json tower-http
```

### Hello World API

```rust
use axum::{routing::get, Router};
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(|| async { "OK" }));
    
    let listener = TcpListener::bind("0.0.0.0:8002").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
```

### Test It

```bash
# Terminal 1: Run Rust service
cargo run

# Terminal 2: Test
curl http://localhost:8002/health
# Should return: OK
```

---

## Conclusion

**The Rust integration concept is SOUND and RECOMMENDED.**

### TL;DR

- ✅ Solves the core problem (large files)
- ✅ Proven architecture pattern
- ✅ Reasonable development effort
- ✅ Significant performance gains
- ✅ Future-proof investment

### Next Action

**If approved**: Start with a weekend proof-of-concept
1. Set up basic Rust HTTP service
2. Parse a 1GB CSV file
3. Measure time and memory
4. Compare to current Python implementation
5. Present results and decide

**Estimated effort**: 4-6 hours for POC

---

*Created: 2026-02-03*
*Companion to: RESEARCH_RUST_INTEGRATION.md*
