# 🏗️ Full-Stack Agentic System
**This repository demonstrates how to move beyond linear LLM chains into cyclic, non-linear agentic workflows on a cloud-native infrastructure.**

<p align="center">
<img width="900" height="700" alt="image" src="https://github.com/user-attachments/assets/b3da0412-2f2a-4825-b8ea-f9285945f3cf" />
</p>

# 🛠️ The Tech Stack & Architectural Logic

## UI | UX Client Layer
- **Next.js & Shadcn:**
  - High-performance React framework paired with Generative UI to render dynamic data structures directly from agent outputs.

- **Premium Chat UX:**
  - Production-ready features including autoscroll, chat resizing, loading and persistence to handle complex, long-running agentic sessions.

## AI Agent | Backend Orchestration

- **LangGraph:**
  - Used for cyclic/non-linear state control and fine-grained human-in-the-loop (HITL) management; moves logic beyond basic chain/linear into complex tool-routing.
  - Unlike chains, graphs allow for "wait-and-resume" states and routing to "dumb" tools (logic that doesn't require an LLM at all), saving tokens and latency. 

- **Groq Cloud LLMs:**
  - Ultra-fast LPU inference to minimize the "reasoning lag" during multi-node agentic loops.

- **Bun + Express (SSE):**
  - High-speed TypeScript runtime delivering Server-Sent Events for real-time streaming of the agent’s internal state transitions.

- Software devlopement Best practcies:
  - Using DI and clean architecture.

## Persistence & DB Layer
- **Turso DB (LibSQL):**
  - A DB-first approach using SQLite at the edge for ultra-low latency state hydration and global distribution.

- **Drizzle Micro-ORM:**
  - Type-safe schema management that ensures the interface between the agent and the database remains robust.

- **Isolated Environments:**
  - Strictly separated DB instances for Test and Production to ensure data integrity during CI/CD.

## Reliability & Quality Assurance: Test Suite
- **LLM-as-Judge Evals:**
  - Automated evaluation suite to grade non-deterministic agent outputs against a "Golden Dataset."

- **Vitest Integration Suite:**
  - TDD methodology applied to AI tools and Graph nodes to ensure deterministic code execution within the agentic loop.

- **Infrastructure Tests:**
  - Automated validation of DB schemas and connection resilience.

## DevOps | Cloud-Native IaC
- **Docker (Multi-stage) & GitHub Actions:**
  - Optimized, low-bloat, multi-stage builds.
  - Automated Image Packaging CI/CD distributed via GitHub Container Registry (GHCR.io).

- **Kubernetes & Helm:**
  - Backend services packaged as OCI Helm Charts for consistent deployment across Self hosted K3d/Minikube and production clusters.
  - Distributed via GitHub Container Registry (GHCR.io).

- **Gateway API (Traefik):**
  - Advanced North-South traffic management for API protection and sophisticated routing and comms via Traefik v3.

- **Vercel Integration:**
  - Automated CI/CD pipeline for the Next.js frontend, ensuring seamless edge deployments.

[![Build and Push Docker Image](https://github.com/VinZCodz/llm-generative-ui/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/VinZCodz/llm-generative-ui/actions/workflows/docker-publish.yml)

# 🙋 Why these choices?
- **GitHub Actions CI/CD:** Automating the image build-and-push cycle to GHCR.io ensures that the K8s cluster always pulls the latest "single source of truth."

- **Vercel for Frontend:** Decoupling the UI from the K8s backend allows the frontend to scale globally on the edge while the complex agentic logic stays contained in the cluster.

- **Clusters-on-Demand:** Solving the "it works on my machine" problem by providing standardized, containerized dev environments for Kubernetes.

# 🚀 Key Learning Objectives in this Repo

- **Non-Linear Orchestration:** How to use LangGraph to manage state in cycles rather than linear chains.

- **Streaming States:** Implementing SSE to bridge the gap between backend "thinking" and frontend "rendering."

- **Evaluations:** Moving beyond unit tests into AI grading (LLM-as-Judge) for quality control.

- **K8s for AI:** Packaging and scaling an AI backend using modern Cloud-Native standards (Helm/OCI).

# 📦 Open Source Ecosystem & Templates Contributions

Alongside this application, I have released several foundational templates that should help agentic development:

- [ai-agentic-chat-ui-vinzcodz](https://github.com/VinZCodz/ai-agentic-chat-ui-vinzcodz): A ready made UI template used for AI Agentic chats, built on NextJS client side framework. Plug your backend services to stream.
  
- [k3d-cluster-on-demand](https://github.com/VinZCodz/k3d-cluster-on-demand): A "one-click" GitHub Codespaces environment that spins up a 3-Node K3d cluster. Pre-configured with Traefik v3, Gateway API, Metrics Server, and Headlamp GUI.

- [minikube-cluster-on-demand](https://github.com/VinZCodz/minikube-cluster-on-demand): Instant Minikube environment on Codespaces. Perfect for testing Kubernetes-native AI backends with Gateway API and GUI dashboards pre-installed.

<Add Frontend chat windows>

<Add Graph State>

<Some description>
