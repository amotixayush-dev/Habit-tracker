# Habit Tracker

A modern, intuitive habit tracking application designed to help build consistent routines, track daily progress, visualize streaks, and reach personal goals.

---

## ✨ Features

- **Daily & Weekly Tracking**: Mark habits complete with one click and monitor current progress.
- **Streak Counters & Momentum**: Stay motivated by tracking continuous completion streaks and milestone achievements.
- **Categorization & Tags**: Group habits by categories (Health, Productivity, Mindfulness, Fitness, Learning).
- **Flexible Scheduling**: Support for daily, weekly, or specific day-of-week routines.
- **Insights & Analytics**: Visual charts showing completion rates, weekly trends, and long-term consistency.
- **Agent-Ready Architecture**: Built-in development standards, adversarial audit protocols, and automated quality workflows.

---

## 🛠️ Project Structure

```text
habit-tracker/
├── .agents/skills/        # Antigravity agent skills (Git workflows, audit, standards)
├── .vibebreaker/          # 20-Pass adversarial security & resilience audit protocol
├── AGENTS.md              # Agent instructions, boundaries, and workflow reference
├── .commitlintrc.json     # Conventional commit linting configuration
└── README.md              # Project documentation
```

---

## 🤖 Integrated Agent Skills

This repository is equipped with Antigravity skills to ensure high code quality, security, and consistent architecture:

| Skill | Purpose |
| :--- | :--- |
| **`vibebreaker`** | 20-pass adversarial audit verifying security, error handling, race conditions, and scalability. |
| **`wednesday-git`** | Enforces conventional commits (`git-os`), sprint branch conventions, and clean PR workflows. |
| **`codebase-intel`** | Graph-driven codebase intelligence, blast radius calculation, and risk scoring. |
| **`standards-kit`** | Enforces complexity limits (<8), strict naming conventions, and UI component standards. |
| **`deploy-checklist`** | Pre-deployment and post-deployment verification for seamless releases. |
| **`brownfield-e2e-gen`**| Automated tiered E2E test generation and verification loop. |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/amotixayush-dev/Habit-tracker.git

# Navigate to project directory
cd Habit-tracker
```

---

## 📋 Development & Commit Guidelines

This project follows **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). Every commit is validated against [`.commitlintrc.json`](./.commitlintrc.json).

```bash
# Example commit format
git commit -m "feat(habits): add streak calculation logic"
```

---

## 🛡️ Auditing & Security

Run a VibeBreaker audit at any stage of development to stress-test the codebase:

```bash
# Verify audit protocol setup
npx vibebreaker doctor

# Run adversarial review
npx vibebreaker prompt
```

---

## 📄 License

This project is licensed under the MIT License.
