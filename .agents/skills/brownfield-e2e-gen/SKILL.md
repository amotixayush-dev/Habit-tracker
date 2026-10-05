---
name: brownfield-e2e-gen
description: Automated end-to-end (E2E) test generation and verification flow for brownfield features. Generates tiered tests (Tier 1 deterministic, Tier 2 stateful, Tier 3 manual hints) with an auto-fix verification loop.
---

# Brownfield E2E Test Generation

Use this skill when asked to generate, verify, or auto-fix end-to-end (E2E) tests for existing (brownfield) features or pull requests.

## Workflow Overview

For detailed flow diagrams, token budgets, and confidence tiers, see [FLOW.md](./FLOW.md).

### Steps

1. **Understand Feature**: Clarify what user flow or API endpoint is being tested.
2. **Query Codebase Structure**: Inspect relevant files, existing test patterns, and dependency graph.
3. **Assign Confidence Tiers**:
   - **Tier 1 (≥80% confidence)**: Pure functions, deterministic HTTP endpoints. Full runnable tests.
   - **Tier 2 (60–79% confidence)**: Async flows, mocks, multi-step state. Runnable tests with auto-fix loop.
   - **Tier 3 (<60% confidence)**: Security, complex business logic, rate limiting. Manual review hints only.
4. **Generate & Auto-Fix**:
   - Generate test files (`test/e2e/<feature>-tier1.spec.ts`, `test/e2e/<feature>-tier2.spec.ts`).
   - Run tests. If failed, attempt auto-fix up to 3 times before downgrading to Tier 3 hints (`test/e2e/<feature>-hints.md`).
5. **Report & Confirmation**:
   - Write summary report to `.wednesday/e2e-reports/<feature>-<date>.md`.
   - Present summary to the user for review before committing or including in a PR.
