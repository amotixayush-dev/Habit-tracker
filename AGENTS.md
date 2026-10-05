# Habit Tracker — Agent Instructions & Available Skills

This repository uses Antigravity Agent Skills to support engineering workflows, code review, architectural boundary enforcement, and adversarial audits.

## Available Workspace Skills

All skills are registered under [`.agents/skills/`](file:///workspace/habit-tracker/.agents/skills):

| Skill Name | Description & Use Case | Directory |
| :--- | :--- | :--- |
| **`vibebreaker`** | 20-pass adversarial audit protocol for security, correctness, resilience, scale, and operability verification. | [`.agents/skills/vibebreaker`](file:///workspace/habit-tracker/.agents/skills/vibebreaker) |
| **`wednesday-git`** | Full Git lifecycle management: branch naming (`sprint`), atomic conventional commits (`git-os`), and PR creation (`pr-create`). | [`.agents/skills/wednesday-git`](file:///workspace/habit-tracker/.agents/skills/wednesday-git) |
| **`codebase-intel`** | Unified codebase intelligence. Answers structural, architectural, risk, and dependency questions (`brownfield-chat`, `brownfield-fix`). | [`.agents/skills/codebase-intel`](file:///workspace/habit-tracker/.agents/skills/codebase-intel) |
| **`standards-kit`** | Enforces code quality, complexity limits (<8), naming conventions, and approved UI components (`wednesday-dev`, `wednesday-design`). | [`.agents/skills/standards-kit`](file:///workspace/habit-tracker/.agents/skills/standards-kit) |
| **`deploy-checklist`** | Pre-deploy and post-deploy checklists verifying environment variables, migrations, CI, rollback plans, and smoke tests. | [`.agents/skills/deploy-checklist`](file:///workspace/habit-tracker/.agents/skills/deploy-checklist) |
| **`greenfield`** | Parallel persona planning for new features/projects (Research, Architect, PM, Security → `PLAN.md`). | [`.agents/skills/greenfield`](file:///workspace/habit-tracker/.agents/skills/greenfield) |
| **`pr-review`** | PR review comment triage, prioritization, and fix engine. | [`.agents/skills/pr-review`](file:///workspace/habit-tracker/.agents/skills/pr-review) |
| **`brownfield-drift`** | Verifies architectural boundaries defined in `PLAN.md` against imports and dependency graph. | [`.agents/skills/brownfield-drift`](file:///workspace/habit-tracker/.agents/skills/brownfield-drift) |
| **`brownfield-e2e-gen`**| Automated tiered E2E test generation with auto-fix verification loop. | [`.agents/skills/brownfield-e2e-gen`](file:///workspace/habit-tracker/.agents/skills/brownfield-e2e-gen) |
| **`module-audit-agent`**| Agent skill for health auditing, structural risk analysis, and test generation targets for specific modules. | [`.agents/skills/module-audit-agent`](file:///workspace/habit-tracker/.agents/skills/module-audit-agent) |
| **`onboard-dev-agent`** | Developer onboarding skill providing guided codebase walkthroughs and interactive architecture interviews. | [`.agents/skills/onboard-dev-agent`](file:///workspace/habit-tracker/.agents/skills/onboard-dev-agent) |
| **`pr-review-agent`**   | Full PR review orchestrator checking blast radius, architecture drift, and review comments. | [`.agents/skills/pr-review-agent`](file:///workspace/habit-tracker/.agents/skills/pr-review-agent) |

## VibeBreaker Audit Protocol

The protocol is initialized in [`.vibebreaker/`](file:///workspace/habit-tracker/.vibebreaker):
- **Core Protocol**: [`.vibebreaker/AUDIT_PROTOCOL.md`](file:///workspace/habit-tracker/.vibebreaker/AUDIT_PROTOCOL.md)
- **Pass Prompts**: [`.vibebreaker/prompts/`](file:///workspace/habit-tracker/.vibebreaker/prompts) (Passes 01 through 20)
- **Report Templates**: [`.vibebreaker/templates/final-report.md`](file:///workspace/habit-tracker/.vibebreaker/templates/final-report.md)
- **Audit Rule**: Audits are strictly read-only regarding codebase files; outputs are written to `.vibebreaker/FINAL_REPORT.md`. Pass 20 has sole authority to finalize candidate findings.
